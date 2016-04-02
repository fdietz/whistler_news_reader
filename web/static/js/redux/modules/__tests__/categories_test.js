/*eslint no-undefined: 0*/
import test from "ava";
import {
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  FETCH_CATEGORIES,
  TOGGLE_EXPAND_CATEGORY
} from "../categories";
import reducer from "../categories";

test("feeds reducer returns default state", t => {
  t.same(reducer(undefined, {}), { items: [] });
});

test("feeds reducer ADD_CATEGORY", t => {
  t.same(reducer(undefined, {
    type: ADD_CATEGORY,
    payload: { category: { id: 1 } }
  }), {
    items: [{ id: 1 }]
  });
});

test("feeds reducer FETCH_CATEGORIES", t => {
  t.same(reducer(null, {
    type: FETCH_CATEGORIES,
    payload: { items: [{ id: 1 }] }
  }), {
    items: [{ id: 1 }]
  });
});

test("feeds reducer UPDATE_CATEGORY", t => {
  t.same(reducer({ items: [{ id: 1, title: "old" }]}, {
    type: UPDATE_CATEGORY,
    payload: { item: { id: 1, title: "new" } }
  }), {
    items: [{ id: 1, title: "new" }]
  });
});

test("feeds reducer TOGGLE_EXPAND_CATEGORY", t => {
  t.same(reducer({ items: [{ id: 1, expanded: false }]}, {
    type: TOGGLE_EXPAND_CATEGORY,
    payload: { id: 1 }
  }), {
    items: [{ id: 1, expanded: true }]
  });
});

test("feeds reducer REMOVE_CATEGORY", t => {
  t.same(reducer({ items: [{ id: 1 }]}, {
    type: REMOVE_CATEGORY,
    payload: { id: 1 }
  }), {
    items: []
  });
});
