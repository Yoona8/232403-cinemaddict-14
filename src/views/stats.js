import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart';
import {formatDuration} from '../helpers/helpers';
import {filter} from '../helpers/filter';
import {FilterType, StatsPeriodType} from '../helpers/consts';
import {
  getGenreCounts,
  getTopGenre,
  getTotalDuration,
  getWatchedMoviesInPeriod
} from '../helpers/stats';

const renderChart = (statisticCtx, labels, data) => {
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...labels],
      datasets: [{
        data: [...data],
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const getFilterTemplate = (filter, currentFilter) => {
  const {type, name} = filter;
  const checked = type === currentFilter ? 'checked' : '';

  return `
    <input
      type="radio"
      class="statistic__filters-input visually-hidden"
      name="statistic-filter"
      id="statistic-date-${type}"
      value="${type}"
      ${checked}
    >
    <label
      for="statistic-date-${type}"
      class="statistic__filters-label"
    >${name}</label>
  `.trim();
};

const getStatsTemplate = (state) => {
  const {user, watchedMovies, topGenre, filters, currentFilter} = state;
  const {name, avatar} = user;
  const rank = user.rank || '';
  const watchedCount = watchedMovies.length;
  const totalDuration = getTotalDuration(watchedMovies);
  const {hours, minutes} = formatDuration(totalDuration);
  const filtersTemplate = filters
    .map((filter) => getFilterTemplate(filter, currentFilter))
    .join('');

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

      <form
        action="https://echo.htmlacademy.ru/"
        method="get"
        class="statistic__filters"
        data-filters
      >
        <p class="statistic__filters-description">Show stats:</p>
        ${filtersTemplate}
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

export default class Stats extends SmartView {
  constructor() {
    super();

    this._user = null;
    this._movies = null;
    this._filters = [{
      type: StatsPeriodType.ALL,
      name: 'All time',
    }, {
      type: StatsPeriodType.TODAY,
      name: 'Today',
    }, {
      type: StatsPeriodType.WEEK,
      name: 'Week',
    }, {
      type: StatsPeriodType.MONTH,
      name: 'Month',
    }, {
      type: StatsPeriodType.YEAR,
      name: 'Year',
    }];

    this._currentFilter = StatsPeriodType.ALL;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  init(user, movies) {
    this._user = user;
    this._movies = movies;

    const watchedMovies = this._getWatchedMovies();
    const genreCounts = getGenreCounts(watchedMovies);
    const topGenre = this._getTopGenre(genreCounts);

    this._updateState({
      user,
      watchedMovies: this._getWatchedMovies(),
      genreCounts,
      topGenre,
      filters: this._filters,
      currentFilter: this._currentFilter,
    });

    this._setChart();
  }

  _getWatchedMovies() {
    let watchedMovies = filter[FilterType.WATCHED](this._movies, this._user);

    if (this._currentFilter !== StatsPeriodType.ALL) {
      watchedMovies = getWatchedMoviesInPeriod(
        watchedMovies,
        this._currentFilter,
      );
    }

    return watchedMovies;
  }

  _getTopGenre(genreCounts) {
    return !Object.entries(genreCounts).length ? '' : getTopGenre(genreCounts);
  }

  _getTemplate() {
    return getStatsTemplate(this._state);
  }

  _setChart() {
    const ctx = this.getElement().querySelector('.statistic__chart');
    const labels = Object.keys(this._state.genreCounts);
    const data = Object.values(this._state.genreCounts);

    renderChart(ctx, labels, data);
  }

  _restoreHandlers() {
    this._addInnerHandlers();
  }

  _filterChangeHandler(evt) {
    this._currentFilter = Number(evt.target.value);

    const watchedMovies = this._getWatchedMovies();
    const genreCounts = getGenreCounts(watchedMovies);
    const topGenre = this._getTopGenre(genreCounts);

    this._updateState({
      watchedMovies,
      genreCounts,
      topGenre,
      currentFilter: this._currentFilter,
    });

    this._setChart();
  }

  _addInnerHandlers() {
    this.getElement().querySelector('[data-filters]')
      .addEventListener('change', this._filterChangeHandler);
  }
}
