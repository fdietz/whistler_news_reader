import test from "ava";

import { SELECT_ENTRY } from "../currentEntry";
import reducer from "../currentEntry";

test("currentEntry reducer returns default state", t => {
  t.same(reducer(null, {}), null);
});

test("currentEntry reducer handles SELECT_ENTRY with payload", t => {
  t.same(reducer(null, { type: SELECT_ENTRY, payload: { entry: { id: 1 } } }), {
    id: 1
  });
});
