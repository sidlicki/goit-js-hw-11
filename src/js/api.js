import axios from 'axios'; // Бібліотека для роботи з HTTP-запитами

// Ключ API Pixabay та URL для запиту
const API_KEY = '39466689-b0058dc694ac3f446d63717a4';
const BASE_URL = 'https://pixabay.com/api/';

async function getImages(val, page) {
  val = val.split(' ').join('+'); // Замінити пробіли на "+"
  try {
    return await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${val}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
    );
  } catch (error) {
    Notiflix.Notify.info(
      `"Sorry, there are no images matching your search query. Please try again."`
    );
  }
}

export { getImages };
