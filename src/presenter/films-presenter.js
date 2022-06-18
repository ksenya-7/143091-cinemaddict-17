import {render, remove, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPopupView from '../view/film-details-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';
import {sortFilmByDate, sortFilmByRating, sortFilmByComments} from '../utils/sorting.js';
import {filterFilms} from '../utils/filter-films.js';
import {SortType, UpdateType, FilterType, TimeLimit} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

const body = document.querySelector('body');


export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmPopupComponent = null;

  #filmsComponent = new FilmsView();
  #loadingComponent = new LoadingView();
  #noFilmComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmTopRatedPresenter = new Map();
  #filmMostCommentedPresenter = new Map();
  #film = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;
  #uiBlocker = null;

  constructor(filmsContainer, filterModel, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  }

  get films() {
    this.#filterType = this.#filterModel.filterFilms;
    const films = this.#filmsModel.films;
    const filteredFilms = filterFilms[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderBoard();
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

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmsComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsComponent.mainListElement, this.#openFilmPopup, this.#filmsModel);

    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderTopRatedFilm = (film) => {
    const filmTopRatedPresenter = new FilmPresenter(this.#filmsComponent.topRatedListElement, this.#openFilmPopup, this.#filmsModel);

    filmTopRatedPresenter.init(film);
    this.#filmTopRatedPresenter.set(film.id, filmTopRatedPresenter);
  };

  #renderTopRatedFilms = (films) => {
    films.forEach((film) => this.#renderTopRatedFilm(film));
  };

  #renderMostCommentedFilm = (film) => {
    const filmMostCommentedPresenter = new FilmPresenter(this.#filmsComponent.mostCommentedListElement, this.#openFilmPopup, this.#filmsModel);

    filmMostCommentedPresenter.init(film);
    this.#filmMostCommentedPresenter.set(film.id, filmMostCommentedPresenter);
  };

  #renderMostCommentedFilms = (films) => {
    films.forEach((film) => this.#renderMostCommentedFilm(film));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new FilmsEmptyView(this.#filterType);
    render(this.#noFilmComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmsComponent.mainListElement, RenderPosition.AFTEREND);
  };

  #openFilmPopup = async (film) => {
    this.#film = film;

    if (this.#filmPopupComponent) {
      this.#closeFilmPopup();
    }

    const comments = await this.#commentsModel.getComments(film.id);

    this.#filmPopupComponent = new FilmPopupView(this.#film, comments);
    this.#filmPopupComponent.setCloseClickHandler(this.#closeFilmPopup);
    this.#filmPopupComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    this.#filmPopupComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    this.#filmPopupComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
    this.#filmPopupComponent.setAddSubmitHandler(this.#handleCommentAddHandler);
    this.#filmPopupComponent.setDeleteClickHandler(this.#handleCommentDeleteHandler);
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

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    this.#filmTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmTopRatedPresenter.clear();

    this.#filmMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmMostCommentedPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#noFilmComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    this.#renderedFilmCount = resetRenderedFilmCount ? FILM_COUNT_PER_STEP : Math.min(filmCount, this.#renderedFilmCount);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    const filmCount = this.films.length;

    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (filmCount === 0) {
      this.#renderNoFilms();
      // remove(this.#filmsComponent.topRatedListElement);
      // remove(this.#filmsComponent.mostCommentedListElement);
      return;
    }

    this.#renderSort();

    this.#renderFilms(this.films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }

    this.#renderTopRatedFilms(this.films.sort(sortFilmByRating).slice(0, 2));

    this.#renderMostCommentedFilms(this.films.sort(sortFilmByComments).slice(0, 2));
  };

  #watchlistPopupClickHandler = async (film) => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, watchlist: !film.watchlist},
      );

      this.#filmPopupComponent.updateElement({watchlist: !film.watchlist});
    } catch(err) {
      this.#filmPresenter.get(film.id).setPopupControlsAborting(this.#filmPopupComponent);
    }

    this.#uiBlocker.unblock();
  };

  #watchedPopupClickHandler = async (film) => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, watched: !film.watched},
      );

      this.#filmPopupComponent.updateElement({watched: !film.watched});
    } catch(err) {
      this.#filmPresenter.get(film.id).setPopupControlsAborting(this.#filmPopupComponent);
    }

    this.#uiBlocker.unblock();
  };

  #favoritePopupClickHandler = async (film) => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, favorite: !film.favorite},
      );

      this.#filmPopupComponent.updateElement({favorite: !film.favorite});
    } catch(err) {
      this.#filmPresenter.get(film.id).setPopupControlsAborting(this.#filmPopupComponent);
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentAddHandler = async (film, comment) => {
    this.#uiBlocker.block();

    try {
      const newComments = await this.#commentsModel.addComment(UpdateType.PATCH, comment, film);
      await this.#filmsModel.updateFilm(UpdateType.MINOR, {...film});
      this.#filmPopupComponent.updateElementByComments(newComments, {comments: film.comments});
    } catch(err) {
      this.#filmPresenter.get(film.id).setAddAborting(this.#filmPopupComponent);
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentDeleteHandler = async (film, id, target, comments) => {
    this.#uiBlocker.block();

    target.setAttribute('disabled', 'disabled');
    target.textContent = 'Deleting...';
    const newComments = comments.filter((comment) => comment.id !== id);

    try {
      await this.#commentsModel.deleteComment(UpdateType.PATCH, id, film, comments);
      await this.#filmsModel.updateFilm(UpdateType.MINOR, {...film});
      this.#filmPopupComponent.updateElementByComments(newComments, {comments: film.comments});
    } catch(err) {
      target.textContent = 'Delete';
      target.removeAttribute('disabled', 'disabled');
      this.#filmPresenter.get(film.id).setDeleteAborting(this.#filmPopupComponent, target);
    }

    this.#uiBlocker.unblock();
  };
}
