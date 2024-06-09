import Controller from './controller';
import map from '../boundary/map';
import boundaryBrowse from '../boundary/boundaryBrowse';
import boundaryDialog from '../boundary/boundaryDialog';
import {
  filterRoutes,
  addFavRoute,
  findRouteByID,
  addReview,
  state,
  updateState,
} from '../Entity/app';

class ControllerBrowse extends Controller {
  constructor() {
    super();
    map.init();
    this._init();
  }

  _init() {
    boundaryBrowse.addHandlerSubmitSearch(this._handleSubmitSearch);
    boundaryBrowse.addHandlerSelectRoute(this._controlSelectRoute);

    this._initDialog();
    if (state.currentRoute) {
      map._drawRoute(state.currentRoute.waypoints);
      boundaryBrowse.render('Click button to begin');
    }
  }

  _initDialog() {
    boundaryDialog.init();
    boundaryDialog.addHandlerAddNewReview(this._handleAddNewReview);
    boundaryDialog.addHandlerStartRunning();
    boundaryDialog.addHandlerUpdateStars(this._handleUpdateStars);
  }

  _handleAddNewReview(numStars, comment) {
    const id = state.currentRoute.id;
    addReview(numStars, comment, id);
    updateState(null);
    window.location.reload();
  }

  _handleUpdateStars(numStars) {
    boundaryDialog.updateStars(numStars);
  }

  _controlSelectRoute = function (mode, id) {
    const routeFounded = findRouteByID(id);

    if (!routeFounded) {
      console.log('no route founded');
      return;
    }

    if (mode === 'fav') {
      addFavRoute(routeFounded);
      return;
    }

    map._drawRoute(routeFounded.waypoints);
    updateState(routeFounded);
  };

  _handleSubmitSearch([lat, lng], minRatings, distance, terrain) {
    // pretend this function checks for nearby routes
    map._addMarker([lat, lng]);
    const filteredRoutes = filterRoutes(minRatings, distance, terrain);
    if (!filteredRoutes) return;
    boundaryBrowse.render(filteredRoutes);
  }
}

export default new ControllerBrowse();
