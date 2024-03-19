<!DOCTYPE html>
<html>
<head>
    <title>OneMap Search</title>
</head>
<body>
    <h3>Search Start</h3>
    <form id="searchStartForm">
        <label for="searchStart">Search Start:</label>
        <input type="text" id="searchStart" name="searchStart">
        <button type="submit">Search</button>
    </form>
    <div id="startResult"></div>

    <h3>Search End</h3>
    <form id="searchEndForm">
        <label for="searchEnd">Search End:</label>
        <input type="text" id="searchEnd" name="searchEnd">
        <button type="submit">Search</button>
    </form>
    <div id="endResult"></div>

    <form id="selectForm">
        <label for="selectedStart">Selected Start:</label>
        <input type="text" id="selectedStart" name="selectedStart" readonly>
        <input type="hidden" id="startLat" name="startLat">
        <input type="hidden" id="startLng" name="startLng">

        <label for="selectedEnd">Selected End:</label>
        <input type="text" id="selectedEnd" name="selectedEnd" readonly>
        <input type="hidden" id="endLat" name="endLat">
        <input type="hidden" id="endLng" name="endLng">

        <button type="submit" id="saveBtn">Save</button>
        <button type="button" id="seeRouteBtn">See Route</button>
    </form>

    <div id="latLngValues"></div>

    <script>
        let selectedStartResult = null;
        let selectedEndResult = null;
        let startLat = null;
        let startLng = null;
        let endLat = null;
        let endLng = null

        document.getElementById("searchStartForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission
            const searchStart = document.getElementById("searchStart").value;
            const xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const response = JSON.parse(this.responseText);
                    const results = response.results;
                    const resultDiv = document.getElementById("startResult");
                    resultDiv.innerHTML = "<p>Select your starting point:</p>";

                    results.forEach(result => {
                        const radioLabel = document.createElement("label");
                        const radioButton = document.createElement("input");
                        radioButton.setAttribute("type", "radio");
                        radioButton.setAttribute("name", "startResult");
                        radioButton.setAttribute("value", JSON.stringify(result));
                        radioLabel.append(radioButton);

                        radioLabel.append(result.ADDRESS);

                        radioLabel.addEventListener("change", function() {
                            selectedStartResult = result;
                            startLat = result.LATITUDE;
                            startLng = result.LONGITUDE;
                        });

                        resultDiv.append(radioLabel);
                        resultDiv.append(document.createElement("br"));
                    });
                }
            });

            xhr.open("GET", "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=" + searchStart + "&returnGeom=Y&getAddrDetails=Y&pageNum=1");
            xhr.send();
        });

        document.getElementById("searchEndForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission
            const searchEnd = document.getElementById("searchEnd").value;
            const xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const response = JSON.parse(this.responseText);
                    const results = response.results;
                    const resultDiv = document.getElementById("endResult");
                    resultDiv.innerHTML = "<p>Select your ending point:</p>";

                    results.forEach(result => {
                        const radioLabel = document.createElement("label");
                        const radioButton = document.createElement("input");
                        radioButton.setAttribute("type", "radio");
                        radioButton.setAttribute("name", "endResult");
                        radioButton.setAttribute("value", JSON.stringify(result));
                        radioLabel.append(radioButton);

                        radioLabel.append(result.ADDRESS);

                        radioLabel.addEventListener("change", function() {
                            selectedEndResult = result;
                            endLat = result.LATITUDE;
                            endLng = result.LONGITUDE;
                        });

                        resultDiv.append(radioLabel);
                        resultDiv.append(document.createElement("br"));
                    });
                }
            });

            xhr.open("GET", "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=" + searchEnd + "&returnGeom=Y&getAddrDetails=Y&pageNum=1");
            xhr.send();
        });

        document.getElementById("saveBtn").addEventListener("click", function (event) {
            event.preventDefault(); // Prevent form submission
            if (selectedStartResult && selectedEndResult) {
                document.getElementById("selectedStart").value = selectedStartResult.ADDRESS;
                document.getElementById("selectedEnd").value = selectedEndResult.ADDRESS;

            } else {
                alert("Please select both a starting and ending point.");
            }
        });

        document.getElementById("seeRouteBtn").addEventListener("click", function (event) {
            event.preventDefault(); // Prevent form submission
            if (selectedStartResult && selectedEndResult) {

                const xhr = new XMLHttpRequest();
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        const response = JSON.parse(this.responseText);
                        console.log(response);
                        const encodedPolyline = response.route_geometry;

                        // Redirect to map.jsp with the encodedPolyline as a query parameter
                        window.location.href = `map.jsp?encodedPolyline=` + encodedPolyline + `&startLat=` + startLat + `&startLng=` + startLng + '&endLat=' + endLat + `&endLng=` + endLng;
                    }
                });

                xhr.open("GET", `https://www.onemap.gov.sg/api/public/routingsvc/route?start=` + startLat + `,` + startLng + `&end=` + endLat + `,` + endLng +`&routeType=walk`);
                xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiYzk3OWE3M2Q3N2E5MjM1YjdjOGRmYzQ1YWE2OWVkMyIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC0xMjIzNjk4OTkyLmFwLXNvdXRoZWFzdC0xLmVsYi5hbWF6b25hd3MuY29tL2FwaS92Mi91c2VyL3Bhc3N3b3JkIiwiaWF0IjoxNzEwNjg3MzA3LCJleHAiOjE3MTA5NDY1MDcsIm5iZiI6MTcxMDY4NzMwNywianRpIjoiQ1dDT3VGZnZ3ZTJ1dno0UCIsInVzZXJfaWQiOjI5MzcsImZvcmV2ZXIiOmZhbHNlfQ.qoo9AWvP1v6RmWUXuAxp5EJRguJh4BjiyL2nQUHyCRk");
                xhr.send();
            } else {
                alert("Please select both a starting and ending point.");
            }
        });

    </script>
</body>
</html>
