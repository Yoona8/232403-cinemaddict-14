import Subject from '../helpers/subject';

export default class Comments extends Subject {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, newComment) {
    this._comments = [...this._comments, newComment];
    this._notify(updateType, newComment);
  }

  deleteComment(updateType, commentId) {
    const index = this._comments
      .findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete the not existing comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType, this._comments);
  }
}
