/*
 * EcoTrack Emission Factor Registry
 *
 * IMPORTANT:
 * These are currently application/demo factors.
 * Before the final research evaluation, replace/validate
 * them against appropriate country-, year-, and
 * methodology-specific sources.
 *
 * Formula:
 *
 * CO2e = Activity Data × Emission Factor
 *
 * Factors should eventually be stored in PostgreSQL.
 */

export const EMISSION_FACTORS = {

  transportation: {

    car: {
      petrol: {
        value: 0.192,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },

      diesel: {
        value: 0.171,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },
    },

    bike: {
      petrol: {
        value: 0.103,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },
    },

    bus: {
      default: {
        value: 0.089,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },
    },

    train: {
      default: {
        value: 0.041,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },
    },

    flight: {
      default: {
        value: 0.255,
        unit: "kg CO2e/km",
        activityUnit: "km",
        source: "EcoTrack provisional factor",
        region: "India",
        year: 2026,
        boundary: "distance-based estimate",
      },
    },
  },


  electricity: {

    grid: {
      value: 0.82,
      unit: "kg CO2e/kWh",
      activityUnit: "kWh",
      source: "EcoTrack provisional factor",
      region: "India",
      year: 2026,
      boundary: "electricity consumption",
    },
  },


  food: {

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

    chicken: {
      value: 6.9,
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
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "food estimate",
    },

    beef: {
      value: 27.0,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "food estimate",
    },
  },


  waste: {

    plastic: {
      value: 2.5,
      unit: "kg CO2e/kg",
      activityUnit: "kg",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "waste estimate",
    },

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
  },


  water: {

    default: {
      value: 0.0003,
      unit: "kg CO2e/litre",
      activityUnit: "litre",
      source: "EcoTrack provisional factor",
      region: "Global",
      year: 2026,
      boundary: "water-use estimate",
    },
  },
};