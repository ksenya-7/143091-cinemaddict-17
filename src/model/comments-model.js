import Observable from '../framework/observable.js';
import FilmsModel from './films-model.js';

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
      const {movie, comments} = await this.#commentsApiService.addComment(update, film.id);
      film.comments = movie.comments;

      this._notify(updateType, FilmsModel.adaptToClient(movie));

      return comments;
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, deleteId, film, comments) => {
    const index = comments.findIndex((comment) => comment.id === deleteId);
    film.comments = film.comments.filter((item) => item !== deleteId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(deleteId);

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
