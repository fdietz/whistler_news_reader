import { combineReducers } from "redux";
import { CREATE_FEED, UPDATE_FEED, REMOVE_FEED } from "./actions";
import { FETCH_ENTRIES, SELECT_ENTRY } from "./actions";
import { FETCH_FEEDS } from "./actions";

// feeds = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
export function feeds(state = { items: [], isLoading: false }, action) {
  switch (action.type) {
  case FETCH_FEEDS:
    if (action.error) {
      return Object.assign({}, state, { error: action.payload.message });
    } else if (action.payload) {
      return Object.assign({}, state, { items: action.payload.items });
    }
    return Object.assign({}, state, { isLoading: true });
  default:
    return state;
  }
}

// feed = {
//   item: null,
//   isLoading: false,
//   error: reason
// }
export function createFeed(state = { item: null, isLoading: false }, action) {
  switch (action.type) {
  case CREATE_FEED:
    if (action.error) {
      return Object.assign({}, state, { error: action.payload.message });
    } else if (action.payload) {
      return Object.assign({}, state, { item: action.payload.item });
    }

    return Object.assign({}, state, { isLoading: true });
  default:
    return state;
  }
}

// entries = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
export function entries(state = { items: [], isLoading: false, hasMoreEntries: true }, action) {
  switch (action.type) {
  case FETCH_ENTRIES:
    if (action.error) {
      return Object.assign({}, state, { error: action.payload.message });
    } else if (action.payload && action.payload.lastPublished) {
      return Object.assign({}, state, { isLoading: true });
    } else if (action.payload.items) {
      return { items: [
        ...state.items, ...action.payload.items],
        isLoading: false,
        hasMoreEntries: action.payload.items.length === 20
      };
    }
    return Object.assign({}, state, { isLoading: true });
  default:
    return state;
  }
}

export function currentEntry(state = null, action) {
  if (action.type === SELECT_ENTRY) {
    return action.entry;
  }

  return state;
}

const reducers = combineReducers({ feeds, createFeed, entries, currentEntry });
export default reducers;
