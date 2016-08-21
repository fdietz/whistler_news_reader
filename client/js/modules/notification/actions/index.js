import { createAction } from 'redux-actions';

export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const RESET_NOTIFICATION = 'RESET_NOTIFICATION';

export const createNotification = createAction(CREATE_NOTIFICATION);
export const resetNotification = createAction(RESET_NOTIFICATION);

export function showNotificationWithTimeout(message, { type = 'info' }) {
  return dispatch => {
    dispatch(createNotification({ message, type, isRetry: false }));

    setTimeout(() => {
      dispatch(resetNotification());
    }, 5000);
  };
}

export function showRetryNotification(message, retryAction, { type = 'info' }) {
  return dispatch => {
    dispatch(createNotification({ message, type, isRetry: true, retryAction }));
  };
}
