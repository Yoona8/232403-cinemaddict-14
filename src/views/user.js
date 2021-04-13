import AbstractView from './abstract';

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

export default class User extends AbstractView {
  constructor(user = {}) {
    super();

    this._user = user;
  }

  _getTemplate() {
    return getUserTemplate(this._user);
  }
}
