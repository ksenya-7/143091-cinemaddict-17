import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (count) => `<p>${count} movies inside</p>`;

export default class StatisticsView extends AbstractView {
  get template() {
    return createStatisticsTemplate();
  }
}
