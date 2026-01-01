// ===============================
// Global chart instance
// ===============================
let pollutantChart = null;

// ===============================
// Render Dominant Pollutant Bar Chart
// ===============================
function renderDominantPollutantChart(data) {
    const pollutants = {
        "PM2.5": data.pm25,
        "PM10": data.pm10,
        "NO₂": data.no2,
        "SO₂": data.so2,
        "O₃": data.o3,
        "CO": data.co
    };

    const labels = [];
    const values = [];
    const colors = [];

    Object.entries(pollutants).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "N/A") {
            labels.push(key);
            values.push(value);

            if (
                data.dominantPollutant &&
                key.replace(".", "").toUpperCase() === data.dominantPollutant.toUpperCase()
            ) {
                colors.push("#e74c3c"); // dominant pollutant
            } else {
                colors.push("#3498db");
            }
        }
    });

    // Safety check
    if (typeof Chart === "undefined") return;

    const canvas = document.getElementById("pollutantChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Destroy previous chart if exists
    if (pollutantChart) {
        pollutantChart.destroy();
    }

    pollutantChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Current Pollutant Concentration",
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ===============================
// Main AQI Fetch Function
// ===============================
async function getAQI() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Please enter a city");
        return;
    }

    // Hide old result while loading
    document.getElementById("result").classList.add("hidden");

    try {
        const response = await fetch(
    `/api/air-quality?city=${encodeURIComponent(city)}`
);


        if (!response.ok) {
            throw new Error("API error");
        }

        const data = await response.json();

        // Show result container
        document.getElementById("result").classList.remove("hidden");

        // Basic AQI info
        document.getElementById("cityName").innerText = data.city;
        document.getElementById("aqiValue").innerText = data.aqi;
        document.getElementById("aqiStatus").innerText = data.status;

        // Pollutants
        document.getElementById("pm25").innerText = data.pm25 ?? "N/A";
        document.getElementById("pm10").innerText = data.pm10 ?? "N/A";
        document.getElementById("no2").innerText = data.no2 ?? "N/A";
        document.getElementById("so2").innerText = data.so2 ?? "N/A";
        document.getElementById("o3").innerText = data.o3 ?? "N/A";
        document.getElementById("co").innerText = data.co ?? "N/A";

        // Messages
        document.getElementById("healthMsg").innerText = data.healthMessage;
        document.getElementById("updatedTime").innerText = data.lastUpdated;

        // Dominant pollutant
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

        // Render bar chart safely
        if (typeof Chart !== "undefined") {
            renderDominantPollutantChart(data);
        }

    } catch (err) {
        console.error("AQI fetch/render error:", err);
    }
}