async function getAQI() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Please enter a city");
        return;
    }

    try {
        const response = await fetch(`/api/air-quality?city=${encodeURIComponent(city)}`);

        if (!response.ok) {
            throw new Error("API error");
        }

        const data = await response.json();

        document.getElementById("result").classList.remove("hidden");
        document.getElementById("cityName").innerText = data.city;
        document.getElementById("aqiValue").innerText = data.aqi;
        document.getElementById("aqiStatus").innerText = data.status;
        document.getElementById("pm25").innerText = data.pm25 ?? "N/A";
        document.getElementById("pm10").innerText = data.pm10 ?? "N/A";
        document.getElementById("no2").innerText = data.no2 ?? "N/A";
document.getElementById("so2").innerText = data.so2 ?? "N/A";
document.getElementById("o3").innerText = data.o3 ?? "N/A";
document.getElementById("co").innerText = data.co ?? "N/A";

        document.getElementById("healthMsg").innerText = data.healthMessage;
        document.getElementById("updatedTime").innerText = data.lastUpdated;

        // ✅ ADD DOMINANT POLLUTANT
        document.getElementById("dominantPollutant").innerText =
            data.dominantPollutant
                ? data.dominantPollutant.toUpperCase()
                : "N/A";

        // AQI color logic
        const aqiBox = document.getElementById("aqiBox");
        aqiBox.className = "aqi-box";

        if (data.aqi <= 50) aqiBox.classList.add("aqi-good");
        else if (data.aqi <= 100) aqiBox.classList.add("aqi-moderate");
        else if (data.aqi <= 200) aqiBox.classList.add("aqi-poor");
        else if (data.aqi <= 300) aqiBox.classList.add("aqi-verypoor");
        else aqiBox.classList.add("aqi-severe");

    } catch (err) {
        alert("Error fetching AQI data");
        console.error(err);
    }
}
