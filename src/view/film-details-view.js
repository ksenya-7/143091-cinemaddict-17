import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeFilmReleaseDate} from '../utils/film.js';
import {getTimeFromMins} from '../utils/common.js';
import {EMOTIONS} from '../const.js';
import {generateComment} from '../mock/comments.js';
import dayjs from 'dayjs';

const BLANK_COMMENT = {
  comment: '',
  date: dayjs().format('YYYY/MM/DD HH:MM'),
  emotion: '',
  isEmotion: null,
};

const createGenresTemplate = (genres) => {
  const createSpansTemplate = () => genres.map((element) => (`<span class="film-details__genre">${element}</span>`)).join('');
  return (
    `<td class="film-details__term">${genres.length === 1 ? 'Genre' : 'Genres'}</td>
      <td class="film-details__cell">
        ${createSpansTemplate()}
    `
  );
};

const createCommentsTemplate = (comments) => comments.map((comment) => {
  const commentById = generateComment(comment);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${commentById.emotion}.png" width="55" height="55" alt="emoji-${commentById.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${commentById.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${commentById.author}</span>
          <span class="film-details__comment-day">${commentById.date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`);
}).join('');


const createEmotionsTemplate = () => EMOTIONS.map((el) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${el}" value="${el}">
    <label class="film-details__emoji-label" for="emoji-${el}">
      <img src="./images/emoji/${el}.png" width="30" height="30" alt="emoji-${el}">
    </label>`)).join('');

const createFilmPopupTemplate = (film, isEmotion, isNewComment) => {
  const filmInfo = film['film_info'];

  const releaseDate = filmInfo['release']['date'];
  const releaseFullDate = humanizeFilmReleaseDate(releaseDate);

  const runtime = getTimeFromMins(filmInfo['runtime']);

  const genre = filmInfo['genre'];
  const genresTemplate = createGenresTemplate(genre);

  const comments = film.comments;
  const commentsTemplate = createCommentsTemplate(comments);

  const watchlistClassName = film.watchlist ? 'film-details__control-button--active' : '';
  const watchedClassName = film.watched ? 'film-details__control-button--active' : '';
  const favoriteClassName = film.favorite ? 'film-details__control-button--active' : '';

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
              <img class="film-details__poster-img" src="./${filmInfo['poster']}" alt="">

              <p class="film-details__age">${filmInfo['age_rating']}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo['title']}</h3>
                  <p class="film-details__title-original">${filmInfo['alternative_title']}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo['total_rating']}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo['director']}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo['writers']}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo['actors']}</td>
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
                  <td class="film-details__cell">${filmInfo['release']['release_country']}</td>
                </tr>
                <tr class="film-details__row">
                  ${genresTemplate}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo['description']}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${watchlistClassName} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${watchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button ${favoriteClassName} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list">
              ${commentsTemplate}
            </ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${isNewComment ? `<img src="./images/emoji/${BLANK_COMMENT.emotion}.png" width="55" height="55" alt="emoji-${BLANK_COMMENT.emotion}"` : ''}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${isNewComment ? `${BLANK_COMMENT.comment}` : ''}</textarea>
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

export default class FilmPopupView extends AbstractStatefulView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;

    // this._state = FilmPopupView.parseFilmToState(film);
    this.#setInnerHandlers();
    // console.log(FilmPopupView.parseFilmToState(film));
  }

  get template() {
    return createFilmPopupTemplate(this.#film);
    // return createFilmPopupTemplate(this._state);
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  setWatchlistPopupClickHandler = (callback) => {
    this._callback.watchlistPopupClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistPopupClickHandler);
  };

  setWatchedPopupClickHandler = (callback) => {
    this._callback.watchedPopupClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedPopupClickHandler);
  };

  setFavoritePopupClickHandler = (callback) => {
    this._callback.favoritePopupClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoritePopupClickHandler);
  };

  #closeClickHandler = () => {
    this._callback.closeClick();
  };

  #watchlistPopupClickHandler = () => {
    this._callback.watchlistPopupClick();
  };

  #watchedPopupClickHandler = () => {
    this._callback.watchedPopupClick();
  };

  #favoritePopupClickHandler = () => {
    this._callback.favoritePopupClick();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #emotionChangeHandler = (evt) => {
    evt.preventDefault();
    // console.log(evt.target.value);
    this.updateElement({
      emotion: evt.target.value,
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emotionChangeHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  static parseFilmToState = (film, comments) => (
    {...film,
      // comments: film.comments.push(film.comments.length + 1),
    },
    {...comments,
      id: film.comments.length + 1,
      author: 'John Doe',
      comment: '',
      date: dayjs().format('YYYY/MM/DD HH:MM'),
      emotion: '',
      isEmotion: BLANK_COMMENT.emotion !== null,
      isNewComment: BLANK_COMMENT.comment !== null,
    }
  );

  static parseStateToFilm = (state) => {
    const film = {...state};

    return film;
  };
}
