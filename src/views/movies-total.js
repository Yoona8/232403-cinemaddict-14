import {getElementFromTemplate} from '../helpers/render';

export const getMoviesTotalTemplate = (count) => {
  return `
    <p>${count} movies inside</p>
  `.trim();
};

export default class MoviesTotal {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  _getTemplate() {
    return getMoviesTotalTemplate(this._count);
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
