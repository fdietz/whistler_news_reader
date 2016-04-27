import axios from "axios";

import AuthToken from "./AuthToken";

export function transformErrorResponse(response) {
  const error = new Error(`${response.statusText} - Status Code: ${response.status}`);
  error.response = response;

  if (response.data.errors) {
    // form validation error
    error.errors = response.data.errors;
  } else {
    // not specific field errors on object
    error.errors = [{ base: response.data }];
  }

  return error;
}

function handleError(response) {
  if (response instanceof Error) {
    /*eslint no-console:0 */
    console.error("Error", response.message, response.stack);
    return Promise.reject(response);
  }

  return Promise.reject(transformErrorResponse(response));
}

const instance = axios.create();

instance.interceptors.request.use(function(config) {
  const token = AuthToken.getToken();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (response) {
  return handleError(response);
});

export default instance;
