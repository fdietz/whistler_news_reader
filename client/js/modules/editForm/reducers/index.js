import { EDIT_FORM_UPDATE, EDIT_FORM_RESET, } from '../actions';

const initial = {
  title: null,
  isLoading: false,
  error: null,
};

export default function reducer(state = initial, action) {
  if (action.type === EDIT_FORM_UPDATE) {
    if (!action.payload) return { ...state, isLoading: true };
    return { ...state, ...action.payload, isLoading: false };
  } else if (action.type === EDIT_FORM_RESET) {
    return initial;
  }

  return state;
}
