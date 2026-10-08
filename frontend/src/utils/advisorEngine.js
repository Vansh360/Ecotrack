/*
====================================================
EcoTrack AI Sustainability Advisor
====================================================

Analyzes:
- User activity history
- Carbon hotspots
- Monthly emissions
- Carbon budget
- Activity categories

Generates:
- Personalized recommendations
- Estimated CO2 savings
- Priority
- Explanation
- Suggested action

This is a local intelligent recommendation engine.
It can later be connected to an LLM through Spring Boot.
*/

import {
  getCarbonHotspot,
  getCarbonBudgetStatus,
  getActivityDate,
  getEmission,
} from "./sustainabilityEngine.js";


/*
====================================================
HELPERS
====================================================
*/

function round(value, decimals = 2) {
  return Number(
    Number(value || 0).toFixed(decimals)
  );
}


function getCurrentMonthActivities(
  activities,
  referenceDate = new Date()
) {
  const month =
    referenceDate.getMonth();

  const year =
    referenceDate.getFullYear();

  return activities.filter((activity) => {

    const date =
      getActivityDate(activity);

    if (!date) return false;

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return false;
    }

    return (
      parsed.getMonth() === month &&
      parsed.getFullYear() === year
    );
  });
}


/*
====================================================
TRANSPORTATION ADVISOR
====================================================
*/

function createTransportationRecommendation(
  activities
) {
  const transportActivities =
    activities.filter(
      (activity) =>
        String(
          activity.category
        ).toUpperCase() ===
        "TRANSPORTATION"
    );

  if (
    transportActivities.length === 0
  ) {
    return null;
  }

  const carActivities =
    transportActivities.filter(
      (activity) =>
        String(
          activity.activityType
        ).toUpperCase() === "CAR"
    );

  if (
    carActivities.length === 0
  ) {
    return null;
  }

  const carEmission =
    carActivities.reduce(
      (total, activity) =>
        total +
        getEmission(activity),
      0
    );

  /*
   * Assume a realistic first-stage
   * behavioral reduction target of 20%.
   */

  const estimatedSaving =
    carEmission * 0.20;

  return {
    id: "transport-reduction",

    category:
      "Transportation",

    priority:
      carEmission > 20
        ? "HIGH"
        : "MEDIUM",

    title:
      "Reduce high-emission car trips",

    recommendation:
      "Consider replacing some car trips with public transport, train travel, cycling or walking where practical.",

    reason:
      `Your recorded car activities produced approximately ${round(
        carEmission
      )} kg CO₂e.`,

    estimatedSaving:
      round(estimatedSaving),

    savingPeriod:
      "potential reduction from current usage",

    action:
      "Try replacing around 20% of your car trips.",

    icon:
      "🚗",
  };
}


/*
====================================================
ELECTRICITY ADVISOR
====================================================
*/

function createElectricityRecommendation(
  activities
) {
  const electricityActivities =
    activities.filter(
      (activity) =>
        String(
          activity.category
        ).toUpperCase() ===
        "ELECTRICITY"
    );

  if (
    electricityActivities.length === 0
  ) {
    return null;
  }

  const emission =
    electricityActivities.reduce(
      (total, activity) =>
        total +
        getEmission(activity),
      0
    );

  const estimatedSaving =
    emission * 0.10;

  return {
    id:
      "electricity-reduction",

    category:
      "Electricity",

    priority:
      emission > 15
        ? "HIGH"
        : "MEDIUM",

    title:
      "Reduce electricity consumption",

    recommendation:
      "Reduce unnecessary electricity usage by switching off idle appliances, improving AC efficiency and using efficient lighting.",

    reason:
      `Your electricity activities contributed approximately ${round(
        emission
      )} kg CO₂e.`,

    estimatedSaving:
      round(estimatedSaving),

    savingPeriod:
      "potential 10% reduction",

    action:
      "Target a 10% reduction in electricity consumption.",

    icon:
      "⚡",
  };
}


