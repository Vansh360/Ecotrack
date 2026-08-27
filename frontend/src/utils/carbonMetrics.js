/*
====================================================
EcoTrack Carbon Metrics Engine
====================================================

This file calculates dashboard-level analytics
from the activities stored in ActivityContext.

All values are calculated from actual activities.

Later this same logic can be moved to the
Spring Boot backend.
*/

export function roundNumber(value, decimals = 2) {
  return Number(Number(value || 0).toFixed(decimals));
}

export function getEmission(activity) {
  return Number(activity?.emission || 0);
}

export function isSameMonth(date, referenceDate = new Date()) {
  if (!date) return false;
  const activityDate = new Date(date);
  return (
    activityDate.getMonth() === referenceDate.getMonth() &&
    activityDate.getFullYear() === referenceDate.getFullYear()
  );
}

export function isSameYear(date, referenceDate = new Date()) {
  if (!date) return false;
  return new Date(date).getFullYear() === referenceDate.getFullYear();
}

export function getPreviousMonthDate(referenceDate = new Date()) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
}

export function getCurrentMonthEmission(activities, referenceDate = new Date()) {
  return roundNumber(
    activities
      .filter((activity) => isSameMonth(activity.date, referenceDate))
      .reduce((total, activity) => total + getEmission(activity), 0)
  );
}

export function getPreviousMonthEmission(activities, referenceDate = new Date()) {
  const previousMonth = getPreviousMonthDate(referenceDate);
  return roundNumber(
    activities
      .filter((activity) => isSameMonth(activity.date, previousMonth))
      .reduce((total, activity) => total + getEmission(activity), 0)
  );
}

export function getCO2Reduced(currentEmission, previousEmission) {
  const current = Number(currentEmission || 0);
  const previous = Number(previousEmission || 0);
  if (previous <= 0) return 0;
  return roundNumber(Math.max(previous - current, 0));
}

export function getCO2Change(currentEmission, previousEmission) {
  const current = Number(currentEmission || 0);
  const previous = Number(previousEmission || 0);
  if (previous === 0) {
    return { value: 0, percentage: 0, direction: "neutral" };
  }
  const difference = current - previous;
  return {
    value: roundNumber(Math.abs(difference)),
    percentage: roundNumber((Math.abs(difference) / previous) * 100),
    direction: difference < 0 ? "down" : difference > 0 ? "up" : "neutral",
  };
}

export function getCategoryEmission(activities, category, options = {}) {
  const { monthOnly = false, referenceDate = new Date() } = options;
  return roundNumber(
    activities
      .filter(
        (activity) =>
          activity.category === category &&
          (!monthOnly || isSameMonth(activity.date, referenceDate))
      )
      .reduce((total, activity) => total + getEmission(activity), 0)
  );
}

export function getCategoryBreakdown(activities, referenceDate = new Date()) {
  const categories = ["Transportation", "Electricity", "Food", "Waste", "Water"];
  const result = categories.map((category) => ({
    category,
    emission: getCategoryEmission(activities, category, {
      monthOnly: true,
      referenceDate,
    }),
  }));
  const total = result.reduce((sum, item) => sum + item.emission, 0);
  return result.map((item) => ({
    ...item,
    percentage: total > 0 ? roundNumber((item.emission / total) * 100) : 0,
  }));
}

export function getMonthlyEmissions(
  activities,
  numberOfMonths = 6,
  referenceDate = new Date()
) {
  const months = [];
  for (let i = numberOfMonths - 1; i >= 0; i--) {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - i,
      1
    );
    const emission = activities
      .filter((activity) => isSameMonth(activity.date, date))
      .reduce((total, activity) => total + getEmission(activity), 0);
    months.push({
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      fullMonth: date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      emission: roundNumber(emission),
    });
  }
  return months;
}

export function getYearlyEmission(activities, referenceDate = new Date()) {
  return roundNumber(
    activities
      .filter((activity) => isSameYear(activity.date, referenceDate))
      .reduce((total, activity) => total + getEmission(activity), 0)
  );
}

export function getTotalEmission(activities) {
  return roundNumber(
    activities.reduce((total, activity) => total + getEmission(activity), 0)
  );
}

export function getActivityCount(activities) {
  return activities.length;
}

export function calculateSustainabilityScore({
  activities,
  currentEmission,
  previousEmission,
  goalProgress = 0,
}) {
  let emissionScore = 50;
  if (previousEmission > 0) {
    const reduction = (previousEmission - currentEmission) / previousEmission;
    if (reduction >= 0.2) emissionScore = 50;
    else if (reduction >= 0.1) emissionScore = 45;
    else if (reduction >= 0.05) emissionScore = 40;
    else if (reduction >= 0) emissionScore = 35;
    else if (reduction >= -0.1) emissionScore = 25;
    else emissionScore = 15;
  }

  const activityCount = activities.length;
  let consistencyScore = 0;
  if (activityCount >= 30) consistencyScore = 20;
  else if (activityCount >= 20) consistencyScore = 17;
  else if (activityCount >= 10) consistencyScore = 14;
  else if (activityCount >= 5) consistencyScore = 10;
  else if (activityCount > 0) consistencyScore = 5;

  const normalizedGoalProgress = Math.min(
    Math.max(Number(goalProgress || 0), 0),
    100
  );
  const goalScore = roundNumber((normalizedGoalProgress / 100) * 20);
  const categories = ["Transportation", "Electricity", "Food", "Waste", "Water"];
  const usedCategories = new Set(
    activities.map((activity) => activity.category)
  );
  const categoryScore = (usedCategories.size / categories.length) * 10;
  const finalScore =
    emissionScore + consistencyScore + goalScore + categoryScore;
  return Math.min(Math.round(finalScore), 100);
}

export function getDashboardAnalytics(
  activities,
  goalProgress = 0,
  referenceDate = new Date()
) {
  const currentEmission = getCurrentMonthEmission(activities, referenceDate);
  const previousEmission = getPreviousMonthEmission(activities, referenceDate);
  const co2Reduced = getCO2Reduced(currentEmission, previousEmission);
  const co2Change = getCO2Change(currentEmission, previousEmission);
  const sustainabilityScore = calculateSustainabilityScore({
    activities,
    currentEmission,
    previousEmission,
    goalProgress,
  });
  return {
    currentEmission,
    previousEmission,
    co2Reduced,
    co2Change,
    sustainabilityScore,
    categoryBreakdown: getCategoryBreakdown(activities, referenceDate),
    monthlyEmissions: getMonthlyEmissions(activities, 6, referenceDate),
    yearlyEmission: getYearlyEmission(activities, referenceDate),
    totalEmission: getTotalEmission(activities),
    activityCount: getActivityCount(activities),
  };
}
