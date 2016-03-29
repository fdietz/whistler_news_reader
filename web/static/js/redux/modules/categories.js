import axios from "../../utils/APIHelper";
import { createAction, handleActions } from "redux-actions";

export const ADD_CATEGORY = "ADD_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const REMOVE_CATEGORY = "REMOVE_CATEGORY";
export const FETCH_CATEGORIES = "FETCH_CATEGORIES";

export const addCategory      = createAction(ADD_CATEGORY);
export const updateCategory   = createAction(UPDATE_CATEGORY);
export const removeCategory   = createAction(REMOVE_CATEGORY);
export const fetchCategories  = createAction(FETCH_CATEGORIES);

export function requestFetchCategories() {
  return dispatch => {
    return axios.get("/api/categories")
    .then((response) => {
      dispatch(fetchCategories({ items: response.data.categories }));
    })
    .catch((response) => {
      dispatch(fetchCategories(new Error(response.data.error)));
    });
  };
}

const initial = {
  items: []
};

const reducer = handleActions({
  ADD_CATEGORY: (state, action) => ({
    items: [...state, action.payload.item]
  }),
  FETCH_CATEGORIES: (state, action) => ({
    items: action.payload.items
  }),
  UPDATE_CATEGORY: (state, action) => ({
    items: state.items.map((item) => {
      if (item.id === action.payload.item.id) {
        return Object.assign({}, item, action.payload.item);
      }
      return item;
    })
  }),
  REMOVE_CATEGORY: (state, action) => {
    const index = state.items.findIndex((e) => e.id === action.payload.id);
    return {
      items: [...state.items.slice(0, index), ...state.items.slice(index+1)]
    };
  }
}, initial);

export default reducer;
