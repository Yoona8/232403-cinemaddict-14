import UserView from './views/user';
import MoviesTotalView from './views/movies-total';
import StatsView from './views/stats';
import MoviesPresenter from './presenters/movies';
import MenuPresenter from './presenters/menu';
import MoviesModel from './models/movies';
import UserModel from './models/user';
import CommentsModel from './models/comments';
import FilterModel from './models/filter';
import {getMovies} from './mocks/movies';
import {getUser} from './mocks/user';
import {getComments} from './mocks/comments';
import {render} from './helpers/render';
import {MenuItem} from './helpers/consts';

const MOVIES_COUNT = 10;
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
const moviesPresenter = new MoviesPresenter(
  mainElement,
  moviesModel,
  commentsModel,
  userModel,
  filterModel,
);

const statsView = new StatsView();

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      statsView.init(userModel.getUser(), moviesModel.getMovies());
      if (!mainElement.contains(statsView.getElement())) {
        render(mainElement, statsView);
      }
      statsView.show();
      moviesPresenter.hide();
      break;
    case MenuItem.MOVIES:
      statsView.hide();
      moviesPresenter.show();
      break;
  }
};

new MenuPresenter(mainElement, filterModel, userModel, menuClickHandler).init();
moviesPresenter.init();

render(
  document.querySelector('.footer__statistics'),
  new MoviesTotalView(movies.length),
);

