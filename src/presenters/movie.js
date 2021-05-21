import MovieView from '../views/movie';
import DetailsModalView from '../views/details-modal';
import {render, replace} from '../helpers/render';
import {checkEscKeyDown} from '../helpers/helpers';
import {UpdateType, UserAction} from '../helpers/consts';

const BODY_NO_SCROLL_CLASS_NAME = 'hide-overflow';

export default class Movie {
  constructor(container, movieChangeHandler, commentsModel) {
    this._container = container;
    this._changeMovie = movieChangeHandler;
    this._commentsModel = commentsModel;

    this._movie = null;
    this._user = null;

    this._movieView = null;
    this._detailsModalView = null;

    this._callback = {};

    this._modelChangeHandler = this._modelChangeHandler.bind(this);
    this._detailsEscKeyDownHandler = this._detailsEscKeyDownHandler
      .bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);
    this._watchedToggleHandler = this._watchedToggleHandler.bind(this);
    this._watchlistToggleHandler = this._watchlistToggleHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
  }

  init(movie, user) {
    this._user = user || this._user;
    this._movie = movie;

    const prevMovieView = this._movieView;

    this._movieView = new MovieView(this._movie);
    this._movieView.addDetailsOpenClickHandler(() => this._openDetails());
    this._movieView.addFavoriteClickHandler(this._favoriteToggleHandler);
    this._movieView.addWatchedClickHandler(this._watchedToggleHandler);
    this._movieView.addWatchlistClickHandler(this._watchlistToggleHandler);

    if (prevMovieView === null) {
      render(this._container, this._movieView);
      return;
    }

    if (this._container.contains(prevMovieView.getElement())) {
      replace(this._movieView, prevMovieView);
    }
  }

  resetView() {
    if (this._detailsModalView) {
      this._closeDetails();
    }
  }

  destroy() {
    this._movieView.removeElement();

    if (this._detailsModalView) {
      this._detailsModalView.removeElement();
    }
  }

  _openDetails() {
    this._callback.detailsOpenHandler(this._movie.id);
    this._commentsModel.setComments(UpdateType.INIT, this._movie.id);
    this._commentsModel.addObserver(this._modelChangeHandler);

    this._detailsModalView = new DetailsModalView(
      this._movie,
      this._commentsModel.getComments(),
    );

    this._detailsModalView.addCloseClickHandler(() => this._closeDetails());
    this._detailsModalView
      .addFavoriteChangeHandler(this._favoriteToggleHandler);
    this._detailsModalView.addWatchedChangeHandler(this._watchedToggleHandler);
    this._detailsModalView
      .addWatchlistChangeHandler(this._watchlistToggleHandler);
    this._detailsModalView
      .addCommentDeleteClickHandler(this._commentDeleteHandler);
    this._detailsModalView.addCommentSubmitHandler(this._commentSubmitHandler);

    document.addEventListener('keydown', this._detailsEscKeyDownHandler);
    document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);
    render(document.body, this._detailsModalView);
  }

  _closeDetails() {
    document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
    document.removeEventListener('keydown', this._detailsEscKeyDownHandler);
    this._detailsModalView.removeElement();
    this._detailsModalView = null;
    this._commentsModel.removeObserver(this._modelChangeHandler);
  }

  _modelChangeHandler() {
    this._detailsModalView
      .updateComments(this._movie, this._commentsModel.getComments());
  }

  _detailsEscKeyDownHandler(evt) {
    if (checkEscKeyDown(evt.key)) {
      this._closeDetails();
    }
  }

  _favoriteToggleHandler() {
    this._changeMovie(
      UserAction.FAVORITE,
      UpdateType.PATCH,
      Object.assign({}, this._movie, {
        isFavorite: !this._movie.isFavorite,
      }),
    );
  }

  _watchedToggleHandler() {
    this._changeMovie(
      UserAction.WATCHED,
      UpdateType.PATCH,
      Object.assign({}, this._movie, {
        isWatched: !this._movie.isWatched,
      }),
    );
  }

  _watchlistToggleHandler() {
    this._changeMovie(
      UserAction.WATCHLIST,
      UpdateType.PATCH,
      Object.assign({}, this._movie, {
        isWatchlist: !this._movie.isWatchlist,
      }),
    );
  }

  _commentDeleteHandler(commentId) {
    const comments = new Set([...this._movie.comments]);
    comments.delete(commentId);

    this._changeMovie(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign({}, this._movie, {comments}),
    );

    this._commentsModel.deleteComment(UpdateType.PATCH, commentId);
  }

  _commentSubmitHandler(comment) {
    comment.id = String(this._commentsModel.getComments().length);

    const comments = new Set([...this._movie.comments, comment.id]);

    this._changeMovie(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign({}, this._movie, {comments}),
    );

    this._commentsModel.addComment(UpdateType.PATCH, comment, this._movie.id);
  }

  addDetailsOpenHandler(cb) {
    this._callback.detailsOpenHandler = cb;
  }
}
