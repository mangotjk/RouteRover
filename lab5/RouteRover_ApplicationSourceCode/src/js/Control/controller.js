import { logout } from '../Entity/app';

/**
 * Controller class for managing application logic.
 * Superclass for other controllers to extend from
 */
export default class Controller {
  constructor() {}

  /**
   * Initializes the controller.
   */
  init = function () {};

  /**
   * Handles the logout functionality.
   */
  _handleLogout() {
    logout();
    location.href = 'index.html';
  }
}
