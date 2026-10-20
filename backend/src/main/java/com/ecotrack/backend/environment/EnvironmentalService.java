package com.ecotrack.backend.environment;

import java.net.URI;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.databind.JsonNode;

@Service
public class EnvironmentalService {

    private static final Logger logger =
            LoggerFactory.getLogger(EnvironmentalService.class);
    private static final String OPENAQ_BASE_URL =
            "https://api.openaq.org/v3";
    private static final String FIRMS_BASE_URL =
            "https://firms.modaps.eosdis.nasa.gov";
    private static final List<String> FIRMS_SOURCES = List.of(
            "VIIRS_SNPP_NRT",
            "VIIRS_NOAA20_NRT",
            "VIIRS_NOAA21_NRT"
    );
    private static final String PM25_UNIT = "µg/m³";

    private final RestClient client;
    private final String apiKey;
    private final String firmsMapKey;

    public EnvironmentalService(
            RestClient.Builder restClientBuilder,
            @Value("${openaq.api-key:}") String apiKey,
            @Value("${firms.map-key:}") String firmsMapKey
    ) {
        this.client = restClientBuilder
                .baseUrl(OPENAQ_BASE_URL)
                .build();
        this.apiKey = apiKey;
        this.firmsMapKey = firmsMapKey;
    }

    public List<AirQualityReading> getIndianAirQuality() {
        JsonNode locationsResponse = getJson(
                "/locations?iso=IN&parameters_id=2&limit=1000&page=1"
        );
        JsonNode latestResponse = getJson(
                "/parameters/2/latest?limit=1000&page=1"
        );

        Map<Integer, JsonNode> locations = new HashMap<>();
        for (JsonNode location : locationsResponse.path("results")) {
            int locationId = location.path("id").asInt(-1);
            if (locationId >= 0) {
                locations.put(locationId, location);
            }
        }

        Map<Integer, AirQualityReading> latestByLocation = new HashMap<>();
        for (JsonNode reading : latestResponse.path("results")) {
            int locationId = reading.path("locationsId").asInt(-1);
            JsonNode location = locations.get(locationId);

            if (location == null || !reading.path("value").isNumber()) {
                continue;
            }

            JsonNode coordinates = location.path("coordinates");
            Double latitude = numberOrNull(coordinates.path("latitude"));
            Double longitude = numberOrNull(coordinates.path("longitude"));

            String measuredAt = reading.path("datetime")
                    .path("utc")
                    .asText("");
            if (measuredAt.isBlank()) {
                measuredAt = reading.path("datetime")
                        .path("local")
                        .asText("");
            }

            AirQualityReading item = new AirQualityReading(
                    locationId,
                    location.path("name").asText("Unknown station"),
                    location.path("locality").asText(
                            location.path("city").asText("India")
                    ),
                    reading.path("value").asDouble(),
                    reading.path("unit").asText(PM25_UNIT),
                    measuredAt,
                    latitude,
                    longitude
            );

            latestByLocation.putIfAbsent(locationId, item);
        }

        return latestByLocation.values().stream()
                .sorted(
                        Comparator.comparing(
                                AirQualityReading::pm25,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .toList();
    }

    public List<FireHotspot> getFireHotspots(String period) {
        int dayRange = switch (period) {
            case "24h" -> 1;
            case "48h" -> 2;
            case "7d" -> 7;
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Period must be one of: 24h, 48h, or 7d."
            );
        };

        if (firmsMapKey == null || firmsMapKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "NASA FIRMS is not configured. Configure FIRMS_MAP_KEY."
            );
        }

        List<FireHotspot> hotspots = new ArrayList<>();
        for (String source : FIRMS_SOURCES) {
            String path = "/api/country/csv/" + firmsMapKey + "/"
                    + source + "/IND/" + dayRange;
            String csv;
            try {
                csv = client.get()
                        .uri(URI.create(FIRMS_BASE_URL + path))
                        .retrieve()
                        .body(String.class);
            } catch (RestClientException exception) {
                logger.warn(
                        "NASA FIRMS request failed for source {}.",
                        source
                );
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Unable to retrieve fire detections from NASA FIRMS.",
                        exception
                );
            }

            if (csv == null || csv.isBlank()) {
                continue;
            }
            hotspots.addAll(parseFireHotspots(csv, source));
        }

