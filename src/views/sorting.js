import AbstractView from './abstract';
import {SortingType} from '../helpers/consts';

const getSortingTemplate = () => {
  return `
    <ul class="sort">
      <li>
        <a
          href="#"
          class="sort__button sort__button--active"
          data-sorting-type="${SortingType.DEFAULT}"
        >
          Sort by default
        </a>
      </li>
      <li>
        <a
          href="#"
          class="sort__button"
          data-sorting-type="${SortingType.DATE}"
        >
          Sort by date
        </a>
      </li>
      <li>
        <a
          href="#"
          class="sort__button"
          data-sorting-type="${SortingType.RATING}"
        >
          Sort by rating
        </a>
      </li>
    </ul>
  `.trim();
};

export default class Sorting extends AbstractView {
  constructor() {
    super();

    this._sortingTypeClickHandler = this._sortingTypeClickHandler.bind(this);
  }

  _getTemplate() {
    return getSortingTemplate();
  }

  _sortingTypeClickHandler(evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      this._callback
        .sortingTypeClickHandler(Number(evt.target.dataset.sortingType));
    }
  }

  addSortingTypeClickHandler(cb) {
    this._callback.sortingTypeClickHandler = cb;
    this.getElement().addEventListener('click', this._sortingTypeClickHandler);
  }
}
