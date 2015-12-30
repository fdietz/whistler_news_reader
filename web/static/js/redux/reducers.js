import { combineReducers } from "redux";
import { routerStateReducer } from "redux-router";

import feeds from "./modules/feeds";
import createFeed from "./modules/createFeed";
import entries from "./modules/entries";
import currentEntry from "./modules/currentEntry";

export default combineReducers({
  router: routerStateReducer,
  feeds,
  createFeed,
  entries,
  currentEntry
});
