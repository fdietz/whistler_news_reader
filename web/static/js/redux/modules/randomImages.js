import axios from '../../utils/APIHelper';
import { createAction } from 'redux-actions';

export const FETCH_RANDOM_IMAGES = 'FETCH_RANDOM_IMAGES';

export const fetchRandomImages = createAction(FETCH_RANDOM_IMAGES);

export function requestFetchRandomImages() {
  return dispatch => {
    fetchRandomImages();
    return axios.get('/api/random_images')
      .then(response => dispatch(fetchRandomImages(response.data.random_images)));
  };
}

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
