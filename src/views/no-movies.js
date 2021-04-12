import {getElementFromTemplate} from '../helpers/render';

const getNoMoviesTemplate = () => {
  return `
    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
      </section>
    </section>
  `;
};

export default class NoMovies {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return getNoMoviesTemplate();
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
