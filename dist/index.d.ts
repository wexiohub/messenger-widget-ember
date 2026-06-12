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
 * Optional helper that wraps the underlying `<wexio-widget>` element's
 * imperative API. Register as an Ember service:
 *
 *   // app/services/wexio-widget.js
 *   import { WexioWidgetService } from "@wexio/messenger-widget-ember";
 *   export default class extends WexioWidgetService {}
 */
export declare class WexioWidgetService {
  /** First `<wexio-widget>` element in the document, or `null`. */
  readonly element: HTMLElement | null;

  /** Log a known user in. Pass `null` to log out. */
  identify(user: VisitorIdentity | null): void;

  /** Update unverified prechat prefill values. */
  prefill(values: VisitorPrefill): void;

  /** Show the widget panel. */
  show(): void;

  /** Hide the widget panel. */
  hide(): void;

  /** Clear identity (log out). */
  shutdown(): void;
}
