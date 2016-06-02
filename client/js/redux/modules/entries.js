import axios from '../../utils/APIHelper';
import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

import normalize from '../../utils/normalize';

export const FETCH_ENTRIES = 'FETCH_ENTRIES';
export const FETCH_MORE_ENTRIES = 'FETCH_MORE_ENTRIES';
export const REFRESH_ENTRIES = 'REFRESH_ENTRIES';
export const UPDATE_ENTRY = 'UPDATE_ENTRY';
export const MARK_ALL_ENTRIES_AS_READ = 'MARK_ALL_ENTRIES_AS_READ';

export const fetchEntries = createAction(FETCH_ENTRIES);
export const fetchMoreEntries = createAction(FETCH_MORE_ENTRIES);
export const refreshEntries = createAction(REFRESH_ENTRIES);
export const updateEntry = createAction(UPDATE_ENTRY);
export const markAllEntriesAsRead = createAction(MARK_ALL_ENTRIES_AS_READ);

export function requestMarkEntryAsRead(entry) {
  return dispatch => {
    dispatch(updateEntry());
    return axios.put(`/api/subscribed_entries/${entry.id}/mark_as_read`)
      .then(() => dispatch(updateEntry({ id: entry.id, unread: false })))
      .catch(e => dispatch(updateEntry(e)));
  };
}

export function requestMarkAllEntriesAsRead(params) {
  return dispatch => {
    dispatch(markAllEntriesAsRead());
    return axios.put('/api/subscribed_entries/mark_all_as_read', params)
      .then(() => dispatch(markAllEntriesAsRead(params)))
      .catch(e => dispatch(markAllEntriesAsRead(e)));
  };
}

export function requestFetchEntries(options = {}) {
  return dispatch => {
    const params = { ...options, limit: 20 };
    dispatch(fetchEntries());

    return axios.get('/api/subscribed_entries', { params: params })
      .then(response => {
        dispatch(fetchEntries({
          ...normalize(response.data.entries),
          hasMoreEntries: response.data.entries.length === params.limit,
        }));
      })
      .catch(e => dispatch(fetchEntries(e)));
  };
}

export function requestFetchMoreEntries(options = {}) {
  return dispatch => {
    const params = { ...options, limit: 20 };
    dispatch(fetchMoreEntries());

    return axios.get('/api/subscribed_entries', { params: params })
      .then(response =>
          dispatch(fetchMoreEntries({
            ...normalize(response.data.entries),
            hasMoreEntries: response.data.entries.length === params.limit,
          }))
      )
      .catch(e => dispatch(fetchMoreEntries(e)));
  };
}

export function requestLoadMore(requestParams) {
  return (dispatch, getState) => {
    const entries = getState().entries;

    if (entries.hasMoreEntries && !entries.isLoading) {
      const entryId = entries.listedIds[entries.listedIds.length - 1];
      let oldestPublishedEntry = entries.byId[entryId].published;
      let params = { ...requestParams, last_published: oldestPublishedEntry };

      return dispatch(requestFetchMoreEntries(params));
    }

    return Promise.resolve();
  };
}

export function requestRefreshEntries(options = {}) {
  return dispatch => {
    const params = Object.assign(options, {});
    dispatch(refreshEntries());

    return axios.put('/api/subscribed_entries/refresh', params)
    .then(() => dispatch(refreshEntries({})))
    .catch(e => dispatch(refreshEntries(e)));
  };
}

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
