import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filterItems, currentFilterType) => (
  `<nav class="main-navigation">
    ${filterItems
    .map((selectedFilter) => {
      const {type, name, count, href} = selectedFilter;
      return (
        `<a href="#${href}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name} ${type !== 'All' ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`
      );
    }).join('')}
  </nav>`
);


export default class FilterView extends AbstractView {
  #filtersFilms = null;
  #currentFilter = null;

  constructor(filtersFilms, currentFilterType) {
    super();
    this.#filtersFilms = filtersFilms;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filtersFilms, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };
}
