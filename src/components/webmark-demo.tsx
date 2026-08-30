"use client";

import { useEffect, useState } from "react";

const KEY = "webmark:demo";
const LOCAL = /^https?:\/\/127\.0\.0\.1:\d+(\/[^?]*)/;

type Comment = { id: string; [k: string]: unknown };

/**
 * A localStorage store wearing the comment server's HTTP shape.
 *
 * The widget talks to a loopback server that a static site cannot have, so rather than teach the
 * package a second backend we answer its own requests here. Everything stays in this file, in the
 * demo app — the published package is untouched and still speaks only to the real store.
 */
function installStore() {
  const read = (): Comment[] => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  };
  const write = (list: Comment[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      // private mode, or quota — the widget still works for this session
    }
  };
  const json = (body: unknown) =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  const route = (path: string, method: string, body: Record<string, unknown>) => {
    const list = read();
    const id = path.startsWith("/comments/") ? path.slice("/comments/".length) : null;

    if (path === "/ping") return json({ webmark: true, version: "demo" });

    if (path === "/comments" && method === "GET") return json({ comments: list });

    if (path === "/comments" && method === "POST") {
      const now = new Date().toISOString();
      const comment: Comment = {
        ...body,
        id: `c_${Math.random().toString(36).slice(2, 12)}`,
        resolved: false,
        resolvedNote: null,
        seen: false,
        createdAt: now,
        updatedAt: now,
      };
      write([...list, comment]);
      return json({ comment });
    }

    if (path === "/comments" && method === "DELETE") {
      write([]);
      return new Response(null, { status: 204 });
    }

    if (id && method === "PATCH") {
      const comment = { ...list.find((c) => c.id === id), ...body, id } as Comment;
      write(list.map((c) => (c.id === id ? comment : c)));
      return json({ comment });
    }

    if (id && method === "DELETE") {
      write(list.filter((c) => c.id !== id));
      return new Response(null, { status: 204 });
    }

    return new Response(null, { status: 404 });
  };

  const original = window.fetch;
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const match = LOCAL.exec(url);
    if (!match) return original(input, init);
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    return route(match[1], init?.method ?? "GET", body);
  };
}

/**
 * Mounts the review widget on the deployed landing page so visitors can try it.
 *
 * The flag is read at build time, so a build without it leaves this branch dead and the widget
 * never enters the bundle — which is what the CI guard checks, and what every real app gets.
 * In development the generated `instrumentation-client.ts` has already mounted it against the
 * real server, and `mount()` is a no-op the second time.
 */
export default function WebmarkDemo() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_WEBMARK_DEMO !== "1") return;
    installStore();
    import("@dshalom/webmark/client").then(({ webmark }) => webmark());
  }, []);

  // The card belongs wherever the widget is actually on screen. In development that is the
  // generated `instrumentation-client.ts`, not the flag above — gating it on the flag alone hid
  // it from every `next dev` session. Both are build-time constants, so a plain production build
  // still drops this whole subtree, which is what the bundle guard checks.
  const widgetOnScreen =
    process.env.NEXT_PUBLIC_WEBMARK_DEMO === "1" || process.env.NODE_ENV === "development";
  if (!widgetOnScreen) return null;
  return <DemoCallout />;
}

const HINT_SEEN = "webmark:demo:hint";

/**
 * A card that hangs over the launcher, because the widget is the one thing on this page a visitor
 * would otherwise scroll straight past. It bows out the moment they touch the widget — the panel
 * opens into exactly this corner, and a hint that has been taken is just an obstruction.
 */
function DemoCallout() {
  const [show, setShow] = useState(false);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(HINT_SEEN, "1");
    } catch {
      // private mode — it just shows again next visit
    }
  }

  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_SEEN)) return;
    } catch {
      // unreadable storage is not a reason to withhold the hint
    }
    // Late enough that it arrives after the page has settled, rather than racing the hero in.
    const timer = setTimeout(() => setShow(true), 1100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const onPointer = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.("webmark-root")) dismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["t", "c"].includes(e.key.toLowerCase())) dismiss();
    };
    document.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      role="status"
      // The wrapper must not take clicks: it sits over the page, and the widget's own panel opens
      // into the same corner.
      className="pointer-events-none fixed right-5 bottom-[78px] z-30 w-[min(22rem,calc(100vw-2.5rem))]"
    >
      <div className="rise pointer-events-auto relative rounded-2xl border-[3px] border-acid bg-white px-5 py-4 shadow-[0_6px_0_-1px_var(--color-acid-deep),0_24px_60px_-14px_rgba(0,0,0,0.85)]">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2.5 grid size-6 place-items-center rounded-full text-[15px] leading-none text-black/40 transition-colors duration-150 hover:bg-black/5 hover:text-ink"
        >
          ×
        </button>

        <p className="pr-6 text-[13px] font-semibold tracking-[0.06em] text-acid-ink uppercase">
          This widget is a demo.
        </p>
        <p className="mt-1.5 text-[14px] leading-[1.5] text-ink">
          Point it at anything on the page.
        </p>

        {/* The tail: a rotated square borrowing the card's two facing borders. */}
        <span
          aria-hidden
          className="absolute -bottom-[11px] right-11 size-4 rotate-45 rounded-br-[4px] border-r-[3px] border-b-[3px] border-acid bg-white"
        />
      </div>
    </div>
  );
}
