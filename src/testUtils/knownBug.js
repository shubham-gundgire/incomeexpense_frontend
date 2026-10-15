// Jest 27 (bundled with react-scripts 5) has no test.failing, so this provides the same contract:
//
//   knownBug('submitting X should show an error', () => { ...assert the CORRECT behaviour... });
//
// - While the bug exists the assertion fails, and this test passes.
// - Once the bug is fixed the assertion passes, and this test FAILS with a reminder to turn it
//   into a normal test.
// - SHOW_BUGS=1 runs it as an ordinary test so the real failure message is printed.
export function knownBug(name, fn) {
  if (process.env.SHOW_BUGS) {
    test(`BUG: ${name}`, fn);
    return;
  }
  test(`BUG: ${name}`, async () => {
    let reproduced = false;
    try {
      await fn();
    } catch (e) {
      reproduced = true;
    }
    if (!reproduced) {
      throw new Error('This known bug no longer reproduces. If it has been fixed, turn this into a normal test.');
    }
  });
}

// Some click handlers are async and reject after the click; React drops that promise, so the
// rejection would be unhandled. This calls the element's React onClick directly (inside act) and
// returns the rejection error, or null if the handler settled cleanly.
export async function clickAndCatch(element) {
  const { act } = require('react-dom/test-utils');
  const propsKey = Object.keys(element).find((k) => k.startsWith('__reactProps'));
  let error = null;
  await act(async () => {
    try {
      await element[propsKey].onClick({ preventDefault() {}, target: element, currentTarget: element });
    } catch (e) {
      error = e;
    }
  });
  return error;
}

// Runs fn and returns the errors jsdom reported as uncaught (e.g. thrown by an event listener),
// keeping them out of the test output.
export async function uncaughtErrorsDuring(fn) {
  const errors = [];
  const record = (e) => {
    errors.push(e.error);
    e.preventDefault();
  };
  window.addEventListener('error', record);
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await fn();
  } finally {
    window.removeEventListener('error', record);
    spy.mockRestore();
  }
  return errors;
}
