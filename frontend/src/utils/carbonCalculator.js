import { EMISSION_FACTORS } from "./emissionFactors";

/*
 * Round emission value
 */
export function roundEmission(value, decimals = 3) {
  return Number(Number(value).toFixed(decimals));
}


/*
 * Generic calculation
 *
 * CO2e = Activity × Emission Factor
 */
export function calculateEmission(
  activityValue,
  emissionFactor
) {
  const activity = Number(activityValue);
  const factor = Number(emissionFactor);

  if (
    !Number.isFinite(activity) ||
    !Number.isFinite(factor) ||
    activity < 0 ||
    factor < 0
  ) {
    throw new Error(
      "Invalid activity value or emission factor."
    );
  }

  return roundEmission(activity * factor);
}


/*
 * Convert travel frequency into number of trips.
 *
 * One Time  -> 1
 * Daily     -> 30
 * Weekly    -> 4
 * Monthly   -> 1
 *
 * This assumes the entered distance is the distance
 * for one travel occurrence.
 */
function getFrequencyMultiplier(frequency) {
  const normalized =
    String(frequency || "One Time")
      .toLowerCase()
      .trim();

  switch (normalized) {
    case "daily":
      return 30;

    case "weekly":
      return 4;

    case "monthly":
      return 1;

    case "one time":
    default:
      return 1;
  }
}


/*
 * Transportation
 *
 * Fuel vehicles:
 *
 * Fuel consumed = Distance / Fuel Efficiency
 *
 * Emission = Fuel consumed × Fuel emission factor
 *
 * For public transport such as bus/train/flight,
 * the existing distance-based factor is retained.
 */
