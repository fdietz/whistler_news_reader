import axios from "../../utils/APIHelper";
import { createAction } from "redux-actions";
import { createNotification, resetNotification } from "./notification";

export const FETCH_ENTRIES      = "FETCH_ENTRIES";
export const FETCH_MORE_ENTRIES = "FETCH_MORE_ENTRIES";
export const REFRESH_ENTRIES    = "REFRESH_ENTRIES";
export const UPDATE_ENTRY       = "UPDATE_ENTRY";
export const MARK_ALL_ENTRIES_AS_READ = "MARK_ALL_ENTRIES_AS_READ";

export const fetchEntries     = createAction(FETCH_ENTRIES);
export const fetchMoreEntries = createAction(FETCH_MORE_ENTRIES);
export const refreshEntries   = createAction(REFRESH_ENTRIES);
export const updateEntry      = createAction(UPDATE_ENTRY);
export const markAllEntriesAsRead = createAction(MARK_ALL_ENTRIES_AS_READ);

export function requestMarkEntryAsRead(entry) {
  return dispatch => {
    return axios.put(`/api/entries/${entry.id}/mark_as_read`)
    .then((response) => {
      dispatch(updateEntry({ item: { id: entry.id, unread: false} }));
    })
    .catch((response) => {
      dispatch(updateEntry(new Error(response.data.error)));
    });
  };
}

export function requestMarkAllEntriesAsRead(params) {
  return dispatch => {
    return axios.put("/api/entries/mark_all_as_read", params)
    .then((response) => {
      dispatch(markAllEntriesAsRead(params));
    })
    .catch((response) => {
      dispatch(markAllEntriesAsRead(new Error(response.data.error)));
    });
  };
}

export function requestFetchEntries(options = {}) {
  return dispatch => {
    const params = Object.assign({}, options, { limit: 20 });
    dispatch(fetchEntries(params));

    return axios.get("/api/entries", { params: params })
    .then((response) => {
      dispatch(fetchEntries({
        items: response.data.entries,
        meta: options,
        hasMoreEntries: response.data.entries.length === params.limit
      }));
    })
    .catch((response) => {
      dispatch(fetchEntries(new Error(response.data.error)));
    });
  };
}

export function requestFetchMoreEntries(options = {}) {
  return dispatch => {
    const params = Object.assign({}, options, { limit: 20 });
    dispatch(fetchMoreEntries(params));

    return axios.get("/api/entries", { params: params })
    .then((response) => {
      dispatch(fetchMoreEntries({
        items: response.data.entries,
        meta: options,
        hasMoreEntries: response.data.entries.length === params.limit
      }));
    })
    .catch((response) => {
      dispatch(fetchMoreEntries(new Error(response.data.error)));
    });
  };
}

export function requestRefreshEntries(options = {}) {
  return dispatch => {
    const params = Object.assign(options, {});
    dispatch(refreshEntries());

    return axios.put("/api/entries/refresh", params)
    .then(() => {
      dispatch(refreshEntries({}));
      dispatch(requestFetchEntries(options));
    })
    .catch((response) => {
      dispatch(refreshEntries(new Error(response.data.error)));
    });
  };
}

const initial = {
  items: [],
  isLoading: false,
  hasMoreEntries: false,
  error: null
};

export default function reducer(state = initial, action) {
  switch (action.type) {
  case FETCH_ENTRIES:
    if (action.error) {
      return { ...state, error: action.payload.message };
    } else if (action.payload && action.payload.items) {
      return { ...state, ...action.payload, isLoading: false };
    }

    return { ...state, isLoading: true };
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
    return Object.assign({}, state, {
      isLoading: true
    });
  case REFRESH_ENTRIES:
    if (action.payload) {
      return Object.assign({}, state, {
        isLoading: false
      });
    }

    return Object.assign({}, state, {
      isLoading: true
    });
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
  case MARK_ALL_ENTRIES_AS_READ:
    if (action.payload && action.payload.feed_id === "all") {
      return {
        items: state.items.map(item => {
          return {...item, unread: false };
        }),
        isLoading: false
      };
    } else if (action.payload && action.payload.feed_id === "today") {
      // TODO: implement reducer
    } else if (action.payload && action.payload.feed_id) {
      return {
        items: state.items.map(item => {
          if (item.feed.id === +action.payload.feed_id) {
            return {...item, unread: false };
          }
          return item;
        }),
        isLoading: false
      };
    } else if (action.payload && action.payload.category_id) {
      return {
        items: state.items.map(item => {
          if (item.feed.category_id === +action.payload.category_id) {
            return {...item, unread: false };
          }
          return item;
        }),
        isLoading: false
      };
    }
    return state;
  default:
    return initial;
  }
}
