import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';
import dummyImg from 'url:../../img/customers/customer-1.jpg';

class BoundaryHome extends Boundary {
  _parentEl = document.querySelector('.content__routes');
  _msg =
    'You have no favourite routes yet. Click "Custom" to create a new route.';

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

  addHandlerSelectRoute(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const routeEl = e.target.closest('.route');
      if (!routeEl) return;
      const id = +routeEl.dataset.id;
      handler(id);
    });
  }

  _generateMarkup(data) {
    return `<div class="route" data-id=${data.id}>
          <div class="route__header">
            <img
              src="${dummyImg}"
              alt="route thumbnail image"
              class="route__img"
            />
            <h4 class="h-4 route__heading">${data.title}</h4>
          </div>
          <div class="route__content">
            <div class="route__item__wrapper">
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
                  <span class="route__item--bold route__item__time">${data.duration}</span>
                  mins
                </span>
              </div>
            </div>
          </div>
        </div>`;
  }
}

export default new BoundaryHome();
