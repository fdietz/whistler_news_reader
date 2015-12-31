import axios from "axios";
import { createAction } from "redux-actions";
import { createNotification, resetNotification } from "./notification";

const FETCH_ENTRIES      = "FETCH_ENTRIES";
const FETCH_MORE_ENTRIES = "FETCH_MORE_ENTRIES";
const REFRESH_ENTRIES    = "REFRESH_ENTRIES";

export const fetchEntries     = createAction(FETCH_ENTRIES);
export const fetchMoreEntries = createAction(FETCH_MORE_ENTRIES);
export const refreshEntries   = createAction(REFRESH_ENTRIES);

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

    axios.get("/api/entries", { params: params })
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
    const params = options;
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
    return Object.assign({}, state, {
      isLoading: true
    });
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
  default:
    return state;
  }
}
