import {comments} from '../mock/comments.js';

export default class CommentsModel {
  #comments = comments;

  get comments() {
    return this.#comments;
  }

  set comments(value) {
    this.#comments = value;
  }
}
