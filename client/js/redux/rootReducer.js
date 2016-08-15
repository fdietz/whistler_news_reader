import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import feedForm from '../modules/feedForm';
import editForm from '../modules/editForm';
import categoryForm from '../modules/categoryForm';
import opmlImportForm from '../modules/opmlImportForm';
import user from '../modules/user';
import sidebar from '../modules/sidebar';
import feeds from '../modules/feeds';
import entries from '../modules/entries';
import subscriptions from '../modules/subscriptions';
import categories from '../modules/categories';
import notification from '../modules/notification';
import randomImages from '../modules/randomImages';

// TODO: refactor to only access <module>.reducers
export default combineReducers({
  feedForm: feedForm.reducers,
  categoryForm: categoryForm.reducers,
  editForm: editForm.reducers,
  opmlImportForm: opmlImportForm.reducers,

  randomImages: randomImages.reducers,
  notification: notification.reducers,

  user: user.reducers,

  sidebar: sidebar.reducers,
  categories: categories.reducers,
  subscriptions: subscriptions.reducers,

  feeds: feeds.reducers,
  entries: entries.reducers,
  routing: routerReducer,
});
