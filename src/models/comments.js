import Subject from '../helpers/subject';
import {showMessage} from '../helpers/message';

export default class Comments extends Subject {
  constructor(api) {
    super();

    this._api = api;
    this._comments = [];
  }

  setComments(updateType, movieId) {
    this._api.getComments(movieId)
      .then((comments) => {
        this._comments = comments;
        this._notify(updateType, this._comments);
      })
      .catch(() => {
        showMessage('Can\'t get comments while offline!');
        this._comments = [];
        this._notify(updateType, this._comments);
      });
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, newComment, movieId) {
    return this._api.addComment(newComment, movieId)
      .then((comments) => {
        this._comments = comments.slice();
        this._notify(updateType, comments);
      });
  }

  deleteComment(updateType, commentId) {
    const index = this._comments
      .findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete the not existing comment');
    }

    return this._api.deleteComment(commentId)
      .then(() => {
        this._comments = [
          ...this._comments.slice(0, index),
          ...this._comments.slice(index + 1),
        ];

        this._notify(updateType, this._comments);
      });
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign({}, comment, {
      message: comment.comment,
      emoji: comment.emotion,
    });

    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign({}, comment, {
      comment: comment.message,
      emotion: comment.emoji,
    });

    delete adaptedComment.message;
    delete adaptedComment.emoji;

    return adaptedComment;
  }
}
