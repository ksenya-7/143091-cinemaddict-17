import {render} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

import FilmsСontainerView from '../view/films-container-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #openFilmDetail = null;
  #filmComponent = null;

  #filmsContainerComponent = null;

  #film = null;

  constructor(filmListContainer, openFilmDetail) {
    this.#filmListContainer = filmListContainer;
    this.#openFilmDetail = openFilmDetail;
  }

  init = (film) => {
    this.#film = film;

    this.#filmComponent = new FilmCardView(film);
    this.#filmsContainerComponent = new FilmsСontainerView();

    this.#filmComponent.setOpenClickHandler(() => {
      this.#openFilmDetail(film);
    });

    render(this.#filmComponent, this.#filmListContainer);
  };
}
