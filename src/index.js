import './styles.css';
import { getImages } from './pixabay-api';
import { renderMarkUp } from './renderMarkUp';
import Notiflix from 'notiflix';
import OnlyScroll from 'only-scrollbar';
import { smoothScroll } from './renderMarkUp';

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
// const scroll = new OnlyScroll(document.querySelector('.gallery'));

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
  hideLoadMore();

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

    // якщо по запиту нічого не знайдено
    if (response.data.hits.length === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again!',
        optionsNotifix
      );
    }

    renderMarkUp(response.data.hits);
    // smoothScroll();

    if (response.data.hits.length < 40 && currentPage === 1) {
      hideLoadMore();
      return Notiflix.Notify.success(
        `Hooray! We found ${response.data.total} images.`,
        optionsNotifix
      );
    }

    // якщо це перша сторінка
    if (currentPage === 1) {
      showLoadMore();

      return Notiflix.Notify.success(
        `Hooray! We found ${response.data.total} images.`,
        optionsNotifix
      );
    }

    if (response.data.hits.length < 40) {
      // якщо кількість елементів менше ніж per_page = 40, то більше картинок немає
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

// const scrollHandler = () => {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
//   /* ... */
// };
// scroll.addScrollListener(scrollHandler);

/*=================== smooth and infinite scroll needs improvements ====================== */

function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();

  if (documentRect.bottom < document.documentElement.clientHeight) {
    currentPage += 1;
    const value = refs.searchInput.value.trim();
    viewImgGallery(value, currentPage);
  }
}

function infiniteScroll() {
  const gallery = document.querySelector('.gallery');
  let page = 1;
  let isLoading = false;
  let hasMore = true;

  window.addEventListener('scroll', () => {
    if (!hasMore || isLoading) {
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      page++;
      isLoading = true;

      fetch(`/api/gallery?page=${page}`)
        .then(response => response.json())
        .then(data => {
          isLoading = false;

          if (data.length === 0) {
            hasMore = false;
            return;
          }

          data.forEach(photo => {
            const photoCard = document.createElement('div');
            photoCard.classList.add('photo-card');

            const image = document.createElement('img');
            image.src = photo.url;
            image.alt = photo.title;
            image.loading = 'lazy';

            const info = document.createElement('div');
            info.classList.add('info');

            const likes = document.createElement('p');
            likes.classList.add('info-item');
            likes.innerHTML = `<b>Likes:</b> ${photo.likes}`;

            const views = document.createElement('p');
            views.classList.add('info-item');
            views.innerHTML = `<b>Views:</b> ${photo.views}`;

            const comments = document.createElement('p');
            comments.classList.add('info-item');
            comments.innerHTML = `<b>Comments:</b> ${photo.comments}`;

            const downloads = document.createElement('p');
            downloads.classList.add('info-item');
            downloads.innerHTML = `<b>Downloads:</b> ${photo.downloads}`;

            info.appendChild(likes);
            info.appendChild(views);
            info.appendChild(comments);
            info.appendChild(downloads);

            photoCard.appendChild(image);
            photoCard.appendChild(info);

            gallery.appendChild(photoCard);
          });
        })
        .catch(error => {
          isLoading = false;
          console.error(error);
        });
    }
  });
}

