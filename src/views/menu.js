import {getElementFromTemplate} from '../helpers/render';

const getFilterTemplate = (filter, currentFilterName = '') => {
  const {name, count} = filter;
  const url = `#${name.toLowerCase()}`;
  const activeClassName = filter.name === currentFilterName
    ? 'main-navigation__item--active' : '';

  return `
    <a
      href="${url}"
      class="main-navigation__item ${activeClassName}"
    >${name} <span class="main-navigation__item-count">${count}</span></a>
  `;
};

const getMenuTemplate = (filters) => {
  const filtersTemplate = filters
    .map((filter) => getFilterTemplate(filter))
    .join('');

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a
          href="#all"
          class="main-navigation__item main-navigation__item--active"
        >All movies</a>
        ${filtersTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `.trim();
};

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  _getTemplate() {
    return getMenuTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = getElementFromTemplate(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
