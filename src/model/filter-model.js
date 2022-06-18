import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends Observable {
  #selectedFilter = FilterType.ALL;

  get selectedFilter() {
    return this.#selectedFilter;
  }

  setSelectedFilter = (updateType, filter) => {
    this.#selectedFilter = filter;
    this._notify(updateType, filter);
  };
}
