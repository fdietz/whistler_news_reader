import axios from '../../utils/APIHelper';
import { createAction } from 'redux-actions';

export const CATEGORY_FORM_UPDATE = 'CATEGORY_FORM_UPDATE';
export const CATEGORY_FORM_RESET = 'CATEGORY_FORM_RESET';

export const categoryFormUpdate = createAction(CATEGORY_FORM_UPDATE);
export const categoryFormReset = createAction(CATEGORY_FORM_RESET);

export function requestCreateCategory(attrs) {
  return (dispatch) => {
    dispatch(categoryFormUpdate());

    return axios.post('/api/categories', { category: attrs })
      .then(response => {
        dispatch(categoryFormReset());
        return response.data.category;
      })
      .catch(e => dispatch(categoryFormUpdate(e)));
  };
}

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
