import test from "node:test";
import assert from "node:assert/strict";
import { getClientIp, getClientCountry, checkRateLimit, checkRateLimits } from "./rate-limiter";
import { redis } from "./redis";

// Mock redis.eval so the fallback tests execute in memory immediately without network timeouts
(redis as any).eval = async () => {
  throw new Error("Redis mock offline");
};

test("getClientIp prioritizes spoof-resistant headers over X-Forwarded-For", () => {
  // 1. When cf-connecting-ip is present (Cloudflare proxy)
  const cfHeaders = new Headers({
    "cf-connecting-ip": "203.0.113.195",
    "x-forwarded-for": "198.51.100.1, 203.0.113.195",
  });
  assert.strictEqual(getClientIp(cfHeaders), "203.0.113.195");

  // 2. When x-real-ip is present (Nginx / Vercel proxy)
  const realIpHeaders = new Headers({
    "x-real-ip": "198.51.100.2",
    "x-forwarded-for": "10.0.0.1, 198.51.100.2",
  });
  assert.strictEqual(getClientIp(realIpHeaders), "198.51.100.2");

  // 3. When x-vercel-forwarded-for is present
  const vercelHeaders = new Headers({
    "x-vercel-forwarded-for": "198.51.100.3, 10.0.0.2",
  });
  assert.strictEqual(getClientIp(vercelHeaders), "198.51.100.3");

  // 4. Fallback to x-forwarded-for
  const xffHeaders = new Headers({
    "x-forwarded-for": "198.51.100.4",
  });
  assert.strictEqual(getClientIp(xffHeaders), "198.51.100.4");

  // 5. Fallback when headers are completely empty
  const emptyHeaders = new Headers();
  assert.strictEqual(getClientIp(emptyHeaders), "127.0.0.1");
});

test("getClientCountry extracts edge country header", () => {
  const cfCountry = new Headers({ "cf-ipcountry": "GB" });
  assert.strictEqual(getClientCountry(cfCountry), "GB");

  const vercelCountry = new Headers({ "x-vercel-ip-country": "US" });
  assert.strictEqual(getClientCountry(vercelCountry), "US");

  const empty = new Headers();
  assert.strictEqual(getClientCountry(empty), "UNKNOWN");
});

test("checkRateLimit fallback enforces sliding window when Redis is unavailable", async () => {
  const testKey = `test:ratelimit:fallback:${Date.now()}`;

  // First 3 requests with limit 3 should succeed
  const r1 = await checkRateLimit({ key: testKey, limit: 3, windowSeconds: 10 });
  assert.strictEqual(r1.success, true);
  assert.strictEqual(r1.remaining, 2);

  const r2 = await checkRateLimit({ key: testKey, limit: 3, windowSeconds: 10 });
  assert.strictEqual(r2.success, true);
  assert.strictEqual(r2.remaining, 1);

  const r3 = await checkRateLimit({ key: testKey, limit: 3, windowSeconds: 10 });
  assert.strictEqual(r3.success, true);
  assert.strictEqual(r3.remaining, 0);

  // 4th request should fail with retryAfter > 0
  const r4 = await checkRateLimit({ key: testKey, limit: 3, windowSeconds: 10 });
  assert.strictEqual(r4.success, false);
  assert.strictEqual(r4.remaining, 0);
  assert.ok(r4.retryAfter > 0, "retryAfter should be greater than 0");
});

test("checkRateLimits multi-tier blocks atomically without draining burst allowance", async () => {
  const burstKey = `test:burst:${Date.now()}`;
  const hourlyKey = `test:hourly:${Date.now()}`;

  // Fill up hourly limit (limit 1)
  const h1 = await checkRateLimit({ key: hourlyKey, limit: 1, windowSeconds: 3600 });
  assert.strictEqual(h1.success, true);

  // Now attempt a multi-tier check with burst (limit 5) and hourly (limit 1)
  // Since hourly is already full, the entire call must fail
  const multiCheck = await checkRateLimits([
    { key: burstKey, limit: 5, windowSeconds: 60 },
    { key: hourlyKey, limit: 1, windowSeconds: 3600 },
  ]);

  assert.strictEqual(multiCheck.success, false);
  assert.strictEqual(multiCheck.limit, 1);
  assert.ok(multiCheck.retryAfter > 0);

  // Verify that the burst key did NOT consume any tokens from the failed attempt!
  const burstVerify = await checkRateLimit({ key: burstKey, limit: 5, windowSeconds: 60 });
  assert.strictEqual(burstVerify.success, true);
  // It should be 4 remaining (since this verify call is the first actual recorded token)
  assert.strictEqual(burstVerify.remaining, 4);
});
