/*eslint no-undefined: 0*/
import test from "ava";
import reducer, {
  FETCH_FEEDS,
  REMOVE_FEED,
  ADD_FEED,
  UPDATE_FEED,
  DECREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT
} from "../feeds";

test("feeds reducer returns default state", t => {
  t.same(reducer(undefined, {}), { byId: {}, listedIds: [], isLoading: false, error: null });
});

test("feeds reducer FETCH_FEEDS without payload", t => {
  const newState = reducer(undefined, {
    type: FETCH_FEEDS,
    payload: null
  });
  t.same(newState, {
    byId: {}, listedIds: [], isLoading: true, error: null
  });
});

test("feeds reducer FETCH_FEEDS with payload", t => {
  const newState = reducer(undefined, {
    type: FETCH_FEEDS,
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
    error: null
  });
});

test("feeds reducer FETCH_FEEDS with error", t => {
  const newState = reducer(undefined, {
    type: FETCH_FEEDS,
    error: true,
    payload: { message: "too short" }
  });
  t.same(newState, {
    byId: {},
    listedIds: [],
    isLoading: false,
    error: { message: "too short" }
  });
});

test("feeds reducer ADD_FEED with payload", t => {
  const newState = reducer(undefined, {
    type: ADD_FEED,
    payload: { id: 1 }
  });
  t.same(newState, {
    byId: {
      1: { id: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  });
});

test("feeds reducer UPDATE_FEED with payload", t => {
  const oldState = {
    byId: {
      1: { id: 1, title: "old" }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  };
  const newState = reducer(oldState, {
    type: UPDATE_FEED,
    payload: { id: 1, title: "new" }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, title: "new" }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  });
});

test("feeds reducer DECREMENT_UNREAD_COUNT", t => {
  const oldState = {
    byId: {
      1: { id: 1, unread_count: 2 }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  };
  const newState = reducer(oldState, {
    type: DECREMENT_UNREAD_COUNT,
    payload: { id: 1 }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, unread_count: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  });
});

test("feeds reducer RESET_UNREAD_COUNT for feed_id", t => {
  const oldState = {
    byId: {
      1: { id: 1, unread_count: 2, category_id: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  };
  const newState = reducer(oldState, {
    type: RESET_UNREAD_COUNT,
    payload: { id: 1 }
  });
  t.same(newState, {
    byId: {
      1: { id: 1, unread_count: 0, category_id: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  });
});

test("feeds reducer REMOVE_FEED with payload", t => {
  const oldState = {
    byId: {
      1: { id: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  };
  const newState = reducer(oldState, {
    type: REMOVE_FEED,
    payload: { id: 1 }
  });
  t.same(newState, {
    byId: {},
    listedIds: [],
    isLoading: false,
    error: null
  });
});
