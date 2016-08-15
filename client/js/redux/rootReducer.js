import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import feedForm from '../modules/feedForm';
import editForm from '../modules/editForm';
import categoryForm from '../modules/categoryForm';
import opmlImportForm from '../modules/opmlImportForm';
import user from '../modules/user';
import main from '../modules/main';
import sidebar from '../modules/sidebar';
import feeds from '../modules/feeds';
import entries from '../modules/entries';
import subscriptions from '../modules/subscriptions';
import categories from '../modules/categories';

// TODO: refactor to only access <module>.reducers
export default combineReducers({
  feedForm: feedForm.reducers,
  categoryForm: categoryForm.reducers,
  editForm: editForm.reducers,
  opmlImportForm: opmlImportForm.reducers,

  randomImages: user.reducers.randomImages,
  notification: main.reducers.notification,

  user: user.reducers.user,

  sidebar: sidebar.reducers,
  categories: categories.reducers,
  subscriptions: subscriptions.reducers,

  feeds: feeds.reducers,
  entries: entries.reducers,
  routing: routerReducer,
});
