import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";

import { reduxReactRouter, routerStateReducer } from "redux-router";
import { createHistory } from "history";

import createLogger from "redux-logger";
const loggerMiddleware = createLogger();

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
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  reduxReactRouter({ createHistory })
  // DevTools.instrument()
)(createStore)(reducers);

export default store;
