import {getUserTemplate} from './views/user';
import {getMenuTemplate} from './views/menu';
import {getSortingTemplate} from './views/sorting';
import {getMoviesTemplate} from './views/movies';
import {getMovieTemplate} from './views/movie';
import {getShowMoreButtonTemplate} from './views/show-more-button';
import {getMoviesTotalTemplate} from './views/movies-total';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';

const RenderPosition = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const MoviesCount = {
  ALL: 20,
  TOP_RATED: 2,
  COMMENTED: 2,
};

const COMMENTS_COUNT = 10;

const comments = getComments(COMMENTS_COUNT);
const movies = getMovies(MoviesCount.ALL, comments);
const user = getUser(movies);

const render = (
  container,
  template,
  position = RenderPosition.BEFORE_END,
) => {
  container.insertAdjacentHTML(position, template);
};

const headerElement = document.querySelector('.header');

render(headerElement, getUserTemplate(user));

const mainElement = document.querySelector('.main');

render(mainElement, getMenuTemplate());
render(mainElement, getSortingTemplate());
render(mainElement, getMoviesTemplate());

const moviesElement = mainElement.querySelector('[data-movies]');

movies.forEach((movie) => render(moviesElement, getMovieTemplate(movie)));

render(moviesElement, getShowMoreButtonTemplate(), RenderPosition.AFTER_END);

const topRatedElement = mainElement.querySelector('[data-top-rated]');

movies.slice()
  .sort((a, b) => b.rating - a.rating)
  .slice(0, MoviesCount.TOP_RATED)
  .forEach((movie) => render(topRatedElement, getMovieTemplate(movie)));

const mostCommentedElement = mainElement.querySelector('[data-commented]');

movies.slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, MoviesCount.COMMENTED)
  .forEach((movie) => render(mostCommentedElement, getMovieTemplate(movie)));

const moviesTotalElement = document.querySelector('.footer__statistics');

render(moviesTotalElement, getMoviesTotalTemplate());
