import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart';
import {formatDuration} from '../helpers/helpers';
import {filter} from '../helpers/filter';
import {FilterType} from '../helpers/consts';
import {getGenreCounts, getTopGenre, getTotalDuration} from '../helpers/stats';

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

const getStatsTemplate = (state) => {
  const {user, watchedMovies, topGenre} = state;
  const {name, avatar} = user;
  const rank = user.rank || '';
  const watchedCount = watchedMovies.length;
  const totalDuration = getTotalDuration(watchedMovies);
  const {hours, minutes} = formatDuration(totalDuration);

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

export default class Stats extends SmartView {
  init(user, movies) {
    this._watchedMovies = filter[FilterType.WATCHED](movies, user);
    this._genreCounts = getGenreCounts(this._watchedMovies);
    this._topGenre = Object.entries(this._genreCounts).length === 0
      ? '' : getTopGenre(this._genreCounts);

    this._updateState({
      user,
      watchedMovies: this._watchedMovies,
      genreCounts: this._genreCounts,
      topGenre: this._topGenre,
    });

    this._setChart();
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

  _restoreHandlers() {}
}
