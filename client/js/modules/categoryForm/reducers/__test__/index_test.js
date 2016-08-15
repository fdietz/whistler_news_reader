/* eslint no-undefined: 0*/
import test from 'ava';

import { CATEGORY_FORM_UPDATE, CATEGORY_FORM_RESET } from '../../actions';
import reducer from '../index';

test('categoryForm reducer returns default state', t => {
  t.deepEqual(reducer(undefined, {}), {
    title: '',
    isLoading: false,
    errors: null,
  });
});

test('categoryForm reducer handles CATEGORY_FORM_UPDATE with empty payload', t => {
  t.deepEqual(reducer(undefined, { type: CATEGORY_FORM_UPDATE, payload: null }), {
    title: '',
    isLoading: true,
    errors: null,
  });
});

test('categoryForm reducer handles CATEGORY_FORM_UPDATE with payload', t => {
  t.deepEqual(reducer(undefined, {
    type: CATEGORY_FORM_UPDATE,
    payload: { title: 'new' },
  }), {
    title: 'new',
    isLoading: false,
    errors: null,
  });
});

test('categoryForm reducer handles CATEGORY_FORM_UPDATE with error', t => {
  t.deepEqual(reducer(undefined, {
    type: CATEGORY_FORM_UPDATE,
    payload: { errors: 'message' },
  }), {
    title: '',
    isLoading: false,
    errors: 'message',
  });
});

test('categoryForm reducer handles CATEGORY_FORM_RESET with empty payload', t => {
  t.deepEqual(reducer(undefined, { type: CATEGORY_FORM_RESET, payload: {} }), {
    title: '',
    isLoading: false,
    errors: null,
  });
});
