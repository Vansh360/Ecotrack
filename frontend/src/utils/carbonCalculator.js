import { EMISSION_FACTORS } from "./emissionFactors";

/*
 * ============================================================
 * EcoTrack Carbon Calculator
 * ============================================================
 *
 * General formula:
 *
 * CO2e = Activity Data × Emission Factor
 *
 * IMPORTANT:
 * Transportation factors from the current registry are
 * primarily distance-based (kg CO2e/km).
 *
 * Therefore car/bike/flight calculations use:
 *
 * CO2e = Distance × Factor
 *
 * Frequency can scale the activity when the user selects
 * Daily or Weekly.
 *
 * Passenger count is used for factors expressed as
 * kg CO2e/person/km, such as bus and train.
 */


/*
 * ============================================================
 * ROUNDING
 * ============================================================
 */

export function roundEmission(value, decimals = 3) {
  return Number(
    Number(value || 0).toFixed(decimals)
  );
}


/*
 * ============================================================
 * GENERIC EMISSION CALCULATION
 * ============================================================
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

  return roundEmission(
    activity * factor
  );
}


/*
 * ============================================================
 * FREQUENCY
 * ============================================================
 *
 * One Time = 1
 * Daily    = 30
 * Weekly   = 4
 * Monthly  = 1
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
 * ============================================================
 * TRANSPORTATION
 * ============================================================
 */

