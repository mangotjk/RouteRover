import Boundary from './boundary';
import { loginUser, signupUser } from '../http';

/**
 * For handling user inputs and interactions in the index (login) page
 * 
 * @extends Boundary
 */
class BoundaryIndex extends Boundary {
  /**
   * Creates a BoundaryIndex instance.
   */
  constructor() {
    super();
    /** @type {HTMLElement} */
    this._parentEl = document.querySelector('.login');
    /** @type {HTMLButtonElement} */
    this._loginBtn = document.getElementById('loginBtn');
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
  addHandlerLogin(handler) {
    this._loginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const enteredEmail = document.getElementById('email').value;
      const enteredPassword = document.getElementById('password').value;
      handler(enteredEmail, enteredPassword);
    });
  }
}

export default new BoundaryIndex();
