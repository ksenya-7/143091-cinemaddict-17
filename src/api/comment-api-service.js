import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CommentApiService extends ApiService {
  comment = (id) => this._load({url: `comments/${id}`}).then(ApiService.parseResponse);
  // get comment() {
  //   return this._load({url: 'comments/??'}).then(ApiService.parseResponse);
  // }

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
