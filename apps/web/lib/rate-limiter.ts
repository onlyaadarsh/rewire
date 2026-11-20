import crypto from "node:crypto";
import { redis } from "@/lib/redis";

export interface RateLimitOptions {
  /** Unique key prefix / identifier, e.g. "ratelimit:ai:burst:user_123" */
  key: string;
  /** Maximum number of allowed requests in the window */
  limit: number;
  /** Sliding window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfter: number; // in seconds
}

/**
 * Atomic sliding-window rate limiter Lua script.
 * Supports checking single or multiple tiers atomically (e.g. burst + hourly).
 *
 * KEYS: Array of rate-limit keys [key1, key2, ...]
 * ARGV: [limit1, window_ms1, limit2, window_ms2, ..., now, member_id]
 *
 * 1. Prunes expired timestamps for all specified keys.
 * 2. Checks if ANY key would exceed its limit.
 * 3. If any exceeds, returns immediately without modifying Redis.
 * 4. If all are allowed, records member_id with score = now across all keys atomically.
 */
const MULTI_SLIDING_WINDOW_LUA = `
local n = #KEYS
local now = tonumber(ARGV[n * 2 + 1])
local member_id = ARGV[n * 2 + 2]

-- Pass 1: Prune expired entries and check if any limit is reached
for i = 1, n do
  local key = KEYS[i]
  local limit = tonumber(ARGV[(i - 1) * 2 + 1])
  local window_ms = tonumber(ARGV[(i - 1) * 2 + 2])
  local clear_before = now - window_ms

  -- Remove expired timestamps outside the sliding window
  redis.call('ZREMRANGEBYSCORE', key, 0, clear_before)

  -- Count requests in current active window
  local count = redis.call('ZCARD', key)

  if count >= limit then
    -- Limit exceeded: compute accurate Retry-After from oldest entry in this tier
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local retry_after = 1
    if oldest and #oldest >= 2 then
      local oldest_time = tonumber(oldest[2])
      retry_after = math.max(1, math.ceil(((oldest_time + window_ms) - now) / 1000))
    end
    return { 0, 0, retry_after, limit }
  end
end

-- Pass 2: All limits passed! Record this request in all keys atomically
local min_remaining = 999999
local primary_limit = tonumber(ARGV[1])

for i = 1, n do
  local key = KEYS[i]
  local limit = tonumber(ARGV[(i - 1) * 2 + 1])
  local window_ms = tonumber(ARGV[(i - 1) * 2 + 2])

  redis.call('ZADD', key, now, member_id)
  redis.call('EXPIRE', key, math.ceil(window_ms / 1000))

  local count = redis.call('ZCARD', key)
  local rem = math.max(0, limit - count)
  if rem < min_remaining then
    min_remaining = rem
  end
end

return { 1, min_remaining, 0, primary_limit }
`;

// In-memory fallback map (bounded to avoid memory leaks if Redis is down)
const inMemoryStore = new Map<string, number[]>();
const MAX_FALLBACK_ENTRIES = 5000;

function checkRateLimitsMemory(
  tiers: RateLimitOptions[],
  now: number
): RateLimitResult {
  // Pass 1: verify if ANY tier is at or over limit
  for (const t of tiers) {
    const windowMs = t.windowSeconds * 1000;
    const timestamps = (inMemoryStore.get(t.key) || []).filter((ts) => now - ts < windowMs);
    if (timestamps.length >= t.limit) {
      const oldest = timestamps[0] || now;
      const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return {
        success: false,
        limit: t.limit,
        remaining: 0,
        retryAfter,
      };
    }
  }

  // Pass 2: all tiers passed, record timestamp across all tiers atomically in memory
  let minRemaining = 999999;
  for (const t of tiers) {
    const windowMs = t.windowSeconds * 1000;
    const timestamps = (inMemoryStore.get(t.key) || []).filter((ts) => now - ts < windowMs);
    timestamps.push(now);
    inMemoryStore.set(t.key, timestamps);
    const rem = Math.max(0, t.limit - timestamps.length);
    if (rem < minRemaining) {
      minRemaining = rem;
    }
  }

  // Cleanup old entries if map grows
  if (inMemoryStore.size > MAX_FALLBACK_ENTRIES) {
    for (const [k, timestamps] of inMemoryStore.entries()) {
      if (timestamps.length === 0 || now - timestamps[timestamps.length - 1] > 3600 * 1000) {
        inMemoryStore.delete(k);
      }
    }
  }

  return {
    success: true,
    limit: tiers[0]?.limit || 0,
    remaining: minRemaining === 999999 ? 0 : minRemaining,
    retryAfter: 0,
  };
}

/**
 * Checks multiple rate limit tiers atomically (e.g. burst + hourly).
 * If ANY tier exceeds its quota, NO tokens are consumed from any tier.
 */
export async function checkRateLimits(
  tiers: RateLimitOptions[]
): Promise<RateLimitResult> {
  if (tiers.length === 0) {
    return { success: true, limit: 0, remaining: 0, retryAfter: 0 };
  }

  const now = Date.now();
  const memberId = `${now}-${crypto.randomUUID()}`;

  const keys = tiers.map((t) => t.key);
  const args: (string | number)[] = [];

  for (const t of tiers) {
    args.push(t.limit, t.windowSeconds * 1000);
  }
  args.push(now, memberId);

  try {
    const rawResult = (await redis.eval(
      MULTI_SLIDING_WINDOW_LUA,
      keys.length,
      ...keys,
      ...args
    )) as [number, number, number, number] | null;

    if (!rawResult) {
      return {
        success: true,
        limit: tiers[0].limit,
        remaining: tiers[0].limit - 1,
        retryAfter: 0,
      };
    }

    const [allowed, remaining, retryAfter, matchedLimit] = rawResult;

    return {
      success: allowed === 1,
      limit: matchedLimit || tiers[0].limit,
      remaining: Math.max(0, remaining),
      retryAfter: Math.max(0, retryAfter),
    };
  } catch (error) {
    console.warn("[RateLimiter] Redis rate limit check failed, using fallback:", error);
    return checkRateLimitsMemory(tiers, now);
  }
}

/**
 * Checks a single sliding-window rate limit tier.
 */
export async function checkRateLimit(
  options: RateLimitOptions
): Promise<RateLimitResult> {
  return checkRateLimits([options]);
}

/**
 * Helper to extract client IP from incoming request headers.
 * Protects against IP spoofing by prioritizing trusted edge proxy headers:
 * 1. cf-connecting-ip (Cloudflare edge)
 * 2. x-real-ip (Reverse proxy / Nginx / Vercel)
 * 3. x-vercel-forwarded-for (Vercel edge)
 * 4. x-forwarded-for (standard proxy fallback)
 */
export function getClientIp(reqOrHeaders: Request | Headers): string {
  const headers = reqOrHeaders instanceof Request ? reqOrHeaders.headers : reqOrHeaders;

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim().length > 0) {
    return cfIp.trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp && vercelIp.trim().length > 0) {
    return vercelIp.split(",")[0].trim();
  }

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor && forwardedFor.trim().length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return "127.0.0.1";
}

/**
 * Helper to extract client country from Edge headers (Vercel, Cloudflare, CloudFront)
 */
export function getClientCountry(reqOrHeaders: Request | Headers): string {
  const headers = reqOrHeaders instanceof Request ? reqOrHeaders.headers : reqOrHeaders;
  return (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("cloudfront-viewer-country") ||
    "UNKNOWN"
  );
}
