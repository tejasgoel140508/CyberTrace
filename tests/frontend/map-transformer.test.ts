import { describe, expect, it } from "vitest";
import { transformLocationsToMarkers } from "../../apps/web/src/components/map/map-transformer";

describe("transformLocationsToMarkers", () => {
  it("creates marker data for valid coordinates without mutating source data", () => {
    const locations = [{ country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198 }];
    const before = structuredClone(locations);
    const markers = transformLocationsToMarkers(locations);
    expect(markers).toHaveLength(1);
    expect(markers[0]).toMatchObject({ latitude: 1.3521, longitude: 103.8198 });
    expect(locations).toEqual(before);
  });

  it("skips invalid coordinates and handles no locations", () => {
    expect(transformLocationsToMarkers([{ latitude: 95, longitude: 180 }, { latitude: "bad", longitude: 0 }] as never)).toEqual([]);
    expect(transformLocationsToMarkers([])).toEqual([]);
  });
});
