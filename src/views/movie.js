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
  const durationOutput = formatDuration(duration);
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
        >Add to watchlist</button>
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--mark-as-watched
            ${watchedClassName}"
          type="button"
          >Mark as watched</button>
        <button
          class="
            film-card__controls-item
            button
            film-card__controls-item--favorite
            ${favoriteClassName}"
            type="button"
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
  }

  _getTemplate() {
    return getMovieTemplate(this._movie, this._user);
  }

  _detailsOpenClickHandler(evt) {
    evt.preventDefault();
    this._callback.detailsOpenClickHandler();
  }

  addDetailsOpenClickHandler(cb) {
    this._callback.detailsOpenClickHandler = cb;

    [...this.getElement().querySelectorAll('[data-details-open]')]
      .forEach((element) => {
        element.addEventListener('click', this._detailsOpenClickHandler);
      });
  }
}
