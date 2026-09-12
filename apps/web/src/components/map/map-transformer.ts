import type { ThreatLocation } from "@cybertrace/shared";
export function transformLocationsToMarkers(locations: readonly Partial<ThreatLocation>[] | undefined) {
  if (!Array.isArray(locations)) return [];
  return locations.filter((l) => typeof l.latitude === "number" && Number.isFinite(l.latitude) && l.latitude >= -90 && l.latitude <= 90 && typeof l.longitude === "number" && Number.isFinite(l.longitude) && l.longitude >= -180 && l.longitude <= 180).map((l) => ({ ...l, latitude: l.latitude as number, longitude: l.longitude as number }));
}
