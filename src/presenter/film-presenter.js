import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

import FilmsСontainerView from '../view/films-container-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #openFilmPopup = null;
  #filmComponent = null;

  #filmsContainerComponent = null;

  #film = null;

  constructor(filmListContainer, openFilmPopup) {
    this.#filmListContainer = filmListContainer;
    this.#openFilmPopup = openFilmPopup;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmsContainerComponent = new FilmsСontainerView();

    this.#filmComponent.setOpenClickHandler(() => {
      this.#openFilmPopup(film);
    });

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
}
