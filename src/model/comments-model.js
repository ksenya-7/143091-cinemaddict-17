import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';
// import CommentApiService from '../api/comment-api-service.js';

// const AUTHORIZATION = 'Basic ikf1Leyz2gj3gjkire4';
// const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

// const commentsModel = new CommentsModel(new CommentApiService(END_POINT, AUTHORIZATION));
// commentsModel.init();

export default class CommentsModel extends Observable {
  #commentApiService = null;
  #comments = [];

  constructor(commentApiService) {
    super();
    this.#commentApiService = commentApiService;
  }

  get comments() {
    return this.#comments;
  }

  set comments(value) {
    this.#comments = value;
  }

  init = async () => {
    try {
      const comment = await this.#commentApiService.comment;
      this.#comments.push(comment);
      // console.log(this.#comments);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  };

  addComment = (updateType, update, comment) => {
    this.#comments = [
      ...this.#comments,
      update,
    ];

    this._notify(updateType, comment);
  };

  deleteComment = (updateType, index) => {
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
