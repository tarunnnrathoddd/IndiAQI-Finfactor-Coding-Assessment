package com.aqi.demo.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AqicnClient {

    @Value("${aqicn.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate = new RestTemplate();

    public String fetchCityAqi(String city) {
        String url = "https://api.waqi.info/feed/" + city + "/?token=" + apiToken;
        return restTemplate.getForObject(url, String.class);
    }
}
