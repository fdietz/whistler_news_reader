import React, { Component } from "react";
import ReactDOM from "react-dom";

import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";

import { ReduxRouter, routerStateReducer, reduxReactRouter } from "redux-router";
import { Route, Redirect, IndexRoute } from "react-router";
import { createHistory } from "history";

// import App from "./containers/app";

// import { devTools } from 'redux-devtools';
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import App from "./containers/app";
import Welcome from "./containers/Welcome";
import Entries from "./containers/Entries";
import NewFeedModal from "./containers/NewFeedModal";

import "../css/app.scss";

const loggerMiddleware = createLogger();
import { feeds, entries, currentEntry, hasMoreEntries, isLoading } from "./reducers";

const reducers = combineReducers({
  router: routerStateReducer,
  feeds: feeds,
  entries: entries,
  currentEntry: currentEntry,
  hasMoreEntries: hasMoreEntries,
  isLoading: isLoading
});

const store = compose(
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  reduxReactRouter({ createHistory })
)(createStore)(reducers);

class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter>
            <Route path="/" component={App}>
              <IndexRoute component={Welcome}/>
              <Route path="all" component={Entries}/>
              <Route path="today" component={Entries}/>
              <Route path="feeds/new" component={NewFeedModal} modal={true}/>
              <Route path="feeds/:id" component={Entries}/>
            </Route>
            <Redirect from="/" to="/all"/>
          </ReduxRouter>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("root"));
