
const CATEGORY_RULES = {
  TRANSPORTATION: {
    title: "Make everyday journeys lower-carbon",
    why: "Transportation is contributing to your recorded footprint.",
    actions: [
      {
        id: "transport-public",
        title: "Compare public transport for suitable journeys",
        description:
          "Compare a bus or train journey with your usual transport before changing your routine.",
        difficulty: "Easy to try",
        reductionRate: 0.1,
        impact: "Potentially meaningful",
      },
      {
        id: "transport-combine",
        title: "Combine nearby errands into one trip",
        description:
          "Plan shopping and other nearby tasks together to avoid unnecessary journeys.",
        difficulty: "Easy",
        reductionRate: 0.05,
        impact: "Depends on distance avoided",
      },
    ],
  },

  ELECTRICITY: {
    title: "Use electricity more efficiently",
    why: "Your recorded electricity activities contribute to your footprint.",
    actions: [
      {
        id: "electricity-switch-off",
        title: "Reduce unnecessary electricity use",
        description:
          "Switch off unused lights and appliances, and avoid leaving devices on standby where practical.",
        difficulty: "Easy",
        reductionRate: 0.05,
        impact: "Depends on actual electricity saved",
      },
      {
        id: "electricity-cooling",
        title: "Review cooling and appliance settings",
        description:
          "Use efficient fan or air-conditioner settings and check whether appliances are operating efficiently.",
        difficulty: "Moderate",
        reductionRate: 0.1,
        impact: "Depends on usage and equipment",
      },
    ],
  },

  FOOD: {
    title: "Explore lower-emission food choices",
    why: "Your recorded food activities contribute to your footprint.",
    actions: [
      {
        id: "food-meal",
        title: "Try a lower-emission meal",
        description:
          "Compare a meal with a suitable vegetarian or plant-rich alternative, while meeting your nutritional needs.",
        difficulty: "Easy to try",
        reductionRate: 0.1,
        impact: "Depends on the meals compared",
      },
      {
        id: "food-waste",
        title: "Plan meals to avoid food waste",
        description:
          "Plan portions, store food properly, and use suitable leftovers instead of throwing food away.",
        difficulty: "Easy",
        reductionRate: 0.05,
        impact: "Depends on waste avoided",
      },
    ],
  },

  WASTE: {
    title: "Prevent waste before disposal",
    why: "Your recorded waste activities contribute to your footprint.",
    actions: [
      {
        id: "waste-separate",
        title: "Separate recyclable materials",
        description:
          "Keep recyclable paper, metal, glass and accepted plastics separate according to your local collection rules.",
        difficulty: "Easy",
        reductionRate: 0.05,
        impact: "Depends on material and local processing",
      },
      {
        id: "waste-reuse",
        title: "Reuse items where practical",
        description:
          "Use reusable bags, containers and other suitable items to reduce avoidable single-use waste.",
        difficulty: "Easy",
        reductionRate: 0.05,
        impact: "Depends on what is replaced",
      },
    ],
  },

  WATER: {
    title: "Reduce avoidable water consumption",
    why: "Your recorded water activities contribute to your footprint.",
    actions: [
      {
        id: "water-shower",
        title: "Reduce unnecessary running water",
        description:
          "Shorten showers where practical and turn taps off while brushing or soaping.",
        difficulty: "Easy",
        reductionRate: 0.05,
        impact: "Depends on water saved and local supply",
      },
      {
        id: "water-reuse",
        title: "Reuse suitable water safely",
        description:
          "Where safe and appropriate, reuse suitable water for gardening or cleaning instead of using fresh water.",
        difficulty: "Moderate",
        reductionRate: 0.05,
        impact: "Depends on safe reuse and water saved",
      },
    ],
  },
};

function normalizeCategory(value = "") {
  const category = String(value).trim().toUpperCase();

  if (
    category.includes("TRANSPORT") ||
    category.includes("TRAVEL")
  ) {
    return "TRANSPORTATION";
  }

  if (
    category.includes("ELECTRIC") ||
    category.includes("ENERGY")
  ) {
    return "ELECTRICITY";
  }

  if (category.includes("FOOD") || category.includes("MEAL")) {
    return "FOOD";
  }

  if (category.includes("WASTE") || category.includes("RECYCL")) {
    return "WASTE";
  }

  if (category.includes("WATER")) {
    return "WATER";
  }

  return category;
}

function getEmission(activity) {
  const value = Number(activity?.emission);

  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function generateEcoActions(activities = []) {
  const totals = {};

  for (const activity of activities) {
    const category = normalizeCategory(activity?.category);

    if (!CATEGORY_RULES[category]) continue;

    totals[category] =
      (totals[category] || 0) + getEmission(activity);
  }

  const rankedCategories = Object.entries(totals)
    .filter(([, emission]) => emission > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalEmission = rankedCategories.reduce(
    (sum, [, emission]) => sum + emission,
    0
  );

  const recommendations = [];

  for (const [category, categoryEmission] of rankedCategories) {
    const rule = CATEGORY_RULES[category];

    const share =
      totalEmission > 0
        ? (categoryEmission / totalEmission) * 100
        : 0;

    for (const action of rule.actions) {
      recommendations.push({
        ...action,
        category,
        categoryTitle: rule.title,
        why: rule.why,
        categoryEmission,
        share,
        estimatedSaving: categoryEmission * action.reductionRate,
        estimatedSavingRate: action.reductionRate * 100,
      });
    }
  }

  return {
    totalEmission,
    categoryCount: rankedCategories.length,
    hotspots: rankedCategories.map(([category, emission]) => ({
      category,
      emission,
      share:
        totalEmission > 0
          ? (emission / totalEmission) * 100
          : 0,
    })),
    recommendations,
  };
}