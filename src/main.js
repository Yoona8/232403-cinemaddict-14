import {getUserTemplate} from './views/user-view';

const RenderPosition = {
  BEFORE_END: 'beforeend',
};

const render = (
  container,
  template,
  position = RenderPosition.BEFORE_END,
) => {
  container.insertAdjacentHTML(position, template);
};

const headerElement = document.querySelector('.header');

render(headerElement, getUserTemplate());
