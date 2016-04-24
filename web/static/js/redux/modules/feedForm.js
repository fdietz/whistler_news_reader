import { createAction } from "redux-actions";
import axios from "../../utils/APIHelper";

export const FEED_FORM_UPDATE = "FEED_FORM_UPDATE";
export const FEED_FORM_RESET = "FEED_FORM_RESET";

export const feedFormUpdate = createAction(FEED_FORM_UPDATE);
export const feedFormReset  = createAction(FEED_FORM_RESET);

export function requestCreateFeed(feedAttributes) {
  return (dispatch) => {
    dispatch(feedFormUpdate());
    return axios.post("/api/feeds", { feed: feedAttributes })
      .then((response) => {
        dispatch(feedFormReset());
        return response.data.feed;
      })
      .catch(error => dispatch(feedFormUpdate(error)));
  };
}

const initial = {
  searchTerm: "",
  feedExists: false,
  isFeedUrl: false,
  categoryId: null,
  isLoading: false,
  selectedFeed: null,
  errors: null
};

export default function reducer(state = initial, action) {
  if (action.type === FEED_FORM_UPDATE) {
    if (!action.payload) return {...state, isLoading: true };
    return { ...state, ...action.payload, isLoading: false };
  } else if (action.type === FEED_FORM_RESET) {
    return initial;
  }

  return state;
}
