import { test } from "node:test";
import assert from "node:assert/strict";
import { api } from "./api.js";

const json = (status, body) => new Response(body === undefined ? "oops" : JSON.stringify(body), { status });

test("a failed request reports the server's reason, or the status when there is none", async () => {
  const replies = [{ error: "comments.json is not valid JSON — fix or delete it" }, undefined];
  globalThis.fetch = async (url) => (url.endsWith("/ping") ? json(200, { webmark: true }) : json(500, replies.shift()));
  await assert.rejects(api.create({ text: "x" }), { message: "comments.json is not valid JSON — fix or delete it" });
  await assert.rejects(api.create({ text: "x" }), { message: "webmark: 500" });
});
