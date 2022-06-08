import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    // console.log(this.#adaptToServer(film));
    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {...film['film_info'],
        'genre': film.genre,
      },
      'user_details': {...film['user_details'],
        'watchlist': film.watchlist,
        'already_watched': film.watched,
        'favorite': film.favorite,
      }
    };

    delete adaptedFilm.genre;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.watched;
    delete adaptedFilm.favorite;

    return adaptedFilm;
  };
}
