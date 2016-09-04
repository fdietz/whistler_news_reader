import { createAction } from 'redux-actions';
import axios from '../../../utils/APIHelper';
import normalize from '../../../utils/normalize';

export const CREATE_SUBSCRIPTION = 'CREATE_SUBSCRIPTION';
export const UPDATE_SUBSCRIPTION = 'UPDATE_SUBSCRIPTION';
export const REMOVE_SUBSCRIPTION = 'REMOVE_SUBSCRIPTION';
export const FETCH_SUBSCRIPTIONS = 'FETCH_SUBSCRIPTIONS';
export const DECREMENT_UNREAD_COUNT = 'DECREMENT_UNREAD_COUNT';
export const RESET_UNREAD_COUNT = 'RESET_UNREAD_COUNT';

export const createSubscription = createAction(CREATE_SUBSCRIPTION);
export const updateSubscription = createAction(UPDATE_SUBSCRIPTION);
export const removeSubscription = createAction(REMOVE_SUBSCRIPTION);
export const fetchSubscriptions = createAction(FETCH_SUBSCRIPTIONS);
export const decrementUnreadCount = createAction(DECREMENT_UNREAD_COUNT);
export const resetUnreadCount = createAction(RESET_UNREAD_COUNT);

export function requestCreateSubscription(attrs) {
  return dispatch => {
    dispatch(createSubscription());
    return axios.post('/api/subscriptions', { subscription: attrs })
      .then(
        response => dispatch(createSubscription(response.data.subscription)),
               e => dispatch(createSubscription(e)));
  };
}

export function requestFetchSubscriptions() {
  return dispatch => {
    dispatch(fetchSubscriptions());
    return axios.get('/api/subscriptions')
      .then(resp => dispatch(fetchSubscriptions(normalize(resp.data.subscriptions))),
               e => dispatch(fetchSubscriptions(e)));
  };
}

export function requestUpdateSubscription(id, attrs) {
  return dispatch => {
    dispatch(updateSubscription());
    return axios.put(`/api/subscriptions/${id}`, { subscription: attrs })
      .then(() => dispatch(updateSubscription({ id, ...attrs })),
             e => dispatch(updateSubscription(e)));
  };
}

export function requestRemoveSubscription(id) {
  return dispatch => {
    dispatch(removeSubscription());
    return axios.delete(`/api/subscriptions/${id}`)
      .then(() => dispatch(removeSubscription({ id })),
             e => dispatch(removeSubscription(e)));
  };
}
