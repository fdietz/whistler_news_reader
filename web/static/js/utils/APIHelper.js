import axios from "axios";

import AuthToken from "./AuthToken";

const instance = axios.create({
  headers: { Authorization: AuthToken.getToken() }
});

export default instance;
