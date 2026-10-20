package com.ecotrack.backend.simulation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.ecotrack.backend.emission.EmissionFactor;
import com.ecotrack.backend.emission.EmissionFactorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class WhatIfSimulationServiceTest {

    @Mock
    private EmissionFactorRepository emissionFactorRepository;

    private WhatIfSimulationService service;

    @BeforeEach
    void setUp() {
        service = new WhatIfSimulationService(emissionFactorRepository);
    }

    @Test
    void calculatesElectricityReductionUsingTheStoredGridFactor() {
        givenFactor("ELECTRICITY", "GRID", 0.71);

        WhatIfSimulationDtos.Response result = service.simulate(
                new WhatIfSimulationDtos.Request("electricity", 300.0, 20.0)
        );

        assertEquals(213.0, result.baselineEmissions(), 0.00001);
        assertEquals(170.4, result.simulatedEmissions(), 0.00001);
        assertEquals(42.6, result.co2eAvoided(), 0.00001);
        assertEquals("kg CO2e", result.unit());
        assertTrue(result.isSimulation());
        verify(emissionFactorRepository)
                .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                        "ELECTRICITY",
                        "GRID"
                );
    }

    @Test
    void calculatesTransportSubstitutionUsingStoredCarAndBusFactors() {
        givenFactor("TRANSPORTATION", "CAR", 0.174);
        givenFactor("TRANSPORTATION", "BUS", 0.104);

        WhatIfSimulationDtos.Response result = service.simulate(
                new WhatIfSimulationDtos.Request("transport", 100.0, 50.0)
        );

        assertEquals(17.4, result.baselineEmissions(), 0.00001);
        assertEquals(13.9, result.simulatedEmissions(), 0.00001);
        assertEquals(3.5, result.co2eAvoided(), 0.00001);
    }

    @Test
    void calculatesSolarAsGridElectricityDisplaced() {
        givenFactor("ELECTRICITY", "GRID", 0.71);

        WhatIfSimulationDtos.Response result = service.simulate(
                new WhatIfSimulationDtos.Request("solar", 300.0, 25.0)
        );

        assertEquals(213.0, result.baselineEmissions(), 0.00001);
        assertEquals(159.75, result.simulatedEmissions(), 0.00001);
        assertEquals(53.25, result.co2eAvoided(), 0.00001);
        assertTrue(result.assumptions().contains("lifecycle emissions are excluded"));
    }

    @Test
    void rejectsOutOfRangePercentagesAndUnknownScenarios() {
        ResponseStatusException invalidPercent = assertThrows(
                ResponseStatusException.class,
                () -> service.simulate(
                        new WhatIfSimulationDtos.Request("electricity", 10.0, 101.0)
                )
        );
        assertEquals(HttpStatus.BAD_REQUEST, invalidPercent.getStatusCode());

        ResponseStatusException unknownScenario = assertThrows(
                ResponseStatusException.class,
                () -> service.simulate(
                        new WhatIfSimulationDtos.Request("unknown", 10.0, 10.0)
                )
        );
        assertEquals(HttpStatus.BAD_REQUEST, unknownScenario.getStatusCode());
    }

    @Test
    void reportsMissingFactorsInsteadOfSubstitutingAClientSuppliedValue() {
        when(emissionFactorRepository
                .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                        "ELECTRICITY",
                        "GRID"
                ))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.simulate(
                        new WhatIfSimulationDtos.Request("electricity", 10.0, 10.0)
                )
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    private void givenFactor(String category, String activityType, double value) {
        EmissionFactor factor = new EmissionFactor();
        factor.setCategory(category);
        factor.setActivityType(activityType);
        factor.setFactor(value);

        when(emissionFactorRepository
                .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                        category,
                        activityType
                ))
                .thenReturn(Optional.of(factor));
    }
}
