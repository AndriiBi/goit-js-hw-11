// backend.js
import axios from 'axios';

const apiKey = '40977125-af9fe33691f1e166955d46b8c';
export const perPage = 40;

export async function fetchImages(query, page) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: apiKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });

  return response.data.hits;
}