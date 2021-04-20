import Abstract from './abstract';

const getTopRatedMoviesTemplate = () => {
  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">
        Top rated
      </h2>
      <div class="films-list__container" data-top-rated></div>
    </section>
  `.trim();
};

export default class TopRatedMovies extends Abstract {
  _getTemplate() {
    return getTopRatedMoviesTemplate();
  }

  getContainer() {
    return this.getElement().querySelector('[data-top-rated]');
  }
}
