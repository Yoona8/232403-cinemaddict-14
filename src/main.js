import UserView from './views/user';
import MenuView from './views/menu';
import MoviesTotalView from './views/movies-total';
import MoviesPresenter from './presenters/movies';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';
import {getFilters} from './mocks/filters';
import {render} from './helpers/render';

const MOVIES_COUNT = 20;
const COMMENTS_COUNT = 10;

const comments = getComments(COMMENTS_COUNT);
const movies = getMovies(MOVIES_COUNT, comments);
const user = getUser(movies);
const filters = getFilters(movies, user);

render(document.querySelector('.header'), new UserView(user));

const mainElement = document.querySelector('.main');

render(mainElement, new MenuView(filters));

new MoviesPresenter(mainElement).init(movies, user, comments);

render(
  document.querySelector('.footer__statistics'),
  new MoviesTotalView(movies.length),
);

