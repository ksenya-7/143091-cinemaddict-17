import AbstractView from '../framework/view/abstract-view.js';

const createFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list" id="films-list-main"><h2 class="films-list__title visually-hidden">All movies. Upcoming</h2></section>
    <section class="films-list films-list--extra" id="films-list-top-rated"><h2 class="films-list__title">Top rated</h2></section>
    <section class="films-list films-list--extra" id="films-list-most-commented"><h2 class="films-list__title">Most commented</h2></section>
  </section>`
);

export default class FilmsView extends AbstractView {
  get template() {
    return createFilmsTemplate();
  }

  get mainListElement() {
    return this.element.querySelector('#films-list-main');
  }

  get topRatedListElement() {
    return this.element.querySelector('#films-list-top-rated');
  }

  get mostCommentedListElement() {
    return this.element.querySelector('#films-list-most-commented');
  }
}
