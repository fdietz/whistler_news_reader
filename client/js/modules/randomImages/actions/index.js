import { createAction } from 'redux-actions';
import axios from 'axios';

export const FETCH_RANDOM_IMAGES = 'FETCH_RANDOM_IMAGES';

export const fetchRandomImages = createAction(FETCH_RANDOM_IMAGES);

export function requestFetchRandomImages() {
  return dispatch => {
    fetchRandomImages();
    return axios.get('/api/random_images')
      .then(response => dispatch(fetchRandomImages(response.data.random_images)));
  };
}