        return List.copyOf(hotspots);
    }

    private static List<FireHotspot> parseFireHotspots(
            String csv,
            String source
    ) {
        String[] lines = csv.strip().split("\\R");
        String[] headers = lines[0].replace("\uFEFF", "")
                .split(",", -1);
        Map<String, Integer> columns = new HashMap<>();
        for (int index = 0; index < headers.length; index++) {
            columns.put(headers[index].strip().toLowerCase(), index);
        }

        int latitudeColumn = requiredColumn(columns, "latitude");
        int longitudeColumn = requiredColumn(columns, "longitude");
        int dateColumn = requiredColumn(columns, "acq_date");
        int timeColumn = requiredColumn(columns, "acq_time");
        Integer satelliteColumn = columns.get("satellite");
        Integer confidenceColumn = columns.get("confidence");

        List<FireHotspot> hotspots = new ArrayList<>();
        for (int rowIndex = 1; rowIndex < lines.length; rowIndex++) {
            String line = lines[rowIndex].strip();
            if (line.isEmpty()) {
                continue;
            }

            String[] fields = line.split(",", -1);
            try {
                double latitude = Double.parseDouble(
                        field(fields, latitudeColumn)
                );
                double longitude = Double.parseDouble(
                        field(fields, longitudeColumn)
                );
                if (!Double.isFinite(latitude)
                        || latitude < -90 || latitude > 90
                        || !Double.isFinite(longitude)
                        || longitude < -180 || longitude > 180) {
                    throw new IllegalArgumentException(
                            "Coordinates are outside the valid range."
                    );
                }

                String date = field(fields, dateColumn);
                String time = field(fields, timeColumn);
                LocalDate acquisitionDate = LocalDate.parse(date);
                LocalTime acquisitionTime = LocalTime.parse(
                        String.format("%4s", time).replace(' ', '0'),
                        DateTimeFormatter.ofPattern("HHmm")
                );
                String satellite = satelliteColumn == null
                        ? ""
                        : field(fields, satelliteColumn);
                String confidence = confidenceColumn == null
                        ? ""
                        : field(fields, confidenceColumn);

                hotspots.add(new FireHotspot(
                        latitude,
                        longitude,
                        OffsetDateTime.of(
                                acquisitionDate,
                                acquisitionTime,
                                ZoneOffset.UTC
                        ).toString(),
                        satelliteSource(satellite, source),
                        confidence.isBlank() ? null : confidence
                ));
            } catch (IllegalArgumentException | DateTimeException exception) {
                logger.warn(
                        "Skipping malformed NASA FIRMS row {} from {}.",
                        rowIndex + 1,
                        source
                );
            }
        }
        return hotspots;
    }

    private static int requiredColumn(
            Map<String, Integer> columns,
            String name
    ) {
        Integer index = columns.get(name);
        if (index == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "NASA FIRMS returned data in an unexpected format."
            );
        }
        return index;
    }

    private static String field(String[] fields, int index) {
        if (index >= fields.length) {
            throw new IllegalArgumentException(
                    "NASA FIRMS row is missing a required field."
            );
        }
        return fields[index].strip();
    }

    private static String satelliteSource(String satellite, String source) {
        return switch (satellite.strip().toUpperCase()) {
            case "N" -> "VIIRS / Suomi NPP";
            case "N20" -> "VIIRS / NOAA-20";
            case "N21" -> "VIIRS / NOAA-21";
            case "T" -> "MODIS / Terra";
            case "A" -> "MODIS / Aqua";
            default -> satellite.isBlank() ? source : satellite;
        };
    }

    private JsonNode getJson(String path) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "OpenAQ API key is missing. Configure OPENAQ_API_KEY."
            );
        }

        try {
            JsonNode response = client.get()
                    .uri(path)
                    .header("X-API-Key", apiKey)
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "OpenAQ returned an empty response."
                );
            }
            return response;
        } catch (RestClientException exception) {
            logger.warn("OpenAQ request failed: {}", exception.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unable to retrieve air-quality data from OpenAQ.",
                    exception
            );
        }
    }

    private static Double numberOrNull(JsonNode value) {
        return value.isNumber() ? value.asDouble() : null;
    }
}
