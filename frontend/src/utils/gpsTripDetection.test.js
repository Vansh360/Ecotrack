import assert from "node:assert/strict";
import test from "node:test";

import { getDistanceMeters, inferTravelMode } from "./gpsTripDetection.js";

function pointsForSpeed(speedMetersPerSecond, count = 5) {
  const points = [{ latitude: 0, longitude: 0, timestamp: 0 }];

  for (let index = 1; index < count; index += 1) {
    points.push({
      latitude: 0,
      longitude: (speedMetersPerSecond * index) / 111_195,
      timestamp: index * 1000,
    });
  }

  return points;
}

function pointsForSpeeds(speeds) {
  const points = [{ latitude: 0, longitude: 0, timestamp: 0 }];
  let distance = 0;

  speeds.forEach((speed, index) => {
    distance += speed;
    points.push({
      latitude: 0,
      longitude: distance / 111_195,
      timestamp: (index + 1) * 1000,
    });
  });

  return points;
}

test("measures distance between consecutive GPS points", () => {
  const distance = getDistanceMeters(
    { latitude: 0, longitude: 0 },
    { latitude: 0, longitude: 1 },
  );

  assert.ok(distance > 111_000 && distance < 112_000);
});

test("classifies sustained walking speed", () => {
  assert.deepEqual(inferTravelMode(pointsForSpeed(1.4)), {
    mode: "Walk",
    confidence: "high",
  });
});

test("classifies sustained high-speed travel as train", () => {
  assert.deepEqual(inferTravelMode(pointsForSpeed(20)), {
    mode: "Train",
    confidence: "medium",
  });
});

test("treats frequent stops at moderate speed as a low-confidence bus estimate", () => {
  assert.deepEqual(
    inferTravelMode(pointsForSpeeds([6, 0, 6, 0, 6, 0, 6])),
    { mode: "Bus", confidence: "low" },
  );
});

test("uses car as the low-confidence estimate for faster road movement", () => {
  assert.deepEqual(inferTravelMode(pointsForSpeed(12)), {
    mode: "Car",
    confidence: "low",
  });
});

test("waits for enough GPS movement before classifying", () => {
  assert.deepEqual(inferTravelMode(pointsForSpeed(1.4, 3)), {
    mode: null,
    confidence: "low",
  });
});
