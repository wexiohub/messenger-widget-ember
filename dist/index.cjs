/**
 * `@wexio/messenger-widget-ember` — CommonJS entry.
 *
 * Ember CLI's `ember-cli/lib/models/package-info-cache/package-info.js`
 * uses synchronous `require()` to scan installed packages at boot, so
 * any pure-ESM package in `node_modules` errors with
 *   "require() of ES Module … not supported"
 *
 * Shipping a CJS entry alongside the ESM one fixes the scan path.
 * The package's `exports` map in package.json routes `require()` here
 * and `import` to `./index.js`. Both expose the same `WexioWidgetService`
 * class; neither side-effect-loads `widget.js` (Ember consumers add a
 * `<script>` tag in `app/index.html` — keeps the package tiny + avoids
 * a CJS-requires-ESM dance for the widget runtime).
 */
"use strict";

/**
 * Runtime-inject the widget bundle on first reference. Idempotent.
 * Mirrors the ESM build's `ensureRuntime` — keeps both entries in
 * lock-step.
 */
function ensureRuntime() {
  if (typeof document === "undefined") return;
  if (typeof customElements !== "undefined" && customElements.get("wexio-widget")) return;
  if (document.querySelector("script[data-wexio-widget-runtime]")) return;
  var script = document.createElement("script");
  script.type = "module";
  script.src = "https://cdn.wexio.io/widget/widget.js";
  script.setAttribute("data-wexio-widget-runtime", "");
  script.async = true;
  document.head.appendChild(script);
}

/** Monotonic nonce so every `navigate()` is a new request. */
let navNonce = 0;

class WexioWidgetService {
  constructor() {
    ensureRuntime();
  }

  get element() {
    if (typeof document === "undefined") return null;
    return document.querySelector("wexio-widget");
  }

  identify(user) {
    const el = this.element;
    if (el && typeof el.identify === "function") {
      el.identify(user ?? null);
    }
  }

  prefill(values) {
    if (typeof window === "undefined") return;
    if (typeof window.Wexio === "function") window.Wexio("prefill", values);
  }

  show() {
    if (typeof window === "undefined") return;
    if (typeof window.Wexio === "function") window.Wexio("show");
  }

  hide() {
    if (typeof window === "undefined") return;
    if (typeof window.Wexio === "function") window.Wexio("hide");
  }

  shutdown() {
    if (typeof window === "undefined") return;
    if (typeof window.Wexio === "function") window.Wexio("shutdown");
  }

  /** Open the panel (the widget element's controlled `open`, else the loader command). */
  open() {
    this._setOpen(true);
  }

  /** Close the panel. */
  close() {
    this._setOpen(false);
  }

  /**
   * Navigate to a tab (and optionally a help article / news post) without a remount; opens the
   * panel. `{ tab, article? }`; every call is a new request.
   */
  navigate(target) {
    const el = this.element;
    if (el) {
      navNonce += 1;
      el.previewTab = { ...target, nonce: navNonce };
    } else if (typeof window !== "undefined" && typeof window.Wexio === "function") {
      window.Wexio("navigate", target);
    }
  }

  _setOpen(open) {
    const el = this.element;
    if (el) {
      const want = open ? "true" : "false";
      // Idempotent: already in the wanted state (read from the rendered panel) -> nothing to do.
      const panel = el.shadowRoot && el.shadowRoot.querySelector("[data-wx-panel]");
      if (panel && !panel.hasAttribute("inert") === open) return;
      // The widget reacts to the attribute CHANGING. It already says `want` but the panel is not
      // there (the visitor toggled it since): flip it away first so this call is a transition again.
      if (el.getAttribute("open") === want) {
        el.setAttribute("open", open ? "false" : "true");
        setTimeout(() => el.setAttribute("open", want), 0);
      } else {
        el.setAttribute("open", want);
      }
    } else if (typeof window !== "undefined" && typeof window.Wexio === "function") {
      window.Wexio(open ? "open" : "close");
    }
  }
}

// Safety-net `name` field so ember-cli's package-info-cache, which
// occasionally introspects every installed package's main export for
// addon shape (looking for an addon-like object with a `name`
// property), doesn't crash with "An addon must define a name
// property" if it ever decides our package looks addon-ish despite
// missing the `ember-addon` keyword. Picking the actual npm name
// matches the standard addon convention without lying.
module.exports = { WexioWidgetService, name: "@wexio/messenger-widget-ember" };
