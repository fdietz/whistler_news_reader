/* eslint no-undefined: 0*/
import { ADD_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY, FETCH_CATEGORIES } from '../../actions';

import reducer from '../index';


test('categories reducer returns default state', () => {
  expect(reducer(undefined, {})).toEqual({ byId: {}, listedIds: [], isLoading: false, error: null });
});

test('categories reducer ADD_CATEGORY', () => {
  const newState = reducer(undefined, {
    type: ADD_CATEGORY,
    payload: { id: 1 },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('categories reducer FETCH_CATEGORIES', () => {
  const newState = reducer(undefined, {
    type: FETCH_CATEGORIES,
    payload: {
      ids: [1],
      entities: {
        1: { id: 1 },
      },
    },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('categories reducer UPDATE_CATEGORY', () => {
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
  expect(newState).toEqual({
    byId: {
      1: { id: 1, title: 'new' },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('categories reducer REMOVE_CATEGORY', () => {
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
  expect(newState).toEqual({
    byId: {},
    listedIds: [],
    isLoading: false,
    error: null,
  });
});
