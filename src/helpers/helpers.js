import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getYear = (date) => {
  return dayjs(date).year();
};

const formatReleaseDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

const formatCommentDate = (date) => {
  return dayjs(date).fromNow();
};

const formatDuration = (duration) => {
  const MINUTES_IN_HOUR = 60;

  const hours = Math.trunc(duration / MINUTES_IN_HOUR);
  const minutes = duration % MINUTES_IN_HOUR;
  const hoursString = hours === 0 ? '' : `${hours}h`;

  return `${hoursString} ${minutes}m`.trim();
};

const trimText = (text, limit) => {
  if (text.length >= limit) {
    return `${text.substring(0, limit)}...`;
  }

  return text;
};

const checkEscKeyDown = (key) => {
  const pressedKey = key.toLowerCase();

  return pressedKey === 'escape' || pressedKey === 'esc';
};

const toggleItemInSet = (set, item) => {
  if (set.has(item)) {
    set.delete(item);
    return;
  }

  set.add(item);
};

const sortMoviesByDateDown = (movieA, movieB) => {
  return dayjs(movieB.releaseDate).diff(movieA.releaseDate);
};

const sortMoviesByRatingDown = (movieA, movieB) => {
  return movieB.rating - movieA.rating;
};

const sortMoviesByCommentsCountDown = (movieA, movieB) => {
  return movieB.comments.size - movieA.comments.size;
};

export {
  getRandomInteger,
  getYear,
  formatDuration,
  formatReleaseDate,
  formatCommentDate,
  trimText,
  checkEscKeyDown,
  toggleItemInSet,
  sortMoviesByDateDown,
  sortMoviesByRatingDown,
  sortMoviesByCommentsCountDown
};
