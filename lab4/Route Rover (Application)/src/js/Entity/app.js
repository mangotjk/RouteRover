import L from 'leaflet';
import {
  retrieveRoutesFromDatabase,
  addRouteToDatabase,
  addReviewToDatabase,
  updateFavRouteToDatabase,
  updateUserReviewedToDatabase,
} from '../http';
import { formatDurationToSec, calculateDistance } from '../helper';
import { MAX_SEARCH_DISTANCE_KM } from '../config';

export const locations = [
  {
    title: `Use your current location`,
    latlng: `location`,
  },
  {
    title: `Lee Wee Nam Library`,
    latlng: `1.34767,103.68093`,
  },
  {
    title: `Hall 2 - Block 1`,
    latlng: `1.34798,103.68606`,
  },
  {
    title: `Fine Food @ South Spine`,
    latlng: `1.34246,103.68238`,
  },
  {
    title: `Saraca, Tamarind Halls Canteen`,
    latlng: `1.35485,103.68488`,
  },
  {
    title: `NTU Hall 12`,
    latlng: `1.35179,103.68056`,
  },
  {
    title: `Gaia - Nanyang Business School`,
    latlng: `1.34213,103.68334`,
  },
];

/**
 * Array containing custom routes.
 */
let customRoutes = [
  {
    distance: 1.26,
    duration: 13,
    id: 504250,
    ratings: 1,
    reviews: [{ comment: 'Great Route', rating: 1 }],
    terrain: 'Urban',
    title: 'dummy route',
    waypoints: [
      L.latLng(1.3529584, 103.6818509),
      L.latLng(1.3549454, 103.6865217),
    ],
    coords: [
      { lat: 1.3529584, lng: 103.6818509 },
      { lat: 1.3549454, lng: 103.6865217 },
    ],
  },
];

/**
 * Array containing all routes.
 */
let allRoutes;

/**
 * Array containing favorite routes.
 */
export let favRoutes = [];

/**
 * Object containing the current route.
 */
// to store current route rendered on map
export let state = { currentRoute: null };

/**
 * Retrieves the custom routes.
 * @returns {Array} The custom routes.
 */
export const getCustomRoutes = function () {
  return customRoutes;
};

/**
 * Retrieves all routes.
 * @param {number} numRoutes - The number of routes to retrieve.
 * @returns {Array} The retrieved routes.
 */
export const getAllRoutes = function (numRoutes) {
  if (!numRoutes) return allRoutes;
  let filteredAllRoutes = allRoutes.filter(
    route => route.creator !== getUserName()
  );
  filteredAllRoutes = filteredAllRoutes.sort(() => Math.random() - 0.5);
  return filteredAllRoutes.slice(0, numRoutes);
};

/**
 * Retrieves the state from local storage.
 */
function retrieveStateFromLocalStorage() {
  const storedState = localStorage.getItem('state');
  if (storedState) {
    state = JSON.parse(storedState);
  }
}

/**
 * Saves the state to local storage.
 */
function saveStateToLocalStorage() {
  localStorage.setItem('state', JSON.stringify(state));
}

/**
 * Sets the user details in the state object.
 * @param {string} userID - The user ID.
 * @param {string} username - The username.
 */
export const setUserDetails = function (userID, username) {
  state.currentUser = { userID, username };
  saveStateToLocalStorage();
};

/**
 * Retrieves the username.
 * @returns {string} The username.
 */
export const getUserName = function () {
  return state.currentUser.username;
};

/**
 * Retrieves the user ID.
 * @returns {string} The user ID.
 */
export const getUserID = function () {
  return state.currentUser.userID;
};

// not used, for retrieving data from local storage upon initialization
function _init() {
  // retrieveFavRoutesFromLocalStorage();
  retrieveStateFromLocalStorage();
}

/**
 * Updates the state with the new route.
 * @param {Object} newRoute - The new route.
 */
export function updateState(newRoute) {
  state.currentRoute = newRoute;
  saveStateToLocalStorage();
}

/**
 * Clears the current route from the state.
 */
export function clearCurrentRoute() {
  state.currentRoute = null;
  saveStateToLocalStorage();
}

export function getCurrentRoute() {
  return state.currentRoute;
}

/**
 * Retrieves routes from the database.
 * @param {string} userID - The user ID.
 */
// retrieve data from DB, need await keyword
export async function retrieveRoutesFromDB(userID = null) {
  let storedRoutes;
  try {
    storedRoutes = await retrieveRoutesFromDatabase(userID);
  } catch (err) {
    console.error(err);
  }
  if (storedRoutes) {
    allRoutes = storedRoutes;
  }
  if (storedRoutes && userID) {
    customRoutes = await convertRouteIDsToRoute(storedRoutes);
  }
}

