import {render, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmsСontainerView from '../view/films-container-view.js';

const body = document.querySelector('body');

export default class FilmPresenter {
  #filmListContainer = null;
  #filmComponent = null;

  #filmDetailComponent = null;
  #filmsСontainerComponent = null;

  #film = null;

  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (film) => {
    this.#film = film;

    this.#filmComponent = new FilmCardView(film);
    this.#filmsСontainerComponent = new FilmsСontainerView();

    this.#filmComponent.setOpenClickHandler(() => {
      if (this.#filmDetailComponent) {
        this.#closeFilmDetail();
        return;
      }
      this.#openFilmDetail(film);
    });

    render(this.#filmComponent, this.#filmListContainer);
  };

  #openFilmDetail = (film) => {
    this.#filmDetailComponent = new FilmDetailsView(film);
    this.#filmDetailComponent.setCloseClickHandler(this.#closeFilmDetail);
    document.addEventListener('keydown', this.#handleKeyDown);
    document.addEventListener('click', this.#handleClickOutside);
    render(this.#filmDetailComponent, body);
    body.classList.add('hide-overflow');
  };

  #closeFilmDetail = () => {
    remove(this.#filmDetailComponent);
    this.#filmDetailComponent.removeCloseClickHandler(this.#closeFilmDetail);
    document.removeEventListener('keydown', this.#handleKeyDown);
    document.removeEventListener('click', this.#handleClickOutside);
    body.classList.remove('hide-overflow');
    this.#filmDetailComponent = null;
  };

  #handleKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closeFilmDetail();
    }
  };

  #handleClickOutside = (evt) => {
    if (!this.#filmDetailComponent.element.contains(evt.target)) {
      this.#closeFilmDetail();
    }
  };
}
