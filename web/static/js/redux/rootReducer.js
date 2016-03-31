import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import feedForm from "./modules/feedForm";
import categoryForm from "./modules/categoryForm";
import currentEntry from "./modules/currentEntry";
import entries from "./modules/entries";
import feeds from "./modules/feeds";
import notification from "./modules/notification";
import user from "./modules/user";
import categories from "./modules/categories";

export default combineReducers({
  feedForm,
  categoryForm,
  currentEntry,
  entries,
  categories,
  feeds,
  notification,
  user,
  routing: routerReducer
});
