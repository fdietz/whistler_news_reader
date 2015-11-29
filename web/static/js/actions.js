import { configureChannel } from "./channels";
import { createAction } from "redux-actions";

export const CREATE_FEED = "CREATE_FEED";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_ENTRIES_REQUEST = "FETCH_ENTRIES_REQUEST";
export const FETCH_ENTRIES_SUCCESS = "FETCH_ENTRIES_SUCCESS";
export const FETCH_ENTRIES_FAILURE = "FETCH_ENTRIES_FAILURE";
export const SELECT_ENTRY          = "SELECT_ENTRY";

export const FETCH_FEEDS = "FETCH_FEEDS";
// export const FETCH_FEEDS_REQUEST = "FETCH_FEEDS_REQUEST";
// export const FETCH_FEEDS_SUCCESS = "FETCH_FEEDS_SUCCESS";
// export const FETCH_FEEDS_FAILURE = "FETCH_FEEDS_FAILURE";

export const FETCH_MORE_ENTRIES_REQUEST = "FETCH_MORE_ENTRIES_REQUEST";
export const FETCH_MORE_ENTRIES_SUCCESS = "FETCH_MORE_ENTRIES_SUCCESS";
export const FETCH_MORE_ENTRIES_FAILURE = "FETCH_ENTRIES_FAILURE";
export const HAS_MORE_ENTRIES           = "HAS_MORE_ENTRIES";

let socket         = configureChannel();
let entriesChannel = socket.channel("entries:all");
let feedsChannel   = socket.channel("feeds:all");

const createFeed = createAction(CREATE_FEED);

export function requestCreateFeed(feedUrl) {
  return dispatch => {
    dispatch(createFeed());
    feedsChannel.push("feeds:create", { feed_url: feedUrl })
      .receive("ok", payload => {
        dispatch(createFeed({ item: payload.feed }));
      })
      .receive("error", payload => {
        dispatch(createFeed(new Error(payload.error)));
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

    feedsChannel.join()
      .receive("ok", payload => {
        dispatch(fetchFeeds({ items: payload.feeds }));
      })
      .receive("error", payload => {
        dispatch(fetchFeeds(new Error(payload.error)));
      })
      .after(10000, () => console.log("Networking issue. Still waiting..."));
  };
}
function fetchEntriesRequest() {
  return { type: FETCH_ENTRIES_REQUEST };
}

function fetchEntriesSuccess(entries) {
  return { type: FETCH_ENTRIES_SUCCESS, entries };
}

function fetchEntriesFailure(error) {
  return { type: FETCH_ENTRIES_FAILURE, error };
}

function fetchMoreEntriesRequest() {
  return { type: FETCH_MORE_ENTRIES_REQUEST };
}

function fetchMoreEntriesSuccess(entries) {
  return { type: FETCH_MORE_ENTRIES_SUCCESS, entries };
}

function fetchMoreEntriesFailure(error) {
  return { type: FETCH_MORE_ENTRIES_FAILURE, error };
}

function hasMoreEntries(hasMore) {
  return { type: HAS_MORE_ENTRIES, hasMore: hasMore };
}

export function fetchEntries() {
  return dispatch => {
    dispatch(fetchEntriesRequest());

    entriesChannel.join()
      .receive("ok", response => {
        dispatch(fetchEntriesSuccess(response.entries));
        if (response.entries.length < 10) {
          dispatch(hasMoreEntries(false));
        } else {
          dispatch(hasMoreEntries(true));
        }
      })
      .receive("error", reason => {
        dispatch(fetchEntriesFailure(reason));
      })
      .after(10000, () => console.log("Networking issue. Still waiting..."));
  };
}

export function fetchMoreEntries(lastPublished) {
  return dispatch => {
    dispatch(fetchMoreEntriesRequest(lastPublished));

    let payload = {
      last_published: lastPublished
    };

    entriesChannel.push("entries:load_more", payload)
      .receive("ok", response => {
        dispatch(fetchMoreEntriesSuccess(response.entries));
        if (response.entries.length < 10) {
          dispatch(hasMoreEntries(false));
        } else {
          dispatch(hasMoreEntries(true));
        }
      })
      .receive("error", error => {
        dispatch(fetchMoreEntriesFailure(error));
      });
  };
}

export function selectEntry(entry) {
  return { type: SELECT_ENTRY, entry: entry };
}
