import { combineReducers } from "redux";
import { routeReducer as routing } from "react-router-redux";

import createFeed from "./modules/createFeed";
import currentEntry from "./modules/currentEntry";
import entries from "./modules/entries";
import feeds from "./modules/feeds";
import notification from "./modules/notification";

export default combineReducers({
  createFeed,
  currentEntry,
  entries,
  feeds,
  notification,
  routing
});
