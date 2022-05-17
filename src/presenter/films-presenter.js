import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsСontainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import FilmPopupView from '../view/film-details-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';
import {updateItem} from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;

const body = document.querySelector('body');
export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmPopupComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsСontainerView();
  #sortComponent = new SortView();
  #noFilmComponent = new FilmsEmptyView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #listFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #popupFilm = new Map();
  #changeData = null;
  #changePopupData = null;
  #film = null;

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

  #handleFilmChange = (updatedFilm) => {
    this.#listFilms = updateItem(this.#listFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #handleFilmPopupChange = (updatedFilmPopup) => {
    this.#listFilms = updateItem(this.#listFilms, updatedFilmPopup);
    this.#filmPresenter.get(updatedFilmPopup.id).init(updatedFilmPopup);
    this.#openFilmPopup(updatedFilmPopup);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent.element, this.#openFilmPopup, this.#handleFilmChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
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

  #setClickHandlers = (popup) => {
    popup.setCloseClickHandler(this.#closeFilmPopup);
    popup.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    popup.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    popup.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);

    render(popup, body);
  };

  #openFilmPopup = (film) => {
    this.#film = film;

    if (this.#filmPopupComponent) {
      this.#closeFilmPopup();
      return;
    }
    this.#filmPopupComponent = new FilmPopupView(film);
    this.#popupFilm.set(film.id, this.#filmPopupComponent);

    this.#setClickHandlers(this.#filmPopupComponent);
    document.addEventListener('keydown', this.#handleKeyDown);
    document.addEventListener('click', this.#handleClickOutside);

    body.classList.add('hide-overflow');
  };

  #closeFilmPopup = () => {
    remove(this.#filmPopupComponent);
    this.#filmPopupComponent.removeCloseClickHandler(this.#closeFilmPopup);
    document.removeEventListener('keydown', this.#handleKeyDown);
    document.removeEventListener('click', this.#handleClickOutside);
    body.classList.remove('hide-overflow');
    this.#filmPopupComponent = null;
  };

  #handleKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closeFilmPopup();
    }
  };

  #handleClickOutside = (evt) => {
    if (!this.#filmPopupComponent.element.contains(evt.target)) {
      this.#closeFilmPopup();
    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
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

  #watchlistPopupClickHandler = () => {
    const updatedFilmPopup = {...this.#film, watchlist: !this.#film.watchlist};

    console.log({...this.#film});
    console.log(updatedFilmPopup);

    this.#listFilms = updateItem(this.#listFilms, updatedFilmPopup);
    this.#filmPresenter.get(updatedFilmPopup.id).init(updatedFilmPopup);
    // this.#openFilmPopup(updatedFilmPopup);

    this.#closeFilmPopup();
    this.#filmPopupComponent = new FilmPopupView(updatedFilmPopup);
    this.#setClickHandlers(this.#filmPopupComponent);
    document.addEventListener('keydown', this.#handleKeyDown);
    body.classList.add('hide-overflow');

    // this.#filmPopupComponent = newfilmPopupComponent;
  };

  #watchedPopupClickHandler = () => {
    this.#changePopupData({...this.#film, watched: !this.#film.watched});
  };

  #favoritePopupClickHandler = () => {
    this.#changePopupData({...this.#film, favorite: !this.#film.favorite});
  };
}
