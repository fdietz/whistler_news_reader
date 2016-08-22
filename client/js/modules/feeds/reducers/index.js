import { combineReducers } from 'redux';

import { SEARCH_FEEDS, RESET_SEARCH_FEEDS } from '../actions';

const initialIsLoading = false;
const initialError = null;
const initialListedIds = [];
const initialById = {};

function isLoading(state = initialIsLoading, action) {
  switch (action.type) {
    case SEARCH_FEEDS:
      return !action.payload;
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
