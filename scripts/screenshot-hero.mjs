// Screenshot the ProductShot <figure> via Chrome CDP and save to public/hero.png
import { spawn } from "child_process";
import { writeFileSync } from "fs";
import http from "http";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = new URL("../public/hero.png", import.meta.url).pathname;

const chrome = spawn(CHROME, [
  "--headless=new",
  "--remote-debugging-port=9223",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--hide-scrollbars",
  "--window-size=1470,900",
], { stdio: "ignore" });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const getWsUrl = () =>
  new Promise((resolve) => {
    const attempt = () =>
      http.get("http://localhost:9223/json/list", (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          const targets = JSON.parse(data);
          const page = targets.find((t) => t.type === "page");
          if (page) resolve(page.webSocketDebuggerUrl);
          else setTimeout(attempt, 300);
        });
      }).on("error", () => setTimeout(attempt, 300));
    attempt();
  });

await wait(1500);
const wsUrl = await getWsUrl();

const ws = new WebSocket(wsUrl);
let msgId = 0;
const pending = new Map();

ws.addEventListener("message", ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});

await new Promise((r) => ws.addEventListener("open", r));

const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++msgId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Page.enable");
await send("Page.navigate", { url: "http://localhost:3000" });
await wait(3000); // let fonts + animations settle

const evalResp = await send("Runtime.evaluate", {
  expression: `(() => {
    const fig = document.querySelector('main section:nth-of-type(2) figure');
    if (!fig) return null;
    const r = fig.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  })()`,
  returnByValue: true,
});

const clip = evalResp.result?.result?.value;
if (!clip) { console.error("figure not found on page", JSON.stringify(evalResp)); process.exit(1); }

const shotResp = await send("Page.captureScreenshot", {
  format: "png",
  clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 2 },
  captureBeyondViewport: true,
});

writeFileSync(OUT, Buffer.from(shotResp.result.data, "base64"));
console.log(`saved → ${OUT} (${clip.width}×${clip.height} @2x)`);

ws.close();
chrome.kill();