/*
====================================================
FOOD ADVISOR
====================================================
*/

function createFoodRecommendation(
  activities
) {
  const foodActivities =
    activities.filter(
      (activity) =>
        String(
          activity.category
        ).toUpperCase() ===
        "FOOD"
    );

  if (
    foodActivities.length === 0
  ) {
    return null;
  }

  const highImpactFood =
    foodActivities.filter(
      (activity) => {

        const type =
          String(
            activity.activityType ||
              ""
          ).toUpperCase();

        return (
          type.includes("BEEF") ||
          type.includes("CHICKEN") ||
          type.includes("NON_VEGETARIAN") ||
          type.includes("MEAT")
        );
      }
    );

  const emission =
    highImpactFood.length > 0
      ? highImpactFood.reduce(
          (total, activity) =>
            total +
            getEmission(activity),
          0
        )
      : foodActivities.reduce(
          (total, activity) =>
            total +
            getEmission(activity),
          0
        );

  const estimatedSaving =
    emission * 0.15;

  return {
    id:
      "food-reduction",

    category:
      "Food",

    priority:
      emission > 15
        ? "HIGH"
        : "MEDIUM",

    title:
      "Choose lower-impact food options",

    recommendation:
      "Consider replacing some high-emission food choices with vegetarian or lower-impact alternatives.",

    reason:
      `Your food activities contributed approximately ${round(
        emission
      )} kg CO₂e.`,

    estimatedSaving:
      round(estimatedSaving),

    savingPeriod:
      "potential 15% reduction",

    action:
      "Try replacing some high-impact meals each week.",

    icon:
      "🍽️",
  };
}


/*
====================================================
WASTE ADVISOR
====================================================
*/

function createWasteRecommendation(
  activities
) {
  const wasteActivities =
    activities.filter(
      (activity) =>
        String(
          activity.category
        ).toUpperCase() ===
        "WASTE"
    );

  if (
    wasteActivities.length === 0
  ) {
    return null;
  }

  const emission =
    wasteActivities.reduce(
      (total, activity) =>
        total +
        getEmission(activity),
      0
    );

  const estimatedSaving =
    emission * 0.20;

  return {
    id:
      "waste-reduction",

    category:
      "Waste",

    priority:
      emission > 10
        ? "HIGH"
        : "MEDIUM",

    title:
      "Improve waste segregation",

    recommendation:
      "Separate recyclable, organic and general waste and reduce avoidable single-use materials.",

    reason:
      `Your recorded waste activities contributed approximately ${round(
        emission
      )} kg CO₂e.`,

    estimatedSaving:
      round(estimatedSaving),

    savingPeriod:
      "potential 20% reduction",

    action:
      "Increase recycling and reduce avoidable waste.",

    icon:
      "♻️",
  };
}


/*
====================================================
WATER ADVISOR
====================================================
*/

function createWaterRecommendation(
  activities
) {
  const waterActivities =
    activities.filter(
      (activity) =>
        String(
          activity.category
        ).toUpperCase() ===
        "WATER"
    );

  if (
    waterActivities.length === 0
  ) {
    return null;
  }

  const emission =
    waterActivities.reduce(
      (total, activity) =>
        total +
        getEmission(activity),
      0
    );

  const estimatedSaving =
    emission * 0.15;

  return {
    id:
      "water-reduction",

    category:
      "Water",

    priority:
      "LOW",

    title:
      "Reduce unnecessary water usage",

    recommendation:
      "Reduce water wastage during showers, washing, cleaning and other household activities.",

    reason:
      `Your water activities contributed approximately ${round(
        emission
      )} kg CO₂e.`,

    estimatedSaving:
      round(estimatedSaving),

    savingPeriod:
      "potential 15% reduction",

    action:
      "Target a 15% reduction in avoidable water use.",

    icon:
      "💧",
  };
}


/*
====================================================
GENERAL RECOMMENDATION
====================================================
*/

