import Subject from '../helpers/subject';

export default class Movies extends Subject {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, updatedMovie) {
    const index = this._movies
      .findIndex((item) => item.id === updatedMovie.id);

    if (index === -1) {
      return;
    }

    this._movies = [
      ...this._movies.slice(0, index),
      updatedMovie,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, updatedMovie);
  }
}
