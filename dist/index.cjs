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
}

module.exports = { WexioWidgetService };
