import AbstractView from '../framework/view/abstract-view.js';

const profileRating = (item) => {
  if (item > 21) {
    return 'Movie Buff';
  } else if (item >= 11 || item <= 20) {
    return 'fan';
  } else if (item >= 1 || item <= 10) {
    return 'novice';
  } else {
    return '';
  }
};

const createProfileButtonTemplate = (count) => {
  const profile = profileRating(count);

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
