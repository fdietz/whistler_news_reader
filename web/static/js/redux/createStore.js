import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";

import { reduxReactRouter, routerStateReducer } from "redux-router";
import { createHistory } from "history";

import reduxLogger from "redux-logger";

import DevTools from "../containers/DevTools";

import { feeds, createFeed, entries, currentEntry } from "./reducers";

const reducers = combineReducers({
  router: routerStateReducer,
  feeds: feeds,
  createFeed: createFeed,
  entries: entries,
  currentEntry: currentEntry
});

let store;
const __DEVTOOLS__ = false;

if (__DEVTOOLS__) {
  store = compose(
    applyMiddleware(thunkMiddleware, reduxLogger()),
    reduxReactRouter({ createHistory }),
    DevTools.instrument()
  )(createStore)(reducers);
} else {
  store = compose(
    applyMiddleware(thunkMiddleware, reduxLogger()),
    reduxReactRouter({ createHistory })
  )(createStore)(reducers);
}

export default store;
