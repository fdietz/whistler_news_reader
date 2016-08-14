import { HIDE_SIDEBAR, SHOW_SIDEBAR, TOGGLE_SIDEBAR } from '../actions/sidebar';

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
