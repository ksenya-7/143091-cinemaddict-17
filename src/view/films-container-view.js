import {createElement} from '../render.js';

const createFilmsСontainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsСontainerView {
  getTemplate() {
    return createFilmsСontainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
