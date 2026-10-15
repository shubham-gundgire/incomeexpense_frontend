import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import { field, stubLocation } from '../testUtils/render';
import { knownBug, clickAndCatch } from '../testUtils/knownBug';

const API = 'https://glacial-shelf-00875.herokuapp.com';
let nav;
beforeEach(() => {
  nav = stubLocation();
});
afterEach(() => nav.restore());

const type = (container, values) => {
  for (const [name, value] of Object.entries(values)) {
    fireEvent.change(field(container, name), { target: { value } });
  }
};

describe('Login', () => {
  const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  test.each([
    [{}, 'please enter email'],
    [{ email: 'not-an-email' }, 'please enter valid email address'],
    [{ email: 'asha@example.com' }, 'please enter password'],
    [{ email: 'asha@example.com', password: '12345' }, 'password must be contain 6 charchter'],
  ])('checks the form first: %j -> "%s"', (values, message) => {
    const { container } = render(<Login />);
    type(container, values);
    submit();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('signs in, keeps the token and goes to the dashboard', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'tok-1' } });
    const { container } = render(<Login />);
    type(container, { email: 'asha@example.com', password: 'secret1' });
    submit();

    await waitFor(() => expect(nav.location.href).toBe('/dashboard'));
    expect(axios.post).toHaveBeenCalledWith(`${API}/auth/login`, { email: 'asha@example.com', password: 'secret1' });
    expect(localStorage.getItem('token')).toBe('tok-1');
    expect(field(container, 'email').value).toBe('');
    expect(field(container, 'password').value).toBe('');
  });

  test('wrong credentials show "invalid email or password"', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { code: '502' } } });
    const { container } = render(<Login />);
    type(container, { email: 'asha@example.com', password: 'wrong-pass' });
    submit();

    expect(await screen.findByText('invalid email or password')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('other failures are only logged', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    const { container } = render(<Login />);
    type(container, { email: 'asha@example.com', password: 'secret1' });
    submit();

    await waitFor(() => expect(console.log).toHaveBeenCalledWith('error while registering', undefined));
    expect(container.querySelector('form').textContent).not.toMatch(/invalid/);
  });

  // FINDING: the email check (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/) rejects ordinary
  // addresses: dots or + before the @, hyphens or sub-domains after it (e.g. .co.in).
  knownBug('accepts common email addresses such as first.last@gmail.com and a@mail.co.in', () => {
    for (const email of ['first.last@gmail.com', 'asha@mail.co.in', 'a+b@example.com']) {
      const { container, unmount } = render(<Login />);
      type(container, { email, password: 'secret1' });
      submit();
      expect(screen.queryByText('please enter valid email address')).not.toBeInTheDocument();
      unmount();
    }
  });
});

describe('Signup', () => {
  const submitButton = () => screen.getByRole('button', { name: 'Create Account' });
  const valid = { name: 'Asha', email: 'asha@example.com', password: 'secret1', repassword: 'secret1' };
  const agree = (container) => fireEvent.click(field(container, 'check'));

  test.each([
    [{}, 'please enter name'],
    [{ name: 'Asha' }, 'please enter email'],
    [{ name: 'Asha', email: 'nope' }, 'please enter valid email address'],
    [{ name: 'Asha', email: 'asha@example.com' }, 'please enter password'],
    [{ name: 'Asha', email: 'asha@example.com', password: '123' }, 'password must be contain 6 charchter'],
    [{ name: 'Asha', email: 'asha@example.com', password: 'secret1' }, 'please renter password'],
    [{ ...valid, repassword: 'secret2' }, 'password does not match'],
    [valid, 'you are not agree to terms & condition'],
  ])('checks the form first: %j -> "%s"', (values, message) => {
    const { container } = render(<Signup />);
    type(container, values);
    fireEvent.click(submitButton());
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('creates the account, keeps the token and goes to the dashboard', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'new-token' } });
    const { container } = render(<Signup />);
    type(container, valid);
    agree(container);
    fireEvent.click(submitButton());

    await waitFor(() => expect(nav.location.href).toBe('/dashboard'));
    expect(axios.post).toHaveBeenCalledWith(`${API}/auth/register`, { name: 'Asha', email: 'asha@example.com', password: 'secret1' });
    expect(localStorage.getItem('token')).toBe('new-token');
    expect(field(container, 'check').checked).toBe(false);
    expect(field(container, 'name').value).toBe('');
  });

  test('an email that is already registered says so', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { code: '502' } } });
    const { container } = render(<Signup />);
    type(container, valid);
    agree(container);
    fireEvent.click(submitButton());
    expect(await screen.findByText('email already present')).toBeInTheDocument();
  });

  test('other API errors are only logged', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { code: '100' } } });
    const { container } = render(<Signup />);
    type(container, valid);
    agree(container);
    fireEvent.click(submitButton());
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('error while registering', { code: '100' }));
    expect(screen.queryByText('email already present')).not.toBeInTheDocument();
  });

  // FINDING: when the request fails without a response (offline, server down, CORS), the catch
  // reads e.response.data and throws: nothing is shown and the error goes unhandled.
  knownBug('a network failure is handled (no error escapes the form)', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    const { container } = render(<Signup />);
    type(container, valid);
    agree(container);
    expect(await clickAndCatch(submitButton())).toBeNull();
  });
});
