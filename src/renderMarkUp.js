import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { insertMarkUp } from './index';

// функція розмітки сторінки
export function renderMarkUp(array) {
  const markUp = array
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
                <div class="photo-card">
			            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
			              <div class="info">
		                  <p class="info-item">
			                  <b>Likes</b><span class="likes">${likes}</span>
		                  </p>
		                  <p class="info-item">
			                  <b>Views</b><span class="views">${views}</span>
		                  </p>
		                  <p class="info-item">
			                  <b>Comments</b><span class="comments">${comments}</span>
		                  </p>
		                  <p class="info-item">
			                  <b>Downloads</b><span class="downloads">${downloads}</span>
		                  </p>
		                </div>
	              </div>
              </a>`;
      }
    )
    .join('');
  insertMarkUp(markUp);
  lightbox.refresh();
}

// ініціалізація екземпляру класу бібліотеки SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a');
