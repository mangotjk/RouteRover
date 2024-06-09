import Boundary from './boundary';
import map from './map';
import { addHandlerInputAutoComplete } from '../helper';

class BoundaryCustom extends Boundary {
  // _parentEl = document;
  _startInput = document.getElementById('user-input__start-point');
  _endInput = document.getElementById('user-input__end-point');
  _startInputResult;
  _endInputResult;
  _searchBtn = document.getElementById('custom-search-btn');

  // _favBtn = document.getElementById('custom-fav-btn');
  _form = document.getElementById('form');
  _formCustom = document.getElementById('form--custom');

  _routeNameInput = document.getElementById('user-input__route-name');

  constructor() {
    super();
    map.init();
    this._startInputResult = addHandlerInputAutoComplete(this._startInput);
    this._endInputResult = addHandlerInputAutoComplete(this._endInput);
  }

  addHandlerDisableFormDefaultSubmit() {
    this._form.addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }

  addHandlerSubmitSearch(handler) {
    this._searchBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        if (
          this._startInputResult.getPlace() &&
          this._endInputResult.getPlace()
        ) {
          const start = this._startInputResult.getPlace().geometry.location;
          const end = this._endInputResult.getPlace().geometry.location;

          map._drawRoute(
            map._translateCoordsToWaypoints(
              [start.lat(), start.lng()],
              [end.lat(), end.lng()]
            )
          );

          this._formCustom.classList.remove('hidden');
        }
      }.bind(this)
    );
  }

  getRouteDetails() {
    return [
      this._routeNameInput.value,
      document.querySelector('input[name="terrain"]:checked').value,
    ];
  }
}

export default new BoundaryCustom();
