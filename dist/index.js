/**
 * `@wexio/messenger-widget-ember` — Ember integration for the Wexio
 * web messenger.
 *
 * Importing this module SIDE-EFFECT registers `<wexio-widget>` as a
 * global custom element. Ember 4+/Glimmer renders unknown HTML tags as
 * native DOM elements, so once the element is registered you can use
 * `<wexio-widget>` directly in any `.hbs` template — no Ember
 * component wrapper required.
 *
 *   // app/routes/application.js (or any module loaded at app boot)
 *   import "@wexio/messenger-widget-ember";
 *
 *   // app/templates/application.hbs
 *   <wexio-widget
 *     public-key="pk_live_..."
 *     {{on "wexio:resize" this.onResize}}
 *     {{on "wexio:close"  this.onClose}}
 *   ></wexio-widget>
 *
 * For imperative identity / prefill control, the package also exports
 * a `WexioWidgetService` class consumers can register as an Ember
 * service. It wraps the underlying element's `identify()` method and
 * the global `window.Wexio()` helper for prefill / show / hide.
 *
 * The wrapper is intentionally thin — Ember's template engine handles
 * attribute binding + event handlers natively, so a heavyweight
 * addon-style component would add boilerplate without value. If you
 * need richer integration (auto-injection of identity from an
 * `@service session`, lifecycle hooks for engine transitions, etc.)
 * build it on top of this in your app's services layer.
 */

import "./widget.js";

/**
 * Optional service helper. Register in your Ember app as:
 *
 *   // app/services/wexio-widget.js
 *   import { WexioWidgetService } from "@wexio/messenger-widget-ember";
 *   export default class extends WexioWidgetService {}
 *
 * Then inject anywhere:
 *
 *   import { service } from "@ember/service";
 *   export default class FooComponent extends Component {
 *     @service wexioWidget;
 *     @action login() {
 *       this.wexioWidget.identify({ jwt: this.session.jwt });
 *     }
 *   }
 */
export class WexioWidgetService {
  /** Returns the first `<wexio-widget>` element in the document, or
   *  `null` if none mounted. */
  get element() {
    if (typeof document === "undefined") return null;
    return document.querySelector("wexio-widget");
  }

  /** Log a known user in. Pass `null` to log out. */
  identify(user) {
    this.element?.identify?.(user ?? null);
  }

  /** Update unverified prechat prefill values via the global
   *  `window.Wexio()` API. No-op when no widget is mounted. */
  prefill(values) {
    if (typeof window === "undefined") return;
    window.Wexio?.("prefill", values);
  }

  /** Show the widget panel. */
  show() {
    if (typeof window === "undefined") return;
    window.Wexio?.("show");
  }

  /** Hide the widget panel. */
  hide() {
    if (typeof window === "undefined") return;
    window.Wexio?.("hide");
  }

  /** Clear identity (log out). */
  shutdown() {
    if (typeof window === "undefined") return;
    window.Wexio?.("shutdown");
  }
}
