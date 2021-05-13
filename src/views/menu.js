import AbstractView from './abstract';
import {FilterType} from '../helpers/consts';

const getFilterTemplate = (filter, currentFilterType, isStatsActive) => {
  const {type, name, count} = filter;
  const url = `#${name.toLowerCase()}`;
  const activeClassName = (!isStatsActive && type === currentFilterType)
    ? 'main-navigation__item--active' : '';

  return `
    <a
      href="${url}"
      class="main-navigation__item ${activeClassName}"
      data-filter-type="${type}"
    >${name} <span class="main-navigation__item-count">${count}</span></a>
  `;
};

const getMenuTemplate = (filters, currentFilterType, isStatsActive) => {
  const statsActiveClassName = isStatsActive
    ? 'main-navigation__additional--active' : '';
  const activeDefaultClassName = (
    !isStatsActive &&
    FilterType.ALL === currentFilterType
  )
    ? 'main-navigation__item--active' : '';
  const filtersTemplate = filters
    .map((filter) => getFilterTemplate(
      filter,
      currentFilterType,
      isStatsActive,
    ))
    .join('');

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items" data-filters>
        <a
          href="#all"
          class="main-navigation__item ${activeDefaultClassName}"
          data-filter-type="${FilterType.ALL}"
        >All movies</a>
        ${filtersTemplate}
      </div>
      <a
        href="#stats"
        class="main-navigation__additional ${statsActiveClassName}"
        data-stats
      >Stats</a>
    </nav>
  `.trim();
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType, isStatsActive) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._isStatsActive = isStatsActive;

    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  _getTemplate() {
    return getMenuTemplate(
      this._filters,
      this._currentFilterType,
      this._isStatsActive,
    );
  }

  _filterClickHandler(evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      this._callback.filterClickHandler(Number(evt.target.dataset.filterType));
    }
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClickHandler();
  }

  addFilterClickHandler(cb) {
    this._callback.filterClickHandler = cb;
    this.getElement().querySelector('[data-filters]')
      .addEventListener('click', this._filterClickHandler);
  }

  addStatsClickHandler(cb) {
    this._callback.statsClickHandler = cb;
    this.getElement().querySelector('[data-stats]')
      .addEventListener('click', this._statsClickHandler);
  }
}
