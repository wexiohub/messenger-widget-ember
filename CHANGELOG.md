# @wexio/messenger-widget-ember

## 1.7.4

## 1.7.3

## 1.7.2

## 1.7.1

## 1.7.0

### Minor Changes

- 386ab4f: Launcher message and message threads. A MESSAGE slot is now the unread bubble over the closed launcher: the slot with the most specific matching variant (page, then origin, then visitor kind, then the operator's order) shows while it is unread, re-picks on SPA navigation without jumping, and goes away for good once the visitor clicks it, opens the panel over it or dismisses it with X / Esc (until the operator edits it, or `reappearAfterDays` after a dismiss). Each slot has its own thread (`message:<slotId>`), created by the first message and titled with the slot text in the thread list; with Messages as the default tab the launcher (and the Messages tab) opens the thread of the slot that matches the current page, else the last active thread, else a new chat; any other default tab opens as before. Contract 074 stage 2: several variants and `paths` per slot, `reappearAfterDays` on MESSAGE slots. A config without a MESSAGE slot behaves as before.
- 386ab4f: Targeted content for welcome messages, and Home blocks (BE contract v1). Each slot can carry several variants with an audience rule (`visitors`, `origins`, `paths`); the first match wins, the BE renders the variables and the widget never sees `{{`. Session-dependent content comes from `GET /api/web/config/:pk/session` after every handshake, restore, pre-chat submit, profile save and re-auth; a 404, 401, 5xx, network error or 3 s timeout keeps the public projection, and the welcome waits behind the typing dots so it never flashes. Welcome buttons are plain quick replies that send their label. New public React prop `onMessageAction`, the matching `wexio:message-action` event (web component and script tag), and `wexio:host-viewport:v1` from the loader. Config without `contentVersion` renders exactly as before. Private-only: the `audienceOverride` prop.

### Patch Changes

- 386ab4f: Fix: guard errors from the BE are recognised by their stable `WEB_*` codes (REST `code`, GraphQL `extensions.code` and `extensions.http.status`) instead of message text, so a translated message can no longer break the "widget off" and wrong-integration recovery. The client-generated welcome no longer counts as an unread message on the launcher badge (only a real operator or flow message does). The script-tag embed now reliably gets the host viewport ("Expand" stays hidden on a phone-wide host), the loader clamps the details it relays for `wexio:message-action`, and a few small robustness fixes (preview-token cache eviction, linear path matching). Dark theme `--wx-fg-subtle` is now #94949e (>= 4.5:1 on every dark surface). Quick-reply chips (welcome, unread peek, operator / flow messages) get a 44px invisible touch target without changing their look, clamp long labels to two lines (the full label stays the accessible name) and sit in a labelled "Quick replies" group. In the launcher peek the chip stack and chip text follow the launcher side in RTL too; the touch hit area applies to touch devices only. A host-page `pushState` / `replaceState` no longer notifies the widget synchronously (fixes "useInsertionEffect must not schedule updates" in Next hosts).
- 386ab4f: Fix: a host `offset` (React prop, `offset-x` / `offset-y`, `wexioSettings.offset`) now wins PER AXIS over the integration's `theme.launcherOffset` in the React and web-component embeds too (a host that sets only `x` keeps the configured `y`), as the loader already did. `defaultOpen` / `open` go through the same auth guard as a launcher tap and a host open that meets a failed handshake shows the retry popup. The script-tag "Expand" control is hidden on a phone-wide host (the loader reports `width` in `wexio:host-viewport:v1`). Light theme `--wx-fg-muted`, `--wx-fg-subtle` and `--wx-danger` now reach WCAG AA 4.5:1.
- 386ab4f: BE preview token (dashboard playground, BE 062). Private `previewToken` prop and `onPreviewTokenExpired(reason)` callback on the React embed; the `preview-token` attribute and `wexio:preview-token-request` event on `<wexio-widget>`; `wexioSettings.previewToken`, `Wexio("previewToken", token)` and `wexio:preview-token:v1` / `wexio:preview-token:request` on the iframe loader (the frame URL gets only the flag `pv=1`). The token is sent as `x-web-preview-token` on the config, handshake, GraphQL and session calls, never on SSE and never in a URL. It forces isolated in-memory storage, ignores `user`, and the sign-in gate shows demo mocks. A rejected token pauses the outbox and asks the host for a new one once per token value; a new token re-handshakes on the previous visitor id. Not part of the public packages. The public bundles carry the same runtime (the loader, the attribute) but expose no public type or documented option for it.

## 1.6.1

## 1.6.0

### Minor Changes

- cdbf505: Open-state and navigation props on every embed: `defaultOpen`, controlled `open` and `previewTab` (React props, web-component `default-open` / `open` attributes and `previewTab` property, Vue / Angular / Ember wrappers, and `Wexio('open' | 'close' | 'navigate')` + `wexioSettings.defaultOpen` for the script tag). New integration-level `theme.launcherOffset` (px, clamped 0..200) moves the launcher, peek and panel in all three embeds; a host offset wins. Fixes: a persisted `sending` outbox op is retried after a reload, and Enter that confirms an IME candidate no longer sends the message.

## 1.5.3

### Patch Changes

- 3816144: Keep the bundler-ignore comments in the published bundles so Next/Turbopack consumers build

## 1.5.2

### Patch Changes

- 27bb610: Related articles keep their own title in the header and Back returns to where the chain started
- 27bb610: Restore the smooth expand / collapse animation of the open panel (the header "Expand widget" button), which regressed in 1.5.0: the panel grows and shrinks with one spring on width and height again, and in the iframe embed a collapse is no longer clipped by the frame shrinking before the animation ends.

## 1.5.1

### Patch Changes

- 4773a1e: Translations and demo content:

  - 57 widget strings that were still English in 29 locales are now translated (composer formatting, GIPHY picker, offline banner, conversation list empty and error states, "usually replies in…" lines, transcript export).
  - The emoji picker category names, desktop notification titles ("New message", "Image", "Video", "Voice message", "Attachment"), the profile select placeholders and the file attachment fallback follow the visitor's language.
  - The demo conversation is available in all 33 locales (it was English and Ukrainian only), the demo article language switcher offers all of them, and the demo messenger shows the integrations clip as a looping, muted GIF-style video below the PDF.
  - The demo copy no longer reaches the iframe route of live widgets (it is merged only for demo renders), which makes the iframe response smaller.

## 1.5.0

### Minor Changes

- cb1f56b: The operator's `defaultTab` (Home, Messenger, Help, News, Profile) is now applied. The panel used to open on Home for every integration because the landing tab was fixed on the first render, before the config arrived. It now opens on the tab set in the dashboard (a disabled tab still falls back to the first enabled one); a tab the visitor already picked, a deep link, a host `openTab` or a peek action is never overridden. Integrations with a non-Home default tab will see their panel open there. Same in the React, web-component and script-tag embeds.
- cb1f56b: The widget now fails closed (behaviour change, hence minor).

  - A definitive "off" answer from the BE (HTTP 400 / 401 / 403 / 404 on the config, a status other than `active`, or a 403 `webMessengerNotAvailable` / `webMessengerDisabled` on the handshake or a content query) renders nothing in the React, web-component and script-tag embeds, stops the visitor handshake, realtime, tracking and the outbox, and evicts that key's cached config so a later outage cannot bring it back. In the script-tag embed the frame and the attribution link are removed.
  - A transient failure (network, timeout, 5xx) hides the widget unless an earlier `active` answer is cached, in which case it still loads from the cache.
  - With an injected `config` plus a public key, a failed gate fetch used to default to `active` (fail open); it now follows the same policy.
  - Config and gate requests time out after 8 seconds.
  - Unchanged: no public key / demo mode, injected config without a key, and previews that force dummy data.

  See "Failure policy" in `docs/CONFIG_REFERENCE.md`.

- cb1f56b: Web fonts: the list of families the widget will load grows from 10 to 26 (Open Sans, Noto Sans, Source Sans 3, Manrope, Onest, PT Sans, Fira Sans, Jost, Rubik, Comfortaa, Merriweather, Lora, PT Serif, Playfair Display, JetBrains Mono, IBM Plex Mono added). A theme `fontFamily` that starts with a listed family adds one stylesheet link to Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) on the visitor's page, including for a self-hosted copy of the same name: a third-party request (IP disclosed to Google) that a strict CSP (`style-src` / `font-src`) can block, in which case the stack's fallback font is shown. See THEMING.md. Also: `fontFamily` is now validated (the backend's rule) before it is written into CSS, so an unsafe value is ignored and the default font stack applies.
- cb1f56b: Smaller first download (PF-03). Only the resolved language is fetched (one on-demand chunk per locale; English is bundled and renders first, the language swaps in when its chunk arrives, so a slow or failed request never hides the launcher and never shows message keys). The phone validator (libphonenumber) loads on demand when the Profile tab opens. The JS output is whitespace-minified.

  **Layout change of the published bundle (migration note).** The script/web-component `widget.js` is no longer a single file: it imports hash-named siblings `widget-wc-<hash>.js` relative to its own URL. They must be served from the same directory as `widget.js`. `cdn.wexio.io/widget/` and the pinned `cdn.wexio.io/widget/v<version>/` folders do this; the legacy `widget@<version>.js` URL is now a permanent redirect to `widget/v<version>/widget.js` (so chunks resolve in the pinned folder). Self-hosters must copy the whole `public/widget/` folder: copying `widget.js` alone fails to load. A missing lazy chunk degrades gracefully (English, no emoji picker) and logs a `[wexio]` console warning. The React package already shipped `widget-react-<hash>.js` chunks; they now also include one chunk per locale. The latest `widget.js` / `widget-react.js` entries are cached for 60 s without stale-while-revalidate so a cached entry cannot outlive its chunks. Public bundles also ship `LICENSES.txt` with third-party notices.

- cb1f56b: Performance round 2.

  - A feature whose code chunk fails to load (emoji picker, GIF picker, voice recorder, voice waveform, article views) now retries automatically, then shows a small inline "Couldn't load - Retry" instead of staying broken until the page is reloaded. A language chunk that fails keeps English and retries quietly. (In the script-tag / iframe embed the frame's runtime remembers a failed chunk, so Retry only helps in the React and web-component embeds there.)
  - Voice notes follow iOS Safari's audio rules: nothing is decoded or played before the visitor taps, hovering only warms the code, a note whose waveform cannot be built falls back to the browser's own player (or an "Open audio" link), and only one note plays at a time.
  - The closed launcher in the iframe embed no longer re-measures itself on every thread event that changes nothing.

### Patch Changes

- cb1f56b: Conversation review fixes.

  - Loading older history no longer pulls a reader who scrolled up to the bottom when the newest message is their own; only a real send of their own scrolls to the new bubble.
  - `Wexio('shutdown')` now also forgets unsent drafts and the offline queue of unsent messages, so the next visitor on a shared device never sees or sends the previous visitor's text. Drafts are scoped per integration.
  - An edit of a message older than the loaded history no longer appears as a new message at the bottom; it applies once that message loads. An edit that blanks a message keeps the previous text.
  - Closing the panel discards an unsent voice recording (it is not saved or sent).

- cb1f56b: Conversation fixes from the UI audit.

  - A message queued (for example offline) in one thread no longer shows up inside another thread.
  - Long unbroken text, long links and wide HTML tables stay inside the message bubble (tables scroll inside it).
  - The visitor's own send scrolls to the new bubble even when they had scrolled up, and resizing the panel (window, rotation, keyboard) keeps the newest message in view.
  - Closing the panel stops a voice recording and releases the microphone.
  - Realtime events with nothing to show (location, reaction, unknown kinds) are no longer messages (no blank bubble, chime or notification), and edited messages (`messageUpdate`) now update in place.
  - An unsent draft is kept per thread when the visitor leaves and re-enters it.
  - Demo: the sent exchange survives re-entering the thread, an attachment-only send shows the attachment, and the voice-note reply is localised (en, uk).

- cb1f56b: Home, Help and News audit fixes.

  - A partial or malformed news / help reply (null list, missing `items` / `meta`) no longer crashes the widget; the news unread check that runs in the shell took the launcher down with it.
  - A visitor session whose handshake reply lacks a usable `expiresIn` no longer starts an endless immediate re-handshake loop (renewal is clamped and backs off; very long lifetimes no longer overflow the timer).
  - A failed "next page" request in News / Help no longer raises an unhandled error; scrolling again retries.
  - Long unbroken text (URLs, tokens) in news cards, help rows and article titles, tags and prose wraps inside the panel instead of being clipped.
  - RTL: Home / Help / News content now follows the panel direction (it was forced left-to-right), directional arrows and chevrons mirror, cards align to the start edge, and the Arabic team-status copy is translated.
  - Accessibility: the Home card "see all" button has an accessible name; opening an article by keyboard keeps focus in the panel.
  - Quick-action `open-url` only opens http(s), mailto, tel and sms links; a malformed home layout (no buttons, null block) no longer breaks the Home tab.
  - Demo mode: lists show a skeleton while the demo content loads (no blank cards), and a failed demo chunk load no longer raises an unhandled error.

- cb1f56b: Launcher and open/close fixes across the three embeds (React, web-component, script tag).

  - Script tag: closing the panel with the header X no longer hides the whole frame. The launcher used to disappear until the host called `Wexio('show')`; now it stays and the frame shrinks to the launcher.
  - Script tag: the open panel's drop shadow is no longer cut off in a hard edge at the frame's left and top; the frame leaves room for it. Closing no longer clips the panel while it fades out (the frame waits for the fade), and the auth-error popup ("Couldn't connect") is no longer clipped by the small closed frame.
  - Web-component and React: Tailwind shadows, rings and `--tw-*` utilities work again inside the Shadow DOM (an unlayered defaults block was resetting them), so the launcher has its drop shadow and keyboard focus ring. Host page text styles (`letter-spacing`, `text-transform`, `font-style`, `text-align`, `word-break`, `hyphens`, `visibility`, `pointer-events`, `cursor`, ...) no longer leak into the widget. A root font size on the host `<html>` (for example `62.5%`) still scales the web-component and React widget (documented; the script tag is unaffected).
  - The launcher peek keeps its dismiss X reachable with many quick replies or on a short screen: in the web-component and React embeds it is capped to the viewport, in the script tag the frame grows to fit it and, when the host page clamps the frame, the peek is capped to what remains. The message text keeps priority; the quick replies scroll.
  - Keyboard: opening from the launcher moves focus into the panel, closing returns it to the launcher, and Escape closes the panel. Escape that cancels an IME composition or the link field does not close the panel.
  - **Behaviour change (kept on purpose):** `onClose` / `wexio:close` now fire whenever the panel closes (header X, launcher button, Escape), not only for the header X, and `onOpen` / `wexio:open` fire on every open. The script-tag embed now emits `wexio:open` / `wexio:close` window events as documented. **Migration:** a host that unmounts the widget in `onClose` will now remove the launcher on every close; use CSS or state that keeps the component mounted, or ignore the callback.
  - Script tag: the `wexio:resize` sizes grew (the open frame is 96 px wider and 144 px taller than the panel to hold its margins and shadow, 516 x 814 for a default 420 x 670 panel); consumers sizing a container from them see new numbers.
  - Arabic and Hebrew set the document direction from the widget locale in every embed (the iframe never did; the web-component only followed the host page). Other locales keep inheriting the host page's direction in the web-component and React. This is the base direction only: full right to left layout polish (physical margins, paddings and alignments) is not part of this release; the Home tab card buttons now align with the direction.
  - `prefers-reduced-motion` is honoured: the panel slide, launcher morph, badge pulse and peek pop-in no longer play, and looping CSS animations (typing dots, pulse) stop. Opacity fades, the loading spinner (slowly) and width/height springs still animate.
  - **Visible change:** on a clean host page the web-component and React widget now renders in `system-ui` instead of inheriting the host page font (the iframe/script tag embed is unchanged). The operator theme font (`--wx-font`) still wins. Host `-webkit-text-fill-color` no longer recolours the widget text.
  - Escape closes the emoji picker and then the panel in the web-component and React embeds (focus used to fall to the page body after the picker closed), and focus returns to the emoji button.

- cb1f56b: Performance fixes for long conversations.

  - Typing in the composer, the operator's typing indicator and an incoming message no longer re-render every message in the thread. On a 500-message thread with a 4x slower CPU, typing 35 characters was 37 long tasks (about 3 s of blocked main thread) and is now none; an incoming message costs less than half of what it did.
  - The history is mapped once per fetch instead of once per incoming message, and the tracking context no longer hands every message bubble a new value on each update (which made memoisation useless). An inbound message that arrives while the panel is closed no longer re-renders the hidden thread: six messages on a 500-message thread went from about 1-1.6 s of long tasks to 0.2-0.4 s at 4x CPU.
  - Message bubbles no longer use framer-motion `layout="position"`, so a bubble is not re-measured on every update. Nothing visible changes: new bubbles still slide in, the unread divider still collapses.
  - Voice notes no longer block the main thread when a conversation opens. They used to start decoding the audio as soon as they appeared, one stall of 200-470 ms for a thread with voice notes; now each is a light static row (play button, stand-in waveform) until the visitor hovers, focuses or presses play, and then plays as before.
  - A tab that fails to render (for example a malformed payload from the server) no longer blanks the whole widget. The tab shows one calm "Something went wrong" state with a "Try again" button, the launcher and the tab bar keep working, and the failure is reported once through `console.error` with a `[wexio]` prefix. New translation keys `tabError.title`, `tabError.hint`, `tabError.retry` in all 33 locales.

- cb1f56b: Security hardening of the embeds.

  - A host config patch (`wexioSettings.configOverride`, the React `configOverride` prop, `wexio:config-override:v1` messages) can no longer change `status`, `branding` or the BE-owned parts of `security` in production: the "Powered by" badge, the plan gate and the sign-in gate come from the server only. Theme, features, greeting and the other presentation fields are unaffected. In a public build the patch is filtered whenever a real public key is present, on every channel, whatever `mode` the host sets, and also when the patch was posted before the key was set (the filter runs when the config is read). Key-less demo content and the private dashboard build apply the full patch.
  - The widget now accepts `wexio:*` messages (identify, prefill, shutdown, config override, theme, host navigation) only from its own parent window (iframe) or its own window (web-component, React). A page that frames or opens the customer site can no longer bind the visitor to its identity, wipe the session or restyle the widget.
  - Script tag: the widget iframe is no longer delegated clipboard read or write access (`allow="autoplay; microphone"`); the widget never used either.
  - Script tag: operator or RSS article HTML can no longer make the closed iframe cover the host page. The launcher, peek and popup are found by element identity instead of a `data-wx-*` attribute lookup, and `data-wx-*` attributes are dropped from rendered content.
  - The trusted-host flag is a build-time constant of the private build only; the release boundary check fails if a public bundle carries it.
  - Escape at the page body no longer closes the open panel while a host modal (`<dialog open>`, `aria-modal`) is open.

- cb1f56b: Threads, sign-in and profile fixes.

  - `Wexio('shutdown')` now also forgets the previous visitor's thread list, unread badge, open conversation and profile form; the next visitor starts from an empty widget.
  - The thread list catches up after a dropped connection, the network coming back or the tab becoming visible again, and an older or replayed update no longer overwrites a newer preview (or chimes again).
  - Profile: text typed while a save is in flight is kept; an offline or demo save keeps the new value; a change the server rejects rolls back with a message; the form shows the widget's own validation messages instead of the browser's bubble.
  - Sign-in: "Try again" works after a blocked Turnstile script and brings the error popup back if it fails again; the Google button shows a busy state and a clear message when Google's script cannot load.
  - Pressing Enter repeatedly while a required pre-chat form submits sends the message once.
  - The "You:" prefix in the conversation list is translated (English and Ukrainian; other languages show the English text for now).
  - Web component: a language picked in Profile switches the widget at once.
  - Two widgets with different public keys on one page each use their own key, session and drafts.
  - Wide tables in messages scroll inside the bubble and keep their words whole.
  - Behaviour note: `setWexioPublicKey`, `setPublicKey` and `getApolloClient` only act on the default instance (the iframe route and non-component code). They no longer affect a `<WexioWidget>` or `<wexio-widget>`, which each own their connection state and take the key from the `publicKey` prop / `public-key` attribute.
  - A language the server rejects in Profile is rolled back in the widget chrome too, not only in the form.

- cb1f56b: The offline cache (config, gate and the other offline slices) now lives 72 hours instead of 14 days, so a downgraded or disabled key does not keep the widget alive from the cache for weeks during an API outage. Expired entries are treated as absent and evicted.
- cb1f56b: Changing the public key at runtime (`<WexioWidget publicKey>` prop, the `public-key` attribute) now starts a fresh widget session: the instance (token, Apollo cache, 401 recovery) and the widget tree are rebuilt, so nothing of the previous integration's visitor reaches the new one. An integration whose Home was never customised (the BE sends `homeLayout: []`) now shows the default Home blocks instead of a blank tab.

  Key policy: a key change while the panel is open now reports `onClose` / `wexio:close` for the old widget (the same applies when the host unmounts an open widget); an empty key then the real key is a normal first mount; a key that goes empty and returns within 400 ms keeps the widget and its open chat; empty for longer shows the demo.

  `homeLayout: []` from the BE is deliberately treated as "never customised": the widget shows the bundled default Home blocks (the BE returns `[]` where its entity default is `null` and cannot tell never-customised from emptied, and a Home with no blocks is meaningless). A Home cannot be deliberately emptied.

- cb1f56b: Demo mode: the related news and help-article lists are derived from the demo data and their toggles work. Real widgets are unchanged.
- cb1f56b: The conversation stays on the newest message when its content grows late: a video tile now reserves its box before the poster or first frame arrives (it was 0px tall, then grew by ~165px), and a reader pinned to the bottom keeps following content that settles at any time, not only for 2 s after the thread opened.
- cb1f56b: Fix the launcher's double focus ring and the cut-off shadow under the peek quick-reply chips.

  After a click the launcher stayed focused, and the next key press anywhere (an arrow or space scrolling the host page) made the browser show its keyboard ring, so a dark double ring popped onto the button out of nowhere. Focus that came from a pointer no longer draws the ring; keyboard focus still does. The quick-reply chip list also clipped each chip's drop shadow in a hard straight edge; its clip box now contains the shadow.

- cb1f56b: Expanding and collapsing the panel no longer animates its width and height every frame (a full layout of the thread per frame, which stuttered on phone-class CPUs with a long conversation). The panel now snaps to its final size and a compositor-only transform plays the same spring on top, so it looks the same but costs a handful of layouts instead of about 40. The content is never stretched, the iframe embed behaves the same, and `prefers-reduced-motion` snaps straight to the new size.
- cb1f56b: Docs: every package README links the new Playground (https://cdn.wexio.io/playground), which replaces the StackBlitz / CodeSandbox demos; the examples repository README points there too.
- cb1f56b: UI polish: messages and the opening conversation rise in like llm-console (gentle-in, last rows staggered, reduced motion = none); the unread badge only fades; the launcher no longer swaps its icon for a spinner while connecting; the demo conversation opens at the newest message.

## 1.4.1

### Patch Changes

- 9383463: Fix the widget still rendering on a site after the operator disabled it.

  When an integration is `disabled` (operator kill switch) or `plan_blocked` (org below the required plan), the backend correctly answers `status: 'disabled' | 'plan_blocked'`, and the contract is that the launcher hides silently. Only the script-tag loader honoured that (it checks the status before creating its iframe). The React and web-component embeds mount the widget shell directly and never looked at `status`, so they painted a live launcher whose session the backend then refused, and the widget opened straight into an error. The shell now renders nothing for any status other than `active`, so all embeds behave the same. `status` is server-owned (never taken from host props) and falls back to `active` if the gate request fails, so an outage cannot hide a working widget.

## 1.4.0

### Minor Changes

- 784e291: Same host controls on every embed (React, web-component, script-tag/iframe), plus a batch of embed fixes.

  **New**

  - **Theme control.** `theme` prop (React) / `theme="light|dark|auto"` attribute (web-component) / `window.Wexio('theme', ...)` and `wexioSettings.theme` (script tag). A host dark-mode toggle can drive the widget at runtime; it wins over the OS and the operator default.
  - **Launcher offset.** `offset={{ x, y }}` (React) / `offset-x`, `offset-y` attributes (web-component) / `wexioSettings.offset` (script tag) nudge the launcher, peek and panel away from their corner so they clear host furniture (cookie banners, back-to-top). Panel size caps subtract the same offset, so a pushed-up panel never overflows the top of the viewport.
  - **Branding override everywhere.** `configOverride` is honoured by all three embeds (React prop, `wexioSettings.configOverride`, and `wexio:config-override:v1` messages for live changes).
  - **Events and identity parity.** The web-component now fires `wexio:open` and reads `wexioSettings.user`; the script-tag embed re-emits `wexio:open` / `wexio:close` / `wexio:resize` as `window` events and accepts `wexioSettings.mode`.
  - **Launcher position in the iframe.** The operator's left/right launcher corner now moves the frame accordingly.

  **Fixed**

  - **Widget crashed on every site ("This page couldn't load").** The iframe route got a fresh default env on every render, so any config error (403/404) looped effects forever. The env is now stable.
  - **iframe app returned 500 for most locales** (`en-GB`, `de`, `fr`, ...): the server imported a `demo.<locale>.json` that only exists for `en` and `uk`. It now falls back to English.
  - **Web-component ignored theme colours.** Theme tokens were injected into the page `<head>`, which cannot reach the widget's Shadow DOM; they are now adopted into the shadow root, like the React embed.
  - **iframe sizing and position.** The panel was a smaller copy (~338x558 instead of 420x670) and sat 20px further from the corner than the other embeds; it now matches. The closed launcher frame fits the unread badge, shadow and peek bubble instead of clipping them, the panel no longer slowly rises from the bottom when opening, and a crashed widget stays a small corner box instead of covering the page.
  - **Conversation-header menu closed while typing.** The header was remounted on every shell re-render.
  - **Demo mode.** The FAQ tab no longer crashes on search before the demo content loads, and the demo conversation's quick-reply buttons and attachment names are no longer blank.

## 1.3.1

### Patch Changes

- 231e345: Fix the widget when it runs embedded inside a host app (the dashboard's live preview / the React-component embed).

  - **Demo content no longer breaks the host page.** In demo/preview mode the mock threads, help articles and news are now read straight from the widget's bundled demo content instead of next-intl's lazy `demo` namespace. Inside an embedded host (Turbopack) that lazy namespace was not visible to the demo builders, so previews rendered empty and logged `MISSING_MESSAGE` for every key, and the thread-list builder crashed the whole host page with "map is not a function". The builders are also guarded so a not-yet-resolved value degrades to empty instead of throwing.
  - **Pickers and menus are clickable inside the Shadow DOM embed.** The GIF and emoji pickers, the conversation-header overflow menu, the language selector and the composer commands popover used a document-level click-outside check against `event.target`. In the Shadow DOM embed that target is retargeted to the shadow host, so every in-picker click read as "outside" and closed the popover on mousedown before the click landed (a GIF/sticker/emoji tap "fell through"). They now test `event.composedPath()`, which pierces the shadow boundary and is unchanged for the iframe / standalone embeds.
  - **team-status "online" dot alignment.** The status dot is now aligned to the title's first line instead of drifting above it when operator avatars make the row taller.

## 1.3.0

### Minor Changes

- 037c210: Full two-way messaging: multi-topic threads, offline outbox, blocked visitors, richer composer, and transcript download.

  **Multi-topic conversation threads**

  - A multi-topic conversation list: the visitor can keep several topics side by side, each with its own preview, unread count, and status (open / pending / resolved). Starting a new question opens a fresh thread instead of overwriting the current one.
  - The launcher badge, peek, thread list, and open thread now share one unread source, so reading a message clears it everywhere at once. Quick-reply chips render inside the launcher peek so a visitor can answer without opening the panel.
  - Per-thread realtime: typing, unread, operator-handoff and status changes update the right thread live.

  **Blocked visitors**

  - Two levels of blocking are now honored on the client. **Thread-level**: the visitor can't reply in that thread but can still start a new one. **Global (contact-level)**: no composer anywhere and no new conversations, with friendly copy. The block is enforced on first paint (so a blocked visitor never sees a live composer) and kept current via the realtime stream. Blocked sends are dropped from the offline queue instead of retrying forever.

  **Offline outbox**

  - A generic IndexedDB queue backs the visitor's outbound actions — message sends, reactions, read receipts, profile changes, and activity tracking. Actions taken offline (or mid-reconnect) are persisted and converge automatically when the connection returns, so nothing is silently lost.

  **Composer**

  - Rich-text editing (bold / lists / links, Markdown-aware) and a GIF / sticker picker join the existing emoji picker, file attachments, and voice recorder.

  **Conversation lifecycle**

  - Download a conversation transcript from the header.
  - A clearer "conversation closed" state with a one-tap "start a new conversation".
  - A connection-status footer replaces the old branding footer, so a dropped connection is visible in-thread.

  **Reliability**

  - A code-split chunk that can't be fetched (for example the voice-note player while offline) now degrades gracefully to a fallback instead of breaking the whole conversation.

  **Captured visitors (lazy inbox)**

  - A drive-by visitor no longer opens a conversation until they actually engage. When there is nothing in the inbox yet, a configured welcome message shows as a default thread the visitor can read and reply in, rather than an empty "no conversations" screen — and the proactive welcome peek + badge appear once, then clear after it is read.
  - A first message (or an operator's proactive message) creates the conversation on the fly and its reply, greeting, and typing now render live in-thread — no reload, and no double launcher peek when a greeting flow is active.
  - Sent-message stability: the visitor's own bubble no longer flickers (animate out then back in) when the thread refetches after a send, and switching a thread's conversation id no longer remounts the open thread.

  **Media message previews**

  - A thread whose last message is a photo, video, gif, sticker, voice note, audio, or file now shows a typed label + thumbnail in the thread list and launcher peek, instead of a blank row.

  **i18n**

  - New conversation, thread, block, and transcript strings across all supported UI locales.

  No breaking changes to the package API — `publicKey`, `user`, `config`, and the `onOpen` / `onClose` / `onResize` callbacks are unchanged.

## 1.2.4

### Patch Changes

- 4215287: Re-publish to complete the release across all distribution channels (npm, the per-package dist repos, GitHub Releases, and the CDN bundle) after the 1.2.3 publish only partially completed. No functional changes from 1.2.3.

## 1.2.3

### Patch Changes

- 146aa5f: Make notification sounds far lighter, two changes:

  1. **Lazy loading.** The inbound/outbound `Audio` elements were built with `preload="auto"`, so both sound files were fetched on every page load the widget was embedded on, even for visitors who never opened the chat. They now use `preload="none"` (with `src` set after `preload`), so a sound downloads lazily on its first `play()`, which is always user-gesture triggered.

  2. **MP3 instead of WAV.** The 21 preset sounds were uncompressed WAV (~17MB total, individual files up to ~1.7MB). They are now 128kbps MP3 (~2MB total, ~16-52KB each). Preset ids resolve to `/sounds/wx-nt_*.mp3`; operator-uploaded custom sounds (full URLs) are unaffected.

  Together this removes ~3.6MB from the host page's initial load and makes the lazy first-play near-instant. No API or behavior change.

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
