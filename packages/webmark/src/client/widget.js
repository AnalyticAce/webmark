import { describe, isOurs, labelFor, resolveAnchor } from "./anchor.js";
import { api } from "./api.js";
import { icons } from "./icons.js";
import { css } from "./styles.js";

const HOST_TAG = "webmark-root";
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const state = {
  open: false,
  picking: false,
  target: null,
  notes: [], // unresolved comments anchored on this route
  others: 0, // unresolved comments on other routes
  addressed: [], // resolved-and-not-yet-seen, surfaced once
  draft: null, // { id?, anchor? } while composing
  expanded: false,
  activePin: null,
  hovered: null,
  confirm: null, // comment id, or "all"
  sticky: false, // popover opened by a click — survives the pointer leaving
};

let root; // shadow root
let el; // element refs

function template() {
  return `
    <style>${css}</style>
    <div class="scrim" part="scrim"></div>
    <div class="highlight"></div>
    <div class="hl-label"></div>
    <div class="toolbar" hidden>
      <b>${icons.target(16)} Click to comment</b>
      <span class="dot">·</span>
      <span class="dim">⌥ scroll to resize</span>
      <span class="esc">Esc</span>
    </div>
    <div class="pins"></div>
    <div class="popover" hidden></div>

    <div class="panel" hidden role="dialog" aria-label="Review">
      <div class="header">
        <h2>Review</h2>
        <span class="count soft head-count" hidden></span>
        <span class="spacer"></span>
        <button class="iconbtn" data-act="close" aria-label="Close review panel">${icons.close(15)}</button>
      </div>

      <div class="collapse addressed-wrap"><div><div class="addressed"></div></div></div>

      <div class="collapse composer-wrap"><div>
        <div class="composer">
          <span class="chip" hidden></span>
          <label class="sr-only" for="webmark-note" hidden>Comment</label>
          <textarea id="webmark-note" placeholder="Describe the issue or idea…" rows="3"></textarea>
          <div class="compose-foot">
            <span class="hint"><code>⌘↵</code> to save</span>
            <span class="spacer"></span>
            <button class="ghost" data-act="cancel">Cancel</button>
            <button class="primary" data-act="save">Save</button>
          </div>
        </div>
      </div></div>

      <div class="collapse empty-wrap"><div>
        <div class="empty">
          <div class="empty-icon">${icons.note(20)}</div>
          <div class="empty-title">No comments yet</div>
          <div class="empty-sub">Add a note, or pick an element on the page to anchor your feedback.</div>
        </div>
      </div></div>

      <div class="actions">
        <button class="action" data-act="add-note">${icons.note(15)}<span>Add note</span><span class="kbd">C</span></button>
        <button class="action" data-act="pick">${icons.target(15)}<span>Pick element</span><span class="kbd">T</span></button>
      </div>

      <div class="collapse list-wrap"><div><ul class="list"></ul></div></div>
      <div class="others" hidden></div>

      <div class="footer" hidden></div>
    </div>

    <div class="launcher">
      <button class="launch-action" data-act="add-note" aria-label="Add note" title="Add note">${icons.note(16)}</button>
      <button class="launch-action" data-act="pick" aria-label="Pick element" title="Pick element">${icons.target(16)}</button>
      <span class="launch-div"></span>
      <button class="launch-main" data-act="toggle-panel" aria-label="Review">
        <span>Review</span><span class="count solid launch-count" hidden></span>
      </button>
    </div>`;
}

/* ---------------------------------------------------------------- rendering */

