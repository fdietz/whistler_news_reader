import { OPML_IMPORT_FORM_UPDATE, OPML_IMPORT_FORM_RESET } from '../actions';

const initial = {
  file: null,
  isLoading: false,
  error: null,
};

export default function reducer(state = initial, action) {
  if (action.type === OPML_IMPORT_FORM_UPDATE) {
    if (!action.payload) return { ...state, isLoading: true };
    if (action.error) {
      return { ...state, error: action.payload.message, isLoading: false };
    }
    return { ...state, ...action.payload, isLoading: false };
  } else if (action.type === OPML_IMPORT_FORM_RESET) {
    return initial;
  }

  return state;
}
