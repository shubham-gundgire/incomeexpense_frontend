// Every request the app makes goes to the deployed Heroku API; tests answer them here instead.
const axios = {
  defaults: {},
  get: jest.fn(),
  post: jest.fn(),
};

module.exports = axios;
