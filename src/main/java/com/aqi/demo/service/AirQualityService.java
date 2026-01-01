package com.aqi.demo.service;

import java.util.Iterator;

import com.aqi.demo.client.AqicnClient;
import com.aqi.demo.dto.AirQualityResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class AirQualityService {

    private final AqicnClient aqicnClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AirQualityService(AqicnClient aqicnClient) {
        this.aqicnClient = aqicnClient;
    }

    @Cacheable(value = "aqiCache", key = "#city.toLowerCase()")
    public AirQualityResponse getAqiData(String city) {

        try {
            // 1. Get raw JSON from AQICN
            String rawJson = aqicnClient.fetchCityAqi(city);

            // 2. Parse JSON
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode data = root.get("data");

            // 3. Extract base fields
            int aqi = data.get("aqi").asInt();
            String cityName = data.get("city").get("name").asText();
            String lastUpdated = data.get("time").get("s").asText();

            Integer pm25 = data.has("iaqi") && data.get("iaqi").has("pm25")
                    ? data.get("iaqi").get("pm25").get("v").asInt()
                    : null;

            Integer pm10 = data.has("iaqi") && data.get("iaqi").has("pm10")
                    ? data.get("iaqi").get("pm10").get("v").asInt()
                    : null;
                    Integer no2 = data.has("iaqi") && data.get("iaqi").has("no2")
        ? data.get("iaqi").get("no2").get("v").asInt()
        : null;

        Integer so2 = data.has("iaqi") && data.get("iaqi").has("so2")
        ? data.get("iaqi").get("so2").get("v").asInt()
        : null;

        Integer o3 = data.has("iaqi") && data.get("iaqi").has("o3")
        ? data.get("iaqi").get("o3").get("v").asInt()
        : null;

        Integer co = data.has("iaqi") && data.get("iaqi").has("co")
        ? data.get("iaqi").get("co").get("v").asInt()
        : null;


            // 4. Dominant Pollutant (API → fallback computation)
            String dominantPollutant = "N/A";

            // Prefer AQICN provided dominant pollutant
            if (data.has("dominentpol")) {
                dominantPollutant = data.get("dominentpol").asText();
            }
            // Otherwise compute from IAQI
            else if (data.has("iaqi")) {
                JsonNode iaqi = data.get("iaqi");
                int maxValue = -1;

                Iterator<String> pollutants = iaqi.fieldNames();
                while (pollutants.hasNext()) {
                    String pollutant = pollutants.next();
                    JsonNode pollutantNode = iaqi.get(pollutant);

                    if (pollutantNode.has("v")) {
                        int value = pollutantNode.get("v").asInt();

                        if (value > maxValue) {
                            maxValue = value;
                            dominantPollutant = pollutant;
                        }
                    }
                }
            }

            // 5. Create response
            AirQualityResponse response = new AirQualityResponse();
            response.setCity(cityName);
            response.setAqi(aqi);
            response.setStatus(resolveStatus(aqi));
            response.setHealthMessage(resolveHealthMessage(aqi));
            response.setDominantPollutant(dominantPollutant);
            response.setPm25(pm25);
            response.setPm10(pm10);
            response.setNo2(no2);
            response.setSo2(so2);
            response.setO3(o3);
            response.setCo(co);

            response.setLastUpdated(lastUpdated);
            response.setSource("AQICN");

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AQI data", e);
        }
    }

    // AQI → category
    private String resolveStatus(int aqi) {
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 200) return "Poor";
        if (aqi <= 300) return "Very Poor";
        return "Severe";
    }

    // AQI → human explanation (Dhruv-style)
    private String resolveHealthMessage(int aqi) {
        if (aqi <= 50)
            return "Air quality is satisfactory and poses little or no risk.";
        if (aqi <= 100)
            return "Air quality is acceptable, but sensitive individuals may experience discomfort.";
        if (aqi <= 200)
            return "Breathing discomfort for people with lung or heart disease.";
        if (aqi <= 300)
            return "Increased risk of respiratory illness. Avoid prolonged outdoor activity.";
        return "Air is hazardous for everyone. Avoid outdoor exposure.";
    }
}
