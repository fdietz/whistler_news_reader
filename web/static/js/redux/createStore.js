import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import { reduxReactRouter, routerStateReducer } from "redux-router";
import { createHistory } from "history";

import reduxLogger from "redux-logger";

import { feeds, createFeed, entries, currentEntry } from "./reducers";

const reducers = combineReducers({
  router: routerStateReducer,
  feeds: feeds,
  createFeed: createFeed,
  entries: entries,
  currentEntry: currentEntry
});

// import DevTools from "./containers/DevTools";

const store = compose(
  applyMiddleware(thunkMiddleware, reduxLogger()),
  reduxReactRouter({ createHistory })
  // DevTools.instrument()
)(createStore)(reducers);

export default store;
