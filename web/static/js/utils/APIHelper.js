import axios from "axios";

import AuthToken from "./AuthToken";

const instance = axios.create({
  headers: { Authorization: AuthToken.getToken() }
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (response) {
  if (response instanceof Error) {
    console.error("Error", response.message, response.stack);
    return Promise.reject(response);
  }

  const error = new Error(`${response.statusText} - Status Code: ${response.status}`);
  error.response = response;
  error.payload = response.data;
  return Promise.reject(error);
});

export default instance;
