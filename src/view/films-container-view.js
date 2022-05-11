import AbstractView from '../framework/view/abstract-view.js';

const createFilmsСontainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsСontainerView extends AbstractView {
  get template() {
    return createFilmsСontainerTemplate();
  }
}
