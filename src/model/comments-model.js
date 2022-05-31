import Observable from '../framework/observable.js';
import {comments} from '../mock/comments.js';

export default class CommentsModel extends Observable {
  #comments = comments;

  get comments() {
    return this.#comments;
  }

  set comments(value) {
    this.#comments = value;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      ...this.#comments,
      update,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

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
