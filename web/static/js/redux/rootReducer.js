import { combineReducers } from "redux";
import { routeReducer as routing } from "react-router-redux";

import feedForm from "./modules/feedForm";
import currentEntry from "./modules/currentEntry";
import entries from "./modules/entries";
import feeds from "./modules/feeds";
import notification from "./modules/notification";
import user from "./modules/user";

export default combineReducers({
  feedForm,
  currentEntry,
  entries,
  feeds,
  notification,
  user,
  routing
});
