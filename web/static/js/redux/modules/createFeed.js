// import axios from "axios";
// import { push } from "react-router-redux";
import { createAction } from "redux-actions";

// import AuthToken from "../../utils/AuthToken";

// import { requestRefreshEntries } from "../modules/entries";
// import { addFeed } from "../modules/feeds";

export const CREATE_FEED = "CREATE_FEED";
export const CREATE_FEED_RESET_FORM = "CREATE_FEED_RESET_FORM";
export const createFeed = createAction(CREATE_FEED);
export const createFeedResetForm  = createAction(CREATE_FEED_RESET_FORM);

// export function requestCreateFeed(feedUrl) {
//   return axios.post("http://localhost:4000/api/feeds",
//     { feed_url: feedUrl },
//     { headers: { Authorization: AuthToken.getToken() }});
// }
//
// export function requestCreateSubscription(feedId) {
//   return axios.post("http://localhost:4000/api/subscriptions",
//     { feed_id: feedId },
//     { headers: { Authorization: AuthToken.getToken() }});
// }

// export function createFeedAction(feedUrl) {
//   return (dispatch, getState) => {
//
//     return requestCreateFeed(feedUrl)
//     .then((response) => {
//       console.log("create feed", response.data)
//       return requestCreateSubscription(response.data.id);
//     }).
//     then((response) => {
//       console.log("done", response.data)
//
//       const feed = response.data;
//       // navigate to new feed
//       dispatch(push(`/feeds/${feed.id}`));
//       // refresh feed entries
//       dispatch(requestRefreshEntries({ feed_id: feed.id }));
//       // update sidebar feed list
//       dispatch(addFeed({ items: [feed] }));
//
//       return response.data;
//     }).
//     catch((response) => {
//       console.log("createFeedAction", response)
//       dispatch(createFeed({ errors: response.data.errors }));
//       return response.data;
//     });
//
//   };
// }
// export function requestCreateFeed(feedUrl) {
//   return dispatch => {
//     // dispatch(createFeed({}));
//
//     return axios.post("http://localhost:4000/api/feeds",
//       { feed_url: feedUrl },
//       { headers: { Authorization: AuthToken.getToken() }});
//       // .then((response) => {
//       //   dispatch(createFeed({ item: response.data }));
//       // })
//       // .catch((response) => {
//       //   console.log("response.data.errors", response.data.errors)
//       //   dispatch(createFeed({ errors: response.data.errors }));
//       // });
//   };
// }
//
// // TODO: separate store?
// export function requestCreateSubscription(feedId) {
//   return dispatch => {
//     // dispatch(createFeed({}));
//
//     return axios.post("http://localhost:4000/api/subscriptions",
//       { feed_id: feedId },
//       { headers: { Authorization: AuthToken.getToken() }});
//       // .then((response) => {
//       //   dispatch(createFeed({ item: response.data }));
//       // })
//       // .catch((response) => {
//       //   console.log("response.data.errors", response.data.errors)
//       //   dispatch(createFeed({ errors: response.data.errors }));
//       // });
//   };
// }

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
