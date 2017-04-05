/* eslint no-undefined: 0*/
import { FETCH_ENTRIES, FETCH_MORE_ENTRIES, UPDATE_ENTRY, MARK_ALL_ENTRIES_AS_READ } from '../../actions';

import reducer from '../index';

test('entries reducer returns default state', () => {
  expect(reducer(undefined, {})).toEqual({
    byId: {}, listedIds: [], isLoading: false, error: null, hasMoreEntries: false
  });
});

test('entries reducer FETCH_ENTRIES with empty payload', () => {
  const newState = reducer(undefined, {
    type: FETCH_ENTRIES,
    payload: null,
  });
  expect(newState).toEqual({
    byId: {}, listedIds: [], isLoading: true, error: null, hasMoreEntries: false,
  });
});

test('entries reducer FETCH_ENTRIES with payload', () => {
  const newState = reducer(undefined, {
    type: FETCH_ENTRIES,
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
    hasMoreEntries: false,
  });
});

test('entries reducer FETCH_ENTRIES with error', () => {
  const newState = reducer(undefined, {
    type: FETCH_ENTRIES,
    error: true,
    payload: { message: 'test' },
  });
  expect(newState).toEqual({
    byId: {},
    listedIds: [],
    isLoading: false,
    error: { message: 'test' },
    hasMoreEntries: false,
  });
});

test('entries reducer FETCH_MORE_ENTRIES with empty payload', () => {
  const newState = reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    payload: null,
  });
  expect(newState).toEqual({
    byId: {}, listedIds: [], isLoading: true, error: null, hasMoreEntries: false,
  });
});

test('entries reducer FETCH_MORE_ENTRIES with payload', () => {
  const newState = reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    payload: {
      ids: [1],
      entities: {
        1: { id: 1 },
      },
      hasMoreEntries: false,
    },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1 },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
    hasMoreEntries: false,
  });
});

test('entries reducer FETCH_MORE_ENTRIES with error', () => {
  const newState = reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    error: true,
    payload: { message: 'test' },
  });
  expect(newState).toEqual({
    byId: {},
    listedIds: [],
    isLoading: false,
    error: { message: 'test' },
    hasMoreEntries: false,
  });
});

test('entries reducer UPDATE_ENTRY with payload', () => {
  const newState = reducer({
    byId: {
      1: { id: 1, title: 'old' },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
  }, {
    type: UPDATE_ENTRY,
    payload: { id: 1, title: 'new' },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1, title: 'new' },
    },
    listedIds: [1],
    isLoading: false,
    error: null,
    hasMoreEntries: false,
  });
});

test('entries reducer MARK_ALL_ENTRIES_AS_READ with payload via subscription_id', () => {
  const today = new Date();
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: true, published: today, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { subscription_id: 1 },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1, unread: false, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: true, published: today, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false,
  });
});

test('entries reducer MARK_ALL_ENTRIES_AS_READ with payload via category_id', () => {
  const today = new Date();
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: true, published: today, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { category_id: 1, subscription_id: 1 },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1, unread: false, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: true, published: today, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false,
  });
});

test('entries reducer MARK_ALL_ENTRIES_AS_READ with payload via all', () => {
  const today = new Date();
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: true, published: today, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { subscription_id: 'all' },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1, unread: false, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: false, published: today, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false,
  });
});

test('entries reducer MARK_ALL_ENTRIES_AS_READ with payload via today', () => {
  const today = new Date();
  const notToday = new Date('2015-01-01');
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: true, published: notToday, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { subscription_id: 'today' },
  });
  expect(newState).toEqual({
    byId: {
      1: { id: 1, unread: false, published: today, category_id: 1, subscription_id: 1 },
      2: { id: 2, unread: true, published: notToday, category_id: 2, subscription_id: 2 },
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false,
  });
});
