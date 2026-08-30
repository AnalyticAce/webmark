import { createServer } from "node:http";

import { PORTS } from "../shared.js";
import { VERSION } from "../version.js";
import { read, sanitize, update } from "./store.js";

const MAX_BODY = 256 * 1024;

/** Only pages served from this machine may talk to the store. */
function allowedOrigin(origin) {
  if (!origin) return "*";
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
      ? origin
      : null;
  } catch {
    return null;
  }
}

function send(res, status, body) {
  const payload = body === undefined ? "" : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

async function handle(req, res, root) {
  const origin = allowedOrigin(req.headers.origin);
  if (origin === null) return send(res, 403, { error: "origin not allowed" });
  res.setHeader("access-control-allow-origin", origin);
  res.setHeader("vary", "origin");

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "600",
    });
    return res.end();
  }

  const url = new URL(req.url, "http://127.0.0.1");
  const [, base, id] = url.pathname.split("/");

  if (base === "ping") return send(res, 200, { webmark: true, version: VERSION });
  if (base !== "comments") return send(res, 404, { error: "not found" });

  if (req.method === "GET") return send(res, 200, { comments: await read(root) });

  if (req.method === "POST") {
    const body = await readBody(req);
    const created = sanitize(body);
    await update(root, (all) => [...all, created]);
    return send(res, 201, { comment: created });
  }

  if (req.method === "PATCH" && id) {
    const body = await readBody(req);
    let updated = null;
    await update(root, (all) =>
      all.map((c) => (c.id === id ? (updated = sanitize({ ...body }, c)) : c)),
    );
    return updated ? send(res, 200, { comment: updated }) : send(res, 404, { error: "not found" });
  }

  if (req.method === "DELETE") {
    await update(root, (all) => (id ? all.filter((c) => c.id !== id) : []));
    return send(res, 204);
  }

  return send(res, 405, { error: "method not allowed" });
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(port);
    });
  });
}

let running = null;

/**
 * Starts the local comment store. Dev only — never call this from a production server.
 * Returns the port it bound to, or null when every candidate port was taken.
 */
export async function start({ root = process.cwd(), silent = false } = {}) {
  if (running) return running;

  const server = createServer((req, res) => {
    handle(req, res, root).catch((err) => {
      send(res, err.message === "invalid json" ? 400 : 500, { error: err.message });
    });
  });
  server.unref(); // never hold the dev server open

  for (const port of PORTS) {
    try {
      await listen(server, port);
      running = port;
      if (!silent) console.log(`  webmark   review comments on :${port}`);
      return port;
    } catch (err) {
      if (err.code !== "EADDRINUSE") throw err;
    }
  }

  if (!silent) console.warn("  webmark   no free port found, review widget disabled");
  return null;
}
