import {getYear, formatDuration, trimText} from '../helpers/helpers';

const DESCRIPTION_LIMIT = 140;

export const getMovieTemplate = (movie, user) => {
  const {
    id,
    title,
    rating,
    releaseDate,
    duration,
    genres,
    poster,
    description,
    comments,
  } = movie;

  const {watched, watchlist, favorites} = user;

  const year = getYear(releaseDate);
  const durationOutput = formatDuration(duration);
  const genreOutput = genres[0] || '';
  const descriptionOutput = trimText(description, DESCRIPTION_LIMIT);
  const commentsCount = comments.length;
  const commentsOutput = commentsCount === 1
    ? `${commentsCount} comment`
    : `${commentsCount} comments`;
  const activeControlButtonClassName = 'film-card__controls-item--active';
  const isWatched = watched.has(id);
  const isToWatch = watchlist.has(id);
  const isFavorite = favorites.has(id);

  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${durationOutput}</span>
        <span class="film-card__genre">${genreOutput}</span>
      </p>
      <img
        src="./images/posters/${poster}"
        alt=""
        class="film-card__poster"
      >
      <p class="film-card__description">${descriptionOutput}</p>
      <a class="film-card__comments">${commentsOutput}</a>
      <div class="film-card__controls">
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--add-to-watchlist
            ${isToWatch ? activeControlButtonClassName : ''}"
          type="button"
        >Add to watchlist</button>
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--mark-as-watched
            ${isWatched ? activeControlButtonClassName : ''}"
          type="button"
          >Mark as watched</button>
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--favorite
            ${isFavorite ? activeControlButtonClassName : ''}"
            type="button"
          >Mark as favorite</button>
      </div>
    </article>
  `.trim();
};
