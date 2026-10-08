/*
====================================================
EcoTrack Sustainability Intelligence Engine
====================================================

Features:
1. Carbon hotspot detection
2. Monthly carbon budget
3. What-if simulation
4. Sustainability score
5. Reduction potential
*/

export function getActivityDate(activity) {
  return (
    activity?.activityDate ||
    activity?.date ||
    activity?.createdAt ||
    null
  );
}

export function getEmission(activity) {
  return Number(activity?.emission || 0);
}

/*
====================================================
MONTHLY EMISSION
====================================================
*/

export function getMonthlyEmission(
  activities,
  referenceDate = new Date()
) {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();

  return activities
    .filter((activity) => {
      const date = getActivityDate(activity);

      if (!date) return false;

      const parsed = new Date(date);

      return (
        parsed.getMonth() === month &&
        parsed.getFullYear() === year
      );
    })
    .reduce(
      (total, activity) =>
        total + getEmission(activity),
      0
    );
}


/*
====================================================
CATEGORY EMISSIONS
====================================================
*/

export function getCategoryEmissions(
  activities
) {
  const result = {};

  activities.forEach((activity) => {
    const category =
      activity?.category || "Other";

    result[category] =
      (result[category] || 0) +
      getEmission(activity);
  });

  return result;
}


/*
====================================================
CARBON HOTSPOT
====================================================

Returns the category producing the highest
emissions.
*/

export function getCarbonHotspot(
  activities
) {
  const categoryEmissions =
    getCategoryEmissions(activities);

  const entries =
    Object.entries(categoryEmissions);

  if (entries.length === 0) {
    return {
      category: "None",
      emission: 0,
      percentage: 0,
    };
  }

  entries.sort(
    (a, b) => b[1] - a[1]
  );

  const total =
    entries.reduce(
      (sum, [, value]) =>
        sum + value,
      0
    );

  const [
    category,
    emission,
  ] = entries[0];

  return {
    category,
    emission: Number(
      emission.toFixed(2)
    ),
    percentage:
      total > 0
        ? Number(
            (
              (emission / total) *
              100
            ).toFixed(1)
          )
        : 0,
  };
}


/*
====================================================
MONTHLY CARBON BUDGET
====================================================
*/

export function getCarbonBudgetStatus(
  currentEmission,
  budget = 250
) {
  const emission =
    Number(currentEmission || 0);

  const target =
    Number(budget || 0);

  if (target <= 0) {
    return {
      budget: 0,
      used: emission,
      remaining: 0,
      percentage: 100,
      status: "invalid",
    };
  }

  const percentage =
    (emission / target) * 100;

  return {
    budget: target,

    used: Number(
      emission.toFixed(2)
    ),

    remaining: Number(
      Math.max(
        target - emission,
        0
      ).toFixed(2)
    ),

    percentage: Number(
      percentage.toFixed(1)
    ),

    status:
      percentage >= 100
        ? "exceeded"
        : percentage >= 80
        ? "warning"
        : "healthy",
  };
}


/*
====================================================
WHAT-IF SIMULATION
====================================================

Example:

Current:
Car = 300 km

Alternative:
Bus = 300 km

Returns potential reduction.
*/

export function simulateEmissionChange({
  currentQuantity,
  currentFactor,
  alternativeQuantity,
  alternativeFactor,
}) {
  const current =
    Number(currentQuantity || 0) *
    Number(currentFactor || 0);

  const alternative =
    Number(alternativeQuantity || 0) *
    Number(alternativeFactor || 0);

  const reduction =
    Math.max(
      current - alternative,
      0
    );

  const percentage =
    current > 0
      ? (reduction / current) * 100
      : 0;

  return {
    current: Number(
      current.toFixed(2)
    ),

    alternative: Number(
      alternative.toFixed(2)
    ),

    reduction: Number(
      reduction.toFixed(2)
    ),

    percentage: Number(
      percentage.toFixed(1)
    ),
  };
}


/*
====================================================
REDUCTION POTENTIAL
====================================================
*/

export function calculateReductionPotential({
  currentEmission,
  reductionPercentage,
}) {
  const emission =
    Number(currentEmission || 0);

  const percentage =
    Number(
      reductionPercentage || 0
    );

  const reduction =
    emission *
    (percentage / 100);

  return Number(
    reduction.toFixed(2)
  );
}


/*
====================================================
SUSTAINABILITY SCORE
====================================================
*/

export function calculateSmartScore({
  currentEmission = 0,
  previousEmission = 0,
  budgetPercentage = 0,
  activityCount = 0,
  categoryCount = 0,
}) {
  let score = 0;

  /*
   * 40 points:
   * emission reduction
   */

  if (
    previousEmission > 0
  ) {
    const reduction =
      (
        previousEmission -
        currentEmission
      ) /
      previousEmission;

    if (reduction >= 0.20) {
      score += 40;
    } else if (
      reduction >= 0.10
    ) {
      score += 35;
    } else if (
      reduction >= 0.05
    ) {
      score += 30;
    } else if (
      reduction >= 0
    ) {
      score += 25;
    } else {
      score += 15;
    }
  } else {
    score += 25;
  }


  /*
   * 20 points:
   * carbon budget
   */

  if (budgetPercentage <= 50) {
    score += 20;
  } else if (
    budgetPercentage <= 70
  ) {
    score += 16;
  } else if (
    budgetPercentage <= 85
  ) {
    score += 12;
  } else if (
    budgetPercentage <= 100
  ) {
    score += 8;
  } else {
    score += 0;
  }


  /*
   * 20 points:
   * consistency
   */

  if (activityCount >= 30) {
    score += 20;
  } else if (
    activityCount >= 20
  ) {
    score += 17;
  } else if (
    activityCount >= 10
  ) {
    score += 14;
  } else if (
    activityCount >= 5
  ) {
    score += 10;
  } else if (
    activityCount > 0
  ) {
    score += 5;
  }


  /*
   * 20 points:
   * category coverage
   */

  score += Math.min(
    categoryCount * 4,
    20
  );

  return Math.min(
    Math.round(score),
    100
  );
}


/*
====================================================
SCORE LABEL
====================================================
*/

export function getScoreLabel(
  score
) {
  if (score >= 90) {
    return "Outstanding";
  }

  if (score >= 75) {
    return "Excellent";
  }

  if (score >= 60) {
    return "Good";
  }

  if (score >= 40) {
    return "Needs Improvement";
  }

  return "Getting Started";
}