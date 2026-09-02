# @wexio/messenger-widget-ember

## 1.2.2

### Patch Changes

- 948dbaf: Fix website page-view tracking reporting the PREVIOUS page's title after a SPA navigation. The host router changes the URL synchronously but updates `document.title` a tick later, so the title was read too early. Both capture paths (the iframe `loader.js` and the web-component provider) now wait for `<title>` to actually update (via a `MutationObserver`, with a short timeout fallback) before reporting, so the title matches the new URL.

## 1.2.1

### Patch Changes

- 717679b: Ship `CHANGELOG.md` in the published package (added to each package's `files`) and into the per-package dist repos, so consumers can see release notes on npm and GitHub.

## 1.2.0

### Minor Changes

- 972e218: Visitor activity tracking, AI reply Sources, Markdown rendering, and navigation fixes.

  **Visitor activity tracking**

  - Website page views (initial load + SPA navigation) and in-widget link clicks (help / news / CTA / external) are reported when the operator's `trackWebsitePages` / `trackWidgetLinks` flags are on. Events queue before the visitor handshake and flush once the session lands.
  - iframe embeds capture host-page navigation in `loader.js` and forward it to the widget; web-component / React embeds read history directly.
  - Help/news open-tracking now fires from the article detail view keyed on the post `_id` — so it covers every entry path (search, category, related, home blocks) and matches the id used by reactions.
  - The detected visitor locale is sent in the handshake `contextSnapshot` so the operator's profile LANGUAGE resolves accurately.

  **AI replies**

  - **Sources block** under AI answers: a collapsible `Sources · N` pill (with a stacked favicon preview) that expands to source rows with a hover tooltip (title + description). Internal `/help` · `/news` sources open in-widget; absolute URLs open in a new tab. Sourced from both the realtime event and chat history.
  - **Markdown replies** are now rendered (bold, lists, links, code, headings) with the exact same styling as HTML replies; links route the same way. Fixes large gaps between list items in AI HTML lists.

  **Navigation & misc**

  - "Back" now returns to the view the visitor drilled in from (home, messages, a category, another article) instead of a fixed section index.
  - The home "Latest news" block opens the tapped post directly instead of the News tab.
  - Tap a message bubble to reveal its sender + time.

## 1.1.5

### Patch Changes

- 8041e58: Show the operator ETA while a handoff is pending. When an operator is assigned but hasn't joined yet, the widget now shows the estimated time to the first reply instead of a generic "please wait": a minutes figure (`operator_load`), a soft "we usually reply within a few minutes", or — when the team is offline / out of hours — an honest "the team will be back at {time}" (localized to the visitor's timezone). The `visitorChatAssignment` query and the realtime `assignment` event both carry the `estimate`, so the line is correct on first paint and stays current. New i18n keys added across all supported locales.

## 1.1.4

### Patch Changes

- 3e10bb5: Render inline HTML in AI chat messages. AI replies embed `<a>` / `<ul>` / `<pre>` fragments mid-text (not wrapped in a block tag), which previously showed as literal tags because the renderer only treated a message as HTML when it started with a tag. The message body now detects HTML anywhere and renders it through the same `html-react-parser` pipeline the article / operator HTML uses (markup becomes a React tree, `<script>` inert), while preserving the plain-text line breaks. External links open in a new tab; internal `/help/…` links keep routing inside the widget.

## 1.1.3

## 1.1.2

## 1.1.1

### Patch Changes

- d09ab70: Flow button fixes.

  - **Resume flow by value**: quick-reply clicks now send the button's `value` (`buttonValue`) so the BE resumes the flow deterministically instead of matching the raw label — fixes "sometimes the button works, sometimes the AI answers".
  - **Button types**: `url` buttons open the link in a new tab and `phone` buttons dial `tel:` — neither posts to the chat (previously every button was treated as a callback, so a `url` tap silently ended the flow). `type` / `url` / `phoneNumber` now carry through both the history and live-SSE mappers.
  - **Always-render link buttons**: `url` / `phone` buttons render regardless of whether the message is the active flow step; `callback` buttons stay gated to the active step.
  - **Affordance**: `url` / `phone` buttons show an external-link / phone glyph.

