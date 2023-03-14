import './styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
};

const onFormSubmit = event => {
  event.preventDefault();
  refs.gallery.innerHTML = '';

  const inputValue = refs.searchInput.value.trim();
  if (inputValue === '') {
    return Notiflix.Notify.info('Enter no empty string!');
  }
  console.log(inputValue);

  axios
    .get(
      `https://pixabay.com/api/?key=34262951-eeadf584ea4d5f3050a02718a&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true`
    )
    .then(res => {
      //   console.log(res.data.hits);
      //   return res.data;
      //   console.log(res.data.hits);
      if (res.data.hits.length === 0) {
        return Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again!'
        );
      }
      renderMarkUp(res.data.hits);
    });
};

refs.form.addEventListener('submit', onFormSubmit);

function renderMarkUp(array) {
  const markUp = array
    .map(item => {
      return `<div class="photo-card">
			<img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
			<div class="info">
		  <p class="info-item">
			<b>Likes: </b>${item.likes}
		  </p>
		  <p class="info-item">
			<b>Views: </b>${item.views}
		  </p>
		  <p class="info-item">
			<b>Comments: </b>${item.comments}
		  </p>
		  <p class="info-item">
			<b>Downloads: </b>${item.downloads}
		  </p>
		</div>
	  </div>`;
    })
    .join('');
  //   refs.gallery.insertAdjacentHTML('beforeend', markUp);
  refs.gallery.innerHTML = markUp;
}

// console.log(refs.searchBtn);
// console.log(refs.form.elements);
//
