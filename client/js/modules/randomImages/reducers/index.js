import { FETCH_RANDOM_IMAGES } from '../actions';

const initial = {
  items: [],
  isLoading: false,
};

export default function reducer(state = initial, action) {
  if (action.type === FETCH_RANDOM_IMAGES) {
    if (!action.payload) return { ...state, isLoading: true };
    return { ...state, items: action.payload, isLoading: false };
  }

  return state;
}
