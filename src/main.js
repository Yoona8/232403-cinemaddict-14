import UserView from './views/user';
import MoviesTotalView from './views/movies-total';
import StatsView from './views/stats';
import MoviesPresenter from './presenters/movies';
import MenuPresenter from './presenters/menu';
import MoviesModel from './models/movies';
import UserModel from './models/user';
import CommentsModel from './models/comments';
import FilterModel from './models/filter';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';
import {render} from './helpers/render';
import {MenuItem, UpdateType} from './helpers/consts';
import {getUser} from './mocks/user';

const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic fkajfd894830fkldsa';
const STORE_PREFIX = 'movies';
const STORE_VER = 'v1';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiProvider = new Provider(api, store);
const moviesModel = new MoviesModel(apiProvider);
const userModel = new UserModel();
const commentsModel = new CommentsModel(apiProvider);
const filterModel = new FilterModel();
const mainElement = document.querySelector('.main');

const renderTotalCount = () => {
  render(
    document.querySelector('.footer__statistics'),
    new MoviesTotalView(moviesModel.getMovies().length),
  );
};
const renderUser = () => {
  render(document.querySelector('.header'), new UserView(userModel.getUser()));
};
const renderMenu = () => {
  new MenuPresenter(mainElement, filterModel, userModel, menuClickHandler)
    .init();
};

apiProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    userModel.setUser(getUser(moviesModel.getMovies()));
    renderTotalCount();
    renderUser();
    renderMenu();
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    renderTotalCount();
    renderUser();
    renderMenu();
  });

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

moviesPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  apiProvider.sync();
});

