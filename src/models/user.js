import Subject from '../helpers/subject';
import {getRank} from '../mocks/user';

export default class User extends Subject {
  constructor() {
    super();

    this._user = {};
  }

  setUser(updateType, user) {
    this._user = Object.assign({}, user);
    this._notify(updateType, this._user);
  }

  getUser() {
    return this._user;
  }

  updateUser(updateType, updatedUser) {
    this._user = Object.assign({}, updatedUser, {
      rank: getRank(updatedUser.watched.size),
    });
    this._notify(updateType, this._user);
  }
}
