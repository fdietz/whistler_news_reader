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
