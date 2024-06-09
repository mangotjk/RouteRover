import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';
import { addHandlerInputAutoComplete, generateStars } from '../helper';
import { getRouteImg } from '../http';
import trail_routes from 'url:../../img/route/trail_route.jpeg';

/**
 * For handling user inputs and interactions in the Browse tab.
 * 
 * @extends Boundary
 */
class BoundaryBrowse extends Boundary {
  /**
   * parent element: browse page
   */
  _parentEl = document.getElementById('container-browser');
  /**
   * user input area
   */
  _areaInput = document.getElementById('user-input__area');
  /**
   * stores the results of the user input
   */
  _areaInputResult;
  /**
   * stores a reference to the input element
   */
  _locationOptionsEl = document.querySelector('.user-input__result');
  /**
   * stores the data for the user input location
   */
  _locationOptionData;
  /**
   * stores the coordinates of the location required
   */
  _userLocationLatLng;
  /**
   * reference to the search button
   */
  _searchBtn = document.getElementById('browse-search-btn');
  /**
   * HTML markup containing results from the user query
   * Default: no results found message
   */
  _msg = `<div class="window window--header mb-md">
  <h2 class="h-2">Search Results</h2>
</div>
  <div class="window window--header mb-md">
  <p>No Routes Found</p>
</div>`;

  constructor() {
    super();
  }

  /**
   * Renders the data received from an API call.
   * @param {Array} data - The data to be rendered.
   * @param {boolean} fromHome - Indicates if the data is from the home page.
   */
  async render(data, fromHome = false) {
    if (!data) {
      return this.renderError();
    }
    this._clear();
    let content;
    this._data = data;

    if (fromHome) {
      content = this._generateMarkupWithSelectedRoute(this._data);
    } else {
      this.renderSpinner();
      content = await this._generateMarkups(this._data);
    }

    this._clear();
    if (this._data.length == 0) return this.renderMsg();
    this._parentEl.insertAdjacentHTML('beforeend', content);
  }

  /**
   * Adds handler for loading all routes
   * 
   * @param {Function} handler - function to load all requested routes 
   */
  addHandlerLoadAllRoutes(handler) {
    window.onload = handler;
    this._areaInputResult = addHandlerInputAutoComplete(this._areaInput);
  }

  /**
   * Adds an event handler for canceling a route.
   * @param {Function} handler - The handler function.
   * @deprecated This method is not used.
   */
  // not used
  addHandlerCancelRoute(handler) {
    const stopBtn = document.getElementById('stop-running-btn');
    if (stopBtn) {
      stopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
    }
  }

