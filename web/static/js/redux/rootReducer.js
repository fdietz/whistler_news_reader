import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import feedForm from './modules/feedForm';
import categoryForm from './modules/categoryForm';
import editForm from './modules/editForm';
import entries from './modules/entries';
import feeds from './modules/feeds';
import subscriptions from './modules/subscriptions';
import notification from './modules/notification';
import user from './modules/user';
import categories from './modules/categories';
import opmlImportForm from './modules/opmlImportForm';
import randomImages from './modules/randomImages';
import sidebar from './modules/sidebar';

export default combineReducers({
  feedForm,
  categoryForm,
  editForm,
  entries,
  categories,
  feeds,
  subscriptions,
  notification,
  user,
  opmlImportForm,
  randomImages,
  sidebar,
  routing: routerReducer,
});
