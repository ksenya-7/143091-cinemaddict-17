import {getRandomInteger} from '../utils.js';

const generateDate = () => {
  const dates = [
    '1933-05-10T16:12:12.554Z',
    '1935-04-11T16:13:22.554Z',
    '1937-06-12T16:14:32.554Z',
    '2019-07-13T16:12:42.554Z',
    '1960-08-14T16:15:52.554Z',
    '2020-09-15T16:16:35.554Z',
    '2015-10-16T16:17:36.554Z',
    '1955-12-17T16:18:37.554Z',
  ];

  const randomIndex = getRandomInteger(0, dates.length - 1);

  return dates[randomIndex];
};

const generateAmountComments = () => {
  const amountComments = [
    '89 comments',
    '0 comments',
    '18 comments',
    '5 comments',
    '465 comments',
  ];

  const randomIndex = getRandomInteger(0, amountComments.length - 1);

  return amountComments[randomIndex];
};

const generateFilmInfo = () => {
  const filmInfos = [
    {
      'title': 'The dance of life',
      'alternative_title': 'The dance of life',
      'total_rating': 8.3,
      'poster': 'images/posters/the-dance-of-life.jpg',
      'age_rating': 16,
      'director': 'Tom Ford',
      'writers': [
        'Takeshi Kitano'
      ],
      'actors': [
        'Erich von Stroheim, Mary Beth Hughes, Dan Duryea'
      ],
      'release': {
        'date': '1929-02-11T00:00:00.000Z',
        'release_country': 'USA'
      },
      'runtime': 115,
      'genre': [
        'Musical'
      ],
      'description': 'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night.'
    },
    {
      'title': 'Sagebrush Trail',
      'alternative_title': 'Sagebrush Trail',
      'total_rating': 3.2,
      'poster': 'images/posters/sagebrush-trail.jpg',
      'age_rating': 18,
      'director': 'Anthony Mann',
      'writers': [
        'Anne Wigton, Heinz Herald, Richard Weil'
      ],
      'actors': [
        'Morgan Freeman'
      ],
      'release': {
        'date': '1933-05-11T00:00:00.000Z',
        'release_country': 'Spain'
      },
      'runtime': 54,
      'genre': [
        'Western', 'Film-Noir', 'Mystery',
      ],
      'description': 'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer.'
    },
    {
      'title': 'The Man with the Golden Arm',
      'alternative_title': 'The Man with the Golden Arm',
      'total_rating': 9.0,
      'poster': 'images/posters/the-man-with-the-golden-arm.jpg',
      'age_rating': 10,
      'director': 'Tom Ford',
      'writers': [
        'Heinz Herald, Richard Weil'
      ],
      'actors': [
        'Mary Beth Hughes, Dan Duryea'
      ],
      'release': {
        'date': '1955-01-07T00:00:00.000Z',
        'release_country': 'France'
      },
      'runtime': 115,
      'genre': [
        'Drama', 'Film-Noir', 'Mystery',
      ],
      'description': 'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…'
    },
    {
      'title': 'Santa Claus Conquers the Martians',
      'alternative_title': 'Santa Claus Conquers the Martians',
      'total_rating': 2.3,
      'poster': 'images/posters/santa-claus-conquers-the-martians.jpg',
      'age_rating': 0,
      'director': 'Anthony Mann',
      'writers': [
        'Richard Weil'
      ],
      'actors': [
        'Morgan Freeman, Dan Duryea'
      ],
      'release': {
        'date': '1964-07-08T00:00:00.000Z',
        'release_country': 'Italy'
      },
      'runtime': 81,
      'genre': [
        'Comedy'
      ],
      'description': 'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…'
    },
    {
      'title': 'Popeye the Sailor Meets Sindbad the Sailor',
      'alternative_title': 'Popeye the Sailor Meets Sindbad the Sailor',
      'total_rating': 6.3,
      'poster': 'images/posters/popeye-meets-sinbad.png',
      'age_rating': 0,
      'director': 'Tom Ford',
      'writers': [
        'Heinz Herald'
      ],
      'actors': [
        'Carrol'
      ],
      'release': {
        'date': '1936-11-09T00:00:00.000Z',
        'release_country': 'Finland'
      },
      'runtime': 16,
      'genre': [
        'Cartoon'
      ],
      'description': 'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…'
    },
  ];

  const randomIndex = getRandomInteger(0, filmInfos.length - 1);

  return filmInfos[randomIndex];
};

const generateGenre = () => {
  const genres = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Film-Noir',
    'Mystery',
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

export const generateFilm = () => ({
  amountComments: generateAmountComments(),
  genre: generateGenre(),
  'id': '0',
  'comments': [
    1, 2, 3, 4
  ],
  'film_info': generateFilmInfo(),
  'user_details': {
    'watchlist': Boolean(getRandomInteger(0, 1)),
    'already_watched': Boolean(getRandomInteger(0, 1)),
    'watching_date': generateDate(),
    'favorite': Boolean(getRandomInteger(0, 1)),
  }
});
