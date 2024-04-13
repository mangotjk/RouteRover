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
    const userID = await loginUser(enteredEmail, enteredPassword);
    const username = enteredEmail.split('@')[0];

    setUserDetails(userID, username);
    window.location.href = './html/home.html';
    try {
    } catch (err) {
      alert('Invalid email or password');
    }
  }
}

export default new ControllerIndex();
