/* eslint no-undefined: 0*/
import test from 'ava';

import { EDIT_FORM_UPDATE, EDIT_FORM_RESET } from '../editForm';
import reducer from '../editForm';

test('editForm reducer returns default state', t => {
  t.deepEqual(reducer(undefined, {}), {
    title: null,
    isLoading: false,
    error: null,
  });
});

test('editForm reducer handles EDIT_FORM_UPDATE with empty payload', t => {
  t.deepEqual(reducer(undefined, { type: EDIT_FORM_UPDATE, payload: null }), {
    title: null,
    isLoading: true,
    error: null,
  });
});

test('editForm reducer handles EDIT_FORM_UPDATE with payload', t => {
  t.deepEqual(reducer(undefined, {
    type: EDIT_FORM_UPDATE,
    payload: { title: 'new' },
  }), {
    title: 'new',
    isLoading: false,
    error: null,
  });
});

test('editForm reducer handles EDIT_FORM_UPDATE with error', t => {
  t.deepEqual(reducer(undefined, {
    type: EDIT_FORM_UPDATE,
    payload: { error: 'message' },
  }), {
    title: null,
    isLoading: false,
    error: 'message',
  });
});

test('editForm reducer handles EDIT_FORM_RESET with empty payload', t => {
  t.deepEqual(reducer(undefined, { type: EDIT_FORM_RESET, payload: {} }), {
    title: null,
    isLoading: false,
    error: null,
  });
});
