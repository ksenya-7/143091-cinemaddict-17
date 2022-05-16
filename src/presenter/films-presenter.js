import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsСontainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import FilmPopupView from '../view/film-details-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';

const FILM_COUNT_PER_STEP = 5;

const body = document.querySelector('body');
export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #FilmPopupComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsСontainerView();
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

  #openFilmPopup = (film) => {
    if (this.#FilmPopupComponent) {
      this.#closeFilmPopup();
      return;
    }
    this.#FilmPopupComponent = new FilmPopupView(film);
    this.#FilmPopupComponent.setCloseClickHandler(this.#closeFilmPopup);
    document.addEventListener('keydown', this.#handleKeyDown);
    document.addEventListener('click', this.#handleClickOutside);
    render(this.#FilmPopupComponent, body);
    body.classList.add('hide-overflow');
  };

  #closeFilmPopup = () => {
    remove(this.#FilmPopupComponent);
    this.#FilmPopupComponent.removeCloseClickHandler(this.#closeFilmPopup);
    document.removeEventListener('keydown', this.#handleKeyDown);
    document.removeEventListener('click', this.#handleClickOutside);
    body.classList.remove('hide-overflow');
    this.#FilmPopupComponent = null;
  };

  #handleKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closeFilmPopup();
    }
  };

  #handleClickOutside = (evt) => {
    if (!this.#FilmPopupComponent.element.contains(evt.target)) {
      this.#closeFilmPopup();
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent.element, this.#openFilmPopup);
    filmPresenter.init(film);
  };

  #renderFilmsList = () => {
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

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
