# vue-network-status

> A lightweight, reactive network connectivity and offline monitor banner for Vue 3.

[![npm version](https://img.shields.io/npm/v/vue-network-status.svg)](https://www.npmjs.com/package/vue-network-status)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🌐 **Real Connectivity Probes**: Avoids false positives (like disconnected Wi-Fi with local intranet) using lightweight dual-fallback probes to Cloudflare and Google.
- ⚡ **Network Information API**: Detects slow connection conditions (`slow-2g`, `2g`, high RTT, low downlink bandwidth).
- 🎨 **Sleek Animated Banner**: Modern slide-in banner with gradients, accessible ARIA roles, retry spinner, and dismissal support.
- 📍 **Multiple Positions**: Supports full-width `top` and `bottom` bars, or modern `floating-top` and `floating-bottom` toast pills.
- 🎛️ **Fully Customizable**: Rich props for custom copy/i18n, scoped slots for complete UI control, and CSS custom properties for theming.
- 🧩 **Zero External CSS**: All CSS is self-contained and scoped — no Tailwind or CSS framework required.
- 🪝 **Reactive Composable**: Provides `useNetworkStatus()` for programmatic access anywhere in your app.

---

## 📦 Installation

```bash
npm install vue-network-status
```

---

## 🚀 Quick Start

### 1. Global / App-Level Banner

Import the component and stylesheet in your root `App.vue`:

```vue
<script setup>
import { NetworkStatusBanner } from 'vue-network-status'
import 'vue-network-status/dist/style.css'
</script>

<template>
  <!-- Full-width top banner (default) -->
  <NetworkStatusBanner />

  <!-- OR floating toast pill at the bottom -->
  <!-- <NetworkStatusBanner position="floating-bottom" /> -->

  <router-view />
</template>
```

### 2. Using the Composable

You can also use the reactive composable anywhere in your application (e.g., inside form submissions or API handlers):

```vue
<script setup>
import { useNetworkStatus } from 'vue-network-status'

const {
  status,              // 'online' | 'offline' | 'slow' | 'restored'
  isOffline,           // Computed boolean
  isSlow,              // Computed boolean
  isRestored,          // Computed boolean
  isVisible,           // Computed boolean (visible when not online and not dismissed)
  isRetrying,          // Boolean (probe in-progress)
  networkSpeedDetails, // Formatted network info (e.g. '2G · 0.4 Mbps · 1800ms RTT')
  retryConnection,     // Function to trigger an immediate connectivity check
  dismiss              // Function to dismiss the active banner
} = useNetworkStatus()
</script>

<template>
  <div>
    <button :disabled="isOffline" @click="saveData">
      {{ isOffline ? 'Offline - Cannot Save' : 'Save Changes' }}
    </button>
  </div>
</template>
```

### 3. Standalone Probe Utility

```javascript
import { probeConnectivity } from 'vue-network-status'

const { online, latency } = await probeConnectivity(3500)
console.log('Online:', online, 'Latency:', latency)
```

---

## ⚙️ Component Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `String` | `'top'` | Position variant: `'top'`, `'bottom'`, `'floating-top'`, or `'floating-bottom'` |
| `teleportTo` | `String` | `'body'` | Target selector for `<Teleport>` |
| `showRetry` | `Boolean` | `true` | Show/hide the "Retry Now" button when offline |
| `showDismiss` | `Boolean` | `true` | Show/hide the close/dismiss button |
| `showBadge` | `Boolean` | `true` | Show/hide connection speed details badge on slow connections |
| `showSlowWarning` | `Boolean` | `true` | When set to `false`, the banner will only show for offline/restored states |
| `offlineTitle` | `String` | `'You are currently offline.'` | Custom title when offline |
| `offlineMessage` | `String` | `'Changes may not be saved until reconnected.'` | Custom message when offline |
| `slowTitle` | `String` | `'Slow connection detected.'` | Custom title on slow connection |
| `slowMessage` | `String` | `'Syncing and downloads may take longer.'` | Custom message on slow connection |
| `restoredTitle` | `String` | `'Back online!'` | Custom title when connection is restored |
| `restoredMessage` | `String` | `'Your internet connection has been restored.'` | Custom message when connection is restored |
| `retryText` | `String` | `'Retry Now'` | Button label for retry action |
| `retryingText` | `String` | `'Checking...'` | Button label while probe check is active |
| `dismissAriaLabel` | `String` | `'Dismiss network alert'` | Accessibility label for dismiss button |

---

## 🪟 Scoped Slots

Customize any part of the banner or replace the entire template:

| Slot | Scope Properties | Description |
| :--- | :--- | :--- |
| `#default` | `{ status, isOffline, isSlow, isRestored, isRetrying, networkSpeedDetails, title, message, retry, dismiss }` | Replaces the entire banner contents |
| `#icon` | `{ status, isOffline, isSlow, isRestored }` | Custom status icon |
| `#title` | `{ status, title }` | Custom title text or layout |
| `#message` | `{ status, message }` | Custom description text |
| `#badge` | `{ details }` | Custom network speed pill badge |
| `#actions` | `{ isOffline, isRetrying, retry, dismiss }` | Custom actions section |
| `#retry-btn` | `{ isRetrying, retry }` | Custom retry button |
| `#dismiss-btn` | `{ dismiss }` | Custom dismiss button |

### Example with Slots:

```vue
<NetworkStatusBanner position="floating-bottom">
  <template #icon="{ isOffline }">
    <span>{{ isOffline ? '🚨' : '⚡' }}</span>
  </template>
  <template #retry-btn="{ isRetrying, retry }">
    <button @click="retry" class="my-custom-btn">
      {{ isRetrying ? 'Re-checking...' : 'Try Reconnecting' }}
    </button>
  </template>
</NetworkStatusBanner>
```

---

## 📡 Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `@status-change` | `{ current, previous }` | Emitted whenever network status changes (`'online'`, `'offline'`, `'slow'`, `'restored'`) |
| `@retry` | — | Emitted when user clicks the retry button |
| `@dismiss` | — | Emitted when user dismisses the banner |

---

## 🎨 CSS Theming & Custom Properties

All styles are powered by CSS variables that you can easily override globally or on a parent container:

```css
:root {
  /* Gradients & backgrounds */
  --vns-bg-offline: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  --vns-border-offline: rgba(254, 202, 202, 0.4);
  --vns-bg-slow: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --vns-border-slow: rgba(253, 230, 138, 0.4);
  --vns-bg-restored: linear-gradient(135deg, #10b981 0%, #047857 100%);
  --vns-border-restored: rgba(187, 247, 208, 0.4);

  /* Typography & Layers */
  --vns-text-color: #ffffff;
  --vns-z-index: 999999;
  --vns-font-family: 'Inter', system-ui, sans-serif;

  /* Offsets (useful if you have a sticky navbar or header) */
  --vns-offset-top: 60px;
  --vns-offset-bottom: 20px;
  --vns-radius: 8px;
}
```

---

## 🛠️ Build & Development

```bash
# Install dependencies
npm install

# Build library bundle
npm run build
```

---

## 📄 License

MIT © Janaka Edirisinghe
