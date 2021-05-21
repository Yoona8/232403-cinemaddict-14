import Subject from '../helpers/subject';

export default class Movies extends Subject {
  constructor(api) {
    super();
    this._movies = [];
    this._api = api;
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType, movies);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, updatedMovie) {
    const index = this._movies
      .findIndex((item) => item.id === updatedMovie.id);

    if (index === -1) {
      return;
    }

    this._movies = [
      ...this._movies.slice(0, index),
      updatedMovie,
      ...this._movies.slice(index + 1),
    ];

    this._api.updateMovie(updatedMovie)
      .then((movie) => this._notify(updateType, movie));
  }

  static adaptToClient(movie) {
    const movieInfo = movie['film_info'];
    const userDetails = movie['user_details'];
    const actors = movieInfo.actors.map((actor) => actor.trim()).join(', ');
    const writers = movieInfo.writers.join(', ');

    const adaptedMovie = Object.assign({}, movieInfo, {
      id: movie.id,
      actors,
      writers,
      originalTitle: movieInfo['alternative_title'],
      age: movieInfo['age_rating'],
      country: movieInfo.release['release_country'],
      rating: movieInfo['total_rating'],
      releaseDate: new Date(movieInfo.release.date),
      duration: movieInfo.runtime,
      genres: movieInfo.genre,
      comments: new Set(movie.comments),
      watchedDate: movie['user_details']['watching_date'],
      isWatched: userDetails['already_watched'],
      isWatchlist: userDetails.watchlist,
      isFavorite: userDetails.favorite,
    });

    delete adaptedMovie['alternative_title'];
    delete adaptedMovie['age_rating'];
    delete adaptedMovie['total_rating'];
    delete adaptedMovie.release;
    delete adaptedMovie.runtime;
    delete adaptedMovie.genre;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const {title, poster, director, description, id} = movie;
    const movieInfo = {
      title,
      poster,
      director,
      description,
      runtime: movie.duration,
      genre: movie.genres,
      writers: movie.writers.split(', '),
      actors: movie.actors.split(', '),
      release: {
        date: movie.releaseDate.toISOString(),
        'release_country': movie.country,
      },
      'alternative_title': movie.originalTitle,
      'total_rating': movie.rating,
      'age_rating': movie.age,
    };
    const userDetails = {
      watchlist: movie.isWatchlist,
      favorite: movie.isFavorite,
      'already_watched': movie.isWatched,
      'watching_date': movie.watchedDate,
    };

    return {
      id,
      comments: [...movie.comments],
      'film_info': movieInfo,
      'user_details': userDetails,
    };
  }
}
