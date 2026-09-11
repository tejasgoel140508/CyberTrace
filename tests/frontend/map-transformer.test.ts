import { describe, expect, it } from "vitest";
import { transformLocationsToMarkers } from "../../apps/web/src/components/map/map-transformer";

describe("transformLocationsToMarkers", () => {
  it("converts valid infrastructure coordinates and preserves input", () => {
    const locations = [{ country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041 }, { country: "Invalid", latitude: 100, longitude: 4 }];
    const original = structuredClone(locations);
    const markers = transformLocationsToMarkers(locations);
    expect(markers).toHaveLength(1);
    expect(markers[0]).toMatchObject({ latitude: 52.3676, longitude: 4.9041 });
    expect(locations).toEqual(original);
  });
  it("returns no markers for empty input", () => expect(transformLocationsToMarkers([])).toEqual([]));
});
