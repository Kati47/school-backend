import request from "supertest";

import app from "../src/app";

describe("health endpoints", () => {
  it("returns alive for liveness", async () => {
    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "alive" });
  });

  it("returns service unavailable when DB is disconnected", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(503);
    expect(response.body.status).toBe("not_ready");
  });
});

describe("request validation", () => {
  it("returns 400 for invalid login payload", async () => {
    const response = await request(app).post("/auth/login").send({ email: "invalid-email" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Invalid email");
    expect(response.body.details).toBeDefined();
  });
});
