import { createAction } from "redux-actions";

export const EDIT_FORM_UPDATE = "EDIT_FORM_UPDATE";
export const EDIT_FORM_RESET = "EDIT_FORM_RESET";

export const editFormUpdate = createAction(EDIT_FORM_UPDATE);
export const editFormReset  = createAction(EDIT_FORM_RESET);

const initial = {
  title: null,
  isLoading: false
};

// categoryForm = {
//   title: null,
//   isLoading: false,
//   error: reason
// }
export default function reducer(state = initial, action) {
  if (action.type === EDIT_FORM_UPDATE) {
    if (action.payload && action.payload.errors) {
      return Object.assign({}, state, {
        errors: action.payload.errors
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        title: action.payload.title
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
  } else if (action.type === EDIT_FORM_RESET) {
    return Object.assign({}, initial);
  }

  return state;
}
