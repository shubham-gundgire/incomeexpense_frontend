import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useOutletContext } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import axios from 'axios';
import Main from '../pages/Main';
import { stubLocation } from '../testUtils/render';
import { knownBug } from '../testUtils/knownBug';

const API = 'https://glacial-shelf-00875.herokuapp.com';
const account = {
  userdata: { name: 'Asha', email: 'asha@example.com' },
  getincome: [],
  getexpense: [],
};

// Exposes the getdata function Main hands to its pages.
let outlet;
function Probe() {
  outlet = useOutletContext();
  return <p>dashboard page</p>;
}

const renderMain = () =>
  render(
    <RecoilRoot>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Main />}>
            <Route path="/dashboard" element={<Probe />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  );

let nav;
beforeEach(() => {
  nav = stubLocation();
});
afterEach(() => nav.restore());

test('without a token it sends the visitor to the login page', () => {
  renderMain();
  expect(nav.location.href).toBe('/login');
  expect(axios.get).not.toHaveBeenCalled();
});

test('with a token it loads my data and shows my email in the top bar', async () => {
  localStorage.setItem('token', 'tok-1');
  axios.get.mockResolvedValue({ data: account });
  renderMain();

  expect(await screen.findByText('asha@example.com')).toBeInTheDocument();
  expect(screen.getByText('a')).toBeInTheDocument(); // the avatar letter
  expect(axios.get).toHaveBeenCalledWith(`${API}/private/getdata`, { headers: { Authorization: 'tok-1' } });
  expect(screen.getByText('dashboard page')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Income' })).toHaveAttribute('href', '/dashboard/income');

  // Pages call getdata to refresh after saving.
  await outlet.getdata();
  expect(axios.get).toHaveBeenCalledTimes(2);
});

test('a failed load is logged', async () => {
  localStorage.setItem('token', 'expired');
  axios.get.mockRejectedValue({ response: { data: { code: 888 } } });
  renderMain();
  await waitFor(() => expect(console.log).toHaveBeenCalledWith({ code: 888 }));
});

// FINDING: when loading fails (e.g. the 10-day token expired) the dashboard stays open, empty,
// with no message and no way back to the login page except logging out.
knownBug('a rejected token sends the visitor back to the login page', async () => {
  localStorage.setItem('token', 'expired');
  axios.get.mockRejectedValue({ response: { status: 403, data: { code: 888 } } });
  renderMain();
  await waitFor(() => expect(console.log).toHaveBeenCalledWith({ code: 888 }));
  expect(nav.location.href).toBe('/login');
});

describe('the sidebar', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'tok-1');
    axios.get.mockResolvedValue({ data: account });
  });

  test('links to every dashboard page', async () => {
    renderMain();
    await screen.findByText('asha@example.com');
    const links = ['Dashboard', 'Income', 'Expenses', 'Charts', 'Profile'].map((name) => screen.getByRole('link', { name }).getAttribute('href'));
    expect(links).toEqual(['/dashboard/', '/dashboard/income', '/dashboard/expense', '/dashboard/charts', '/dashboard/profile']);
  });

  test('log out forgets the token and goes to the home page', async () => {
    renderMain();
    await screen.findByText('asha@example.com');
    fireEvent.click(screen.getByRole('link', { name: 'Log out' }));
    expect(localStorage.getItem('token')).toBeNull();
    expect(nav.location.href).toBe('/');
  });

  test('choosing a page clears the slide-in position', async () => {
    const { container } = renderMain();
    await screen.findByText('asha@example.com');
    const sidebar = container.querySelector('ul').parentElement;
    sidebar.style.left = '0px';
    fireEvent.click(screen.getByRole('link', { name: 'Charts' }));
    expect(sidebar.style.left).toBe('');
  });
});

describe('the menu button (screens under 1200px)', () => {
  const menuButton = (container) => container.querySelector('header svg');

  beforeEach(() => {
    localStorage.setItem('token', 'tok-1');
    axios.get.mockResolvedValue({ data: account });
  });

  test('does nothing on wide screens', async () => {
    window.innerWidth = 1400;
    const { container } = renderMain();
    await screen.findByText('asha@example.com');
    fireEvent.click(menuButton(container));
    expect(container.querySelector('ul').parentElement.style.left).toBe('');
  });

  test('slides the sidebar in on narrow screens', async () => {
    window.innerWidth = 800;
    const { container } = renderMain();
    await screen.findByText('asha@example.com');
    fireEvent.click(menuButton(container));
    expect(container.querySelector('ul').parentElement.style.left).toBe('0px');
  });

  // FINDING: the "menu open" atom (ison) is never set, so the button can only open the sidebar;
  // pressing it again does not close it.
  knownBug('pressing the menu button again closes the sidebar', async () => {
    window.innerWidth = 800;
    const { container } = renderMain();
    await screen.findByText('asha@example.com');
    fireEvent.click(menuButton(container));
    fireEvent.click(menuButton(container));
    expect(container.querySelector('ul').parentElement.style.left).toBe('-350px');
  });
});
