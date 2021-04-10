import UserView from './views/user';
import MenuView from './views/menu';
import {getSortingTemplate} from './views/sorting';
import {getMoviesTemplate} from './views/movies';
import MovieView from './views/movie';
import ShowMoreButtonView from './views/show-more-button';
import MoviesTotalView from './views/movies-total';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';
import {getFilters} from './mocks/filters';
import {render, RenderPosition} from './helpers/render';

const MoviesCount = {
  ALL: 20,
  TOP_RATED: 2,
  COMMENTED: 2,
  PER_STEP: 5,
};

const COMMENTS_COUNT = 10;

const comments = getComments(COMMENTS_COUNT);
const movies = getMovies(MoviesCount.ALL, comments);
const user = getUser(movies);
const filters = getFilters(movies, user);

const headerElement = document.querySelector('.header');

render(headerElement, new UserView(user).getElement());

const mainElement = document.querySelector('.main');

render(mainElement, new MenuView(filters).getElement());
render(mainElement, getSortingTemplate());
render(mainElement, getMoviesTemplate());

const moviesElement = mainElement.querySelector('[data-movies]');

movies.slice(0, MoviesCount.PER_STEP)
  .forEach((movie) => {
    render(moviesElement, new MovieView(movie, user).getElement());
  });

const topRatedElement = mainElement.querySelector('[data-top-rated]');

movies.slice()
  .sort((a, b) => b.rating - a.rating)
  .slice(0, MoviesCount.TOP_RATED)
  .forEach((movie) => {
    render(topRatedElement, new MovieView(movie, user).getElement());
  });

const mostCommentedElement = mainElement.querySelector('[data-commented]');

movies.slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, MoviesCount.COMMENTED)
  .forEach((movie) => {
    render(mostCommentedElement, new MovieView(movie, user).getElement());
  });

const moviesTotalElement = document.querySelector('.footer__statistics');

render(moviesTotalElement, new MoviesTotalView(movies.length).getElement());

if (movies.length > MoviesCount.PER_STEP) {
  let renderedMoviesCount = MoviesCount.PER_STEP;

  render(
    moviesElement,
    new ShowMoreButtonView().getElement(),
    RenderPosition.AFTER_END,
  );

  const loadMoreButtonElement = mainElement
    .querySelector('.films-list__show-more');

  const onLoadMoreButtonClick = (evt) => {
    evt.preventDefault();

    movies
      .slice(renderedMoviesCount, renderedMoviesCount + MoviesCount.PER_STEP)
      .forEach((movie) => {
        render(moviesElement, new MovieView(movie, user).getElement());
      });

    renderedMoviesCount += MoviesCount.PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      loadMoreButtonElement.remove();
    }
  };

  loadMoreButtonElement.addEventListener('click', onLoadMoreButtonClick);
}
