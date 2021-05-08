import MoviePresenter from './movie';
import SortingView from '../views/sorting';
import NoMoviesView from '../views/no-movies';
import MoviesView from '../views/movies';
import ShowMoreButtonView from '../views/show-more-button';
import TopRatedMoviesView from '../views/top-rated-movies';
import AllMoviesView from '../views/all-movies';
import CommentedMoviesView from '../views/commented-movies';
import {render, RenderPosition, replace} from '../helpers/render';
import {
  FilterType,
  SortingType,
  UpdateType,
  UserAction
} from '../helpers/consts';
import {
  sortMoviesByCommentsCountDown,
  sortMoviesByDateDown,
  sortMoviesByRatingDown, toggleItemInSet
} from '../helpers/helpers';
import {filter} from '../helpers/filter';

const MoviesCount = {
  TOP_RATED: 2,
  COMMENTED: 2,
  PER_STEP: 5,
};

export default class Movies {
  constructor(container, moviesModel, commentsModel, userModel, filterModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._userModel = userModel;
    this._filterModel = filterModel;

    this._renderedMoviesCount = MoviesCount.PER_STEP;
    this._currentSortingType = SortingType.DEFAULT;

    this._moviePresenters = [];
    this._currentDetailsPresenter = null;

    this._moviesView = new MoviesView();
    this._allMoviesView = new AllMoviesView();
    this._sortingView = null;
    this._showMoreButtonView = null;

    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._modelChangeHandler = this._modelChangeHandler.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler
      .bind(this);
    this._detailsOpenHandler = this._detailsOpenHandler.bind(this);
    this._sortingChangeHandler = this._sortingChangeHandler.bind(this);

    this._moviesModel.addObserver(this._modelChangeHandler);
    this._filterModel.addObserver(this._modelChangeHandler);
  }

  init() {
    this._renderBoard();
  }

  _getMovies(sortingType = this._currentSortingType) {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies().slice();
    const filteredMovies = filterType === FilterType.ALL
      ? movies
      : filter[filterType](movies, this._userModel.getUser());

    switch (sortingType) {
      case SortingType.DATE:
        return filteredMovies.sort(sortMoviesByDateDown);
      case SortingType.RATING:
        return filteredMovies.sort(sortMoviesByRatingDown);
      case SortingType.COMMENTED:
        return filteredMovies.sort(sortMoviesByCommentsCountDown);
      default:
        return filteredMovies;
    }
  }

  _renderSorting() {
    const prevSortingView = this._sortingView;

    this._sortingView = new SortingView();
    this._sortingView.addSortingTypeClickHandler(this._sortingChangeHandler);

    if (prevSortingView) {
      replace(this._sortingView, prevSortingView);
      return;
    }

    render(this._container, this._sortingView);
  }

  _renderMovie(container, movie) {
    const moviePresenter = new MoviePresenter(
      container,
      this._viewChangeHandler,
      this._commentsModel,
    );

    moviePresenter.addDetailsOpenHandler(this._detailsOpenHandler);
    moviePresenter.init(movie, this._userModel.getUser());

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
      .slice(0, Math.min(moviesCount, this._renderedMoviesCount));

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

  _modelChangeHandler(updateType, updatedMovie) {
    const movieId = updatedMovie.id;

    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenters
          .filter((item) => item.movieId === movieId)
          .forEach((item) => item.presenter
            .init(updatedMovie, this._userModel.getUser()));
        break;
      case UpdateType.MINOR:
        this._clearAllMovies();
        this._renderAllMovies();
        break;
      case UpdateType.MAJOR:
        this._currentSortingType = SortingType.DEFAULT;
        this._renderSorting();
        this._clearAllMovies();
        this._renderAllMovies();
        break;
    }
  }

  _viewChangeHandler(actionType, updateType, updatedMovie) {
    const movieId = updatedMovie.id;
    const updatedUser = Object.assign({}, this._userModel.getUser());
    const {favorites, watchlist, watched} = updatedUser;

    switch (actionType) {
      case UserAction.FAVORITE:
        updatedUser.favorites = toggleItemInSet(favorites, movieId);
        this._userModel.updateUser(updateType, updatedUser);
        this._moviesModel.updateMovie(updateType, updatedMovie);
        break;
      case UserAction.WATCHLIST:
        updatedUser.watchlist = toggleItemInSet(watchlist, movieId);
        this._userModel.updateUser(updateType, updatedUser);
        this._moviesModel.updateMovie(updateType, updatedMovie);
        break;
      case UserAction.WATCHED:
        updatedUser.watched = toggleItemInSet(watched, movieId);
        this._userModel.updateUser(updateType, updatedUser);
        this._moviesModel.updateMovie(updateType, updatedMovie);
        break;
      case UserAction.DELETE_COMMENT:
        this._moviesModel.updateMovie(updateType, updatedMovie);
        break;
    }
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
