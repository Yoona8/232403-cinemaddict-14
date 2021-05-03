import MoviePresenter from './movie';
import SortingView from '../views/sorting';
import NoMoviesView from '../views/no-movies';
import MoviesView from '../views/movies';
import ShowMoreButtonView from '../views/show-more-button';
import TopRatedMoviesView from '../views/top-rated-movies';
import AllMoviesView from '../views/all-movies';
import CommentedMoviesView from '../views/commented-movies';
import {render, RenderPosition} from '../helpers/render';
import {SortingType, UserAction} from '../helpers/consts';
import {
  sortMoviesByCommentsCountDown,
  sortMoviesByDateDown,
  sortMoviesByRatingDown
} from '../helpers/helpers';

const MoviesCount = {
  TOP_RATED: 2,
  COMMENTED: 2,
  PER_STEP: 5,
};

export default class Movies {
  constructor(container, moviesModel, commentsModel, userModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._userModel = userModel;

    this._renderedMoviesCount = MoviesCount.PER_STEP;
    this._currentSortingType = SortingType.DEFAULT;

    this._moviePresenters = [];
    this._currentDetailsPresenter = null;

    this._sortingView = new SortingView();
    this._moviesView = new MoviesView();
    this._allMoviesView = new AllMoviesView();
    this._showMoreButtonView = null;

    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler
      .bind(this);
    this._movieChangeHandler = this._movieChangeHandler.bind(this);
    this._detailsOpenHandler = this._detailsOpenHandler.bind(this);
    this._sortingChangeHandler = this._sortingChangeHandler.bind(this);
  }

  init() {
    this._renderBoard();
  }

  _getMovies(sortingType = this._currentSortingType) {
    switch (sortingType) {
      case SortingType.DATE:
        return this._moviesModel.getMovies()
          .slice().sort(sortMoviesByDateDown);
      case SortingType.RATING:
        return this._moviesModel.getMovies()
          .slice().sort(sortMoviesByRatingDown);
      case SortingType.COMMENTED:
        return this._moviesModel.getMovies()
          .slice().sort(sortMoviesByCommentsCountDown);
      default:
        return this._moviesModel.getMovies();
    }
  }

  _renderSorting() {
    this._sortingView.addSortingTypeClickHandler(this._sortingChangeHandler);
    render(this._container, this._sortingView);
  }

  _renderMovie(container, movie) {
    const moviePresenter = new MoviePresenter(
      container,
      this._movieChangeHandler,
    );

    moviePresenter.addDetailsOpenHandler(this._detailsOpenHandler);

    moviePresenter.init(
      movie,
      this._userModel.getUser(),
      this._commentsModel.getComments(),
    );

    this._moviePresenters.push({
      movieId: movie.id,
      container,
      presenter: moviePresenter,
    });
  }

  _renderMovies(container, movies) {
    movies.forEach((movie) => this._renderMovie(container, movie));
  }

  _renderTopRated() {
    const topRatedView = new TopRatedMoviesView();
    const topRatedContainer = topRatedView.getContainer();
    const movies = this._getMovies(SortingType.RATING)
      .slice(0, MoviesCount.TOP_RATED);

    this._renderMovies(topRatedContainer, movies);
    render(this._moviesView, topRatedView);
  }

  _renderCommented() {
    const commentedView = new CommentedMoviesView();
    const commentedContainer = commentedView.getContainer();
    const movies = this._getMovies(SortingType.COMMENTED)
      .slice(0, MoviesCount.TOP_RATED);

    this._renderMovies(commentedContainer, movies);
    render(this._moviesView, commentedView);
  }

  _renderAllMovies() {
    const moviesContainer = this._allMoviesView.getContainer();
    const moviesCount = this._getMovies().length;
    const movies = this._getMovies()
      .slice(0, Math.min(moviesCount, MoviesCount.PER_STEP));

    this._renderMovies(moviesContainer, movies);

    if (!this._moviesView.getElement()
      .contains(this._allMoviesView.getElement())) {
      render(this._moviesView, this._allMoviesView);
    }

    if (moviesCount > MoviesCount.PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderShowMoreButton() {
    this._showMoreButtonView = new ShowMoreButtonView();
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
    if (this._getMovies().length === 0) {
      render(this._container, new NoMoviesView());
    } else {
      this._renderSorting();
      this._renderMovieList();
    }
  }

  _clearAllMovies() {
    this._moviePresenters
      .filter((item) => item.container === this._allMoviesView.getContainer())
      .forEach((item) => item.presenter.destroy());
    this._moviePresenters = this._moviePresenters
      .filter((item) => item.container !== this._allMoviesView.getContainer());
    this._renderedMoviesCount = MoviesCount.PER_STEP;

    if (this._showMoreButtonView) {
      this._showMoreButtonView.removeElement();
      this._showMoreButtonView = null;
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
    const moviesCount = this._getMovies().length;
    const container = this._allMoviesView.getContainer();

    const newRenderedMoviesCount = Math.min(
      moviesCount,
      this._renderedMoviesCount + MoviesCount.PER_STEP,
    );

    const movies = this._getMovies()
      .slice(this._renderedMoviesCount, newRenderedMoviesCount);

    this._renderMovies(container, movies);
    this._renderedMoviesCount = newRenderedMoviesCount;

    if (this._renderedMoviesCount >= moviesCount) {
      this._showMoreButtonView.removeElement();
      this._showMoreButtonView = null;
    }
  }

  _detailsOpenHandler(movieId) {
    if (this._currentDetailsPresenter) {
      this._currentDetailsPresenter.presenter.resetView();
    }

    this._currentDetailsPresenter = this._moviePresenters
      .find((item) => item.movieId === movieId);
  }

  _sortingChangeHandler(sortingType) {
    if (this._currentSortingType === sortingType) {
      return;
    }

    this._currentSortingType = sortingType;
    this._clearAllMovies();
    this._renderAllMovies();
  }
}