function createGeneralRecommendation(
  totalEmission
) {
  return {
    id:
      "general-reduction",

    category:
      "Overall",

    priority:
      "MEDIUM",

    title:
      "Start with your highest-impact activities",

    recommendation:
      "Focus on the activity category contributing the most to your carbon footprint before making smaller changes.",

    reason:
      `Your recorded emissions currently total approximately ${round(
        totalEmission
      )} kg CO₂e.`,

    estimatedSaving:
      round(totalEmission * 0.05),

    savingPeriod:
      "potential 5% reduction",

    action:
      "Focus on your carbon hotspot first.",

    icon:
      "🌱",
  };
}


/*
====================================================
MAIN ADVISOR ENGINE
====================================================
*/

export function generateRecommendations(
  activities,
  budget = 250,
  referenceDate = new Date()
) {

  if (
    !Array.isArray(
      activities
    ) ||
    activities.length === 0
  ) {
    return {
      recommendations: [],
      hotspot: null,
      budgetStatus:
        getCarbonBudgetStatus(
          0,
          budget
        ),
      currentEmission: 0,
      totalPotentialSaving: 0,
      message:
        "Add some activities to receive personalized sustainability recommendations.",
    };
  }


  /*
   * Current month
   */

  const currentActivities =
    getCurrentMonthActivities(
      activities,
      referenceDate
    );

  if (currentActivities.length === 0) {
    return {
      recommendations: [],
      hotspot: null,
      budgetStatus: getCarbonBudgetStatus(
        0,
        budget
      ),
      currentEmission: 0,
      totalPotentialSaving: 0,
      message:
        "No activities have been recorded this month yet. Add a current-month activity to receive personalized recommendations.",
    };
  }


  /*
   * Current emission
   */

  const currentEmission =
    currentActivities.reduce(
      (total, activity) =>
        total +
        getEmission(activity),
      0
    );


  /*
   * Carbon hotspot
   */

  const hotspot =
    getCarbonHotspot(
      currentActivities
    );


  /*
   * Carbon budget
   */

  const budgetStatus =
    getCarbonBudgetStatus(
      currentEmission,
      budget
    );


  /*
   * Generate recommendations
   */

  const recommendations = [

    createTransportationRecommendation(
      currentActivities
    ),

    createElectricityRecommendation(
      currentActivities
    ),

    createFoodRecommendation(
      currentActivities
    ),

    createWasteRecommendation(
      currentActivities
    ),

    createWaterRecommendation(
      currentActivities
    ),

  ].filter(Boolean);


  /*
   * If no category-specific
   * recommendation exists
   */

  if (
    recommendations.length === 0
  ) {
    recommendations.push(
      createGeneralRecommendation(
        currentEmission
      )
    );
  }


  /*
   * Sort HIGH priority first
   * and then by estimated saving
   */

  const priorityOrder = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  recommendations.sort(
    (a, b) => {

      const priorityDifference =
        priorityOrder[a.priority] -
        priorityOrder[b.priority];

      if (
        priorityDifference !== 0
      ) {
        return priorityDifference;
      }

      return (
        b.estimatedSaving -
        a.estimatedSaving
      );
    }
  );


  /*
   * Maximum 3 recommendations
   */

  const finalRecommendations =
    recommendations.slice(0, 3);


  /*
   * Total possible saving
   */

  const totalPotentialSaving =
    finalRecommendations.reduce(
      (total, recommendation) =>
        total +
        recommendation.estimatedSaving,
      0
    );


  return {
    recommendations:
      finalRecommendations,

    hotspot,

    budgetStatus,

    currentEmission:
      round(currentEmission),

    totalPotentialSaving:
      round(
        totalPotentialSaving
      ),

    message:
      budgetStatus.status ===
      "exceeded"
        ? "Your monthly carbon budget has been exceeded. Focus on the highest-impact recommendations first."
        : budgetStatus.status ===
          "warning"
        ? "You are approaching your monthly carbon budget. Small changes can make a measurable difference."
        : "Your current emissions are within the selected monthly carbon budget.",
  };
}