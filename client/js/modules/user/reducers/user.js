import { CREATE_SIGN_UP, CREATE_SIGN_IN, SET_CURRENT_USER, SIGN_OUT } from '../actions';

const initialState = {
  current: null,
  errors: null,
  isLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SIGN_UP:
    case CREATE_SIGN_IN:
    case SET_CURRENT_USER:
      if (!action.payload) return { ...state, isLoading: true };
      return { ...state, ...action.payload, isLoading: false };
    case SIGN_OUT:
      return { ...initialState };
    default:
      return state;
  }
}
