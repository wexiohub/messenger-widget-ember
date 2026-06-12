# Welcome to @wexio/messenger-widget-ember 👋

[![Version](https://img.shields.io/npm/v/@wexio/messenger-widget-ember.svg)](https://www.npmjs.com/package/@wexio/messenger-widget-ember)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Documentation](https://img.shields.io/badge/docs-wexio.io-blue.svg)](https://learn.wexio.io/docs/web-widget)

Ember integration for the [Wexio](https://wexio.io) web messenger. Registers the underlying `<wexio-widget>` custom element so Glimmer renders it natively — no Ember component wrapper required.

🏠 [Website](https://wexio.io)
📚 [Developer Docs](https://learn.wexio.io/docs/web-widget)

## 📂 Description

- [Installation](#installation)
- [Quick start](#quick-start)
- [Event handling](#event-handling)
- [Identifying users](#identifying-users)
- [Service helper](#service-helper)
- [Types](#types)
- [Browser support](#browser-support)
- [Author](#author)
- [License](#-license)

## Installation

```bash
yarn add @wexio/messenger-widget-ember
```

or

```bash
npm install @wexio/messenger-widget-ember
```

Ember 4+ is supported. The package has no required peer deps — `ember-source` is listed as an optional peer for clarity.

## Quick start

Import the package **once** at app boot to register the custom element:

```js
// app/app.js (or any module loaded at boot)
import "@wexio/messenger-widget-ember";
```

Then use `<wexio-widget>` directly in any template:

```hbs
{{! app/templates/application.hbs }}
<wexio-widget public-key="pk_live_..."></wexio-widget>
```

Glimmer renders the unknown tag as a native DOM element. The custom-element runtime kicks in, mounts a Shadow-DOM-isolated Wexio messenger, and the operator dashboard sees the visitor immediately.

## Event handling

`<wexio-widget>` dispatches standard `CustomEvent`s. Bind handlers with Ember's built-in `{{on}}` modifier:

```hbs
<wexio-widget
  public-key="pk_live_..."
  {{on "wexio:resize" this.onResize}}
  {{on "wexio:close"  this.onClose}}
></wexio-widget>
```

```js
// app/components/foo.js
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class FooComponent extends Component {
  @action onResize(event) {
    const { width, height } = event.detail;
    console.log(width, height);
  }

  @action onClose() {
    console.log("visitor closed the panel");
  }
}
```

## Identifying users

Identity is set imperatively on the DOM element. Use the [service helper](#service-helper) or grab the element directly:

```js
// app/routes/application.js
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service session; // your own session service

  async afterModel() {
    if (this.session.isAuthenticated) {
      const el = document.querySelector("wexio-widget");
      el?.identify({
        jwt: this.session.jwt, // host-signed identity token
        name: this.session.user.name,
        email: this.session.user.email,
      });
    }
  }
}
```

## Service helper

The package exports a `WexioWidgetService` class you can extend to register as a proper Ember service:

```js
// app/services/wexio-widget.js
import { WexioWidgetService } from "@wexio/messenger-widget-ember";
export default class extends WexioWidgetService {}
```

Inject anywhere:

```js
import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class LoginComponent extends Component {
  @service wexioWidget;

  @action onLogin(token, user) {
    this.wexioWidget.identify({ jwt: token, name: user.name, email: user.email });
  }

  @action onLogout() {
    this.wexioWidget.shutdown();
  }
}
```

Service API:

| Method                          | Effect                                                                |
| ------------------------------- | --------------------------------------------------------------------- |
| `identify(user \| null)`        | Log a known user in / out (`null` logs out).                          |
| `prefill({ name, email, phone })` | Update unverified prechat prefill (via global `window.Wexio()` API). |
| `show()`                        | Show the widget panel.                                                |
| `hide()`                        | Hide the widget panel.                                                |
| `shutdown()`                    | Clear identity (log out).                                             |

## Types

### VisitorIdentity

```ts
interface VisitorIdentity {
  googleIdToken?: string;  // Google FedCM id_token (preferred)
  jwt?: string;            // Host-signed JWT
  userId?: string;         // Legacy HMAC pair…
  userHash?: string;       // …(HMAC-SHA256(userId, integrationSecret))
  name?: string;
  email?: string;
  phone?: string;
  attributes?: Record<string, unknown>;
}
```

### VisitorPrefill

```ts
interface VisitorPrefill {
  name?: string;
  email?: string;
  phone?: string;
}
```

## Browser support

Modern evergreen browsers — anything that supports Shadow DOM and ES2020. Internet Explorer is not supported.

## Use with other frameworks

The underlying widget runtime is a Web Component, so it works in any modern framework:

- [`@wexio/messenger-widget-react`](https://www.npmjs.com/package/@wexio/messenger-widget-react) — React
- [`@wexio/messenger-widget-vue`](https://www.npmjs.com/package/@wexio/messenger-widget-vue) — Vue 3
- [`@wexio/messenger-widget-angular`](https://www.npmjs.com/package/@wexio/messenger-widget-angular) — Angular

## Author

👤 **Wexio** ([https://wexio.io](https://wexio.io))

## Show your support

Give a ⭐️ if this package helped you!

## 📝 License

This project is [MIT](./LICENSE) licensed.

---

_Created with ❤️ by [Wexio](https://wexio.io)_
