import Controller from './controller';
import boundarySignup from '../boundary/boundarySignup';
import { signupUser } from '../http';
import { setUserDetails } from '../Entity/app';

/**
 * Controller class for managing the sign up page.
 * 
 * @extends Controller
 */
class ControllerSignup extends Controller {
  /**
   * Initialize the ControllerSignup class.
   */
  constructor() {
    super();
    this._init();
  }

  /**
   * Initialize the controller.
   * @private
   */
  _init() {
    boundarySignup.addHandlerFocus();
    boundarySignup.addHandlerSignup(this._handleSignup);
  }

  /**
   * Handle the signup process.
   * @param {string} enteredEmail - The entered email for signup.
   * @param {string} enteredPassword - The entered password for signup.
   * @private
   */
  async _handleSignup(enteredEmail, enteredPassword) {
    if (enteredEmail.trim() === '' || enteredPassword.trim() === '') {
      window.alert('Please enter both email and password');
      return;
    }
    try {
      await signupUser(enteredEmail, enteredPassword);
      window.alert('You have successfully signed up');
      window.location.href = '../index.html';
    } catch (err) {
      window.alert('Invalid email or password');
    }
  }
}

export default new ControllerSignup();
