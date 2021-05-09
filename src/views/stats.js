import AbstractView from './abstract';
import {formatDuration} from '../helpers/helpers';

const getStatsTemplate = (user, movies) => {
  const {rank, name, avatar, watched} = user;
  const watchedCount = watched.size;
  const totalDuration = movies.reduce((minutes, movie) => {
    if (watched.has(movie.id)) {
      return minutes + movie.duration;
    }

    return minutes;
  }, 0);
  const {hours, minutes} = formatDuration(totalDuration);
  const topGenre = movies[0].genres[0];

  return `
    <section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img
          class="statistic__img"
          src="images/${avatar}"
          alt="${name}"
          width="35"
          height="35"
        >
        <span class="statistic__rank-label">${rank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">
            ${watchedCount}
            <span class="statistic__item-description">movies</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">
            ${hours}
            <span class="statistic__item-description">h</span>
            ${minutes}
            <span class="statistic__item-description">m</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>
  `.trim();
};

export default class Stats extends AbstractView {
  constructor(user, movies) {
    super();

    this._user = user;
    this._movies = movies;
  }

  _getTemplate() {
    return getStatsTemplate(this._user, this._movies);
  }
}
