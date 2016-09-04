import { createAction } from 'redux-actions';
import axios from 'axios';
import { push } from 'react-router-redux';

import { transformErrorResponse } from '../../../utils/APIHelper';

export const CREATE_SIGN_UP = 'CREATE_SIGN_UP';
export const CREATE_SIGN_IN = 'CREATE_SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const createSignUp = createAction(CREATE_SIGN_UP);
export const createSignIn = createAction(CREATE_SIGN_IN);
export const signOut = createAction(SIGN_OUT);
export const setCurrentUser = createAction(SET_CURRENT_USER);

export function requestSignUp(data) {
  return dispatch => {
    dispatch(createSignUp());

    axios.post('/api/registrations', { user: data })
      .then((response) => {
        localStorage.setItem('phoenixAuthToken', response.data.jwt);

        dispatch(createSignUp(response.data));

        dispatch(push('/today'));
      }, e => dispatch(createSignUp(transformErrorResponse(e))));
  };
}

export function requestSignIn(email, password) {
  return dispatch => {
    dispatch(createSignIn());
    const data = { email, password };

    axios.post('/api/sessions', { session: data })
      .then(response => {
        localStorage.setItem('phoenixAuthToken', response.data.jwt);

        dispatch(createSignIn({ current: response.data.user }));

        dispatch(push('/today'));
      }, e => {
        dispatch(createSignIn(transformErrorResponse(e)));
      }
    );
  };
}

export function requestSignOut() {
  return dispatch => {
    const authToken = localStorage.getItem('phoenixAuthToken');

    axios.delete('/api/sessions', { headers: { Authorization: authToken } })
      .then(() => {
        localStorage.removeItem('phoenixAuthToken');

        dispatch(signOut());

        dispatch(push('/sign_in'));
      }, e => dispatch(signOut(transformErrorResponse(e))));
  };
}

export function requestSetCurrentUser() {
  return dispatch => {
    const authToken = localStorage.getItem('phoenixAuthToken');

    dispatch(setCurrentUser());

    axios.get('/api/current_user', { headers: { Authorization: authToken } })
      .then((response) => {
        if (!response.data.user) {
          dispatch(push('/sign_in'));
        } else {
          dispatch(setCurrentUser({ current: response.data.user }));
        }
      }, () => {
        dispatch(push('/sign_in'));
      });
  };
}
