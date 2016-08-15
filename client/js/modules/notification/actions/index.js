import { createAction } from 'redux-actions';

export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const RESET_NOTIFICATION = 'RESET_NOTIFICATION';

export const createNotification = createAction(CREATE_NOTIFICATION);
export const resetNotification = createAction(RESET_NOTIFICATION);

export function showNotificationWithTimeout(text) {
  return dispatch => {
    dispatch(createNotification(text));

    setTimeout(() => {
      dispatch(resetNotification());
    }, 5000);
  };
}
