import { describe, expect, it } from "vitest";
import { detectIocType } from "../../apps/api/src/utils/detect-ioc-type";

describe("detectIocType", () => {
  it.each([
    ["192.0.2.25", "IP"],
    ["2001:db8:85a3::8a2e:370:7334", "IP"],
    ["login-m365-secure.test", "DOMAIN"],
    ["http://account-verification.test/login", "URL"],
    ["https://payload-delivery.test/download", "URL"],
    ["a3f5c7e9b1d4f6a8c0e2b4d6f8a1c3e5", "HASH"],
    ["c2d4e6f8a0b1c3d5e7f9a2b4c6d8e0f1a3b5c7d9", "HASH"],
    ["b1c3d5e7f9a2c4e6d8f0a1b3c5d7e9f1a3c5e7f9b2d4f6a8c0e2b4d6f8a1c3e", "HASH"]
  ])("classifies %s as %s", (value, expected) => expect(detectIocType(value)).toBe(expected));

  it.each(["", "999.999.999.999", "not a domain", "ftp://example.test", "abc123", "https://", "example"])("rejects malformed input %s", (value) => {
    expect(detectIocType(value)).toBeNull();
  });
});
