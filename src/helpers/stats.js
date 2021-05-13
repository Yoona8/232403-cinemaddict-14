import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {StatsPeriodType} from './consts';

dayjs.extend(isBetween);

const DaySpan = {
  WEEK: 7,
  MONTH: 30,
  YEAR: 365,
};

const getWatchedMoviesInPeriod = (movies, period = StatsPeriodType.YEAR) => {
  movies = movies.slice();

  switch (period) {
    case StatsPeriodType.TODAY:
      movies = movies.filter((movie) => {
        return dayjs().isSame(movie.watchedDate, 'day');
      });
      break;
    case StatsPeriodType.WEEK:
      movies = movies.filter((movie) => {
        return dayjs(movie.watchedDate)
          .isBetween(
            dayjs().subtract(DaySpan.WEEK, 'day'),
            dayjs().add(1, 'day'),
            'day',
          );
      });
      break;
    case StatsPeriodType.MONTH:
      movies = movies.filter((movie) => {
        return dayjs(movie.watchedDate)
          .isBetween(
            dayjs().subtract(DaySpan.MONTH, 'day'),
            dayjs().add(1, 'day'),
            'day',
          );
      });
      break;
    case StatsPeriodType.YEAR:
      movies = movies.filter((movie) => {
        return dayjs(movie.watchedDate)
          .isBetween(
            dayjs().subtract(DaySpan.YEAR, 'day'),
            dayjs().add(1, 'day'),
            'day',
          );
      });
      break;
  }

  return movies;
};

const getTotalDuration = (movies, period) => {
  switch (period) {
    case StatsPeriodType.TODAY:
      movies = movies.slice().sort();
  }

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

export {
  getTotalDuration,
  getGenreCounts,
  getTopGenre,
  getWatchedMoviesInPeriod
};
