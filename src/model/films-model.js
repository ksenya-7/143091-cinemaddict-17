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

  set films(value) {
    this.#films = value;

    this._notify(UpdateType.MAJOR, value);
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
      // console.log(this.#films);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      amountComments: film['comments'].length,
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
