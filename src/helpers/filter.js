import {FilterType} from './consts';

const filter = {
  [FilterType.WATCHLIST]: (movies, user) => {
    return movies.filter((movie) => user.watchlist.has(movie.id));
  },
  [FilterType.WATCHED]: (movies, user) => {
    return movies.filter((movie) => user.watched.has(movie.id));
  },
  [FilterType.FAVORITES]: (movies, user) => {
    return movies.filter((movie) => user.favorites.has(movie.id));
  },
};

export {filter};
