import L from 'leaflet';
import 'leaflet-routing-machine';
import { getCurrentUserEmail } from '../http';

/**
 * Class representing a map for routing.
 */
class Map {
  // config for map (do not change)

  /** @type {Array} */
  _coords = [1.3521, 103.8128];
  /** @type {number} */
  _zoom = 11;
  /** @type {number} */
  _minZoom = 10;
  /** @type {number} */
  _locateZoom = 17;
  /** @type {L.Map} */
  _map = L.map('map').setView(this._coords, this._zoom);

  /** @type {L.Routing.Control} */
  _currentRoute;
  /** @type {Array} */
  _currentWayPoints;
  /** @type {object} */
  _currentSummary;

  /**
   * Initialize the map.
   */
  init() {
    this._loadmap();
    this._initCurrentRoute();
  }

  /**
   * Load the map tiles.
   */
  _loadmap() {
    L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
      minZoom: this._minZoom,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this._map);
  }

  /**
   * Translate coordinates to waypoints.
   * @param {Array} [lat, lng] - The coordinates.
   * @param {Array} [lat2, lng2] - The coordinates.
   * @returns {Array} - The waypoints.
   */
  _translateCoordsToWaypoints([lat, lng], [lat2, lng2]) {
    return [L.latLng(lat, lng), L.latLng(lat2, lng2)];
  }

  /**
   * Add a new point to the route.
   * @param {number} lat - The latitude.
   * @param {number} lng - The longitude.
   */
  addNewPoint(lat, lng) {
    const newPoint = L.latLng(lat, lng);
    this._currentWayPoints.splice(
      this._currentWayPoints.length - 1,
      0,
      newPoint
    );
    this._drawRoute(this._currentWayPoints);
  }

  /**
   * Draw the route on the map.
   * @param {Array} waypoints - The waypoints of the route.
   */
  _drawRoute(waypoints) {
    this._currentRoute.setWaypoints(waypoints);
    this._currentWayPoints = waypoints;
    const bounds = new L.LatLngBounds(waypoints);
    this._map.fitBounds(bounds);
  }

  /**
   * Initialize the current route.
   */
  _initCurrentRoute(handler) {
    this._currentRoute = L.Routing.control({
      routeWhileDragging: true,
      show: false,
      addWaypoints: true,
      summaryTemplate: '<h2>{name}</h2>',
      router: new L.Routing.osrmv1({
        profile: 'foot', // Set the routing profile to walking
      }),
    });

    this._currentRoute.on(
      'waypointschanged',
      function (e) {
        this._currentWayPoints = e.waypoints.map(waypoint => waypoint.latLng);
      }.bind(this)
    );

    this._currentRoute.on(
      'routesfound',
      function (e) {
        e.routes.totalTime *= 5;
        const routes = e.routes;
        this._currentSummary = routes[0].summary;
      }.bind(this)
    );

    this._currentRoute.addTo(this._map);
  }

  /**
   * Generate a random ID.
   * @returns {string} - The random ID.
   */
  _generateRandomId() {
    const randomID = (Math.random() * 1000000).toFixed(0);
    return randomID;
  }

  /**
   * Get the route object.
   * @returns {object} - The route object.
   */
  getRouteObject() {
    const newId = this._generateRandomId();
    return {
      id: +newId,
      creator: getCurrentUserEmail(),
      title: 'Title',
      waypoints: this._currentWayPoints,
      duration: '00:00:00',
      distance: +(this._currentSummary.totalDistance / 1000).toFixed(2),
      coords: this._currentWayPoints.map(waypoint => {
        const { lat, lng } = waypoint;
        return { lat, lng };
      }),

      terrain: 'Urban',
      reviewed: false,
    };
  }
}

export default new Map();
