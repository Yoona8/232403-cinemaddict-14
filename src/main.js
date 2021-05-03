import UserView from './views/user';
import MenuView from './views/menu';
import MoviesTotalView from './views/movies-total';
import MoviesPresenter from './presenters/movies';
import MoviesModel from './models/movies';
import UserModel from './models/user';
import CommentsModel from './models/comments';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';
import {getFilters} from './mocks/filters';
import {render} from './helpers/render';

const MOVIES_COUNT = 17;
const COMMENTS_COUNT = 10;

const comments = getComments(COMMENTS_COUNT);
const movies = getMovies(MOVIES_COUNT, comments);
const user = getUser(movies);
const filters = getFilters(movies, user);
const moviesModel = new MoviesModel();
const userModel = new UserModel();
const commentsModel = new CommentsModel();

moviesModel.setMovies(movies);
userModel.setUser(user);
commentsModel.setComments(comments);

render(document.querySelector('.header'), new UserView(userModel.getUser()));

const mainElement = document.querySelector('.main');

render(mainElement, new MenuView(filters));

new MoviesPresenter(mainElement, moviesModel, commentsModel, userModel).init();

render(
  document.querySelector('.footer__statistics'),
  new MoviesTotalView(movies.length),
);

