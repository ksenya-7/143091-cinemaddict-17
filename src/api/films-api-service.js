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

  updateFilm = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {...film['film_info'],
        'genre': film.genre,
      },
      'user_details': {...film['user_details'],
        'watchlist': film.watchlist,
        'watched': film.watched,
        'favorite': film.favorite,
      }
    };

    delete adaptedFilm.amountComments;
    delete adaptedFilm.genre;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.watched;
    delete adaptedFilm.favorite;

    return adaptedFilm;
  };
}
