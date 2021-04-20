import Abstract from './abstract';

const getAllMoviesTemplate = () => {
  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">
        All movies. Upcoming
      </h2>
      <div class="films-list__container" data-movies></div>
    </section>
  `.trim();
};

export default class AllMovies extends Abstract {
  _getTemplate() {
    return getAllMoviesTemplate();
  }

  getContainer() {
    return this.getElement().querySelector('[data-movies]');
  }
}
