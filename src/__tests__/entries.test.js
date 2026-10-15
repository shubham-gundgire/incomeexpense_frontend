import React from 'react';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import Income from '../components/nestedcomp/Income';
import Expense from '../components/nestedcomp/Expense';
import { renderDashboardPage, field } from '../testUtils/render';
import { knownBug, clickAndCatch } from '../testUtils/knownBug';

const API = 'https://glacial-shelf-00875.herokuapp.com';

// Income and Expense are the same page with different categories and endpoints.
const pages = [
  { name: 'Income', Page: Income, path: '/private/income', button: 'Add income', category: 'Salary', list: 'getincome', title: 'All income' },
  { name: 'Expense', Page: Expense, path: '/private/expense', button: 'Add expenses', category: 'Food', list: 'getexpense', title: 'All Expenses' },
];

describe.each(pages)('the $name page', ({ Page, path, button, category, list, title }) => {
  const entry = { category, amount: '250', subject: 'October', description: 'Monthly', createdat: '2022-04-01' };
  const fill = (container, values) => {
    for (const [name, value] of Object.entries(values)) {
      fireEvent.change(field(container, name), { target: { value } });
    }
  };
  const add = () => fireEvent.click(screen.getByRole('button', { name: button }));

  test.each([
    [{}, 'please select categoery'],
    [{ category }, 'please enter amount'],
    [{ category, amount: '5' }, 'please enter subject'],
    [{ category, amount: '5', subject: 's' }, 'please enter description'],
    [{ category, amount: '5', subject: 's', description: 'd' }, 'please enter date'],
  ])('checks the form first: %j -> "%s"', (values, message) => {
    const { container } = renderDashboardPage(<Page />);
    fill(container, values);
    add();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('saves the entry with my token, clears the form and refreshes my data', async () => {
    localStorage.setItem('token', 'tok-1');
    axios.post.mockResolvedValueOnce({ data: { msg: 'expenses added' } });
    const { container, getdata } = renderDashboardPage(<Page />);
    fill(container, entry);
    add();

    await waitFor(() => expect(getdata).toHaveBeenCalled());
    expect(axios.post).toHaveBeenCalledWith(`${API}${path}`, entry, { headers: { Authorization: 'tok-1' } });
    for (const name of ['amount', 'subject', 'description', 'createdat']) expect(field(container, name).value).toBe('');
  });

  test('a rejected entry is only logged', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { code: '501' } } });
    const { container, getdata } = renderDashboardPage(<Page />);
    fill(container, entry);
    add();
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('error while expenses', { code: '501' }));
    expect(getdata).not.toHaveBeenCalled();
    expect(field(container, 'subject').value).toBe('October');
  });

  test('lists my entries, or "No Data"', () => {
    const data = { getincome: [], getexpense: [], [list]: [{ _id: '1', category, amount: 99, createdat: '2022-04-01T00:00:00.000Z' }] };
    renderDashboardPage(<Page />, { data });
    const table = screen.getByRole('table');
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(within(table).getAllByRole('row')[1].textContent).toContain('99');
  });

  // FINDING: once an amount has been typed and deleted, the amount is "" and the check
  // `amount != null || amount.length != 0` passes, so an entry without an amount is sent (the
  // API rejects it and the user is not told).
  knownBug('an amount that was typed and deleted is still required', () => {
    axios.post.mockResolvedValue({ data: {} });
    const { container } = renderDashboardPage(<Page />);
    fill(container, { ...entry, amount: '5' });
    fill(container, { amount: '' });
    add();
    expect(axios.post).not.toHaveBeenCalled();
  });

  // FINDING: a request that fails without a response (offline, server down) makes the catch
  // read e.response.data and throw, so the error escapes unhandled and nothing is shown.
  knownBug('a network failure is handled', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    const { container } = renderDashboardPage(<Page />);
    fill(container, entry);
    expect(await clickAndCatch(screen.getByRole('button', { name: button }))).toBeNull();
  });

  // FINDING: the user is never told an entry was rejected; only the console hears about it.
  knownBug('tells the user when an entry is rejected', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { code: '501' } } });
    const { container } = renderDashboardPage(<Page />);
    fill(container, entry);
    add();
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('error while expenses', { code: '501' }));
    expect(screen.getByText(/could not|failed|try again|please/i)).toBeInTheDocument();
  });
});

test('Income shows "No Data" with no income', () => {
  renderDashboardPage(<Income />, { data: { getincome: [], getexpense: [] } });
  expect(screen.getByText('No Data')).toBeInTheDocument();
});

// FINDING: the Expense page's "No Data" checks the income list.
knownBug('the Expense page shows "No Data" when there are no expenses', () => {
  renderDashboardPage(<Expense />, { data: { getincome: [{ _id: '1', category: 'Salary', amount: 1, createdat: '2022-04-01' }], getexpense: [] } });
  expect(screen.getByText('No Data')).toBeInTheDocument();
});
