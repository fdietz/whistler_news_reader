import { combineReducers } from "redux";
import { CREATE_FEED, CREATE_FEED_SUCCESS, UPDATE_FEED, REMOVE_FEED } from "./actions";
import { FETCH_ENTRIES_REQUEST, FETCH_ENTRIES_SUCCESS, FETCH_ENTRIES_FAILURE } from "./actions";
import { FETCH_MORE_ENTRIES_REQUEST, FETCH_MORE_ENTRIES_SUCCESS, FETCH_MORE_ENTRIES_FAILURE, SELECT_ENTRY, HAS_MORE_ENTRIES } from "./actions";
import { FETCH_FEEDS_REQUEST, FETCH_FEEDS_SUCCESS, FETCH_FEEDS_FAILURE } from "./actions";

export function feeds(state = [], action) {
  switch (action.type) {
  case FETCH_FEEDS_SUCCESS:
    return state.concat(action.feeds);
  case CREATE_FEED:
    return state;
  case CREATE_FEED_SUCCESS:
    return [...state, action.feed];
  case UPDATE_FEED:
    return state;
  case REMOVE_FEED:
    return state;
  default:
    return state;
  }
}

export function entries(state = [], action) {
  switch (action.type) {
  case FETCH_ENTRIES_SUCCESS:
    return state.concat(action.entries);
  case FETCH_MORE_ENTRIES_SUCCESS:
    return state.concat(action.entries);
  default:
    return state;
  }
}

export function currentEntry(state = null, action) {
  if (action.type === SELECT_ENTRY) {
    return action.entry;
  } else {
    return state;
  }
}

export function hasMoreEntries(state = true, action) {
  if (action.type === HAS_MORE_ENTRIES) {
    return action.hasMore;
  } else {
    return state;
  }
}

export function isLoading(state = false, action) {
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

const reducers = combineReducers({ feeds, entries, currentEntry, hasMoreEntries, isLoading });
export default reducers;
