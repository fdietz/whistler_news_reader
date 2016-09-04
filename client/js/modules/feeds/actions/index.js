import { createAction } from 'redux-actions';
import axios from '../../../utils/APIHelper';
import normalize from '../../../utils/normalize';

export const SEARCH_FEEDS = 'SEARCH_FEEDS';
export const RESET_SEARCH_FEEDS = 'RESET_SEARCH_FEEDS';

export const searchFeeds = createAction(SEARCH_FEEDS);
export const resetSearchFeeds = createAction(RESET_SEARCH_FEEDS);

export function requestSearchFeeds(queryString) {
  return dispatch => {
    dispatch(searchFeeds());
    return axios.get('/api/feeds', { params: { q: queryString } })
      .then(resp => dispatch(searchFeeds(normalize(resp.data.feeds))),
        e => dispatch(searchFeeds(e)));
  };
}
