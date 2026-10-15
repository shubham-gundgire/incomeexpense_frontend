// Loaded automatically by react-scripts before every test file.
import '@testing-library/jest-dom';

// The app logs freely (form state, responses); keep test output readable.
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});
