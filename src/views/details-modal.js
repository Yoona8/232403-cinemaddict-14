import he from 'he';
import SmartView from './smart';
import {
  formatReleaseDate,
  formatDuration,
  formatCommentDate, checkCtrlEnterKeyDown
} from '../helpers/helpers';
import {EMOJIS} from '../helpers/consts';

const getGenresTemplate = (genres) => {
  const label = genres.length === 1 ? 'Genre' : 'Genres';
  const genresTemplate = genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join('');

  return `
    <tr class="film-details__row">
      <td class="film-details__term">${label}</td>
      <td class="film-details__cell">
        ${genresTemplate}
      </td>
    </tr>
  `;
};

const getCommentTemplate = (comment) => {
  const {
    id,
    author,
    emoji,
    message,
    date,
  } = comment;

  const formattedDate = formatCommentDate(date);
  const sanitizedMessage = he.encode(message);

  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img
          src="./images/emoji/${emoji}.png"
          width="55" height="55"
          alt="emoji-${emoji}"
        >
      </span>
      <div>
        <p class="film-details__comment-text">${sanitizedMessage}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button
            class="film-details__comment-delete"
            type="button"
            data-delete-comment="${id}"
          >Delete</button>
        </p>
      </div>
    </li>
  `;
};

const getCommentsTemplate = (comments) => {
  const commentsTemplate = comments
    .map((comment) => getCommentTemplate(comment))
    .join('');

  return `
    <ul class="film-details__comments-list" data-comments>
      ${commentsTemplate}
    </ul>
  `;
};

const getEmojiTemplate = (emoji, currentEmoji) => {
  const isChecked = emoji === currentEmoji ? 'checked' : '';

  return `
    <input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emoji}"
      value="${emoji}"
      ${isChecked}
    >
    <label
      class="film-details__emoji-label"
      for="emoji-${emoji}"
    >
      <img
        src="./images/emoji/${emoji}.png"
        width="30" height="30"
        alt="emoji-${emoji}"
      >
    </label>
  `;
};

const getEmojiImageTemplate = (emoji) => {
  return `
    <img
      src="images/emoji/${emoji}.png"
      width="55" height="55" alt="emoji-${emoji}"
    >
  `.trim();
};

const getDetailsModalTemplate = (state, user, commentMessages) => {
  const {
    id,
    poster,
    title,
    originalTitle,
    director,
    writers,
    actors,
    rating,
    age,
    releaseDate,
    duration,
    country,
    genres,
    description,
    comments,
    commentEmojiS,
    commentTextS,
  } = state;

  const {watched, watchlist, favorites} = user;

  const formattedReleaseDate = formatReleaseDate(releaseDate);
  const {hours, minutes} = formatDuration(duration);
  const durationOutput = `${hours === 0 ? '' : `${hours}h`} ${minutes}m`.trim();
  const genresTemplate = genres.length === 0 ? '' : getGenresTemplate(genres);
  const watchedChecked = watched.has(id) ? 'checked' : '';
  const toWatchChecked = watchlist.has(id) ? 'checked' : '';
  const favoriteChecked = favorites.has(id) ? 'checked' : '';
  const commentsCount = comments.size;
  const sanitizedMessage = he.encode(commentTextS);
  const movieCommentMessages = commentMessages.filter((message) => {
    return comments.has(message.id);
  });
  const commentsTemplate = getCommentsTemplate(movieCommentMessages);
  const emojiImageTemplate = commentEmojiS
    ? getEmojiImageTemplate(commentEmojiS) : '';
  const emojisTemplate = EMOJIS
    .map((emoji) => getEmojiTemplate(emoji, commentEmojiS))
    .join('');

  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get" data-form>
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button" data-close>
              close
            </button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img
                class="film-details__poster-img"
                src="./${poster}"
                alt="${title}"
              >

              <p class="film-details__age">${age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">
                    Original: ${originalTitle}
                  </p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formattedReleaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${durationOutput}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                ${genresTemplate}
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="watchlist"
              name="watchlist"
              ${toWatchChecked}
              data-watchlist
            >
            <label
              for="watchlist"
              class="
                film-details__control-label
                film-details__control-label--watchlist"
            >Add to watchlist</label>

            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="watched"
              name="watched"
              ${watchedChecked}
              data-watched
            >
            <label
              for="watched"
              class="
                film-details__control-label
                film-details__control-label--watched"
            >Already watched</label>

            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="favorite"
              name="favorite"
              ${favoriteChecked}
              data-favorite
            >
            <label
              for="favorite"
              class="
                film-details__control-label
                film-details__control-label--favorite"
              >Add to favorites</label>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">
              Comments
              <span class="film-details__comments-count">
                ${commentsCount}
              </span>
            </h3>

            ${commentsTemplate}

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                ${emojiImageTemplate}
              </div>

              <label class="film-details__comment-label">
                <textarea
                  class="film-details__comment-input"
                  placeholder="Select reaction below and write comment here"
                  name="comment"
                  data-comment-field
                >${sanitizedMessage}</textarea>
              </label>

              <div class="film-details__emoji-list" data-emoji-list>
                ${emojisTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `.trim();
};

