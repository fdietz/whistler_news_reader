import axios from "axios";
import { createAction } from "redux-actions";

import { addFeed } from "./feeds";
import { requestRefreshEntries } from "./entries";

const CREATE_FEED = "CREATE_FEED";
export const createFeed = createAction(CREATE_FEED);

// TODO: extract method since it depends on other modules
export function requestCreateFeed(feedUrl) {
  return dispatch => {
    const authToken = localStorage.getItem("phoenixAuthToken");
    dispatch(createFeed());
    axios.post("/api/feeds",
      { feed_url: feedUrl },
      { headers: { Authorization: authToken }})
      .then((response) => {
        // update form data
        dispatch(createFeed({ item: response.data }));
        // update sidebar feed list
        dispatch(addFeed({ items: [response.data ] }));
        // refresh entries of new feed
        dispatch(requestRefreshEntries({ feed_id: response.data.id }));
      })
      .catch((response) => {
        dispatch(createFeed(new Error(response.data.error)));
      });
  };
}

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
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        item: action.payload.item
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
  }

  return state;
}
