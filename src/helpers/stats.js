const getTotalDuration = (movies) => {
  return movies.reduce((minutes, movie) => minutes + movie.duration, 0);
};

const getGenreCounts = (movies) => {
  return movies.reduce((result, movie) => {
    movie.genres.forEach((genre) => {
      if (genre in result) {
        result[genre] += 1;
        return;
      }

      result[genre] = 1;
    });

    return result;
  }, {});
};

const getTopGenre = (genreCounts) => {
  return Object.entries(genreCounts).sort((a, b) => {
    return b[1] - a[1];
  })[0][0];
};

export {getTotalDuration, getGenreCounts, getTopGenre};
