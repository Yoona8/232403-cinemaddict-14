import AbstractView from '../views/abstract';

const RenderPosition = {
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const render = (container, element, position) => {
  container = container instanceof AbstractView
    ? container.getElement()
    : container;
  element = element instanceof AbstractView ? element.getElement() : element;

  switch (position) {
    case RenderPosition.AFTER_END:
      container.after(element);
      break;
    case RenderPosition.BEFORE_END:
    default:
      container.append(element);
  }
};

const getElementFromTemplate = (template) => {
  const element = document.createElement('div');

  element.innerHTML = template;

  return element.firstElementChild;
};

export {render, RenderPosition, getElementFromTemplate};
