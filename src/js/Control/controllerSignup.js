import Controller from './controller';
import boundarySignup from '../boundary/boundarySignup';
import { signupUser } from '../http';
import { setUserDetails } from '../Entity/app';

/**
 * Controller class for managing the index page.
 */
class ControllerSignup extends Controller {
  /**
   * Initialize the ControllerIndex class.
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
   * Handle the login process.
   * @param {string} enteredEmail - The entered email for login.
   * @param {string} enteredPassword - The entered password for login.
   * @private
   */
  async _handleSignup(enteredEmail, enteredPassword) {
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
