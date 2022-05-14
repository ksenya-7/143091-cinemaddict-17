import {FilterType} from '../const';

const filter = {
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film['user_details']['watchlist']),
  [FilterType.HISTORY]: (films) => films.filter((film) => film['user_details']['already_watched']),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film['user_details']['favorite']),
};

export {filter};
