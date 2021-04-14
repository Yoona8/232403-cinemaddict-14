import AbstractView from './abstract';

const getNoMoviesTemplate = () => {
  return `
    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
      </section>
    </section>
  `;
};

export default class NoMovies extends AbstractView {
  _getTemplate() {
    return getNoMoviesTemplate();
  }
}
