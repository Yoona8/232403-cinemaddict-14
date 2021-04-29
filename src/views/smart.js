import Abstract from './abstract';
import {replace} from '../helpers/render';

export default class Smart extends Abstract {
  constructor() {
    if (new.target === Smart) {
      throw new Error('Can\'t make an instance of a Smart class');
    }

    super();

    this._state = {};
  }

  _updateState(updatedState, requiresRerender = true) {
    if (!updatedState) {
      return;
    }

    this._state = Object.assign({}, this._state, updatedState);

    if (requiresRerender) {
      this._updateElement();
    }
  }

  _updateElement() {
    const oldElement = this.getElement();

    this._element = null;

    const newElement = this.getElement();

    replace(newElement, oldElement);
    this._restoreHandlers();
  }

  _restoreHandlers() {
    throw new Error('Smart method is not implemented: _restoreHandlers');
  }
}
