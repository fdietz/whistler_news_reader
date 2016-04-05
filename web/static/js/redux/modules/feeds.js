import { createAction } from "redux-actions";

import axios from "../../utils/APIHelper";

export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const FETCH_FEEDS = "FETCH_FEEDS";
export const ADD_FEED    = "ADD_FEED";
export const DECREMENT_UNREAD_COUNT = "DECREMENT_UNREAD_COUNT";
export const RESET_UNREAD_COUNT = "RESET_UNREAD_COUNT";

export const addFeed    = createAction(ADD_FEED);
export const updateFeed = createAction(UPDATE_FEED);
export const removeFeed = createAction(REMOVE_FEED);
export const fetchFeeds = createAction(FETCH_FEEDS);
export const decrementUnreadCount = createAction(DECREMENT_UNREAD_COUNT);
export const resetUnreadCount = createAction(RESET_UNREAD_COUNT);

export function requestFetchFeeds() {
  return dispatch => {
    dispatch(fetchFeeds());

    return axios.get("/api/feeds")
    .then((response) => {
      dispatch(fetchFeeds({ items: response.data.feeds }));
    })
    .catch((response) => {
      dispatch(fetchFeeds(new Error(response.data.errors)));
    });
  };
}

export function requestUpdateFeed(feedId, feedAttributes) {
  return dispatch => {
    return axios.put(`http://localhost:4000/api/feeds/${feedId}`, { feed: feedAttributes })
    .then((response) => {
      return dispatch(updateFeed({ item: feedAttributes }));
    })
    .catch((response) => {
      return dispatch(updateFeed(new Error(response.data.errors)));
    });
  };
}

export function requestRemoveFeed(feedId) {
  return dispatch => {
    return axios.delete(`http://localhost:4000/api/feeds/${feedId}`)
    .then(() => {
      dispatch(removeFeed({ id: feedId }));
    })
    .catch((response) => {
      dispatch(removeFeed(new Error(response.data.errors)));
    });
  };
}

export function requestUpdateFeedCategory(feedId, categoryId) {
  return dispatch => {
    return axios.put(`/api/feeds/${feedId}/update_category`, { category_id: categoryId })
    .then((response) => {
      dispatch(updateFeed({ item: { id: feedId, category_id: categoryId } }));
    })
    .catch((response) => {
      dispatch(updateFeed(new Error(response.data.errors)));
    });
  };
}

const initial = {
  items: [],
  isLoading: false,
  error: null
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
      return { ...state, error: action.payload.message };
    } else if (action.payload) {
      return { ...state, items: action.payload.items };
    }

    return { ...state, isLoading: true };
  case ADD_FEED:
    if (action.payload) {
      return { ...state, items: [ ...state.items, action.payload.item ] };
    }
    break;
  case UPDATE_FEED:
    if (action.payload) {
      return { ...state, items: state.items.map(item => {
        if (item.id === action.payload.item.id) {
          return { ...item, ...action.payload.item };
        }
        return item;
      })};
    }
    break;
  case DECREMENT_UNREAD_COUNT:
    if (action.payload) {
      return { ... state, items: state.items.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, unread_count: item.unread_count-1 };
        }
        return item;
      })};
    }
    break;
  case RESET_UNREAD_COUNT:
    if (action.payload.id) {
      return { ...state, items: state.items.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, unread_count: 0 };
        }
        return item;
      })};
    } else if (action.payload.category_id) {
      return { ...state, items: state.items.map(item => {
        if (item.category_id === action.payload.category_id) {
          return { ...item, unread_count: 0 };
        }
        return item;
      })};
    }
    break;
  case REMOVE_FEED:
    if (action.payload) {
      const index = state.items.findIndex(element => element.id === action.payload.id);
      if (index === -1) return state;

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
