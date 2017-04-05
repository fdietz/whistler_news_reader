/* eslint no-undefined: 0*/
import { CREATE_NOTIFICATION, RESET_NOTIFICATION } from '../../actions';
import reducer from '../index';

test('notification reducer returns default state', () => {
  expect(reducer(undefined, {})).toEqual({
    message: null,
    type: 'info',
    isRetry: false,
    retryAction: null
  });
});

test('notification reducer CREATE_NOTIFICATION', () => {
  expect(reducer(undefined, {
    type: CREATE_NOTIFICATION,
    payload: { message: 'test' },
  })).toEqual({
    message: 'test',
  });
});

test('notification reducer RESET_NOTIFICATION', () => {
  expect(reducer(undefined, {
    type: RESET_NOTIFICATION,
    payload: null,
  })).toEqual({
    message: null,
    type: 'info',
    isRetry: false,
    retryAction: null
  });
});
