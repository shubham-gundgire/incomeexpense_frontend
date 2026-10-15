import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Navbar from '../components/home/Navbar';
import { knownBug, uncaughtErrorsDuring } from '../testUtils/knownBug';

// Kept in its own file: the navbar's scroll listeners outlive it (see below), so listeners left
// by other tests would run here too.

test('the header gets a shadow once the page scrolls', () => {
  const { container, unmount } = render(<Navbar />);
  const header = container.querySelector('header');

  window.scrollY = 100;
  fireEvent.scroll(window);
  expect(header.style.boxShadow).toBe('0px 2px 20px rgb(1 41 112 / 20%)');

  window.scrollY = 0;
  fireEvent.scroll(window);
  expect(header.style.boxShadow).toBe('none');
  unmount();
});

// FINDING: the listener is never removed, so once the navbar is gone every scroll throws
// "Cannot read properties of null (reading 'style')".
knownBug('scrolling after the navbar has gone does not throw', async () => {
  const errors = await uncaughtErrorsDuring(() => {
    window.scrollY = 50;
    fireEvent.scroll(window);
  });
  expect(errors).toEqual([]);
});
