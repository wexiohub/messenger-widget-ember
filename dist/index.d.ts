/** Known-user identity proof. Provide ONE of `googleIdToken`, `jwt`,
 *  or the legacy `userId` + `userHash` pair. */
export interface VisitorIdentity {
  googleIdToken?: string;
  jwt?: string;
  userId?: string;
  userHash?: string;
  name?: string;
  email?: string;
  phone?: string;
  attributes?: Record<string, unknown>;
}

/** Unverified prechat prefill values. */
export interface VisitorPrefill {
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Service helper that wraps the underlying `<wexio-widget>` element's
 * imperative API. Register as an Ember service:
 *
 *   // app/services/wexio-widget.js
 *   import { WexioWidgetService } from "@wexio/messenger-widget-ember";
 *   export default class extends WexioWidgetService {}
 *
 * Loading the widget runtime is the consumer's job — add a script tag
 * to `app/index.html`:
 *
 *   <script type="module" src="https://cdn.wexio.io/widget/widget.js"></script>
 *
 * Then use `<wexio-widget>` directly in any `.hbs` template — Glimmer
 * renders unknown tags as native DOM elements. The service below
 * provides the imperative entry points for component / route code.
 */
export declare class WexioWidgetService {
  /** First `<wexio-widget>` element in the document, or `null`. */
  readonly element: HTMLElement | null;
  identify(user: VisitorIdentity | null): void;
  prefill(values: VisitorPrefill): void;
  show(): void;
  hide(): void;
  shutdown(): void;
}
