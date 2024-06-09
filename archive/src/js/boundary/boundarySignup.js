import Boundary from './boundary';

/**
 * Class representing a boundary for the index page.
 * @extends Boundary
 */
class BoundarySignup extends Boundary {
  /**
   * Create a BoundaryIndex.
   */
  constructor() {
    super();
    /** @type {HTMLElement} */
    this._parentEl = document.querySelector('.login');
    /** @type {HTMLButtonElement} */
    this._signupBtn = document.getElementById('signupBtn');
    /** @type {string} */
    this._msg =
      'You have no favourite routes yet. Click "Custom" to create a new route.';
  }

  /**
   * Add a handler to focus on input elements.
   */
  addHandlerFocus() {
    this._parentEl.addEventListener('input', function (e) {
      const inputEl = e.target;
      if (inputEl.classList.contains('login__input')) {
        const labelEl = inputEl.previousElementSibling;
        if (inputEl.value === '') {
          labelEl.classList.remove('active');
        } else {
          labelEl.classList.add('active');
        }
      }
    });
  }

  /**
   * Add a handler to handle the login process.
   * @param {function} handler - The handler function to be called on login.
   */
  addHandlerSignup(handler) {
    this._signupBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const enteredEmail = document.getElementById('email').value;
      const enteredPassword = document.getElementById('password').value;
      handler(enteredEmail, enteredPassword);
    });
  }
}

export default new BoundarySignup();
