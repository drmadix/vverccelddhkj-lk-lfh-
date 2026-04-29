export const config = { runtime: "edge" };

const BASE_URL = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

const BLOCKED_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);

export default async function handler(request) {
  if (!BASE_URL) {
    return new Response("Server configuration error: TARGET_DOMAIN missing", {
      status: 500,
    });
  }

  try {
    const url = request.url;
    const slashIndex = url.indexOf("/", 8);
    const destination =
      slashIndex === -1 ? `${BASE_URL}/` : BASE_URL + url.substring(slashIndex);

    const headers = new Headers();
    let ip = null;

    for (const header of request.headers) {
      const key = header[0];
      const value = header[1];

      if (BLOCKED_HEADERS.has(key) || key.startsWith("x-vercel-")) continue;

      if (key === "x-real-ip" || key === "x-forwarded-for") {
        if (!ip) ip = value;
        continue;
      }

      headers.set(key, value);
    }

    if (ip) headers.set("x-forwarded-for", ip);

    const method = request.method;
    const sendBody = !(method === "GET" || method === "HEAD");

    const response = await fetch(destination, {
      method: method,
      headers: headers,
      body: sendBody ? request.body : undefined,
      duplex: "half",
      redirect: "manual",
    });

    return response;
  } catch (error) {
    console.error("proxy failure:", error);
    return new Response("Bad Gateway: Tunnel Failed", { status: 502 });
  }
}
export const config = { runtime: "edge" };

const BASE_URL = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

const BLOCKED_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);

export default async function handler(request) {
  if (!BASE_URL) {
    return new Response("Server configuration error: TARGET_DOMAIN missing", {
      status: 500,
    });
  }

  try {
    const url = request.url;
    const slashIndex = url.indexOf("/", 8);
    const destination =
      slashIndex === -1 ? `${BASE_URL}/` : BASE_URL + url.substring(slashIndex);

    const headers = new Headers();
    let ip = null;

    for (const header of request.headers) {
      const key = header[0];
      const value = header[1];

      if (BLOCKED_HEADERS.has(key) || key.startsWith("x-vercel-")) continue;

      if (key === "x-real-ip" || key === "x-forwarded-for") {
        if (!ip) ip = value;
        continue;
      }

      headers.set(key, value);
    }

    if (ip) headers.set("x-forwarded-for", ip);

    const method = request.method;
    const sendBody = !(method === "GET" || method === "HEAD");

    const response = await fetch(destination, {
      method: method,
      headers: headers,
      body: sendBody ? request.body : undefined,
      duplex: "half",
      redirect: "manual",
    });

    return response;
  } catch (error) {
    console.error("proxy failure:", error);
    return new Response("Bad Gateway: Tunnel Failed", { status: 502 });
  }
}
