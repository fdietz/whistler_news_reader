import { configureChannel } from "./channels";

export const CREATE_FEED = "CREATE_FEED";
export const CREATE_FEED_SUCCESS = "CREATE_FEED_SUCESS";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_ENTRIES_REQUEST = "FETCH_ENTRIES_REQUEST";
export const FETCH_ENTRIES_SUCCESS = "FETCH_ENTRIES_SUCCESS";
export const FETCH_ENTRIES_FAILURE = "FETCH_ENTRIES_FAILURE";
export const SELECT_ENTRY          = "SELECT_ENTRY";

export const FETCH_FEEDS_REQUEST = "FETCH_FEEDS_REQUEST";
export const FETCH_FEEDS_SUCCESS = "FETCH_FEEDS_SUCCESS";
export const FETCH_FEEDS_FAILURE = "FETCH_FEEDS_FAILURE";

export const FETCH_MORE_ENTRIES_REQUEST = "FETCH_MORE_ENTRIES_REQUEST";
export const FETCH_MORE_ENTRIES_SUCCESS = "FETCH_MORE_ENTRIES_SUCCESS";
export const FETCH_MORE_ENTRIES_FAILURE = "FETCH_ENTRIES_FAILURE";
export const HAS_MORE_ENTRIES           = "HAS_MORE_ENTRIES";

export function createFeed(feedUrl) {
  return dispatch => {
    const payload = { feed_url: feedUrl };
    feedsChannel.push("feeds:create", payload)
      .receive("ok", response => {
        dispatch(createFeedSuccess(response.feed));
      })
      .receive("error", error => {
        console.log("error creating feed", error)
      });
  }
}

export function createFeedSuccess(feed) {
  return { type: CREATE_FEED_SUCCESS, feed: feed };
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

export function fetchFeeds() {
  return dispatch => {
    dispatch(fetchFeedsRequest());

    feedsChannel.join()
      .receive("ok", messages => {
        dispatch(fetchFeedsSuccess(messages.feeds));
      })
      .receive("error", reason => {
        dispatch(fetchFeedsFailure(reason));
      })
      .after(10000, () => console.log("Networking issue. Still waiting..."));
  };
}
