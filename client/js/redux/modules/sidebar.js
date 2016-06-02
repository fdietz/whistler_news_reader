import { createAction } from 'redux-actions';

export const SHOW_SIDEBAR = 'SHOW_SIDEBAR';
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

export const showSidebar = createAction(SHOW_SIDEBAR);
export const hideSidebar = createAction(HIDE_SIDEBAR);
export const toggle = createAction(TOGGLE_SIDEBAR);

const initial = {
  isVisible: false,
};

export default function reducer(state = initial, action) {
  const { type, payload } = action;

  if (type === HIDE_SIDEBAR) {
    return { ...state, isVisible: false };
  } else if (type === SHOW_SIDEBAR) {
    return { ...state, isVisible: true };
  } else if (type === TOGGLE_SIDEBAR) {
    return { ...state, isVisible: !state.isVisible };
  }

  return state;
}
