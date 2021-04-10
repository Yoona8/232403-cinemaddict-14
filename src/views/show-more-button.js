import {getElementFromTemplate} from '../helpers/render';

const getShowMoreButtonTemplate = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `.trim();
};

export default class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return getShowMoreButtonTemplate();
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