## 1.1.0

### Minor Changes

- db2d14c: Operator handoff status in the visitor widget, a news read/unread indicator, and a message-persistence fix.

  - **Operator handoff**: the visitor now sees the live state of a human handoff — a "an operator has been assigned, please wait…" line while pending, a centered system message with the operator's name + avatar when connected (survives reload), and a "resolve conversation" action in the header. Resolution is attributed ("resolved by you" / "by {operator}") and driven by a new `visitorChatAssignment` query, a `kind: "assignment"` realtime event, and a `resolveVisitorChat` mutation.
  - **News unread indicator**: a countless dot on the launcher and the News tab when the newest post hasn't been seen (tracked in localStorage; visiting the News tab clears it). On the launcher it folds into the message count (+1) when there are also unread messages. Only shown when the News tab is enabled and posts exist.
  - **Fix**: in-session messages no longer disappear when the widget unmounts/remounts on an SPA re-navigation — the chat-history query now refetches on mount instead of serving a stale cache-first page.
  - New handoff/news i18n keys added across all supported locales.

## 1.0.29

### Patch Changes

- 7aeb4e6: Fix mobile file uploads and false "microphone access denied".

  **File uploads (mobile).** The upload allow-list rejected iOS camera
  captures — photos default to HEIC/HEIF, videos to QuickTime (`.mov`),
  voice memos to `audio/mp4` (`.m4a`) — and any file the browser reported
  with an empty `File.type` (common on mobile). The client and backend
  allow-lists now cover HEIC/HEIF, QuickTime, 3GPP and WebM video, plus
  `audio/mp4`/`audio/wav`; an empty `File.type` now falls back to the
  filename extension, and the resolved MIME is sent to the backend so it
  no longer 415s on an empty type.

  **Microphone.** The iframe loader was missing `microphone` in its `allow`
  attribute, so the browser blocked `getUserMedia` via Permissions-Policy
  and the recorder reported "microphone access denied" even when the
  visitor never denied it. Added `microphone` to the iframe `allow`, and
  the recorder now separates a real permission denial from missing-device,
  busy-device and insecure-context failures.

## 1.0.28

### Patch Changes

- 844d503: v1.0.28 — Real fix for missing input borders + other styling regressions in Shadow DOM contexts. v1.0.27's `:host` mirror block was insufficient.

  **Diagnosis (now actually correct).** Tailwind v4 removed the explicit `*, ::before, ::after { --tw-border-style: solid; … }` reset block that v3 used. Instead it relies on `@property --tw-border-style { initial-value: solid; }` declarations to provide the same defaults globally.

  The CSS spec says `@property` registers properties at the document level, and the registered `initial-value` applies wherever the property isn't explicitly set — including inside Shadow DOM. In practice, Chromium's implementation of `@property` resolution from **adopted stylesheets** does NOT propagate initial-values into Shadow DOM children. So `var(--tw-border-style)` resolves to empty string inside the widget's Shadow DOM, `border-style: ""` evaluates to `none`, and every `border` utility paints an invisible border.

  Same root cause hits every Tailwind utility implemented as `var(--tw-*)`: shadows, gradients, scale/rotate transforms, ring widths, leading, tracking, drop-shadows, backdrop filters. The visible-only-some-styling-broken pattern users reported was exactly the set of utilities NOT using `--tw-*` vars (basic colors via `--color-wx-*`, basic spacing) rendering fine, while the variable-driven ones broke.

  The iframe-mount path (cdn-loader) was unaffected because its CSS lives in the iframe's actual document where `@property` registration works normally.

  **Fix.** A `:host *, :host ::before, :host ::after { … }` block in `globals.css` explicitly sets every Tailwind v4 default that the `@property` system was supposed to provide. The full list is mirrored from Tailwind's own `::backdrop` defaults block (which Tailwind emits for the `::backdrop` pseudo-element specifically — apparently they hit the same Chromium limitation there).

  This block needs to stay in lockstep with Tailwind v4's evolution — if Tailwind adds a new internal CSS variable, we need to mirror its default here too. The comment block in `globals.css` flags the maintenance contract.

  **Verified locally** — both `widget.js` (web-component bundle, consumed by Vue / Angular / Ember / loader) and `widget-react.js` (React-direct bundle, consumed by the React npm package) now contain the explicit `:host *` reset.

  **Note on language switcher.** Previously reported as "broken" alongside the styling issues — likely a downstream symptom of the same Shadow DOM CSS variable issue: the dropdown's clickable area was invisible because `border` / `ring` / `shadow` utilities had no effect, so users were clicking on a styled-by-text-only target. After this fix the dropdown UI should be tappable normally. If language still doesn't switch after v1.0.28 retest, that's a separate bug to chase.

