package com.ecotrack.backend.environment;

public record AirQualityReading(
        int locationId,
        String location,
        String region,
        Double pm25,
        String unit,
        String measuredAt,
        Double latitude,
        Double longitude
) {
}
