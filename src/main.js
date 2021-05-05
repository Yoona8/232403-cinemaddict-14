import UserView from './views/user';
import MoviesTotalView from './views/movies-total';
import MoviesPresenter from './presenters/movies';
import FiltersPresenter from './presenters/filters';
import MoviesModel from './models/movies';
import UserModel from './models/user';
import CommentsModel from './models/comments';
import FilterModel from './models/filter';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';
import {render} from './helpers/render';

const MOVIES_COUNT = 17;
const COMMENTS_COUNT = 10;

const comments = getComments(COMMENTS_COUNT);
const movies = getMovies(MOVIES_COUNT, comments);
const user = getUser(movies);
const moviesModel = new MoviesModel();
const userModel = new UserModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

moviesModel.setMovies(movies);
userModel.setUser(user);
commentsModel.setComments(comments);

render(document.querySelector('.header'), new UserView(userModel.getUser()));

const mainElement = document.querySelector('.main');

new FiltersPresenter(mainElement, filterModel, userModel).init();
new MoviesPresenter(mainElement, moviesModel, commentsModel, userModel).init();

render(
  document.querySelector('.footer__statistics'),
  new MoviesTotalView(movies.length),
);

