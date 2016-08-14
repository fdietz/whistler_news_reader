import { CATEGORY_FORM_UPDATE, CATEGORY_FORM_RESET } from '../actions';

const initial = {
  title: '',
  isLoading: false,
  errors: null,
};

export default function reducer(state = initial, action) {
  if (action.type === CATEGORY_FORM_UPDATE) {
    if (!action.payload) return { ...state, isLoading: true };
    return { ...state, ...action.payload, isLoading: false };
  } else if (action.type === CATEGORY_FORM_RESET) {
    return initial;
  }

  return state;
}
