import {render, replace, remove, RenderPosition} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {filterFilms} from '../utils/filter-films.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filtersFilms() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: '',
        href: 'all',
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filterFilms[FilterType.WATCHLIST](films).length,
        href: 'watchlist',
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filterFilms[FilterType.HISTORY](films).length,
        href: 'history',
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filterFilms[FilterType.FAVORITES](films).length,
        href: 'favorites',
      },
    ];
  }

  get countWatchedFilms() {
    const films = this.#filmsModel.films;

    return filterFilms[FilterType.HISTORY](films).length;
  }

  init = () => {
    const filtersFilms = this.filtersFilms;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filtersFilms, this.#filterModel.filterFilms);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filterFilms === filterType) {
      return;
    }

    this.#filterModel.setFilterFilms(UpdateType.MAJOR, filterType);
  };
}
