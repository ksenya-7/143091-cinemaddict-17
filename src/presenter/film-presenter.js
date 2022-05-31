import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #openFilmPopup = null;
  #filmComponent = null;

  #film = null;
  #changeData = null;

  constructor(filmListContainer, openFilmPopup, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#openFilmPopup = openFilmPopup;
    this.#changeData = changeData;
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

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, watchlist: !this.#film.watchlist},
    );
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, watched: !this.#film.watched},
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, favorite: !this.#film.favorite},
    );
  };
}
