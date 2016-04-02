/*eslint no-undefined: 0*/
import test from "ava";

import { CHANGE_SELECTION } from "../currentSidebarSelection";
import reducer from "../currentSidebarSelection";

test("currentSidebarSelection reducer returns default state", t => {
  t.same(reducer(undefined, {}), {
    selection: null,
    isFeed: false,
    isCategory: false
  });
});

test("currentSidebarSelection reducer handles CHANGE_SELECTION with payload", t => {
  t.same(reducer(null, {
    type: CHANGE_SELECTION,
    payload: { selection: { id: 1 }, isFeed: true }
  }), {
    selection: { id: 1 },
    isFeed: true,
    isCategory: false
  });
});
