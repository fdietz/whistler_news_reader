import { FEED_FORM_UPDATE, FEED_FORM_RESET } from '../actions';

const initial = {
  searchTerm: '',
  feedExists: false,
  isFeedUrl: false,
  categoryId: null,
  isLoading: false,
  selectedFeed: null,
  errors: null,
};

export default function reducer(state = initial, action) {
  if (action.type === FEED_FORM_UPDATE) {
    if (!action.payload) return { ...state, isLoading: true };
    return { ...state, ...action.payload, isLoading: false };
  } else if (action.type === FEED_FORM_RESET) {
    return initial;
  }

  return state;
}
