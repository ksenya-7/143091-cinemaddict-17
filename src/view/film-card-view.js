import {createElement} from '../render.js';
import {humanizeFilmReleaseYear, getTimeFromMins} from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {genre, amountComments} = film;

  const filmInfo = film['film_info'];
  const releaseDate = filmInfo['release']['date'];
  const year = humanizeFilmReleaseYear(releaseDate);
  const runtime = getTimeFromMins(filmInfo['runtime']);

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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
