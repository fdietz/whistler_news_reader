import { combineReducers } from 'redux';

import {
  CREATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION,
  DECREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT,
  REMOVE_SUBSCRIPTION,
  FETCH_SUBSCRIPTIONS
  } from '../actions';

const initialById = {};
const initialListedIds = [];
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
      return !action.payload;
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
      return { ...state, unread_count: state.unread_count - 1 };
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
        [action.payload.id]: subscription(state[action.payload.id], action),
      };
    case REMOVE_SUBSCRIPTION:
      return Object.keys(state).reduce((nextState, id) => {
      /* eslint eqeqeq: 0*/
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
