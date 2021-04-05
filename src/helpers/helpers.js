import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getYear = (date) => {
  return dayjs(date).year();
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

export {getRandomInteger, getYear, formatDuration, trimText};
