import UserView from './views/user';
import MenuView from './views/menu';
import MoviesView from './views/movies';
import MovieView from './views/movie';
import ShowMoreButtonView from './views/show-more-button';
import MoviesTotalView from './views/movies-total';
import DetailsModalView from './views/details-modal';
import MoviesPresenter from './presenters/movies';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';
import {getFilters} from './mocks/filters';
import {render, RenderPosition} from './helpers/render';
import {checkEscKeyDown} from './helpers/helpers';

const MoviesCount = {
  ALL: 0,
  TOP_RATED: 2,
  COMMENTED: 2,
  PER_STEP: 5,
};

const COMMENTS_COUNT = 10;
const BODY_NO_SCROLL_CLASS_NAME = 'hide-overflow';

const comments = getComments(COMMENTS_COUNT);
const movies = getMovies(MoviesCount.ALL, comments);
const user = getUser(movies);
const filters = getFilters(movies, user);

const headerElement = document.querySelector('.header');

render(headerElement, new UserView(user));

const mainElement = document.querySelector('.main');

render(mainElement, new MenuView(filters));

new MoviesPresenter(mainElement).init(movies);

const renderMovies = () => {
  render(mainElement, new MoviesView());

  const openDetails = (movie) => {
    const detailsModalView = new DetailsModalView(movie, user, comments);

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
    const movieView = new MovieView(movie, user);

    movieView.addDetailsOpenClickHandler(() => openDetails(movie));
    render(container, movieView);
  };

  const moviesElement = mainElement.querySelector('[data-movies]');

  movies.slice(0, MoviesCount.PER_STEP)
    .forEach((movie) => renderMovie(moviesElement, movie));

  const topRatedElement = mainElement.querySelector('[data-top-rated]');

  movies.slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, MoviesCount.TOP_RATED)
    .forEach((movie) => renderMovie(topRatedElement, movie));

  const mostCommentedElement = mainElement.querySelector('[data-commented]');

  movies.slice()
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, MoviesCount.COMMENTED)
    .forEach((movie) => renderMovie(mostCommentedElement, movie));

  if (movies.length > MoviesCount.PER_STEP) {
    const showMoreButtonView = new ShowMoreButtonView();
    let renderedMoviesCount = MoviesCount.PER_STEP;

    const showMoreButtonClickHandler = () => {
      movies
        .slice(renderedMoviesCount, renderedMoviesCount + MoviesCount.PER_STEP)
        .forEach((movie) => renderMovie(moviesElement, movie));

      renderedMoviesCount += MoviesCount.PER_STEP;

      if (renderedMoviesCount >= movies.length) {
        showMoreButtonView.removeElement();
      }
    };

    showMoreButtonView.addClickHandler(showMoreButtonClickHandler);
    render(moviesElement, showMoreButtonView, RenderPosition.AFTER_END);
  }
};

if (movies.length !== 0) {
  renderMovies();
}

const moviesTotalElement = document.querySelector('.footer__statistics');

render(moviesTotalElement, new MoviesTotalView(movies.length));

