import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';
import urbanImg from 'url:../../img/route/urban_route.jpeg';
import trailImg from 'url:../../img/route/trail_route.jpeg';

/**
 * Class representing a boundary for home routes.
 * @extends Boundary
 */
class BoundaryHome extends Boundary {
  /**
   * Create a BoundaryHome.
   */
  constructor() {
    super();
    /** @type {HTMLElement} */
    this._parentEl = document.querySelector('.content__routes');
    /** @type {string} */
    this._msg =
      'You have no favourite routes yet. Click "Custom" to create a new route.';
  }

  /**
   * Render the routes based on the provided data.
   * @param {Array} data - The data to render.
   */
  render(data) {
    if (!data) {
      return this.renderError();
    }
    this._data = data;
    if (data.length == 0) return this.renderMsg();
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'beforeEnd',
      this._generateMarkups(this._data)
    );
  }

  /**
   * Render the username in the UI.
   * @param {string} username - The username to render.
   */
  renderName(username) {
    document.getElementById('user-name').innerHTML = username;
  }

  /**
   * Add a handler to render available routes when the window loads.
   * @param {function} handler - The handler function.
   */
  // render all routes in db, need to change later
  addHandlerRenderAvailableRoutes(handler) {
    window.onload = handler;
  }

  /**
   * Add a handler to select a route when clicked.
   * @param {function} handler - The handler function.
   */
  addHandlerSelectRoute(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const routeEl = e.target.closest('.route');
      if (!routeEl) return;
      const id = +routeEl.dataset.id;
      handler(id);
    });
  }

  /**
   * Generate the markup for a route item based on the provided data.
   * @param {Object} data - The data for the route item.
   * @returns {string} The generated markup.
   */
  _generateMarkup(data) {
    return `<div class="route window" data-id=${data.id}>
          <div class="route__header">
            <img
              src="${data.terrain === 'Urban' ? urbanImg : trailImg}"
              alt="route thumbnail image"
              class="route__img"
            />
            <div class="route__left">
              <h4 class="h-4 ">${data.title}</h4>
              <p class="text-sm "> (${data.creator || 'Anonymous'})</p>
            </div>
              </div>
          <div class="route__content">
            <div class="route__item__wrapper">
            <div class="route__item">
                <svg class="route__item__icon">
                  <use xlink:href="${icon}#icon-users"></use>
                </svg>
                <span class="route__item__details"
                  ><span class="route__item--bold"
                    >${data.reviews.length}</span
                  >
                  </span
                >
              </div>
              <div class="route__item">
                <svg class="route__item__icon">
                  <use xlink:href="${icon}#icon-flag"></use>
                </svg>
                <span class="route__item__details"
                  ><span class="route__item--bold route__item__distance"
                    >${data.distance}</span
                  >
                  km</span
                >
              </div>
              <div class="route__item">
                <svg class="route__item__icon">
                  <use xlink:href="${icon}#icon-area-graph"></use>
                </svg>
                <span class="route__item__details">
                  <span class="route__item__trail">${data.terrain}</span>
                </span>
              </div>
              <div class="route__item">
                <svg class="route__item__icon">
                  <use xlink:href="${icon}#icon-compass2"></use>
                </svg>
                <span class="route__item__details"
                  >avg
                  <span class="route__item--bold route__item__time">${
                    data.duration
                  }</span>
                  mins
                </span>
              </div>
            </div>
          </div>
        </div>`;
  }
}

export default new BoundaryHome();
