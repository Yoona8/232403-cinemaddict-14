import {
  formatReleaseDate,
  formatDuration,
  formatCommentDate
} from '../helpers/helpers';

const getGenresTemplate = (genres) => {
  const label = genres.length === 1 ? 'Genre' : 'Genres';
  const genresTemplate = genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join('');

  return `
    <td class="film-details__term">${label}</td>
    <td class="film-details__cell">
      ${genresTemplate}
    </td>
  `;
};

const getCommentTemplate = (comment) => {
  const {
    author,
    emoji,
    message,
    date,
  } = comment;

  const formattedDate = formatCommentDate(date);

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
        <p class="film-details__comment-text">${message}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `;
};

const getCommentsTemplate = (comments) => {
  const commentsTemplate = comments.map((comment) => {
    return getCommentTemplate(comment);
  }).join('');

  return `
    <ul class="film-details__comments-list">${commentsTemplate}</ul>
  `;
};

export const getDetailsModalTemplate = (movie, user, commentMessages) => {
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
  } = movie;

  const {watched, watchlist, favorites} = user;

  const formattedReleaseDate = formatReleaseDate(releaseDate);
  const formattedDuration = formatDuration(duration);
  const genresTemplate = genres.length === 0 ? '' : getGenresTemplate(genres);
  const isWatched = watched.has(id);
  const isToWatch = watchlist.has(id);
  const isFavorite = favorites.has(id);
  const movieCommentMessages = commentMessages.filter((message) => {
    return comments.has(message.id);
  });
  const commentsTemplate = getCommentsTemplate(movieCommentMessages);

  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img
                class="film-details__poster-img"
                src="./images/posters/${poster}"
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
                  <td class="film-details__cell">
                    ${writers}
                  </td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">
                    ${actors}
                  </td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">
                    ${formattedReleaseDate}
                  </td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formattedDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  ${genresTemplate}
                </tr>
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
              ${isToWatch ? 'checked' : ''}
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
              ${isWatched ? 'checked' : ''}
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
              ${isFavorite ? 'checked' : ''}
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
                ${comments.size}
              </span>
            </h3>

            ${commentsTemplate}

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `.trim();
};
