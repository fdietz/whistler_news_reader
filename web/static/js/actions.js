import { configureChannel } from './channels';

export const CREATE_FEED = "CREATE_FEED";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_ENTRIES_REQUEST = 'FETCH_ENTRIES_REQUEST';
export const FETCH_ENTRIES_SUCCESS = 'FETCH_ENTRIES_SUCCESS';
export const FETCH_ENTRIES_FAILURE = 'FETCH_ENTRIES_FAILURE';

export function createFeed(feed) {
  return { type: CREATE_FEED, feed: feed }
};

export function updateFeed(feed) {
  return { type: UPDATE_FEED, feed: feed }
};

export function removeFeed(feed) {
  return { type: REMOVE_FEED, feed: feed }
};

function fetchEntriesRequest() {
  return { type: FETCH_ENTRIES_REQUEST };
}

function fetchEntriesSuccess(entries) {
  return { type: FETCH_ENTRIES_SUCCESS, entries };
}

function fetchEntriesFailure(error) {
  return { type: FETCH_ENTRIES_FAILURE, error };
}

let socket  = configureChannel();
let channel = socket.channel('entries:all');

export function fetchEntries() {
  return dispatch => {
    dispatch(fetchEntriesRequest());

    channel.join()
      .receive('ok', messages => {
        console.log('catching up', messages);
        dispatch(fetchEntriesSuccess(messages.entries));
      })
      .receive('error', reason => {
        console.log('failed join', reason);
        dispatch(fetchEntriesFailure(reason));
      })
      .after(10000, () => console.log('Networking issue. Still waiting...'));

    // channel.on('feed:', msg => {
    //   console.log('new:todo', msg);
    //   dispatch(addTodoSuccess(msg.text));
    // });
  };
}
