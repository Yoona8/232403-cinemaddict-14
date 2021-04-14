import {getElementFromTemplate} from '../helpers/render';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t make an instance of an Abstract class');
    }

    this._element = null;
    this._callback = {};
  }

  /** @return (string | undefined) */
  _getTemplate() {
    throw new Error('Abstract method is not implemented: _getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = getElementFromTemplate(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element.remove();
    this._element = null;
  }
}
