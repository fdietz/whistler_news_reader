/* eslint no-undefined: 0*/
import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import reducer, {
  requestCreateFeed,
  FEED_FORM_UPDATE,
  FEED_FORM_RESET,
} from '../feedForm';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(() => {
  nock.disableNetConnect();
});

test.afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

// TODO: fix http request mocking
// test("requestCreateFeed dispatches FEED_FORM_UPDATE action on error", t => {
//   const feedUrl = "http://www.theverge.com/rss/all";
//
//   nock("http://127.0.0.1:80/")
//     .post("/api/feeds", { feed: { feed_url: feedUrl } })
//     .reply(404, {});
//
//   const expectedActions = [
//     { type: FEED_FORM_UPDATE, payload: undefined },
//     { type: FEED_FORM_UPDATE, payload: { errors: [ { feed_url: "Not found" } ] } }
//   ];
//
//   const store = mockStore({ item: {} }, expectedActions);
//   return store.dispatch(requestCreateFeed(feedUrl)).then(result => {
//     t.deepEqual(result, { errors: [ { feed_url: "Not found" } ] });
//   });
// });

// TODO: fix http request mocking
// test("requestCreateFeed dispatches FEED_FORM_RESET action on success", t => {
//   const feedUrl = "http://www.theverge.com/rss/all";
//
//   nock("http://example.com/")
//     .post("/api/feeds", { feed: { feed_url: feedUrl } })
//     .reply(201, { title: "title", id: 1 });
//
//   const expectedActions = [
//     { type: FEED_FORM_UPDATE, payload: undefined },
//     { type: FEED_FORM_RESET, payload: { item: { title: "title", id: 1 } } }
//   ];
//
//   const store = mockStore({ item: {} }, expectedActions);
//   return store.dispatch(requestCreateFeed(feedUrl)).then(result => {
//     t.deepEqual(result, { item: { id: 1, title: "title" } });
//   });
// });

test('feedForm reducer returns default state', t => {
  t.deepEqual(reducer(undefined, {}), {
    searchTerm: '',
    feedExists: false,
    isFeedUrl: false,
    categoryId: null,
    isLoading: false,
    selectedFeed: null,
    errors: null,
  });
});

test('feedForm reducer handles FEED_FORM_UPDATE with empty payload', t => {
  t.deepEqual(reducer(undefined, { type: FEED_FORM_UPDATE, payload: null }), {
    searchTerm: '',
    feedExists: false,
    isFeedUrl: false,
    categoryId: null,
    isLoading: true,
    selectedFeed: null,
    errors: null,
  });
});

test('feedForm reducer handles FEED_FORM_UPDATE with payload', t => {
  t.deepEqual(reducer(undefined, {
    type: FEED_FORM_UPDATE,
    payload: { searchTerm: 'http://test.de/rss2.xml' },
  }), {
    searchTerm: 'http://test.de/rss2.xml',
    feedExists: false,
    isFeedUrl: false,
    categoryId: null,
    isLoading: false,
    selectedFeed: null,
    errors: null,
  });
});
