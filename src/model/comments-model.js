import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try {
      this.#comments = await this.#commentsApiService.comments;
    } catch(err) {
      this.#comments = [];
    }

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
