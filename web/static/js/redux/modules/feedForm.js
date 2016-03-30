import { createAction } from "redux-actions";
import axios from "../../utils/APIHelper";

export const FEED_FORM_UPDATE = "FEED_FORM_UPDATE";
export const FEED_FORM_RESET = "FEED_FORM_RESET";

export const feedFormUpdate = createAction(FEED_FORM_UPDATE);
export const feedFormReset  = createAction(FEED_FORM_RESET);

export function requestCreateFeed(feedAttributes) {
  return axios.post("http://localhost:4000/api/feeds", { feed: feedAttributes });
}

const initial = {
  feedUrl: null,
  categoryId: null,
  isLoading: false
};

// feedForm = {
//   feedUrl: null,
//   isLoading: false,
//   error: reason
// }
export default function reducer(state = initial, action) {
  if (action.type === FEED_FORM_UPDATE) {
    if (action.payload.errors) {
      return Object.assign({}, state, {
        errors: action.payload.errors
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        feedUrl: action.payload.feedUrl,
        categoryId: action.payload.categoryId
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
  } else if (action.type === FEED_FORM_RESET) {
    return Object.assign({}, initial);
  }

  return state;
}
