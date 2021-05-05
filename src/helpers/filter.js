const filterNameToFilterFunction = {
  'Watchlist': (movies, user) => {
    return movies.filter((movie) => user.watchlist.has(movie.id));
  },
  'History': (movies, user) => {
    return movies.filter((movie) => user.watched.has(movie.id));
  },
  'Favorites': (movies, user) => {
    return movies.filter((movie) => user.favorites.has(movie.id));
  },
};

export {filterNameToFilterFunction};