export default class DetailsModal extends SmartView {
  constructor(movie, user = {}, comments = new Set()) {
    super();

    this._user = user;
    this._comments = comments;
    this._state = DetailsModal.parseDataToState(movie);

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler
      .bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._addInnerHandlers();
  }

  _getTemplate() {
    return getDetailsModalTemplate(this._state, this._user, this._comments);
  }

  _restoreHandlers() {
    this._addInnerHandlers();
    this.addCloseClickHandler(this._callback.closeClickHandler);
    this.addFavoriteChangeHandler(this._callback.favoriteChangeHandler);
    this.addWatchedChangeHandler(this._callback.watchedChangeHandler);
    this.addWatchlistChangeHandler(this._callback.watchlistChangeHandler);
    this.addCommentDeleteClickHandler(this._callback.commentDeleteClickHandler);
    this.addCommentSubmitHandler(this._callback.commentSubmitHandler);
  }

  _updateElement() {
    const currentScrollTop = this.getElement().scrollTop;
    super._updateElement();
    this.getElement().scrollTop = currentScrollTop;
  }

  updateComments(movie, comments) {
    this._comments = comments;
    this._updateState({
      comments: new Set([...movie.comments]),
    });
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    evt.target.removeEventListener('click', this._closeClickHandler);
    this._callback.closeClickHandler();
  }

  _watchlistChangeHandler() {
    this._callback.watchlistChangeHandler();
  }

  _watchedChangeHandler() {
    this._callback.watchedChangeHandler();
  }

  _favoriteChangeHandler() {
    this._callback.favoriteChangeHandler();
  }

  _emojiChangeHandler(evt) {
    this._updateState({
      commentEmojiS: evt.target.value,
    });
  }

  _commentDeleteClickHandler(evt) {
    const commentId = evt.target.dataset.deleteComment;

    if (commentId) {
      evt.preventDefault();
      this._callback.commentDeleteClickHandler(commentId);
    }
  }

  _commentSubmitHandler(evt) {
    if (!this._state.commentEmojiS) {
      return;
    }

    if (checkCtrlEnterKeyDown(evt)) {
      evt.preventDefault();

      const comment = {
        movieId: this._state.id,
        author: 'John Snow',
        message: this._state.commentTextS,
        emoji: this._state.commentEmojiS,
        date: new Date(),
      };

      this._updateState({
        commentEmojiS: null,
        commentTextS: '',
      }, false);
      this._callback.commentSubmitHandler(comment);
    }
  }

  _commentInputHandler(evt) {
    this._updateState({
      commentTextS: evt.target.value,
    }, false);
  }

  _addInnerHandlers() {
    this.getElement().querySelector('[data-emoji-list]')
      .addEventListener('change', this._emojiChangeHandler);
    this.getElement().querySelector('[data-comment-field]')
      .addEventListener('input', this._commentInputHandler);
  }

  addCloseClickHandler(cb) {
    this._callback.closeClickHandler = cb;

    this.getElement().querySelector('[data-close]')
      .addEventListener('click', this._closeClickHandler);
  }

  addWatchlistChangeHandler(cb) {
    this._callback.watchlistChangeHandler = cb;
    this.getElement().querySelector('[data-watchlist]')
      .addEventListener('change', this._watchlistChangeHandler);
  }

  addWatchedChangeHandler(cb) {
    this._callback.watchedChangeHandler = cb;
    this.getElement().querySelector('[data-watched]')
      .addEventListener('change', this._watchedChangeHandler);
  }

  addFavoriteChangeHandler(cb) {
    this._callback.favoriteChangeHandler = cb;
    this.getElement().querySelector('[data-favorite]')
      .addEventListener('change', this._favoriteChangeHandler);
  }

  addCommentDeleteClickHandler(cb) {
    this._callback.commentDeleteClickHandler = cb;
    this.getElement().querySelector('[data-comments]')
      .addEventListener('click', this._commentDeleteClickHandler);
  }

  addCommentSubmitHandler(cb) {
    this._callback.commentSubmitHandler = cb;
    this.getElement().querySelector('[data-comment-field]')
      .addEventListener('keydown', this._commentSubmitHandler);
  }

  static parseDataToState(movie) {
    return Object.assign({}, movie, {
      commentEmojiS: null,
      commentTextS: '',
    });
  }

  static parseStateToData(state) {
    const data = Object.assign({}, state);

    delete data.commentEmojiS;
    delete data.commentTextS;
    return data;
  }
}
