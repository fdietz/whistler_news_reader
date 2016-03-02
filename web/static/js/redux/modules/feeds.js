import axios from "axios";
import { createAction } from "redux-actions";

export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_FEEDS = "FETCH_FEEDS";
export const ADD_FEED    = "ADD_FEED";

export const addFeed    = createAction(ADD_FEED);
export const updateFeed = createAction(UPDATE_FEED);
export const removeFeed = createAction(REMOVE_FEED);
export const fetchFeeds = createAction(FETCH_FEEDS);

export function requestFetchFeeds() {
  return dispatch => {
    const authToken = localStorage.getItem("phoenixAuthToken");
    dispatch(fetchFeeds());

    axios.get("/api/feeds", { headers: { Authorization: authToken } })
    .then((response) => {
      dispatch(fetchFeeds({ items: response.data.feeds }));
    })
    .catch((response) => {
      dispatch(fetchFeeds(new Error(response.data.error)));
    });
  };
}

const initial = {
  items: [],
  isLoading: false
};

// feeds = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
export default function reducer(state = initial, action) {
  switch (action.type) {
  case FETCH_FEEDS:
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        items: action.payload.items
      });
    }
    return Object.assign({}, state, {
      isLoading: true
    });
  case ADD_FEED:
    if (action.payload) {
      return Object.assign({}, state, {
        items: [
          ...state.items,
          ...action.payload.items
        ]
      });
    }
    break;
  default:
    return state;
  }
}
