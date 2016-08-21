import { combineReducers } from 'redux';

import { ADD_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY, FETCH_CATEGORIES } from '../actions';

const initialById = {};
const initialListedIds = [];
const initialIsLoading = false;
const initialError = null;

function isLoading(state = initialIsLoading, action) {
  switch (action.type) {
    case ADD_CATEGORY:
    case UPDATE_CATEGORY:
    case REMOVE_CATEGORY:
    case FETCH_CATEGORIES:
      return !action.payload;
    default:
      return state;
  }
}

function error(state = initialError, action) {
  switch (action.type) {
    case ADD_CATEGORY:
    case UPDATE_CATEGORY:
    case REMOVE_CATEGORY:
    case FETCH_CATEGORIES:
      return action.error ? action.payload : state;
    default:
      return state;
  }
}

function category(state, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
    case ADD_CATEGORY:
      return action.payload;
    case UPDATE_CATEGORY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function listedIds(state = initialListedIds, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
    case ADD_CATEGORY:
      return [...state, action.payload.id];
    case FETCH_CATEGORIES:
      return action.payload.ids;
    case REMOVE_CATEGORY:
      return state.filter(id => id !== action.payload.id);
    default:
      return state;
  }
}

function byId(state = initialById, action) {
  if (!action.payload) return state;
  if (action.error) return state;

  switch (action.type) {
    case ADD_CATEGORY:
    case UPDATE_CATEGORY:
      return { ...state, [action.payload.id]: category(state[action.payload.id], action) };
    case REMOVE_CATEGORY:
      return Object.keys(state).reduce((nextState, id) => {
      /* eslint eqeqeq: 0 */
        if (id != action.payload.id) {
          nextState[id] = { ...state[id] };
        }
        return nextState;
      }, {});
    case FETCH_CATEGORIES:
      return action.payload.entities;
    default:
      return state;
  }
}

export default combineReducers({ byId, listedIds, isLoading, error });