function syncPanel() {
  el.panel.hidden = !state.open;
  el.panel.classList.toggle("fade", state.picking);
  el.launcher.classList.toggle("fade", state.picking);
  el.toolbar.hidden = !state.picking;
  el.scrim.classList.toggle("on", state.picking);

  const n = state.notes.length;
  el.headCount.hidden = n === 0;
  el.headCount.textContent = n;
  el.launchCount.hidden = n === 0;
  el.launchCount.textContent = n;

  el.composerWrap.classList.toggle("open", !!state.draft);
  el.emptyWrap.classList.toggle("open", n === 0 && !state.draft && state.addressed.length === 0);
  el.listWrap.classList.toggle("open", state.expanded && n > 0);
  el.addressedWrap.classList.toggle("open", state.addressed.length > 0);

  const anchor = state.draft?.anchor;
  el.chip.hidden = !anchor;
  if (anchor) {
    el.chip.innerHTML = `${icons.target(11)}<span>${esc(anchor.label)}</span>`;
    el.chip.title = anchor.selector;
  }
  el.save.disabled = !el.textarea.value.trim();

  el.others.hidden = state.others === 0;
  el.others.textContent = `+${state.others} comment${state.others > 1 ? "s" : ""} on other pages`;

  renderFooter();
}

function renderFooter() {
  const n = state.notes.length;
  el.footer.hidden = n === 0;
  if (n === 0) return;
  el.footer.innerHTML =
    state.confirm === "all"
      ? `<span class="hint">Delete all ${n}? Your agent may have them already.</span>
         <span class="spacer"></span>
         <button data-act="clear-cancel">Cancel</button>
         <button class="danger sm" data-act="clear-yes">Delete</button>`
      : `<button class="toggle" data-act="toggle-list">
           <span class="chev ${state.expanded ? "up" : ""}">${icons.chevron(13)}</span>
           <span>${state.expanded ? "Hide comments" : `Show ${n} comment${n > 1 ? "s" : ""}`}</span>
         </button>
         <span class="spacer"></span>
         <button class="toggle" data-act="copy" title="Copy a prompt for your coding agent">${icons.copy(13)}<span>Copy</span></button>
         <button data-act="clear">Delete all</button>`;
}

function renderAddressed() {
  if (!state.addressed.length) return;
  el.addressed.innerHTML = `
    <div class="addressed-card">
      <div class="addressed-head">
        <span class="tick">${icons.check(13)}</span>
        <span>${state.addressed.length} addressed</span>
        <span class="spacer"></span>
        <button class="iconbtn" data-act="dismiss-addressed" aria-label="Dismiss">${icons.close(13)}</button>
      </div>
      <ul>${state.addressed
        .map((c) => `<li>${esc(c.resolvedNote || c.text)}</li>`)
        .join("")}</ul>
    </div>`;
}

function renderList() {
  el.list.innerHTML = state.notes
    .map(
      (c, i) => `
      <li class="item" data-id="${c.id}">
        <div class="item-top">
          <span class="badge">${i + 1}</span>
          <div class="item-body">
            <div class="item-text">${esc(c.text)}</div>
            ${c.anchor ? `<span class="item-chip" title="${esc(c.anchor.selector)}">${esc(c.anchor.label)}</span>` : ""}
          </div>
          <button class="iconbtn" data-act="edit" data-id="${c.id}" aria-label="Edit note ${i + 1}">${icons.edit(14)}</button>
          <button class="iconbtn" data-act="ask-delete" data-id="${c.id}" aria-label="Delete note ${i + 1}">${icons.trash(14)}</button>
        </div>
        ${
          state.confirm === c.id && state.activePin !== c.id
            ? `<div class="item-confirm">
                 <span>Delete this note?</span><span class="spacer"></span>
                 <button class="danger sm" data-act="delete" data-id="${c.id}">Delete</button>
                 <button class="ghost sm" data-act="cancel-delete">Cancel</button>
               </div>`
            : ""
        }
      </li>`,
    )
    .join("");
}

function renderPins() {
  el.pins.innerHTML = state.notes
    .map((c, i) =>
      c.anchor
        ? `<button class="pin" data-act="pin" data-id="${c.id}" aria-label="Note ${i + 1}: ${esc(c.text)}">${i + 1}</button>`
        : "",
    )
    .join("");
  positionPins();
}

