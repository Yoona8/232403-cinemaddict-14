import {getUserTemplate} from './views/user';
import {getMenuTemplate} from './views/menu';
import {getSortingTemplate} from './views/sorting';
import {getMoviesTemplate} from './views/movies';
import {getMovieTemplate} from './views/movie';
import {getShowMoreButtonTemplate} from './views/show-more-button';
import {getMoviesTotalTemplate} from './views/movies-total';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';

const RenderPosition = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const MoviesCount = {
  ALL: 5,
  TOP_RATED: 2,
  COMMENTED: 2,
};

const movies = getMovies(MoviesCount.ALL);
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

movies.forEach(() => render(moviesElement, getMovieTemplate()));

render(moviesElement, getShowMoreButtonTemplate(), RenderPosition.AFTER_END);

const topRatedElement = mainElement.querySelector('[data-top-rated]');

movies.slice(0, MoviesCount.COMMENTED)
  .forEach(() => render(topRatedElement, getMovieTemplate()));

const mostCommentedElement = mainElement.querySelector('[data-commented]');

movies.slice(0, MoviesCount.COMMENTED)
  .forEach(() => render(mostCommentedElement, getMovieTemplate()));

const moviesTotalElement = document.querySelector('.footer__statistics');

render(moviesTotalElement, getMoviesTotalTemplate());
