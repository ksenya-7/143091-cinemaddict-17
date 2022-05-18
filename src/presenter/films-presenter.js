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
import {sortFilmByDate, sortFilmByRating} from '../utils/film.js';
import {SortType} from '../const.js';

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
  #film = null;

  #currentSortType = SortType.DEFAULT;
  #sourcedListFilms = [];

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#listFilms = [...this.#filmsModel.films];
    this.#sourcedListFilms = [...this.#filmsModel.films];

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
    this.#sourcedListFilms = updateItem(this.#sourcedListFilms, updatedFilm);

    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#listFilms.sort(sortFilmByDate);
        break;
      case SortType.RATING:
        this.#listFilms.sort(sortFilmByRating);
        break;
      default:
        this.#listFilms = [...this.#sourcedListFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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

  #openFilmPopup = (film) => {
    this.#film = film;

    if (this.#filmPopupComponent) {
      this.#closeFilmPopup();
    }

    this.#filmPopupComponent = new FilmPopupView(film);
    this.#filmPopupComponent.setCloseClickHandler(this.#closeFilmPopup);
    this.#filmPopupComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    this.#filmPopupComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    this.#filmPopupComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
    render(this.#filmPopupComponent, body);

    document.addEventListener('keydown', this.#handleKeyDown);
    body.classList.add('hide-overflow');
  };

  #closeFilmPopup = () => {
    remove(this.#filmPopupComponent);

    document.removeEventListener('keydown', this.#handleKeyDown);
    body.classList.remove('hide-overflow');
    this.#filmPopupComponent = null;
  };

  #handleKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closeFilmPopup();
    }
  };

  #clearFilmsList = () => {
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
    const film = {...this.#film, watchlist: !this.#film.watchlist};

    this.#listFilms = updateItem(this.#listFilms, film);
    this.#filmPresenter.get(film.id).init(film);
    this.#openFilmPopup(film);
  };

  #watchedPopupClickHandler = () => {
    const film = {...this.#film, watched: !this.#film.watched};

    this.#listFilms = updateItem(this.#listFilms, film);
    this.#filmPresenter.get(film.id).init(film);
    this.#openFilmPopup(film);
  };

  #favoritePopupClickHandler = () => {
    const film = {...this.#film, favorite: !this.#film.favorite};

    this.#listFilms = updateItem(this.#listFilms, film);
    this.#filmPresenter.get(film.id).init(film);
    this.#openFilmPopup(film);
  };
}
