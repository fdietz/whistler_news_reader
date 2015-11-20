import { configureChannel } from "./channels";

export const CREATE_FEED = "CREATE_FEED";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_ENTRIES_REQUEST = "FETCH_ENTRIES_REQUEST";
export const FETCH_ENTRIES_SUCCESS = "FETCH_ENTRIES_SUCCESS";
export const FETCH_ENTRIES_FAILURE = "FETCH_ENTRIES_FAILURE";

export const FETCH_FEEDS_REQUEST = "FETCH_FEEDS_REQUEST";
export const FETCH_FEEDS_SUCCESS = "FETCH_FEEDS_SUCCESS";
export const FETCH_FEEDS_FAILURE = "FETCH_FEEDS_FAILURE";

export function createFeed(feed) {
  return { type: CREATE_FEED, feed: feed };
}

export function updateFeed(feed) {
  return { type: UPDATE_FEED, feed: feed };
}

export function removeFeed(feed) {
  return { type: REMOVE_FEED, feed: feed };
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

function fetchFeedsRequest() {
  return { type: FETCH_FEEDS_REQUEST };
}

function fetchFeedsSuccess(feeds) {
  return { type: FETCH_FEEDS_SUCCESS, feeds };
}

function fetchFeedsFailure(error) {
  return { type: FETCH_FEEDS_FAILURE, error };
}

let socket         = configureChannel();
let entriesChannel = socket.channel("entries:all");
let feedsChannel   = socket.channel("feeds:all");

export function fetchEntries() {
  return dispatch => {
    dispatch(fetchEntriesRequest());

    entriesChannel.join()
      .receive("ok", messages => {
        console.log("catching up", messages);
        dispatch(fetchEntriesSuccess(messages.entries));
      })
      .receive("error", reason => {
        console.log("failed join", reason);
        dispatch(fetchEntriesFailure(reason));
      })
      .after(10000, () => console.log("Networking issue. Still waiting..."));

  };
}

export function fetchFeeds() {
  return dispatch => {
    dispatch(fetchFeedsRequest());

    feedsChannel.join()
      .receive("ok", messages => {
        console.log("catching up", messages);
        dispatch(fetchFeedsSuccess(messages.feeds));
      })
      .receive("error", reason => {
        console.log("failed join", reason);
        dispatch(fetchFeedsFailure(reason));
      })
      .after(10000, () => console.log("Networking issue. Still waiting..."));

  };
}
