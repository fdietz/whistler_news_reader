import { combineReducers } from 'redux';

import { FETCH_ENTRIES, FETCH_MORE_ENTRIES, REFRESH_ENTRIES, UPDATE_ENTRY, MARK_ALL_ENTRIES_AS_READ } from '../actions';

const initialById = {};
const initialListedIds = [];
const initialIsLoading = false;
const initialError = null;
const initialHasMoreEntries = false;

function hasMoreEntries(state = initialHasMoreEntries, action) {
  if (!action.payload) return state;

  switch (action.type) {
    case FETCH_ENTRIES:
    case FETCH_MORE_ENTRIES:
      return action.payload.hasMoreEntries ? true : false;
    default:
      return state;
  }
}

function isLoading(state = initialIsLoading, action) {
  switch (action.type) {
    case FETCH_ENTRIES:
    case FETCH_MORE_ENTRIES:
    case REFRESH_ENTRIES:
      return !action.payload ? true : false;
    default:
      return state;
  }
}

function error(state = initialError, action) {
  switch (action.type) {
    case UPDATE_ENTRY:
    case FETCH_ENTRIES:
    case FETCH_MORE_ENTRIES:
      return action.error ? action.payload : state;
    default:
      return state;
  }
}

function entryReducer(state, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
    case UPDATE_ENTRY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function listedIds(state = initialListedIds, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
    case FETCH_ENTRIES:
      return action.payload.ids;
    case FETCH_MORE_ENTRIES:
      return [...state, ...action.payload.ids];
    case REFRESH_ENTRIES:
      return state;
    default:
      return state;
  }
}

function byId(state = initialById, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
    case UPDATE_ENTRY:
      return {
        ...state,
        [action.payload.id]: entryReducer(state[action.payload.id], action),
      };
    case REFRESH_ENTRIES:
      return state;
    case FETCH_ENTRIES:
      return action.payload.entities;
    case FETCH_MORE_ENTRIES:
      return { ...state, ...action.payload.entities };
    case MARK_ALL_ENTRIES_AS_READ:
      if (action.payload.subscription_id === 'all') {
        return Object.keys(state).reduce((nextState, id) => {
          nextState[id] = { ...state[id], unread: false };
          return nextState;
        }, {});
      } else if (action.payload.subscription_id === 'today') {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setDate(endOfToday.getDate() + 1);
        endOfToday.setHours(0, 0, 0, 0);

        return Object.keys(state).reduce((nextState, id) => {
          const publishedDate = state[id].published instanceof Date
          ? state[id].published
          : new Date(state[id].published);
          publishedDate.setHours(0, 0, 0, 0);

          if (publishedDate >= startOfToday && publishedDate < endOfToday) {
            nextState[id] = { ...state[id], unread: false };
          } else {
            nextState[id] = state[id];
          }
          return nextState;
        }, {});
      } else if (action.payload.subscription_id) {
        return Object.keys(state).reduce((nextState, id) => {
          if (state[id].subscription_id === action.payload.subscription_id) {
            nextState[id] = { ...state[id], unread: false };
          } else {
            nextState[id] = state[id];
          }
          return nextState;
        }, {});
      } else if (action.payload.category_id) {
        return Object.keys(state).reduce((nextState, id) => {
          if (state[id].category_id === action.payload.category_id) {
            nextState[id] = { ...state[id], unread: false };
          } else {
            nextState[id] = state[id];
          }
          return nextState;
        }, {});
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({ byId, listedIds, isLoading, error, hasMoreEntries });
