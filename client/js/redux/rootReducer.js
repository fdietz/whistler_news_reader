import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import newFeedDialog from '../modules/newFeedDialog';
import editDialog from '../modules/editDialog';
import newCategoryDialog from '../modules/newCategoryDialog';
import opmlImportDialog from '../modules/opmlImportDialog';
import user from '../modules/user';
import main from '../modules/main';
import sidebar from '../modules/sidebar';
import feeds from '../modules/feeds';
import entries from '../modules/entries';

// TODO: refactor to only access <module>.reducers
export default combineReducers({
  feedForm: newFeedDialog.reducers.feedForm,
  categoryForm: newCategoryDialog.reducers.categoryForm,
  editForm: editDialog.reducers.editForm,
  opmlImportForm: opmlImportDialog.reducers.opmlImportForm,

  randomImages: user.reducers.randomImages,
  notification: main.reducers.notification,

  user: user.reducers.user,

  sidebar: sidebar.reducers.sidebar,
  categories: sidebar.reducers.categories,
  subscriptions: sidebar.reducers.subscriptions,

  feeds: feeds.reducers.feeds,
  entries: entries.reducers.entries,
  routing: routerReducer,
});
