import { describe, expect, it } from "vitest";
import { detectIocType } from "../../apps/api/src/utils/detect-ioc-type";

describe("detectIocType", () => {
  it.each([["192.0.2.1", "IP"], ["2001:db8::1", "IP"], ["example.test", "DOMAIN"], ["http://example.test/a", "URL"], ["https://example.test", "URL"], ["a1b2c3d4e5f60718293a4b5c6d7e8f90", "HASH"], ["0123456789abcdef0123456789abcdef01234567", "HASH"], ["abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789", "HASH"]] as const)("detects %s", (value, expected) => expect(detectIocType(value)).toBe(expected));
  it.each(["999.999.999.999", "http://", "not a value", "abc123", "https://", "example..test"])("rejects malformed input %s", (value) => expect(detectIocType(value)).toBeNull());
});
