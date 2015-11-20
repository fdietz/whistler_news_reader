import { combineReducers } from "redux";
import { CREATE_FEED, UPDATE_FEED, REMOVE_FEED } from "./actions";
import { FETCH_ENTRIES_REQUEST, FETCH_ENTRIES_SUCCESS, FETCH_ENTRIES_FAILURE } from "./actions";
import { FETCH_FEEDS_REQUEST, FETCH_FEEDS_SUCCESS, FETCH_FEEDS_FAILURE } from "./actions";

function feeds(state = [], action) {
  switch (action.type) {
    case FETCH_FEEDS_SUCCESS:
      console.log("feeds", action)
      return [].concat(action.feeds);
    case CREATE_FEED:
      return state;
    case UPDATE_FEED:
      return state;
    case REMOVE_FEED:
      return state;
    default:
      return state;
  }
}

function entries(state = [], action) {
  switch (action.type) {
    case FETCH_ENTRIES_SUCCESS:
      return [].concat(action.entries);
    default:
      return state;
  }
}

function isLoading(state = false, action) {
  switch (action.type) {
    case FETCH_ENTRIES_REQUEST:
      return true;
    case FETCH_ENTRIES_SUCCESS:
    case FETCH_ENTRIES_FAILURE:
      return false;
    default:
      return state;
  }
}

const reducers = combineReducers({ feeds, entries, isLoading });
export default reducers;
