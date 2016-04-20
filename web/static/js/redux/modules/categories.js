import axios from "../../utils/APIHelper";
import { combineReducers } from "redux";
import normalize from "../../utils/normalize";
import { createAction } from "redux-actions";

export const ADD_CATEGORY = "ADD_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const REMOVE_CATEGORY = "REMOVE_CATEGORY";
export const FETCH_CATEGORIES = "FETCH_CATEGORIES";

export const addCategory      = createAction(ADD_CATEGORY);
export const updateCategory   = createAction(UPDATE_CATEGORY);
export const removeCategory   = createAction(REMOVE_CATEGORY);
export const fetchCategories  = createAction(FETCH_CATEGORIES);

export function requestUpdateCategory(id, attrs) {
  return dispatch => {
    dispatch(updateCategory());
    return axios.put(`/api/categories/${id}`, { category: attrs })
      .then(() => dispatch(updateCategory({ id: id, ...attrs })))
      .catch(e => dispatch(updateCategory(e)));
  };
}

export function requestRemoveCategory(id) {
  return dispatch => {
    dispatch(removeCategory());
    return axios.delete(`/api/categories/${id}`)
      .then(() => dispatch(removeCategory({ id: id })))
      .catch((e) => dispatch(removeCategory(e)));
  };
}

export function requestFetchCategories() {
  return dispatch => {
    dispatch(fetchCategories());
    return axios.get("/api/categories")
      .then(resp => dispatch(fetchCategories(normalize(resp.data.categories))))
      .catch((e) => dispatch(fetchCategories(e)));
  };
}

const initialById = {};
const initialListedIds  = [];
const initialIsLoading = false;
const initialError = null;

function isLoading(state = initialIsLoading, action) {
  switch (action.type) {
  case ADD_CATEGORY:
  case UPDATE_CATEGORY:
  case REMOVE_CATEGORY:
  case FETCH_CATEGORIES:
    return !action.payload ? true : false;
  default:
    return state;
  }
}

function error(state = initialError, action) {
  switch (action.type) {
  case ADD_CATEGORY:
  case UPDATE_CATEGORY:
  case REMOVE_CATEGORY:
  case FETCH_CATEGORIES:
    return action.error ? action.payload : state;
  default:
    return state;
  }
}

function category(state, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case ADD_CATEGORY:
    return action.payload;
  case UPDATE_CATEGORY:
    return { ...state, ...action.payload };
  default:
    return state;
  }
}

function listedIds(state = initialListedIds, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case ADD_CATEGORY:
    return [...state, action.payload.id];
  case FETCH_CATEGORIES:
    return action.payload.ids;
  case REMOVE_CATEGORY:
    return state.filter(id => id !== action.payload.id);
  default:
    return state;
  }
}

function byId(state = initialById, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case ADD_CATEGORY:
  case UPDATE_CATEGORY:
    return { ...state, [action.payload.id]: category(state[action.payload.id], action) };
  case REMOVE_CATEGORY:
    return Object.keys(state).reduce((nextState, id) => {
      /*eslint eqeqeq: 0*/
      if (id != action.payload.id) {
        nextState[id] = { ...state[id] };
      }
      return nextState;
    }, {});
  case FETCH_CATEGORIES:
    return action.payload.entities;
  default:
    return state;
  }
}

export default combineReducers({ byId, listedIds, isLoading, error });
