/**
 * Superclass for all boundary classes
 * 
 * @class
 */
export default class Boundary {
  /**
   * Constructs a new Boundary instance.
   * @param {HTMLElement} parentEl - The parent element where the content will be rendered.
   */
  
  _parentEl;
  /**
   * data to be rendered
   */
  _data;
  /**
   * error message if fetching data fails
   */
  _errorMsg = 'something went wrong when fetching data';
  /**
   * indicates what message is displayer
   */
  _msg = 'Default message';
  /**
   * spinner to show when data is loading
   */
  _spinner =
    '<div class="custom-loader__container"><div class="custom-loader"></div></div>';

  /**
   * function to add handler for logging out when log out button is clicked
   * 
   * @param {Function} handler - function to log user out 
   */
  addHandlerLogout(handler) {
    document.getElementById('logout').addEventListener('click', handler);
  }

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
    this._parentEl.insertAdjacentHTML('afterbegin', this._spinner);
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
