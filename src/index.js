import { getImages } from './js/api';
import Notiflix from 'notiflix'; // Бібліотека для повідомлень користувачу
import SimpleLightbox from 'simplelightbox'; // Бібліотека для галереї зображень
import 'simplelightbox/dist/simple-lightbox.min.css'; // Стилі для галереї

// Отримання елементів DOM
const searchForm = document.querySelector('.search-form'); // Форма пошуку
const inputSearch = searchForm.elements.searchQuery; // Поле введення пошукового запиту
const gallery = document.querySelector('.gallery'); // Галерея зображень
searchForm.addEventListener('submit', onSearch); // Додавання обробника подій для форми

// Налаштування Intersection Observer для пагінації
const options = {
  root: null,
  rootMargin: '450px', // Відступ від кореневого елемента
  threshold: 1.0, // Поріг для спрацьовування обсервера
};
const target = document.querySelector('.js-guard'); // Цільовий елемент для Intersection Observer
const observer = new IntersectionObserver(onLoad, options); // Створення обсервера

Notiflix.Notify.init({
  timeout: 5000,
  fontSize: '20px',
  width: '350px',
  position: 'right-top',
  opacity: 0.95,
});

// Сторінка для пагінації та об'єкт для галереї
let currentPage = 1; // Поточна сторінка результатів
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
}); // Ініціалізація галереї

// Обробник події для форми пошуку
function onSearch(evt) {
  evt.preventDefault();
  const val = inputSearch.value.trim(); // Отримати введений пошуковий запит
  if (val === '') {
    Notiflix.Notify.failure('Для пошуку потрібно спочатку ввести запит');
    return;
  }
  gallery.innerHTML = ''; // Очистити галерею при новому пошуку
  currentPage = 1; // Скинути сторінку

  getAndCreateMarkup(val); // виклик функції, всередині котрої буде відбуватись виклик функції запиту та відмальовки
}

//функція яка створює розмітку першої сторінки при запиті
async function getAndCreateMarkup(val, page = 1) {
  const {
    data: { hits, totalHits },
  } = await getImages(val, page);
  if (totalHits === 0) {
    Notiflix.Notify.failure(
      `Нажаль за вашим запитом "${val}" не знайшлося жодного зоображення, спробуйте ще раз`
    );
    gallery.innerHTML =
      '<h2 class="start-text">Напишіть свій запит ще раз для пошуку зоображень</h2>';
    return;
  }
  gallery.innerHTML = createMarkup(hits); // Додати зображення до галереї
  lightbox.refresh(); // оновлення галереї
  observer.observe(target); // Почати спостереження
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`); // повідомлення про кількість знайдених зоображень
}

// Функція для створення HTML-розмітки зображень
function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="gallery__item photo-card">
            <a href="${largeImageURL}" class="gallery__link">
                <img class="gallery__image img-preview" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                    ${likes}
                    <b>Likes</b>
                </p>
                <p class="info-item">
                    ${views}
                    <b>Views</b>
                </p>
                <p class="info-item">
                    ${comments}
                    <b>Comments</b>
                </p>
                <p class="info-item">
                    ${downloads}
                    <b>Downloads</b>
                </p>
            </div>
        </div>`
    )
    .join('');
}

// Обробник події для Intersection Observer
async function onLoad(entries, observer) {
  const lastEntry = entries[entries.length - 1];
  if (lastEntry.isIntersecting) {
    currentPage += 1; // Збільшити номер сторінки
    const val = inputSearch.value.trim();
    if (val !== '') {
      const {
        data: { hits, totalHits },
      } = await getImages(val, currentPage);
      gallery.innerHTML += createMarkup(hits); // додавання розмітки до вже існуючої
      lightbox.refresh(); // оновлення галереї
      if (currentPage >= parseInt(totalHits) / 40) {
        observer.unobserve(target); // При досягненні кінця результатів припинити спостереження
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results`
        );
        console.log('кінець');
      }
    }
  }
}
