import dayjs from 'dayjs';
import {SortType} from '../const.js';

const humanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
const humanizeFilmReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const getWeightForNullRating = (ratingA, ratingB) => {
  if (ratingA === null && ratingB === null) {
    return 0;
  }

  if (ratingA === null) {
    return 1;
  }

  if (ratingB === null) {
    return -1;
  }

  return null;
};

const sortFilmByDate = (filmA, filmB) => {
  const weight = getWeightForNullRating(filmA['film_info']['release']['date'], filmB['film_info']['release']['date']);

  return weight ?? dayjs(filmB['film_info']['release']['date']).diff(dayjs(filmA['film_info']['release']['date']));
};

const sortFilmByRating = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA['film_info']['total_rating'], filmB['film_info']['total_rating']);

  return weight ?? filmB['film_info']['total_rating'] - filmA['film_info']['total_rating'];
};

export {humanizeFilmReleaseDate, humanizeFilmReleaseYear, sortFilmByDate, sortFilmByRating};