## 1.0.27

### Patch Changes

- efc87a5: v1.0.27 — Three critical fixes that v1.0.24-v1.0.26 missed.

  **1. Shadow DOM CSS variables — the real cause of "missing input borders, broken styling" reports.**

  Tailwind v4's `@theme inline` block emits `--color-wx-bg`, `--color-wx-border`, etc. ONLY under the `:root` selector. When the widget's stylesheet is adopted into a Shadow DOM (via `adoptedStyleSheets` — used by the `<wexio-widget>` direct embed AND the `<WexioWidget />` React portal), `:root` doesn't match anything inside that scope. Every Tailwind utility class that resolves to `var(--color-wx-*)` (which is most of them) falls back to its undefined-variable default — invisible borders, transparent surfaces, broken focus rings.

  The iframe-mount path (cdn-loader) was unaffected because its CSS lives in the iframe's actual document where `:root` matches `<html>`.

  Fix:

  - A `:host { … }` mirror block in `app/globals.css` duplicates every variable mapping for Shadow DOM consumers.
  - The dark-mode block is now `:host([data-theme="dark"]), [data-theme="dark"] { … }` so the variable overrides apply when `data-theme="dark"` is set on either `<html>` (iframe path) or the `<wexio-widget>` host element (Shadow DOM path).
  - The Tailwind dark variant is extended to `&:where([data-theme="dark"], [data-theme="dark"] *, :host([data-theme="dark"]) *)` so dark-mode utility classes (`dark:bg-wx-bg`, etc.) fire on Shadow DOM children when the host has the data-attribute.

  **2. `loader.js` fixes from v1.0.24 reapplied.**

  The `pk_demo` short-circuit + conditional iframe chrome (`applyChromeForSize`) that shipped in v1.0.24's release notes never actually landed in the deployed bundle — a `git checkout -- public/widget/` to discard locally-rebuilt artifacts also reverted the loader.js edits, and only the changeset file made it into the commit. v1.0.25/v1.0.26 published with the same broken loader. v1.0.27 ships the actual fix:

  - `pk_demo` short-circuit: skip the BE round-trip + 404 entirely.
  - `applyChromeForSize(width, height)`: bare iframe at launcher size (72×72), card chrome at panel size (400×640), runs on initial mount AND on every `wexio:widget:resize:v1` postMessage.
  - `app/globals.css` `html, body` `background: transparent` (was `var(--wx-bg)`): the iframe document background no longer paints a white square BEHIND the dark launcher button. The panel surface itself stays opaque via `bg-wx-bg` on `<WidgetShell>`'s panel container.

  **3. Ember addon misdetection defenses.**

  User reports of `An addon must define a 'name' property` persisted through v1.0.25's `ember-addon` keyword removal (verified via `npm view ... keywords` — the published manifest is clean). Belt-and-braces:

  - Drop the optional `ember-source` peer dep (we use vanilla DOM APIs; no actual dependency).
  - Drop the `ember` keyword (could trigger heuristic detection in some ember-cli versions).
  - Add a `name: "@wexio/messenger-widget-ember"` field to the CJS module.exports as a safety net — if ember-cli still decides to introspect our package as an addon for any reason, the missing-name check at least doesn't blow up.

  If the user still sees the error after v1.0.27, StackBlitz's npm cache is serving a stale older version (possible workaround: bump the example's package.json to `^1.0.27` to force-refresh).

