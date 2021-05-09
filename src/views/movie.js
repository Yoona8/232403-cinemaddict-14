import AbstractView from './abstract';
import {getYear, formatDuration, trimText} from '../helpers/helpers';

const DESCRIPTION_LIMIT = 140;

const getMovieTemplate = (movie, user) => {
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
  const {hours, minutes} = formatDuration(duration);
  const durationOutput = `${hours === 0 ? '' : `${hours}h`} ${minutes}m`.trim();
  const genreOutput = genres[0] || '';
  const descriptionOutput = trimText(description, DESCRIPTION_LIMIT);
  const commentsCount = comments.size;
  const commentsOutput = commentsCount === 1
    ? `${commentsCount} comment`
    : `${commentsCount} comments`;
  const activeControlClassName = 'film-card__controls-item--active';
  const watchedClassName = watched.has(id) ? activeControlClassName : '';
  const toWatchClassName = watchlist.has(id) ? activeControlClassName : '';
  const favoriteClassName = favorites.has(id) ? activeControlClassName : '';

  return `
    <article class="film-card">
      <h3 class="film-card__title" data-details-open>${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${durationOutput}</span>
        <span class="film-card__genre">${genreOutput}</span>
      </p>
      <img
        src="./images/posters/${poster}"
        alt="${title}"
        class="film-card__poster"
        data-details-open
      >
      <p class="film-card__description">${descriptionOutput}</p>
      <a class="film-card__comments" data-details-open>${commentsOutput}</a>
      <div class="film-card__controls">
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--add-to-watchlist
            ${toWatchClassName}"
          type="button"
          data-watchlist
        >Add to watchlist</button>
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--mark-as-watched
            ${watchedClassName}"
          type="button"
          data-watched
          >Mark as watched</button>
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--favorite
            ${favoriteClassName}"
            type="button"
            data-favorite
          >Mark as favorite</button>
      </div>
    </article>
  `.trim();
};

export default class Movie extends AbstractView {
  constructor(movie, user = {}) {
    super();

    this._movie = movie;
    this._user = user;

    this._detailsOpenClickHandler = this._detailsOpenClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  _getTemplate() {
    return getMovieTemplate(this._movie, this._user);
  }

  _detailsOpenClickHandler(evt) {
    evt.preventDefault();
    this._callback.detailsOpenClickHandler();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClickHandler();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClickHandler();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClickHandler();
  }

  addDetailsOpenClickHandler(cb) {
    this._callback.detailsOpenClickHandler = cb;

    this.getElement().querySelectorAll('[data-details-open]')
      .forEach((element) => {
        element.addEventListener('click', this._detailsOpenClickHandler);
      });
  }

  addWatchlistClickHandler(cb) {
    this._callback.watchlistClickHandler = cb;
    this.getElement().querySelector('[data-watchlist]')
      .addEventListener('click', this._watchlistClickHandler);
  }

  addWatchedClickHandler(cb) {
    this._callback.watchedClickHandler = cb;
    this.getElement().querySelector('[data-watched]')
      .addEventListener('click', this._watchedClickHandler);
  }

  addFavoriteClickHandler(cb) {
    this._callback.favoriteClickHandler = cb;
    this.getElement().querySelector('[data-favorite]')
      .addEventListener('click', this._favoriteClickHandler);
  }
}
