// Функция из интернета по генерации случайного числа из диапазона

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random

import dayjs from 'dayjs';

const humanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
const humanizeFilmReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

export {humanizeFilmReleaseDate, humanizeFilmReleaseYear};
