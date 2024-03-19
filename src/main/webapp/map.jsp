<!DOCTYPE html>
<html>
<head>
    <title>Search Results</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
    <style>
        #map {
            height: 800px;
        }
    </style>
</head>
<body>
    <h1>Search Results</h1>
    
    <div id="map"></div>

    <script src="https://unpkg.com/polyline-encoded"></script>
    <script>
        const urlParams = new URLSearchParams(window.location.search);
const encodedPolyline = urlParams.get('encodedPolyline');
const startLat = parseFloat(urlParams.get('startLat'));
const startLng = parseFloat(urlParams.get('startLng'));
const endLat = parseFloat(urlParams.get('endLat'));
const endLng = parseFloat(urlParams.get('endLng'));

// Decode the encoded polyline
const decodedPolyline = L.Polyline.fromEncoded(encodedPolyline).getLatLngs();

// Initialize the map
const map = L.map('map').fitBounds([
    [startLat, startLng],
    [endLat, endLng]
]);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([startLat, startLng]).addTo(map);
L.marker([endLat, endLng]).addTo(map);

// Function to generate a random point between two coordinates
function generateRandomPoint(start, end) {
    return start + Math.random() * (end - start);
}

// Generate two random points
const midLat1 = generateRandomPoint(startLat, endLat);
const midLng1 = generateRandomPoint(startLng, endLng);
const midLat2 = generateRandomPoint(startLat, endLat);
const midLng2 = generateRandomPoint(startLng, endLng);

// Add markers for the random points
L.marker([midLat1, midLng1]).addTo(map);
L.marker([midLat2, midLng2]).addTo(map);

// Update the polyline to include the random points and create a circular route
const updatedPolylinePoints = [
    [startLat, startLng],
    [midLat1, midLng1],
    [endLat, endLng],
    [midLat2, midLng2],
    [startLat, startLng] // Loop back to the start
];

// Add the updated polyline to the map
L.polyline(updatedPolylinePoints, { color: 'red' }).addTo(map);

// Adjust the map view
map.fitBounds(updatedPolylinePoints);
    </script>
</body>
</html>
