import Boundary from './boundary';
import map from './map';
import { addHandlerInputAutoComplete } from '../helper';

/**
 * For handling user inputs and interactions in the Custom tab.
 * 
 * @extends Boundary
 */
class BoundaryCustom extends Boundary {
  /**
   * The parent element containing the custom forms.
   * @type {HTMLElement}
   */
  _parentEl = document.getElementById('custom-forms');

  /**
   * The input element for the start point of the route.
   * @type {HTMLInputElement}
   */
  _startInput = document.getElementById('user-input__start-point');

  /**
   * The input element for the end point of the route.
   * @type {HTMLInputElement}
   */
  _endInput = document.getElementById('user-input__end-point');

  /**
   * The input element for adding a new point to the route.
   * @type {HTMLInputElement}
   */
  _addNewPointInput = document.getElementById('user-input__add-new-point');

  /**
   * The result of the autocomplete operation for the start input.
   */
  _startInputResult;

  /**
   * The result of the autocomplete operation for the end input.
   */
  _endInputResult;

  /**
   * The result of the autocomplete operation for the add new point input.
   */
  _addNewPointResult;

  /**
   * The search button for initiating a route search.
   * @type {HTMLElement}
   */
  _searchBtn = document.getElementById('custom-search-btn');

  /**
   * The button for adding a new point to the route.
   * @type {HTMLElement}
   */
  _addNewPointBtn = document.getElementById('add-new-point-btn');

  /**
   * The button for adding a new route.
   * @type {HTMLElement}
   */
  _addNewRouteBtn = document.getElementById('add-new-route-btn');

  // _favBtn = document.getElementById('custom-fav-btn');

  /**
   * The forms within the boundary.
   * @type {NodeList}
   */
  _forms = document.querySelectorAll('.form');

  /**
   * The custom form element.
   * @type {HTMLElement}
   */
  _formCustom = document.getElementById('form--custom');

  /**
   * The input element for the route name.
   * @type {HTMLInputElement}
   */
  _routeNameInput = document.getElementById('user-input__route-name');

  /**
   * Creates an instance of BoundaryCustom.
   * Initializes the map and sets up autocomplete for input elements.
   */
  constructor() {
    super();
    map.init();
    this._startInputResult = addHandlerInputAutoComplete(this._startInput);
    this._endInputResult = addHandlerInputAutoComplete(this._endInput);
    this._addNewPointResult = addHandlerInputAutoComplete(
      this._addNewPointInput
    );
  }

  /**
   * Adds an event listener to disable default form submission behavior.
   */
  addHandlerDisableFormDefaultSubmit() {
    this._forms.forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
      });
    });
  }

  /**
   * Adds an event handler for adding a new point to the route.
   * @param {Function} handler - The handler function for adding a new point.
   */
  addhandlerAddNewPoint(handler) {
    this._addNewPointBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        if (this._addNewPointResult.getPlace()) {
          const newPoint = this._addNewPointResult.getPlace().geometry.location;

          this._addNewPointInput.value = '';
          handler(newPoint.lat(), newPoint.lng());
          return;
        }
      }.bind(this)
    );
  }

  /**
   * Adds an event handler for adding a new route.
   * @param {Function} handler - The handler function for adding a new route.
   */
  addhandlerAddNewRoute(handler) {
    this._addNewRouteBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        handler();
      }.bind(this)
    );
  }

  /**
   * Adds an event handler for submitting a search.
   * @param {Function} handler - The handler function for submitting a search.
   */
  addHandlerSubmitSearch(handler) {
    this._searchBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();

        try {
          const start = this._startInputResult.getPlace().geometry.location;
          const end = this._endInputResult.getPlace().geometry.location;

          if (!start || !end)
            throw new Error(
              'invalid address. Please use location provided in dropbox'
            );

          map._drawRoute(
            map._translateCoordsToWaypoints(
              [start.lat(), start.lng()],
              [end.lat(), end.lng()]
            )
          );

          handler();
        } catch (err) {
          alert('invalid address. Please use location provided in dropbox');
        }
      }.bind(this)
    );
  }

  /**
   * Shows other forms within the boundary.
   */
  _showOtherForms() {
    const forms = this._parentEl.querySelectorAll('.hidden');
    forms.forEach(form => form.classList.remove('hidden'));
  }

  /**
   * Gets details about the route.
   * @returns {Object} The route details.
   */
  getRouteDetails() {
    return {
      routeName: this._routeNameInput.value,
      terrain: document.querySelector('input[name="terrain"]:checked').value,
    };
  }
}

export default new BoundaryCustom();
