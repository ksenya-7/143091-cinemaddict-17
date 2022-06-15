import dayjs from 'dayjs';

const Time = {
  HOUR: 60,
  DAY: 1440,
  MONTH: 43200,
  YEAR: 525600,
};

const getTimeFromMins = (mins) => (Math.trunc(mins/Time.HOUR) === 0) ? `${mins % Time.HOUR}m` : `${Math.trunc(mins/Time.HOUR)}h ${mins % Time.HOUR}m`;

const getHoursFromMins = (mins) => {
  const getHours = Math.trunc(mins/Time.HOUR);
  if (getHours === 1) {
    return 'hour';
  }
  return `${getHours} hours`;
};

const getDaysFromMins = (mins) => {
  const getDays = Math.trunc(mins/Time.DAY);
  if (getDays === 1) {
    return 'day';
  }
  return `${getDays} days`;
};

const getMonthsFromMins = (mins) => {
  const getMonths = Math.trunc(mins/Time.MONTH);
  if (getMonths === 1) {
    return 'month';
  }
  return `${getMonths} months`;
};

const getYearsFromMins = (mins) => {
  const getYears = Math.trunc(mins/Time.YEAR);
  if (getYears === 1) {
    return 'year';
  }
  return `${getYears} years`;
};

const getHumanizeCommentDate = (item) => {
  const diff = dayjs().diff(item, 'minute');

  if (diff < 0) {
    return 'No such time';
  } else if (diff >= 0 && diff < 1) {
    return 'Now';
  } else if (diff >= 1 && diff < 2) {
    return 'A minute ago';
  } else if (diff >= 2 && diff < 10) {
    return 'A few minutes ago';
  } else if (diff >= 10 && diff < Time.HOUR) {
    return `A ${diff} minutes ago`;
  } else if (diff >= Time.HOUR && diff < Time.DAY) {
    return `A ${getHoursFromMins(diff)} ago`;
  } else if (diff >= Time.DAY && diff < Time.MONTH) {
    return `A ${getDaysFromMins(diff)} ago`;
  } else if (diff >= Time.MONTH && diff < Time.YEAR) {
    return `A ${getMonthsFromMins(diff)} ago`;
  }
  return `A ${getYearsFromMins(diff)} ago`;
};

const getHumanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
const getHumanizeFilmReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

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

const sortFilmByComments = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA['comments'].length, filmB['comments'].length);

  return weight ?? filmB['comments'].length - filmA['comments'].length;
};

const cutText = (text) => {
  const max = 140;

  if (text.length > max) {
    text = `${Array.from(text).slice(0, 139).join('')}...`;
  }

  return text;
};

export {getTimeFromMins, getHumanizeFilmReleaseDate, getHumanizeFilmReleaseYear, sortFilmByDate, sortFilmByRating, getHumanizeCommentDate, sortFilmByComments, cutText};
