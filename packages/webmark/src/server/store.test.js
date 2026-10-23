import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { read, storePath, update, write } from "./store.js";

const freshRoot = () => mkdtemp(join(tmpdir(), "webmark-"));

test("concurrent updates keep valid JSON and every change", async () => {
  const root = await freshRoot();
  await write([{ id: "a", text: "x".repeat(500), seen: false }], root);
  // Mix of growing and shrinking writes, all at once (what a page load does with "seen" PATCHes).
  await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      update(root, (all) =>
        i % 2 ? [...all, { id: `n${i}` }] : all.map((c) => ({ ...c, text: c.text?.slice(0, 10) })),
      ),
    ),
  );
  const parsed = JSON.parse(await readFile(storePath(root), "utf8"));
  assert.equal(parsed.comments.length, 21); // "a" + 20 added, none lost
});

test("a corrupt store is an error, not an empty list", async () => {
  const root = await freshRoot();
  await write([{ id: "a" }], root);
  await writeFile(storePath(root), (await readFile(storePath(root), "utf8")) + "}\n");
  await assert.rejects(read(root), /not valid JSON/);
});

test("a missing store reads as empty", async () => {
  assert.deepEqual(await read(await freshRoot()), []);
});
