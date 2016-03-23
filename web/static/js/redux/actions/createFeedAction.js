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

export default function createFeedAction(feedUrl) {
  return (dispatch) => {
    return requestCreateFeed(feedUrl).
    then((response) => {
      const feed = response.data;
      // navigate to new feed
      dispatch(push(`/feeds/${feed.id}`));
      // refresh feed entries
      dispatch(requestRefreshEntries({ feed_id: feed.id }));
      // update sidebar feed list
      dispatch(addFeed({ items: [feed] }));

      return response.data;
    }).
    catch((response) => {
      dispatch(createFeed({ errors: response.data.errors }));
      return response.data;
    });
  };
}
