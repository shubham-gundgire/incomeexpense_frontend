import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import Navbar from '../components/home/Navbar';
import Maincontact from '../components/home/Maincontact';
import { field } from '../testUtils/render';
import { knownBug } from '../testUtils/knownBug';

describe('the landing page', () => {
  test('shows every section with links to sign up', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The #1 tool to manage your Income and expenses.');
    expect(screen.getByText('Who we are')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByText(/All Rights/)).toHaveTextContent('© Copyright Income & Expense. All Rights Reserved');
    for (const title of ['Effective management', 'Categories your expenses', 'Its is FREE', 'Analyse Data']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
    const signups = screen.getAllByRole('link', { name: /sign up/i });
    expect(signups.map((a) => a.getAttribute('href'))).toEqual(['/signup', '/signup', './signup']);
  });
});

describe('the top navigation', () => {
  test('the menu button slides the menu in, and close slides it out', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');
    const [close, open] = container.querySelectorAll('svg');

    fireEvent.click(open);
    expect(nav.style.right).toBe('0px');
    fireEvent.click(close);
    expect(nav.style.right).toBe('-90%');
  });

  // FINDING: the scroll listener is added in the component body, so every render adds another
  // one (and none is ever removed).
  knownBug('re-rendering does not pile up scroll listeners', () => {
    const add = jest.spyOn(window, 'addEventListener');
    const { rerender } = render(<Navbar />);
    rerender(<Navbar />);
    rerender(<Navbar />);
    expect(add.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(1);
  });
});

describe('the contact form', () => {
  const fill = (container, values) => {
    for (const [name, value] of Object.entries(values)) {
      fireEvent.change(field(container, name), { target: { value } });
    }
  };
  const message = { name: 'Ravi', email: 'ravi@example.com', subject: 'Hello', msg: 'Nice app' };

  test('asks for every field before sending', () => {
    const { container } = render(<Maincontact />);
    fill(container, { name: 'Ravi', email: 'ravi@example.com', subject: 'Hello' });
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));

    expect(screen.getByText('please fill all details')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('sends the message to the API and clears the form', async () => {
    axios.post.mockResolvedValueOnce({ data: { msg: 'message sent succesfully' } });
    const { container } = render(<Maincontact />);
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    expect(screen.getByText('please fill all details')).toBeInTheDocument();

    fill(container, message);
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));

    await waitFor(() => expect(field(container, 'msg').value).toBe(''));
    expect(axios.post).toHaveBeenCalledWith('https://glacial-shelf-00875.herokuapp.com/public/contact', message);
    expect(screen.queryByText('please fill all details')).not.toBeInTheDocument();
    for (const name of ['name', 'email', 'subject']) expect(field(container, name).value).toBe('');
    expect(console.log).toHaveBeenCalledWith('message sent succesfully');
  });

  test('a failed send is only logged, and the form is still cleared', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500 } });
    const { container } = render(<Maincontact />);
    fill(container, message);
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));

    await waitFor(() => expect(field(container, 'name').value).toBe(''));
    expect(console.log).toHaveBeenCalledWith('error', { status: 500 });
  });

  // FINDING: the visitor is never told whether the message was sent: success and failure look
  // the same (the form just clears).
  knownBug('tells the visitor when the message could not be sent', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500 } });
    const { container } = render(<Maincontact />);
    fill(container, message);
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    await waitFor(() => expect(field(container, 'name').value).toBe(''));
    expect(screen.getByText(/could not|failed|try again/i)).toBeInTheDocument();
  });
});
