import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsСontainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmDetailComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsСontainerComponent = new FilmsСontainerView();
  #sortComponent = new SortView();
  #noFilmComponent = new FilmsEmptyView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #listFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#listFilms = [...this.#filmsModel.films];

    this.#renderFilmsComponent();
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilms = (from, to) => {
    this.#listFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  };

  #renderNoFilms = () => {
    render(this.#noFilmComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsСontainerComponent.element);
    filmPresenter.init(film);
  };

  #renderFilmsList = () => {
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsСontainerComponent, this.#filmsListComponent.element);

    this.#renderFilms(0, Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));

    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilmsComponent = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#listFilms.every((film) => film.isArchive)) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsList();
  };
}
