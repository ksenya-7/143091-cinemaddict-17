import ProfileButtonView from './view/profile-button-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import {render} from './render.js';
import FilmsModel from './model/films-model.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter();
const filmsModel = new FilmsModel();

render(new ProfileButtonView(), siteHeaderElement);
render(new MainNavigationView(), siteMainElement);
render(new StatisticsView(), siteFooterElement);

filmsPresenter.init(siteMainElement, filmsModel);
