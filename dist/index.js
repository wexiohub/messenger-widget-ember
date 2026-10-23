/**
 * `@wexio/messenger-widget-ember` — ESM entry.
 *
 * Lightweight service helper class for Ember consumers — wraps the
 * underlying `<wexio-widget>` custom element's imperative API
 * (identify / prefill / show / hide / shutdown).
 *
 * **Loading the widget runtime** — this package intentionally does NOT
 * side-effect-import `widget.js`. Ember CLI scans installed packages
 * via synchronous `require()` at boot time, which can't load ESM
 * modules; a side-effect ESM import here would break every consumer's
 * `ember serve`. Instead, consumers load the widget runtime via a
 * `<script>` tag in `app/index.html`:
 *
 *   <script type="module" src="https://cdn.wexio.io/widget/widget.js"></script>
 *
 * Then use `<wexio-widget>` directly in any `.hbs` template — Glimmer
 * renders unknown tags as native DOM. The service helper below
 * provides the imperative entry points for component / route code.
 *
 * The matching CJS entry (`./index.cjs`) is identical in API; the
 * package's `exports` map routes `require()` calls there.
 */

/**
 * Runtime-inject the widget bundle on first reference. Idempotent —
 * subsequent calls bail because the marker script is already in the
 * DOM. The browser caches the module after first load so subsequent
 * service instances skip the network request. Calling from the
 * service constructor + every imperative method ensures the runtime
 * is loaded by the time any UI actually uses the widget.
 */
function ensureRuntime() {
  if (typeof document === "undefined") return;
  if (typeof customElements !== "undefined" && customElements.get("wexio-widget")) return;
  if (document.querySelector("script[data-wexio-widget-runtime]")) return;
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://cdn.wexio.io/widget/widget.js";
  script.setAttribute("data-wexio-widget-runtime", "");
  script.async = true;
  document.head.appendChild(script);
}

/** Monotonic nonce so every `navigate()` is a new request. */
let navNonce = 0;

export class WexioWidgetService {
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
