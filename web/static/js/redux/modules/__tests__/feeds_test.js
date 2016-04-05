/*eslint no-undefined: 0*/
import test from "ava";
import {
  FETCH_FEEDS,
  REMOVE_FEED,
  ADD_FEED,
  UPDATE_FEED,
  DECREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT
} from "../feeds";
import reducer from "../feeds";

test("feeds reducer returns default state", t => {
  t.same(reducer(undefined, {}), { items: [], isLoading: false, error: null });
});

test("feeds reducer FETCH_FEEDS without payload", t => {
  t.same(reducer(undefined, {
    type: FETCH_FEEDS,
    payload: null
  }), {
    items: [], isLoading: true, error: null
  });
});

test("feeds reducer FETCH_FEEDS with payload", t => {
  t.same(reducer(undefined, {
    type: FETCH_FEEDS,
    payload: { items: [{ id: 1 }] }
  }), {
    items: [{ id: 1 }], isLoading: false, error: null
  });
});

test("feeds reducer FETCH_FEEDS with error", t => {
  t.same(reducer(undefined, {
    type: FETCH_FEEDS,
    error: true,
    payload: { message: "too short" }
  }), {
    items: [], isLoading: false, error: "too short"
  });
});

test("feeds reducer ADD_FEED with payload", t => {
  t.same(reducer(undefined, {
    type: ADD_FEED,
    payload: { item: { id: 1 } }
  }), {
    items: [{ id: 1 }], isLoading: false, error: null
  });
});

test("feeds reducer UPDATE_FEED with payload", t => {
  t.same(reducer({ items: [{ id: 1, title: "old" }] }, {
    type: UPDATE_FEED,
    payload: { item: { id: 1, title: "new" } }
  }), {
    items: [{ id: 1, title: "new" }]
  });
});

test("feeds reducer DECREMENT_UNREAD_COUNT", t => {
  t.same(reducer({ items: [{ id: 1, unread_count: 2 }] }, {
    type: DECREMENT_UNREAD_COUNT,
    payload: { id: 1 }
  }), {
    items: [{ id: 1, unread_count: 1 }]
  });
});

test("feeds reducer RESET_UNREAD_COUNT for feed_id", t => {
  const newState = reducer({ items: [{ id: 1, unread_count: 2, category_id: 1 }] }, {
    type: RESET_UNREAD_COUNT,
    payload: { id: 1 }
  });
  t.same(newState, {
    items: [{ id: 1, unread_count: 0, category_id: 1 }]
  });
});

test("feeds reducer RESET_UNREAD_COUNT for category_id", t => {
  const newState = reducer({ items: [{ id: 1, unread_count: 2, category_id: 1 }] }, {
    type: RESET_UNREAD_COUNT,
    payload: { category_id: 1 }
  });
  t.same(newState, {
    items: [{ id: 1, unread_count: 0, category_id: 1 }]
  });
});

test("feeds reducer REMOVE_FEED with payload", t => {
  t.same(reducer({ items: [{ id: 1 }] }, {
    type: REMOVE_FEED,
    payload: { id: 1 }
  }), {
    items: []
  });
});
