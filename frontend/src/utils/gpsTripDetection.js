const EARTH_RADIUS_METERS = 6_371_000;

export function getDistanceMeters(start, end) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(end.latitude - start.latitude);
  const longitudeDelta = toRadians(end.longitude - start.longitude);
  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(startLatitude)
      * Math.cos(endLatitude)
      * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS
    * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function inferTravelMode(points) {
  const speeds = [];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const elapsedSeconds = (current.timestamp - previous.timestamp) / 1000;

    if (elapsedSeconds <= 0) {
      continue;
    }

    const speed = getDistanceMeters(previous, current) / elapsedSeconds;
    if (Number.isFinite(speed) && speed <= 45) {
      speeds.push(speed);
    }
  }

  const movingSpeeds = speeds.filter((speed) => speed >= 0.4);
  if (movingSpeeds.length < 3) {
    return { mode: null, confidence: "low" };
  }

  const averageSpeed = movingSpeeds.reduce((total, speed) => total + speed, 0)
    / movingSpeeds.length;
  const walkingSegments = movingSpeeds.filter((speed) => speed <= 3.3).length;
  const stopSegments = speeds.filter((speed) => speed < 0.8).length;

  if (walkingSegments / movingSpeeds.length >= 0.7) {
    return { mode: "Walk", confidence: "high" };
  }

  if (movingSpeeds.filter((speed) => speed >= 14).length >= 3) {
    return { mode: "Train", confidence: "medium" };
  }

  if (averageSpeed <= 10 && stopSegments >= 2) {
    return { mode: "Bus", confidence: "low" };
  }

  return { mode: "Car", confidence: "low" };
}
