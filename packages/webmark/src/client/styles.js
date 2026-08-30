export const css = `
:host {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2147483647;
  --font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --bar-bg: #0f0f0d;
  --bar-raised: #1c1c18;
  --bar-line: #3a3a34;
  --bar-fg: #e8e8e2;
  --bar-mute: #a8a89e;
  --bar-shadow: 0 6px 20px rgba(15, 15, 13, .35);
  --accent: #c4d600;
  --accent-hover: #b0c000;
  --on-accent: #0f0f0d;
  --pin-ring: #3f4700;
  --pin-shadow: 0 2px 8px rgba(63, 71, 0, .35);
  --panel-bg: #1c1c18;
  --panel-border: #3a3a34;
  --panel-elev: #26261f;
  --hairline: #26261f;
  --muted: #a8a89e;
  --faint: #8f8f84;
  --chip-bg: #26261f;
  --chip-text: #a8a89e;
  --field-bg: #26261f;
  --field-focus: #33332b;
  --accent-tint: #2c3010;
  --accent-border: #59631a;
  --accent-fill: rgba(196, 214, 0, .26);
  --shadow: 0 12px 36px rgba(0, 0, 0, .55);
  --scrim: rgba(0, 0, 0, .45);
  --danger: #e4685c;
  --ease: cubic-bezier(.2, .9, .3, 1);
  font-family: var(--font);
  color: var(--bar-fg);
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after { box-sizing: border-box; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
button:focus-visible, textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
[hidden] { display: none !important; }

/* ---------- page overlays ---------- */
.scrim {
  position: absolute; inset: 0; background: var(--scrim);
  opacity: 0; transition: opacity .2s var(--ease);
}
.scrim.on { opacity: 1; }
.highlight {
  position: absolute; border-radius: 12px; border: 2px solid var(--accent);
  background: var(--accent-fill); opacity: 0;
  transition: top .1s var(--ease), left .1s var(--ease), width .1s var(--ease),
    height .1s var(--ease), opacity .12s var(--ease);
}
.highlight.on { opacity: 1; }
.hl-label {
  position: absolute; max-width: min(26rem, calc(100vw - 2rem));
  padding: 6px 12px; border-radius: 999px; background: var(--accent); color: var(--on-accent);
  font-size: 12.5px; font-weight: 700; line-height: 1.2; box-shadow: var(--pin-shadow);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0;
  transition: top .1s var(--ease), left .1s var(--ease), opacity .12s var(--ease);
}
.hl-label.on { opacity: 1; }
.toolbar {
  position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 8px 0 14px;
  border-radius: 999px; background: var(--bar-bg); border: 1px solid var(--bar-line);
  box-shadow: var(--bar-shadow); font-size: 13px; animation: pop .2s var(--ease);
}
.toolbar b { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.toolbar .dot { color: var(--bar-line); }
.toolbar .dim { color: var(--bar-mute); }
.toolbar .esc {
  padding: 4px 10px; border-radius: 999px; background: var(--bar-raised);
  font-size: 11px; font-weight: 600; color: var(--bar-mute);
}
.toolbar svg { color: var(--accent); }

/* ---------- pins ---------- */
.pin {
  position: absolute; display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; height: 22px; padding: 0 6px; pointer-events: auto;
  border-radius: 8px 8px 8px 3px; background: var(--accent); color: var(--on-accent);
  box-shadow: 0 0 0 1px var(--pin-ring), var(--pin-shadow);
  font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums;
  transition: transform .15s var(--ease);
}
.pin:hover, .pin.active { transform: scale(1.12); }

/* ---------- popover ---------- */
.popover {
  position: absolute; width: 264px; pointer-events: auto; padding: 14px;
  border-radius: 16px; background: var(--panel-bg); border: 1px solid var(--panel-border);
  box-shadow: var(--shadow); animation: pop .16s var(--ease);
}
.popover p { font-size: 13.5px; line-height: 1.5; word-break: break-word; }
.popover .row { display: flex; align-items: center; gap: 4px; margin-top: 12px; }
.popover .num {
  padding: 2px 8px; border-radius: 999px; background: var(--chip-bg);
  color: var(--chip-text); font-size: 11px; font-weight: 600;
}
.popover .confirm-title { font-size: 13.5px; font-weight: 600; }
.popover .confirm-sub { margin-top: 4px; font-size: 12.5px; color: var(--muted); }
.popover .confirm-row { display: flex; gap: 8px; margin-top: 14px; }

/* ---------- panel ---------- */
.panel {
  position: absolute; right: 20px; bottom: 78px; width: min(348px, calc(100vw - 40px));
  max-height: calc(100vh - 160px); display: flex; flex-direction: column; overflow: hidden;
  pointer-events: auto; border-radius: 16px; background: var(--panel-bg);
  border: 1px solid var(--panel-border); box-shadow: var(--shadow);
  animation: pop .2s var(--ease); transition: opacity .15s var(--ease);
}
.header { display: flex; align-items: center; gap: 8px; padding: 14px 16px 8px; flex: none; }
.header h2 { font-size: 14px; font-weight: 600; letter-spacing: -.01em; }
.count {
  display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px;
  padding: 0 6px; border-radius: 999px; font-size: 11px; font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.count.soft { background: var(--accent-tint); color: var(--accent); }
.count.solid { background: var(--accent); color: var(--on-accent); }
.spacer { flex: 1; }

.iconbtn {
  display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
  border-radius: 8px; color: var(--faint); transition: background .15s var(--ease), color .15s var(--ease);
}
.iconbtn:hover { background: var(--panel-elev); color: var(--bar-fg); }

/* height + fade, so state changes read as one motion */
.collapse {
  display: grid; grid-template-rows: 0fr; opacity: 0;
  transition: grid-template-rows .2s var(--ease), opacity .2s var(--ease);
}
.collapse.open { grid-template-rows: 1fr; opacity: 1; }
.collapse > div { min-height: 0; overflow: hidden; }
.collapse:not(.open) > div { pointer-events: none; }

.addressed { padding: 0 16px 10px; }
.addressed-card {
  border-radius: 12px; background: var(--panel-elev); padding: 10px 12px;
}
.addressed-head { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; }
.addressed-head .tick { color: var(--accent); display: inline-flex; }
.addressed li { margin-top: 6px; font-size: 12px; line-height: 1.45; color: var(--muted); }
.addressed li::marker { color: var(--faint); }
.addressed ul { list-style: none; }

.composer { padding: 0 16px 8px; }
.chip {
  display: inline-flex; align-items: center; gap: 6px; max-width: 100%; margin-bottom: 8px;
  padding: 4px 8px; border-radius: 999px; background: var(--accent-tint); color: var(--accent);
  font-size: 11.5px; font-weight: 600;
}
.chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
textarea {
  width: 100%; min-height: 76px; resize: none; padding: 10px 12px; border-radius: 12px;
  border: 1px solid transparent; background: var(--field-bg); color: var(--bar-fg);
  font: inherit; font-size: 13.5px; line-height: 1.5;
  transition: background .15s var(--ease), border-color .15s var(--ease);
}
textarea::placeholder { color: var(--faint); }
textarea:focus { outline: none; background: var(--field-focus); border-color: var(--accent-border); }
.compose-foot { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.hint { font-size: 11.5px; color: var(--faint); }
.hint code { font-family: var(--mono); }
.ghost {
  height: 32px; padding: 0 12px; border-radius: 999px; font-size: 13px; font-weight: 500;
  color: var(--muted); transition: background .15s var(--ease), color .15s var(--ease);
}
.ghost:hover { background: var(--panel-elev); color: var(--bar-fg); }
.primary {
  height: 32px; padding: 0 16px; border-radius: 999px; background: var(--accent);
  color: var(--on-accent); font-size: 13px; font-weight: 700;
  transition: background .15s var(--ease), opacity .15s var(--ease);
}
.primary:hover { background: var(--accent-hover); }
.primary:disabled { opacity: .45; cursor: not-allowed; }
.danger {
  height: 32px; padding: 0 14px; border-radius: 999px; background: var(--danger);
  color: #fff; font-size: 13px; font-weight: 600; transition: filter .15s var(--ease);
}
.danger:hover { filter: brightness(.9); }
.danger.sm, .ghost.sm { height: 26px; padding: 0 10px; font-size: 11.5px; }

.empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px 24px 28px; }
.empty-icon {
  display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;
  border-radius: 999px; background: var(--panel-elev); color: var(--muted);
}
.empty-title { margin-top: 12px; font-size: 13.5px; font-weight: 600; }
.empty-sub { margin-top: 4px; font-size: 12.5px; line-height: 1.5; color: var(--muted); }

.actions { display: flex; gap: 8px; padding: 0 16px 12px; flex: none; }
.action {
  display: flex; align-items: center; gap: 8px; flex: 1; height: 38px; padding: 0 12px;
  border-radius: 12px; background: var(--panel-elev); font-size: 13px; font-weight: 500;
  transition: background .15s var(--ease);
}
.action:hover { background: var(--field-focus); }
.action span:not(.kbd) { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.action svg { flex: none; }
.kbd {
  margin-left: auto; padding: 2px 6px; border-radius: 5px; background: rgba(58, 58, 52, .45);
  font-size: 10px; font-weight: 600; color: var(--bar-mute);
}

ul { list-style: none; padding: 0; margin: 0; }
.list { max-height: 280px; overflow-y: auto; overscroll-behavior: contain; border-top: 1px solid var(--hairline); scrollbar-width: thin; scrollbar-color: var(--bar-line) transparent; }
.item { padding: 12px 16px; border-bottom: 1px solid var(--hairline); transition: background .15s var(--ease); }
.item:last-child { border-bottom: 0; }
.item:hover { background: rgba(38, 38, 31, .6); }
.item-top { display: flex; align-items: flex-start; gap: 10px; }
.badge {
  display: inline-flex; align-items: center; justify-content: center; flex: none;
  width: 22px; height: 22px; margin-top: 1px; border-radius: 999px; background: var(--accent);
  color: var(--on-accent); font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums;
}
.item-body { flex: 1; min-width: 0; }
.item-text { font-size: 13.5px; line-height: 1.35; word-break: break-word; }
.item-chip {
  display: inline-block; max-width: 100%; margin-top: 6px; padding: 2px 8px; border-radius: 999px;
  background: var(--chip-bg); color: var(--chip-text); font-size: 11.5px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom;
}
.item-confirm { display: flex; align-items: center; gap: 8px; margin: 10px 0 0 32px; }
.item-confirm span { font-size: 11.5px; color: var(--muted); }

.footer {
  display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 12px; flex: none;
  border-top: 1px solid var(--hairline); font-size: 12.5px;
}
.footer button { white-space: nowrap; color: var(--muted); border-radius: 999px; height: 28px; padding: 0 10px;
  transition: background .15s var(--ease), color .15s var(--ease); }
.footer button:hover { background: var(--panel-elev); color: var(--bar-fg); }
.footer .toggle { display: inline-flex; align-items: center; gap: 6px; }
.chev { display: inline-flex; transition: transform .2s var(--ease); }
.chev.up { transform: rotate(180deg); }
.others { font-size: 11.5px; color: var(--faint); padding: 8px 16px; border-top: 1px solid var(--hairline); }

/* ---------- launcher ---------- */
.launcher {
  position: absolute; right: 20px; bottom: 20px; height: 46px; padding: 0 7px;
  display: flex; align-items: center; pointer-events: auto;
  background: var(--bar-bg); border: 1px solid var(--bar-line); border-radius: 999px;
  box-shadow: var(--bar-shadow);
  transition: box-shadow .14s ease, background .25s ease, opacity .15s var(--ease);
}
.launcher:hover { box-shadow: 0 10px 28px rgba(15, 15, 13, .45); }
.launch-action {
  display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px;
  border-radius: 999px; color: var(--bar-mute);
  transition: background .15s var(--ease), color .15s var(--ease);
}
.launch-action:hover { background: var(--bar-raised); color: var(--bar-fg); }
.launch-div { width: 1px; height: 18px; margin: 0 6px; background: var(--bar-line); }
.launch-main {
  display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px;
  border-radius: 999px; font-size: 14px; font-weight: 600;
  transition: background .15s var(--ease);
}
.launch-main:hover { background: var(--bar-raised); }

.fade { opacity: 0; pointer-events: none; }

@keyframes pop {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  *, .collapse, .highlight, .hl-label { transition: none !important; animation: none !important; }
}
`;
