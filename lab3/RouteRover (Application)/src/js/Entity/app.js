import L from 'leaflet';

export let customRoutes = [];

export let favRoutes = [];

export let state = { currentRoute: null };

function _init() {
  retrieveCustomRoutesFromLocalStorage();
  retrieveFavRoutesFromLocalStorage();
  retrieveStateFromLocalStorage();
}
_init();

export function updateState(newRoute) {
  state.currentRoute = newRoute;
  saveStateToLocalStorage();
}

function saveStateToLocalStorage() {
  localStorage.setItem('state', JSON.stringify(state));
}

function retrieveStateFromLocalStorage() {
  const storedState = localStorage.getItem('state');
  if (storedState) {
    state = JSON.parse(storedState);
  }
}

export function addNewReview(rating, comment, id) {
  console.log(id);
  const route = findRouteByID(id);
  if (!route) {
    console.log('no route founded');
    return;
  }
  route.reviews.push({ rating, comment });
  route.ratings = calculateAverageRating(route.reviews);
  saveCustomRoutesToLocalStorage();
}

export function filterRoutes(minRatings, distance, terrain) {
  if (!customRoutes) return;
  return customRoutes.filter(route => {
    if (route.ratings < minRatings) return false;
    if (route.distance > distance) return false;
    if (terrain !== 'Any' && route.terrain !== terrain) return false;
    // if (lat && lng) {
    //   const distance = L.latLng(lat, lng).distanceTo(route.waypoints[0]);
    //   if (distance > 5000) return false;
    // }
    return true;
  });
}

export function addCustomRoute(route) {
  customRoutes.push(route);
  saveCustomRoutesToLocalStorage();
}

export function addFavRoute(route) {
  favRoutes.push(route);
  saveFavRoutesToLocalStorage();
}

function saveCustomRoutesToLocalStorage() {
  localStorage.setItem('customRoutes', JSON.stringify(customRoutes));
}

function retrieveCustomRoutesFromLocalStorage() {
  const storedCustomRoutes = localStorage.getItem('customRoutes');
  if (storedCustomRoutes) {
    customRoutes = JSON.parse(storedCustomRoutes).map(route => {
      route.waypoints = route.waypoints.map(waypoint => L.latLng(waypoint));
      return route;
    });
  }
}

function saveFavRoutesToLocalStorage() {
  localStorage.setItem('favRoutes', JSON.stringify(favRoutes));
}

function retrieveFavRoutesFromLocalStorage() {
  const storedFavRoutes = localStorage.getItem('favRoutes');
  if (storedFavRoutes) {
    favRoutes = JSON.parse(storedFavRoutes).map(route => {
      route.waypoints = route.waypoints.map(waypoint => L.latLng(waypoint));
      return route;
    });
  }
}

export function findRouteByID(id) {
  return customRoutes.find(route => +route.id === +id);
}

function calculateAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
}

export function addReview(rating, comment, id) {
  const route = findRouteByID(id);
  route.reviews.push({ rating, comment });
  route.ratings = calculateAverageRating(route.reviews);
  saveCustomRoutesToLocalStorage();
}

_init();
