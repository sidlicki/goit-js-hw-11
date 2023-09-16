// Імпорт бібліотек
// import axios from 'axios'; // Бібліотека для роботи з HTTP-запитами
// import Notiflix from 'notiflix'; // Бібліотека для повідомлень користувачу
// import SimpleLightbox from 'simplelightbox'; // Бібліотека для галереї зображень
// import 'simplelightbox/dist/simple-lightbox.min.css'; // Стилі для галереї

// // Отримання елементів DOM
// const searchForm = document.querySelector('.search-form'); // Форма пошуку
// const inputSearch = searchForm.elements.searchQuery; // Поле введення пошукового запиту
// const gallery = document.querySelector('.gallery'); // Галерея зображень
// searchForm.addEventListener('submit', onSearch); // Додавання обробника подій для форми

// // Налаштування Intersection Observer для пагінації
// const options = {
//   root: null,
//   rootMargin: '450px', // Відступ від кореневого елемента
//   threshold: 1.0, // Поріг для спрацьовування обсервера
// };
// const target = document.querySelector('.js-guard'); // Цільовий елемент для Intersection Observer
// const observer = new IntersectionObserver(onLoad, options); // Створення обсервера

// // Ключ API Pixabay та URL для запиту
// const API_KEY = '39466689-b0058dc694ac3f446d63717a4';
// const BASE_URL = 'https://pixabay.com/api/';

// // Сторінка для пагінації та об'єкт для галереї
// let currentPage = 1; // Поточна сторінка результатів
// let lightbox; // Об'єкт галереї

// Обробник події для форми пошуку
// function onSearch(evt) {
//   // gallery.innerHTML = ''; // Очистити галерею при новому пошуку
//   // currentPage = 1; // Скинути сторінку
//   evt.preventDefault();
//   // const val = inputSearch.value.trim(); // Отримати введений пошуковий запит
//   if (val !== '') {
//     getImages(val, currentPage).then(({ data: { hits, totalHits } }) => {
//       gallery.innerHTML = createMarkup(hits); // Додати зображення до галереї
//       Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
//       observer.observe(target); // Почати спостереження
//       lightbox = new SimpleLightbox('.gallery a', {
//         captionsData: 'alt',
//         captionDelay: 250,
//       }); // Ініціалізація галереї
//     });
//   } else {
//     Notiflix.Notify.failure(
//       `"Sorry, type something in the search box. Please try again."`
//     );
//   }
// }

// Функція для створення HTML-розмітки зображень
// function createMarkup(arr) {
//   return arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) =>
//         `<div class="gallery__item photo-card">
//             <a href="${largeImageURL}" class="gallery__link">
//                 <img class="gallery__image img-preview" src="${webformatURL}" alt="${tags}" loading="lazy" />
//             </a>
//             <div class="info">
//                 <p class="info-item">
//                     ${likes}
//                     <b>Likes</b>
//                 </p>
//                 <p class="info-item">
//                     ${views}
//                     <b>Views</b>
//                 </p>
//                 <p class="info-item">
//                     ${comments}
//                     <b>Comments</b>
//                 </p>
//                 <p class="info-item">
//                     ${downloads}
//                     <b>Downloads</b>
//                 </p>
//             </div>
//         </div>`
//     )
//     .join('');
// }

// Функція для отримання зображень з API
// async function getImages(val, page) {
//   val = val.split(' ').join('+'); // Замінити пробіли на "+"
//   try {
//     return await axios.get(
//       `${BASE_URL}?key=${API_KEY}&q=${val}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
//     );
//   } catch (error) {
//     Notiflix.Notify.info(
//       `"Sorry, there are no images matching your search query. Please try again."`
//     );
//   }
// }

// Обробник події для Intersection Observer
// function onLoad(entries, observer) {
//   const lastEntry = entries[entries.length - 1];
//   if (lastEntry.isIntersecting) {
//     currentPage += 1; // Збільшити номер сторінки
//     const val = inputSearch.value.trim();

//     if (val !== '') {
//       getImages(val, currentPage).then(({ data: { hits, totalHits } }) => {
//         gallery.innerHTML += createMarkup(hits);
//         lightbox.refresh(); // Додати зображення до галереї

//         if (currentPage >= parseInt(totalHits) / 40) {
//           observer.unobserve(target); // При досягненні кінця результатів припинити спостереження
//           Notiflix.Notify.info(
//             `We're sorry, but you've reached the end of search results`
//           );

//           console.log('кінець');
//         }
//       });
//     }
//   }
// }
