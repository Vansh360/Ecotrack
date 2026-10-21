package com.ecotrack.backend.environment;

public record FireHotspot(
        double latitude,
        double longitude,
        String detectedAt,
        String satelliteSource,
        String confidence
) {
}
