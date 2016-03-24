import { push } from "react-router-redux";

import { requestRefreshEntries } from "../modules/entries";
import { addFeed } from "../modules/feeds";
import { requestCreateFeed, feedFormUpdate } from "../modules/feedForm";

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
      dispatch(feedFormUpdate({ errors: response.data.errors }));
      return response.data;
    });
  };
}
