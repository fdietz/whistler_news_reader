import React from "react";
import ReactDOM from "react-dom";
import { browserHistory } from "react-router";

import "../css/app.scss";

import configureStore from "./redux/configureStore";
import makeRoutes from "./routes/index";
import Root from "./containers/Root";

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const history = browserHistory;
const routes = makeRoutes(store);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  rootElement
);
