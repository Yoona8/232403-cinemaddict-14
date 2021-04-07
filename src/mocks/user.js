import {getRandomInteger} from '../helpers/helpers';

const getRandomMovieIds = (movies) => {
  const length = getRandomInteger(0, movies.length);

  return new Array(length).fill('').map(() => {
    return movies[getRandomInteger(0, movies.length - 1)].id;
  });
};

const getRank = (watchedCount) => {
  if (watchedCount === 0) {
    return null;
  } else if (watchedCount >= 21) {
    return 'Movie Buff';
  } else if (watchedCount >= 11) {
    return 'Fan';
  } else {
    return 'Novice';
  }
};

const getUser = (movies) => {
  const watched = new Set(getRandomMovieIds(movies));

  return {
    id: '0',
    name: 'Harry',
    avatar: 'bitmap@2x.png',
    rank: getRank(watched.size),
    watched,
    watchlist: new Set(getRandomMovieIds(movies)),
    favorites: new Set(getRandomMovieIds(movies)),
  };
};

export {getUser};
