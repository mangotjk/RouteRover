import Controller from './controller';
import { favRoutes, updateState } from '../Entity/app';
import boundaryHome from '../boundary/boundaryHome';

class ControllerBrowse extends Controller {
  constructor() {
    super();
    this._init();
  }

  _init() {
    boundaryHome.render(favRoutes);
    boundaryHome.addHandlerSelectRoute(this._controlSelectRoute);
  }

  _controlSelectRoute = function (id) {
    updateState(favRoutes.find(route => route.id === id));
    location.href = 'browse.html';
  };
}

export default new ControllerBrowse();
