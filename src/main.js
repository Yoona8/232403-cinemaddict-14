import UserView from './views/user';
import MoviesTotalView from './views/movies-total';
import StatsView from './views/stats';
import MoviesPresenter from './presenters/movies';
import MenuPresenter from './presenters/menu';
import MoviesModel from './models/movies';
import UserModel from './models/user';
import CommentsModel from './models/comments';
import FilterModel from './models/filter';
import Api from './api';
import {getComments} from './mocks/comments';
import {render} from './helpers/render';
import {MenuItem} from './helpers/consts';
import {getUser} from './mocks/user';

const COMMENTS_COUNT = 10;
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic fkajfd894830fkldsa';

const comments = getComments(COMMENTS_COUNT);
const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();
const userModel = new UserModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const mainElement = document.querySelector('.main');

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    userModel.setUser(getUser(moviesModel.getMovies()));
    render(document.querySelector('.header'), new UserView(userModel.getUser()));
    new MenuPresenter(mainElement, filterModel, userModel, menuClickHandler).init();
    moviesPresenter.init();
    render(
      document.querySelector('.footer__statistics'),
      new MoviesTotalView(moviesModel.getMovies().length),
    );
  });

commentsModel.setComments(comments);

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

