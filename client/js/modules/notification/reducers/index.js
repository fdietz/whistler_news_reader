import { RESET_NOTIFICATION, CREATE_NOTIFICATION } from '../actions';

const initial = {
  message: null,
  type: 'info',
  isRetry: false,
  retryAction: null
};

export default function reducer(state = initial, action) {
  const { type, payload } = action;

  if (type === RESET_NOTIFICATION) {
    return initial;
  } else if (type === CREATE_NOTIFICATION) {
    return payload;
  }

  return state;
}
