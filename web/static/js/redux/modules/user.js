import axios from "axios";
import { createAction } from "redux-actions";
import { push } from "react-router-redux";

import { transformErrorResponse } from "../../utils/APIHelper";

const CREATE_SIGN_UP = "CREATE_SIGN_UP";
const CREATE_SIGN_IN = "CREATE_SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SET_CURRENT_USER = "SET_CURRENT_USER";

export const createSignUp = createAction(CREATE_SIGN_UP);
export const createSignIn = createAction(CREATE_SIGN_IN);
export const signOut = createAction(SIGN_OUT);
export const setCurrentUser = createAction(SET_CURRENT_USER);

export function requestSignUp(data) {
  return dispatch => {
    dispatch(createSignUp());

    axios.post("/api/registrations", { user: data })
      .then((response) => {
        localStorage.setItem("phoenixAuthToken", response.data.jwt);

        dispatch(createSignUp(response.data));

        dispatch(push("/today"));
      })
      .catch(e => dispatch(createSignUp(transformErrorResponse(e))));
  };
}

export function requestSignIn(email, password) {
  return dispatch => {
    dispatch(createSignIn());
    const data = {
      email: email,
      password: password
    };

    axios.post("/api/sessions", { session: data })
      .then(response => {
        localStorage.setItem("phoenixAuthToken", response.data.jwt);

        dispatch(createSignIn({ current: response.data.user }));

        dispatch(push("/today"));
      })
      .catch(e => dispatch(createSignIn(transformErrorResponse(e))));
  };
}

export function requestSignOut() {
  return dispatch => {
    const authToken = localStorage.getItem("phoenixAuthToken");

    axios.delete("/api/sessions", { headers: { Authorization: authToken } })
      .then(() => {
        localStorage.removeItem("phoenixAuthToken");

        dispatch(signOut());

        dispatch(push("/sign_in"));
      })
      .catch(e => dispatch(signOut(transformErrorResponse(e))));
  };
}

export function requestSetCurrentUser() {
  return dispatch => {
    const authToken = localStorage.getItem("phoenixAuthToken");

    dispatch(setCurrentUser());

    axios.get("/api/current_user", { headers: { Authorization: authToken } })
      .then((response) => {
        if (!response.data.user) {
          dispatch(push("/sign_in"));
        } else {
          dispatch(setCurrentUser({ current: response.data.user }));
        }
      })
      .catch(() => {
        dispatch(push("/sign_in"));
      });
  };
}

const initialState = {
  current: null,
  errors: null,
  isLoading: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case CREATE_SIGN_UP:
  case CREATE_SIGN_IN:
  case SET_CURRENT_USER:
    if (!action.payload) return {...state, isLoading: true };
    return { ...state, ...action.payload, isLoading: false };
  case SIGN_OUT:
    return { ...initialState };
  default:
    return state;
  }
}
