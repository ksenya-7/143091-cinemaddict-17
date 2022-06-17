import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => {
      const {type, name, count, href} = filter;

      return (
        `<a href="#${href}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name} ${type !== 'All' ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`
      );
    }).join('');

  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
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
