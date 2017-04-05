/* eslint no-undefined: 0*/
import { FETCH_SUBSCRIPTIONS, REMOVE_SUBSCRIPTION, CREATE_SUBSCRIPTION, UPDATE_SUBSCRIPTION, DECREMENT_UNREAD_COUNT, RESET_UNREAD_COUNT } from '../../actions';

import reducer from '../index';

test('subscriptions reducer returns default state', () => {
  expect(reducer(undefined, {})).toEqual({ byId: {}, listedIds: [], isLoading: false, error: null });
});

test('subscriptions reducer FETCH_SUBSCRIPTIONS without payload', () => {
  const newState = reducer(undefined, {
    type: FETCH_SUBSCRIPTIONS,
    payload: null,
  });
  expect(newState).toEqual({
    byId: {}, listedIds: [], isLoading: true, error: null,
  });
});

test('subscriptions reducer FETCH_SUBSCRIPTIONS with payload', () => {
  const newState = reducer(undefined, {
    type: FETCH_SUBSCRIPTIONS,
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

test('subscriptions reducer FETCH_SUBSCRIPTIONS with error', () => {
  const newState = reducer(undefined, {
    type: FETCH_SUBSCRIPTIONS,
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

test('subscriptions reducer CREATE_SUBSCRIPTION with payload', () => {
  const newState = reducer(undefined, {
    type: CREATE_SUBSCRIPTION,
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

test('subscriptions reducer UPDATE_SUBSCRIPTION with payload', () => {
  const oldState = {
    byId: {
      1: { id: 1, title: 'old' },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  };
  const newState = reducer(oldState, {
    type: UPDATE_SUBSCRIPTION,
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

test('subscriptions reducer DECREMENT_UNREAD_COUNT', () => {
  const oldState = {
    byId: {
      1: { id: 1, unread_count: 2 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  };
  const newState = reducer(oldState, {
    type: DECREMENT_UNREAD_COUNT,
    payload: { id: 1 },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1, unread_count: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('subscriptions reducer RESET_UNREAD_COUNT for feed_id', () => {
  const oldState = {
    byId: {
      1: { id: 1, unread_count: 2, category_id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  };
  const newState = reducer(oldState, {
    type: RESET_UNREAD_COUNT,
    payload: { id: 1 },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1, unread_count: 0, category_id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  });
});

test('subscriptions reducer REMOVE_SUBSCRIPTION with payload', () => {
  const oldState = {
    byId: {
      1: { id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  };
  const newState = reducer(oldState, {
    type: REMOVE_SUBSCRIPTION,
    payload: { id: 1 },
  });
  expect(newState).toEqual({
    byId: {},
    listedIds: [],
    isLoading: false,
    error: null,
  });
});
