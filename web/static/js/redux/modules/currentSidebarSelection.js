import { createAction } from "redux-actions";

const CHANGE_SELECTION  = "CHANGE_SELECTION";

export const changeSidebarSelection = createAction(CHANGE_SELECTION);

const init = {
  selection: null,
  isFeed: false,
  isCategory: false
};

export default function reducer(state = init, action) {
  if (action.type === CHANGE_SELECTION) {
    return Object.assign({}, init, action.payload);
  }

  return state;
}
