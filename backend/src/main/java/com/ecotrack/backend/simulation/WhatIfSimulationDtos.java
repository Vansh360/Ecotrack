package com.ecotrack.backend.simulation;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class WhatIfSimulationDtos {

    private WhatIfSimulationDtos() {
    }

    public record Request(
            @NotBlank String scenario,
            @NotNull @DecimalMin("0.0") Double baselineValue,
            @NotNull @DecimalMin("0.0") @DecimalMax("100.0") Double changePercent
    ) {
    }

    public record Response(
            String scenario,
            double baselineEmissions,
            double simulatedEmissions,
            double co2eAvoided,
            String unit,
            String assumptions,
            boolean isSimulation
    ) {
    }
}
