import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { STORE_DIR, STORE_FILE } from "../shared.js";

/** All state lives in one gitignored file — it is also what coding agents read. */
export function storePath(root = process.cwd()) {
  return join(root, STORE_DIR, STORE_FILE);
}

export async function read(root) {
  let raw;
  try {
    raw = await readFile(storePath(root), "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return []; // no comments yet
    throw err;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.comments) ? parsed.comments : [];
  } catch {
    // Never treat a corrupt file as empty: the next write would wipe every comment.
    throw new Error(`webmark: ${storePath(root)} is not valid JSON — fix or delete it`);
  }
}

let writes = 0;
let queue = Promise.resolve();

export async function write(comments, root) {
  const file = storePath(root);
  await mkdir(dirname(file), { recursive: true });
  const body = JSON.stringify({ version: 1, comments }, null, 2) + "\n";
  // Write-then-rename so a reader never sees a half-written file. The temp name is unique per
  // write: concurrent writes sharing one temp file interleave and leave a corrupt tail.
  const tmp = `${file}.${process.pid}.${++writes}.tmp`;
  await writeFile(tmp, body, "utf8");
  await rename(tmp, file);
  return comments;
}

/** Read-modify-write, serialized so concurrent requests can't drop each other's changes. */
export function update(root, fn) {
  const next = queue.then(async () => write(await fn(await read(root)), root));
  queue = next.catch(() => {}); // one failed update must not block the ones after it
  return next;
}

export function newId() {
  return `c_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

/** Trusted shape — everything a browser sends is rebuilt field by field. */
export function sanitize(input, existing = {}) {
  const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : undefined);
  const anchor = input.anchor && typeof input.anchor === "object" ? input.anchor : undefined;
  return {
    id: existing.id ?? newId(),
    text: str(input.text, 4000) ?? existing.text ?? "",
    route: str(input.route, 512) ?? existing.route ?? "/",
    url: str(input.url, 2048) ?? existing.url ?? "",
    viewport:
      input.viewport && Number.isFinite(input.viewport.w)
        ? { w: Math.round(input.viewport.w), h: Math.round(input.viewport.h) }
        : existing.viewport,
    anchor: anchor
      ? {
          selector: str(anchor.selector, 1024) ?? "",
          label: str(anchor.label, 300) ?? "",
          tag: str(anchor.tag, 40) ?? "",
          component: str(anchor.component, 200) ?? null,
          componentPath: str(anchor.componentPath, 400) ?? null,
          source: str(anchor.source, 512) ?? null,
        }
      : (input.anchor === null ? null : (existing.anchor ?? null)),
    resolved: typeof input.resolved === "boolean" ? input.resolved : (existing.resolved ?? false),
    resolvedNote: str(input.resolvedNote, 2000) ?? existing.resolvedNote ?? null,
    resolvedAt: input.resolved && !existing.resolved ? new Date().toISOString() : (existing.resolvedAt ?? null),
    seen: typeof input.seen === "boolean" ? input.seen : (existing.seen ?? false),
    createdAt: existing.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
