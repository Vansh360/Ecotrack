
const getEmission = (activity) => Number(activity?.emission);
const getQuantity = (activity) => Number(activity?.quantity);

const getCategory = (activity) =>
  String(activity?.category || "").trim().toUpperCase();

const getType = (activity) =>
  String(activity?.activityType || "").trim().toUpperCase();

const getDate = (activity) =>
  activity?.activityDate || activity?.date || activity?.createdAt || null;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function findOutliers(records) {
  if (records.length < 4) return new Set();

  const values = records.map((item) => getEmission(item));
  const center = median(values);
  const mad = median(values.map((value) => Math.abs(value - center)));

  // With zero MAD, use a conservative threshold above the median.
  if (mad === 0) {
    return new Set(
      records
        .filter((item) => getEmission(item) > center * 2 && getEmission(item) > center)
        .map((item) => item.id)
    );
  }

  const robustZThreshold = 3.5;
  const scale = 1.4826 * mad;

  return new Set(
    records
      .filter(
        (item) =>
          Math.abs(getEmission(item) - center) / scale >
          robustZThreshold
      )
      .map((item) => item.id)
  );
}

export function detectCarbonAnomalies(activities = []) {
  if (!Array.isArray(activities)) return [];

  const findings = [];
  const validRecords = [];

  activities.forEach((activity, index) => {
    const id = activity?.id ?? `record-${index}`;
    const quantity = getQuantity(activity);
    const emission = getEmission(activity);
    const category = getCategory(activity);
    const type = getType(activity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      findings.push({
        id,
        activity,
        issue: "Invalid quantity",
        severity: "HIGH",
        explanation: "Quantity is zero, negative or not a valid number.",
        action: "Check the entered quantity and unit.",
      });
      return;
    }

    if (!Number.isFinite(emission) || emission < 0) {
      findings.push({
        id,
        activity,
        issue: "Invalid emission",
        severity: "HIGH",
        explanation: "Emission is missing, negative or not a valid number.",
        action: "Verify the emission calculation and factor.",
      });
      return;
    }

    validRecords.push(activity);
  });

  // Compare only like-for-like activity types.
  const groups = new Map();

  validRecords.forEach((activity, index) => {
    const key = `${getCategory(activity)}::${getType(activity)}`;

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({
      ...activity,
      id: activity.id ?? `record-${index}`,
    });
  });

  groups.forEach((records) => {
    const outlierIds = findOutliers(records);

    records.forEach((activity) => {
      if (!outlierIds.has(activity.id)) return;

      const values = records.map(getEmission);
      const center = median(values);

      findings.push({
        id: activity.id,
        activity,
        issue: "Unusually high emission",
        severity: "MEDIUM",
        explanation:
          `This record is unusually high compared with similar ${getType(activity)} activities. ` +
          `The group median is ${center.toFixed(2)} kg CO₂e.`,
        action:
          "Verify the activity date, quantity, unit and emission factor.",
      });
    });
  });

  // Check for unusually large increases between consecutive records
  // in the same category, when valid dates are available.
  const byCategory = new Map();

  validRecords.forEach((activity) => {
    const date = getDate(activity);
    const parsedDate = date ? new Date(date) : null;

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) return;

    const category = getCategory(activity);
    if (!byCategory.has(category)) byCategory.set(category, []);

    byCategory.get(category).push({
      activity,
      date: parsedDate,
    });
  });

  byCategory.forEach((records) => {
    records.sort((a, b) => a.date - b.date);

    for (let i = 1; i < records.length; i++) {
      const previous = records[i - 1].activity;
      const current = records[i].activity;

      const previousEmission = getEmission(previous);
      const currentEmission = getEmission(current);

      if (
        previousEmission > 0 &&
        currentEmission >= previousEmission * 3 &&
        currentEmission - previousEmission >= 5
      ) {
        const id = current.id ?? current.activityDate;

        // Avoid duplicate findings for the same record.
        if (findings.some((item) => item.id === id)) continue;

        findings.push({
          id,
          activity: current,
          issue: "Category emission spike",
          severity: "MEDIUM",
          explanation:
            `This record is at least three times the previous recorded ${getCategory(current).toLowerCase()} emission, with an increase of at least 5 kg CO₂e.`,
          action:
            "Confirm whether the activity was genuinely larger or the data was entered incorrectly.",
        });
      }
    }
  });

  const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

  return findings.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
}
