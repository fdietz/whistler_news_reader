import { createAction } from 'redux-actions';
import axios from '../../../utils/APIHelper';

import normalize from '../../../utils/normalize';

import { showRetryNotification } from '../../notification/actions';

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

    return axios.get('/api/subscribed_entries', { params })
      .then(response => {
        dispatch(fetchEntries({
          ...normalize(response.data.entries),
          hasMoreEntries: response.data.entries.length === params.limit,
        }));
      })
      .catch(e => {
        dispatch(fetchEntries(e));
        dispatch(showRetryNotification('Fetching failed',
          () => dispatch(requestFetchEntries(options)),
          { type: 'error', }));
        return Promise.reject(e);
      });
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
    .catch(e => {
      dispatch(refreshEntries(e));
      dispatch(showRetryNotification('Refresh failed',
        () => dispatch(requestRefreshEntries(options)),
        { type: 'error', }));
      return Promise.reject(e);
    });
  };
}
