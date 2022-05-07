import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsСontainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmsEmptyView from '../view/films-empty-view.js';
import SortView from '../view/sort-view.js';
import {render} from '../render.js';

const FILM_COUNT_PER_STEP = 5;
const body = document.querySelector('body');

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmDetailComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsСontainerComponent = new FilmsСontainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #listFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  init = (filmsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#listFilms = [...this.#filmsModel.films];

    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#listFilms.every((film) => film.isArchive)) {
      render(new FilmsEmptyView(), this.#filmsComponent.element);
    } else {
      render(new SortView(), this.#filmsListComponent.element);
      render(this.#filmsListComponent, this.#filmsComponent.element);
      render(this.#filmsСontainerComponent, this.#filmsListComponent.element);

      for (let i = 0; i < Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#listFilms[i]);
      }

      if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

        this.#showMoreButtonComponent.element.addEventListener('click', this.#handleShowMoreButtonClick);
      }
    }
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#listFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #openFilmDetail = (film) => {
    this.#filmDetailComponent = new FilmDetailsView(film);
    this.#filmDetailComponent.closeButton.addEventListener('click', this.#closeFilmDetail);
    document.addEventListener('keydown', this.#handleKeyDown);
    document.addEventListener('click', this.#handleClickOutside);
    render(this.#filmDetailComponent, body);
    body.classList.add('hide-overflow');
  };

  #closeFilmDetail = () => {
    this.#filmDetailComponent.element.remove();
    this.#filmDetailComponent.removeElement();
    this.#filmDetailComponent.closeButton.removeEventListener('click', this.#closeFilmDetail);
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

  #renderFilm = (film) => {
    const filmComponent = new FilmCardView(film);

    filmComponent.element.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (this.#filmDetailComponent) {
        this.#closeFilmDetail();
      } else {
        this.#openFilmDetail(film);
      }
    });

    render(filmComponent, this.#filmsСontainerComponent.element);
  };
}
