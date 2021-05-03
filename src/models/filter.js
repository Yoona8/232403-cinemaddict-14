import Subject from '../helpers/subject';
import {FilterType} from '../helpers/consts';

export default class Filter extends Subject {
  constructor() {
    super();

    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
