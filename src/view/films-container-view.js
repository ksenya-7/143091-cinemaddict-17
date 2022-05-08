import {createElement} from '../render.js';

const createFilmsСontainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsСontainerView {
  #element = null;

  get template() {
    return createFilmsСontainerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
