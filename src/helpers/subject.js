export default class Subject {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((item) => item !== observer);
  }

  _notify(evt, payload) {
    this._observers.filter((observer) => observer(evt, payload));
  }
}