## 1.0.26

### Patch Changes

- 7cfd905: v1.0.26 — `@wexio/messenger-widget-vue` switches to runtime-inject pattern (matches Angular + Ember in v1.0.24).

  **Background.** v1.0.23 / v1.0.24 of the Vue wrapper static-imported `./widget.js` (the web-component runtime bundle) at the top of the package's entry file. That bundles the runtime into the consumer's Vite app via Vite's automatic dependency pre-bundling — esbuild walks `node_modules/@wexio/messenger-widget-vue/dist/widget.js`, re-processes it, and produces a flattened chunk that ships alongside the consumer's app code.

  That round-trip appears to mangle the widget's inlined Tailwind v4 stylesheet string. Symptoms reported on real StackBlitz sandboxes: input borders missing, language switcher inert, partial styling on the visitor's profile tab. The exact same `widget.js` runs cleanly when loaded directly from `cdn.wexio.io/widget/widget.js` (the iframe / `<wexio-widget>` direct embed path) — so the bundle's build output isn't broken, the round-trip through consumer's esbuild is.

  **Fix.** Vue wrapper now matches the Angular + Ember v1.0.24 pattern: an `ensureRuntime()` helper appends `<script type="module" src="https://cdn.wexio.io/widget/widget.js">` to `<head>` on first `onMounted`, idempotent via a marker attribute. The widget loads from its native origin (where its build output is untouched), the browser caches the module for subsequent components, and Vite's pre-bundling never sees the runtime.

  **Package size:** drops from ~688 KB (3 MB unpacked) to ~6 KB (~12 KB unpacked). The widget bundle itself isn't smaller — it just lives on the CDN now, where it always did for the iframe / web-component paths.

  **No prop / event API changes.** Consumers' Vue templates and event handlers work unchanged.

  **React is unchanged in this patch.** The `@wexio/messenger-widget-react` bundle is the React tree itself (not a wrapper around a web component), so the same fix doesn't apply — it'd require an architectural split. A user report of partial styling in React tracks under follow-up investigation; tracked separately.

## 1.0.25

### Patch Changes

- afc092e: v1.0.25 — fix(ember): drop `ember-addon` keyword so ember-cli stops trying to instantiate it as an addon.

  v1.0.24 carried `"keywords": ["ember-addon", …]` over from the initial scaffold. Ember CLI scans every installed package's `keywords` array for `ember-addon` and tries to construct an addon object from packages that have it — calling the addon's `index.js` as a constructor and reading a `name` property. The Wexio Ember package is a plain library (just exports `WexioWidgetService`), so the construct path fails:

  ```
  An addon must define a `name` property
  (found at .../node_modules/@wexio/messenger-widget-ember/dist).
  ```

  Removing the keyword lets ember-cli treat the package as a regular dependency. The remaining keywords still surface the package in relevant npm searches (`wexio`, `chat`, `ember`, `custom-element`).

  No code changes — keyword-only. Fixed group means React/Vue/Angular get a no-op version bump for consistency.

## 1.0.24

### Patch Changes

