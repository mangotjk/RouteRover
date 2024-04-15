import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';
import map from '../boundary/map';
import { formatDuration, generateStars } from '../helper';
import { getRouteImg } from '../http';
import trail_routes from 'url:../../img/route/trail_route.jpeg';

/**
 * Class representing a boundary for the "My Runs" page.
 * @extends Boundary
 */
class BoundaryMyRuns extends Boundary {
  /** @type {HTMLElement} */
  _parentEl = document.getElementById('routes');
  /** @type {string} */
  _msg =
    '<div class="window window--heading">No history route found.  Start running now!</div>';

  /**
   * Create a BoundaryMyRuns.
   */
  constructor() {
    super();
    map.init();
  }

  /**
   * Render the routes based on the provided data.
   * @param {Array} data - The data to render.
   */
  async render(data, filter, userName) {
    if (!data) {
      return this.renderError();
    }

    this.renderSpinner();
    // await new Promise(resolve => setTimeout(resolve, 2000));

    switch (filter) {
      case 'all':
        this._data = data;
        break;
      case 'reviewed':
        this._data = data.filter(route => route.reviewed === true);
        break;
      case 'unreviewed':
        this._data = data.filter(route => route.reviewed !== true);
        break;
      case 'favourited':
        this._data = data.filter(route => route.fav === true);
        break;
      case 'created':
        this._data = data.filter(route => route.creator === userName);
        break;
      default:
        this._data = data;
    }
    // console.log(this._data.length + ' routes displayed');

    if (this._data.length == 0) return this.renderMsg();
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'afterBegin',
      await this._generateMarkups(this._data)
    );
  }

  async _generateMarkups() {
    let content = ``;
    for (const route of this._data) {
      content += await this._generateMarkup(route);
    }
    return content;
  }

  /**
   * Add a handler to render available routes.
   * @param {function} handler - The handler function to be called.
   */
  addHandlerRenderAvailableRoutes(handler) {
    window.onload = handler('all');
    document
      .getElementById('myruns-filter')
      .addEventListener('change', function (e) {
        window.onload = handler(e.target.value);
      });
  }

  /**
   * Add a handler to select a route.
   * @param {function} handler - The handler function to be called.
   */
  addHandlerSelectRoute(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const favButton = e.target.closest('.route__item__addToFav');
      const reviewBtn = e.target.closest('.btn--review');
      const route = e.target.closest('.route--my-run');
      const routeId = +route?.dataset.id;

      if (favButton) {
        handler('fav', routeId);
        return;
      }

      if (reviewBtn) {
        handler('review', routeId);
        return;
      }

      if (!route) return;
      handler('route', routeId);
    });
  }

  /**
   * Render a specific route.
   * @param {object} routeFounded - The route data to render.
   */
  renderRoute(routeFounded) {
    map._drawRoute(routeFounded.waypoints);
  }

  /**
   * Generate the markup for a route.
   * @param {object} data - The data of the route.
   * @returns {string} - The HTML markup for the route.
   */
  async _generateMarkup(data) {
    let reviewInterface;

    if (data.reviewed) {
      const imgUrls = await Promise.all(
        data.reviews.map(rev => getRouteImg(rev.imgUrl))
      );
      data.reviews.forEach((rev, i) => {
        rev.imgUrl = imgUrls[i];
      });

      reviewInterface = data.reviews
        .map(
          review => `
      <div class="route__comment__box">
      <div class="comment__header">
        <img
          src="${review.imgUrl || trail_routes}"
          alt="route thumbnail image"
          class="route__img route__img--small"
        />
        <p>
          <svg class="route__item__icon">
            <use xlink:href="${icon}#icon-profile-male"></use>
          </svg>
          <span class="route__comment__name">${
            review.username || 'Anonymous'
          }</span>
        </p>
    </div>
        <div class="rating">
          ${generateStars(review.rating, 'route__item__icon')}
          <span>(${(+review.rating).toFixed(1)})</span>
        </div>
        <p class="route__comment__text mt-sm">"${review.comment}"</p>
      </div>
      `
        )
        .join('');
    } else {
      reviewInterface = `
            <button class="btn btn--secondary btn--small .route--my-run btn--review">Review Route</button>
          `;
    }
    return `<div class="route route--my-run window " data-id=${data.id}>
          <div class="route__header">
            <h4 class="h-4 route__heading">${
              data.title
            }<span class="text-sm"> (${data.creator || 'Anonymous'})</span></h4>
            <div class="route__header__icons">
              <svg class="route__item__icon route__item__icon--tool ${
                data.fav ? `route__item__icon--blue` : ''
              }">
                <use xlink:href="${icon}#icon-check"></use>
              </svg>
              <svg class="route__item__icon route__item__icon--tool route__item__addToFav">
                <use
                  xlink:href="${icon}#icon-circle-with-plus"
                ></use>
              </svg>
            </div>
          </div>
            <div class="rating">
              ${generateStars(data.ratings, 'route__item__icon')}
            <span>(${data.ratings.toFixed(1)})</span>
          </div>
          <div class="route__comment">
          ${reviewInterface}
          </div>
          
          ${
            data.reviewed
              ? `<ul class="route__leaderboard show">
          <p class="route__leaderboard__header">Leaderboard</p>
          ${data.leaderboard
            .slice(0, 3)
            .map((leader, index) => {
              return `<li class="route__leaderboard__list"><span>${leader.username}</span><span>${leader.duration}</span></li>`;
            })
            .join('')}
          </ul>`
              : ''
          }

          <div class="route__content">
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
                <span class="route__item--bold route__item__time">
                ${data.duration}</span>mins
              </span>
            </div>
          </div>
        </div>`;
  }
}

export default new BoundaryMyRuns();
