import { configureChannel } from "./channels";
import { createAction } from "redux-actions";

export const CREATE_FEED = "CREATE_FEED";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_ENTRIES = "FETCH_ENTRIES";
export const SELECT_ENTRY          = "SELECT_ENTRY";

export const FETCH_FEEDS = "FETCH_FEEDS";

export const FETCH_MORE_ENTRIES = "FETCH_MORE_ENTRIES";
export const HAS_MORE_ENTRIES           = "HAS_MORE_ENTRIES";

let socket         = configureChannel();
let entriesChannel = socket.channel("entries:join");

export function joinEntriesChannel() {
  return entriesChannel.join()
    .receive("ok", response => {
      console.log("joined entries channel", response)
    })
    .receive("error", reason => {
      console.log("joining entries channel failed: ", reason)
    })
    .after(10000, () => console.log("Networking issue. Still waiting..."));
}

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

const fetchEntries = createAction(FETCH_ENTRIES);

export function requestFetchEntries() {
  console.log("requestFetchEntries")
  return dispatch => {
    dispatch(fetchEntries());

    entriesChannel.push("entries:all")
      .receive("ok", payload => {
        dispatch(fetchEntries({ items: payload.entries }));
      })
      .receive("error", payload => {
        dispatch(fetchEntries(new Error(payload.error)));
      })
      .after(10000, () => console.log("Networking issue. Still waiting..."));
  };
}

export function requestFetchMoreEntries(lastPublished) {
  return dispatch => {
    dispatch(fetchEntries({ lastPublished: lastPublished }));

    let params = {
      last_published: lastPublished
    };

    entriesChannel.push("entries:load_more", params)
      .receive("ok", payload => {
        dispatch(fetchEntries({ items: payload.entries }));
      })
      .receive("error", payload => {
        dispatch(fetchEntries(new Error(payload.error)));
      });
  };
}

export function selectEntry(entry) {
  return { type: SELECT_ENTRY, entry: entry };
}
