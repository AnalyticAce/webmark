#!/usr/bin/env node
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { STORE_DIR } from "../shared.js";
import { VERSION } from "../version.js";
import { read, sanitize, storePath, write } from "../server/store.js";
import { agentsBlock, clientFile, END, MD_END, MD_START, serverFile, START } from "./templates.js";

const root = process.cwd();
const rel = (p) => relative(root, p) || ".";
const touched = [];

const log = {
  step: (verb, file) => touched.push(`  ${verb.padEnd(8)} ${rel(file)}`),
  done: (title) => {
    console.log(`\n${title}\n${touched.join("\n")}\n`);
    touched.length = 0;
  },
  warn: (msg) => console.warn(`  ! ${msg}`),
};

async function readIfExists(file) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

/** Next looks for these in the project root or in src/. */
function projectPaths() {
  const useSrc = existsSync(join(root, "src", "app")) || existsSync(join(root, "src", "pages"));
  const dir = useSrc ? join(root, "src") : root;
  const ext = existsSync(join(root, "tsconfig.json")) ? "ts" : "js";
  return {
    client: join(dir, `instrumentation-client.${ext}`),
    server: join(dir, `instrumentation.${ext}`),
    gitignore: join(root, ".gitignore"),
    agents: join(root, "AGENTS.md"),
    store: join(root, STORE_DIR),
  };
}

function hasBlock(text) {
  return text?.includes(START) || text?.includes(MD_START);
}

function stripBlock(text, start, end) {
  const from = text.indexOf(start);
  if (from < 0) return { text, removed: false };
  const to = text.indexOf(end, from);
  if (to < 0) return { text, removed: false };
  const next = (text.slice(0, from) + text.slice(to + end.length)).replace(/\n{3,}/g, "\n\n");
  return { text: next.trim() ? next.trimStart() : "", removed: true };
}

async function writeBlock(file, block, existing) {
  if (existing === null) {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, block, "utf8");
    log.step("created", file);
    return true;
  }
  if (hasBlock(existing)) {
    log.step("kept", file);
    return true;
  }
  if (/export\s+(async\s+)?function\s+register/.test(existing)) return false;
  await writeFile(file, `${existing.trimEnd()}\n\n${block}`, "utf8");
  log.step("updated", file);
  return true;
}

async function init() {
  const paths = projectPaths();

  const clientExisting = await readIfExists(paths.client);
  if (!(await writeBlock(paths.client, clientFile, clientExisting))) {
    log.warn(`add the webmark block to ${rel(paths.client)} by hand`);
  }

  const serverExisting = await readIfExists(paths.server);
  if (!(await writeBlock(paths.server, serverFile, serverExisting))) {
    log.warn(
      `${rel(paths.server)} already exports register() — call \`(await import("@dshalom/webmark/server")).start()\` inside it`,
    );
  }

  const gitignore = (await readIfExists(paths.gitignore)) ?? "";
  if (!gitignore.split("\n").some((line) => line.trim() === `${STORE_DIR}/`)) {
    await writeFile(
      paths.gitignore,
      `${gitignore.trimEnd()}\n\n# webmark review comments (local only)\n${STORE_DIR}/\n`,
      "utf8",
    );
    log.step(gitignore ? "updated" : "created", paths.gitignore);
  } else {
    log.step("kept", paths.gitignore);
  }

  const agents = await readIfExists(paths.agents);
  if (agents === null) {
    await writeFile(paths.agents, agentsBlock, "utf8");
    log.step("created", paths.agents);
  } else if (agents.includes(MD_START)) {
    log.step("kept", paths.agents);
  } else {
    await writeFile(paths.agents, `${agents.trimEnd()}\n\n${agentsBlock}`, "utf8");
    log.step("updated", paths.agents);
  }

  log.done("webmark installed");
  console.log("  Restart the dev server. The review pill appears bottom-right in development only.\n");
}

async function eject() {
  const paths = projectPaths();

  for (const [file, start, end] of [
    [paths.client, START, END],
    [paths.server, START, END],
    [paths.agents, MD_START, MD_END],
  ]) {
    const existing = await readIfExists(file);
    if (!existing) continue;
    const { text, removed } = stripBlock(existing, start, end);
    if (!removed) continue;
    if (text.trim()) {
      await writeFile(file, text.endsWith("\n") ? text : `${text}\n`, "utf8");
      log.step("updated", file);
    } else {
      await rm(file);
      log.step("removed", file);
    }
  }

  const gitignore = await readIfExists(paths.gitignore);
  if (gitignore?.includes(`${STORE_DIR}/`)) {
    const next = gitignore
      .split("\n")
      .filter((l) => l.trim() !== `${STORE_DIR}/` && !l.startsWith("# webmark review comments"))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
    await writeFile(paths.gitignore, next, "utf8");
    log.step("updated", paths.gitignore);
  }

  if (existsSync(paths.store)) {
    await rm(paths.store, { recursive: true, force: true });
    log.step("removed", paths.store);
  }

  log.done("webmark ejected");
  console.log("  Finish with: npm rm -D webmark\n");
}

function format(comments) {
  if (!comments.length) return "No comments.";
  return comments
    .map((c) => {
      const a = c.anchor;
      const lines = [
        `### ${c.id}${c.resolved ? " (resolved)" : ""}`,
        c.text,
        "",
        `- route: ${c.route}`,
      ];
      if (a?.label) lines.push(`- element: <${a.tag}> "${a.label}"`);
      if (a?.componentPath || a?.component) lines.push(`- component: ${a.componentPath ?? a.component}`);
      if (a?.source) lines.push(`- source: ${a.source}`);
      if (a?.selector) lines.push(`- selector: ${a.selector}`);
      if (c.resolvedNote) lines.push(`- note: ${c.resolvedNote}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

async function list(args) {
  const all = await read(root);
  const open = args.includes("--all") ? all : all.filter((c) => !c.resolved);
  if (args.includes("--json")) {
    console.log(JSON.stringify(open, null, 2));
    return;
  }
  console.log(`# Review comments (${open.length})\n`);
  console.log(format(open));
  if (open.length) console.log(`\nResolve with: npx webmark resolve <id> --note "what changed"`);
}

async function resolve(args) {
  const [id] = args;
  const noteIndex = args.indexOf("--note");
  const note = noteIndex >= 0 ? args[noteIndex + 1] : null;
  if (!id) {
    console.error("usage: webmark resolve <id> --note \"what changed\"");
    process.exitCode = 1;
    return;
  }
  const all = await read(root);
  const target = all.find((c) => c.id === id);
  if (!target) {
    console.error(`webmark: no comment ${id}`);
    process.exitCode = 1;
    return;
  }
  await write(
    all.map((c) => (c.id === id ? sanitize({ resolved: true, resolvedNote: note }, c) : c)),
    root,
  );
  console.log(`resolved ${id}${note ? ` — ${note}` : ""}`);
}

const help = `webmark ${VERSION} — point-and-comment review for the page your agent just built

  npx webmark init                      wire the widget into this Next.js app
  npx webmark eject                     remove every trace of it
  npx webmark list [--all] [--json]     print open comments (for you or your agent)
  npx webmark resolve <id> --note "…"   mark one addressed

  comments live in ${STORE_DIR}/comments.json (gitignored, local only)
`;

const [command, ...args] = process.argv.slice(2);
const commands = { init, eject, list, resolve };

if (!command || command === "help" || command === "--help") {
  console.log(help);
} else if (commands[command]) {
  await commands[command](args);
} else {
  console.error(`webmark: unknown command "${command}"\n`);
  console.log(help);
  process.exitCode = 1;
}
