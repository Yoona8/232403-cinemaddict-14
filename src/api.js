const Method = {
  GET: 'GET',
  POST: 'POST',
};

const StatusClass = {
  SUCCESS: 2,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: 'movies'})
      .then(Api._toJSON);
  }

  updateMovie() {}

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api._checkStatus)
      .catch(Api._catchError);
  }

  static _toJSON(response) {
    return response.json();
  }

  static _checkStatus(response) {
    const statusClass = Math.floor(response.status / 100);

    if (statusClass !== StatusClass.SUCCESS) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response;
  }

  static _catchError(error) {
    throw error;
  }
}
