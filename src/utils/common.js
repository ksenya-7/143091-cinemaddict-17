const profileRating = {
  MOVIE_BUFF: 21,
  FAN: 11,
};

const getProfileRating = (item) => {
  if (item >= profileRating.MOVIE_BUFF) {
    return 'Movie Buff';
  } else if (item >= profileRating.FAN || item < profileRating.MOVIE_BUFF) {
    return 'fan';
  } else if (item > 0 || item < profileRating.FAN) {
    return 'novice';
  }
  return '';
};


export {getProfileRating};
