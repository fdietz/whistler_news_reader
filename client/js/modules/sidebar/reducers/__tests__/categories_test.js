/* eslint no-undefined: 0*/
import test from 'ava';
import {
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  FETCH_CATEGORIES,
} from '../../actions/categories';

import reducer from '../categories';


test('categories reducer returns default state', t => {
  t.deepEqual(reducer(undefined, {}), { byId: {}, listedIds: [], isLoading: false, error: null });
});

test('categories reducer ADD_CATEGORY', t => {
  const newState = reducer(undefined, {
    type: ADD_CATEGORY,
    payload: { id: 1 },
  });
  t.deepEqual(newState, {
    byId: {
      1: { id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('categories reducer FETCH_CATEGORIES', t => {
  const newState = reducer(undefined, {
    type: FETCH_CATEGORIES,
    payload: {
      ids: [1],
      entities: {
        1: { id: 1 },
      },
    },
  });
  t.deepEqual(newState, {
    byId: {
      1: { id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('categories reducer UPDATE_CATEGORY', t => {
  const oldState = {
    byId: {
      1: { id: 1, title: 'old' },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  };
  const newState = reducer(oldState, {
    type: UPDATE_CATEGORY,
    payload: { id: 1, title: 'new' },
  });
  t.deepEqual(newState, {
    byId: {
      1: { id: 1, title: 'new' },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('categories reducer REMOVE_CATEGORY', t => {
  const oldState = {
    byId: {
      1: { id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  };
  const newState = reducer(oldState, {
    type: REMOVE_CATEGORY,
    payload: { id: 1 },
  });
  t.deepEqual(newState, {
    byId: {},
    listedIds: [],
    isLoading: false,
    error: null,
  });
});
