import AbstractView from './abstract';
import {SortingType} from '../helpers/consts';

const ACTIVE_CLASS_NAME = 'sort__button--active';

const getSortingTemplate = () => {
  return `
    <ul class="sort">
      <li>
        <a
          href="#"
          class="sort__button ${ACTIVE_CLASS_NAME}"
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

    this._currentSortingType = SortingType.DEFAULT;
    this._currentActiveElement = this.getElement()
      .querySelector(`[data-sorting-type="${this._currentSortingType}"]`);

    this._sortingTypeClickHandler = this._sortingTypeClickHandler.bind(this);
  }

  _getTemplate() {
    return getSortingTemplate();
  }

  _sortingTypeClickHandler(evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();

      if (this._currentActiveElement) {
        this._currentActiveElement.classList.remove(ACTIVE_CLASS_NAME);
      }

      this._currentActiveElement = evt.target;
      this._currentActiveElement.classList.add(ACTIVE_CLASS_NAME);

      this._callback
        .sortingTypeClickHandler(Number(evt.target.dataset.sortingType));
    }
  }

  addSortingTypeClickHandler(cb) {
    this._callback.sortingTypeClickHandler = cb;
    this.getElement().addEventListener('click', this._sortingTypeClickHandler);
  }
}
