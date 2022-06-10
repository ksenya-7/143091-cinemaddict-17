import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  getComments = async (filmId) => {
    try {
      this.#comments = await this.#commentsApiService.getComments(filmId);
      return this.#comments;
    } catch(err) {
      throw new Error('Can\'t get comments');
    }
  };

  addComment = async (updateType, update, film) => {
    try {
      await this.#commentsApiService.addComment(update, film.id);

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update, film) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update);

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
