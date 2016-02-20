import thunk from "redux-thunk";
import { applyMiddleware, compose, createStore } from "redux";
import { browserHistory } from "react-router";
import { syncHistory } from "react-router-redux";
import rootReducer from "./rootReducer";

export default function configureStore(initialState = {}) {

  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = syncHistory(browserHistory);

  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk, reduxRouterMiddleware);

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept("./rootReducer", () => {
      const nextRootReducer = require("./rootReducer").default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
