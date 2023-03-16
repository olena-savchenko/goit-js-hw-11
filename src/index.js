import './styles.css';
import { getImages } from './pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const showLoadMore = () => (refs.loadMoreBtn.style.display = 'block');
const hideLoadMore = () => (refs.loadMoreBtn.style.display = 'none');

let currentPage = 1;
hideLoadMore();

function onFormSubmit(event) {
  event.preventDefault();

  clearGallery();

  const inputValue = refs.searchInput.value.trim();

  if (inputValue === '') {
    hideLoadMore();
    return Notiflix.Notify.info('Enter a search name!');
  }

  viewImgGallery(inputValue, currentPage);
}

async function viewImgGallery(value, currentPage) {
  try {
    const response = await getImages(value, currentPage);

    const length = response.data.hits.length; //довжина масива данних за один запит
    const totalHits = response.data.total; // загальна кількість знайдених зображень

    renderMarkUp(response.data.hits);
    showLoadMore();

    if (response.data.hits.length === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    }
    if (currentPage === 1) {
      // виводимо повідомлення скільки всього знайшли зображень
      Notiflix.Notify.info(`Hooray! We found ${response.data.total} images.`);
    }

    if (response.data.hits.length < 40) {
      // renderMarkUp(response.data.hits);
      hideLoadMore();
      return Notiflix.Notify.info('Финиш');
    }
  } catch (error) {
    console.log(error);
  }
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

// function viewMessage(length, totalHits, value) {
//   if (value === '') {
//     hideLoadMore();
//     return Notiflix.Notify.info('Enter a search name!');
//   }
//   if (!totalHits) {
//     hideLoadMore();
//     return Notiflix.Notify.info(
//       'Sorry, there are no images matching your search query. Please try again!'
//     );
//   }
//   if (currentPage === 1) {
//     // виводимо повідомлення скільки всього знайшли зображень
//     return Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
//   }
//   if (!length) {
//     return Notiflix.Notify.info('Финиш');
//   }
// }

function clearGallery() {
  //У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового, оскільки буде пагінація по новій колекції зображень.
  currentPage = 1;
  // при кожному новому запиті ощищуємо розмітку і початкове значення page = 1 для пагінації
  refs.gallery.innerHTML = '';
}

// ініціалізація екземпляру класу бібліотеки SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a');

function onLoadMore() {
  currentPage += 1;
  const value = refs.searchInput.value.trim();
  viewImgGallery(value, currentPage);
}

// обробник події плавного скрола
// document.addEventListener('scroll', smoothScroll);
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
// document.addEventListener('scroll', infiniteScroll);
// refs.form.addEventListener('scroll', smoothScroll);

function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  // smoothScroll();
  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    // console.log('Done');
    currentPage += 1;
    // smoothScroll();

    const value = refs.searchInput.value.trim();
    getImages(value, currentPage).then(res => {
      console.log('Загальна кількість картинок: ', res.data.total);

      console.log('Довжина масиву одного запиту: ', res.data.hits.length);
      renderMarkUp(res.data.hits);
      if (res.data.hits.length < 40) {
        return Notiflix.Notify.info('Финиш');
      }
      // smoothScroll();
    });
  }
}
