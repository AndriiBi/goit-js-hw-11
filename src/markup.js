// markup.js
import Notiflix from 'notiflix';

export function createImageCardMarkup(image) {
  return `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      <div class="info">
        ${createInfoItemMarkup('Likes', image.likes)}
        ${createInfoItemMarkup('Views', image.views)}
        ${createInfoItemMarkup('Comments', image.comments)}
        ${createInfoItemMarkup('Downloads', image.downloads)}
      </div>
    </div>
  `;
}

export function createInfoItemMarkup(label, value) {
  return `<p class="info-item"><b>${label}</b>: ${value}</p>`;
}

export function showLoadMoreButton(button) {
  button.style.display = 'block';
}

export function hideLoadMoreButton(button) {
  button.style.display = 'none';
}

export function handleFetchError(error) {
  Notiflix.Notify.Failure('Oops! Something went wrong. Try again later.');
  console.error(error);
}
