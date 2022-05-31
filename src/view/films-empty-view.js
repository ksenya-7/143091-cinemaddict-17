import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies in our watchlist',
  [FilterType.HISTORY]: 'There are no watched movies',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return (
    `<section class="films-list"><h2 class="films-list__title">
      ${noFilmTextValue}
    </h2></section>`);
};

export default class FilmsEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoFilmTemplate(this.#filterType);
  }
}
