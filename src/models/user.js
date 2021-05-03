import Subject from '../helpers/subject';

export default class User extends Subject {
  constructor() {
    super();

    this._user = null;
  }

  setUser(user) {
    this._user = Object.assign({}, user);
  }

  getUser() {
    return this._user;
  }

  updateUser(updateType, updatedUser) {
    this._user = Object.assign({}, updatedUser);
    this._notify(updateType, this._user);
  }
}
