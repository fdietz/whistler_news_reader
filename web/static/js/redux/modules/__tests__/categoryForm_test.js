/*eslint no-undefined: 0*/
import test from "ava";

import { CATEGORY_FORM_UPDATE, CATEGORY_FORM_RESET } from "../categoryForm";
import reducer from "../categoryForm";

test("categoryForm reducer returns default state", t => {
  t.same(reducer(undefined, {}), {
    title: null,
    isLoading: false,
    error: null
  });
});

test("categoryForm reducer handles CATEGORY_FORM_UPDATE with empty payload", t => {
  t.same(reducer(undefined, { type: CATEGORY_FORM_UPDATE, payload: null }), {
    title: null,
    isLoading: true,
    error: null
  });
});

test("categoryForm reducer handles CATEGORY_FORM_UPDATE with payload", t => {
  t.same(reducer(undefined, {
    type: CATEGORY_FORM_UPDATE,
    payload: { title: "new" }
  }), {
    title: "new",
    isLoading: false,
    error: null
  });
});

test("categoryForm reducer handles CATEGORY_FORM_UPDATE with error", t => {
  t.same(reducer(undefined, {
    type: CATEGORY_FORM_UPDATE,
    payload: { error: "message" }
  }), {
    title: null,
    isLoading: false,
    error: "message"
  });
});

test("categoryForm reducer handles CATEGORY_FORM_RESET with empty payload", t => {
  t.same(reducer(undefined, { type: CATEGORY_FORM_RESET, payload: {} }), {
    title: null,
    isLoading: false,
    error: null
  });
});
