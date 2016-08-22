import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './rootReducer';

const __DEBUG__ = process.env.NODE_ENV !== 'production';
const __PERFORMANCE_DEBUG__ = false;

export default function configureStore(initialState = {}) {
  const middlewares = [thunk, routerMiddleware(browserHistory)];

  if (__DEBUG__) {
    /* eslint global-require:0 */
    const createLogger = require('redux-logger');

    middlewares.push(createLogger());
  }

  if (__PERFORMANCE_DEBUG__) {
    // const performance = require("../middleware/performance").performance;
    // middlewares.push(performance);

    /* eslint global-require:0 */
    const reactPerformance = require('../middleware/performance').reactPerformance;

    middlewares.push(reactPerformance);
  }

  const middleware = applyMiddleware(...middlewares);

  const store = middleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      /* eslint global-require:0 */
      const nextRootReducer = require('./rootReducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
