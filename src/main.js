import {getUserTemplate} from './views/user-view';
import {getMenuTemplate} from './views/menu-view';
import {getSortingTemplate} from './views/sorting-view';

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

const mainElement = document.querySelector('.main');

render(mainElement, getMenuTemplate());
render(mainElement, getSortingTemplate());
