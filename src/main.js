import ProfileButtonView from './view/profile-button-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import {render} from './framework/render.js';
import FilmsModel from './model/films-model.js';
import {generateFilter} from './mock/filter.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filters = generateFilter(filmsModel.films);

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);

render(new ProfileButtonView(), siteHeaderElement);
render(new MainNavigationView(filters), siteMainElement);
render(new StatisticsView(), siteFooterElement);

filmsPresenter.init();
