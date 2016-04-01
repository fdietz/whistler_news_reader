import { push } from "react-router-redux";

import { addFeed } from "../modules/feeds";
import { requestCreateFeed, feedFormUpdate } from "../modules/feedForm";

export default function createFeedAction(feedAttributes) {
  return (dispatch) => {
    dispatch(feedFormUpdate());

    return requestCreateFeed(feedAttributes).
    then((response) => {
      const feed = response.data;
      // navigate to new feed
      dispatch(push(`/feeds/${feed.id}`));
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
