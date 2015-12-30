import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { ReduxRouter } from "redux-router";

import "../css/app.scss";

import store from "./redux/createStore";
import createRoutes from "./routes";

const component = (
  <ReduxRouter routes={createRoutes()} />
);

const rootElement = document.getElementById("root");
const __DEVTOOLS__ = false;

if (__DEVTOOLS__) {
  const DevTools = require("./containers/DevTools");

  ReactDOM.render(
    <Provider store={store}>
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    rootElement
  );
} else {
  ReactDOM.render(
    <Provider store={store}>
      {component}
    </Provider>,
    rootElement
  );
}
