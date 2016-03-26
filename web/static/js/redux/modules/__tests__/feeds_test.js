/*eslint no-undefined: 0*/
import test from "ava";
import reducer from "../feeds";

test("feeds reducer returns default state", t => {
  t.same(reducer(undefined, {}), { items: [], isLoading: false});
});

test("feeds reducer DECREMENT_UNREAD_COUNT", t => {
  t.pass();
});
