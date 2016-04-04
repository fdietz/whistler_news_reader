/*eslint no-undefined: 0*/
import test from "ava";
import {
  FETCH_ENTRIES,
  FETCH_MORE_ENTRIES,
  REFRESH_ENTRIES,
  UPDATE_ENTRY,
  MARK_ALL_ENTRIES_AS_READ
} from "../entries";
import reducer from "../entries";

test("entries reducer returns default state", t => {
  t.same(reducer(undefined, {}), {
    items: [],
    isLoading: false,
    hasMoreEntries: false,
    error: null
  });
});

test("entries reducer FETCH_ENTRIES with empty payload", t => {
  t.same(reducer(undefined, {
    type: FETCH_ENTRIES,
    payload: null
  }), {
    items: [],
    isLoading: true,
    hasMoreEntries: false,
    error: null
  });
});

test("entries reducer FETCH_ENTRIES with payload", t => {
  t.same(reducer(undefined, {
    type: FETCH_ENTRIES,
    payload: { items: [ { id: 1 }]}
  }), {
    items: [ { id: 1 }],
    isLoading: false,
    hasMoreEntries: false,
    error: null
  });
});

test("entries reducer FETCH_ENTRIES with error", t => {
  t.same(reducer(undefined, {
    type: FETCH_ENTRIES,
    error: true,
    payload: { message: "test" }
  }), {
    items: [],
    isLoading: false,
    hasMoreEntries: false,
    error: "test"
  });
});

test("entries reducer FETCH_MORE_ENTRIES with empty payload", t => {
  t.same(reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    payload: null
  }), {
    items: [],
    isLoading: true,
    hasMoreEntries: false,
    error: null
  });
});

test("entries reducer FETCH_MORE_ENTRIES with payload", t => {
  const newState = reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    payload: { items: [ { id: 1 }], hasMoreEntries: false }
  });
  t.same(newState, {
    items: [ { id: 1 }],
    isLoading: false,
    hasMoreEntries: false,
    error: null
  });
});

// test("entries reducer FETCH_MORE_ENTRIES with payload and existing entries", t => {
//   t.same(reducer({ items: [ { id: 2 } ] }, {
//     type: FETCH_MORE_ENTRIES,
//     payload: { items: [ { id: 1 }]}
//   }), {
//     items: [ { id: 2 }, { id: 1 }],
//     isLoading: false,
//     hasMoreEntries: false,
//     error: null
//   });
// });

test("entries reducer FETCH_MORE_ENTRIES with error", t => {
  t.same(reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    error: true,
    payload: { message: "test" }
  }), {
    items: [],
    isLoading: false,
    hasMoreEntries: false,
    error: "test"
  });
});

test("entries reducer REFRESH_ENTRIES with empty payload", t => {
  t.same(reducer(undefined, {
    type: REFRESH_ENTRIES,
    payload: null
  }), {
    items: [],
    isLoading: true,
    hasMoreEntries: false,
    error: null
  });
});

test("entries reducer REFRESH_ENTRIES with payload", t => {
  t.same(reducer(undefined, {
    type: REFRESH_ENTRIES,
    payload: {}
  }), {
    items: [],
    isLoading: false,
    hasMoreEntries: false,
    error: null
  });
});

test("entries reducer UPDATE_ENTRY with payload", t => {
  t.same(reducer({ items: [ { id: 1, title: "old" } ] }, {
    type: UPDATE_ENTRY,
    payload: { item: { id: 1, title: "new" } }
  }), {
    items: [ { id: 1, title: "new" }]
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via feed_id", t => {
  const today = new Date();
  const newState = reducer({
    items: [
      { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    ]
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { feed_id: 1 }
  });
  t.same(newState, {
    items: [
      { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    ],
    isLoading: false
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via category_id", t => {
  const today = new Date();
  const newState = reducer({
    items: [
      { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    ]
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { category_id: 1 }
  });
  t.same(newState, {
    items: [
      { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    ],
    isLoading: false
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via all", t => {
  const today = new Date();
  const newState = reducer({
    items: [
      { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    ]
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { feed_id: "all" }
  });
  t.same(newState, {
    items: [
      { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: false, published: today, feed: { id: 2, category_id: 2 } }
    ],
    isLoading: false
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via today", t => {
  const today = new Date();
  const notToday = new Date("2015-01-01");
  const newState = reducer({
    items: [
      { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: true, published: notToday, feed: { id: 2, category_id: 2 } }
    ]
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { feed_id: "today" }
  });
  t.same(newState, {
    items: [
      { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      { id: 2, unread: true, published: notToday, feed: { id: 2, category_id: 2 } }
    ],
    isLoading: false
  });
});
