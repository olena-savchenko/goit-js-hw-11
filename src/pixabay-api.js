import axios from 'axios';

// функція запиту даних на Pixabay API
export async function getImages(value, currentPage) {
  const options = {
    params: {
      key: '34262951-eeadf584ea4d5f3050a02718a',
      q: value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: currentPage,
    },
  };

  const url = 'https://pixabay.com/api/';
  // const response = await axios.get(url, options);
  // return response;
  return await axios.get(url, options);
}