export function calculateTransportationEmission({
  vehicle,
  fuel = "Petrol",
  distance,
  efficiency,
  frequency = "One Time",
  passengers = 1,
  chargingSource = "Grid",
}) {
  if (!vehicle) {
    throw new Error(
      "Please select a vehicle type."
    );
  }

  const km = Number(distance);

  if (
    !Number.isFinite(km) ||
    km <= 0
  ) {
    throw new Error(
      "Please enter a valid distance."
    );
  }

  const passengerCount =
    Number(passengers);

  if (
    !Number.isFinite(passengerCount) ||
    passengerCount <= 0
  ) {
    throw new Error(
      "Please enter a valid number of passengers."
    );
  }

  const normalizedVehicle =
    String(vehicle)
      .toLowerCase()
      .trim();

  const normalizedFuel =
    String(fuel)
      .toLowerCase()
      .trim();

  const multiplier =
    getFrequencyMultiplier(frequency);

  let factor;

  /*
   * =========================================
   * ELECTRIC VEHICLE
   * =========================================
   *
   * The current EMISSION_FACTORS structure
   * must contain an electric factor before
   * this option can be used.
   */
  if (
    normalizedVehicle === "electric" ||
    normalizedVehicle === "electric vehicle"
  ) {
    const electricFactors =
      EMISSION_FACTORS
        .transportation
        .electric;

    if (!electricFactors) {
      throw new Error(
        "Electric vehicle emission factor is not available."
      );
    }

    /*
     * Currently use grid factor by default.
     *
     * If your emissionFactors.js later contains:
     *
     * electric: {
     *   grid: {...},
     *   solar: {...},
     *   wind: {...}
     * }
     *
     * this section can select the correct factor.
     */
    const sourceKey =
      String(chargingSource || "Grid")
        .toLowerCase()
        .replace(/\s+/g, "");

    factor =
      electricFactors[sourceKey] ||
      electricFactors.grid ||
      electricFactors.default;

    if (!factor) {
      throw new Error(
        "Electric vehicle emission factor is not available."
      );
    }

    /*
     * For EV, distance alone is not enough.
     *
     * Efficiency is interpreted as:
     *
     * km per kWh
     *
     * Energy consumed = distance / efficiency
     */
    const evEfficiency =
      Number(efficiency);

    if (
      !Number.isFinite(evEfficiency) ||
      evEfficiency <= 0
    ) {
      throw new Error(
        "Please enter valid EV efficiency in km/kWh."
      );
    }

    const totalDistance =
      km * multiplier;

    const energyConsumed =
      totalDistance / evEfficiency;

    const totalEmission =
      calculateEmission(
        energyConsumed,
        factor.value
      );

    const perPersonEmission =
      roundEmission(
        totalEmission /
          passengerCount
      );

    return {
      emission: totalEmission,

      perPersonEmission,

      factor: factor.value,

      factorUnit: factor.unit,

      activityUnit:
        factor.activityUnit,

      source: factor.source,

      region: factor.region,

      year: factor.year,

      boundary: factor.boundary,

      totalDistance,

      energyConsumed,

      fuelConsumed: null,

      frequency,

      passengers: passengerCount,
    };
  }


  /*
   * =========================================
   * CAR / BIKE / SUV / VAN / AUTO / TRUCK
   * =========================================
   *
   * These use fuel efficiency.
   */
  if (
    normalizedVehicle === "car" ||
    normalizedVehicle === "bike" ||
    normalizedVehicle === "suv" ||
    normalizedVehicle === "van" ||
    normalizedVehicle === "auto rickshaw" ||
    normalizedVehicle === "truck"
  ) {
    /*
     * Car has fuel-specific factors.
     */
    if (
      normalizedVehicle === "car"
    ) {
      factor =
        EMISSION_FACTORS
          .transportation
          .car[
            normalizedFuel
          ];
    }

    /*
     * Bike currently uses petrol factor.
     *
     * If your emissionFactors.js contains
     * diesel/CNG bike factors later, they can
     * be added here.
     */
    else if (
      normalizedVehicle === "bike"
    ) {
      factor =
        EMISSION_FACTORS
          .transportation
          .bike[
            normalizedFuel
          ] ||
        EMISSION_FACTORS
          .transportation
          .bike
          .petrol;
    }

    /*
     * Other vehicle types use their respective
     * factor if available.
     */
    else if (
      normalizedVehicle === "suv"
    ) {
      factor =
        EMISSION_FACTORS
          .transportation
          .suv?.[
            normalizedFuel
          ] ||
        EMISSION_FACTORS
          .transportation
          .car?.[
            normalizedFuel
          ];
    }

    else if (
      normalizedVehicle === "van"
    ) {
      factor =
        EMISSION_FACTORS
          .transportation
          .van?.[
            normalizedFuel
          ] ||
        EMISSION_FACTORS
          .transportation
          .car?.[
            normalizedFuel
          ];
    }

    else if (
      normalizedVehicle === "auto rickshaw"
    ) {
      factor =
        EMISSION_FACTORS
          .transportation
          .autoRickshaw?.[
            normalizedFuel
          ];
    }

    else if (
      normalizedVehicle === "truck"
    ) {
      factor =
        EMISSION_FACTORS
          .transportation
          .truck?.[
            normalizedFuel
          ];
    }

    if (!factor) {
      throw new Error(
        `Emission factor not available for ${vehicle} using ${fuel}.`
      );
    }

    /*
     * Fuel efficiency is required.
     *
     * Example:
     *
     * Distance = 100 km
     * Efficiency = 15 km/L
     *
     * Fuel = 100 / 15
     *      = 6.667 L
     */
    const fuelEfficiency =
      Number(efficiency);

    if (
      !Number.isFinite(fuelEfficiency) ||
      fuelEfficiency <= 0
    ) {
      throw new Error(
        "Please enter valid fuel efficiency in km/L."
      );
    }

    const totalDistance =
      km * multiplier;

    const fuelConsumed =
      totalDistance /
      fuelEfficiency;

    /*
     * Calculate total vehicle emission.
     */
    const totalEmission =
      calculateEmission(
        fuelConsumed,
        factor.value
      );

    /*
     * Calculate per-person emission.
     */
    const perPersonEmission =
      roundEmission(
        totalEmission /
          passengerCount
      );

    return {
      emission: totalEmission,

      perPersonEmission,

      factor: factor.value,

      factorUnit: factor.unit,

      activityUnit:
        factor.activityUnit,

      source: factor.source,

      region: factor.region,

      year: factor.year,

      boundary: factor.boundary,

      totalDistance,

      fuelConsumed,

      energyConsumed: null,

      frequency,

      passengers: passengerCount,
    };
  }


  /*
   * =========================================
   * BUS
   * =========================================
   */
  if (
    normalizedVehicle === "bus"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .bus
        .default;

    if (!factor) {
      throw new Error(
        "Bus emission factor not available."
      );
    }

    const totalDistance =
      km * multiplier;

    const totalEmission =
      calculateEmission(
        totalDistance,
        factor.value
      );

    const perPersonEmission =
      roundEmission(
        totalEmission /
          passengerCount
      );

    return {
      emission: totalEmission,

      perPersonEmission,

      factor: factor.value,

      factorUnit: factor.unit,

      activityUnit:
        factor.activityUnit,

      source: factor.source,

      region: factor.region,

      year: factor.year,

      boundary: factor.boundary,

      totalDistance,

      fuelConsumed: null,

      energyConsumed: null,

      frequency,

      passengers: passengerCount,
    };
  }


  /*
   * =========================================
   * TRAIN
   * =========================================
   */
  if (
    normalizedVehicle === "train"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .train
        .default;

    if (!factor) {
      throw new Error(
        "Train emission factor not available."
      );
    }

    const totalDistance =
      km * multiplier;

    const totalEmission =
      calculateEmission(
        totalDistance,
        factor.value
      );

    const perPersonEmission =
      roundEmission(
        totalEmission /
          passengerCount
      );

    return {
      emission: totalEmission,

      perPersonEmission,

      factor: factor.value,

      factorUnit: factor.unit,

      activityUnit:
        factor.activityUnit,

      source: factor.source,

      region: factor.region,

      year: factor.year,

      boundary: factor.boundary,

      totalDistance,

      fuelConsumed: null,

      energyConsumed: null,

      frequency,

      passengers: passengerCount,
    };
  }


  /*
   * =========================================
   * FLIGHT
   * =========================================
   */
  if (
    normalizedVehicle === "flight"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .flight
        .default;

    if (!factor) {
      throw new Error(
        "Flight emission factor not available."
      );
    }

    const totalDistance =
      km * multiplier;

    const totalEmission =
      calculateEmission(
        totalDistance,
        factor.value
      );

    const perPersonEmission =
      roundEmission(
        totalEmission /
          passengerCount
      );

    return {
      emission: totalEmission,

      perPersonEmission,

      factor: factor.value,

      factorUnit: factor.unit,

      activityUnit:
        factor.activityUnit,

      source: factor.source,

      region: factor.region,

      year: factor.year,

      boundary: factor.boundary,

      totalDistance,

      fuelConsumed: null,

      energyConsumed: null,

      frequency,

      passengers: passengerCount,
    };
  }


  /*
   * =========================================
   * UNSUPPORTED
   * =========================================
   */

  throw new Error(
    "Unsupported transportation type."
  );
}


