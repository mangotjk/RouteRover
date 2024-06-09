import Controller from './controller';
import map from '../boundary/map';
import boundaryBrowse from '../boundary/boundaryBrowse';
import boundaryDialog from '../boundary/boundaryDialog';
import {
  filterRoutes,
  addFavRoute,
  findRouteByID,
  addNewReview,
  state,
  getCurrentRoute,
  updateState,
  retrieveRoutesFromDB,
  clearCurrentRoute,
  getUserID,
  addRouteToDB,
  getAllRoutes,
  locations,
} from '../Entity/app';

/**
 * Controller class for managing browsing routes in the Browse tab
 * 
 * @extends Controller
 */
class ControllerBrowse extends Controller {
  /**
   * Initialize the ControllerBrowse class.
   */
  constructor() {
    map.init();
    super();
    this._init();
  }

  /**
   * Initialize the controller.
   * @private
   */
  _init() {
    try {
      getUserID();
    } catch (err) {
      window.alert('Please Log In!');
      location.href = 'index.html';
    }
    boundaryBrowse.addHandlerLogout(this._handleLogout);
    this._initDialog();
    if (state.currentRoute) {
      const stateRoute = state.currentRoute;
      map._drawRoute(state.currentRoute.waypoints);
      boundaryBrowse.render(stateRoute, true);
      if (stateRoute) {
        boundaryBrowse.addHandlerCancelRoute(this._handleCancelRoute);
        boundaryBrowse.addHandlerSelectRoute(this._controlSelectRoute);
      }
      return;
    }

    boundaryBrowse.renderAvailableLocations(locations);
    boundaryBrowse.addHandlerSelectLocation(this._handleSelectLocation);
    boundaryBrowse.addHandlerSubmitSearch(this._handleSubmitSearch);
    boundaryBrowse.addHandlerSelectRoute(this._controlSelectRoute);
    boundaryBrowse.addHandlerLoadAllRoutes(this._handleLoadAllRoutes);
  }

  /**
   * Initialize the dialog.
   * @private
   */
  _initDialog() {
    boundaryDialog.init();
    boundaryDialog.addHandlerAddNewReview(this._handleAddNewReview);
    boundaryDialog.addHandlerUpdateStars(this._handleUpdateStars);
    boundaryDialog.addHandlerUploadImage();
    boundaryDialog.addHandlerCloseDialog();
  }

  /**
   * Handles the selection of a location.
   *
   * @param {number} lat - The latitude of the selected location.
   * @param {number} lng - The longitude of the selected location.
   */
  _handleSelectLocation(lat, lng) {
    console.log('handle select location');
    map.addMarker(lat, lng);
  }

  /**
   * Handles the loading of all routes from the database.
   * @returns {Promise<void>} A promise that resolves when the routes are retrieved from the database.
   */
  async _handleLoadAllRoutes() {
    await retrieveRoutesFromDB();
  }

  /**
   * Handle canceling the route.
   * @private
   */
  _handleCancelRoute() {
    clearCurrentRoute();
    window.location.reload();
  }

  /**
   * Handle adding a new review.
   * @param {number} numStars - The number of stars for the review.
   * @param {string} comment - The comment for the review.
   * @private
   */

  async _handleAddNewReview(numStars, comment, duration, img) {
    if (numStars === 0) {
      alert('Invalid input. Please rate the route.');
      return;
    }
    if (duration === '00:00:00') {
      alert('Invalid input. Please enter a valid duration.');
      return;
    }

    try {
      await addNewReview(numStars, comment, duration, img, false);
    } catch (err) {
      alert('Error adding review. Please try again later.');
    }
    boundaryDialog.hideDialog();
    updateState(null);
    window.location.reload();
  }

  /**
   * Handle updating stars in the dialog.
   * @param {number} numStars - The number of stars to update to.
   * @private
   */
  _handleUpdateStars(numStars) {
    boundaryDialog.updateStars(numStars);
  }

  /**
   * Control selecting a route based on mode and ID.
   * @param {string} mode - The mode of selection.
   * @param {number} id - The ID of the route.
   * @private
   */
  async _controlSelectRoute(mode, id) {
    const userID = getUserID();

    if (mode === 'start') {
      boundaryDialog.startRunning();
      return;
    }

    const currentRoute = getCurrentRoute();

    if (mode === 'add') {
      await addRouteToDB(currentRoute, userID);
      window.location.href = 'myRuns.html';
      return;
    }

    const routeFounded = findRouteByID(id);
    if (mode === 'fav') {
      addFavRoute(routeFounded);

      return;
    }

    if (!routeFounded) {
      console.log('no route founded');
      return;
    }

    map._drawRoute(routeFounded.waypoints);
    updateState(routeFounded);
  }

  /**
   * Handle submitting a search for routes.
   * @param {Array} coords - The coordinates for the search.
   * @param {number} minRatings - The minimum ratings for the search.
   * @param {number} distance - The distance for the search.
   * @param {string} terrain - The terrain for the search.
   * @private
   */
  async _handleSubmitSearch([lat, lng], minRatings, distance, terrain) {
    // boundaryBrowse.renderSpinner();
    await retrieveRoutesFromDB();
    // pretend this function checks for nearby routes
    // map._addMarker([lat, lng]);
    const filteredRoutes = await filterRoutes(minRatings, distance, terrain, [
      lat,
      lng,
    ]);
    if (!filteredRoutes) {
      console.error('not routes filtered');
      return;
    }
    await boundaryBrowse.render(filteredRoutes);
  }
}

export default new ControllerBrowse();
