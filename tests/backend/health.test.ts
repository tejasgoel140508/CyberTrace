import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../apps/api/src/app";

describe("GET /api/health", () => {
  it("returns CyberTrace API health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok", service: "cybertrace-api" });
  });
});
