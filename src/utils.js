// Функция из интернета по генерации случайного числа из диапазона

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random

import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getTimeFromMins = (mins) => (Math.trunc(mins/60) === 0) ? `${mins % 60}m` : `${Math.trunc(mins/60)}h ${mins % 60}m`;

const humanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
const humanizeFilmReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

export {getRandomInteger, humanizeFilmReleaseDate, humanizeFilmReleaseYear, getTimeFromMins};