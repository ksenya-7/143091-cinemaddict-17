import {render, replace, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilmCardView from '../view/film-card-view.js';
import {UpdateType} from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmPresenter {
  #filmListContainer = null;
  #openFilmPopup = null;
  #filmComponent = null;

  #film = null;
  #filmsModel = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(filmListContainer, openFilmPopup, filmsModel) {
    this.#filmListContainer = filmListContainer;
    this.#openFilmPopup = openFilmPopup;
    this.#filmsModel = filmsModel;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(film);

    this.#filmComponent.setOpenClickHandler(() => {
      this.#openFilmPopup(film);
    });

    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  setControlsAborting = () => {
    const resetFormState = () => {
      this.#filmComponent.updateElement({
        isDisabled: false,
      });
    };

    this.#filmComponent.shakeControls(resetFormState);
  };

  setPopupControlsAborting = (popupComponent) => {
    const resetFormState = () => {
      popupComponent.updateElement({
        isDisabled: false,
      });
    };

    popupComponent.shakeControls(resetFormState);
  };

  setAddAborting = (popupComponent) => {
    const resetFormState = () => {
      popupComponent.updateElement({
        isDisabled: false,
      });
    };

    popupComponent.shake(resetFormState);
  };

  setDeleteAborting = (popupComponent, target) => {
    const resetFormState = () => {
      popupComponent.updateElement({
        isDisabled: false,
      });
    };
    const parentBlock = target.closest('.film-details__comment');

    popupComponent.shakeCommentDelete(resetFormState, parentBlock);
  };

  #handleWatchlistClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, watchlist: !this.#film.watchlist},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };

  #handleWatchedClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, watched: !this.#film.watched},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };

  #handleFavoriteClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, favorite: !this.#film.favorite},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };
}
