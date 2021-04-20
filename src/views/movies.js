import AbstractView from './abstract';

const getMoviesTemplate = () => {
  return '<section class="films"></section>'.trim();
};

export default class Movies extends AbstractView {
  _getTemplate() {
    return getMoviesTemplate();
  }
}
