import dayjs from 'dayjs';

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
  return dayjs(date).format('YYYY/MM/DD hh:mm');
};

const formatDuration = (duration) => {
  const MINUTES_IN_HOUR = 60;

  const hours = parseInt(String(duration / MINUTES_IN_HOUR), 10);
  const hoursString = hours === 0 ? '' : `${hours}h`;
  const minutes = duration % MINUTES_IN_HOUR;

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

export {
  getRandomInteger,
  getYear,
  formatDuration,
  formatReleaseDate,
  formatCommentDate,
  trimText,
  checkEscKeyDown
};
