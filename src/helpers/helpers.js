import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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

  return {
    hours,
    minutes,
  };
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

const checkCtrlEnterKeyDown = (evt) => {
  const pressedKey = evt.key.toLowerCase();
  const isCtrl = evt.ctrlKey || evt.metaKey;

  return pressedKey === 'enter' && isCtrl;
};

const toggleItemInSet = (set, item) => {
  set = new Set([...set]);

  if (set.has(item)) {
    set.delete(item);
  } else {
    set.add(item);
  }

  return set;
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

const isOnline = () => {
  return window.navigator.onLine;
};

export {
  getYear,
  formatDuration,
  formatReleaseDate,
  formatCommentDate,
  trimText,
  checkEscKeyDown,
  checkCtrlEnterKeyDown,
  toggleItemInSet,
  sortMoviesByDateDown,
  sortMoviesByRatingDown,
  sortMoviesByCommentsCountDown,
  isOnline
};
