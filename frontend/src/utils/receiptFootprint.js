import { EMISSION_FACTORS } from "./emissionFactors.js";

export const RECEIPT_FOOD_CATEGORIES = [
  { id: "beef", label: "Beef", activityType: "BEEF" },
  { id: "lambMutton", label: "Lamb / mutton", activityType: "LAMB_MUTTON" },
  { id: "pork", label: "Pork", activityType: "PORK" },
  { id: "chicken", label: "Chicken", activityType: "CHICKEN" },
  { id: "eggs", label: "Eggs", activityType: "EGGS" },
  { id: "cheese", label: "Cheese", activityType: "CHEESE" },
  { id: "rice", label: "Rice", activityType: "RICE" },
  { id: "tofu", label: "Tofu", activityType: "TOFU" },
  { id: "tomatoes", label: "Tomatoes", activityType: "TOMATOES" },
  { id: "lentilsPeas", label: "Lentils / peas", activityType: "LENTILS_PEAS" },
  { id: "potatoes", label: "Potatoes", activityType: "POTATOES" },
  { id: "milk", label: "Milk / dairy", activityType: "MILK" },
  { id: "biscuits", label: "Biscuits", activityType: "BISCUITS" },
  { id: "chocolate", label: "Chocolate", activityType: "CHOCOLATE" },
  { id: "sweetSpread", label: "Sweet spreads", activityType: "SWEET_SPREAD" },
  { id: "softDrink", label: "Soft drinks", activityType: "SOFT_DRINK" },
  { id: "noodles", label: "Noodles", activityType: "NOODLES" },
  { id: "salt", label: "Salt / condiments", activityType: "SALT" },
];

const RECEIPT_TOTAL_LINE = /\b(total|subtotal|tax|gst|vat|discount|cash|change|balance|rounding|amount paid|credit|debit|upi|visa|mastercard)\b/i;
const WEIGHT_PATTERN = /(\d+(?:[.,]\d+)?)\s*(kilograms?|kgs?|grams?|gr|g|milliliters?|millilitres?|ml|liters?|litres?|l)\b/i;
const PRICE_PATTERN = /(?:₹|rs\.?|inr|\$|€|£)\s*(\d+(?:[.,]\d{1,2})?)\s*$/i;

export function classifyFood(text) {
  const normalized = String(text || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const patterns = [
    ["lambMutton", /\b(lamb|mutton)\b/],
    ["beef", /\b(beef|steak|mince beef)\b/],
    ["pork", /\b(pork|bacon|ham)\b/],
    ["chicken", /\b(chicken|poultry)\b/],
    ["eggs", /\b(egg|eggs)\b/],
    ["cheese", /\b(cheese|cheddar|mozzarella|parmesan)\b/],
    ["rice", /\b(rice|basmati|jasmine rice)\b/],
    ["tofu", /\b(tofu|bean curd)\b/],
    ["tomatoes", /\b(tomato|tomatoes)\b/],
    ["lentilsPeas", /\b(lentil|lentils|pea|peas|chickpea|chickpeas)\b/],
    ["potatoes", /\b(potato|potatoes)\b/],
    ["biscuits", /\b(biscuit|parle|cookie|gluco)\b/],
    ["noodles", /\b(noodle|maggi|pasta)\b/],
    ["softDrink", /\b(coca cola|coke|cola|pepsi|soft drink|soda|fizzy drink|juice)\b/],
    ["sweetSpread", /\b(nutella|sweet spread|chocolate spread|hazelnut spread|cocoa spread|spread)\b/],
    ["chocolate", /\b(chocolate|cadbury|dairy milk|kitkat)\b/],
    ["milk", /\b(milk|dairy|toned|uht)\b/],
    ["salt", /\b(salt)\b/],
  ];

  return patterns.find(([, pattern]) => pattern.test(normalized))?.[0] || "";
}

export function createReceiptItem(name, options = {}) {
  const weightMatch = name.match(WEIGHT_PATTERN);
  const weightValue = weightMatch
    ? Number(weightMatch[1].replace(",", "."))
    : null;
  const unit = weightMatch?.[2].toLowerCase();
  const isKilograms = unit?.startsWith("kg") || unit?.startsWith("kilo");
  const isLiters = Boolean(
    unit && (unit === "l" || unit.startsWith("liter") || unit.startsWith("litre")),
  );
  const grams = weightValue
    ? isKilograms || isLiters
      ? weightValue * 1000
      : weightValue
    : "";
  const cleanName = name
    .replace(WEIGHT_PATTERN, "")
    .replace(/^\s*\d+\s*[x×]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const foodCategory = options.foodCategory || classifyFood(cleanName);

  return {
    id: options.id || globalThis.crypto?.randomUUID?.()
      || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: cleanName || name.trim(),
    grams,
    foodCategory,
    price: options.price ?? null,
    source: options.source || "receipt",
    saved: false,
  };
}

export function parseReceiptText(text) {
  const items = [];

  for (const rawLine of String(text || "").split(/\r?\n/)) {
    let line = rawLine.trim();
    if (!line || RECEIPT_TOTAL_LINE.test(line)) {
      continue;
    }

    let price = null;
    const currencyPrice = line.match(PRICE_PATTERN);
    if (currencyPrice) {
      price = Number(currencyPrice[1].replace(",", "."));
      line = line.slice(0, currencyPrice.index).trim();
    } else {
      const trailingAmount = line.match(/\s+(\d+(?:[.,]\d{1,2})?)\s*$/);
      if (trailingAmount) {
        price = Number(trailingAmount[1].replace(",", "."));
        line = line.slice(0, trailingAmount.index).trim();
      }
    }

    if (!line || !/[a-z]/i.test(line)) {
      continue;
    }
    items.push(createReceiptItem(line, { price }));
  }

  return items;
}

export function estimateItemEmissions(item) {
  const grams = Number(item.grams);
  const category = RECEIPT_FOOD_CATEGORIES.find(
    (candidate) => candidate.id === item.foodCategory,
  );

  if (!category || !Number.isFinite(grams) || grams <= 0) {
    return null;
  }

  const factor = EMISSION_FACTORS.food[category.id];
  return {
    category,
    factor: factor.value,
    emissions: (grams / 1000) * factor.value,
  };
}
