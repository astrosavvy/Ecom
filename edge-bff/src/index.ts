export interface Env {
  BACKEND_ORIGIN: string; // e.g. "http://140.245.7.165" or "https://api.younoya.com"
}

// Routes that are strictly private and MUST NEVER be cached
const NO_CACHE_PATTERNS = [
  /^\/api\/v1\/cart/,
  /^\/api\/v1\/checkout/,
  /^\/api\/v1\/auth/,
  /^\/api\/v1\/webhooks/,
  /^\/api\/v1\/orders\/[^\/]+$/,
];

// Routes eligible for Edge Caching
const EDGE_CACHE_PATTERNS = [
  { pattern: /^\/api\/v1\/products/, ttl: 3600 },        // 1 hour
  { pattern: /^\/api\/v1\/orders\/track\//, ttl: 300 },   // 5 minutes
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS Preflight at Edge
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Razorpay-Signature, x-shiprocket-token",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Check if route is strictly private / no-cache
    const isNoCache = NO_CACHE_PATTERNS.some((regex) => regex.test(path)) || request.method !== "GET";

    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);

    if (!isNoCache) {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const responseWithHeader = new Response(cachedResponse.body, cachedResponse);
        responseWithHeader.headers.set("CF-Cache-Status", "HIT");
        return responseWithHeader;
      }
    }

    // Proxy request to VPS Backend Origin
    const originUrl = new URL(path + url.search, env.BACKEND_ORIGIN);
    const originRequest = new Request(originUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow",
    });

    const response = await fetch(originRequest);
    const modifiedResponse = new Response(response.body, response);

    // Set Security Headers
    modifiedResponse.headers.set("X-Content-Type-Options", "nosniff");
    modifiedResponse.headers.set("X-Frame-Options", "DENY");
    modifiedResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");

    // Apply Edge Cache rules
    if (!isNoCache && response.status === 200) {
      const match = EDGE_CACHE_PATTERNS.find((item) => item.pattern.test(path));
      const ttl = match ? match.ttl : 300;
      modifiedResponse.headers.set("Cache-Control", `public, max-age=${ttl}, stale-while-revalidate=86400`);
      ctx.waitUntil(cache.put(cacheKey, modifiedResponse.clone()));
      modifiedResponse.headers.set("CF-Cache-Status", "MISS");
    } else {
      modifiedResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      modifiedResponse.headers.set("CF-Cache-Status", "DYNAMIC");
    }

    return modifiedResponse;
  },
};
