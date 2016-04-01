import axios from "axios";

import AuthToken from "./AuthToken";

const instance = axios.create({
  headers: { Authorization: AuthToken.getToken() }
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error instanceof Error) {
    console.log("Error", error.message);
  }
  return Promise.reject(error);
});

export default instance;
