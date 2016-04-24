import { createAction } from "redux-actions";
import { combineReducers } from "redux";
import axios from "../../utils/APIHelper";
import normalize from "../../utils/normalize";

export const SEARCH_FEEDS = "SEARCH_FEEDS";
export const RESET_SEARCH_FEEDS = "RESET_SEARCH_FEEDS";

export const searchFeeds = createAction(SEARCH_FEEDS);
export const resetSearchFeeds = createAction(RESET_SEARCH_FEEDS);

export function requestSearchFeeds(queryString) {
  return dispatch => {
    dispatch(searchFeeds());
    return axios.get("/api/feeds", { params: { q: queryString } })
      .then(resp => dispatch(searchFeeds(normalize(resp.data.feeds))))
      .catch(e => dispatch(searchFeeds(e)));
  };
}

const initialIsLoading = false;
const initialError = null;
const initialListedIds = [];
const initialById = {};

function isLoading(state = initialIsLoading, action) {
  switch (action.type) {
  case SEARCH_FEEDS:
    return !action.payload ? true : false;
  default:
    return state;
  }
}

function error(state = initialError, action) {
  switch (action.type) {
  case SEARCH_FEEDS:
    return action.error ? action.payload : state;
  default:
    return state;
  }
}

function listedIds(state = initialListedIds, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case SEARCH_FEEDS:
    return action.payload.ids;
  case RESET_SEARCH_FEEDS:
    return initialListedIds;
  default:
    return state;
  }
}

function byId(state = initialById, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case SEARCH_FEEDS:
    return action.payload.entities;
  case RESET_SEARCH_FEEDS:
    return initialById;
  default:
    return state;
  }
}

export default combineReducers({ byId, listedIds, isLoading, error });
