import Controller from './controller';
import {
  favRoutes,
  updateState,
  retrieveRoutesFromDB,
  getAllRoutes,
  getUserName,
  getUserID,
} from '../Entity/app';
import { HOME_MAX_ROUTES } from '../config';
import boundaryHome from '../boundary/boundaryHome';
import { updateStats } from '../http';

/**
 * Controller class for managing browsing routes on the home page.
 */
class ControllerBrowse extends Controller {
  /**
   * Initialize the ControllerBrowse class.
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
    boundaryHome.renderName(getUserName());
    updateStats(getUserID());
    boundaryHome.addHandlerRenderAvailableRoutes(this._controlRender);
    // boundaryHome.render(favRoutes);
    boundaryHome.addHandlerSelectRoute(this._controlSelectRoute);
  }

  /**
   * Control the rendering of available routes.
   * @private
   */
  _controlRender = async function () {
    await retrieveRoutesFromDB();
    boundaryHome.render(getAllRoutes(HOME_MAX_ROUTES));
  };

  /**
   * Control the selection of a route.
   * @param {number} id - The ID of the selected route.
   * @private
   */
  _controlSelectRoute = function (id) {
    updateState(getAllRoutes().find(route => route.id === id));
    location.href = 'browse.html';
  };
}

export default new ControllerBrowse();
