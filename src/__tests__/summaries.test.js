import React from 'react';
import { screen, within } from '@testing-library/react';
import Homedash from '../components/nestedcomp/Homedash';
import Charts from '../components/nestedcomp/Charts';
import { renderDashboardPage, sampleDates } from '../testUtils/render';
import { knownBug } from '../testUtils/knownBug';

const d = sampleDates();
const account = {
  userdata: { name: 'Asha', email: 'asha@example.com' },
  getincome: [
    { _id: 'i1', category: 'Salary', amount: 1000, createdat: d.today },
    { _id: 'i2', category: 'Salary', amount: 200, createdat: d.otherDay },
    { _id: 'i3', category: 'Rental', amount: 30, createdat: d.otherMonth },
    { _id: 'i4', category: 'Awards', amount: 4, createdat: d.lastYear },
  ],
  getexpense: [
    { _id: 'e1', category: 'Food', amount: 50, createdat: d.otherDay },
    { _id: 'e2', category: 'Food', amount: 7, createdat: d.today },
    { _id: 'e3', category: 'Travel', amount: 300, createdat: d.lastYear },
  ],
};
const byDate = (entries) => [...entries].sort((a, b) => new Date(a.createdat) - new Date(b.createdat));
const charts = () => screen.getAllByTestId('chart').map((c) => ({
  type: c.dataset.type,
  title: c.dataset.title,
  series: JSON.parse(c.dataset.series),
  labels: JSON.parse(c.dataset.labels),
  categories: JSON.parse(c.dataset.categories),
}));

describe('the dashboard home', () => {
  const cards = () =>
    screen.getAllByText('₹', { exact: false, selector: 'h3' }).map((h3) => ({
      kind: h3.previousSibling.textContent,
      amount: h3.textContent,
      period: h3.nextSibling.textContent,
    }));

  test('welcomes me by name and totals income and expenses for today, this month and this year', () => {
    renderDashboardPage(<Homedash />, { data: account });

    expect(screen.getByText(/Welcome Asha/)).toBeInTheDocument();
    // otherMonth is always another month of this year; lastYear counts in no card.
    expect(cards().map(({ kind, amount }) => [kind, amount])).toEqual([
      ['Income', '₹1000'],
      ['Income', '₹1200'],
      ['Income', '₹1230'],
      ['Expenses', '₹7'],
      ['Expenses', '₹57'],
      ['Expenses', '₹57'],
    ]);
  });

  test('draws income and expense over time, oldest first', () => {
    renderDashboardPage(<Homedash />, { data: account });
    const [income, expense] = charts();

    expect(income).toMatchObject({ type: 'area', title: 'income chart' });
    expect(income.series).toEqual([{ name: 'amount', data: byDate(account.getincome).map((i) => i.amount) }]);
    expect(income.categories).toEqual(byDate(account.getincome).map((i) => new Date(i.createdat).getTime()));
    expect(expense.title).toBe('expense chart');
  });

  test('lists every entry, numbered, with its date', () => {
    renderDashboardPage(<Homedash />, { data: account });
    const [incomeTable, expenseTable] = screen.getAllByRole('table');
    const rows = within(incomeTable).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(4);
    expect(within(rows[0]).getAllByRole('cell').map((c) => c.textContent)[0]).toBe('Salary');
    expect(rows[0].textContent.startsWith('1')).toBe(true);
    expect(within(expenseTable).getAllByRole('row')).toHaveLength(4);
    const longDate = new Date(d.lastYear).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    expect(screen.getAllByText(longDate).length).toBeGreaterThan(0);
  });

  test('with no entries: zero totals, no charts, "No Data", and a generic welcome', () => {
    renderDashboardPage(<Homedash />, { data: { userdata: {}, getincome: [], getexpense: [] } });
    expect(screen.getByText(/Welcome User/)).toBeInTheDocument();
    expect(cards().every((c) => c.amount === '₹0')).toBe(true);
    expect(screen.queryByTestId('chart')).not.toBeInTheDocument();
    expect(screen.getAllByText('No Data')).toHaveLength(2);
  });

  test('renders before the data has loaded', () => {
    renderDashboardPage(<Homedash />, { data: null });
    expect(screen.getByText(/Welcome User/)).toBeInTheDocument();
  });

  // FINDING: the middle expense card shows this month's total but is labelled "This Year".
  knownBug('the middle expense card is labelled "This Month"', () => {
    renderDashboardPage(<Homedash />, { data: account });
    expect(cards()[4].period).toBe('This Month');
  });

  // FINDING: the expense table's "No Data" checks the income list, so with income but no
  // expenses the expense table is empty with no message (and vice versa).
  knownBug('the expense table says "No Data" when there are no expenses', () => {
    renderDashboardPage(<Homedash />, { data: { ...account, getexpense: [] } });
    expect(screen.getAllByText('No Data')).toHaveLength(1);
  });
});

describe('the Charts page', () => {
  test('pie charts total each category, and area charts show amounts over time', () => {
    renderDashboardPage(<Charts />, { data: account });
    const [pieIn, pieEx, areaIn, areaEx] = charts();

    expect(pieIn).toMatchObject({ type: 'pie', title: 'income by categoery', labels: ['Salary', 'Rental', 'Awards'], series: [1200, 30, 4] });
    expect(pieEx).toMatchObject({ type: 'pie', title: 'expense by categoery', labels: ['Food', 'Travel'], series: [57, 300] });
    expect(areaIn).toMatchObject({ type: 'area', title: 'income chart' });
    expect(areaEx.series[0].data).toEqual(byDate(account.getexpense).map((e) => e.amount));
  });

  test('a single entry gets a pie but no area chart, and no entries get nothing', () => {
    renderDashboardPage(<Charts />, { data: { getincome: [account.getincome[0]], getexpense: [] } });
    expect(charts().map((c) => c.type)).toEqual(['pie']);
  });

  test('renders before the data has loaded', () => {
    renderDashboardPage(<Charts />, { data: null });
    expect(screen.getByRole('heading', { name: 'Charts' })).toBeInTheDocument();
    expect(screen.queryByTestId('chart')).not.toBeInTheDocument();
  });
});
