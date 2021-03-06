import {remove, render} from './framework/render.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import FilmsApiService from './api/films-api-service.js';
import CommentsApiService from './api/comments-api-service.js';

const AUTHORIZATION = 'Basic ikf1Leyz2gj3gjkire4';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const statisticsView = new StatisticsView(filmsModel.films);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(siteBodyElement, filterModel, filmsModel, commentsModel);
render(statisticsView, siteFooterElement);

filmsPresenter.init();
filterPresenter.init();
filmsModel.init()
  .finally(() => {
    remove(statisticsView);
    render(new StatisticsView(filmsModel.films), siteFooterElement);
  });
