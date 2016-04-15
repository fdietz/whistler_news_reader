import { createAction } from "redux-actions";
import { combineReducers } from "redux";
import axios from "../../utils/APIHelper";
import { arrayToIds, arrayToObjMap } from "../../utils/normalize";

export const ADD_FEED    = "ADD_FEED";
export const UPDATE_FEED = "UPDATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";
export const FETCH_FEEDS = "FETCH_FEEDS";
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
      .then(resp => dispatch(fetchFeeds(resp.data.feeds)))
      .catch(e => dispatch(fetchFeeds(e)));
  };
}

export function requestUpdateFeed(id, attrs) {
  return dispatch => {
    dispatch(updateFeed());
    return axios.put(`/api/feeds/${id}`, { feed: attrs })
      .then(() => dispatch(updateFeed({ id: id, ...attrs })))
      .catch(e => dispatch(updateFeed(e)));
  };
}

export function requestRemoveFeed(id) {
  return dispatch => {
    dispatch(removeFeed());
    return axios.delete(`/api/feeds/${id}`)
      .then(() => dispatch(removeFeed({ id: id })))
      .catch(e => dispatch(removeFeed(e)));
  };
}

export function requestUpdateFeedCategory(feedId, categoryId) {
  return dispatch => {
    dispatch(updateFeed());
    return axios.put(`/api/feeds/${feedId}/update_category`, { category_id: categoryId })
      .then(() => dispatch(updateFeed({ id: feedId, category_id: categoryId })))
      .catch(e => dispatch(updateFeed(e)));
  };
}

const initialById = {};
const initialListedIds  = [];
const initialIsLoading = false;
const initialError = null;

function isLoading(state = initialIsLoading, action) {
  switch (action.type) {
  case ADD_FEED:
  case UPDATE_FEED:
  case DECREMENT_UNREAD_COUNT:
  case RESET_UNREAD_COUNT:
  case REMOVE_FEED:
  case FETCH_FEEDS:
    return !action.payload ? true : initialIsLoading;
  default:
    return initialIsLoading;
  }
}

function error(state = initialError, action) {
  if (!action.payload) return state;

  switch (action.type) {
  case ADD_FEED:
  case UPDATE_FEED:
  case DECREMENT_UNREAD_COUNT:
  case RESET_UNREAD_COUNT:
  case REMOVE_FEED:
  case FETCH_FEEDS:
    return action.payload.error ? action.payload.error : initialError;
  default:
    return initialError;
  }
}

function feed(state, action) {
  if (!action.payload) return state;

  switch (action.type) {
  case ADD_FEED:
    return action.payload;
  case UPDATE_FEED:
    return { ...state, ...action.payload };
  case DECREMENT_UNREAD_COUNT:
    return { ...state, unread_count: action.payload.unread_count-1 };
  case RESET_UNREAD_COUNT:
    return { ...state, unread_count: 0 };
  default:
    return state;
  }
}

function listedIds(state = initialListedIds, action) {
  if (!action.payload) return state;

  switch (action.type) {
  case ADD_FEED:
    return [...state, action.payload.id];
  case FETCH_FEEDS:
    return arrayToIds(action.payload);
  case REMOVE_FEED:
    return state.filter(id => id !== action.payload.id);
  default:
    return state;
  }
}

function byId(state = initialById, action) {
  if (!action.payload) return state;

  switch (action.type) {
  case ADD_FEED:
  case UPDATE_FEED:
  case DECREMENT_UNREAD_COUNT:
    return { ...state, [action.payload.id]: feed(state[action.payload.id], action) };
  case RESET_UNREAD_COUNT:
    if (action.payload.id) {
      return { ...state, [action.payload.id]: feed(state[action.payload.id], action) };
    } else if (action.payload.category_id) {
      const matchedIds = listedIds.filter(id => state[id].category_id === action.payload.category_id);
      return Object.keys(state).reduce((nextState, id) => {
        if (matchedIds.indexOf(id) !== -1) {
          nextState[id] = { ...feed(state[action.payload.id], action) };
        }
        return nextState;
      }, {});
    }
    return state;
  case FETCH_FEEDS:
    return arrayToObjMap(action.payload);
  default:
    return state;
  }
}

export default combineReducers({ byId, listedIds, isLoading, error });

// const initial = {
//   entities: {},
//   ids: [],
//   items: [],
//   isLoading: false,
//   error: null
// };
//
// feeds = {
//   items: [],
//   isLoading: false,
//   error: reason
// }
// export default function reducer(state = initial, action) {
//   switch (action.type) {
//   case FETCH_FEEDS:
//     if (action.error) {
//       return { ...state, error: action.payload.message };
//     } else if (action.payload) {
//       return {
//         ...state,
//         ids: action.payload.result.feeds,
//         entities: action.payload.entities.feeds
//       };
//     }
//
//     return { ...state, isLoading: true };
//   case ADD_FEED:
//     if (action.payload) {
//       return { ...state, items: [ ...state.items, action.payload.item ] };
//     }
//     break;
//   case UPDATE_FEED:
//     if (action.payload) {
//       return { ...state, items: state.items.map(item => {
//         if (item.id === action.payload.item.id) {
//           return { ...item, ...action.payload.item };
//         }
//         return item;
//       })};
//     }
//     break;
//   case DECREMENT_UNREAD_COUNT:
//     if (action.payload) {
//       return { ... state, items: state.items.map(item => {
//         if (item.id === action.payload.id) {
//           return { ...item, unread_count: item.unread_count-1 };
//         }
//         return item;
//       })};
//     }
//     break;
//   case RESET_UNREAD_COUNT:
//     if (action.payload.id) {
//       return { ...state, items: state.items.map(item => {
//         if (item.id === action.payload.id) {
//           return { ...item, unread_count: 0 };
//         }
//         return item;
//       })};
//     } else if (action.payload.category_id) {
//       return { ...state, items: state.items.map(item => {
//         if (item.category_id === action.payload.category_id) {
//           return { ...item, unread_count: 0 };
//         }
//         return item;
//       })};
//     }
//     break;
//   case REMOVE_FEED:
//     if (action.payload) {
//       const index = state.items.findIndex(element => element.id === action.payload.id);
//       if (index === -1) return state;
//
//       return Object.assign({}, state, {
//         items: [
//           ...state.items.slice(0, index),
//           ...state.items.slice(index+1)
//         ]
//       });
//     }
//     break;
//   default:
//     return state;
//   }
// }
