import dayjs from 'dayjs';

const humanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
const humanizeFilmReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

export {humanizeFilmReleaseDate, humanizeFilmReleaseYear};
