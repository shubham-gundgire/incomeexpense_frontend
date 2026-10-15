# Testing

The tests use the app's own `react-scripts` Jest with React Testing Library, both already
dependencies, so no package or lockfile changes were needed. The added files are
`src/setupTests.js`, `src/__tests__/`, `src/__mocks__/` and `src/testUtils/`.

| Tests | Statements | Branches | Functions | Lines |
|------:|-----------:|---------:|----------:|------:|
|   100 |      99.6% |    93.2% |      100% | 99.6% |

(20 of the 100 are known bugs.)

```bash
npm ci
CI=true npx react-scripts test --watchAll=false
CI=true npx react-scripts test --watchAll=false --coverage --collectCoverageFrom='src/**/*.{js,jsx}' \
  --collectCoverageFrom='!src/setupTests.js' --collectCoverageFrom='!src/__tests__/**' \
  --collectCoverageFrom='!src/__mocks__/**' --collectCoverageFrom='!src/testUtils/**'
SHOW_BUGS=1 CI=true npx react-scripts test --watchAll=false   # known bugs as normal tests
```

The API (the old Heroku app) is never called: `src/__mocks__/axios.js` answers every request in
the tests. `react-apexcharts` is replaced with a stand-in that records each chart's type, series,
labels and dates. Navigation (`window.location.href = ...`) is captured, not performed.

Covered:
- the landing page (sections, menu, scroll shadow, contact form)
- login and sign-up (every validation message, success, API errors)
- the dashboard shell (login redirect, data load, top bar, sidebar, log out, mobile menu)
- the home summary cards, charts and tables
- the Charts page
- the income and expense forms
- the profile overview, edit and change-password tabs
- every route in `src/index.js`

## Known bugs

Each is a test of the correct behaviour that fails today, written with a `knownBug()` helper
(Jest 27, bundled with react-scripts 5, has no `test.failing`).

| Severity | Where | Bug |
|---|---|---|
| Medium | `pages/Login.jsx`, `pages/Signup.jsx` | The email check `/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/` rejects ordinary addresses, e.g. `first.last@gmail.com`, `asha@mail.co.in`, `a+b@example.com`. Those people cannot sign up or log in. |
| Medium | `pages/Main.jsx` | When loading fails (e.g. the 10-day token expired), the dashboard stays open and empty with no message and no redirect to login. |
| Medium | `Signup.jsx`, `Income.jsx`, `Expense.jsx`, `Profile.jsx` (edit) | A request that fails with no response (offline, server down) makes the `catch` read `e.response.data` and throw: nothing is shown and the error goes unhandled. |
| Medium | `Income.jsx`, `Expense.jsx` | An amount that was typed and then deleted passes the check, so an entry without an amount is sent. The API rejects it and the user is not told. Rejected entries in general are only logged to the console. |
| Low | `components/home/Navbar.jsx` | The scroll listener is added on every render and never removed: listeners pile up, and once the navbar is gone every scroll throws. |
| Low | `components/dashboard/Navbard.jsx` | The "menu open" state is never set, so the mobile menu button opens the sidebar but cannot close it. |
| Low | `nestedcomp/Homedash.jsx` | The middle expense card shows this month's total but is labelled "This Year". |
| Low | `Homedash.jsx`, `Expense.jsx` | The expense table's "No Data" checks the income list. |
| Low | `nestedcomp/Profile.jsx` | The profile card's name is hard-coded as "shubham gundgire"; the social icons link to the sites' home pages, not the saved profiles. A new password of any length is accepted (sign-up requires 6). |
| Low | `components/home/Maincontact.jsx` | The visitor is never told whether the message was sent. |

Also noted:
- `Navbar.jsx` nests an `<a>` inside an `<a>`, which React warns about.
- The form labels are not linked to their inputs.
- `Sidebar.jsx` sets Recoil state during render.
- `Main.jsx` keeps an unused `isunable` flag.
- Every request is hard-coded to `https://glacial-shelf-00875.herokuapp.com`. Heroku ended free dynos in November 2022, so unless that app moved to a paid plan, the API is offline. The URL should come from an environment variable.
