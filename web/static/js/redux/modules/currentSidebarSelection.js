import { createAction } from "redux-actions";

export const CHANGE_SELECTION  = "CHANGE_SELECTION";
export const changeSidebarSelection = createAction(CHANGE_SELECTION);

const init = {
  selection: null,
  isSubscription: false,
  isCategory: false
};

export default function reducer(state = init, action) {
  if (action.type === CHANGE_SELECTION) {
    return { ...init, ...action.payload };
  }

  return state;
}
