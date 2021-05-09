import MenuView from '../views/menu';
import {render, replace} from '../helpers/render';
import {FilterType, UpdateType} from '../helpers/consts';

export default class Filters {
  constructor(container, filterModel, userModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._userModel = userModel;

    this._menuView = null;

    this._modelChangeHandler = this._modelChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._filterModel.addObserver(this._modelChangeHandler);
    this._userModel.addObserver(this._modelChangeHandler);
  }

  init() {
    const filters = this._getFilters();
    const prevMenuView = this._menuView;

    this._menuView = new MenuView(filters, this._filterModel.getFilter());
    this._menuView.addFilterClickHandler(this._filterChangeHandler);
    this._menuView.addStatsClickHandler(() => {});

    if (prevMenuView === null) {
      render(this._container, this._menuView);
      return;
    }

    if (this._container.contains(prevMenuView.getElement())) {
      replace(this._menuView, prevMenuView);
    }
  }

  _getFilters() {
    const {favorites, watched, watchlist} = this._userModel.getUser();

    return [{
      type: FilterType.WATCHLIST,
      name: 'Watchlist',
      count: watchlist.size,
    }, {
      type: FilterType.WATCHED,
      name: 'History',
      count: watched.size,
    }, {
      type: FilterType.FAVORITES,
      name: 'Favorites',
      count: favorites.size,
    }];
  }

  _modelChangeHandler() {
    this.init();
  }

  _filterChangeHandler(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
