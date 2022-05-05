import {createElement} from '../render.js';
import {humanizeFilmReleaseDate, getTimeFromMins} from '../utils.js';
import {generateComment} from '../mock/comments.js';
import {EMOTIONS} from '../const.js';

const createGenresTemplate = (genres) => {
  const createSpansTemplate = () => genres.map((element) => (`<span class="film-details__genre">${element}</span>`)).join('');
  return (
    `<td class="film-details__term">${genres.length === 1 ? 'Genre' : 'Genres'}</td>
      <td class="film-details__cell">
        ${createSpansTemplate()}
    `
  );
};

const createCommentsTemplate = (comments) => {
  const createUlTemplate = () => comments.map((comment) => {
    const commentById = generateComment(comment);
    const commentFullDate = humanizeFilmReleaseDate(commentById['date']);

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${commentById['emotion']}.png" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${commentById['comment']}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${commentById['author']}</span>
            <span class="film-details__comment-day">${commentFullDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`);
  }).join('');

  return (
    `<ul class="film-details__comments-list">
        ${createUlTemplate()}
    </ul>`
  );
};

const createEmotionsTemplate = () => EMOTIONS.map((el) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/${el}.png" width="30" height="30" alt="emoji">
    </label>`)).join('');


const createFilmDetailsTemplate = (film) => {
  const filmInfo = film['film_info'];
  const title = filmInfo['title'];
  const titleOriginal = filmInfo['alternative_title'];
  const rating = filmInfo['total_rating'];
  const releaseDate = filmInfo['release']['date'];
  const releaseCountry = filmInfo['release']['release_country'];
  const runtime = getTimeFromMins(filmInfo['runtime']);
  const genre = filmInfo['genre'];
  const poster = filmInfo['poster'];
  const description = filmInfo['description'];
  const ageRating = filmInfo['age_rating'];
  const director = filmInfo['director'];
  const writers = filmInfo['writers'];
  const actors = filmInfo['actors'];

  const comments = film['comments'];
  const releaseFullDate = humanizeFilmReleaseDate(releaseDate);

  const userDetails = film['user_details'];

  const isWatched = userDetails['already_watched'];

  const watchedClassName = isWatched
    ? 'film-details__control-button--active'
    : '';

  const genresTemplate = createGenresTemplate(genre);
  const commentsTemplate = createCommentsTemplate(comments);
  const emotionsTemplate = createEmotionsTemplate();

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${titleOriginal}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseFullDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runtime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  ${genresTemplate}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${watchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            ${commentsTemplate}
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emotionsTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
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
