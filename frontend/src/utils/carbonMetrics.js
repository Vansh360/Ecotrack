export function calculateTotalEmission(activities, startDate = null, endDate = null) {
  return activities
    .filter((activity) => {
      const activityDate = new Date(activity.date);

      if (startDate && activityDate < startDate) {
        return false;
      }

      if (endDate && activityDate > endDate) {
        return false;
      }

      return true;
    })
    .reduce((total, activity) => total + Number(activity.emission || 0), 0);
}

export function getMonthlyEmission(activities, year, month) {
  return activities
    .filter((activity) => {
      const date = new Date(activity.date);

      return date.getFullYear() === year && date.getMonth() === month;
    })
    .reduce((total, activity) => total + Number(activity.emission || 0), 0);
}

export function getCurrentMonthEmission(activities) {
  const now = new Date();
  return getMonthlyEmission(activities, now.getFullYear(), now.getMonth());
}

export function getPreviousMonthEmission(activities) {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return getMonthlyEmission(
    activities,
    previousMonth.getFullYear(),
    previousMonth.getMonth()
  );
}

export function calculateCO2Reduced(currentEmission, previousEmission) {
  if (!previousEmission || previousEmission <= 0) {
    return 0;
  }

  return Math.max(0, Number((previousEmission - currentEmission).toFixed(2)));
}

export function calculateEmissionChange(currentEmission, previousEmission) {
  if (!previousEmission || previousEmission <= 0) {
    return 0;
  }

  return Number(
    (((currentEmission - previousEmission) / previousEmission) * 100).toFixed(1)
  );
}

export function calculateGoalProgress(
  baselineEmission,
  currentEmission,
  targetEmission
) {
  if (!baselineEmission || baselineEmission <= targetEmission) {
    return 0;
  }

  const progress =
    ((baselineEmission - currentEmission) /
      (baselineEmission - targetEmission)) *
    100;

  return Math.min(100, Math.max(0, Number(progress.toFixed(1))));
}

export function calculateSustainabilityScore({
  baselineEmission,
  currentEmission,
  goalProgress = 0,
  transportationEmission = 0,
  electricityEmission = 0,
  wasteEmission = 0,
  waterEmission = 0,
}) {
  let reductionScore = 0;

  if (baselineEmission && baselineEmission > 0) {
    const reduction =
      ((baselineEmission - currentEmission) / baselineEmission) * 100;
    reductionScore = Math.max(0, Math.min(40, reduction * 0.8));
  }

  const goalScore = Math.min(25, goalProgress * 0.25);
  const total =
    transportationEmission +
    electricityEmission +
    wasteEmission +
    waterEmission;
  const lowImpactRatio = total > 0 ? 1 - transportationEmission / total : 0;
  const behaviorScore = Math.max(0, Math.min(35, lowImpactRatio * 35));

  return Math.round(
    Math.max(0, Math.min(100, reductionScore + goalScore + behaviorScore))
  );
}

export function getScoreLabel(score) {
  if (score >= 90) return "Climate Hero";
  if (score >= 75) return "Eco Warrior";
  if (score >= 60) return "Sustainable";
  if (score >= 40) return "Improving";
  return "Needs Improvement";
}
