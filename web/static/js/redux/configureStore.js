import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import rootReducer from "./rootReducer";

// TODO: should depend on MIX_ENV/NODE_ENV
const __DEBUG__ = true;

export default function configureStore(initialState = {}) {
  let middlewares = [thunk, routerMiddleware(browserHistory)];

  if (__DEBUG__) {
    const createLogger = require("redux-logger");
    middlewares.push(createLogger());
    // const performance = require("../middleware/performance").performance;
    // middlewares.push(performance);
    const reactPerformance = require("../middleware/performance").reactPerformance;
    middlewares.push(reactPerformance);
  }

  let middleware = applyMiddleware(...middlewares);

  const store = middleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept("./rootReducer", () => {
      const nextRootReducer = require("./rootReducer").default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
