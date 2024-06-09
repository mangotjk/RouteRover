import Boundary from './boundary';

/**
 * For handling user inputs and interactions in the sign up page
 * 
 * @extends Boundary
 */
class BoundarySignup extends Boundary {
  /**
   * Creates a BoundarySignup instance
   */
  constructor() {
    super();
    /** @type {HTMLElement} */
    this._parentEl = document.querySelector('.login');
    /**
     * @type {HTMLButtonElement} signup button
     */
    this._signupBtn = document.getElementById('signupBtn');
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
   * Add a handler to handle the sign up process.
   * @param {function} handler - The handler function to be called on sign up.
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
