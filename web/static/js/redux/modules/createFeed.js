import { createAction } from "redux-actions";

export const CREATE_FEED = "CREATE_FEED";
export const CREATE_FEED_RESET_FORM = "CREATE_FEED_RESET_FORM";

export const createFeed = createAction(CREATE_FEED);
export const createFeedResetForm  = createAction(CREATE_FEED_RESET_FORM);

const initial = {
  item: null,
  isLoading: false
};

// feed = {
//   item: null,
//   isLoading: false,
//   error: reason
// }
export default function reducer(state = initial, action) {
  if (action.type === CREATE_FEED) {
    if (action.payload.errors) {
      return Object.assign({}, state, {
        errors: action.payload.errors
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        item: action.payload.item
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
  } else if (action.type === CREATE_FEED_RESET_FORM) {
    return Object.assign({}, initial);
  }

  return state;
}
