import { RESET_NOTIFICATION, CREATE_NOTIFICATION } from '../actions';

export default function reducer(state = null, action) {
  const { type, payload } = action;

  if (type === RESET_NOTIFICATION) {
    return null;
  } else if (type === CREATE_NOTIFICATION) {
    return payload;
  }

  return state;
}
