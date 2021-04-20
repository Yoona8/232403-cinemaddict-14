import SortingView from '../views/sorting';
import NoMoviesView from '../views/no-movies';
import MoviesView from '../views/movies';
import DetailsModalView from '../views/details-modal';
import MovieView from '../views/movie';
import ShowMoreButtonView from '../views/show-more-button';
import {checkEscKeyDown} from '../helpers/helpers';
import {render, RenderPosition} from '../helpers/render';

const MoviesCount = {
  TOP_RATED: 2,
  COMMENTED: 2,
  PER_STEP: 5,
};

const BODY_NO_SCROLL_CLASS_NAME = 'hide-overflow';

export default class Movies {
  constructor(container) {
    this._user = null;
    this._movies = [];
    this._comments = [];
    this._container = container;
    this._sortingView = new SortingView();
  }

  _renderSorting() {
    render(this._container, this._sortingView);
  }

  _renderMovieList() {
    render(this._container, new MoviesView());

    const openDetails = (movie) => {
      const detailsModalView = new DetailsModalView(
        movie,
        this._user,
        this._comments,
      );

      const closeDetails = () => {
        document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
        document.removeEventListener('keydown', detailsEscKeyDownHandler);
        detailsModalView.removeElement();
      };

      detailsModalView.addCloseClickHandler(() => closeDetails());

      const detailsEscKeyDownHandler = (evt) => {
        if (checkEscKeyDown(evt.key)) {
          closeDetails();
        }
      };

      document.addEventListener('keydown', detailsEscKeyDownHandler);
      document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);
      render(document.body, detailsModalView);
    };

    const renderMovie = (container, movie) => {
      const movieView = new MovieView(movie, this._user);

      movieView.addDetailsOpenClickHandler(() => openDetails(movie));
      render(container, movieView);
    };

    const moviesElement = this._container.querySelector('[data-movies]');

    this._movies.slice(0, MoviesCount.PER_STEP)
      .forEach((movie) => renderMovie(moviesElement, movie));

    const topRatedElement = this._container.querySelector('[data-top-rated]');

    this._movies.slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, MoviesCount.TOP_RATED)
      .forEach((movie) => renderMovie(topRatedElement, movie));

    const mostCommentedElement = this._container
      .querySelector('[data-commented]');

    this._movies.slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, MoviesCount.COMMENTED)
      .forEach((movie) => renderMovie(mostCommentedElement, movie));

    if (this._movies.length > MoviesCount.PER_STEP) {
      const showMoreButtonView = new ShowMoreButtonView();
      let renderedMoviesCount = MoviesCount.PER_STEP;

      const showMoreButtonClickHandler = () => {
        this._movies
          .slice(
            renderedMoviesCount,
            renderedMoviesCount + MoviesCount.PER_STEP,
          )
          .forEach((movie) => renderMovie(moviesElement, movie));

        renderedMoviesCount += MoviesCount.PER_STEP;

        if (renderedMoviesCount >= this._movies.length) {
          showMoreButtonView.removeElement();
        }
      };

      showMoreButtonView.addClickHandler(showMoreButtonClickHandler);
      render(moviesElement, showMoreButtonView, RenderPosition.AFTER_END);
    }
  }

  _renderMovies() {
    if (this._movies.length === 0) {
      render(this._container, new NoMoviesView());
    } else {
      this._renderMovieList();
    }
  }

  init(movies, user, comments) {
    this._movies = movies;
    this._user = user;
    this._comments = comments;
    this._renderSorting();
    this._renderMovies();
  }
}
