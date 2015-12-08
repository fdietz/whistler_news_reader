import { createAction } from "redux-actions";
import axios from "axios";

export const CREATE_FEED = "CREATE_FEED";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_ENTRIES = "FETCH_ENTRIES";
export const SELECT_ENTRY  = "SELECT_ENTRY";

export const FETCH_FEEDS = "FETCH_FEEDS";

const createFeed = createAction(CREATE_FEED);

export function requestCreateFeed(feedUrl) {
  return dispatch => {
    dispatch(createFeed());
    axios.post("/api/feeds", { data: { feed_url: feedUrl } })
      .then(function (response) {
        dispatch(createFeed({ item: payload.feed }));
        console.log(response);
      })
      .catch(function (response) {
        dispatch(createFeed(new Error(payload.error)));
        console.log(response);
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
    .then(function(response) {
      dispatch(fetchFeeds({ items: response.data.feeds }));
    })
    .catch(function(response) {
      dispatch(fetchFeeds(new Error(response.data.error)));
    });
  };
}

const fetchEntries = createAction(FETCH_ENTRIES);

export function requestFetchEntries() {
  return dispatch => {
    dispatch(fetchEntries());

    axios.get("/api/entries")
    .then(function(response) {
      dispatch(fetchEntries({ items: response.data.entries }));
    })
    .catch(function(response) {
      dispatch(fetchEntries(new Error(response.data.error)));
    });
  };
}

export function requestFetchMoreEntries(lastPublished) {
  return dispatch => {
    dispatch(fetchEntries({ lastPublished: lastPublished }));

    let params = {
      last_published: lastPublished
    };

    axios.get("/api/entries", { params: params })
    .then(function(response) {
      dispatch(fetchEntries({ items: response.data.entries }));
    })
    .catch(function(response) {
      dispatch(fetchEntries(new Error(response.data.error)));
    });
  };
}

export function selectEntry(entry) {
  return { type: SELECT_ENTRY, entry: entry };
}
