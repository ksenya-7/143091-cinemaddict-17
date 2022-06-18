import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends Observable {
  #filterFilms = FilterType.ALL;

  get filterFilms() {
    return this.#filterFilms;
  }

  setFilterFilms = (updateType, filter) => {
    this.#filterFilms = filter;
    this._notify(updateType, filter);
  };
}
