import MoviePresenter from './movie';
import SortingView from '../views/sorting';
import NoMoviesView from '../views/no-movies';
import MoviesView from '../views/movies';
import ShowMoreButtonView from '../views/show-more-button';
import TopRatedMoviesView from '../views/top-rated-movies';
import AllMoviesView from '../views/all-movies';
import CommentedMoviesView from '../views/commented-movies';
import {render, RenderPosition} from '../helpers/render';
import {UserAction} from '../helpers/consts';

const MoviesCount = {
  TOP_RATED: 2,
  COMMENTED: 2,
  PER_STEP: 5,
};

export default class Movies {
  constructor(container) {
    this._user = null;
    this._movies = [];
    this._comments = [];
    this._renderedMoviesCount = MoviesCount.PER_STEP;
    this._container = container;

    this._moviePresenters = [];

    this._sortingView = new SortingView();
    this._moviesView = new MoviesView();
    this._allMoviesView = new AllMoviesView();
    this._showMoreButtonView = new ShowMoreButtonView();

    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler
      .bind(this);
    this._movieChangeHandler = this._movieChangeHandler.bind(this);
  }

  init(movies, user, comments) {
    this._movies = movies;
    this._user = user;
    this._comments = comments;
    this._renderBoard();
  }

  _renderSorting() {
    render(this._container, this._sortingView);
  }

  _renderMovie(container, movie) {
    const moviePresenter = new MoviePresenter(
      container,
      this._movieChangeHandler,
    );

    moviePresenter.init(movie, this._user, this._comments);
    this._moviePresenters.push({
      movieId: movie.id,
      presenter: moviePresenter,
    });
  }

  _renderMovies(from, to) {
    const moviesContainer = this._allMoviesView.getContainer();

    this._movies.slice(from, to)
      .forEach((movie) => this._renderMovie(moviesContainer, movie));
  }

  _renderTopRated() {
    const topRatedView = new TopRatedMoviesView();
    const topRatedContainer = topRatedView.getContainer();

    this._movies.slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, MoviesCount.TOP_RATED)
      .forEach((movie) => this._renderMovie(topRatedContainer, movie));

    render(this._moviesView, topRatedView);
  }

  _renderCommented() {
    const commentedView = new CommentedMoviesView();
    const commentedContainer = commentedView.getContainer();

    this._movies.slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, MoviesCount.COMMENTED)
      .forEach((movie) => this._renderMovie(commentedContainer, movie));

    render(this._moviesView, commentedView);
  }

  _renderAllMovies() {
    this._renderMovies(0, MoviesCount.PER_STEP);
    render(this._moviesView, this._allMoviesView);

    if (this._movies.length > MoviesCount.PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderShowMoreButton() {
    this._showMoreButtonView
      .addClickHandler(this._showMoreButtonClickHandler);

    render(
      this._allMoviesView.getContainer(),
      this._showMoreButtonView, RenderPosition.AFTER_END,
    );
  }

  _renderMovieList() {
    this._renderAllMovies();
    this._renderTopRated();
    this._renderCommented();

    render(this._container, this._moviesView);
  }

  _renderBoard() {
    if (this._movies.length === 0) {
      render(this._container, new NoMoviesView());
    } else {
      this._renderSorting();
      this._renderMovieList();
    }
  }

  _movieChangeHandler(userAction, updatedMovie) {
    const movieId = updatedMovie.id;

    switch (userAction) {
      case UserAction.FAVORITE:
        this._favoriteToggleHandler(movieId);
        break;
      case UserAction.WATCHLIST:
        this._toggleWatchlistHandler(movieId);
        break;
      case UserAction.WATCHED:
        this._toggleWatchedHandler(movieId);
    }

    this._moviePresenters
      .filter((item) => item.movieId === movieId)
      .forEach((item) => item.presenter.init(updatedMovie, this._user));
  }

  _favoriteToggleHandler(movieId) {
    const {favorites} = this._user;

    if (favorites.has(movieId)) {
      favorites.delete(movieId);
      return;
    }

    favorites.add(movieId);
  }

  _toggleWatchlistHandler(movieId) {
    const {watchlist} = this._user;

    if (watchlist.has(movieId)) {
      watchlist.delete(movieId);
      return;
    }

    watchlist.add(movieId);
  }

  _toggleWatchedHandler(movieId) {
    const {watched} = this._user;

    if (watched.has(movieId)) {
      watched.delete(movieId);
      return;
    }

    watched.add(movieId);
  }

  _showMoreButtonClickHandler() {
    this._renderMovies(
      this._renderedMoviesCount,
      this._renderedMoviesCount + MoviesCount.PER_STEP,
    );

    this._renderedMoviesCount += MoviesCount.PER_STEP;

    if (this._renderedMoviesCount >= this._movies.length) {
      this._showMoreButtonView.removeElement();
    }
  }
}
