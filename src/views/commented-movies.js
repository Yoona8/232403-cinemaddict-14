import Abstract from './abstract';

const getCommentedMoviesTemplate = () => {
  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">
        Most commented
      </h2>
      <div class="films-list__container" data-commented></div>
    </section>
  `.trim();
};

export default class CommentedMovies extends Abstract {
  _getTemplate() {
    return getCommentedMoviesTemplate();
  }

  getContainer() {
    return this.getElement().querySelector('[data-commented]');
  }
}
