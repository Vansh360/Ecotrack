// package com.ecotrack.backend.emission;

// import java.time.LocalDate;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// @Component
// public class EmissionFactorSeeder implements CommandLineRunner {

//     private final EmissionFactorRepository repository;

//     public EmissionFactorSeeder(
//             EmissionFactorRepository repository
//     ) {
//         this.repository = repository;
//     }

//     @Override
//     public void run(String... args) {

//         // ==========================================
//         // TRANSPORTATION
//         // ==========================================

//         addIfMissing(
//                 "TRANSPORTATION",
//                 "CAR",
//                 0.21,
//                 "kgCO2e/km"
//         );

//         addIfMissing(
//                 "TRANSPORTATION",
//                 "BUS",
//                 0.08,
//                 "kgCO2e/km"
//         );

//         addIfMissing(
//                 "TRANSPORTATION",
//                 "TRAIN",
//                 0.04,
//                 "kgCO2e/km"
//         );

//         addIfMissing(
//                 "TRANSPORTATION",
//                 "BIKE",
//                 0.0,
//                 "kgCO2e/km"
//         );

//         addIfMissing(
//                 "TRANSPORTATION",
//                 "WALK",
//                 0.0,
//                 "kgCO2e/km"
//         );


//         // ==========================================
//         // ELECTRICITY
//         // ==========================================

//         addIfMissing(
//                 "ELECTRICITY",
//                 "GRID",
//                 0.71,
//                 "kgCO2e/kWh"
//         );


//         // ==========================================
//         // FOOD
//         // ==========================================

//         addIfMissing(
//                 "FOOD",
//                 "VEGETARIAN",
//                 1.5,
//                 "kgCO2e/meal"
//         );

//         addIfMissing(
//                 "FOOD",
//                 "NON_VEGETARIAN",
//                 3.5,
//                 "kgCO2e/meal"
//         );


//         // ==========================================
//         // WASTE
//         // ==========================================

//         addIfMissing(
//                 "WASTE",
//                 "GENERAL_WASTE",
//                 1.5,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "FOOD_WASTE",
//                 0.8,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "PLASTIC_WASTE",
//                 2.5,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "PAPER_WASTE",
//                 1.3,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "GLASS_WASTE",
//                 0.5,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "METAL_WASTE",
//                 1.2,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "E_WASTE",
//                 1.8,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "TEXTILE_WASTE",
//                 1.4,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "ORGANIC_WASTE",
//                 0.4,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "HAZARDOUS_WASTE",
//                 2.4,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "MEDICAL_WASTE",
//                 2.1,
//                 "kgCO2e/kg"
//         );

//         addIfMissing(
//                 "WASTE",
//                 "CONSTRUCTION_WASTE",
//                 1.7,
//                 "kgCO2e/kg"
//         );


//         // ==========================================
//         // WATER
//         // ==========================================

//         addIfMissing(
//                 "WATER",
//                 "DRINKING_WATER",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "SHOWER_BATH",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "TOILET_FLUSHING",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "LAUNDRY",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "DISHWASHING",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "GARDENING",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "CAR_WASHING",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "HOUSE_CLEANING",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "COOKING",
//                 0.0003,
//                 "kgCO2e/L"
//         );

//         addIfMissing(
//                 "WATER",
//                 "RAINWATER_REUSED",
//                 0.0001,
//                 "kgCO2e/L"
//         );


//         System.out.println(
//                 "=========================================="
//         );

//         System.out.println(
//                 "EcoTrack emission factors initialized."
//         );

//         System.out.println(
//                 "=========================================="
//         );
//     }


//     // ==========================================
//     // ADD FACTOR IF IT DOES NOT EXIST
//     // ==========================================

//     private void addIfMissing(
//             String category,
//             String activityType,
//             double factor,
//             String unit
//     ) {

//         boolean exists =
//                 repository
//                         .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
//                                 category,
//                                 activityType
//                         )
//                         .isPresent();

//         if (exists) {
//             return;
//         }


//         EmissionFactor entity =
//                 new EmissionFactor();

//         entity.setCategory(
//                 category
//         );

//         entity.setActivityType(
//                 activityType
//         );

//         entity.setFactor(
//                 factor
//         );

//         entity.setUnit(
//                 unit
//         );

//         entity.setSource(
//                 "EcoTrack Default"
//         );

//         entity.setRegion(
//                 "INDIA"
//         );

//         entity.setVersion(
//                 "1.0"
//         );

//         entity.setValidFrom(
//                 LocalDate.now()
//         );

//         entity.setActive(
//                 true
//         );


//         repository.save(entity);


