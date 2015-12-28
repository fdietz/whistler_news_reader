import { combineReducers } from "redux";
import { CREATE_FEED } from "./actions";
import { FETCH_ENTRIES, SELECT_ENTRY } from "./actions";
import { FETCH_FEEDS, ADD_FEED } from "./actions";

// feeds = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
export function feeds(state = { items: [], isLoading: false }, action) {
  switch (action.type) {
  case FETCH_FEEDS:
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        items: action.payload.items
      });
    }
    return Object.assign({}, state, {
      isLoading: true
    });
  case ADD_FEED:
    if (action.payload) {
      return Object.assign({}, state, {
        items: [
          ...state.items,
          ...action.payload.items
        ]
      });
    }
    break;
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
  if (action.type === CREATE_FEED) {
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        item: action.payload.item
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
  }

  return state;
}

// entries = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
export function entries(state = { items: [], isLoading: false, hasMoreEntries: false }, action) {
  switch (action.type) {
  case FETCH_ENTRIES:
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload && action.payload.items &&
      action.payload.meta && action.payload.meta.last_published) {
      // fetch more
      return {
        items: [
          ...state.items, ...action.payload.items
        ],
        hasMoreEntries: action.payload.hasMoreEntries,
        isLoading: false
      };
    } else if (action.payload && action.payload.items) {
      // initial fetch
      return {
        items: action.payload.items,
        hasMoreEntries: action.payload.hasMoreEntries,
        isLoading: false
      };
    }
    return Object.assign({}, state, {
      isLoading: true
    });
  default:
    return state;
  }
}

export function currentEntry(state = null, action) {
  if (action.type === SELECT_ENTRY) {
    return action.payload.entry;
  }

  return state;
}

const reducers = combineReducers({ feeds, createFeed, entries, currentEntry });
export default reducers;
