import SortingView from '../views/sorting';
import {render} from '../helpers/render';

export default class Movies {
  constructor(container) {
    this._container = container;
    this._sortingView = new SortingView();
  }

  _renderSorting() {
    render(this._container, this._sortingView);
  }

  init(movies) {
    this._movies = movies;
    this._renderSorting();
  }
}
