import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { userdata } from '../components/atoms';

/**
 * Renders a dashboard page the way Main does: inside the router, with the signed-in user's data
 * in the `userdata` atom and Main's `getdata` passed through the outlet context.
 */
export function renderDashboardPage(page, { data = null, getdata = jest.fn() } = {}) {
  const utils = render(
    <RecoilRoot initializeState={({ set }) => set(userdata, data)}>
      <MemoryRouter initialEntries={['/page']}>
        <Routes>
          <Route element={<Outlet context={{ getdata }} />}>
            <Route path="/page" element={page} />
          </Route>
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  );
  return { ...utils, getdata };
}

/** Renders a component that only needs Recoil (and optionally a router). */
export function renderWithState(ui, { data = null } = {}) {
  return render(
    <RecoilRoot initializeState={({ set }) => set(userdata, data)}>
      <MemoryRouter>{ui}</MemoryRouter>
    </RecoilRoot>
  );
}

/** A form field by its name attribute (the app's labels are not linked to their inputs). */
export const field = (container, name) => container.querySelector(`[name="${name}"]`);

/**
 * The app navigates with `window.location.href = ...`, which jsdom cannot do. This swaps in a
 * plain object for the test and returns it, so the destination can be checked.
 */
export function stubLocation() {
  const original = window.location;
  delete window.location;
  window.location = { href: 'http://localhost/', pathname: '/' };
  return {
    location: window.location,
    restore() {
      window.location = original;
    },
  };
}

/** Today's date, a day this month that is not today, and a date in an earlier year (ISO). */
export function sampleDates(now = new Date()) {
  const iso = (d) => d.toISOString();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const otherDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() === 1 ? 2 : 1, 12);
  const otherMonth = new Date(now.getFullYear(), now.getMonth() === 0 ? 1 : 0, 15, 12);
  const lastYear = new Date(now.getFullYear() - 1, 5, 15, 12);
  return { today: iso(today), otherDay: iso(otherDay), otherMonth: iso(otherMonth), lastYear: iso(lastYear) };
}
