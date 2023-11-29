// index.js
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

let currentPage = 1;

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    Notiflix.Notify.Warning('Please enter a search query.');
    return;
  }

  try {
    currentPage = 1; // Reset page on new search
    const images = await fetchImages(searchQuery, currentPage);
    renderImages(images);
    showLoadMoreButton();
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

async function fetchImages(query, page) {
  const apiKey = '40977125-af9fe33691f1e166955d46b8c';
  const perPage = 40;

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

function renderImages(images) {
  if (currentPage === 1) {
    gallery.innerHTML = ''; // Clear gallery for new search
  }

  if (images.length === 0 && currentPage === 1) {
    Notiflix.Notify.Info('Sorry, there are no images matching your search query. Please try again.');
  } else if (images.length === 0) {
    hideLoadMoreButton();
    Notiflix.Notify.Info("We're sorry, but you've reached the end of search results.");
  } else {
    images.forEach((image) => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });

    // Initialize SimpleLightbox
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
  }
}


function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}</b>: ${value}`;
  return item;
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function handleFetchError(error) {
  Notiflix.Notify.Failure('Oops! Something went wrong. Try again later.');
  console.error(error);
}
