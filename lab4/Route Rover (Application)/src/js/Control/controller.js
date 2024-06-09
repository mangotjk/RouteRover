import { logout } from '../Entity/app';
/**
 * Controller class for managing application logic.
 */
export default class Controller {
  constructor() {}

  init = function () {};

  _handleLogout() {
    logout();
    location.href = 'index.html';
  }
}
