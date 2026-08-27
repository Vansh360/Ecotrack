package com.ecotrack.backend.emission;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EmissionFactorSeeder implements CommandLineRunner {

    private final EmissionFactorRepository repository;

    public EmissionFactorSeeder(
            EmissionFactorRepository repository
    ) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {

        // ==========================================
        // TRANSPORTATION
        // ==========================================

        addIfMissing(
                "TRANSPORTATION",
                "CAR",
                0.21,
                "kgCO2e/km"
        );

        addIfMissing(
                "TRANSPORTATION",
                "BUS",
                0.08,
                "kgCO2e/km"
        );

        addIfMissing(
                "TRANSPORTATION",
                "TRAIN",
                0.04,
                "kgCO2e/km"
        );

        addIfMissing(
                "TRANSPORTATION",
                "BIKE",
                0.0,
                "kgCO2e/km"
        );

        addIfMissing(
                "TRANSPORTATION",
                "WALK",
                0.0,
                "kgCO2e/km"
        );


        // ==========================================
        // ELECTRICITY
        // ==========================================

        addIfMissing(
                "ELECTRICITY",
                "GRID",
                0.71,
                "kgCO2e/kWh"
        );


        // ==========================================
        // FOOD
        // ==========================================

        addIfMissing(
                "FOOD",
                "VEGETARIAN",
                1.5,
                "kgCO2e/meal"
        );

        addIfMissing(
                "FOOD",
                "NON_VEGETARIAN",
                3.5,
                "kgCO2e/meal"
        );


        // ==========================================
        // WASTE
        // ==========================================

        addIfMissing(
                "WASTE",
                "PLASTIC",
                1.8,
                "kgCO2e/kg"
        );

        addIfMissing(
                "WASTE",
                "PAPER",
                1.0,
                "kgCO2e/kg"
        );

        addIfMissing(
                "WASTE",
                "GLASS",
                0.5,
                "kgCO2e/kg"
        );

        addIfMissing(
                "WASTE",
                "ORGANIC",
                0.4,
                "kgCO2e/kg"
        );


        // ==========================================
        // WATER
        // ==========================================

        addIfMissing(
                "WATER",
                "TAP_WATER",
                0.0003,
                "kgCO2e/L"
        );


        System.out.println(
                "=========================================="
        );

        System.out.println(
                "EcoTrack emission factors initialized."
        );

        System.out.println(
                "=========================================="
        );
    }


    // ==========================================
    // ADD FACTOR IF IT DOES NOT EXIST
    // ==========================================

    private void addIfMissing(
            String category,
            String activityType,
            double factor,
            String unit
    ) {

        boolean exists =
                repository
                        .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                                category,
                                activityType
                        )
                        .isPresent();

        if (exists) {
            return;
        }


        EmissionFactor entity =
                new EmissionFactor();

        entity.setCategory(
                category
        );

        entity.setActivityType(
                activityType
        );

        entity.setFactor(
                factor
        );

        entity.setUnit(
                unit
        );

        entity.setSource(
                "EcoTrack Default"
        );

        entity.setRegion(
                "INDIA"
        );

        entity.setVersion(
                "1.0"
        );

        entity.setValidFrom(
                LocalDate.now()
        );

        entity.setActive(
                true
        );


        repository.save(entity);


        System.out.println(
                "Added emission factor: "
                + category
                + " / "
                + activityType
        );
    }
}