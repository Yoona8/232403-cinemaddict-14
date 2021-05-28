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
  const watched = new Set(
    movies
      .filter((movie) => movie.isWatched)
      .map((movie) => movie.id),
  );
  const watchlist = new Set(
    movies
      .filter((movie) => movie.isWatchlist)
      .map((movie) => movie.id),
  );
  const favorites = new Set(
    movies
      .filter((movie) => movie.isFavorite)
      .map((movie) => movie.id),
  );

  return {
    id: '0',
    name: 'Harry',
    avatar: 'bitmap@2x.png',
    rank: getRank(watched.size),
    watched,
    watchlist,
    favorites,
  };
};

export {getUser, getRank};
