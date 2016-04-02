import { createAction } from "redux-actions";

export const CREATE_NOTIFICATION = "CREATE_NOTIFICATION";
export const RESET_NOTIFICATION = "RESET_NOTIFICATION";
export const createNotification = createAction(CREATE_NOTIFICATION);
export const resetNotification  = createAction(RESET_NOTIFICATION);

export default function reducer(state = null, action) {
  const { type, payload } = action;

  if (type === RESET_NOTIFICATION) {
    return null;
  } else if (type === CREATE_NOTIFICATION) {
    return payload;
  }

  return state;
}
