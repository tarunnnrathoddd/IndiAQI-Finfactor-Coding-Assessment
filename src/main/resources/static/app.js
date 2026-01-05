// ===============================
// Global chart instance
// ===============================
let pollutantChart = null;

// ===============================
// Animate AQI Number
// ===============================
function animateAQI(target) {
    const el = document.getElementById("aqiValue");
    let current = 0;

    const interval = setInterval(() => {
        current += Math.ceil(target / 30);
        if (current >= target) {
            el.innerText = target;
            clearInterval(interval);
        } else {
            el.innerText = current;
        }
    }, 20);
}

// ===============================
// Render Pollutant Chart
// ===============================
function renderDominantPollutantChart(data) {
    const pollutants = {
        pm25: data.pm25,
        pm10: data.pm10,
        no2: data.no2,
        so2: data.so2,
        o3: data.o3,
        co: data.co
    };

    const labels = [];
    const values = [];
    const colors = [];

    Object.entries(pollutants).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "N/A") {
            labels.push(key.toUpperCase());
            values.push(value);

            colors.push(
                data.dominantPollutant?.toLowerCase() === key
                    ? "#e74c3c"
                    : "#3498db"
            );
        }
    });

    const canvas = document.getElementById("pollutantChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (pollutantChart) pollutantChart.destroy();

    pollutantChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Pollutant Concentration",
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 800 },
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
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

    const resultBox = document.getElementById("result");
    resultBox.classList.add("hidden");

    try {
        const response = await fetch(`/api/air-quality?city=${encodeURIComponent(city)}`);
        if (!response.ok) throw new Error("API error");

        const data = await response.json();

        // Show result FIRST (important)
        resultBox.classList.remove("hidden");

        // Basic info
        document.getElementById("cityName").innerText = data.city;
        document.getElementById("aqiStatus").innerText = data.status;
        document.getElementById("healthMsg").innerText = data.healthMessage;
        document.getElementById("updatedTime").innerText = data.lastUpdated;

        animateAQI(data.aqi);

        // Pollutants
        document.getElementById("pm25").innerText = data.pm25 ?? "N/A";
        document.getElementById("pm10").innerText = data.pm10 ?? "N/A";
        document.getElementById("no2").innerText = data.no2 ?? "N/A";
        document.getElementById("so2").innerText = data.so2 ?? "N/A";
        document.getElementById("o3").innerText = data.o3 ?? "N/A";
        document.getElementById("co").innerText = data.co ?? "N/A";

        document.getElementById("dominantPollutant").innerText =
            data.dominantPollutant?.toUpperCase() || "N/A";

        // AQI color
        const aqiBox = document.getElementById("aqiBox");
        aqiBox.className = "aqi-box";

        if (data.aqi <= 50) aqiBox.classList.add("aqi-good");
        else if (data.aqi <= 100) aqiBox.classList.add("aqi-moderate");
        else if (data.aqi <= 200) aqiBox.classList.add("aqi-poor");
        else if (data.aqi <= 300) aqiBox.classList.add("aqi-verypoor");
        else aqiBox.classList.add("aqi-severe");

        // Render chart AFTER visible
        setTimeout(() => renderDominantPollutantChart(data), 200);

    } catch (err) {
        console.error("AQI error:", err);
        alert("Failed to fetch AQI data");
    }
}
