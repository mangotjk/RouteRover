import Controller from './controller';
import boundaryIndex from '../boundary/boundaryIndex';
import { loginUser } from '../http';
import { setUserDetails } from '../Entity/app';

/**
 * Controller class for managing the index page.
 */
class ControllerIndex extends Controller {
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
    boundaryIndex.addHandlerFocus();
    boundaryIndex.addHandlerLogin(this._handleLogin);
  }

  /**
   * Handle the login process.
   * @param {string} enteredEmail - The entered email for login.
   * @param {string} enteredPassword - The entered password for login.
   * @private
   */
  async _handleLogin(enteredEmail, enteredPassword) {
    let userID, username;

    if (enteredEmail.trim() === '' || enteredPassword.trim() === '') {
      window.alert('Please enter both email and password');
      return;
    }

    try {
      userID = await loginUser(enteredEmail, enteredPassword);
      username = enteredEmail.split('@')[0];
    } catch (err) {
      window.alert(err.message);
      return;
    }

    setUserDetails(userID, username);
    window.location.href = '/html/home.html';
  }
}

export default new ControllerIndex();
