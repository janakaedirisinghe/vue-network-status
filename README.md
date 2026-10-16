# vue-network-status

> A lightweight, reactive network connectivity and offline monitor banner for Vue 3.

[![npm version](https://img.shields.io/npm/v/vue-network-status.svg)](https://www.npmjs.com/package/vue-network-status)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🌐 **Real Connectivity Probes**: Avoids false positives (like disconnected Wi-Fi with local intranet) using lightweight dual-fallback probes to Cloudflare and Google.
- ⚡ **Network Information API**: Detects slow connection conditions (`slow-2g`, `2g`, high RTT, low downlink bandwidth).
- 🎨 **Sleek Animated Banner**: Modern slide-in banner with gradients, accessible ARIA roles, retry spinner, and dismissal support.
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
  <NetworkStatusBanner />
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