//         System.out.println(
//                 "Added emission factor: "
//                 + category
//                 + " / "
//                 + activityType
//         );
//     }
// }


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

        /*
         * Source:
         * Carbon Emission Factors Reference Guide
         *
         * Car - Direct emissions:
         * 0.174 kg CO2e/km
         */
        addOrUpdate(
                "TRANSPORTATION",
                "CAR",
                0.174,
                "kgCO2e/km",
                "UK Defra / Climate Environmental Data",
                "GLOBAL",
                "2.0"
        );


        /*
         * Train - Electric:
         * 0.035 kg CO2e/person/km
         */
        addIfMissing(
                "TRANSPORTATION",
                "TRAIN",
                0.035,
                "kgCO2e/person/km",
                "UK DESNZ / DEFRA and EEA",
                "GLOBAL",
                "1.0"
        );


        /*
         * Local city bus:
         * 0.104 kg CO2e/person/km
         */
        addIfMissing(
                "TRANSPORTATION",
                "BUS",
                0.104,
                "kgCO2e/person/km",
                "Carbon Emission Factors Reference Guide",
                "GLOBAL",
                "1.0"
        );


        /*
         * Bike is not provided in the uploaded PDF.
         * Keep this as a provisional application value.
         */
        addIfMissing(
                "TRANSPORTATION",
                "BIKE",
                0.103,
                "kgCO2e/km",
                "EcoTrack provisional factor - PDF does not specify",
                "INDIA",
                "1.0"
        );


        /*
         * Walking has no direct operational CO2e
         * in this application.
         */
        addIfMissing(
                "TRANSPORTATION",
                "WALK",
                0.0,
                "kgCO2e/km",
                "EcoTrack assumption",
                "INDIA",
                "1.0"
        );


        // ==========================================
        // ELECTRICITY
        // ==========================================

        /*
         * Electricity:
         * 0.71 kg CO2e/kWh
         *
         * Source: Indian Central Electricity Authority
         */
        addIfMissing(
                "ELECTRICITY",
                "GRID",
                0.71,
                "kgCO2e/kWh",
                "Indian Central Electricity Authority (CEA)",
                "INDIA",
                "1.0"
        );


        // ==========================================
        // FOOD
        // ==========================================

        /*
         * Values from the uploaded PDF:
         *
         * Beef        99.48
         * Lamb/Mutton 39.72
         * Pork        12.31
         * Chicken      9.87
         * Eggs         4.67
         * Cheese      23.88
         * Rice         4.45
         * Tofu         3.16
         * Tomatoes     2.09
         * Lentils      0.98
         * Potatoes     0.46
         */

        addIfMissing(
                "FOOD",
                "BEEF",
                99.48,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "LAMB_MUTTON",
                39.72,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "PORK",
                12.31,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "CHICKEN",
                9.87,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "EGGS",
                4.67,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "CHEESE",
                23.88,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "RICE",
                4.45,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "TOFU",
                3.16,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "TOMATOES",
                2.09,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "LENTILS_PEAS",
                0.98,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "FOOD",
                "POTATOES",
                0.46,
                "kgCO2e/kg",
                "Our World in Data - Poore & Nemecek",
                "GLOBAL",
                "1.0"
        );


        // ==========================================
        // WASTE
        // ==========================================

        /*
         * Plastic waste:
         *
         * The PDF gives:
         * Generation = 2.5 - 5 kg CO2e
         * per 1 kg plastic resin
         *
         * It also gives:
         * Landfill    = 0.033 kg CO2e
         * Incineration = 2.7 kg CO2e
         *
         * We use 2.5 as the lower-bound generation
         * value because the source provides a range.
         */
        addIfMissing(
                "WASTE",
                "PLASTIC_WASTE",
                2.5,
                "kgCO2e/kg",
                "Journal of Cleaner Production / ScienceDirect",
                "GLOBAL",
                "1.0"
        );


        /*
         * Medical waste:
         * 0.25 kg CO2e/kg
         */
        addIfMissing(
                "WASTE",
                "MEDICAL_WASTE",
                0.25,
                "kgCO2e/kg",
                "UK National Health Service (NHS), via ResearchGate",
                "GLOBAL",
                "1.0"
        );


        /*
         * The uploaded PDF does not provide
         * factors for the following categories.
         *
         * These remain provisional until you provide
         * a validated source.
         */

        addIfMissing(
                "WASTE",
                "GENERAL_WASTE",
                1.5,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "FOOD_WASTE",
                0.8,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "PAPER_WASTE",
                1.3,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "GLASS_WASTE",
                0.5,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "METAL_WASTE",
                1.2,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "E_WASTE",
                1.8,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "TEXTILE_WASTE",
                1.4,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "ORGANIC_WASTE",
                0.4,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "HAZARDOUS_WASTE",
                2.4,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );

        addIfMissing(
                "WASTE",
                "CONSTRUCTION_WASTE",
                1.7,
                "kgCO2e/kg",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );


        // ==========================================
        // WATER
        // ==========================================

        /*
         * Tap water:
         * 0.0003 kg CO2e/L
         */
        addIfMissing(
                "WATER",
                "DRINKING_WATER",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "SHOWER_BATH",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "TOILET_FLUSHING",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "LAUNDRY",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "DISHWASHING",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "GARDENING",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "CAR_WASHING",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "HOUSE_CLEANING",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        addIfMissing(
                "WATER",
                "COOKING",
                0.0003,
                "kgCO2e/L",
                "Danfoss study on potable water footprints",
                "GLOBAL",
                "1.0"
        );

        /*
         * Rainwater reused:
         * The PDF does not specify this factor.
         * Keep existing provisional value.
         */
        addIfMissing(
                "WATER",
                "RAINWATER_REUSED",
                0.0001,
                "kgCO2e/L",
                "EcoTrack provisional factor",
                "INDIA",
                "1.0"
        );


        // ==========================================
        // COMPLETE
        // ==========================================

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

    private void addOrUpdate(
            String category,
            String activityType,
            double factor,
            String unit,
            String source,
            String region,
            String version
    ) {

        EmissionFactor entity =
                repository
                        .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                                category,
                                activityType
                        )
                        .orElseGet(EmissionFactor::new);

        boolean isNew = entity.getId() == null;

        entity.setCategory(category);
        entity.setActivityType(activityType);
        entity.setFactor(factor);
        entity.setUnit(unit);
        entity.setSource(source);
        entity.setRegion(region);
        entity.setVersion(version);
        entity.setActive(true);

        if (isNew) {
            entity.setValidFrom(LocalDate.now());
        }

        repository.save(entity);
    }

    private void addIfMissing(
            String category,
            String activityType,
            double factor,
            String unit,
            String source,
            String region,
            String version
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
                source
        );

        entity.setRegion(
                region
        );

        entity.setVersion(
                version
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
                + " / "
                + factor
        );
    }
}




