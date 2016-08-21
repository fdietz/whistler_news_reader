import { createAction } from 'redux-actions';
import axios from '../../../utils/APIHelper';
import normalize from '../../../utils/normalize';

export const ADD_CATEGORY = 'ADD_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';

export const addCategory = createAction(ADD_CATEGORY);
export const updateCategory = createAction(UPDATE_CATEGORY);
export const removeCategory = createAction(REMOVE_CATEGORY);
export const fetchCategories = createAction(FETCH_CATEGORIES);

export function requestUpdateCategory(id, attrs) {
  return dispatch => {
    dispatch(updateCategory());
    return axios.put(`/api/categories/${id}`, { category: attrs })
      .then(() => dispatch(updateCategory({ id, ...attrs })))
      .catch(e => dispatch(updateCategory(e)));
  };
}

export function requestRemoveCategory(id) {
  return dispatch => {
    dispatch(removeCategory());
    return axios.delete(`/api/categories/${id}`)
      .then(() => dispatch(removeCategory({ id })))
      .catch((e) => dispatch(removeCategory(e)));
  };
}

export function requestFetchCategories() {
  return dispatch => {
    dispatch(fetchCategories());
    return axios.get('/api/categories')
      .then(resp => dispatch(fetchCategories(normalize(resp.data.categories))))
      .catch((e) => dispatch(fetchCategories(e)));
  };
}
