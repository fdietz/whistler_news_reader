import { createAction } from "redux-actions";
import axios from "../../utils/APIHelper";

export const FEED_FORM_UPDATE = "FEED_FORM_UPDATE";
export const FEED_FORM_RESET = "FEED_FORM_RESET";

export const feedFormUpdate = createAction(FEED_FORM_UPDATE);
export const feedFormReset  = createAction(FEED_FORM_RESET);

export function requestCreateFeed(feedUrl) {
  return axios.post("http://localhost:4000/api/feeds", { feed_url: feedUrl });
}

const initial = {
  feedUrl: null,
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
        feedUrl: action.payload.feedUrl
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
