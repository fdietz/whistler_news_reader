/*eslint no-undefined: 0*/
import test from "ava";
import reducer, {
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  FETCH_CATEGORIES
} from "../categories";

test("categories reducer returns default state", t => {
  t.same(reducer(undefined, {}), { byId: {}, listedIds: [], isLoading: false, error: null });
});

test("categories reducer ADD_CATEGORY", t => {
  const newState = reducer(undefined, {
    type: ADD_CATEGORY,
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

test("categories reducer FETCH_CATEGORIES", t => {
  const newState = reducer(undefined, {
    type: FETCH_CATEGORIES,
    payload: [{ id: 1 }]
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

test("categories reducer UPDATE_CATEGORY", t => {
  const oldState = {
    byId: {
      1: { id: 1, title: "old" }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  };
  const newState = reducer(oldState, {
    type: UPDATE_CATEGORY,
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

test("categories reducer REMOVE_CATEGORY", t => {
  const oldState = {
    byId: {
      1: { id: 1 }
    },
    listedIds: [1],
    isLoading: false,
    error: null
  };
  const newState = reducer(oldState, {
    type: REMOVE_CATEGORY,
    payload: { id: 1 }
  });
  t.same(newState, {
    byId: {},
    listedIds: [],
    isLoading: false,
    error: null
  });
});
