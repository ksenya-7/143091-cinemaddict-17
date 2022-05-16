import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsСontainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';

const FILM_COUNT_PER_STEP = 5;

const body = document.querySelector('body');
export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmDetailComponent = null;

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

  #openFilmDetail = (film) => {
    if (this.#filmDetailComponent) {
      this.#closeFilmDetail();
      return;
    }
    this.#filmDetailComponent = new FilmDetailsView(film);
    this.#filmDetailComponent.setCloseClickHandler(this.#closeFilmDetail);
    document.addEventListener('keydown', this.#handleKeyDown);
    document.addEventListener('click', this.#handleClickOutside);
    render(this.#filmDetailComponent, body);
    body.classList.add('hide-overflow');
  };

  #closeFilmDetail = () => {
    remove(this.#filmDetailComponent);
    this.#filmDetailComponent.removeCloseClickHandler(this.#closeFilmDetail);
    document.removeEventListener('keydown', this.#handleKeyDown);
    document.removeEventListener('click', this.#handleClickOutside);
    body.classList.remove('hide-overflow');
    this.#filmDetailComponent = null;
  };

  #handleKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closeFilmDetail();
    }
  };

  #handleClickOutside = (evt) => {
    if (!this.#filmDetailComponent.element.contains(evt.target)) {
      this.#closeFilmDetail();
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent.element, this.#openFilmDetail);
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
