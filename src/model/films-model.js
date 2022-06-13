import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return [...this.#films];
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(FilmsModel.adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = FilmsModel.adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  static adaptToClient = (film) => {
    const adaptedFilm = {...film,
      genre: film['film_info']['genre'],
      watchlist: film['user_details']['watchlist'],
      watched: film['user_details']['already_watched'],
      favorite: film['user_details']['favorite'],
    };

    delete adaptedFilm['film_info']['genre'];
    delete adaptedFilm['user_details']['watchlist'];
    delete adaptedFilm['user_details']['already_watched'];
    delete adaptedFilm['user_details']['favorite'];

    return adaptedFilm;
  };
}
