import {getElementFromTemplate} from '../helpers/render';

const getUserTemplate = (user) => {
  const {
    name = 'Unknown',
    rank = null,
    avatar = 'bitmap@2x.png',
  } = user;

  const rankOutput = rank || '';

  return `
    <section class="header__profile profile">
      <p class="profile__rating">${rankOutput}</p>
      <img
        class="profile__avatar"
        src="images/${avatar}"
        alt="${name}"
        width="35" height="35"
      >
    </section>
  `.trim();
};

export default class User {
  constructor(user = {}) {
    this._user = user;
    this._element = null;
  }

  _getTemplate() {
    return getUserTemplate(this._user);
  }

  getElement() {
    if (!this._element) {
      this._element = getElementFromTemplate(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
