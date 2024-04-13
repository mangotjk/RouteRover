/**
 * Represents a boundary component for rendering data in a web app.
 * @class
 */
export default class Boundary {
   /**
   * Constructs a new Boundary instance.
   * @param {HTMLElement} parentEl - The parent element where the content will be rendered.
   */
  _parentEl;
  _data;
  _errorMsg = 'something went wrong when fetching data';
  _msg = 'Default message';

  /**
   * Renders the data received from an API call.
   * @param {Array} data - The data to be rendered.
   */
  render(data) {
    if (!data) {
      return this.renderError();
    }
    this._data = data;
    if (data.length == 0) return this.renderMsg();
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'beforeend',
      this._generateMarkups(this._data)
    );
  }

  /**
   * Renders a spinner animation while waiting for data.
   */
  renderSpinner() {
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', spinner);
  }

  /**
   * Renders an error message.
   */
  renderError = function () {
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._errorMsg);
  };

  /**
   * Renders a custom message.
   */
  renderMsg = function () {
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._msg);
  };

  /**
   * Clears the content of the parent element.
   */
  _clear() {
    this._parentEl.innerHTML = '';
  }

  /**
   * Generates the HTML markup for the data.
   * @param {Array} data - The data to be rendered.
   * @returns {string} - The generated HTML markup.
   */
  _generateMarkups() {
    return this._data.map(dt => this._generateMarkup(dt)).join('');
  }

  /**
   * Generates the HTML markup for a single data item.
   * @param {Object} data - A single data item.
   * @returns {string} - The generated HTML markup.
   */
  _generateMarkup(data) {
    return `default markup`;
  }
}
