import { PORTS } from "../shared.js";

let base = null;

/** The dev server picks the first free port; the browser probes the same list. */
async function resolveBase() {
  if (base) return base;
  for (const port of PORTS) {
    const url = `http://127.0.0.1:${port}`;
    try {
      const res = await fetch(`${url}/ping`, { cache: "no-store" });
      if (res.ok && (await res.json())?.webmark) {
        base = url;
        return base;
      }
    } catch {
      // port not listening — try the next one
    }
  }
  throw new Error("webmark: comment server not reachable");
}

async function call(path, options) {
  const res = await fetch(`${await resolveBase()}${path}`, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  if (!res.ok && res.status !== 204) throw new Error(`webmark: ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export const api = {
  ready: () => resolveBase().then(() => true).catch(() => false),
  list: async () => (await call("/comments")).comments,
  create: async (comment) => (await call("/comments", { method: "POST", body: JSON.stringify(comment) })).comment,
  patch: async (id, patch) =>
    (await call(`/comments/${id}`, { method: "PATCH", body: JSON.stringify(patch) })).comment,
  remove: (id) => call(`/comments/${id}`, { method: "DELETE" }),
  clear: () => call("/comments", { method: "DELETE" }),
};
