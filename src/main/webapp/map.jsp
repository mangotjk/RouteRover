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
        const startLat = urlParams.get('startLat');
        const startLng = urlParams.get('startLng');
        const endLat = urlParams.get('endLat');
        const endLng = urlParams.get('endLng');
        // Decode the encoded polyline
        const decodedPolyline = L.Polyline.fromEncoded(encodedPolyline).getLatLngs();

        // Initialize the map
        const map = L.map('map');
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
         }).addTo(map);

        L.marker([startLat,startLng]).addTo(map);
        L.marker([endLat,endLng]).addTo(map);

        // Add the decoded polyline to the map
        L.polyline(decodedPolyline, { color: 'red' }).addTo(map);
        

        // Fit the map to the bounds of the polyline
        map.fitBounds(L.latLngBounds(decodedPolyline));
    </script>
</body>
</html>