export function calculateTransportationEmission({
  vehicle,
  fuel = "Petrol",
  distance,
  efficiency = "",
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

  const totalDistance =
    km * multiplier;

  let factor = null;

  /*
   * ==========================================================
   * CAR
   * ==========================================================
   *
   * Reference factor:
   *
   * 0.174 kg CO2e/km
   *
   * Formula:
   *
   * Distance × Factor
   *
   * Example:
   *
   * 34 × 0.174 = 5.916 kg CO2e
   */

  if (
    normalizedVehicle === "car"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .car?.[
          normalizedFuel
        ];

    if (!factor) {
      throw new Error(
        `Emission factor not available for Car using ${fuel}.`
      );
    }

    const totalEmission =
      calculateEmission(
        totalDistance,
        factor.value
      );

    return {
      emission: totalEmission,

      perPersonEmission:
        roundEmission(
          totalEmission /
          passengerCount
        ),

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

      efficiency:
        efficiency
          ? Number(efficiency)
          : null,
    };
  }


  /*
   * ==========================================================
   * BIKE
   * ==========================================================
   */

  if (
    normalizedVehicle === "bike"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .bike?.[
          normalizedFuel
        ] ||
      EMISSION_FACTORS
        .transportation
        .bike?.petrol;

    if (!factor) {
      throw new Error(
        `Emission factor not available for Bike using ${fuel}.`
      );
    }

    const totalEmission =
      calculateEmission(
        totalDistance,
        factor.value
      );

    return {
      emission: totalEmission,

      perPersonEmission:
        roundEmission(
          totalEmission /
          passengerCount
        ),

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

      efficiency:
        efficiency
          ? Number(efficiency)
          : null,
    };
  }


  /*
   * ==========================================================
   * BUS
   * ==========================================================
   *
   * Factor is:
   *
   * kg CO2e / person / km
   *
   * Therefore:
   *
   * Distance × Passengers × Factor
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

    const totalEmission =
      calculateEmission(
        totalDistance *
        passengerCount,
        factor.value
      );

    return {
      emission: totalEmission,

      perPersonEmission:
        roundEmission(
          totalEmission /
          passengerCount
        ),

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

      efficiency: null,
    };
  }


  /*
   * ==========================================================
   * TRAIN
   * ==========================================================
   *
   * Default factor:
   *
   * 0.035 kg CO2e/person/km
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

    const totalEmission =
      calculateEmission(
        totalDistance *
        passengerCount,
        factor.value
      );

    return {
      emission: totalEmission,

      perPersonEmission:
        roundEmission(
          totalEmission /
          passengerCount
        ),

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

      efficiency: null,
    };
  }


  /*
   * ==========================================================
   * FLIGHT
   * ==========================================================
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

    const totalEmission =
      calculateEmission(
        totalDistance,
        factor.value
      );

    return {
      emission: totalEmission,

      perPersonEmission:
        roundEmission(
          totalEmission /
          passengerCount
        ),

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

      efficiency: null,
    };
  }


  /*
   * ==========================================================
   * ELECTRIC VEHICLE
   * ==========================================================
   *
   * No validated EV factor is currently present in the
   * emission-factor registry.
   *
   * Therefore we explicitly stop instead of inventing
   * an emission factor.
   */

  if (
    normalizedVehicle === "electric" ||
    normalizedVehicle === "electric vehicle"
  ) {
    throw new Error(
      "Electric vehicle emission factor is not configured yet."
    );
  }


  /*
   * ==========================================================
   * OTHER VEHICLES
   * ==========================================================
   *
   * SUV / Van / Auto Rickshaw / Truck
   *
   * Use car factor as a temporary fallback only when
   * a dedicated factor does not exist.
   */

  if (
    normalizedVehicle === "suv" ||
    normalizedVehicle === "van" ||
    normalizedVehicle === "auto rickshaw" ||
    normalizedVehicle === "truck"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .car?.[
          normalizedFuel
        ];

    if (!factor) {
      throw new Error(
        `Emission factor not available for ${vehicle} using ${fuel}.`
      );
    }

    const totalEmission =
      calculateEmission(
        totalDistance,
        factor.value
      );

    return {
      emission: totalEmission,

      perPersonEmission:
        roundEmission(
          totalEmission /
          passengerCount
        ),

      factor: factor.value,

      factorUnit: factor.unit,

      activityUnit:
        factor.activityUnit,

      source:
        `${factor.source} - temporary vehicle fallback`,

      region: factor.region,

      year: factor.year,

      boundary:
        `${factor.boundary} - temporary vehicle fallback`,

      totalDistance,

      fuelConsumed: null,

      energyConsumed: null,

      frequency,

      passengers: passengerCount,

      efficiency:
        efficiency
          ? Number(efficiency)
          : null,
    };
  }


  /*
   * ==========================================================
   * UNSUPPORTED VEHICLE
   * ==========================================================
   */

  throw new Error(
    "Unsupported transportation type."
  );
}


/*
 * ============================================================
 * ELECTRICITY
 * ============================================================
 */

export function calculateElectricityEmission(
  kwh
) {
  const factor =
    EMISSION_FACTORS
      .electricity
      .grid;

  if (!factor) {
    throw new Error(
      "Electricity emission factor not available."
    );
  }

  return {
    emission:
      calculateEmission(
        kwh,
        factor.value
      ),

    factor:
      factor.value,

    factorUnit:
      factor.unit,

    activityUnit:
      factor.activityUnit,

    source:
      factor.source,

    region:
      factor.region,

    year:
      factor.year,

    boundary:
      factor.boundary,
  };
}


/*
 * ============================================================
 * FOOD
 * ============================================================
 */

export function calculateFoodEmission({
  foodType,
  quantity,
}) {
  if (!foodType) {
    throw new Error(
      "Please select a food type."
    );
  }

  const normalized =
    String(foodType)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  const foodKeyMap = {
    beef: "beef",
    "lamb/mutton": "lambMutton",
    lamb: "lambMutton",
    mutton: "lambMutton",
    pork: "pork",
    chicken: "chicken",
    eggs: "eggs",
    egg: "eggs",
    cheese: "cheese",
    rice: "rice",
    tofu: "tofu",
    tomatoes: "tomatoes",
    tomato: "tomatoes",
    lentils: "lentilsPeas",
    peas: "lentilsPeas",
    potatoes: "potatoes",
    potato: "potatoes",
    vegan: "vegan",
    vegetarian: "vegetarian",
    fish: "fish",
  };

  const key =
    foodKeyMap[normalized] ||
    normalized;

  const factor =
    EMISSION_FACTORS
      .food?.[key];

  if (!factor) {
    throw new Error(
      "Food emission factor not available."
    );
  }

  return {
    emission:
      calculateEmission(
        quantity,
        factor.value
      ),

    factor:
      factor.value,

    factorUnit:
      factor.unit,

    activityUnit:
      factor.activityUnit,

    source:
      factor.source,

    region:
      factor.region,

    year:
      factor.year,

    boundary:
      factor.boundary,
  };
}


/*
 * ============================================================
 * WASTE
 * ============================================================
 */

export function calculateWasteEmission({
  wasteType,
  quantity,
}) {
  const keyMap = {

    Plastic:
      "plastic",

    Plastic_Waste:
      "plastic",

    PLASTIC_WASTE:
      "plastic",

    Paper:
      "paper",

    PAPER_WASTE:
      "paper",

    "Food Waste":
      "foodWaste",

    FOOD_WASTE:
      "foodWaste",

    "General Waste":
      "generalWaste",

    GENERAL_WASTE:
      "generalWaste",

    Recycling:
      "recycling",

    GLASS_WASTE:
      "glassWaste",

    METAL_WASTE:
      "metalWaste",

    E_WASTE:
      "eWaste",

    TEXTILE_WASTE:
      "textileWaste",

    ORGANIC_WASTE:
      "organicWaste",

    HAZARDOUS_WASTE:
      "hazardousWaste",

    MEDICAL_WASTE:
      "medicalWaste",

    CONSTRUCTION_WASTE:
      "constructionWaste",
  };

  const key =
    keyMap[wasteType] ||
    String(wasteType || "")
      .toLowerCase()
      .replace(/\s+/g, "");

  const factor =
    EMISSION_FACTORS
      .waste?.[key];

  if (!factor) {
    throw new Error(
      "Waste emission factor not available."
    );
  }

  return {
    emission:
      calculateEmission(
        quantity,
        factor.value
      ),

    factor:
      factor.value,

    factorUnit:
      factor.unit,

    activityUnit:
      factor.activityUnit,

    source:
      factor.source,

    region:
      factor.region,

    year:
      factor.year,

    boundary:
      factor.boundary,
  };
}


/*
 * ============================================================
 * WATER
 * ============================================================
 */

export function calculateWaterEmission(
  litres
) {
  const factor =
    EMISSION_FACTORS
      .water
      .default;

  if (!factor) {
    throw new Error(
      "Water emission factor not available."
    );
  }

  return {
    emission:
      calculateEmission(
        litres,
        factor.value
      ),

    factor:
      factor.value,

    factorUnit:
      factor.unit,

    activityUnit:
      factor.activityUnit,

    source:
      factor.source,

    region:
      factor.region,

    year:
      factor.year,

    boundary:
      factor.boundary,
  };
}