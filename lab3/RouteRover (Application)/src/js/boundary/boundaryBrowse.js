import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';
import { addHandlerInputAutoComplete, generateStars } from '../helper';

class BoundaryBrowse extends Boundary {
  _parentEl = document.querySelector('.content__wrapper');
  _areaInput = document.getElementById('user-input__area');
  _areaInputResult;
  _searchBtn = document.getElementById('browse-search-btn');

  constructor() {
    super();
    this._areaInputResult = addHandlerInputAutoComplete(this._areaInput);
  }

  render(data) {
    if (!data) {
      return this.renderError();
    }
    if (typeof data === 'string') {
      this.changeHeading(data);
      this._clear();
      this._showStartButton();
      return;
    }

    this._data = data;
    if (data.length == 0) return this.renderMsg();
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'beforeend',
      this._generateMarkups(this._data)
    );
  }

  changeHeading(heading) {
    document.querySelector('.content__header__heading').textContent = heading;
  }

  addHandlerSubmitSearch(handler = null) {
    this._searchBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        const place = this._areaInputResult.getPlace().geometry.location;
        const minRatings =
          5 - document.getElementById('user-input__rating').value;
        const distance = +document.getElementById('user-input__distance').value;
        const terrain = document.querySelector(
          'input[name="terrain"]:checked'
        ).value;
        if (handler)
          handler([place.lat(), place.lng()], minRatings, distance, terrain);
        this.changeHeading('Results');
      }.bind(this)
    );
  }

  addHandlerSelectRoute(handler) {
    this._parentEl.addEventListener(
      'click',
      function (e) {
        const favButton = e.target.closest('.route__item__addToFav');
        const route = e.target.closest('.route--browse-result');

        const routeId = +route?.dataset.id;

        if (favButton) {
          handler('fav', routeId);
          return;
        }

        if (!route) return;
        handler('route', routeId);
        this._showStartButton();
      }.bind(this)
    );
  }

  _showStartButton() {
    document.getElementById('start-running-btn').classList.remove('hidden');
  }

  _generateMarkups() {
    return this._data.map(dt => this._generateMarkup(dt)).join('');
  }

  _generateMarkup(data) {
    return `<div class="route route--browse-result" data-id=${data.id}>
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
          <div class="rating">
            ${generateStars(data.ratings, 'route__item__icon')}
            <span>(${data.ratings.toFixed(1)})</span>
          </div>
          <div class="route__comment">
            <div class="route__comment__box">
              <svg class="route__item__icon">
                <use xlink:href="${icon}#icon-profile-male"></use>
              </svg>
              <span class="route__comment__name">User A</span>
              <p class="route__comment__text mt-sm">"Great route!"</p>
            </div>
            <div class="route__comment__box">
              <svg class="route__item__icon">
                <use xlink:href="${icon}#icon-profile-male"></use>
              </svg>
              <span class="route__comment__name">User A</span>
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

export default new BoundaryBrowse();
