import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import feedForm from "./modules/feedForm";
import categoryForm from "./modules/categoryForm";
import editForm from "./modules/editForm";
import currentEntry from "./modules/currentEntry";
import entries from "./modules/entries";
import feeds from "./modules/feeds";
import notification from "./modules/notification";
import user from "./modules/user";
import categories from "./modules/categories";
import currentSidebarSelection from "./modules/currentSidebarSelection";
import modals from "./modules/modals";
import opmlImportForm from "./modules/opmlImportForm";

export default combineReducers({
  feedForm,
  categoryForm,
  editForm,
  currentEntry,
  entries,
  categories,
  feeds,
  notification,
  user,
  currentSidebarSelection,
  modals,
  opmlImportForm,
  routing: routerReducer
});
