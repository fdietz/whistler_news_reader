import { createAction } from "redux-actions";
import { combineReducers } from "redux";
import axios from "../../utils/APIHelper";
import normalize from "../../utils/normalize";

export const CREATE_SUBSCRIPTION = "CREATE_SUBSCRIPTION";
export const UPDATE_SUBSCRIPTION = "UPDATE_SUBSCRIPTION";
export const REMOVE_SUBSCRIPTION = "REMOVE_SUBSCRIPTION";
export const FETCH_SUBSCRIPTIONS = "FETCH_SUBSCRIPTIONS";
export const DECREMENT_UNREAD_COUNT = "DECREMENT_UNREAD_COUNT";
export const RESET_UNREAD_COUNT = "RESET_UNREAD_COUNT";

export const createSubscription = createAction(CREATE_SUBSCRIPTION);
export const updateSubscription = createAction(UPDATE_SUBSCRIPTION);
export const removeSubscription = createAction(REMOVE_SUBSCRIPTION);
export const fetchSubscriptions = createAction(FETCH_SUBSCRIPTIONS);
export const decrementUnreadCount = createAction(DECREMENT_UNREAD_COUNT);
export const resetUnreadCount = createAction(RESET_UNREAD_COUNT);

export function requestCreateSubscription(attrs) {
  return dispatch => {
    dispatch(createSubscription());
    return axios.post("/api/subscriptions", { subscription: attrs })
      .then((response) =>
        dispatch(createSubscription(response.data.subscription))
      )
      .catch(e => dispatch(createSubscription(e)));
  };
}

export function requestFetchSubscriptions() {
  return dispatch => {
    dispatch(fetchSubscriptions());
    return axios.get("/api/subscriptions")
      .then(resp => dispatch(fetchSubscriptions(normalize(resp.data.subscriptions))))
      .catch(e => dispatch(fetchSubscriptions(e)));
  };
}

export function requestUpdateSubscription(id, attrs) {
  return dispatch => {
    dispatch(updateSubscription());
    return axios.put(`/api/subscriptions/${id}`, { subscription: attrs })
      .then(() => dispatch(updateSubscription({ id: id, ...attrs })))
      .catch(e => dispatch(updateSubscription(e)));
  };
}

export function requestRemoveSubscription(id) {
  return dispatch => {
    dispatch(removeSubscription());
    return axios.delete(`/api/subscriptions/${id}`)
      .then(() => dispatch(removeSubscription({ id: id })))
      .catch(e => dispatch(removeSubscription(e)));
  };
}

const initialById = {};
const initialListedIds  = [];
const initialIsLoading = false;
const initialError = null;

function isLoading(state = initialIsLoading, action) {
  switch (action.type) {
  case CREATE_SUBSCRIPTION:
  case UPDATE_SUBSCRIPTION:
  case DECREMENT_UNREAD_COUNT:
  case RESET_UNREAD_COUNT:
  case REMOVE_SUBSCRIPTION:
  case FETCH_SUBSCRIPTIONS:
    return !action.payload ? true : false;
  default:
    return state;
  }
}

function error(state = initialError, action) {
  switch (action.type) {
  case CREATE_SUBSCRIPTION:
  case UPDATE_SUBSCRIPTION:
  case DECREMENT_UNREAD_COUNT:
  case RESET_UNREAD_COUNT:
  case REMOVE_SUBSCRIPTION:
  case FETCH_SUBSCRIPTIONS:
    return action.error ? action.payload : state;
  default:
    return state;
  }
}

function subscription(state, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case CREATE_SUBSCRIPTION:
    return action.payload;
  case UPDATE_SUBSCRIPTION:
    return { ...state, ...action.payload };
  case DECREMENT_UNREAD_COUNT:
    return { ...state, unread_count: state.unread_count-1 };
  case RESET_UNREAD_COUNT:
    return { ...state, unread_count: 0 };
  default:
    return state;
  }
}

function listedIds(state = initialListedIds, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case CREATE_SUBSCRIPTION:
    return [...state, action.payload.id];
  case FETCH_SUBSCRIPTIONS:
    return action.payload.ids;
  case REMOVE_SUBSCRIPTION:
    return state.filter(id => id !== action.payload.id);
  default:
    return state;
  }
}

function byId(state = initialById, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
  case CREATE_SUBSCRIPTION:
  case UPDATE_SUBSCRIPTION:
  case DECREMENT_UNREAD_COUNT:
  case RESET_UNREAD_COUNT:
    return {
      ...state,
      [action.payload.id]: subscription(state[action.payload.id], action)
    };
  case REMOVE_SUBSCRIPTION:
    return Object.keys(state).reduce((nextState, id) => {
      /*eslint eqeqeq: 0*/
      if (id != action.payload.id) {
        nextState[id] = { ...state[id] };
      }
      return nextState;
    }, {});
  case FETCH_SUBSCRIPTIONS:
    return action.payload.entities;
  default:
    return state;
  }
}

export default combineReducers({ byId, listedIds, isLoading, error });
