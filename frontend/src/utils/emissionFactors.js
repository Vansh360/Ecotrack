/*
 * ============================================================
 * EcoTrack Emission Factor Registry
 * ============================================================
 *
 * Reference:
 * Carbon Emission Factors - Reference Guide
 *
 * Core formula:
 *
 * CO2e = Activity Data × Emission Factor
 *
 * IMPORTANT:
 * Transportation factors from the reference document are
 * distance-based unless otherwise specified.
 *
 * Food and waste factors are quantity-based.
 *
 * Water factors are litre-based.
 */

export const EMISSION_FACTORS = {

  // ==========================================================
  // TRANSPORTATION
  // ==========================================================

  transportation: {

    /*
     * CAR
     *
     * Reference:
     * Direct emissions = 0.174 kg CO2e/km
     * After fuel extraction & transportation = 0.22 kg CO2e/km
     *
     * We use DIRECT emissions as the default application factor.
     */

    car: {

      petrol: {
        value: 0.174,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "UK Defra / Climate Environmental Data",
        region: "Global",
        year: 2026,
        boundary: "direct emissions",
      },

      diesel: {
        value: 0.174,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "UK Defra / Climate Environmental Data",
        region: "Global",
        year: 2026,
        boundary: "direct emissions",
      },

      /*
       * Optional well-to-wheel/reference value.
       * This is NOT used by default.
       */
      wellToWheel: {
        value: 0.22,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "UK Defra / Climate Environmental Data",
        region: "Global",
        year: 2026,
        boundary: "after fuel extraction and transportation",
      },
    },


    /*
     * BIKE
     *
     * The uploaded reference document does not specify
     * a motorcycle/bike factor.
     *
     * Therefore this remains an EcoTrack provisional value.
     */

    bike: {

      petrol: {
        value: 0.103,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor - reference not specified",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },
    },


    /*
     * BUS
     *
     * Local city bus:
     * 0.104 kg CO2e/person/km
     *
     * Long-distance coach:
     * 0.027 kg CO2e/person/km
     */

    bus: {

      local: {
        value: 0.104,
        unit: "kg CO2e/person/km",
        activityUnit: "person-km",
        source: "Carbon Emission Factors Reference Guide",
        region: "Global",
        year: 2026,
        boundary: "local city bus",
      },

      coach: {
        value: 0.027,
        unit: "kg CO2e/person/km",
        activityUnit: "person-km",
        source: "Carbon Emission Factors Reference Guide",
        region: "Global",
        year: 2026,
        boundary: "long-distance coach",
      },

      /*
       * Keep default for compatibility with existing code.
       */
      default: {
        value: 0.104,
        unit: "kg CO2e/person/km",
        activityUnit: "person-km",
        source: "Carbon Emission Factors Reference Guide",
        region: "Global",
        year: 2026,
        boundary: "local city bus",
      },
    },


    /*
     * TRAIN
     *
     * Electric:
     * 0.035 kg CO2e/person/km
     *
     * Diesel:
     * 0.040 - 0.045 kg CO2e/person/km
     *
     * We use the midpoint for diesel:
     *
     * (0.040 + 0.045) / 2 = 0.0425
     */

    train: {

      electric: {
        value: 0.035,
        unit: "kg CO2e/person/km",
        activityUnit: "person-km",
        source: "UK DESNZ / DEFRA and European Environment Agency",
        region: "Global",
        year: 2026,
        boundary: "electric train",
      },

      diesel: {
        value: 0.0425,
        unit: "kg CO2e/person/km",
        activityUnit: "person-km",
        source: "UK DESNZ / DEFRA and European Environment Agency",
        region: "Global",
        year: 2026,
        boundary: "diesel train - midpoint of 0.040-0.045 range",
      },

      default: {
        value: 0.035,
        unit: "kg CO2e/person/km",
        activityUnit: "person-km",
        source: "UK DESNZ / DEFRA and European Environment Agency",
        region: "Global",
        year: 2026,
        boundary: "electric train",
      },
    },


    /*
     * FLIGHT
     *
     * The uploaded reference document does not specify
     * an aviation factor.
     *
     * Keep existing provisional value.
     */

    flight: {

      default: {
        value: 0.255,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor - reference not specified",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },
    },
  },


  // ==========================================================
  // ELECTRICITY
  // ==========================================================

  electricity: {

    grid: {
      value: 0.71,
      unit: "kg CO2e/kWh",
      activityUnit: "kWh",
      source: "Indian Central Electricity Authority (CEA)",
      region: "India",
      year: 2026,
      boundary: "electricity consumption",
    },
  },


  // ==========================================================
  // FOOD
  // ==========================================================

  food: {

    /*
     * Values from the uploaded reference:
     * Our World in Data / Poore & Nemecek
     */

    beef: {
      value: 99.48,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    lambMutton: {
      value: 39.72,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    pork: {
      value: 12.31,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    chicken: {
      value: 9.87,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    eggs: {
      value: 4.67,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    cheese: {
      value: 23.88,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    rice: {
      value: 4.45,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    tofu: {
      value: 3.16,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    tomatoes: {
      value: 2.09,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    lentilsPeas: {
      value: 0.98,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    potatoes: {
      value: 0.46,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Our World in Data - Poore & Nemecek",
      region: "Global",
      year: 2026,
      boundary: "food lifecycle emissions",
    },

    /*
     * Compatibility with your existing Food.jsx.
     * These are provisional because the PDF does not
     * provide a single generic vegan/vegetarian factor.
     */

    vegan: {
      value: 0.9,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "food estimate",
    },

    vegetarian: {
      value: 1.2,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "food estimate",
    },

    fish: {
      value: 5.5,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor - reference not specified",
      region: "Global",
      year: 2026,
      boundary: "food estimate",
    },
  },


  // ==========================================================
  // WASTE
  // ==========================================================

  waste: {

    /*
     * Plastic:
     *
     * Reference gives:
     * Generation = 2.5 - 5 kg CO2e/kg plastic resin
     *
     * We use 2.5 as the lower-bound value.
     */

    plastic: {
      value: 2.5,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Journal of Cleaner Production / ScienceDirect",
      region: "Global",
      year: 2026,
      boundary: "plastic generation - lower bound",
    },

    /*
     * Plastic disposal values from reference.
     */

    plasticLandfill: {
      value: 0.033,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Terrasure",
      region: "Global",
      year: 2026,
      boundary: "plastic disposal - landfill",
    },

    plasticIncineration: {
      value: 2.7,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "Terrasure",
      region: "Global",
      year: 2026,
      boundary: "plastic disposal - incineration",
    },

    /*
     * Medical waste:
     * 0.25 kg CO2e/kg
     */

    medicalWaste: {
      value: 0.25,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "UK National Health Service (NHS), via ResearchGate",
      region: "Global",
      year: 2026,
      boundary: "medical waste",
    },

    /*
     * Existing categories retained as provisional
     * because the uploaded reference does not specify
     * factors for them.
     */

    paper: {
      value: 1.3,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    foodWaste: {
      value: 0.8,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    generalWaste: {
      value: 1.5,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    recycling: {
      value: 0.4,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    glassWaste: {
      value: 0.5,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    metalWaste: {
      value: 1.2,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    eWaste: {
      value: 1.8,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    textileWaste: {
      value: 1.4,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    organicWaste: {
      value: 0.4,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    hazardousWaste: {
      value: 2.4,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

    constructionWaste: {
      value: 1.7,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },
  },


  // ==========================================================
  // WATER
  // ==========================================================

  water: {

    /*
     * Tap water:
     * 0.0003 kg CO2e/L
     */

    default: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    tapWater: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    /*
     * Bottled water:
     * 0.4 kg CO2e/L
     */

    bottledWater: {
      value: 0.4,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "WINT AI Water Management",
      region: "Global",
      year: 2026,
      boundary: "single-use bottled water",
    },

    /*
     * Existing water activity types.
     * They use the tap-water factor because the reference
     * gives a tap-water supply factor rather than separate
     * factors for showering, laundry, etc.
     */

    drinkingWater: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    showerBath: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    toiletFlushing: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    laundry: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    dishwashing: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    gardening: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    carWashing: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    houseCleaning: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    cooking: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "Danfoss study on potable water footprints",
      region: "Global",
      year: 2026,
      boundary: "tap water supply",
    },

    /*
     * Rainwater factor was not specified in the reference.
     * Retained as provisional.
     */

    rainwaterReused: {
      value: 0.0001,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "EcoTrack provisional factor",
      region: "India",
      year: 2026,
      boundary: "rainwater reuse estimate",
    },
  },
};