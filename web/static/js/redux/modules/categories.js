import axios from "../../utils/APIHelper";
import { combineReducers } from "redux";
import { arrayToIds, arrayToObjMap } from "../../utils/normalize";
import { createAction } from "redux-actions";

export const ADD_CATEGORY = "ADD_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const REMOVE_CATEGORY = "REMOVE_CATEGORY";
export const FETCH_CATEGORIES = "FETCH_CATEGORIES";
export const TOGGLE_EXPAND_CATEGORY = "TOGGLE_EXPAND_CATEGORY";

export const addCategory      = createAction(ADD_CATEGORY);
export const updateCategory   = createAction(UPDATE_CATEGORY);
export const removeCategory   = createAction(REMOVE_CATEGORY);
export const fetchCategories  = createAction(FETCH_CATEGORIES);
export const toggleExpandCategory = createAction(TOGGLE_EXPAND_CATEGORY);

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
      .then(resop => dispatch(fetchCategories(resop.data.categories)))
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
  case TOGGLE_EXPAND_CATEGORY:
  case FETCH_CATEGORIES:
    return !action.payload ? true : initialIsLoading;
  default:
    return state;
  }
}

function error(state = initialError, action) {
  switch (action.type) {
  case ADD_CATEGORY:
  case UPDATE_CATEGORY:
  case REMOVE_CATEGORY:
  case TOGGLE_EXPAND_CATEGORY:
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
  case TOGGLE_EXPAND_CATEGORY:
    return { ...state, expanded: !state.expanded };
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
    return arrayToIds(action.payload);
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
  case TOGGLE_EXPAND_CATEGORY:
    return { ...state, [action.payload.id]: category(state[action.payload.id], action) };
  case FETCH_CATEGORIES:
    return arrayToObjMap(action.payload);
  default:
    return state;
  }
}

export default combineReducers({ byId, listedIds, isLoading, error });

// const initial = {
//   items: []
// };
//
// const reducer = handleActions({
//   ADD_CATEGORY: (state, action) => ({
//     items: [...state.items, action.payload.category]
//   }),
//   FETCH_CATEGORIES: (state, action) => ({
//     items: [...action.payload.items]
//   }),
//   UPDATE_CATEGORY: (state, action) => ({
//     items: state.items.map((item) => {
//       if (item.id === action.payload.item.id) {
//         return { ...item, ...action.payload.item };
//       }
//       return item;
//     })
//   }),
//   TOGGLE_EXPAND_CATEGORY: (state, action) => ({
//     items: state.items.map((item) => {
//       if (item.id === action.payload.id) {
//         return { ...item, expanded: !item.expanded };
//       }
//       return item;
//     })
//   }),
//   REMOVE_CATEGORY: (state, action) => {
//     const index = state.items.findIndex((e) => e.id === action.payload.id);
//     if (index === -1) return state;
//     return {
//       items: [...state.items.slice(0, index), ...state.items.slice(index+1)]
//     };
//   }
// }, initial);
//
// export default reducer;