function positionPins() {
  for (const pin of el.pins.children) {
    const note = state.notes.find((c) => c.id === pin.dataset.id);
    const rect = note?._el?.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) {
      pin.hidden = true;
      continue;
    }
    pin.hidden = false;
    pin.style.top = `${rect.top - 11}px`;
    pin.style.left = `${rect.right - 11}px`;
    pin.classList.toggle("active", state.activePin === note.id);
  }
  if (state.activePin) placePopover();
  syncHighlight();
}

/* ------------------------------------------------------------- highlighting */

function syncHighlight() {
  const pickRect = state.picking ? state.target?.getBoundingClientRect() : null;
  const focus =
    state.picking
      ? null
      : state.notes.find((c) => c.id === (state.activePin ?? state.hovered ?? state.draft?.id));
  const rect =
    pickRect ??
    focus?._el?.getBoundingClientRect() ??
    (state.draft?.anchor && !state.picking
      ? (state.draft.node ?? resolveAnchor(state.draft.anchor))?.getBoundingClientRect()
      : null);

  el.highlight.classList.toggle("on", !!rect);
  if (rect) {
    Object.assign(el.highlight.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  }

  const showLabel = !!(pickRect && state.target);
  el.hlLabel.classList.toggle("on", showLabel);
  if (showLabel) {
    el.hlLabel.textContent = labelFor(state.target);
    el.hlLabel.style.top = `${pickRect.top > 40 ? pickRect.top - 32 : pickRect.top + 8}px`;
    el.hlLabel.style.left = `${Math.max(8, Math.min(pickRect.left, window.innerWidth - 24))}px`;
  }
}

/* ---------------------------------------------------------------- popover */

function showPopover(id) {
  state.activePin = id;
  const note = state.notes.find((c) => c.id === id);
  if (!note) return hidePopover();
  const i = state.notes.indexOf(note);
  el.popover.hidden = false;
  el.popover.innerHTML =
    state.confirm === id
      ? `<div class="confirm-title">Delete this note?</div>
         <div class="confirm-sub">The pin will be removed from the page.</div>
         <div class="confirm-row">
           <button class="danger" style="flex:1" data-act="delete" data-id="${id}">Delete</button>
           <button class="ghost" style="flex:1;background:var(--panel-elev)" data-act="cancel-delete">Cancel</button>
         </div>`
      : `<p>${esc(note.text)}</p>
         <div class="row">
           <span class="num">${i + 1}</span><span class="spacer"></span>
           <button class="iconbtn" data-act="edit" data-id="${id}" aria-label="Edit note">${icons.edit(14)}</button>
           <button class="iconbtn" data-act="ask-delete" data-id="${id}" aria-label="Delete note">${icons.trash(14)}</button>
         </div>`;
  placePopover();
  syncHighlight();
  positionPins();
}

function placePopover() {
  const note = state.notes.find((c) => c.id === state.activePin);
  const rect = note?._el?.getBoundingClientRect();
  if (!rect) return hidePopover();
  const box = el.popover.getBoundingClientRect();
  // Touching the pin (top-right corner of the element), not the element's far edge — the pointer
  // has to be able to travel from pin to popover without ever leaving the widget.
  const below = rect.top + 10 + box.height < window.innerHeight;
  el.popover.style.top = `${below ? rect.top + 10 : Math.max(8, rect.top - box.height - 10)}px`;
  el.popover.style.left = `${Math.max(8, Math.min(rect.right - 11, window.innerWidth - box.width - 8))}px`;
}

function hidePopover() {
  state.activePin = null;
  state.sticky = false;
  el.popover.hidden = true;
  if (state.confirm !== "all") state.confirm = null;
  syncHighlight();
  positionPins();
}

/* ------------------------------------------------------------------ actions */

function compose(draft, body = "") {
  state.draft = draft;
  state.expanded = false;
  state.open = true;
  hidePopover();
  el.textarea.value = body;
  syncPanel();
  el.textarea.focus();
  requestAnimationFrame(() => el.textarea.focus());
}

function closePanel() {
  // An unfinished draft dies with the panel — no orphan anchor keeps a highlight alive.
  state.open = false;
  state.draft = null;
  state.confirm = null;
  el.textarea.value = "";
  syncPanel();
  syncHighlight();
}

async function save() {
  const text = el.textarea.value.trim();
  if (!text || !state.draft) return;
  const { id, anchor, node } = state.draft;
  try {
    if (id) {
      const updated = await api.patch(id, { text });
      const note = state.notes.find((c) => c.id === id);
      Object.assign(note, updated, { _el: note._el });
    } else {
      const created = await api.create({
        text,
        anchor: anchor ?? null,
        route: location.pathname,
        url: location.href,
        viewport: { w: window.innerWidth, h: window.innerHeight },
      });
      // The picked node beats a fresh lookup: it is the element the human actually clicked.
      created._el = anchor ? (node ?? resolveAnchor(anchor)) : null;
      state.notes.push(created);
    }
  } catch (err) {
    console.warn("[webmark] could not save comment:", err.message);
  }
  state.draft = null;
  el.textarea.value = "";
  state.expanded = true;
  refresh();
}

async function remove(id) {
  state.notes = state.notes.filter((c) => c.id !== id);
  state.confirm = null;
  if (state.draft?.id === id) state.draft = null;
  hidePopover();
  refresh();
  await api.remove(id).catch(() => {});
}

async function clearAll() {
  const ids = state.notes.map((c) => c.id);
  state.notes = [];
  state.confirm = null;
  state.draft = null;
  refresh();
  await Promise.all(ids.map((id) => api.remove(id).catch(() => {})));
}

async function copyForAgent() {
  const n = state.notes.length + state.others;
  const prompt = `Read .webmark/comments.json — ${n} open review comment${n > 1 ? "s" : ""} on this app. For each one, find the code it points at (route + component + the quoted text), make the change, then mark it resolved with a short note. Tell me anything you could not locate.`;
  try {
    await navigator.clipboard.writeText(prompt);
    flashFooter("Copied for your agent");
  } catch {
    flashFooter(".webmark/comments.json");
  }
}

function flashFooter(message) {
  el.footer.innerHTML = `<span class="hint">${esc(message)}</span>`;
  setTimeout(renderFooter, 1600);
}

function refresh() {
  renderList();
  renderPins();
  renderAddressed();
  syncPanel();
  syncHighlight();
}

/* ------------------------------------------------------------------- picker */

function targetAt(x, y) {
  const node = document.elementFromPoint(x, y);
  return node && !isOurs(node) ? node : null;
}

// While picking, the page must not react to the pointer at all. A mousedown on a field focuses
// it, and then everything typed into the composer lands in the app's form instead of the note.
function swallowPointer(e) {
  if (isOurs(e.target)) return;
  e.preventDefault();
  e.stopPropagation();
}

function startPicking() {
  if (state.picking) return;
  state.picking = true;
  document.body.style.cursor = "crosshair";
  document.addEventListener("mousemove", onPickMove, true);
  document.addEventListener("wheel", onPickWheel, { passive: false, capture: true });
  document.addEventListener("mousedown", swallowPointer, true);
  document.addEventListener("mouseup", swallowPointer, true);
  document.addEventListener("click", onPickClick, true);
  syncPanel();
}

function stopPicking() {
  if (!state.picking) return;
  state.picking = false;
  state.target = null;
  document.body.style.cursor = "";
  document.removeEventListener("mousemove", onPickMove, true);
  document.removeEventListener("wheel", onPickWheel, true);
  document.removeEventListener("mousedown", swallowPointer, true);
  document.removeEventListener("mouseup", swallowPointer, true);
  document.removeEventListener("click", onPickClick, true);
  syncPanel();
  syncHighlight();
}

function onPickMove(e) {
  state.target = targetAt(e.clientX, e.clientY);
  syncHighlight();
}

function onPickWheel(e) {
  if (!e.altKey || !state.target) return;
  e.preventDefault();
  const next = e.deltaY < 0 ? state.target.parentElement : state.target.firstElementChild;
  if (next && next !== document.body && !isOurs(next)) state.target = next;
  syncHighlight();
}

function onPickClick(e) {
  const node = targetAt(e.clientX, e.clientY);
  if (!node) return;
  e.preventDefault();
  e.stopPropagation();
  const anchor = describe(node);
  stopPicking();
  compose({ ...(state.draft ?? {}), anchor, node }, el.textarea.value);
}

/* -------------------------------------------------------------------- wiring */

function onAction(e) {
  const button = e.target.closest?.("[data-act]");
  if (!button) return;
  const { act, id } = button.dataset;
  const handlers = {
    close: closePanel,
    "toggle-panel": () => (state.open ? closePanel() : ((state.open = true), syncPanel())),
    "add-note": () => compose({}),
    pick: startPicking,
    cancel: () => {
      state.draft = null;
      el.textarea.value = "";
      syncPanel();
      syncHighlight();
    },
    save,
    "toggle-list": () => {
      state.expanded = !state.expanded;
      syncPanel();
      if (state.expanded) requestAnimationFrame(() => (el.list.scrollTop = el.list.scrollHeight));
    },
    copy: copyForAgent,
    clear: () => {
      state.confirm = "all";
      renderFooter();
    },
    "clear-cancel": () => {
      state.confirm = null;
      renderFooter();
    },
    "clear-yes": clearAll,
    edit: () => {
      const note = state.notes.find((c) => c.id === id);
      if (note) compose({ id: note.id, anchor: note.anchor, node: note._el }, note.text);
    },
    "ask-delete": () => {
      state.confirm = id;
      state.activePin === id ? showPopover(id) : renderList();
    },
    "cancel-delete": () => {
      state.confirm = null;
      state.activePin ? showPopover(state.activePin) : renderList();
    },
    delete: () => remove(id),
    "dismiss-addressed": () => {
      state.addressed = [];
      renderAddressed();
      syncPanel();
    },
    pin: () => (state.activePin === id ? hidePopover() : showPopover(id)),
  };
  handlers[act]?.();
}

function onKey(e) {
  // A shadow root retargets `e.target` to the host, so our own textarea would read as the page
  // and every typed "t" would open the picker mid-sentence. Ask for the real source instead.
  const source = e.composedPath?.()[0] ?? e.target;
  const typing = !!source?.matches?.("input, textarea, [contenteditable]");
  if (e.key === "Escape") {
    if (state.picking) stopPicking();
    else if (state.confirm) {
      state.confirm = null;
      state.activePin ? showPopover(state.activePin) : refresh();
    } else if (state.activePin) hidePopover();
    else if (state.draft) {
      state.draft = null;
      el.textarea.value = "";
      syncPanel();
      syncHighlight();
    } else if (state.open) closePanel();
    return;
  }
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && state.draft) {
    e.preventDefault();
    save();
    return;
  }
  if (typing || state.draft || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key.toLowerCase() === "c") compose({});
  if (e.key.toLowerCase() === "t") startPicking();
}