/*
 * Electricity
 */
export function calculateElectricityEmission(
  kwh
) {
  const factor =
    EMISSION_FACTORS
      .electricity
      .grid;

  return {
    emission: calculateEmission(
      kwh,
      factor.value
    ),

    factor: factor.value,

    factorUnit: factor.unit,

    activityUnit:
      factor.activityUnit,

    source: factor.source,

    region: factor.region,

    year: factor.year,

    boundary: factor.boundary,
  };
}


/*
 * Food
 */
export function calculateFoodEmission({
  foodType,
  quantity,
}) {
  const key =
    foodType
      .replace(/\s+/g, "")
      .charAt(0)
      .toLowerCase() +
    foodType
      .replace(/\s+/g, "")
      .slice(1);

  const factor =
    EMISSION_FACTORS
      .food[key];

  if (!factor) {
    throw new Error(
      "Food emission factor not available."
    );
  }

  return {
    emission: calculateEmission(
      quantity,
      factor.value
    ),

    factor: factor.value,

    factorUnit: factor.unit,

    activityUnit:
      factor.activityUnit,

    source: factor.source,

    region: factor.region,

    year: factor.year,

    boundary: factor.boundary,
  };
}


/*
 * Waste
 */
export function calculateWasteEmission({
  wasteType,
  quantity,
}) {
  const keyMap = {
    Plastic: "plastic",
    Paper: "paper",
    "Food Waste": "foodWaste",
    "General Waste": "generalWaste",
    Recycling: "recycling",
  };

  const key =
    keyMap[wasteType];

  const factor =
    EMISSION_FACTORS
      .waste[key];

  if (!factor) {
    throw new Error(
      "Waste emission factor not available."
    );
  }

  return {
    emission: calculateEmission(
      quantity,
      factor.value
    ),

    factor: factor.value,

    factorUnit: factor.unit,

    activityUnit:
      factor.activityUnit,

    source: factor.source,

    region: factor.region,

    year: factor.year,

    boundary: factor.boundary,
  };
}


/*
 * Water
 */
export function calculateWaterEmission(
  litres
) {
  const factor =
    EMISSION_FACTORS
      .water
      .default;

  return {
    emission: calculateEmission(
      litres,
      factor.value
    ),

    factor: factor.value,

    factorUnit: factor.unit,

    activityUnit:
      factor.activityUnit,

    source: factor.source,

    region: factor.region,

    year: factor.year,

    boundary: factor.boundary,
  };
}