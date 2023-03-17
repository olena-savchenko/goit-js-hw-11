import './styles.css';
import { getImages } from './pixabay-api';
import { renderMarkUp } from './renderMarkUp';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

// Додаткові налаштування повідомлень
const optionsNotifix = {
  width: '320px',
  position: 'center-center',
  fontSize: '16px',
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const showLoadMore = () => (refs.loadMoreBtn.style.display = 'block');
const hideLoadMore = () => (refs.loadMoreBtn.style.display = 'none');
export const insertMarkUp = markUp =>
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
let currentPage = 1;

hideLoadMore();

// обробник події сабміту форми
function onFormSubmit(event) {
  event.preventDefault();

  clearGallery();

  const inputValue = refs.searchInput.value.trim();

  if (inputValue === '') {
    hideLoadMore();
    return Notiflix.Notify.warning('Enter a search name!', optionsNotifix);
  }

  viewImgGallery(inputValue, currentPage);
}

// асинхронна функція показу галереї
async function viewImgGallery(value, currentPage) {
  try {
    const response = await getImages(value, currentPage); // виклик функції отримання зображень з pixabay
    const length = response.data.hits.length; //довжина масива данних за один запит
    const totalHits = response.data.total; // загальна кількість знайдених зображень
    hideLoadMore();

    // якщо по запиту нічого не знайдено
    if (response.data.hits.length === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again!',
        optionsNotifix
      );
    }

    renderMarkUp(response.data.hits);

    // якщо це перша сторінка
    if (currentPage === 1) {
      showLoadMore();

      return Notiflix.Notify.success(
        `Hooray! We found ${response.data.total} images.`,
        optionsNotifix
      );
    }

    // якщо кількість елементів менше ніж per_page = 40, то більше картинок немає
    if (response.data.hits.length < 40) {
      hideLoadMore();
      return Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results.",
        optionsNotifix
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function clearGallery() {
  //У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового, оскільки буде пагінація по новій колекції зображень.
  currentPage = 1;
  // при кожному новому запиті ощищуємо розмітку і початкове значення page = 1 для пагінації
  refs.gallery.innerHTML = '';
}

function onLoadMore() {
  currentPage += 1;
  const value = refs.searchInput.value.trim();
  viewImgGallery(value, currentPage);
}

/*=================== smooth and infinite scroll needs improvements ====================== */
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();

  if (documentRect.bottom < document.documentElement.clientHeight) {
    currentPage += 1;
    const value = refs.searchInput.value.trim();
    viewImgGallery(value, currentPage);
  }
}
