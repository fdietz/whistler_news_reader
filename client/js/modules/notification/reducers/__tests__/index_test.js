/* eslint no-undefined: 0*/
import test from 'ava';
import {
  CREATE_NOTIFICATION,
  RESET_NOTIFICATION,
} from '../../actions';
import reducer from '../index';

test('notification reducer returns default state', t => {
  t.deepEqual(reducer(undefined, {}), {
    message: null,
    type: 'info',
    isRetry: false,
    retryAction: null
  });
});

test('notification reducer CREATE_NOTIFICATION', t => {
  t.deepEqual(reducer(undefined, {
    type: CREATE_NOTIFICATION,
    payload: { message: 'test' },
  }), {
    message: 'test',
  });
});

test('notification reducer RESET_NOTIFICATION', t => {
  t.deepEqual(reducer(undefined, {
    type: RESET_NOTIFICATION,
    payload: null,
  }), {
    message: null,
    type: 'info',
    isRetry: false,
    retryAction: null
  });
});
