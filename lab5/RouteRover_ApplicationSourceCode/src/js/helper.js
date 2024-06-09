import icon from 'url:../img/sprite.svg';

/**
 * Adds autocomplete functionality to a given input element for Google Maps Places API.
 * @param {HTMLInputElement} input - The input element to attach autocomplete functionality to.
 * @returns {google.maps.places.Autocomplete} - The autocomplete object.
 */
export function addHandlerInputAutoComplete(input) {
  return new google.maps.places.Autocomplete(input, {
    fields: ['address_components', 'geometry', 'icon', 'name'],
    strictBounds: false,
    componentRestrictions: { country: 'SG' },
  });
}

/**
 * Generates a string of SVG star icons based on a given number of stars.
 * @param {number} numStars - The number of stars to generate.
 * @param {string} [className='star'] - The class name to apply to each star.
 * @returns {string} - The HTML string of star icons.
 */
export function generateStars(numStars, className = 'star') {
  let starStates = [];
  let remainingStars = numStars;
  for (let i = 1; i <= 5; i++) {
    if (remainingStars >= 1) {
      starStates.push('full');
      remainingStars--;
    } else if (remainingStars > 0) {
      starStates.push('half');
      remainingStars = 0;
    } else {
      starStates.push('empty');
    }
  }
  return starStates
    .map(starState => generateStarMarkup(starState, className))
    .join('');
}

/**
 * Generates HTML markup for a single star icon.
 * @param {string} starState - The state of the star ('full', 'half', 'empty').
 * @param {string} className - The class name for the star icon.
 * @returns {string} - The HTML string of the star icon.
 */
function generateStarMarkup(starState, className) {
  return `<svg class="${className}">
            <use xlink:href="${icon}#icon-star-${starState}"></use>
          </svg>`;
}

/**
 * Converts a route object retrieved from the database into a format compatible with Leaflet maps.
 * @param {Object} route - The route object from the database.
 * @returns {Object} - The route object in Leaflet-compatible format.
 */
export function formatRouteToLeafletFormat(route) {
  return {
    ...route,
    waypoints: route.coords.map(coords => L.latLng(coords.lat, coords.lng)),
  };
}

/**
 * Converts a route object in Leaflet format into a format suitable for storing in the database.
 * @param {Object} route - The route object in Leaflet format.
 * @returns {Object} - The route object in database format.
 */
export function formatRouteToDbFormat(route) {
  return {
    ...route,
    waypoints: {},
  };
}

/**
 * Formats the duration in the format "HH:MM:SS" to "MMm SSs".
 * @param {string} duration - The duration in the format "HH:MM:SS".
 * @returns {string} - The formatted duration in the format "MMm SSs".
 */
export function formatDuration(duration) {
  const [hour, min, sec] = duration.split(':').map(Number);
  min += hour * 60;
  return `${min}m ${sec}s`;
}

/**
 * Converts a duration string in the format "hh:mm:ss" to seconds.
 *
 * @param {string} duration - The duration string to be converted.
 * @returns {number} - The duration in seconds.
 */
export function formatDurationToSec(duration) {
  const [hour, min, sec] = duration.split(':').map(Number);
  return hour * 3600 + min * 60 + sec;
}

/**
 * Retrieves the user's current location using the Geolocation API.
 * @returns {Promise<number[]>} - A promise that resolves to an array containing the latitude and longitude of the user's location.
 * @throws {string} - Throws an error message if the user's location cannot be retrieved.
 */
export async function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        reject('Could not get your location');
      }
    );
  });
}

/**
 * Converts degrees to radians.
 *
 * @param {number} deg - The degree value to be converted.
 * @returns {number} - The equivalent value in radians.
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculates the distance between two coordinates on the Earth's surface.
 * @param {number} lat1 - The latitude of the first coordinate.
 * @param {number} lng1 - The longitude of the first coordinate.
 * @param {number} lat2 - The latitude of the second coordinate.
 * @param {number} lng2 - The longitude of the second coordinate.
 * @returns {number} - The distance between the two coordinates in kilometers.
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}
