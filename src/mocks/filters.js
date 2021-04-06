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

const getFilters = (movies, user) => {
  return Object.entries(filterNameToFilterFunction)
    .map(([filterName, filterMovies]) => {
      return {
        name: filterName,
        count: filterMovies(movies, user).length,
      };
    });
};

export {getFilters};
