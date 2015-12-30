import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { ReduxRouter } from "redux-router";

import "../css/app.scss";

import create from "./redux/create";
import createRoutes from "./routes";

import DevTools from "./containers/DevTools";

const component = (
  <ReduxRouter routes={createRoutes()} />
);

const rootElement = document.getElementById("root");
const __DEVTOOLS__ = false;

if (__DEVTOOLS__) {
  ReactDOM.render(
    <Provider store={create()}>
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    rootElement
  );
} else {
  ReactDOM.render(
    <Provider store={create()}>
      {component}
    </Provider>,
    rootElement
  );
}
