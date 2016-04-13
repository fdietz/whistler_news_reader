import React from "react";
import ReactDOM from "react-dom";
import { browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
// import Perf from "react-addons-perf";
// window.Perf = Perf;

import "../css/app.scss";

import configureStore from "./redux/configureStore";
import makeRoutes from "./routes/index";
import Root from "./containers/Root";

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);
const routes = makeRoutes(store);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  rootElement
);
