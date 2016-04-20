/*eslint no-undefined: 0*/
import test from "ava";

import reducer, {
  FETCH_ENTRIES,
  FETCH_MORE_ENTRIES,
  REFRESH_ENTRIES,
  UPDATE_ENTRY,
  MARK_ALL_ENTRIES_AS_READ
} from "../entries";

test("entries reducer returns default state", t => {
  t.same(reducer(undefined, {}), { byId: {}, listedIds: [], isLoading: false, error: null, hasMoreEntries: false });
});

test("entries reducer FETCH_ENTRIES with empty payload", t => {
  const newState = reducer(undefined, {
    type: FETCH_ENTRIES,
    payload: null
  });
  t.same(newState, {
    byId: {}, listedIds: [], isLoading: true, error: null, hasMoreEntries: false
  });
});

test("entries reducer FETCH_ENTRIES with payload", t => {
  const newState = reducer(undefined, {
    type: FETCH_ENTRIES,
    payload: {
      ids: [1],
      entities: {
        1: { id: 1 }
      }
    }
  });
  t.same(newState, {
    byId: {
      1: { id: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null,
    hasMoreEntries: false
  });
});

test("entries reducer FETCH_ENTRIES with error", t => {
  const newState = reducer(undefined, {
    type: FETCH_ENTRIES,
    error: true,
    payload: { message: "test" }
  });
  t.same(newState, {
    byId: {},
    listedIds: [],
    isLoading: false,
    error: { message: "test" },
    hasMoreEntries: false
  });
});

test("entries reducer FETCH_MORE_ENTRIES with empty payload", t => {
  const newState = reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    payload: null
  });
  t.same(newState, {
    byId: {}, listedIds: [], isLoading: true, error: null, hasMoreEntries: false
  });
});

test("entries reducer FETCH_MORE_ENTRIES with payload", t => {
  const newState = reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    payload: {
      ids: [1],
      entities: {
        1: { id: 1 }
      },
      hasMoreEntries: false
    }
  });
  t.same(newState, {
    byId: {
      1: { id: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null,
    hasMoreEntries: false
  });
});

test("entries reducer FETCH_MORE_ENTRIES with error", t => {
  const newState = reducer(undefined, {
    type: FETCH_MORE_ENTRIES,
    error: true,
    payload: { message: "test" }
  });
  t.same(newState, {
    byId: {},
    listedIds: [],
    isLoading: false,
    error: { message: "test" },
    hasMoreEntries: false
  });
});

test("entries reducer REFRESH_ENTRIES with empty payload", t => {
  const newState = reducer(undefined, {
    type: REFRESH_ENTRIES,
    payload: null
  });
  t.same(newState, {
    byId: {}, listedIds: [], isLoading: true, error: null, hasMoreEntries: false
  });
});

// TODO: consider using alwasy FETCH_ENTRIES instead
// test("entries reducer REFRESH_ENTRIES with payload", t => {
//   const newState = reducer(undefined, {
//     type: REFRESH_ENTRIES,
//     payload: {}
//   });
//   t.same(newState, {
//     byId: {}, listedIds: [], isLoading: true, error: null, hasMoreEntries: false
//   });
// });

test("entries reducer UPDATE_ENTRY with payload", t => {
  const newState = reducer({
    byId: {
      1: { id: 1, title: "old" }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  }, {
    type: UPDATE_ENTRY,
    payload: { id: 1, title: "new" }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, title: "new" }
    },
    listedIds: [1],
    isLoading: false,
    error: null,
    hasMoreEntries: false
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via feed_id", t => {
  const today = new Date();
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { feed_id: 1 }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via category_id", t => {
  const today = new Date();
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { category_id: 1 }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via all", t => {
  const today = new Date();
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: true, published: today, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { feed_id: "all" }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: false, published: today, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false
  });
});

test("entries reducer MARK_ALL_ENTRIES_AS_READ with payload via today", t => {
  const today = new Date();
  const notToday = new Date("2015-01-01");
  const newState = reducer({
    byId: {
      1: { id: 1, unread: true, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: true, published: notToday, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null
  }, {
    type: MARK_ALL_ENTRIES_AS_READ,
    payload: { feed_id: "today" }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, unread: false, published: today, feed: { id: 1, category_id: 1 } },
      2: { id: 1, unread: true, published: notToday, feed: { id: 2, category_id: 2 } }
    },
    listedIds: [1, 2],
    isLoading: false,
    error: null,
    hasMoreEntries: false
  });
});
