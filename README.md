# 🌍 Air Quality Index (AQI) Search Engine – Java Project

## 📌 Overview
This project is a city-based **Air Quality Index (AQI) search engine** built using **Java (Spring Boot)** for backend and **HTML, CSS, JavaScript** for frontend.

It fetches real-time air quality data using the **AQICN API**, processes it efficiently using caching, and displays meaningful air quality insights including health recommendations and pollutant breakdowns.

This project was developed as part of a technical assignment to evaluate problem-solving skills, backend engineering, API integration, and creativity.

---

## 🚀 Features

### Core Features
- Search AQI by city name
- REST API built with Java & Spring Boot
- Real-time AQI data via AQICN API
- Clean JSON response
- AQI categorization (Good → Severe)
- Health recommendations based on AQI
- Color-coded AQI UI
- Intelligent in-memory caching (TTL + max size)

### Advanced Enhancements
- Dominant pollutant detection (API + auto-computed fallback)
- Pollutant breakdown:
  - PM2.5
  - PM10
  - NO₂
  - SO₂
  - O₃
  - CO
- Graceful handling of missing data
- Performance optimized design

---

## 🧩 Tech Stack

**Backend**
- Java 17
- Spring Boot
- Spring Cache + Caffeine
- Jackson
- Maven

**Frontend**
- HTML
- CSS
- JavaScript (Fetch API)

**External API**
- AQICN – World Air Quality Index  
  https://aqicn.org/api/

---

## 📂 Project Structure

demo/
├── src/main/java/com/aqi/demo
│ ├── controller
│ ├── service
│ ├── client
│ ├── dto
│ ├── config
│ └── IndiAqiApplication.java
│
├── src/main/resources
│ ├── static
│ │ ├── index.html
│ │ ├── style.css
│ │ └── app.js
│ └── application.properties
│
├── pom.xml
└── mvnw


---

## ⚙️ How to Run the Project

### Prerequisites
- Java 17+
- Maven or Maven Wrapper
- Internet connection

### Step 1: Clone Repository

git clone <repository-url>

cd demo

### Step 2: Add AQICN API Token

Edit application.properties:

aqicn.api.token=YOUR_API_TOKEN

### Step 3: Run Application

./mvnw spring-boot:run

### Step 4: Open Browser

http://localhost:8080

### 📡 Sample API Endpoint

GET /api/air-quality?city=Delhi

