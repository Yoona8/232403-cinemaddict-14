const SHOW_TIME = 5000;

const messageContainer = document.createElement('div');
messageContainer.classList.add('toast-container');
document.body.append(messageContainer);

const showMessage = (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('toast-item');

  messageContainer.append(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, SHOW_TIME);
};

export {showMessage};
