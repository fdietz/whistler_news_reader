import { createAction } from "redux-actions";
import axios from "axios";

export const CREATE_FEED = "CREATE_FEED";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_ENTRIES = "FETCH_ENTRIES";
export const SELECT_ENTRY  = "SELECT_ENTRY";

export const FETCH_FEEDS = "FETCH_FEEDS";
export const REFRESH_ENTRIES = "REFRESH_ENTRIES";

const createFeed = createAction(CREATE_FEED);

export function requestCreateFeed(feedUrl) {
  return dispatch => {
    dispatch(createFeed());
    axios.post("/api/feeds", { data: { feed_url: feedUrl } })
      .then((response) => {
        dispatch(createFeed({ item: response.feed }));
      })
      .catch((response) => {
        dispatch(createFeed(new Error(response.error)));
      });
  };
}

export function updateFeed(feed) {
  return { type: UPDATE_FEED, feed: feed };
}

export function removeFeed(feed) {
  return { type: REMOVE_FEED, feed: feed };
}

const fetchFeeds = createAction(FETCH_FEEDS);

export function requestFetchFeeds() {
  return dispatch => {
    dispatch(fetchFeeds());

    axios.get("/api/feeds")
    .then((response) => {
      dispatch(fetchFeeds({ items: response.data.feeds }));
    })
    .catch((response) => {
      dispatch(fetchFeeds(new Error(response.data.error)));
    });
  };
}

const fetchEntries = createAction(FETCH_ENTRIES);

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

const refreshEntries = createAction(REFRESH_ENTRIES);

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

export let selectEntry = createAction(SELECT_ENTRY);

// export function requestSelectEntry(entry) {
//   return { type: SELECT_ENTRY, entry: entry };
// }