/* ------------------------------------------------------------------ hydrate */

/**
 * Rebuild this page's pins from the store.
 * A comment survives only while it is unresolved AND the thing it points at still renders;
 * anything else is dropped, which is what makes the agent's edits clean up after themselves.
 */
async function hydrate() {
  let all;
  try {
    all = await api.list();
  } catch {
    return; // no server: widget still works for the current session
  }

  const route = location.pathname;
  state.addressed = all.filter((c) => c.resolved && !c.seen);
  state.addressed.forEach((c) => api.patch(c.id, { seen: true }).catch(() => {}));
  all.filter((c) => c.resolved && c.seen).forEach((c) => api.remove(c.id).catch(() => {}));

  const open = all.filter((c) => !c.resolved);
  state.others = open.filter((c) => c.route !== route).length;
  state.notes = [];

  for (const comment of open.filter((c) => c.route === route)) {
    if (!comment.anchor) {
      state.notes.push(comment);
      continue;
    }
    const node = resolveAnchor(comment.anchor);
    if (!node) {
      api.remove(comment.id).catch(() => {});
      continue;
    }
    comment._el = node;
    const selector = describe(node).selector;
    if (selector !== comment.anchor.selector) {
      comment.anchor = { ...comment.anchor, selector };
      api.patch(comment.id, { anchor: comment.anchor }).catch(() => {});
    }
    state.notes.push(comment);
  }

  if (state.addressed.length) state.open = true;
  refresh();
}

