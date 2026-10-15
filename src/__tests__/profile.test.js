import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Profile from '../components/nestedcomp/Profile';
import { renderDashboardPage, field } from '../testUtils/render';
import { knownBug, clickAndCatch } from '../testUtils/knownBug';

const API = 'https://glacial-shelf-00875.herokuapp.com';
const me = {
  userdata: {
    name: 'Asha Patil',
    email: 'asha@example.com',
    about: 'Saving for a bike',
    twitterpro: 'https://twitter.com/asha',
    facebookpro: 'https://facebook.com/asha',
    instapro: 'https://instagram.com/asha',
    linkedpro: 'https://linkedin.com/in/asha',
  },
  getincome: [],
  getexpense: [],
};
const tab = (name) => fireEvent.click(screen.getByRole('button', { name }));
const type = (container, values) => {
  for (const [name, value] of Object.entries(values)) fireEvent.change(field(container, name), { target: { value } });
};

describe('overview', () => {
  test('shows my details', () => {
    renderDashboardPage(<Profile />, { data: me });
    expect(screen.getByText('Saving for a bike')).toBeInTheDocument();
    expect(screen.getAllByText('Asha Patil').length).toBeGreaterThan(0);
    expect(screen.getAllByText('asha@example.com').length).toBe(1);
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  test('shows "No Data" for missing details', () => {
    renderDashboardPage(<Profile />, { data: { userdata: { email: 'x@example.com' } } });
    expect(screen.getAllByText('No Data')).toHaveLength(2);
  });

  test('renders before the data has loaded', () => {
    renderDashboardPage(<Profile />, { data: null });
    expect(screen.getAllByText('No Data')).toHaveLength(3);
  });

  // FINDING: the profile card's name is hard-coded as "shubham gundgire" for every user.
  knownBug('the profile card shows my name', () => {
    renderDashboardPage(<Profile />, { data: me });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Asha Patil');
  });

  // FINDING: the social icons always link to the sites' home pages, not to my saved profiles.
  knownBug('the social icons link to my profiles', () => {
    const { container } = renderDashboardPage(<Profile />, { data: me });
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('https://twitter.com/asha');
  });
});

describe('edit profile', () => {
  test('starts from my saved details and saves the changes', async () => {
    localStorage.setItem('token', 'tok-1');
    axios.post.mockResolvedValueOnce({ data: { msg: 'updated' } });
    const { container, getdata } = renderDashboardPage(<Profile />, { data: me });
    tab('Edit profile');
    expect(field(container, 'name').value).toBe('Asha Patil');
    expect(field(container, 'linkedpro').value).toBe('https://linkedin.com/in/asha');

    type(container, { about: 'Saving for a car' });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(getdata).toHaveBeenCalled());
    expect(axios.post).toHaveBeenCalledWith(
      `${API}/private/userdata`,
      { ...me.userdata, email: undefined, about: 'Saving for a car' },
      { headers: { Authorization: 'tok-1' } }
    );
    // Back on the overview.
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  test.each([
    ['name', 'please enter name'],
    ['about', 'please fill about field'], // the app's text has two spaces; matching collapses them
    ['twitterpro', 'please enter twitter link'],
    ['instapro', 'please enter instagram link'],
    ['linkedpro', 'please enter linkedin link'],
    ['facebookpro', 'please enter facebook link'],
  ])('requires %s', (name, message) => {
    const { container } = renderDashboardPage(<Profile />, { data: me });
    tab('Edit profile');
    type(container, { [name]: '' });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('a rejected update is only logged', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { code: '501' } } });
    const { getdata } = renderDashboardPage(<Profile />, { data: me });
    tab('Edit profile');
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('error password', { code: '501' }));
    expect(getdata).not.toHaveBeenCalled();
  });

  // FINDING: a failure without a response makes the catch read e.response.data and throw.
  knownBug('a network failure while saving is handled', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    renderDashboardPage(<Profile />, { data: me });
    tab('Edit profile');
    expect(await clickAndCatch(screen.getByRole('button', { name: 'Save changes' }))).toBeNull();
  });

  test('switching tabs keeps unsaved edits', () => {
    const { container } = renderDashboardPage(<Profile />, { data: me });
    tab('Edit profile');
    type(container, { about: 'draft' });
    tab('Overview');
    tab('Edit profile');
    expect(field(container, 'about').value).toBe('draft');
  });
});

describe('change password', () => {
  const change = () => fireEvent.click(screen.getByRole('button', { name: 'Change password' }));

  test.each([
    [{}, 'please enter current password'],
    [{ current_pass: 'old-pass' }, 'please enter password'],
    [{ current_pass: 'old-pass', password: 'new-pass' }, 'please re-enter password'],
    [{ current_pass: 'old-pass', password: 'new-pass', repassword: 'other' }, 'password doesnt match'],
  ])('checks the form first: %j -> "%s"', (values, message) => {
    const { container } = renderDashboardPage(<Profile />, { data: me });
    tab('Change Password');
    type(container, values);
    change();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('sends the current and new password, then returns to the overview', async () => {
    localStorage.setItem('token', 'tok-1');
    axios.post.mockResolvedValueOnce({ data: 'password reset' });
    const { container } = renderDashboardPage(<Profile />, { data: me });
    tab('Change Password');
    type(container, { current_pass: 'old-pass', password: 'new-pass', repassword: 'new-pass' });
    change();

    await waitFor(() => expect(screen.getByText('India')).toBeInTheDocument());
    expect(axios.post).toHaveBeenCalledWith(`${API}/private/resetpass`, { current_pass: 'old-pass', new_pass: 'new-pass' }, { headers: { Authorization: 'tok-1' } });
  });

  test('a wrong current password says so', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { code: '503' } } });
    const { container } = renderDashboardPage(<Profile />, { data: me });
    tab('Change Password');
    type(container, { current_pass: 'wrong', password: 'new-pass', repassword: 'new-pass' });
    change();
    expect(await screen.findByText('invalid current password')).toBeInTheDocument();
  });

  test('other failures are only logged', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    const { container } = renderDashboardPage(<Profile />, { data: me });
    tab('Change Password');
    type(container, { current_pass: 'a', password: 'b', repassword: 'b' });
    change();
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('error password', undefined));
    expect(screen.queryByText('invalid current password')).not.toBeInTheDocument();
  });

  // FINDING: sign-up requires 6 characters, but a new password of any length (even one) is
  // accepted here.
  knownBug('a new password needs at least 6 characters, as at sign-up', () => {
    const { container } = renderDashboardPage(<Profile />, { data: me });
    tab('Change Password');
    type(container, { current_pass: 'old-pass', password: 'a', repassword: 'a' });
    axios.post.mockResolvedValueOnce({ data: 'password reset' });
    change();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
