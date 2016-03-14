import axios from "axios";
import { createAction } from "redux-actions";

import AuthToken from "../../utils/AuthToken";

export const CREATE_FEED = "CREATE_FEED";
export const createFeed = createAction(CREATE_FEED);

export function requestCreateFeed(feedUrl) {
  return dispatch => {
    dispatch(createFeed({}));

    return axios.post("http://localhost:4000/api/feeds",
      { feed_url: feedUrl },
      { headers: { Authorization: AuthToken.getToken() }})
      .then((response) => {
        // update form data
        dispatch(createFeed({ item: response.data }));

        return response.data;
      })
      .catch((response) => {
        return dispatch(createFeed(new Error(response.data.error)));
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
