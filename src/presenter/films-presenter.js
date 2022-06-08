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
import CommentsModel from '../model/comments-model.js';
import CommentsApiService from '../api/comments-api-service.js';

const AUTHORIZATION = 'Basic ikf1Leyz2gj3gjkire4';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const FILM_COUNT_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const body = document.querySelector('body');
export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;
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
  #mode = Mode.DEFAULT;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

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
    this.#renderBoard();
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#filmPopupComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#filmPopupComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#filmPopupComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
      });
    };

    this.#filmPopupComponent.shake(resetFormState);
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

  #openFilmPopup = (film, scrollTop) => {
    this.#film = film;
    const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION, this.#film.id));

    commentsModel.init()
      .finally(() => {
        if (this.#filmPopupComponent) {
          this.#closeFilmPopup();
        }

        this.#film.comments = commentsModel.comments;
        // console.log(this.#film.comments);
        this.#filmPopupComponent = new FilmPopupView(this.#film);
        this.#filmPopupComponent.setCloseClickHandler(this.#closeFilmPopup);
        this.#filmPopupComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
        this.#filmPopupComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
        this.#filmPopupComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
        this.#filmPopupComponent.setFormSubmitHandler(this.#handleCommentAddHandler);
        this.#filmPopupComponent.setDeleteClickHandler(this.#handleCommentDeleteHandler);
        render(this.#filmPopupComponent, body);

        document.addEventListener('keydown', this.#handleKeyDown);
        body.classList.add('hide-overflow');

        this.#film.comments = this.#film.comments.map((el) => el.id);
        if (scrollTop) {
          this.#filmPopupComponent.element.scrollTop = scrollTop;
        }
        // console.log(this.#filmPopupComponent.element.scrollTop);
      });
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

    // this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setAborting();
    }

    this.#openFilmPopup(film);

    this.#uiBlocker.unblock();
  };

  #watchedPopupClickHandler = async () => {
    this.#uiBlocker.block();

    const film = {...this.#film, watched: !this.#film.watched};

    // this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setAborting();
    }

    this.#openFilmPopup(film);

    this.#uiBlocker.unblock();
  };

  #favoritePopupClickHandler = async () => {
    this.#uiBlocker.block();

    const film = {...this.#film, favorite: !this.#film.favorite};

    // this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    } catch(err) {
      this.#filmPresenter.get(film.id).setAborting();
    }

    this.#openFilmPopup(film);

    this.#uiBlocker.unblock();
  };

  #handleCommentAddHandler = (film, comment, scrollTop) => {
    const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION, this.#film.id));
    commentsModel.addComment(UpdateType.MINOR, comment);
    this.#filmsModel.updateFilm(UpdateType.MINOR, film); // вызывает ошибку
    this.#openFilmPopup(film, scrollTop);
  };

  #handleCommentDeleteHandler = (film, comments, id) => {
    const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION, this.#film.id));
    commentsModel.init()
      .finally(() => {
        const comment = comments.find((item) => String(item.id) === id);
        commentsModel.deleteComment(UpdateType.MINOR, comment); // удаляет при повторном клике только
        this.#filmsModel.updateFilm(UpdateType.MINOR, film); // вызывает ошибку
        // this.#filmPresenter.get(comment.id).setDeleting(); //как это работает вообще
        this.#openFilmPopup(film);
      });
  };
}
