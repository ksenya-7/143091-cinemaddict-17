import dayjs from 'dayjs';

const getTimeFromMins = (mins) => (Math.trunc(mins/60) === 0) ? `${mins % 60}m` : `${Math.trunc(mins/60)}h ${mins % 60}m`;
const getHoursFromMins = (mins) => {
  const getHours = Math.trunc(mins/60);
  if (getHours === 1) {
    return `${getHours} hour`;
  } else {
    return `${getHours} hours`;
  }
};

const getDaysFromMins = (mins) => {
  const getDays = Math.trunc(mins/1440);
  if (getDays === 1) {
    return `${getDays} day`;
  } else {
    return `${getDays} days`;
  }
};

const getYearsFromMins = (mins) => {
  const getYears = Math.trunc(mins/525600);
  if (getYears === 1) {
    return `${getYears} year`;
  } else {
    return `${getYears} years`;
  }
};

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

export {getTimeFromMins, humanizeFilmReleaseDate, humanizeFilmReleaseYear, sortFilmByDate, sortFilmByRating, getHoursFromMins, getDaysFromMins, getYearsFromMins};
