const HOST_TAG = "webmark-root";

export function isOurs(el) {
  return !el || el.tagName === HOST_TAG.toUpperCase() || !!el.closest?.(HOST_TAG);
}

const trunc = (s) => (s.length > 40 ? `${s.slice(0, 40)}…` : s);

/** The on-screen text that names a field, which renders none of its own. */
function nameOf(el) {
  const labelled = el.id
    ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
    : el.closest?.("label");
  return (
    el.getAttribute?.("aria-label") ||
    labelled?.textContent?.trim() ||
    el.getAttribute?.("placeholder") ||
    el.getAttribute?.("title") ||
    el.getAttribute?.("alt") ||
    el.getAttribute?.("name") ||
    el.id ||
    null
  );
}

/** First meaningful line of an element's rendered text — the identity a human recognises. */
export function labelFor(el) {
  const raw = el instanceof HTMLElement ? el.innerText : el.textContent;
  const line = (raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 2);
  if (line) return trunc(line);
  // Falling back to the tag name gives every field on the page the same identity ("input"), so
  // two of them are indistinguishable and both comments get dropped as ambiguous on reload.
  const named = nameOf(el);
  return named ? trunc(named.trim()) : el.tagName.toLowerCase();
}

/** Full path from body. Used to draw the pin, never to decide whether a comment survives. */
export function selectorFor(el) {
  const parts = [];
  let node = el;
  while (node && node !== document.body) {
    if (node.id) {
      parts.unshift(`#${CSS.escape(node.id)}`);
      return parts.join(" > ");
    }
    const parent = node.parentElement;
    const tag = node.tagName.toLowerCase();
    if (!parent) {
      parts.unshift(tag);
      return parts.join(" > ");
    }
    const twins = [...parent.children].filter((c) => c.tagName === node.tagName);
    parts.unshift(twins.length > 1 ? `${tag}:nth-of-type(${twins.indexOf(node) + 1})` : tag);
    node = parent;
  }
  // Rooted at body on purpose: a relative path matches the first such element anywhere in the
  // document, which is rarely the one that was picked.
  return parts.length ? `body > ${parts.join(" > ")}` : "body";
}

/** Framework plumbing that would be noise (or a lie) in a comment. */
const INTERNAL =
  /(Segment|LayoutRouter|AppRouter|ScrollHandler|RenderFrom|ClientPageRoot|ClientSegmentRoot|MetadataTree|AsyncMetadata|Viewport|DevOverlay|HotReload|Portal|Fallback)|^(Root|Head|Body|Html)$|(Boundary|Router|Provider|Node)$/;

function fiberOf(el) {
  const key = Object.keys(el).find(
    (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"),
  );
  return key ? el[key] : null;
}

/**
 * The component chain that rendered this element, nearest first — e.g. `CardContent < Card < Home`.
 * React exposes server-component owners on `_debugInfo` in dev; client components come from the
 * fiber type. Both are best-effort: without them an agent still finds the code by text search.
 */
export function reactInfoFor(el) {
  try {
    let fiber = fiberOf(el);
    const chain = [];
    let source = null;
    let hops = 0;

    const push = (name) => {
      if (!name || !/^[A-Z]/.test(name) || INTERNAL.test(name)) return;
      if (chain[chain.length - 1] !== name && !chain.includes(name)) chain.push(name);
    };

    while (fiber && hops++ < 40 && chain.length < 4) {
      for (const info of fiber._debugInfo ?? []) push(info?.name);

      const type = fiber.type;
      const typeName =
        typeof type === "function"
          ? type.displayName || type.name
          : type && typeof type === "object"
            ? type.displayName || type.render?.name
            : null;
      // The framework shell wraps the whole app: once we reach it, we have left user code.
      if (typeName && INTERNAL.test(typeName) && chain.length) break;
      push(typeName);

      const debug = fiber._debugSource;
      if (!source && debug?.fileName) {
        source = trimSource(`${debug.fileName}${debug.lineNumber ? `:${debug.lineNumber}` : ""}`);
      }
      fiber = fiber.return;
    }

    return { component: chain[0] ?? null, componentPath: chain.join(" < ") || null, source };
  } catch {
    return { component: null, componentPath: null, source: null };
  }
}

export function describe(el) {
  const { component, componentPath, source } = reactInfoFor(el);
  return {
    selector: selectorFor(el),
    label: labelFor(el),
    tag: el.tagName.toLowerCase(),
    component,
    componentPath,
    source,
  };
}

/**
 * Find the element a comment is about, in the page as it is now.
 * Identity is the rendered thing (tag + label + component), not the stored path — so an
 * element that merely moved keeps its comment, while one whose text changed loses it.
 */
export function resolveAnchor(anchor) {
  if (!anchor) return null;
  const matches = (n) =>
    !!n &&
    !isOurs(n) &&
    labelFor(n) === anchor.label &&
    (!anchor.component || reactInfoFor(n).component === anchor.component);

  let el = null;
  try {
    el = anchor.selector ? document.querySelector(anchor.selector) : null;
  } catch {
    el = null;
  }
  if (matches(el)) return el;

  const candidates = [...document.body.querySelectorAll(anchor.tag || "*")].filter(matches);
  return candidates.length === 1 ? candidates[0] : null;
}
