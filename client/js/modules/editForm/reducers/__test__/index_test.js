/* eslint no-undefined: 0*/
import { EDIT_FORM_UPDATE, EDIT_FORM_RESET } from '../../actions';
import reducer from '../index';

test('editForm reducer returns default state', () => {
  expect(reducer(undefined, {})).toEqual({
    title: null,
    isLoading: false,
    error: null,
  });
});

test('editForm reducer handles EDIT_FORM_UPDATE with empty payload', () => {
  expect(reducer(undefined, { type: EDIT_FORM_UPDATE, payload: null })).toEqual({
    title: null,
    isLoading: true,
    error: null,
  });
});

test('editForm reducer handles EDIT_FORM_UPDATE with payload', () => {
  expect(reducer(undefined, {
    type: EDIT_FORM_UPDATE,
    payload: { title: 'new' },
  })).toEqual({
    title: 'new',
    isLoading: false,
    error: null,
  });
});

test('editForm reducer handles EDIT_FORM_UPDATE with error', () => {
  expect(reducer(undefined, {
    type: EDIT_FORM_UPDATE,
    payload: { error: 'message' },
  })).toEqual({
    title: null,
    isLoading: false,
    error: 'message',
  });
});

test('editForm reducer handles EDIT_FORM_RESET with empty payload', () => {
  expect(reducer(undefined, { type: EDIT_FORM_RESET, payload: {} })).toEqual({
    title: null,
    isLoading: false,
    error: null,
  });
});
