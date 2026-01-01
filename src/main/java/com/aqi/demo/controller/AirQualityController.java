package com.aqi.demo.controller;

import com.aqi.demo.service.AirQualityService;
import org.springframework.web.bind.annotation.*;

@RestController
public class AirQualityController {

    private final AirQualityService airQualityService;

    public AirQualityController(AirQualityService airQualityService) {
        this.airQualityService = airQualityService;
    }

    @GetMapping("/api/air-quality")
    public Object getAirQuality(@RequestParam String city) {
        return airQualityService.getAqiData(city);
    }
}
