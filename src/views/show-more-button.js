import AbstractView from './abstract';

const getShowMoreButtonTemplate = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `.trim();
};

export default class ShowMoreButton extends AbstractView {
  _getTemplate() {
    return getShowMoreButtonTemplate();
  }
}
