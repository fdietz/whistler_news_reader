import { createAction } from "redux-actions";

export const CATEGORY_FORM_UPDATE = "CATEGORY_FORM_UPDATE";
export const CATEGORY_FORM_RESET = "CATEGORY_FORM_RESET";

export const categoryFormUpdate = createAction(CATEGORY_FORM_UPDATE);
export const categoryFormReset  = createAction(CATEGORY_FORM_RESET);

const initial = {
  title: null,
  isLoading: false,
  error: null
};

export default function reducer(state = initial, action) {
  if (action.type === CATEGORY_FORM_UPDATE) {
    if (!action.payload) return {...state, isLoading: true };
    return { ...state, ...action.payload, isLoading: false };
  } else if (action.type === CATEGORY_FORM_RESET) {
    return initial;
  }

  return state;
}
