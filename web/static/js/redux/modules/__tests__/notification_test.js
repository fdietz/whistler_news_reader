/*eslint no-undefined: 0*/
import test from "ava";
import {
  CREATE_NOTIFICATION,
  RESET_NOTIFICATION
} from "../notification";
import reducer from "../notification";

test("notification reducer returns default state", t => {
  t.same(reducer(undefined, {}), null);
});

test("notification reducer CREATE_NOTIFICATION", t => {
  t.same(reducer(undefined, {
    type: CREATE_NOTIFICATION,
    payload: { message: "test" }
  }), {
    message: "test"
  });
});

test("notification reducer RESET_NOTIFICATION", t => {
  t.same(reducer(undefined, {
    type: RESET_NOTIFICATION,
    payload: null
  }), null);
});
