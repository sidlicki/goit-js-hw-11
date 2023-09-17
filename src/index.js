import { getImages } from './js/api';
import Notiflix from 'notiflix'; // Бібліотека для повідомлень користувачу
import SimpleLightbox from 'simplelightbox'; // Бібліотека для галереї зображень
import 'simplelightbox/dist/simple-lightbox.min.css'; // Стилі для галереї

// Отримання елементів DOM
const searchForm = document.querySelector('.search-form'); // Форма пошуку
const inputSearch = searchForm.elements.searchQuery; // Поле введення пошукового запиту
const gallery = document.querySelector('.gallery'); // Галерея зображень
const btnReset = document.querySelector('.btn-reset'); // кнопка ресет
searchForm.addEventListener('submit', onSearch); // Додавання обробника подій для форми
searchForm.addEventListener('reset', onReset); // Додавання обробника подій для форми

// Налаштування Intersection Observer для пагінації
const options = {
  root: null,
  rootMargin: '450px', // Відступ від кореневого елемента
  threshold: 1.0, // Поріг для спрацьовування обсервера
};
const target = document.querySelector('.js-guard'); // Цільовий елемент для Intersection Observer
const observer = new IntersectionObserver(onLoad, options); // Створення обсервера

Notiflix.Notify.init({
  distance: '45px',
  timeout: 5000,
  fontSize: '20px',
  width: '350px',
  position: 'right-top',
  opacity: 0.95,
});

btnReset.disabled = true;
inputSearch.addEventListener('input', () => {
  if (inputSearch.value !== '') {
    btnReset.disabled = false;
  }
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
    Notiflix.Notify.failure('You must first enter a query to search');
    btnReset.disabled = true;
    return;
  }
  gallery.innerHTML = ''; // Очистити галерею при новому пошуку
  currentPage = 1; // Скинути сторінку

  // Виклик функції для отримання та створення розмітки
  getAndCreateMarkup(val);
}

// Функція для отримання та створення розмітки для першої сторінки
async function getAndCreateMarkup(val, page = 1) {
  //Очищення сторінки при кожному новому запиті
  gallery.innerHTML = '';
  observer.unobserve(target);

  // Отримання даних зображень
  const {
    data: { hits, totalHits },
  } = await getImages(val, page);
  if (totalHits === 0) {
    // Повідомлення, якщо не знайдено зображень
    Notiflix.Notify.failure(
      `Unfortunately, no image was found for your query "${val}", please try again`
    );
    gallery.innerHTML =
      '<h2 class="start-text">Write your query again to find images</h2>';
    return;
  }
  // Додавання зображень до галереї
  gallery.innerHTML = createMarkup(hits);
  lightbox.refresh(); // Оновлення галереї

  if (totalHits > 40) {
    // Почати спостереження за пагінацією
    observer.observe(target);
    console.log('Start observing');
  }
  // Повідомлення про кількість знайдених зображень
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

//Функція для створення розмітки
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
  console.log('Observing in progress');
  const lastEntry = entries[entries.length - 1];
  if (lastEntry.isIntersecting) {
    // Збільшити номер сторінки при досягненні кінця
    currentPage += 1;
    console.log(`Page number ${currentPage}`);
    const val = inputSearch.value.trim();
    if (val !== '') {
      // Отримання та додавання розмітки до вже існуючої сторінки
      const {
        data: { hits, totalHits },
      } = await getImages(val, currentPage);
      gallery.innerHTML += createMarkup(hits);

      smoothScroll(); // Плавне прокручування

      lightbox.refresh(); // Оновлення галереї

      if (currentPage >= parseInt(totalHits) / 40) {
        // При досягненні кінця результатів припинити спостереження
        observer.unobserve(target);
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results`
        );
        console.log('End of observation');
      }
    }
  }
}

// Плавне прокручування
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//прокрутка вгору (взято з GPT)
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
  // Показати/приховати кнопку в залежності від позиції прокрутки
  if (
    document.body.scrollTop > 2000 ||
    document.documentElement.scrollTop > 2000
  ) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  // Плавна прокрутка сторінки вгору
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

//очищення за допомогою кнопки ресет
function onReset() {
  console.log('reset');
  observer.unobserve(target);
  gallery.innerHTML =
    '<h2 class="start-text">Write your query again to find images</h2>';
  btnReset.disabled = true;
}
