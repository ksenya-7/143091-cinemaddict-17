import AbstractView from '../framework/view/abstract-view.js';

import {humanizeFilmReleaseYear} from '../utils/film.js';
import {getTimeFromMins} from '../utils/common.js';

const createFilmCardTemplate = (film) => {
  const {genre, amountComments} = film;

  const filmInfo = film['film_info'];
  const releaseDate = filmInfo['release']['date'];
  const year = humanizeFilmReleaseYear(releaseDate);
  const runtime = getTimeFromMins(filmInfo['runtime']);

  const isWatchlist = film.watchlist;
  const watchlistClassName = isWatchlist
    ? 'film-card__controls-item--active'
    : '';

  const isWatched = film.watched;
  const watchedClassName = isWatched
    ? 'film-card__controls-item--active'
    : '';

  const isFavorite = film.favorite;
  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--active'
    : '';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${filmInfo['title']}</h3>
        <p class="film-card__rating">${filmInfo['total_rating']}</p>
        <p class="film-card__info">
          <span class="film-card__year">${year}</span>
          <span class="film-card__duration">${runtime}</span>
          <span class="film-card__genre">${genre}</span>
        </p>
        <img src="./${filmInfo['poster']}" alt="" class="film-card__poster">
        <p class="film-card__description">${filmInfo['description']}</p>
        <span class="film-card__comments">${amountComments}</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get openLink() {
    return this.element.querySelector('.film-card__link');
  }

  get watchlistButton() {
    return this.element.querySelector('.film-card__controls-item--add-to-watchlist');
  }

  get watchedButton() {
    return this.element.querySelector('.film-card__controls-item--mark-as-watched');
  }

  get favoriteButton() {
    return this.element.querySelector('.film-card__controls-item--favorite');
  }

  setOpenClickHandler = (callback) => {
    this._callback.openClick = callback;
    this.openLink.addEventListener('click', this.#openClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.watchlistButton.addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.watchedButton.addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  };

  #openClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.openClick();
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
