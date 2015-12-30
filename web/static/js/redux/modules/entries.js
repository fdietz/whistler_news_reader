import axios from "axios";
import { createAction } from "redux-actions";

const FETCH_ENTRIES   = "FETCH_ENTRIES";
const REFRESH_ENTRIES = "REFRESH_ENTRIES";

export const fetchEntries   = createAction(FETCH_ENTRIES);
export const refreshEntries = createAction(REFRESH_ENTRIES);

export function requestFetchEntries(options = {}) {
  return dispatch => {
    const params = Object.assign({}, options, { limit: 20 });
    dispatch(fetchEntries(params));

    axios.get("/api/entries", { params: params })
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

export function requestRefreshEntries(options = {}) {
  return dispatch => {
    const params = options;
    dispatch(refreshEntries(params));

    axios.put("/api/entries/refresh", params)
    .then(() => {
      dispatch(refreshEntries());
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
