import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsСontainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsСontainerComponent = new FilmsСontainerView();

  #listFilms = [];

  init = (filmsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#listFilms = [...this.#filmsModel.films];

    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsСontainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < this.#listFilms.length; i++) {
      this.#renderFilm(this.#listFilms[i]);
    }

    render(new ShowMoreButtonView(), this.#filmsListComponent.element);
  };

  #renderFilm = (film) => {
    const filmComponent = new FilmCardView(film);
    const siteBodyElement = document.querySelector('body');

    const openFilmDetail = () => {
      const filmDetailComponent = new FilmDetailsView(film);

      render(filmDetailComponent, siteBodyElement);
      siteBodyElement.classList.add('hide-overflow');
    };

    const closeFilmDetail = (popup) => {
      popup.remove();
      siteBodyElement.classList.remove('hide-overflow');
      // filmDetailComponent.removeElement();
    };

    // const onEscKeyDown = (evt) => {
    //   const popup = siteBodyElement.querySelector('.film-details');
    //   // console.log(popup);
    //   if (evt.key === 'Escape' || evt.key === 'Esc') {
    //     evt.preventDefault();
    //     popup.remove();

    //     document.removeEventListener('keydown', onEscKeyDown);
    //   }
    // };

    filmComponent.element.addEventListener('click', () => {
      openFilmDetail();
      const button = siteBodyElement.querySelector('.film-details__close-btn');
      const popup = siteBodyElement.querySelector('.film-details');

      button.addEventListener('click', () => {
        // console.log(popup);
        closeFilmDetail(popup);
        button.removeEventListener('click', () => {
          closeFilmDetail(popup);
        });
      });

      document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          popup.remove();

          document.removeEventListener('keydown', () => {
            if (evt.key === 'Escape' || evt.key === 'Esc') {
              evt.preventDefault();
              popup.remove();
            }
          });
        }
      });
    });

    render(filmComponent, this.#filmsСontainerComponent.element);
  };
}
