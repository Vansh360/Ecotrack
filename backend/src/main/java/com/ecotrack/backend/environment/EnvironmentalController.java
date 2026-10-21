package com.ecotrack.backend.environment;

import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/environment")
public class EnvironmentalController {

    private final EnvironmentalService environmentalService;

    public EnvironmentalController(
            EnvironmentalService environmentalService
    ) {
        this.environmentalService = environmentalService;
    }

    @GetMapping("/air-quality")
    public List<AirQualityReading> getAirQuality() {
        return environmentalService.getIndianAirQuality();
    }

    @GetMapping("/fire-hotspots")
    public List<FireHotspot> getFireHotspots(
            @RequestParam(defaultValue = "24h") String period
    ) {
        return environmentalService.getFireHotspots(period);
    }
}
