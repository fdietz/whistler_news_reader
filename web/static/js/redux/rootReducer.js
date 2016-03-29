import { combineReducers } from "redux";
import { routeReducer as routing } from "react-router-redux";

import feedForm from "./modules/feedForm";
import currentEntry from "./modules/currentEntry";
import entries from "./modules/entries";
import feeds from "./modules/feeds";
import notification from "./modules/notification";
import user from "./modules/user";
import categories from "./modules/categories";

export default combineReducers({
  feedForm,
  currentEntry,
  entries,
  categories,
  feeds,
  notification,
  user,
  routing
});
