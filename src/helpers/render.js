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

const replace = (newElement, oldElement) => {
  newElement = newElement instanceof AbstractView
    ? newElement.getElement()
    : newElement;

  oldElement = oldElement instanceof AbstractView
    ? oldElement.getElement()
    : oldElement;

  const parentElement = oldElement.parentElement;

  if (parentElement === null || newElement === null) {
    throw new Error('Can\'t replace nullable elements');
  }

  parentElement.replaceChild(newElement, oldElement);
};

const getElementFromTemplate = (template) => {
  const element = document.createElement('div');

  element.innerHTML = template;

  return element.firstElementChild;
};

export {render, RenderPosition, getElementFromTemplate, replace};
