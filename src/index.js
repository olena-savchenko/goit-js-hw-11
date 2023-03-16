import './styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// глобальні змінні
const refs = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let currentPage = 1;
// refs.loadMoreBtn.style.display = 'none';

// обробник сабміту форми
const onFormSubmit = event => {
  event.preventDefault();

  // при кожному новому запиті ощищуємо розмітку і початкове значення page = 1 для пагінації
  refs.gallery.innerHTML = '';
  currentPage = 1;

  const inputValue = refs.searchInput.value.trim();

  // перевірка на
  if (inputValue === '') {
    // refs.loadMoreBtn.style.display = 'none';
    return Notiflix.Notify.info('Enter a search name!');
  }

  getImagesQuery(inputValue, currentPage).then(res => {
    if (res.data.hits.length === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    }

    // показуємо розмітку сторінки по даних запиту
    renderMarkUp(res.data.hits);

    // викликаю функцію плавного скрола
    smoothScroll();

    // виводимо повідомлення скільки всього знайшли зображень
    Notiflix.Notify.info(`Hooray! We found ${res.data.total} images.`);
  });
};

// прослуховування події form submit
refs.form.addEventListener('submit', onFormSubmit);

// функція запиту даних на Pixabay API
function getImagesQuery(value, currentPage) {
  const url = `https://pixabay.com/api/`;
  const key = `?key=34262951-eeadf584ea4d5f3050a02718a`;
  const params = `&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;

  return axios.get(url + key + params);
}

// функція розмітки сторінки
function renderMarkUp(array) {
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
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
  lightbox.refresh();
}

// ініціалізація екземпляру класу бібліотеки SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  // adds a delay before the caption shows
  captionDelay: 250,
});

// обробник події плавного скрола
document.addEventListener('scroll', smoothScroll);
// функція плавного скрола
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// infinite scroll
// window.addEventListener('scroll', infiniteScroll);
// refs.form.addEventListener('scroll', smoothScroll);

// function infiniteScroll() {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   if (documentRect.bottom < document.documentElement.clientHeight + 200) {
//     console.log('Done');
//     currentPage += 1;
//     const value1 = refs.searchInput.value.trim();
//     getImagesQuery(value1, currentPage).then(res => {
//       renderMarkUp(res.data.hits);
//     });
//   }
// }
