import AbstractView from './abstract';

const getShowMoreButtonTemplate = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `.trim();
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  _getTemplate() {
    return getShowMoreButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.clickHandler();
  }

  addClickHandler(cb) {
    this._callback.clickHandler = cb;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
