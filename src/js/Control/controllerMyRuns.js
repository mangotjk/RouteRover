import Controller from './controller';
import boundaryMyRuns from '../boundary/boundaryMyRuns';
import boundaryDialog from '../boundary/boundaryDialog';
import {
  getCustomRoutes,
  findRouteByID,
  addFavRoute,
  getUserID,
  retrieveRoutesFromDB,
  addNewReview,
  state,
  updateState,
} from '../Entity/app';

/**
 * Controller class for managing 'My Runs' functionality.
 */
class ControllerMyRuns extends Controller {
  /**
   * Initialize the ControllerMyRuns class.
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
    boundaryMyRuns.addHandlerRenderAvailableRoutes(this._controlRender);
    boundaryMyRuns.addHandlerSelectRoute(this._controlSelectRoute);
    this._initDialog();
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
   * Control rendering available routes.
   * @private
   */
  _controlRender = async function (filter) {
    const userID = getUserID();
    await retrieveRoutesFromDB(userID);
    boundaryMyRuns.render(getCustomRoutes(), filter);
  };

  /**
   * Control selecting a route based on mode and ID.
   * @param {string} mode - The mode of selection.
   * @param {number} id - The ID of the route.
   * @private
   */
  async _controlSelectRoute(mode, id) {
    const routeFounded = findRouteByID(id, false);
    updateState(routeFounded);

    if (mode === 'review') {
      boundaryDialog.startRunning();
      return;
    }

    if (!routeFounded) {
      console.log('no route founded');
      return;
    }

    if (mode === 'fav') {
      await addFavRoute(routeFounded);
      return;
    }
    boundaryMyRuns.renderRoute(routeFounded);
  }
}

export default new ControllerMyRuns();
