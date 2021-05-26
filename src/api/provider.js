import MoviesModel from '../models/movies';
import {isOnline} from '../helpers/helpers';

const getStoreStructure = (items) => {
  return items.reduce((acc, item) => {
    return Object.assign({}, acc, {
      [item.id]: item,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = getStoreStructure(
            movies.map(MoviesModel.adaptToServer),
          );

          this._store.setItems(items);
          return movies;
        });
    }

    const storedMovies = Object.values(this._store.getItems());
    return Promise.resolve(storedMovies.map(MoviesModel.adaptToClient));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(
            updatedMovie.id,
            MoviesModel.adaptToServer(updatedMovie),
          );

          return updatedMovie;
        });
    }

    this._store.setItem(
      movie.id,
      MoviesModel.adaptToServer(Object.assign({}, movie)),
    );

    return Promise.resolve(movie);
  }

  getComments(movieId) {
    return this._api.getComments(movieId);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }

  addComment(comment, movieId) {
    return this._api.addComment(comment, movieId);
  }

  sync() {
    if (isOnline()) {
      const storedMovies = Object.values(this._store.getItems());

      return this._api.sync(storedMovies)
        .then((response) => {
          this._store.setItems(response.updated);
        });
    }

    return Promise.reject(new Error('Sync data failed!'));
  }
}
