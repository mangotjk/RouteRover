<!DOCTYPE html>
<html>
<head>
    <title>Custom Route</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
    <script src="https://unpkg.com/polyline-encoded"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            position: relative;
        }

        #map {
            height: 100vh;
            width: 100%;
        }

         .search-container {
            position: absolute;
            top: 60px;
            left: 60px;
            z-index: 1000; /* Ensure the search containers are on top of the map */
            background-color: #1fe0;
            border-radius: 5px;
        }

         .search-input {
            width: 250px; /* Reduced width to accommodate the icon */
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
            display: inline-block; /* Display input fields as inline-block elements */
        }

        .search-button {
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 5px;
        }

        .search-results {
            width: 250px;
            max-height: 200px;
            overflow-y: auto;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-top: 5px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: none; /* Initially hide the search results */
        }

        .search-result {
            padding: 10px;
            cursor: pointer;
        }

        .search-result:hover {
            background-color: #e9e9e9;
        }

    </style>
</head>
<body>
    <div id="map"></div>
    <div class="message" id="message"></div>
    <div class="search-container">
        <input type="text" class="search-input start-input" placeholder="Search for start point...">
        <div class="search-results start-results"></div>

        <div class="search-wrapper">
            <input type="text" class="search-input end-input" placeholder="Search for end point...">
            <i class="fas fa-search search-button"></i>
        </div>
        <div class="search-results end-results"></div>
    </div>

    <script>
    
        var startLat, startLng, endLat, endLng, encodedPolyline, decodedPolyline;
        let startMarker, endMarker, polyline;

        const map = L.map('map').setView([1.33, 103.83], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        function setupAutoSuggestSearch(inputClass, resultsClass, isStart) {
            const searchInput = document.querySelector(inputClass);
            const searchResults = document.querySelector(resultsClass);
            let results = [];

            searchInput.addEventListener('input', function() {
                const searchStart = this.value.trim();
                if (searchStart.length > 0) {
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=" + searchStart + "&returnGeom=Y&getAddrDetails=Y&pageNum=1");
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                results = JSON.parse(xhr.responseText).results;
                                if (results.length > 0) {
                                    const html = results.map(result => `<div class="search-result">` + result.ADDRESS + `</div>`).join('');
                                    searchResults.innerHTML = html;
                                    searchResults.style.display = 'block';
                                } else {
                                    searchResults.innerHTML = '<div class="search-result">No results found</div>';
                                    searchResults.style.display = 'block';
                                }
                            } else {
                                console.error('Failed to fetch results');
                            }
                        }
                    };
                    xhr.send();
                } else {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                }
            });

            searchResults.addEventListener('click', function(event) {
                if (event.target.classList.contains('search-result')) {
                    searchInput.value = event.target.textContent;
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';

                    // Save the selected address and its coordinates
                    const selectedAddress = event.target.textContent;
                    for (let i = 0; i < results.length; i++) {
                        if(results[i].ADDRESS === selectedAddress){
                            const selectedLat = results[i].LATITUDE;
                            const selectedLng = results[i].LONGITUDE;
                            if (isStart) {
                                startLat = selectedLat;
                                startLng = selectedLng;
                                startMarker = L.marker([selectedLat,selectedLng]).addTo(map);
                            } else {
                                endLat = selectedLat;
                                endLng = selectedLng;
                                endMarker = L.marker([selectedLat,selectedLng]).addTo(map);
                            }
                            break;
                        }
                    }
                }
            });

            document.addEventListener('click', function(event) {
                if (!event.target.classList.contains('search-input') && !event.target.classList.contains('search-result')) {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                }
            });
        }

        // Setup auto-suggest search for start point
        setupAutoSuggestSearch('.start-input', '.start-results', true);

        // Setup auto-suggest search for end point
        setupAutoSuggestSearch('.end-input', '.end-results', false);

        function drawPolyline(startLat, startLng, endLat, endLng) {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    map.fitBounds([[startLat, startLng],[endLat, endLng]]);
                    const response = JSON.parse(this.responseText);
                    encodedPolyline = response.route_geometry;
                    console.log(encodedPolyline);
                    decodedPolyline = L.Polyline.fromEncoded(encodedPolyline, {weight: 3, color: 'red'}).addTo(map);
                }
            });

            xhr.open("GET", `https://www.onemap.gov.sg/api/public/routingsvc/route?start=` + startLat + `,` + startLng + `&end=` + endLat + `,` + endLng +`&routeType=walk`);
            xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYjhiY2FhOGRiNmNhMGQyNjk1MDk5NDY5OWUzZWEzZSIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC0xMjIzNjk4OTkyLmFwLXNvdXRoZWFzdC0xLmVsYi5hbWF6b25hd3MuY29tL2FwaS92Mi91c2VyL3Bhc3N3b3JkIiwiaWF0IjoxNzEwOTU3NDk3LCJleHAiOjE3MTEyMTY2OTcsIm5iZiI6MTcxMDk1NzQ5NywianRpIjoiVG80cEdpV3d0OHZUaGNvTyIsInVzZXJfaWQiOjMwMDksImZvcmV2ZXIiOmZhbHNlfQ.Vm8eyWeAAsi75hXgY1pHBVZSZ034swtK8c_kaIbeE4M");
            xhr.send();
        }

        function generateRandomPoint(start, end) {
            let num = parseFloat(start) + Math.random() * (parseFloat(end) - parseFloat(start));
            return num;
        }


        document.querySelector(".fas.fa-search").addEventListener("click", function() {
            if (startLat && startLng && endLat && endLng) {
                console.log(startLat);
                console.log(endLat);
                console.log(startLng);
                console.log(endLng);
                drawPolyline(startLat, startLng, endLat, endLng)
                // Generate two random points
                const midLat1 = generateRandomPoint(startLat, endLat);
                const midLng1 = generateRandomPoint(startLng, endLng);
                const midLat2 = generateRandomPoint(startLat, endLat);
                const midLng2 = generateRandomPoint(startLng, endLng);
                drawPolyline(startLat, startLng, midLat1, midLng1);
                drawPolyline(endLat, endLng, midLat2, midLng2);
                drawPolyline(midLat1, midLng1, midLat2, midLng2);
                const bounds = [[startLat,startLng],[endLat,endLng], [midLat1,midLng1], [midLat2,midLng2]];
                map.fitBounds(bounds.pad(0.5));
            } else {
                console.error("Please select both a starting and ending point.");
            }
        });


    </script>
</body>
</html>