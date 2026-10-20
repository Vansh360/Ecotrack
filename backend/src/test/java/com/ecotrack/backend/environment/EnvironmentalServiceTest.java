package com.ecotrack.backend.environment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

class EnvironmentalServiceTest {

    @Test
    void getsIndianPm25ReadingsAndSortsHighestFirst() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();
        EnvironmentalService service =
                new EnvironmentalService(builder, "test-api-key", "");

        server.expect(requestTo(
                        "https://api.openaq.org/v3/locations"
                                + "?iso=IN&parameters_id=2&limit=1000&page=1"
                ))
                .andExpect(header("X-API-Key", "test-api-key"))
                .andRespond(withSuccess(
                        """
                        {
                          "results": [
                            {
                              "id": 10,
                              "name": "Central station",
                              "locality": "Delhi",
                              "coordinates": {
                                "latitude": 28.6,
                                "longitude": 77.2
                              }
                            },
                            {
                              "id": 20,
                              "name": "Harbor station",
                              "locality": "Mumbai"
                            }
                          ]
                        }
                        """,
                        MediaType.APPLICATION_JSON
                ));
        server.expect(requestTo(
                        "https://api.openaq.org/v3/parameters/2/latest"
                                + "?limit=1000&page=1"
                ))
                .andExpect(header("X-API-Key", "test-api-key"))
                .andRespond(withSuccess(
                        """
                        {
                          "results": [
                            {
                              "locationsId": 10,
                              "value": 12.5,
                              "unit": "µg/m³",
                              "datetime": {"utc": "2026-10-17T10:00:00Z"}
                            },
                            {
                              "locationsId": 20,
                              "value": 31.0,
                              "datetime": {"utc": "2026-10-17T10:05:00Z"}
                            },
                            {
                              "locationsId": 99,
                              "value": 100.0
                            }
                          ]
                        }
                        """,
                        MediaType.APPLICATION_JSON
                ));

        List<AirQualityReading> readings = service.getIndianAirQuality();

        assertEquals(2, readings.size());
        assertEquals("Harbor station", readings.get(0).location());
        assertEquals(31.0, readings.get(0).pm25());
        assertEquals("Central station", readings.get(1).location());
        assertEquals(28.6, readings.get(1).latitude());
        assertEquals("2026-10-17T10:00:00Z", readings.get(1).measuredAt());
        server.verify();
    }

    @Test
    void reportsMissingApiKeyAsServiceUnavailable() {
        EnvironmentalService service =
                new EnvironmentalService(RestClient.builder(), " ", "");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                service::getIndianAirQuality
        );

        assertEquals(
                HttpStatus.SERVICE_UNAVAILABLE,
                exception.getStatusCode()
        );
    }

    @Test
    void getsFireHotspotsWithSourceTimeCoordinatesAndConfidence() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();
        EnvironmentalService service =
                new EnvironmentalService(builder, "", "test-firms-key");
        String csv = """
                latitude,longitude,acq_date,acq_time,satellite,confidence
                28.6,77.2,2026-10-17,1030,N20,nominal
                """;

        for (String source : List.of(
                "VIIRS_SNPP_NRT",
                "VIIRS_NOAA20_NRT",
                "VIIRS_NOAA21_NRT"
        )) {
            server.expect(requestTo(
                            "https://firms.modaps.eosdis.nasa.gov/api/country/csv/"
                                    + "test-firms-key/" + source + "/IND/2"
                    ))
                    .andRespond(withSuccess(csv, MediaType.TEXT_PLAIN));
        }

        List<FireHotspot> hotspots = service.getFireHotspots("48h");

        assertEquals(3, hotspots.size());
        assertEquals(28.6, hotspots.get(0).latitude());
        assertEquals(77.2, hotspots.get(0).longitude());
        assertEquals(
                "2026-10-17T10:30Z",
                hotspots.get(0).detectedAt()
        );
        assertEquals(
                "VIIRS / NOAA-20",
                hotspots.get(0).satelliteSource()
        );
        assertEquals("nominal", hotspots.get(0).confidence());
        server.verify();
    }

    @Test
    void acceptsMissingConfidenceInFireHotspotData() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();
        EnvironmentalService service =
                new EnvironmentalService(builder, "", "test-firms-key");
        String csv = """
                latitude,longitude,acq_date,acq_time,satellite
                28.6,77.2,2026-10-17,1030,N
                """;

        for (String source : List.of(
                "VIIRS_SNPP_NRT",
                "VIIRS_NOAA20_NRT",
                "VIIRS_NOAA21_NRT"
        )) {
            server.expect(requestTo(
                            "https://firms.modaps.eosdis.nasa.gov/api/country/csv/"
                                    + "test-firms-key/" + source + "/IND/1"
                    ))
                    .andRespond(withSuccess(csv, MediaType.TEXT_PLAIN));
        }

        List<FireHotspot> hotspots = service.getFireHotspots("24h");

        assertEquals(3, hotspots.size());
        assertNull(hotspots.get(0).confidence());
        assertEquals("VIIRS / Suomi NPP", hotspots.get(0).satelliteSource());
        server.verify();
    }

    @Test
    void rejectsUnsupportedFireHotspotPeriod() {
        EnvironmentalService service =
                new EnvironmentalService(RestClient.builder(), "", "test-key");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getFireHotspots("30d")
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void reportsMissingFirmsMapKeyAsServiceUnavailable() {
        EnvironmentalService service =
                new EnvironmentalService(RestClient.builder(), "", " ");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getFireHotspots("24h")
        );

        assertEquals(
                HttpStatus.SERVICE_UNAVAILABLE,
                exception.getStatusCode()
        );
    }
}
