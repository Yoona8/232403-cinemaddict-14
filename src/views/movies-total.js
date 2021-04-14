import AbstractView from './abstract';

const getMoviesTotalTemplate = (count) => {
  return `
    <p>${count} movies inside</p>
  `.trim();
};

export default class MoviesTotal extends AbstractView {
  constructor(count) {
    super();

    this._count = count;
  }

  _getTemplate() {
    return getMoviesTotalTemplate(this._count);
  }
}
