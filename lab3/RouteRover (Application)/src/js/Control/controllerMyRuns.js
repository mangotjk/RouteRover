import Controller from './controller';
import boundaryMyRuns from '../boundary/boundaryMyRuns';
import { customRoutes, findRouteByID, addFavRoute } from '../Entity/app';

class ControllerMyRuns extends Controller {
  constructor() {
    super();
    this._init();
    boundaryMyRuns.addHandlerSelectRoute(this._controlSelectRoute);
  }

  _init() {
    boundaryMyRuns.render(customRoutes);
  }

  _controlSelectRoute(mode, id) {
    const routeFounded = findRouteByID(id);

    if (!routeFounded) {
      console.log('no route founded');
      return;
    }

    if (mode === 'fav') {
      addFavRoute(routeFounded);
      return;
    }

    boundaryMyRuns.renderRoute(routeFounded);
  }
}

export default new ControllerMyRuns();
