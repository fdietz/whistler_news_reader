/*eslint no-undefined: 0*/
import test from "ava";
import reducer, {
  SEARCH_FEEDS
} from "../feeds";

test("feeds reducer returns default state", t => {
  t.same(reducer(undefined, {}), { byId: {}, listedIds: [], isLoading: false, error: null });
});

test("feeds reducer SEARCH_FEEDS without payload", t => {
  const newState = reducer(undefined, {
    type: SEARCH_FEEDS,
    payload: null
  });
  t.same(newState, {
    byId: {}, listedIds: [], isLoading: true, error: null
  });
});

test("feeds reducer SEARCH_FEEDS with payload", t => {
  const newState = reducer(undefined, {
    type: SEARCH_FEEDS,
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

test("feeds reducer SEARCH_FEEDS with error", t => {
  const newState = reducer(undefined, {
    type: SEARCH_FEEDS,
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
