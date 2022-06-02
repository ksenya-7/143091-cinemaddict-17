import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import FilmPopupView from '../view/film-details-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';
import {sortFilmByDate, sortFilmByRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import CommentsModel from '../model/comments-model.js';

const FILM_COUNT_PER_STEP = 5;

const body = document.querySelector('body');
export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #filmPopupComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #noFilmComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #film = null;

  #currentSortType = SortType.DEFAULT;
  #commentsModel = new CommentsModel();
  #filterType = FilterType.ALL;

  constructor(filmsContainer, filmsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmsComponent();
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderFilmsComponent();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsComponent();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderFilmsComponent();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent.element, this.#openFilmPopup, this.#handleViewAction);

    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new FilmsEmptyView(this.#filterType);
    render(this.#noFilmComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
  };

  #openFilmPopup = (film) => {
    this.#film = film;

    if (this.#filmPopupComponent) {
      this.#closeFilmPopup();
    }
    this.#film.comments = this.#film.comments.map((_, id) => this.#commentsModel.comments[id]);
    this.#filmPopupComponent = new FilmPopupView(film);
    this.#filmPopupComponent.setCloseClickHandler(this.#closeFilmPopup);
    this.#filmPopupComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    this.#filmPopupComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    this.#filmPopupComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
    this.#filmPopupComponent.setFormSubmitHandler(this.#handleFormSubmit);
    render(this.#filmPopupComponent, body);

    document.addEventListener('keydown', this.#handleKeyDown);
    body.classList.add('hide-overflow');
    this.#film.comments = this.#film.comments.map((el) => el.id);
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

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noFilmComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsComponent = () => {
    const filmCount = this.films.length;

    render(this.#filmsComponent, this.#filmsContainer);

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);
    this.#renderFilms(this.films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  };

  #watchlistPopupClickHandler = () => {
    const film = {...this.#film, watchlist: !this.#film.watchlist};

    this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    this.#openFilmPopup(film);
  };

  #watchedPopupClickHandler = () => {
    const film = {...this.#film, watched: !this.#film.watched};

    this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    this.#openFilmPopup(film);
  };

  #favoritePopupClickHandler = () => {
    const film = {...this.#film, favorite: !this.#film.favorite};

    this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    this.#openFilmPopup(film);
  };

  #handleFormSubmit = (film, newComments) => {
    this.#commentsModel.comments = newComments;
    this.#film.comments.push(this.#film.comments.length + 1);
    this.#openFilmPopup(film);
  };
}
