import {FilterType} from '../const';

const filterFilms = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.watched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.favorite),
};


export {filterFilms};
