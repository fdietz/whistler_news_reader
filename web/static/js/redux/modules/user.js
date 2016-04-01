import axios from "axios";
import { createAction } from "redux-actions";
import { push } from "react-router-redux";

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

        dispatch(createSignUp({ user: response.data.user }));

        dispatch(push("/today"));
      })
      .catch((response) => {
        dispatch(createSignUp(new Error(response.data.errors)));
      });
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
      .then((response) => {
        localStorage.setItem("phoenixAuthToken", response.data.jwt);

        dispatch(createSignIn({ user: response.data.user }));

        dispatch(push("/today"));
      })
      .catch((response) => {
        dispatch(createSignIn(new Error(response.data.errors)));
      });
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
      .catch((response) => {
        console.log("response ERROR", response.data);
      });
  };
}

export function requestSetCurrentUser() {
  return dispatch => {
    const authToken = localStorage.getItem("phoenixAuthToken");

    dispatch(setCurrentUser());

    axios.get("/api/current_user", { headers: { Authorization: authToken } })
      .then((response) => {
        dispatch(setCurrentUser({ user: response.data.user }));
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
  if (action.type === CREATE_SIGN_UP || action.type === CREATE_SIGN_IN) {
    if (action.error) {
      return Object.assign({}, state, {
        errors: action.payload.errors
      });
    } else if (action.payload && action.payload.user) {
      return Object.assign({}, state, {
        current: action.payload.user
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
  } else if (action.type === SET_CURRENT_USER) {
    if (action.error) {
      return Object.assign({}, state, {
        errors: action.payload.errors
      });
    } else if (action.payload && action.payload.user) {
      return Object.assign({}, state, {
        current: action.payload.user
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
  } else if (action.type === SIGN_OUT) {
    return Object.assign({}, initialState);
  }

  return state;
}
