import { createAction } from "redux-actions";

import axios from "../../utils/APIHelper";

export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_FEEDS = "FETCH_FEEDS";
export const ADD_FEED    = "ADD_FEED";
export const DECREMENT_UNREAD_COUNT = "DECREMENT_UNREAD_COUNT";

export const addFeed    = createAction(ADD_FEED);
export const updateFeed = createAction(UPDATE_FEED);
export const removeFeed = createAction(REMOVE_FEED);
export const fetchFeeds = createAction(FETCH_FEEDS);
export const decrementUnreadCount = createAction(DECREMENT_UNREAD_COUNT);

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

export function requestRemoveFeed(feedId) {
  return dispatch => {
    axios.delete(`http://localhost:4000/api/feeds/${feedId}`)
    .then(() => {
      dispatch(removeFeed({ id: feedId }));
    })
    .catch((response) => {
      dispatch(removeFeed(new Error(response.data.error)));
    });
  };
}

const initial = {
  items: [],
  isLoading: false
};

// feeds = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
export default function reducer(state = initial, action) {
  switch (action.type) {
  case FETCH_FEEDS:
    if (action.error) {
      return Object.assign({}, state, {
        error: action.payload.message
      });
    } else if (action.payload) {
      return Object.assign({}, state, {
        items: action.payload.items
      });
    }
    return Object.assign({}, state, {
      isLoading: true
    });
  case ADD_FEED:
    if (action.payload) {
      return Object.assign({}, state, {
        items: [
          ...state.items,
          ...action.payload.items
        ]
      });
    }
    break;
  case UPDATE_FEED:
    if (action.payload) {
      return Object.assign({}, state, {
        items: state.items.map((item) => {
          if (item.id === action.payload.item.id) {
            return Object.assign({}, item, action.payload.item);
          }
          return item;
        })
      });
    }
    break;
  case DECREMENT_UNREAD_COUNT:
    if (action.payload) {
      return Object.assign({}, state, {
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return Object.assign({}, item, { unread_count: item.unread_count-1 });
          }
          return item;
        })
      });
    }
    break;
  case REMOVE_FEED:
    if (action.payload) {
      const index = state.items.findIndex((element) => {
        if (element.id === action.payload.id) {
          return true;
        }

        return false;
      });

      return Object.assign({}, state, {
        items: [
          ...state.items.slice(0, index),
          ...state.items.slice(index+1)
        ]
      });
    }
    break;
  default:
    return state;
  }
}
