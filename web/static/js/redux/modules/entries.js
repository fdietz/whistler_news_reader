import axios from "../../utils/APIHelper";
import { createAction } from "redux-actions";
import { createNotification, resetNotification } from "./notification";

export const FETCH_ENTRIES      = "FETCH_ENTRIES";
export const FETCH_MORE_ENTRIES = "FETCH_MORE_ENTRIES";
export const REFRESH_ENTRIES    = "REFRESH_ENTRIES";
export const UPDATE_ENTRY       = "UPDATE_ENTRY";
export const MARK_ALL_FEED_ENTRIES_AS_READ = "MARK_ALL_FEED_ENTRIES_AS_READ";

export const fetchEntries     = createAction(FETCH_ENTRIES);
export const fetchMoreEntries = createAction(FETCH_MORE_ENTRIES);
export const refreshEntries   = createAction(REFRESH_ENTRIES);
export const updateEntry      = createAction(UPDATE_ENTRY);
export const markAllFeedEntriesAsRead = createAction(MARK_ALL_FEED_ENTRIES_AS_READ);

export function requestMarkEntryAsRead(entry) {
  return dispatch => {
    axios.put(`/api/entries/${entry.id}/mark_as_read`)
    .then((response) => {
      dispatch(updateEntry({ item: { id: entry.id, unread: false} }));
    })
    .catch((response) => {
      dispatch(updateEntry(new Error(response.data.error)));
    });
  };
}

export function requestMarkAllFeedEntriesAsRead(feedId) {
  return dispatch => {
    axios.put(`/api/feeds/${feedId}/mark_as_read`)
    .then((response) => {
      dispatch(markAllFeedEntriesAsRead({ feed_id: feedId }));
    })
    .catch((response) => {
      dispatch(markAllFeedEntriesAsRead(new Error(response.data.error)));
    });
  };
}

export function requestFetchEntries(options = {}) {
  return dispatch => {
    const params = Object.assign({}, options, { limit: 20 });
    dispatch(fetchEntries(params));
    dispatch(createNotification({ message: "Fetching entries", type: "info" }));
    axios.get("/api/entries", { params: params })
    .then((response) => {
      dispatch(fetchEntries({
        items: response.data.entries,
        meta: options,
        hasMoreEntries: response.data.entries.length === params.limit
      }));
      dispatch(resetNotification());
    })
    .catch((response) => {
      dispatch(fetchEntries(new Error(response.data.error)));
      dispatch(resetNotification());
    });
  };
}

export function requestFetchMoreEntries(options = {}) {
  return dispatch => {
    const params = Object.assign({}, options, { limit: 20 });
    dispatch(fetchMoreEntries(params));
    dispatch(createNotification({ message: "Fetching more entries", type: "info" }));

    return axios.get("/api/entries", { params: params })
    .then((response) => {
      dispatch(fetchMoreEntries({
        items: response.data.entries,
        meta: options,
        hasMoreEntries: response.data.entries.length === params.limit
      }));
      dispatch(resetNotification());
    })
    .catch((response) => {
      dispatch(fetchMoreEntries(new Error(response.data.error)));
      dispatch(resetNotification());
    });
  };
}

export function requestRefreshEntries(options = {}) {
  return dispatch => {
    const params = Object.assign(options, {});
    dispatch(refreshEntries(params));
    dispatch(createNotification({ message: "Refresh entries", type: "info" }));

    axios.put("/api/entries/refresh", params)
    .then(() => {
      dispatch(refreshEntries());
      dispatch(requestFetchEntries(options));
      dispatch(resetNotification());
    })
    .catch((response) => {
      dispatch(refreshEntries(new Error(response.data.error)));
      dispatch(resetNotification());
    });
  };
}

const initial = {
  items: [],
  isLoading: false,
  hasMoreEntries: false
};

// entries = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
export default function reducer(state = initial, action) {
  switch (action.type) {
  case FETCH_ENTRIES:
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload && action.payload.items) {
      return {
        items: action.payload.items,
        hasMoreEntries: action.payload.hasMoreEntries,
        isLoading: false
      };
    }
    return state;
  case FETCH_MORE_ENTRIES:
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload && action.payload.items) {
      return {
        items: [
          ...state.items, ...action.payload.items
        ],
        hasMoreEntries: action.payload.hasMoreEntries,
        isLoading: false
      };
    }
    return state;
  case UPDATE_ENTRY:
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload && action.payload.item) {
      return {
        items: state.items.map((item) => {
          if (item.id === action.payload.item.id) {
            return Object.assign({}, item, action.payload.item);
          }
          return item;
        }),
        isLoading: false
      };
    }
    return state;
  case MARK_ALL_FEED_ENTRIES_AS_READ:
    if (action.payload && action.payload.feed_id) {
      return {
        items: state.items.map((item) => {
          if (item.feed.id === action.payload.feed_id) {
            return Object.assign({}, item, { unread: false });
          }
          return item;
        }),
        isLoading: false
      };
    }
    return state;
  default:
    return state;
  }
}