/* --------------------------------------------------------------------- mount */

export function mount() {
  if (document.querySelector(HOST_TAG)) return; // already mounted
  const host = document.createElement(HOST_TAG);
  root = host.attachShadow({ mode: "open" });
  root.innerHTML = template();
  document.body.appendChild(host);

  const $ = (sel) => root.querySelector(sel);
  el = {
    scrim: $(".scrim"),
    highlight: $(".highlight"),
    hlLabel: $(".hl-label"),
    toolbar: $(".toolbar"),
    pins: $(".pins"),
    popover: $(".popover"),
    panel: $(".panel"),
    headCount: $(".head-count"),
    launchCount: $(".launch-count"),
    launcher: $(".launcher"),
    addressedWrap: $(".addressed-wrap"),
    addressed: $(".addressed"),
    composerWrap: $(".composer-wrap"),
    emptyWrap: $(".empty-wrap"),
    listWrap: $(".list-wrap"),
    list: $(".list"),
    others: $(".others"),
    footer: $(".footer"),
    chip: $(".chip"),
    textarea: $("textarea"),
    save: $('[data-act="save"]'),
  };

  root.addEventListener("click", onAction);
  root.addEventListener("mouseover", (e) => {
    const pin = e.target.closest?.('[data-act="pin"]');
    if (pin && state.activePin !== pin.dataset.id) showPopover(pin.dataset.id);
    const item = e.target.closest?.(".item");
    if (item && state.hovered !== item.dataset.id) {
      state.hovered = item.dataset.id;
      syncHighlight();
    }
  });
  root.addEventListener("mouseleave", () => {
    state.hovered = null;
    syncHighlight();
  });
  el.popover.addEventListener("mouseleave", (e) => {
    if (!state.sticky && !e.relatedTarget?.closest?.(".pin")) hidePopover();
  });
  el.pins.addEventListener("mouseleave", (e) => {
    if (!state.sticky && !e.relatedTarget?.closest?.(".popover")) hidePopover();
  });

  // Clicking a commented element opens its note and keeps it open, so the pin — 22px in a corner
  // — is not the only way to reach Edit. Capture-phase and never cancelled: the app still works.
  document.addEventListener(
    "click",
    (e) => {
      if (state.picking) return;
      const node = e.composedPath?.()[0] ?? e.target;
      if (isOurs(node)) return;
      let hit = null;
      for (let n = node; n && n !== document.body && !hit; n = n.parentElement) {
        hit = state.notes.find((c) => c._el === n) ?? null;
      }
      if (hit) {
        state.sticky = true;
        showPopover(hit.id);
      } else if (state.sticky) {
        hidePopover();
      }
    },
    true,
  );
  el.textarea.addEventListener("input", () => (el.save.disabled = !el.textarea.value.trim()));

  window.addEventListener("keydown", onKey);

  let frame = 0;
  const reposition = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(positionPins);
  };
  window.addEventListener("scroll", reposition, true);
  window.addEventListener("resize", reposition);

  // App routing changes the page under us; re-anchor everything for the new route.
  let route = location.pathname;
  setInterval(() => {
    if (location.pathname === route) return;
    route = location.pathname;
    state.notes = [];
    refresh();
    hydrate();
  }, 400);

  syncPanel();
  hydrate();
}
