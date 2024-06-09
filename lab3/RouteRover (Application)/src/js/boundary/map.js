import L from 'leaflet';
import 'leaflet-routing-machine';

class Map {
  _coords = [1.3521, 103.8128];
  _zoom = 11;
  _minZoom = 10;
  _locateZoom = 17;
  _map = L.map('map').setView(this._coords, this._zoom);

  _currentRoute;
  _currentWayPoints;
  _currentSummary;

  init() {
    this._loadmap();
    this._initCurrentRoute();
  }

  _loadmap() {
    L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
      minZoom: this._minZoom,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this._map);
  }

  _translateCoordsToWaypoints([lat, lng], [lat2, lng2]) {
    return [L.latLng(lat, lng), L.latLng(lat2, lng2)];
  }

  _drawRoute(waypoints) {
    this._currentRoute.setWaypoints(waypoints);
    this._currentWayPoints = waypoints;
    const bounds = new L.LatLngBounds(waypoints);
    this._map.fitBounds(bounds);
  }

  _initCurrentRoute(handler) {
    this._currentRoute = L.Routing.control({
      routeWhileDragging: false,
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

  _addMarkers(stores) {
    stores.forEach(store => {
      this._addMarker(store.coords);
    });
  }

  _addMarker(coords) {
    L.marker(coords).addTo(this._map);
  }

  locateMarker(coords) {
    this._map.setView(coords, this._locateZoom);
  }

  _generateRandomId() {
    const randomID = (Math.random() * 1000000).toFixed(0);
    return randomID;
  }

  getRouteObject() {
    const newId = this._generateRandomId();
    return {
      id: +newId,
      title: 'Title',
      waypoints: this._currentWayPoints,
      distance: +(this._currentSummary.totalDistance / 1000).toFixed(2),
      duration: +((this._currentSummary.totalTime * 5) / 60).toFixed(0),
      terrain: 'Urban',
    };
  }
}

export default new Map();
