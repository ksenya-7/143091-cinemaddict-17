import ProfileButtonView from './view/profile-button-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmDetailsView from './view/film-details-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import {render} from './render.js';
import FilmsModel from './model/films-model.js';
import {generateFilm} from './mock/film.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter();
const filmsModel = new FilmsModel();
const filmModel = generateFilm();

render(new ProfileButtonView(), siteHeaderElement);
render(new MainNavigationView(), siteMainElement);
render(new SortView(), siteMainElement);
render(new StatisticsView(), siteFooterElement);
render(new FilmDetailsView(filmModel), siteBodyElement);

filmsPresenter.init(siteMainElement, filmsModel);
