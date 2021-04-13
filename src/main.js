import UserView from './views/user';
import MenuView from './views/menu';
import SortingView from './views/sorting';
import MoviesView from './views/movies';
import MovieView from './views/movie';
import ShowMoreButtonView from './views/show-more-button';
import MoviesTotalView from './views/movies-total';
import DetailsModalView from './views/details-modal';
import NoMoviesView from './views/no-movies';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';
import {getFilters} from './mocks/filters';
import {render, RenderPosition} from './helpers/render';
import {checkEscKeyDown} from './helpers/helpers';

const MoviesCount = {
  ALL: 20,
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
render(mainElement, new SortingView());

const renderMovies = () => {
  render(mainElement, new MoviesView());

  const openDetails = (movie) => {
    const detailsModalView = new DetailsModalView(movie, user, comments);

    const closeDetails = () => {
      document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
      document.removeEventListener('keydown', onDetailsEscKeyDown);
      detailsModalView.removeElement();
    };

    const onDetailsClose = () => {
      closeDetails();
    };

    const onDetailsEscKeyDown = (evt) => {
      if (checkEscKeyDown(evt.key)) {
        closeDetails();
      }
    };

    detailsModalView.addCloseListener(onDetailsClose);
    document.addEventListener('keydown', onDetailsEscKeyDown);
    document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);
    render(document.body, detailsModalView);
  };

  const onDetailsOpen = (movie) => {
    openDetails(movie);
  };

  const renderMovie = (container, movie) => {
    const movieView = new MovieView(movie, user);

    movieView.addOpenDetailsListener(() => onDetailsOpen(movie));
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
    let renderedMoviesCount = MoviesCount.PER_STEP;

    render(moviesElement, new ShowMoreButtonView(), RenderPosition.AFTER_END);

    const loadMoreButtonElement = mainElement
      .querySelector('.films-list__show-more');

    const onLoadMoreButtonClick = (evt) => {
      evt.preventDefault();

      movies
        .slice(renderedMoviesCount, renderedMoviesCount + MoviesCount.PER_STEP)
        .forEach((movie) => renderMovie(moviesElement, movie));

      renderedMoviesCount += MoviesCount.PER_STEP;

      if (renderedMoviesCount >= movies.length) {
        loadMoreButtonElement.remove();
      }
    };

    loadMoreButtonElement.addEventListener('click', onLoadMoreButtonClick);
  }
};

if (movies.length === 0) {
  render(mainElement, new NoMoviesView());
} else {
  renderMovies();
}

const moviesTotalElement = document.querySelector('.footer__statistics');

render(moviesTotalElement, new MoviesTotalView(movies.length));
