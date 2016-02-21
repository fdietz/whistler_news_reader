import axios from "axios";
import { createAction } from "redux-actions";
import { routeActions } from "react-router-redux";

const CREATE_SIGN_UP = "CREATE_SIGN_UP";
const CREATE_SIGN_IN = "CREATE_SIGN_IN";
const SET_CURRENT_USER = "SET_CURRENT_USER";

export const createSignUp = createAction(CREATE_SIGN_UP);
export const createSignIn = createAction(CREATE_SIGN_IN);
export const setCurrentUser = createAction(SET_CURRENT_USER);

export function requestSignUp(data) {
  return dispatch => {
    dispatch(createSignUp());

    axios.post("/api/registrations", { user: data })
      .then((response) => {
        console.log("response SUCCESS", response.data);

        localStorage.setItem("phoenixAuthToken", response.data.jwt);

        dispatch(createSignUp({ user: response.data.user }));

        dispatch(routeActions.push("/"));
      })
      .catch((response) => {
        console.log("response ERROR", response.data)
        dispatch(createSignUp(new Error(response.data.errors)));
      });
  };
}

export function requestSignIn(email, password) {
  return dispatch => {
    dispatch(createSignIn());
    const data = {
      session: {
        email: email,
        password: password
      }
    };

    axios.post("/api/sessions", { session: data })
      .then((response) => {
        console.log("response SUCCESS", response.data);

        localStorage.setItem("phoenixAuthToken", response.data.jwt);

        dispatch(createSignIn({ user: response.data.user }));

        dispatch(routeActions.push("/"));
      })
      .catch((response) => {
        console.log("response ERROR", response.data)
        dispatch(createSignIn(new Error(response.data.errors)));
      });
  };
}

export function requestSetCurrentUser() {
  console.log("requestSetCurrentUser 0")

  return dispatch => {
    dispatch(createSetCurrentUser());
    console.log("requestSetCurrentUser")

    axios.get("/api/current_user")
      .then((response) => {
        console.log("response SUCCESS", response.data);

        dispatch(createSetCurrentUser({ user: response.data.user }));
      })
      .catch((response) => {
        console.log("response ERROR", response.data)
        dispatch(routeActions.push("/sign_in"));
      });
  };
}

const initialState = {
  current: null,
  errors: null,
  isLoading: false
};

export default function reducer(state = initialState, action) {
  console.log("user reducer", state, action)

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
  }

  return state;
}
