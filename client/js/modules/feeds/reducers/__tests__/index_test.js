/* eslint no-undefined: 0*/
import reducer from '../index';
import { SEARCH_FEEDS } from '../../actions';

test('feeds reducer returns default state', () => {
  expect(reducer(undefined, {})).toEqual({ byId: {}, listedIds: [], isLoading: false, error: null });
});

test('feeds reducer SEARCH_FEEDS without payload', () => {
  const newState = reducer(undefined, {
    type: SEARCH_FEEDS,
    payload: null,
  });
  expect(newState).toEqual({
    byId: {}, listedIds: [], isLoading: true, error: null,
  });
});

test('feeds reducer SEARCH_FEEDS with payload', () => {
  const newState = reducer(undefined, {
    type: SEARCH_FEEDS,
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

test('feeds reducer SEARCH_FEEDS with error', () => {
  const newState = reducer(undefined, {
    type: SEARCH_FEEDS,
    error: true,
    payload: { message: 'too short' },
  });
  expect(newState).toEqual({
    byId: {},
    listedIds: [],
    isLoading: false,
    error: { message: 'too short' },
  });
});