- bc1914e: v1.0.24 — Five fixes, four packages affected, one bundle untouched.

  **1. `loader.js` `pk_demo` short-circuit.** When `data-public-key="pk_demo"` (or `?pk=pk_demo` forwarded into the loader's bootstrap), the loader now SKIPS the `GET /api/web/config/:pk` BE round-trip entirely and mounts the iframe immediately. The iframe app already recognised the sentinel (v1.0.23) and rendered `DEMO_CONFIG`, so the fetch was a noisy 404 that delayed the launcher mount for zero benefit.

  **2. `loader.js` conditional iframe chrome.** The loader used to paint `border-radius` + `box-shadow` + opaque background on the iframe unconditionally. Correct at 400×640 panel dimensions (looks like a floating card), wrong at 72×72 launcher dimensions (stacks a "white card" behind the dark launcher button — visible in iframe mode, invisible in web-component mode). New `applyChromeForSize(width, height)` helper toggles chrome on a 200 px threshold and runs on initial mount AND every `wexio:widget:resize:v1` postMessage, so the transition fires the instant the visitor opens / closes the panel. Net: `<script src=".../loader.js" data-public-key="pk_demo">` now renders a launcher pixel-identical to `<wexio-widget public-key="pk_demo">`.

  **3. `@wexio/messenger-widget-angular` rebuilt with `ng-packagr`.** v1.0.23 used `ts.transpileModule` (lightweight, no `@angular/core` resolution at publish time) which emitted `__decorate(Component({...}))` calls. That worked in JIT dev mode but Angular's AOT compiler couldn't read `standalone: true` from those calls — StackBlitz reproduced as `TS-992012: Component imports must be standalone components`. ng-packagr is the only sustainable path for an Angular library on npm: it produces FESM2022 bundles + Angular Package Format partial-compilation `.d.ts` with `ɵɵComponentDeclaration<…, true, never>` (the `true` = standalone) that AOT recognises. The `widget.js` runtime is no longer bundled in the package — the component runtime-injects a `<script type="module">` on first `ngAfterViewInit` (idempotent via marker attribute). Net: drops the package from ~3 MB to 13.6 KB AND fixes the AOT failure.

  **4. `@wexio/messenger-widget-ember` dual-build ESM + CJS, no widget runtime in package.** v1.0.23 shipped only ESM (`type: "module"`), which broke `ember serve` for every consumer — Ember CLI's `package-info-cache` scan uses synchronous `require()` to read every installed package, and `require()` of pure ESM throws `require() of ES Module … not supported`. v1.0.24 ships both `dist/index.js` (ESM) and `dist/index.cjs` (CJS) routed via the package.json `exports` map. The `widget.js` runtime was removed from the bundle (CJS-can't-require-ESM means re-introducing the side-effect import would re-introduce the bug); the `WexioWidgetService` class now runtime-injects the script on first construction, mirroring the Angular pattern.

  **5. CI dist-repo sync layout commentary.** `release.yml` Angular sync step keeps the same `dist/` nesting it had before — ng-packagr's output lives at `packages/angular/dist/` root (FESM + esm2022 + .d.ts), and the source `package.json` paths now use `./dist/fesm2022/…` so the published tarball + dist-repo mirror agree.

  **Examples repo follow-up** — `wexiohub/web-widget-examples` got matching updates:

  - Angular example `src/index.html` adds a `<script type="module" src="https://cdn.wexio.io/widget/widget.js"></script>` to load the runtime in parallel with Angular bootstrap (runtime-inject by the component is a fallback for consumers who don't add the script).
  - Ember example same: `<script>` tag added to `app/index.html`, side-effect import removed from `app/app.js`.
  - README reordered to put **StackBlitz first for framework examples** (where it works reliably) and **CodeSandbox first for static examples** (where Pitcher-microVM isn't needed).

  Net: all 6 examples now have at least one working sandbox provider after this release.

## 1.0.23

### Patch Changes

- 5435f8b: `pk_demo` documentation sentinel — `publicKey="pk_demo"` now short-circuits to demo mode (same effect as omitting `publicKey` entirely, but self-documenting).

  Until this change, the only way to render the bundled demo content was to omit `publicKey` from the component / web-component / loader. That's fine for production code where the value is dynamic, but in **examples, Storybook stories, and marketing pages** it reads ambiguously: `publicKey={undefined}` could mean "demo on purpose" or "I forgot to wire the env var".

  After this change:

  ```tsx
  <WexioWidget publicKey="pk_demo" />   // ← reads "this is intentionally demo"
  <wexio-widget public-key="pk_demo" /> // ← same on the web component
  ```

  The resolver in `lib/use-widget-config.ts` treats `"pk_demo"` as if `publicKey` were unset:

  1. Mode resolution falls through to `"demo"`.
  2. `fetchWebConfig` is NOT called — the BE never sees the sentinel, so no rejection round-trip.
  3. The bundled `DEMO_CONFIG` (operator-mode mock data) renders.

  Backwards compatible — existing demos that omit `publicKey` continue to work unchanged.

  Surfaces affected (single resolver change covers all of them):

  - `@wexio/messenger-widget-react` — `<WexioWidget publicKey="pk_demo" />`
  - `@wexio/messenger-widget-vue` — `<WexioWidget public-key="pk_demo" />`
  - `@wexio/messenger-widget-angular` — `<wexio-widget-ng publicKey="pk_demo" />`
  - `@wexio/messenger-widget-ember` — `<wexio-widget public-key="pk_demo">` in `.hbs`
  - Web component (`widget.js`) — `<wexio-widget public-key="pk_demo">`
  - Loader (`loader.js`) — `<script data-public-key="pk_demo">`
  - URL param — `?pk=pk_demo`

  The published examples at [`wexiohub/web-widget-examples`](https://github.com/wexiohub/web-widget-examples) now use this sentinel uniformly.

- 5435f8b: v1.0.23 — Native Vue 3, Angular, and Ember integrations alongside the existing React package.

  All three new packages consume the same `widget.js` web-component bundle the React package already ships; the wrappers are intentionally thin (camelCase → kebab-attr binding, `CustomEvent` re-emit, imperative `identify()` passthrough). Same `WidgetShell` runtime, same Shadow-DOM isolation, same visitor-handshake flow.

  - **`@wexio/messenger-widget-vue`** — `defineComponent({ ... })` wrapper with reactive `props.user` watch. Pure ESM JS, no SFC compilation step required. Consumers configure their Vue compiler's `isCustomElement` for `wexio-widget` (one-line Vite / Vue CLI / Nuxt snippet in the README).
  - **`@wexio/messenger-widget-angular`** — Standalone `WexioWidgetComponent` (selector `wexio-widget-ng`) with `@Input()` / `@Output()` / `@ViewChild` plumbing and `CUSTOM_ELEMENTS_SCHEMA`. Drop into any standalone component's `imports`. Prepack uses `ts.transpileModule` (isolated-module pattern, no @angular/core resolution at publish time) to emit ES2022 JS with `__decorate` calls via `tslib`.
  - **`@wexio/messenger-widget-ember`** — Tiny side-effect import + optional `WexioWidgetService` helper. Glimmer renders `<wexio-widget>` as a native DOM element, so no wrapper component needed — consumers use the element directly in `.hbs` templates with `{{on}}` for event binding.

  All four wrapper packages are now in the changesets fixed-version group with `@wexio/widget-private`, so they version + publish together on every release (matching bundle hash → matching package version → no drift).

  Public-boundary types match across all four wrappers: `VisitorIdentity`, `WexioWidgetProps`/`Inputs`, `WexioWidgetEmits`/`Outputs`. Each package hand-rolls its own `.d.ts` (no shared package — keeps each wrapper installable without pulling in the others). The CI boundary check (`scripts/check-public-boundary.mjs`) already covers them since the symbol allow-list is type-name-based, not package-bound.
