import { createAction } from "redux-actions";

export const CATEGORY_FORM_UPDATE = "CATEGORY_FORM_UPDATE";
export const CATEGORY_FORM_RESET = "CATEGORY_FORM_RESET";

export const categoryFormUpdate = createAction(CATEGORY_FORM_UPDATE);
export const categoryFormReset  = createAction(CATEGORY_FORM_RESET);

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
  if (action.type === CATEGORY_FORM_UPDATE) {
    if (action.payload.errors) {
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
  } else if (action.type === CATEGORY_FORM_RESET) {
    return Object.assign({}, initial);
  }

  return state;
}
