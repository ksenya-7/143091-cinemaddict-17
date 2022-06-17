import AbstractView from '../framework/view/abstract-view.js';
import {getProfileRating} from '../utils/common.js';

const createProfileButtonTemplate = (count) => {
  const profile = getProfileRating(count);

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${profile} </p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class ProfileButtonView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createProfileButtonTemplate(this.#films.length);
  }
}
