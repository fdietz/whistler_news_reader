import thunkMiddleware from "redux-thunk";
import reduxLogger from "redux-logger";

import { createStore, applyMiddleware, compose } from "redux";

import { reduxReactRouter } from "redux-router";
import { createHistory } from "history";

import DevTools from "../containers/DevTools";

import reducers from "./reducers";

const __DEVTOOLS__ = false;

export default function create() {
  if (__DEVTOOLS__) {
    return compose(
      applyMiddleware(thunkMiddleware, reduxLogger()),
      reduxReactRouter({ createHistory }),
      DevTools.instrument()
    )(createStore)(reducers);
  }

  return compose(
    applyMiddleware(thunkMiddleware, reduxLogger()),
    reduxReactRouter({ createHistory })
  )(createStore)(reducers);
}
