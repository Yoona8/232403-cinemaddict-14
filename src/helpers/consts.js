const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];
const UserAction = {
  FAVORITE: 0,
  WATCHLIST: 1,
  WATCHED: 2,
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

const FilterType = {
  ALL: 0,
  WATCHLIST: 1,
  HISTORY: 2,
  FAVORITES: 2,
};

export {EMOJIS, UserAction, SortingType, UpdateType, FilterType};
