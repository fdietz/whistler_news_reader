import React, { Component } from "react";
import ReactDOM from "react-dom";

import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";

import { ReduxRouter, routerStateReducer, reduxReactRouter } from "redux-router";
import { Route, Redirect, IndexRoute } from "react-router";
import { createHistory } from "history";

import DevTools from "./containers/DevTools";

// import { devTools } from 'redux-devtools';
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import Root from "./containers/Root";
import Welcome from "./containers/Welcome";
import Entries from "./containers/Entries";
import NewFeed from "./containers/NewFeed";
import NewFeedModal from "./containers/NewFeedModal";

import "../css/app.scss";

const loggerMiddleware = createLogger();
import { feeds, createFeed, entries, currentEntry } from "./reducers";

const reducers = combineReducers({
  router: routerStateReducer,
  feeds: feeds,
  createFeed: createFeed,
  entries: entries,
  currentEntry: currentEntry
});

const store = compose(
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  reduxReactRouter({ createHistory })
  // DevTools.instrument()
)(createStore)(reducers);

class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <ReduxRouter>
              <Route path="/" component={Root}>
                <IndexRoute component={Welcome}/>
                <Route path="all" component={Entries}/>
                <Route path="today" component={Entries}/>
                <Route path="feeds/new_full" component={NewFeed}/>
                <Route path="feeds/new" component={NewFeedModal} modal={true}/>
                <Route path="feeds/:id" component={Entries}/>
              </Route>
              <Redirect from="/" to="/all"/>
            </ReduxRouter>
          </div>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
