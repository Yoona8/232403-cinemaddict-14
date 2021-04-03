export const getMoviesTemplate = () => {
  return `
    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">
          All movies. Upcoming
        </h2>
        <div class="films-list__container" data-movies></div>
      </section>

      <section class="films-list films-list--extra">
        <h2 class="films-list__title">
          Top rated
        </h2>
        <div class="films-list__container" data-top-rated></div>
      </section>

      <section class="films-list films-list--extra">
        <h2 class="films-list__title">
          Most commented
        </h2>
        <div class="films-list__container" data-commented></div>
      </section>
    </section>
  `.trim();
};
