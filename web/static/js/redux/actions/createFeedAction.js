import { push } from "react-router-redux";
import axios from "axios";

import AuthToken from "../../utils/AuthToken";

import { requestRefreshEntries } from "../modules/entries";
import { addFeed } from "../modules/feeds";
import { createFeed } from "../modules/createFeed";

export function requestCreateFeed(feedUrl) {
  return axios.post("http://localhost:4000/api/feeds",
    { feed_url: feedUrl },
    { headers: { Authorization: AuthToken.getToken() }});
}

export function requestCreateSubscription(feedId) {
  return axios.post("http://localhost:4000/api/subscriptions",
    { feed_id: feedId },
    { headers: { Authorization: AuthToken.getToken() }});
}

export default function createFeedAction(feedUrl) {
  let feed = null;
  return (dispatch, getState) => {
    return requestCreateFeed(feedUrl)
    .then((response) => {
      console.log("create feed", response.data)
      feed = response.data;
      return requestCreateSubscription(response.data.id);
    }).
    then((response) => {
      console.log("done", response.data)

      // navigate to new feed
      dispatch(push(`/feeds/${feed.id}`));
      // refresh feed entries
      dispatch(requestRefreshEntries({ feed_id: feed.id }));
      // update sidebar feed list
      dispatch(addFeed({ items: [feed] }));

      return response.data;
    }).
    catch((response) => {
      console.log("createFeedAction", response)
      dispatch(createFeed({ errors: response.data.errors }));
      return response.data;
    });
  };
}
