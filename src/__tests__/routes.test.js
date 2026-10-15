import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom';

// src/index.js renders the whole app into #root with the real router; each test opens a path.
let root;
beforeEach(() => {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
});
afterEach(() => {
  ReactDOM.unmountComponentAtNode(root);
  root.remove();
});

const open = (path, setup = () => {}) => {
  window.history.pushState({}, '', path);
  jest.isolateModules(() => {
    // The isolated registry has its own axios mock; answer requests on that one.
    setup(require('axios'));
    act(() => {
      require('../index');
    });
  });
};

test('"/" is the landing page', () => {
  open('/');
  expect(screen.getByText('The #1 tool to manage your Income and expenses.')).toBeInTheDocument();
});

test('"/login" and "/signup" are the account forms', () => {
  open('/login');
  expect(screen.getByText('Login to Your Account')).toBeInTheDocument();
  ReactDOM.unmountComponentAtNode(root);
  open('/signup');
  expect(screen.getByText('Create an Account')).toBeInTheDocument();
});

test('the dashboard pages are nested under "/dashboard"', async () => {
  localStorage.setItem('token', 'tok-1');
  const account = { data: { userdata: { name: 'Asha', email: 'asha@example.com' }, getincome: [], getexpense: [] } };
  for (const [path, heading] of [
    ['/dashboard', 'Dashboard'],
    ['/dashboard/income', 'Income'],
    ['/dashboard/expense', 'Expenses'],
    ['/dashboard/charts', 'Charts'],
    ['/dashboard/profile', 'Profile'],
  ]) {
    open(path, (axios) => axios.get.mockResolvedValue(account));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument());
    ReactDOM.unmountComponentAtNode(root);
  }
});

test('any other path shows the error page', () => {
  open('/nowhere');
  expect(root.textContent).toBe('Error');
});
