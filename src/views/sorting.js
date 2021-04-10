import {getElementFromTemplate} from '../helpers/render';

const getSortingTemplate = () => {
  return `
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">
        Sort by default
      </a></li>
      <li><a href="#" class="sort__button">
        Sort by date
      </a></li>
      <li><a href="#" class="sort__button">
        Sort by rating
      </a></li>
    </ul>
  `.trim();
};

export default class Sorting {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return getSortingTemplate();
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
