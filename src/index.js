import Notiflix from 'notiflix';
import { fetchImages, perPage } from './backend';
import {
  createImageCardMarkup,
  showLoadMoreButton,
  hideLoadMoreButton,
  handleFetchError,
} from './markup';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

let currentPage = 1;

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  try {
    currentPage = 1;
    const images = await fetchImages(searchQuery, currentPage);
    renderImages(images);
  } catch (error) {
    handleFetchError(error);
  }
});

loadMoreBtn.addEventListener('click', async function () {
  try {
    currentPage += 1;
    const images = await fetchImages(form.elements.searchQuery.value.trim(), currentPage);
    renderImages(images);
  } catch (error) {
    handleFetchError(error);
  }
});

async function renderImages(images) {
  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  if (images.length === 0) {
    if (currentPage === 1) {
      Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    } else {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    hideLoadMoreButton(loadMoreBtn);
    return;
  }

  const galleryMarkup = images
    .map(image => createImageCardMarkup(image))
    .join('');

  gallery.innerHTML += galleryMarkup;

  const totalHits = currentPage * perPage;

  if (totalHits >= currentPage * perPage) {
    showLoadMoreButton(loadMoreBtn);
  } else {
    hideLoadMoreButton(loadMoreBtn);
  }
}
