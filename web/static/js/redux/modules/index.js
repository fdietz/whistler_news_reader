import { combineReducers } from "redux";
import { routerStateReducer } from "redux-router";

import feeds from "./feeds";
import createFeed from "./createFeed";
import entries from "./entries";
import currentEntry from "./currentEntry";
import notification from "./notification";

export default combineReducers({
  router: routerStateReducer,
  feeds,
  createFeed,
  entries,
  currentEntry,
  notification
});
