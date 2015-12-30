import { createAction } from "redux-actions";

const SELECT_ENTRY  = "SELECT_ENTRY";

export const selectEntry = createAction(SELECT_ENTRY);

export default function reducer(state = null, action) {
  if (action.type === SELECT_ENTRY) {
    return action.payload.entry;
  }

  return state;
}
