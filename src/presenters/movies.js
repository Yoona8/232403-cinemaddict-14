import SortingView from '../views/sorting';
import NoMoviesView from '../views/no-movies';
import {render} from '../helpers/render';

export default class Movies {
  constructor(container) {
    this._movies = [];
    this._container = container;
    this._sortingView = new SortingView();
  }

  _renderSorting() {
    render(this._container, this._sortingView);
  }

  _renderMovieList() {}

  _renderMovies() {
    if (this._movies.length === 0) {
      render(this._container, new NoMoviesView());
    } else {
      this._renderMovieList();
    }
  }

  init(movies) {
    this._movies = movies;
    this._renderSorting();
    this._renderMovies();
  }
}
