import { push } from "react-router-redux";

import { requestCreateFeed } from "../modules/createFeed";
import { requestCreateSubscription } from "../modules/createFeed";
import { requestRefreshEntries } from "../modules/entries";
import { addFeed } from "../modules/feeds";

export default function createFeedAction(feedUrl) {
  return (dispatch, getState) => {
    dispatch(requestCreateFeed(feedUrl))
    .then((feed) => {
      dispatch(requestCreateSubscription(feed.id))
    })
    .then(() => {
      if (getState().createFeed.error) {
        return Promise.reject(getState().createFeed.error);
      } else {
        const feed = getState().createFeed.item;

        // navigate to new feed
        dispatch(push(`/feeds/${feed.id}`));
        // refresh feed entries
        dispatch(requestRefreshEntries({ feed_id: feed.id }));
        // update sidebar feed list
        dispatch(addFeed({ items: [feed] }));
        return Promise.resolve();
      }
    });
  };
}
