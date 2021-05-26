import MoviesModel from '../models/movies';
import CommentsModel from '../models/comments';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
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
      .then(Api._toJSON)
      .then((movies) => movies.map(MoviesModel.adaptToClient));
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api._toJSON)
      .then(MoviesModel.adaptToClient);
  }

  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then(Api._toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  addComment(comment, movieId) {
    return this._load({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api._toJSON)
      .then((data) => data.comments.map(CommentsModel.adaptToClient));
  }

  sync(movies) {
    return this._load({
      url: 'movies/sync',
      method: Method.POST,
      body: JSON.stringify(movies),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api._toJSON);
  }

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
