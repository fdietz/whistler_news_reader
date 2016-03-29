import { createAction, handleActions } from "redux-actions";

export const ADD_CATEGORY = "ADD_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const REMOVE_CATEGORY = "REMOVE_CATEGORY";

export const addCategory    = createAction(ADD_CATEGORY);
export const updateCategory = createAction(UPDATE_CATEGORY);
export const removeCategory = createAction(REMOVE_CATEGORY);

const initial = {
  items: [
    { id: 1, title: "tech", unread_count: 3 },
    { id: 2, title: "fun", unread_count: 5 },
    { id: 3, title: "news", unread_count: 7 }
  ]
};

const reducer = handleActions({
  ADD_CATEGORY: (state, action) => ({
    items: [...state, action.payload.item]
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
