import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};
export default class CommentsApiService extends ApiService {
  #filmId = null;

  constructor(endPoint, authorization, filmId) {
    super(endPoint, authorization);
    this.#filmId = filmId;
  }

  get comments() {
    return this._load({url: `comments/${this.#filmId}`})
      .then(ApiService.parseResponse);
  }

  updateComments = async (comments) => {
    const response = await this._load({
      url: `comments/${this.#filmId}`,
      method: Method.PUT,
      body: JSON.stringify(comments),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addComment = async (comment) => {
    const response = await this._load({
      url: `comments/${this.#filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    // console.log(comment.id);
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };
}
