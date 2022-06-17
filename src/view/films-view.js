import AbstractView from '../framework/view/abstract-view.js';

const createFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container" id="films-list-main"></div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container" id="films-list-top-rated"></div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container" id="films-list-most-commented"></div>
    </section>
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
