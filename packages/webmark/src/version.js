import { createRequire } from "node:module";

/** Read from the manifest so it can never drift from the published version. Node-only —
    `shared.js` is bundled for the browser and must stay free of node builtins. */
export const VERSION = createRequire(import.meta.url)("../package.json").version;
