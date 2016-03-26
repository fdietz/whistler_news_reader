/*eslint no-undefined: 0*/
import test from "ava";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from "nock";

import { requestCreateFeed } from "../feedForm";
import reducer from "../feedForm";
import { FEED_FORM_UPDATE } from "../feedForm";
import { ADD_FEED } from "../feeds";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// test.afterEach(() => {
//   nock.cleanAll();
// });
//
// test.cb("requestCreateFeed dispatches CREATE_FEED action when done", t => {
//   const feedUrl = "http://www.theverge.com/rss/all";
//
//   nock("http://localhost:4000/")
//     .post("/api/feeds", { feed_url: feedUrl })
//     .reply(201, { title: "title", id: 1 });
//
//   const expectedActions = [
//     { type: FEED_FORM_UPDATE, payload: {} },
//     { type: FEED_FORM_UPDATE, payload: { item: { title: "title", id: 1 } } },
//     { type: ADD_FEED, payload: { items: [ { title: "title", id: 1 } ] } }
//   ];
//
//   const store = mockStore({ item: {} }, expectedActions, t.end);
//   store.dispatch(requestCreateFeed(feedUrl));
// });

test("feedForm reducer returns default state", t => {
  t.same(reducer(undefined, {}), {
    feedUrl: null,
    isLoading: false
  });
});

test("feedForm reducer handles FEED_FORM_UPDATE with empty payload", t => {
  t.same(reducer(undefined, { type: FEED_FORM_UPDATE, payload: {} }), {
    isLoading: false
  });
});

test("feedForm reducer handles FEED_FORM_UPDATE with payload", t => {
  t.same(reducer(undefined, {
    type: FEED_FORM_UPDATE,
    payload: { feedUrl: "http://test.de/rss2.xml" }
  }), {
    feedUrl: "http://test.de/rss2.xml",
    isLoading: false
  });
});
