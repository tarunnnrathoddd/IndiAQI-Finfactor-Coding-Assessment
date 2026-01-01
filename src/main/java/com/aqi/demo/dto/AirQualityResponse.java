package com.aqi.demo.dto;

public class AirQualityResponse {

    private String city;
    private int aqi;
    private String status;
    private Integer pm25;
    private Integer pm10;
     private Integer no2;
    private Integer so2;
    private Integer o3;
    private Integer co;

    private String healthMessage;
    private String lastUpdated;
    private String source;

    private String dominantPollutant;

public String getDominantPollutant() {
    return dominantPollutant;
}

public void setDominantPollutant(String dominantPollutant) {
    this.dominantPollutant = dominantPollutant;
}

    // getters & setters

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public int getAqi() { return aqi; }
    public void setAqi(int aqi) { this.aqi = aqi; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPm25() { return pm25; }
    public void setPm25(Integer pm25) { this.pm25 = pm25; }

    public Integer getPm10() { return pm10; }
    public void setPm10(Integer pm10) { this.pm10 = pm10; }
    public Integer getNo2() { return no2; }
public void setNo2(Integer no2) { this.no2 = no2; }

public Integer getSo2() { return so2; }
public void setSo2(Integer so2) { this.so2 = so2; }

public Integer getO3() { return o3; }
public void setO3(Integer o3) { this.o3 = o3; }

public Integer getCo() { return co; }
public void setCo(Integer co) { this.co = co; }


    public String getHealthMessage() { return healthMessage; }
    public void setHealthMessage(String healthMessage) { this.healthMessage = healthMessage; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