/**
 * Converts route IDs to routes.
 * @param {Array} routeIDs - The route IDs.
 * @returns {Array} The converted routes.
 */
async function convertRouteIDsToRoute(retrievedRoutes) {
  await retrieveRoutesFromDB();
  let routes = [];
  if (retrievedRoutes) {
    retrievedRoutes.forEach(retrievedRoute => {
      const foundRoute = allRoutes.find(
        route => route.id === retrievedRoute.routeID
      );
      foundRoute.userRouteDocID = retrievedRoute.userRouteDocID;
      foundRoute.fav = retrievedRoute.fav;
      foundRoute.reviewed = retrievedRoute.reviewed;
      routes.push(foundRoute);
    });
  }
  return routes;
}

/**
 * Adds a route to the database.
 * @param {Object} route - The route to add.
 * @param {string} userID - The user ID.
 */
// add route to DB, need await keyword
export async function addRouteToDB(route, userID = null) {
  try {
    await addRouteToDatabase(route, userID);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Adds a new review to a route.
 * @param {number} rating - The rating.
 * @param {string} comment - The comment.
 */
// not done. for calling update review function in http file and pass required parameters
export async function addNewReview(
  rating,
  comment,
  duration,
  img,
  saveToMyRuns = true
) {
  const route = state.currentRoute;
  if (!route) {
    console.error('no route founded');
    return;
  }
  const username = getUserName();
  const imgUrl = 'images/' + route.id + '_' + username + '.jpg';
  route.reviews.unshift({ rating, comment, duration, username, imgUrl });
  route.ratings = calculateAverageRating(route.reviews);
  route.duration = calculateAverageDuration(route.reviews);
  route.leaderboard.push({ username, duration });
  route.leaderboard.sort(
    (a, b) => formatDurationToSec(a.duration) - formatDurationToSec(b.duration)
  );

  if (saveToMyRuns) {
    await updateUserReviewedToDatabase(route, getUserID(), duration);
  }
  await addReviewToDatabase(route, img, username);
}

/**
 * Filters routes based on criteria.
 * @param {number} minRatings - The minimum rating.
 * @param {number} distance - The distance.
 * @param {string} terrain - The terrain.
 * @returns {Array} The filtered routes.
 */
// return routes that meet the filter criteria, nearby route seearching not implemented
export async function filterRoutes(
  minRatings,
  distance,
  terrain,
  [lat, lng],
  closest = true
) {
  if (!allRoutes) return;
  let filteredRoutes = allRoutes.filter(route => {
    if (route.ratings < minRatings) return false;
    if (+distance < MAX_SEARCH_DISTANCE_KM && +route.distance > +distance)
      return false;
    if (terrain !== 'Any' && route.terrain !== terrain) return false;
    if (getUserName() === route.creator) return false;

    return true;
  });
  filteredRoutes.sort((a, b) => {
    const aDistance = calculateDistance(
      a.coords[0].lat,
      a.coords[0].lng,
      lat,
      lng
    );
    const bDistance = calculateDistance(
      b.coords[0].lat,
      b.coords[0].lng,
      lat,
      lng
    );
    if (closest) return aDistance - bDistance;
    return bDistance - aDistance;
  });

  return filteredRoutes;
}

export function logout() {
  localStorage.clear();
}

/**
 * Adds a route to the favorite routes.
 * @param {Object} route - The route to add.
 */
// not used
export async function addFavRoute(route) {
  try {
    await updateFavRouteToDatabase(route, getUserID());
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Finds a route by ID.
 * @param {number} id - The route ID.
 * @param {boolean} findAllRoutes - Whether to find all routes or not.
 * @returns {Object} The found route.
 */
export function findRouteByID(id, findAllRoutes = true) {
  if (findAllRoutes) return allRoutes?.find(route => +route.id === +id);
  return customRoutes.find(route => +route.id === +id);
}

/**
 * Calculates the average rating from reviews.
 * @param {Array} reviews - The reviews.
 * @returns {number} The average rating.
 */
function calculateAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
}

function calculateAverageDuration(reviews) {
  if (reviews.length === 0) return '00:00:00';

  const totalDurationInSeconds = reviews.reduce((acc, review) => {
    return acc + formatDurationToSec(review.duration);
  }, 0);

  const averageDurationInSeconds = totalDurationInSeconds / reviews.length;

  const avgDurationInMinutes = averageDurationInSeconds / 60;

  return avgDurationInMinutes.toFixed(0);
}

_init();
