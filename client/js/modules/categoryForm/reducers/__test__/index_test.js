/* eslint no-undefined: 0*/
import { CATEGORY_FORM_UPDATE, CATEGORY_FORM_RESET } from '../../actions';
import reducer from '../index';

test('categoryForm reducer returns default state', () => {
  expect(reducer(undefined, {})).toEqual({
    title: '',
    isLoading: false,
    errors: null,
  });
});

test('categoryForm reducer handles CATEGORY_FORM_UPDATE with empty payload', () => {
  expect(reducer(undefined, { type: CATEGORY_FORM_UPDATE, payload: null })).toEqual({
    title: '',
    isLoading: true,
    errors: null,
  });
});

test('categoryForm reducer handles CATEGORY_FORM_UPDATE with payload', () => {
  expect(reducer(undefined, {
    type: CATEGORY_FORM_UPDATE,
    payload: { title: 'new' },
  })).toEqual({
    title: 'new',
    isLoading: false,
    errors: null,
  });
});

test('categoryForm reducer handles CATEGORY_FORM_UPDATE with error', () => {
  expect(reducer(undefined, {
    type: CATEGORY_FORM_UPDATE,
    payload: { errors: 'message' },
  })).toEqual({
    title: '',
    isLoading: false,
    errors: 'message',
  });
});

test('categoryForm reducer handles CATEGORY_FORM_RESET with empty payload', () => {
  expect(reducer(undefined, { type: CATEGORY_FORM_RESET, payload: {} })).toEqual({
    title: '',
    isLoading: false,
    errors: null,
  });
});
