import Controller from './controller';
import boundaryCustom from '../boundary/boundaryCustom';
import boundaryDialog from '../boundary/boundaryDialog';
import map from '../boundary/map';

import { addRouteToDB, getUserName, getUserID } from '../Entity/app';
import { checkExistingRouteName } from '../http';

/**
 * Controller class for managing custom route creation.
 */
class ControllerCustom extends Controller {
  /**
   * Initialize the ControllerCustom class.
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
    boundaryCustom.addHandlerDisableFormDefaultSubmit();
    boundaryCustom.addHandlerSubmitSearch(this._handleSubmitSearch);
    boundaryCustom.addhandlerAddNewPoint(this._handleAddNewPoint);
    boundaryCustom.addhandlerAddNewRoute(this._handleAddNewRoute);
    boundaryDialog.addHandlerUpdateStars(this._handleUpdateStars);
  }

  /**
   * Handle form submission for search.
   * @private
   */
  _handleSubmitSearch() {
    boundaryCustom._showOtherForms();
  }

  /**
   * Handle adding a new point to the map.
   * @param {number} lat - The latitude of the new point.
   * @param {number} lng - The longitude of the new point.
   * @private
   */
  _handleAddNewPoint(lat, lng) {
    map.addNewPoint(lat, lng);
  }

  /**
   * Handle adding a new route.
   * @private
   */
  async _handleAddNewRoute() {
    const routeObj = map.getRouteObject();
    const { routeName, terrain } = boundaryCustom.getRouteDetails();
    if (routeName.trim() === '') {
      alert('Please enter a name for the route');
      return;
    }
    
    if (await checkExistingRouteName(routeName.trim(), getUserName())) {
      alert('You already have another route with the same name!\nPlease enter another name for the new route');
      return;
    }
    routeObj.reviews = [];
    routeObj.leaderboard = [];
    routeObj.ratings = 0;
    routeObj.title = routeName;
    routeObj.terrain = terrain;
    routeObj.creator = getUserName();

    const userID = getUserID();
    await addRouteToDB(routeObj, userID);
    await addRouteToDB(routeObj);
    window.location.href = 'myRuns.html';
  }

  /**
   * Handle updating stars in the dialog.
   * @param {number} numStars - The number of stars to update to.
   * @private
   */
  _handleUpdateStars(numStars) {
    boundaryDialog.updateStars(numStars);
  }
}

export default new ControllerCustom();
