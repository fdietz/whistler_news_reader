import axios from "axios";
import { createAction } from "redux-actions";

import AuthToken from "../../utils/AuthToken";

export const CREATE_FEED = "CREATE_FEED";
export const CREATE_FEED_RESET_FORM = "CREATE_FEED_RESET_FORM";
export const createFeed = createAction(CREATE_FEED);
export const createFeedResetForm  = createAction(CREATE_FEED_RESET_FORM);

export function requestCreateFeed(feedUrl) {
  return dispatch => {
    // dispatch(createFeed({}));

    return axios.post("http://localhost:4000/api/feeds",
      { feed_url: feedUrl },
      { headers: { Authorization: AuthToken.getToken() }});
      // .then((response) => {
      //   dispatch(createFeed({ item: response.data }));
      // })
      // .catch((response) => {
      //   console.log("response.data.errors", response.data.errors)
      //   dispatch(createFeed({ errors: response.data.errors }));
      // });
  };
}

// TODO: separate store?
export function requestCreateSubscription(feedId) {
  return dispatch => {
    // dispatch(createFeed({}));

    return axios.post("http://localhost:4000/api/subscriptions",
      { feed_id: feedId },
      { headers: { Authorization: AuthToken.getToken() }});
      // .then((response) => {
      //   dispatch(createFeed({ item: response.data }));
      // })
      // .catch((response) => {
      //   console.log("response.data.errors", response.data.errors)
      //   dispatch(createFeed({ errors: response.data.errors }));
      // });
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
