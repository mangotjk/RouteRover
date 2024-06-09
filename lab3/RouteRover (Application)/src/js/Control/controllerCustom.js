import Controller from './controller';
import boundaryCustom from '../boundary/boundaryCustom';
import boundaryDialog from '../boundary/boundaryDialog';
import map from '../boundary/map';

import { addCustomRoute } from '../Entity/app';

class ControllerCustom extends Controller {
  constructor() {
    super();
    this._init();
  }

  _init() {
    boundaryCustom.addHandlerDisableFormDefaultSubmit();
    boundaryCustom.addHandlerSubmitSearch(this._handleSubmitSearch);

    boundaryDialog.init();
    boundaryDialog.addHandlerAddNewReview(this._handleAddNewRoute);
    boundaryDialog.addHandlerStartRunning();
    boundaryDialog.addHandlerUpdateStars(this._handleUpdateStars);
  }

  _handleSubmitSearch() {}

  _handleAddNewRoute(rating, comment) {
    const routeObj = map.getRouteObject();
    const [routeName, terrain] = boundaryCustom.getRouteDetails();
    routeObj.reviews = [{ rating, comment }];
    routeObj.ratings = rating;
    routeObj.title = routeName;
    routeObj.terrain = terrain;
    addCustomRoute(routeObj);
  }

  _handleUpdateStars(numStars) {
    boundaryDialog.updateStars(numStars);
  }
}

export default new ControllerCustom();
