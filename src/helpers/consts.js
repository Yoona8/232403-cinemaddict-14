const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];
const UserAction = {
  FAVORITE: 0,
  WATCHLIST: 1,
  WATCHED: 2,
  DELETE_COMMENT: 3,
  ADD_COMMENT: 4,
};

const SortingType = {
  DEFAULT: 0,
  DATE: 1,
  RATING: 2,
  COMMENTED: 3,
};

const UpdateType = {
  PATCH: 0,
  MINOR: 1,
  MAJOR: 2,
};

const MenuItem = {
  STATS: 0,
  MOVIES: 1,
};

const FilterType = {
  ALL: 0,
  WATCHLIST: 1,
  WATCHED: 2,
  FAVORITES: 3,
};

const StatsPeriodType = {
  ALL: 0,
  TODAY: 1,
  WEEK: 2,
  MONTH: 3,
  YEAR: 4,
};

export {
  EMOJIS,
  UserAction,
  SortingType,
  UpdateType,
  FilterType,
  MenuItem,
  StatsPeriodType
};
