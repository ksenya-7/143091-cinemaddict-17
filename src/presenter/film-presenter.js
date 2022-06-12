import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import {UpdateType} from '../const.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #openFilmPopup = null;
  #filmComponent = null;

  #film = null;
  #filmsModel = null;

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

  setControlsAborting = (popupComponent) => {
    const resetFormState = () => {
      popupComponent.updateElement({
        isDisabled: false,
      });
    };

    popupComponent.controls.shakeControls(resetFormState);
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
    const parentBlock = target.closest('film-details__comment');

    parentBlock.shakeCommentDelete(resetFormState, parentBlock);
  };

  #handleWatchlistClick = () => {
    this.#filmsModel.updateFilm(
      UpdateType.MINOR,
      {...this.#film, watchlist: !this.#film.watchlist},
    );
  };

  #handleWatchedClick = () => {
    this.#filmsModel.updateFilm(
      UpdateType.MINOR,
      {...this.#film, watched: !this.#film.watched},
    );
  };

  #handleFavoriteClick = () => {
    this.#filmsModel.updateFilm(
      UpdateType.MINOR,
      {...this.#film, favorite: !this.#film.favorite},
    );
  };
}
