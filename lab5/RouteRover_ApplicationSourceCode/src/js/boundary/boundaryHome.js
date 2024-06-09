import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';
import trail_routes from 'url:../../img/route/trail_route.jpeg';
import { getRouteImg } from '../http';

/**
 * For handling user inputs and interactions in the Home tab
 * 
 * @extends Boundary
 */
class BoundaryHome extends Boundary {
  /**
   * Creates a BoundaryHome instance
   */
  constructor() {
    super();
    /** @type {HTMLElement} */
    this._parentEl = document.querySelector('.content__routes');
    /** @type {string} */
    this._msg = `<div class="window window--heading">No routes found. Start create route in Custom!</div>`;
    this._errorMsg = `<div class="window window--heading">Unable to load routes. Please refresh this page or try again later.</div>`;
  }

  /**
   * Render the routes based on the provided data.
   * @param {Array} data - The data to render.
   */
  async render(data) {
    if (!data) {
      return this.renderError();
    }
    this._data = data;
    if (data.length == 0) return this.renderMsg();
    this._clear();
    this.renderSpinner();
    // await new Promise(resolve => setTimeout(resolve, 2000));
    let imgUrls;
    try {
      imgUrls = await Promise.all(
        this._data.map(route =>
          getRouteImg(route.reviews[0] ? route.reviews[0].imgUrl : null)
        )
      );
    } catch (err) {
      console.error('cannot load images');
    }
    if (imgUrls) {
      this._data.forEach((route, i) => {
        route.imgUrl = imgUrls[i];
      });
    }
    this._clear();
    this._parentEl.insertAdjacentHTML('beforeEnd', this._generateMarkups());
  }

  /**
   * Renders the username in the welcome message.
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
              src="${data.imgUrl || trail_routes}"
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
