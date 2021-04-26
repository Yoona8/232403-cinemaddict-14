import MovieView from '../views/movie';
import DetailsModalView from '../views/details-modal';
import {render, replace} from '../helpers/render';
import {checkEscKeyDown} from '../helpers/helpers';

const BODY_NO_SCROLL_CLASS_NAME = 'hide-overflow';

export default class Movie {
  constructor(container) {
    this._container = container;

    this._movie = null;
    this._user = null;
    this._comments = [];

    this._movieView = null;
    this._detailsModalView = null;

    this._detailsEscKeyDownHandler = this._detailsEscKeyDownHandler
      .bind(this);
  }

  init(movie, user, comments) {
    this._movie = movie;
    this._user = user || this._user;
    this._comments = comments || this._comments;

    const prevMovieView = this._movieView;

    this._movieView = new MovieView(this._movie, this._user);
    this._movieView.addDetailsOpenClickHandler(() => this._openDetails());
    this._movieView.addFavoriteClickHandler(() => {});
    this._movieView.addWatchedClickHandler(() => {});
    this._movieView.addWatchlistClickHandler(() => {});

    if (prevMovieView === null) {
      render(this._container, this._movieView);
      return;
    }

    if (this._container.getElement().contains(prevMovieView.getElement())) {
      replace(this._movieView, prevMovieView);
    }
  }

  _openDetails() {
    this._detailsModalView = new DetailsModalView(
      this._movie,
      this._user,
      this._comments,
    );

    this._detailsModalView.addCloseClickHandler(() => this._closeDetails());

    document.addEventListener('keydown', this._detailsEscKeyDownHandler);
    document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);
    render(document.body, this._detailsModalView);
  }

  _closeDetails() {
    document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
    document.removeEventListener('keydown', this._detailsEscKeyDownHandler);
    this._detailsModalView.removeElement();
  }

  _detailsEscKeyDownHandler(evt) {
    if (checkEscKeyDown(evt.key)) {
      this._closeDetails();
    }
  }
}
