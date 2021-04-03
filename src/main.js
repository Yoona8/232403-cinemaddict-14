import {getUserTemplate} from './views/user-view';
import {getMenuTemplate} from './views/menu-view';
import {getSortingTemplate} from './views/sorting-view';
import {getMoviesTemplate} from './views/movies-view';
import {getMovieTemplate} from './views/movie-view';

const RenderPosition = {
  BEFORE_END: 'beforeend',
};

const MoviesCount = {
  ALL: 5,
  TOP_RATED: 2,
  COMMENTED: 2,
};

const movies = new Array(MoviesCount.ALL).fill('');

const render = (
  container,
  template,
  position = RenderPosition.BEFORE_END,
) => {
  container.insertAdjacentHTML(position, template);
};

const headerElement = document.querySelector('.header');

render(headerElement, getUserTemplate());

const mainElement = document.querySelector('.main');

render(mainElement, getMenuTemplate());
render(mainElement, getSortingTemplate());
render(mainElement, getMoviesTemplate());

const moviesElement = mainElement.querySelector('[data-movies]');

movies.forEach(() => render(moviesElement, getMovieTemplate()));

const topRatedElement = mainElement.querySelector('[data-top-rated]');

movies.slice(0, MoviesCount.COMMENTED)
  .forEach(() => render(topRatedElement, getMovieTemplate()));

const mostCommentedElement = mainElement.querySelector('[data-commented]');

movies.slice(0, MoviesCount.COMMENTED)
  .forEach(() => render(mostCommentedElement, getMovieTemplate()));
