import { mount } from "./widget.js";

/**
 * Mounts the review widget. Safe to call more than once.
 * Callers must gate this on development — see `webmark init`.
 */
export function webmark() {
  if (typeof window === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
}

export default webmark;