  /**
   * Adds an event handler for submitting a search.
   * @param {Function} handler - The handler function.
   */
  addHandlerSubmitSearch(handler = null) {
    this._searchBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        let place;
        let lat, lng;
        try {
          if (this._locationOptionData) {
            [lat, lng] = this._locationOptionData;
          } else {
            place = this._areaInputResult.getPlace().geometry.location;
            [lat, lng] = [place.lat(), place.lng()];
          }
        } catch (err) {
          window.alert('invalid location');
          return;
        }
        const minRatings =
          5 - document.getElementById('user-input__rating').value;
        const distance = +document.getElementById('user-input__distance').value;
        const terrain = document.querySelector(
          'input[name="terrain"]:checked'
        ).value;
        if (handler) handler([+lat, +lng], minRatings, distance, terrain);
      }.bind(this)
    );
  }

  /**
   * add event handler for selecting location on the browse page
   * @param {Function} handler - The handler function.
   */
  addHandlerSelectLocation(handler) {
    this._locationOptionsEl.addEventListener(
      'click',
      function (e) {
        let lat, lng;
        const target = e.target.closest('.user-input__result__option');
        const allOptions = this._locationOptionsEl.querySelectorAll(
          '.user-input__result__option'
        );
        if (!target) {
          return;
        }
        allOptions.forEach(option => {
          option.classList.remove('user-input__result__option--active');
        });
        target.classList.add('user-input__result__option--active');
        const targetDataAttr = target.dataset.location;

        if (targetDataAttr === 'location') {
          if (this._userLocationLatLng) {
            this._locationOptionData = this._userLocationLatLng;
            handler(+this._locationOptionData[0], +this._locationOptionData[1]);
            return;
          } else {
            navigator.geolocation.getCurrentPosition(
              position => {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                this._locationOptionData = [lat, lng];
                this._userLocationLatLng = [lat, lng];
                handler(+lat, +lng);
              },
              err => {
                alert('Unable to locate');
              }
            );
          }
          this._areaInput.value = 'Use your current location';
        } else {
          [lat, lng] = targetDataAttr.split(',');
          this._areaInput.value = target.textContent.trim();
          this._locationOptionData = [lat, lng];
          handler(+lat, +lng);
        }
      }.bind(this)
    );
  }

  /**
   * Adds an event handler for selecting a route.
   * @param {Function} handler - The handler function.
   * @param {boolean} needToRetrieve - Indicates if route data needs to be retrieved.
   */
  addHandlerSelectRoute(handler, needToRetrieve = false) {
    this._parentEl.addEventListener(
      'click',
      function (e) {
        const favButton = e.target.closest('.route__item__addToFav');
        const startRunningButton = e.target.closest('.btn--start-running');
        const addToMyRunButton = e.target.closest('.btn--add-to-my-run');
        const route = e.target.closest('.route--browse-result');
        const routeId = +route?.dataset.id;

        if (favButton) {
          handler('fav', routeId);
          return;
        }

        if (startRunningButton) {
          handler('start', routeId);
          return;
        }

        if (addToMyRunButton) {
          handler('add', routeId);
          return;
        }

        if (!route) return;
        const routeHiddenComponent = route.querySelector(
          '.route__hidden-component'
        );

        if (routeHiddenComponent) {
          this._clearLeaderboardShowState();
          routeHiddenComponent.classList.toggle('show');
          handler('route', routeId, needToRetrieve);
        }
      }.bind(this)
    );
  }

  /**
   * hides the leaderboard.
   */
  _clearLeaderboardShowState() {
    this._parentEl
      .querySelectorAll('.route__hidden-component')
      .forEach(component => {
        component.classList.remove('show');
      });
  }

  /**
   * Shows the start button by removing the 'hidden' class from the element with id 'btns'.
   */
  showStartButton() {
    document.getElementById('btns').classList.remove('hidden');
  }

  /**
   * renders available locations to user
   * 
   * @param {Object} locations - information for available locations
   */
  renderAvailableLocations(locations) {
    document.querySelector('.user-input__result').innerHTML = locations
      .map(
        location => `
    <div
      class="user-input__result__option"
      data-location="${location.latlng}"
    >
      <svg class="user-input__result__icon">
        <use xlink:href="${icon}#icon-location"></use>
      </svg>
      <span>${location.title}</span>
    </div>`
      )
      .join('');
  }

  /**
   * Generates HTML markup for a selected route item based on the provided data.
   * @param {Object} data - The data object containing information about the route.
   * @returns {string} The HTML markup for the selected route item.
   */
  _generateMarkupWithSelectedRoute(data) {
    return `
        <button class="window window--button" id="stop-running-btn">Back</button>
        <div class="route route--browse-result window" data-id=${data.id}>
          <div class="route__header">
            <h4 class="h-4 route__heading">${
              data.title
            } <span class="text-sm">(${data.creator || 'Anonymous'})</span></h4>
          </div>
          <div class="rating">
            ${generateStars(data.ratings, 'route__item__icon')}
            <span>(${data.ratings.toFixed(1)})</span>
          </div>
          <div class="route__comment">
          ${
            data.reviews
              .map(
                review => `<div class="route__comment__box">
          <svg class="route__item__icon">
            <use xlink:href="${icon}#icon-profile-male"></use>
          </svg>
          <span class="route__comment__name">${
            review.username ? review.username : 'Anonymous'
          }</span>
          <p class="route__comment__text mt-sm">"${review.comment}"</p>
        </div>`
              )
              .join('') || '<h4>No reviews yet</h4>'
          }
            
          </div>
          <ul class="route__leaderboard show">
          <p class="route__leaderboard__header">Leaderboard</p>
          ${data.leaderboard
            .slice(0, 3)
            .map((leader, index) => {
              return `<li><span>${leader.username}</span><span>${leader.duration}</span></li>`;
            })
            .join('')}
          </ul>
          <button class="btn btn--secondary btn--small btn--add-to-my-run mb-sm">Add to My Runs</button>
          <div class="route__content">
          <div class="route__item">
              <svg class="route__item__icon">
                <use xlink:href="${icon}#icon-users"></use>
              </svg>

              <span class="route__item__details"
                ><span class="route__item--bold "
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
                }</span> mins
              </span>
            </div>
          </div>
        </div>`;
  }

  /**
   * Generates HTML markup for all the routes in the search results.
   * @returns {string} The HTML markup for all the routes.
   */
  async _generateMarkups() {
    let content = `<div class="window window--header mb-md">
    <h2 class="h-2">Search Results</h2>
  </div>`;
    for (const route of this._data) {
      content += await this._generateMarkup(route);
    }
    return content;
  }

  /**
   * Generates HTML markup for a single route item based on the provided data.
   * @param {Object} data - The data object containing information about the route.
   * @returns {string} The HTML markup for the route item.
   */
  async _generateMarkup(data) {
    let imgUrls;
    try {
      imgUrls = await Promise.all(
        data.reviews.map(rev => getRouteImg(rev.imgUrl ? rev.imgUrl : null))
      );
    } catch (err) {
      console.error('cannot load images');
    }
    data.reviews.forEach((rev, i) => {
      rev.imgUrl = imgUrls[i];
    });

    return `<div class="route route--browse-result window" data-id=${data.id}>
          <div class="route__header">
            <h4 class="h-4 route__heading">${
              data.title
            }<span class="text-sm"> (${data.creator || 'Anonymous'})</span></h4>
          </div>
          <div class="rating">
            ${generateStars(data.ratings, 'route__item__icon')}
            <span>(${data.ratings.toFixed(1)})</span>
          </div>
          <div class="route__comment">
          ${
            data.reviews
              .map(
                review => `<div class="route__comment__box">
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
                <p class="route__comment__text mt-sm">"${review.comment}"</p>
              </div>`
              )
              .join('') || '<h4>No reviews yet</h4>'
          }
          </div >
          <div class="route__hidden-component">
            <ul class="route__leaderboard">
              <p class="route__leaderboard__header">Leaderboard</p>
              ${data.leaderboard
                .slice(0, 3)
                .map((leader, index) => {
                  return `<li class="route__leaderboard__list"><span>${leader.username}</span><span>${leader.duration}</span></li>`;
                })
                .join('')}
            </ul>
            <div class="btns--browse">
                <button class="btn btn--secondary btn--small btn--add-to-my-run">Add to My Runs</button>
                <button class="btn btn--secondary btn--small btn--start-running">Start Running</button>
            </div>
          </div>
          <div class="route__content">
          <div class="route__item">
              <svg class="route__item__icon">
                <use xlink:href="${icon}#icon-users"></use>
              </svg>

              <span class="route__item__details"
                ><span class="route__item--bold "
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
                }</span> mins
              </span>
            </div>
          </div>
        </div>`;
  }

  /**
   * Adds a marker to the map at the specified coordinates.
   * @param {Array<number>} coords - The coordinates [latitude, longitude] where the marker should be added.
   */
  _addMarker(coords) {
    L.marker(coords).addTo(this._map);
  }
}

export default new BoundaryBrowse();
