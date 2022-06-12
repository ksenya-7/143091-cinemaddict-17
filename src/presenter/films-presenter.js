import {render, remove, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPopupView from '../view/film-details-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';
import {sortFilmByDate, sortFilmByRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, FilterType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const body = document.querySelector('body');
export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;
  #filmPopupComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #loadingComponent = new LoadingView();
  #noFilmComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #film = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(filmsContainer, filterModel, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
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
    this.#renderBoard();
  };

  setControlsAborting = () => {
    const resetFormState = () => {
      this.#filmPopupComponent.updateElement({
        isDisabled: false,
      });
    };

    this.#filmPopupComponent.controls.shake(resetFormState);
  };

  setAddAborting = () => {
    const resetFormState = () => {
      this.#filmPopupComponent.updateElement({
        isDisabled: false,
      });
    };

    this.#filmPopupComponent.element.shake(resetFormState);
  };

  setDeleteAborting = (target) => {
    const resetFormState = () => {
      this.#filmPopupComponent.updateElement({
        isDisabled: false,
      });
    };

    target.closest('film-details__comment').shake(resetFormState);
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent.element, this.#openFilmPopup, this.#filmsModel);

    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
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
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
  };

  #openFilmPopup = async (film, scrollTop) => {
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

    if (scrollTop) {
      this.#filmPopupComponent.element.scrollTop = scrollTop;
    }
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
    remove(this.#loadingComponent);
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

  #renderBoard = () => {
    const filmCount = this.films.length;

    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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

  #watchlistPopupClickHandler = async () => {
    this.#uiBlocker.block();

    const film = {...this.#film, watchlist: !this.#film.watchlist};

    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setControlsAborting();
    }

    this.#openFilmPopup(film);

    this.#uiBlocker.unblock();
  };

  //   #watchlistPopupClickHandler = async (film) => {
  //   this.#uiBlocker.block();

  //   this.#film = film;
  //   console.log(film);

  //   try {
  //     await this.#filmsModel.updateFilm(
  //       UpdateType.MINOR,
  //       {...film, watchlist: !film.watchlist},
  //     );
  //   } catch(err) {
  //     this.#filmPresenter.get(film.id).setControlsAborting();
  //   }

  //   this.#openFilmPopup(film);

  //   this.#uiBlocker.unblock();
  // };

  #watchedPopupClickHandler = async () => {
    this.#uiBlocker.block();

    const film = {...this.#film, watched: !this.#film.watched};

    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setControlsAborting();
    }

    this.#openFilmPopup(film);

    this.#uiBlocker.unblock();
  };

  #favoritePopupClickHandler = async () => {
    this.#uiBlocker.block();

    const film = {...this.#film, favorite: !this.#film.favorite};

    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setControlsAborting();
    }

    this.#openFilmPopup(film);

    this.#uiBlocker.unblock();
  };

  #handleCommentAddHandler = async (film, comment, scrollTop) => {
    this.#uiBlocker.block();

    try {
      await this.#commentsModel.addComment(UpdateType.PATCH, comment, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setAddAborting();
    }

    this.#openFilmPopup(film, scrollTop);

    this.#uiBlocker.unblock();
  };

  #handleCommentDeleteHandler = async (film, id, scrollTop, target) => {
    this.#uiBlocker.block();

    const commentsById = await this.#commentsModel.getComments(film.id);
    const comment = commentsById.find((item) => String(item.id) === id);
    const index = commentsById.findIndex((item) => String(item.id) === id);
    film.comments.splice(index, 1);
    target.setAttribute('disabled', 'disabled');
    target.textContent = 'Deleting...';

    try {
      await this.#commentsModel.deleteComment(UpdateType.PATCH, comment, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setDeleteAborting(target);
    }

    this.#openFilmPopup(film, scrollTop);

    this.#uiBlocker.unblock();
  };
}
