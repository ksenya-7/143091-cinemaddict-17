import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CommentsApiService extends ApiService {
  idfilm = null;

  constructor(endPoint, authorization, idfilm) {
    super(endPoint, authorization);
    this.idfilm = idfilm;
  }

  get comments() {
    return this._load({url: `comments/${this.idfilm}`})
      .then(ApiService.parseResponse);
  }

  updateComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.PUT,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };
}
