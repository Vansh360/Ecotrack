package com.ecotrack.backend.simulation;

import com.ecotrack.backend.emission.EmissionFactor;
import com.ecotrack.backend.emission.EmissionFactorRepository;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WhatIfSimulationService {

    private static final String UNIT = "kg CO2e";

    private final EmissionFactorRepository emissionFactorRepository;

    public WhatIfSimulationService(
            EmissionFactorRepository emissionFactorRepository
    ) {
        this.emissionFactorRepository = emissionFactorRepository;
    }

    public WhatIfSimulationDtos.Response simulate(
            WhatIfSimulationDtos.Request request
    ) {
        if (request == null
                || request.scenario() == null
                || request.scenario().isBlank()
                || request.baselineValue() == null
                || !Double.isFinite(request.baselineValue())
                || request.baselineValue() < 0
                || request.changePercent() == null
                || !Double.isFinite(request.changePercent())
                || request.changePercent() < 0
                || request.changePercent() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Baseline must be non-negative and changePercent must be 0–100."
            );
        }

        String scenario = request.scenario()
                .trim()
                .toLowerCase(Locale.ROOT);
        double activity = request.baselineValue();
        double changeFraction = request.changePercent() / 100.0;

        double baseline;
        double simulated;
        String assumptions;

        switch (scenario) {
            case "electricity" -> {
                double gridFactor = factor("ELECTRICITY", "GRID");
                baseline = activity * gridFactor;
                simulated = activity * (1 - changeFraction) * gridFactor;
                assumptions = "Assumes grid electricity use falls by the specified "
                        + "percentage and the current grid emission factor remains constant.";
            }
            case "transport" -> {
                double carFactor = factor("TRANSPORTATION", "CAR");
                double publicTransportFactor = factor("TRANSPORTATION", "BUS");
                baseline = activity * carFactor;
                simulated = activity * (1 - changeFraction) * carFactor
                        + activity * changeFraction * publicTransportFactor;
                assumptions = "Assumes the specified percentage of car travel is "
                        + "replaced by bus travel over the same distance; emission "
                        + "factors remain constant.";
            }
            case "solar" -> {
                double gridFactor = factor("ELECTRICITY", "GRID");
                baseline = activity * gridFactor;
                simulated = activity * (1 - changeFraction) * gridFactor;
                assumptions = "Assumes campus solar supplies the specified percentage "
                        + "of electricity demand and displaces grid electricity with "
                        + "zero operational emissions; lifecycle emissions are excluded.";
            }
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Scenario must be electricity, transport, or solar."
            );
        }

        if (!Double.isFinite(baseline) || !Double.isFinite(simulated)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The requested activity value is too large to simulate."
            );
        }

        return new WhatIfSimulationDtos.Response(
                scenario,
                baseline,
                simulated,
                baseline - simulated,
                UNIT,
                assumptions,
                true
        );
    }

    private double factor(String category, String activityType) {
        EmissionFactor emissionFactor = emissionFactorRepository
                .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                        category,
                        activityType
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Emission factor not found for " + category + " " + activityType + "."
                ));

        double value = emissionFactor.getFactor();
        if (!Double.isFinite(value) || value < 0) {
            throw new IllegalStateException(
                    "Emission factor for " + category + " " + activityType
                            + " must be finite and non-negative."
            );
        }
        return value;
    }
}
