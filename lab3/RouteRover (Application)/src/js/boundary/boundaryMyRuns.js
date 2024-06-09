import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';
import map from '../boundary/map';
import { generateStars } from '../helper';

class BoundaryMyRuns extends Boundary {
  _parentEl = document.getElementById('routes');
  _msg = 'No history route found.  Start running now!';

  constructor() {
    super();
    map.init();
  }

  render(data) {
    if (!data) {
      return this.renderError();
    }
    this._data = data;
    if (data.length == 0) return this.renderMsg();
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'afterBegin',
      this._generateMarkups(this._data)
    );
  }

  addHandlerSelectRoute(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const favButton = e.target.closest('.route__item__addToFav');
      const route = e.target.closest('.route--my-run');
      const routeId = +route?.dataset.id;

      if (favButton) {
        handler('fav', routeId);
        return;
      }

      if (!route) return;
      handler('route', routeId);
    });
  }

  renderRoute(routeFounded) {
    map._drawRoute(routeFounded.waypoints);
  }

  _generateMarkup(data) {
    return `<div class="route route--my-run" data-id=${data.id}>
          <div class="route__header">
            <h4 class="h-4 route__heading">${data.title}</h4>
            <div class="route__header__icons">
              <svg class="route__item__icon route__item__icon--tool">
                <use xlink:href="${icon}#icon-check"></use>
              </svg>
              <svg class="route__item__icon route__item__icon--tool route__item__addToFav">
                <use
                  xlink:href="${icon}#icon-circle-with-plus"
                ></use>
              </svg>
            </div>
          </div>
          <div class="route__comment">
            <div class="route__comment__box">
              <svg class="route__item__icon">
                <use xlink:href="${icon}#icon-profile-male"></use>
              </svg>
              <span class="route__comment__name">Me</span>
              <div class="rating">
                ${generateStars(data.ratings, 'route__item__icon')}
                <span>(${(+data.ratings).toFixed(1)})</span>
              </div>
              <p class="route__comment__text mt-sm">"Great route!"</p>
            </div>
          </div>
          <div class="route__content">
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
                >est.
                <span class="route__item--bold route__item__time">${
                  data.duration
                }</span> mins
              </span>
            </div>
          </div>
        </div>`;
  }
}

export default new BoundaryMyRuns();
