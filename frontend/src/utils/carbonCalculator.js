import { EMISSION_FACTORS } from "./emissionFactors";


/*
 * Round emission value
 */
export function roundEmission(value, decimals = 3) {
  return Number(
    Number(value).toFixed(decimals)
  );
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

  return roundEmission(
    activity * factor
  );
}


/*
 * Transportation
 */
export function calculateTransportationEmission({
  vehicle,
  fuel = "petrol",
  distance,
}) {
  const normalizedVehicle =
    vehicle.toLowerCase();

  const normalizedFuel =
    fuel.toLowerCase();

  let factor;

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

  else if (
    normalizedVehicle === "bike"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .bike
        .petrol;
  }

  else if (
    normalizedVehicle === "bus"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .bus
        .default;
  }

  else if (
    normalizedVehicle === "train"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .train
        .default;
  }

  else if (
    normalizedVehicle === "flight"
  ) {
    factor =
      EMISSION_FACTORS
        .transportation
        .flight
        .default;
  }

  else {
    throw new Error(
      "Unsupported transportation type."
    );
  }

  if (!factor) {
    throw new Error(
      "Emission factor not available."
    );
  }

  return {
    emission: calculateEmission(
      distance,
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