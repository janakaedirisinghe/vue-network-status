import { ref, computed } from 'vue'

const status = ref('online') // 'online' | 'offline' | 'slow' | 'restored'
const isDismissed = ref(false)
const isRetrying = ref(false)
const networkSpeedDetails = ref('')
const lastMeasuredLatency = ref(null)

let restoreTimer = null
let backgroundCheckInterval = null

/**
 * Lightweight probe to verify true internet reachability.
 * Avoids localhost false-positives when Wi-Fi is disconnected.
 */
export async function probeConnectivity(timeoutMs = 3500) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  const startTime = performance.now()

  const probeUrls = [
    `https://1.1.1.1/cdn-cgi/trace?_t=${Date.now()}_${Math.random()}`,
    `https://www.google.com/favicon.ico?_t=${Date.now()}_${Math.random()}`
  ]

  for (const url of probeUrls) {
    try {
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const latency = Math.round(performance.now() - startTime)
      return { online: true, latency }
    } catch {
      // Continue to next probe candidate
      continue
    }
  }

  clearTimeout(timeoutId)
  return { online: false, latency: null }
}

/**
 * Evaluates Network Information API (if available) for slow network conditions.
 */
function inspectNetworkApi() {
  if (typeof navigator === 'undefined') return { isSlow: false, details: '' }

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (conn) {
    const isSlowType = conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g'
    const isHighRtt = typeof conn.rtt === 'number' && conn.rtt > 1600
    const isLowDownlink = typeof conn.downlink === 'number' && conn.downlink > 0 && conn.downlink < 0.65

    if (isSlowType || isHighRtt || isLowDownlink) {
      const parts = []
      if (conn.effectiveType) parts.push(conn.effectiveType.toUpperCase())
      if (typeof conn.downlink === 'number' && conn.downlink > 0) parts.push(`${conn.downlink} Mbps`)
      if (typeof conn.rtt === 'number' && conn.rtt > 0) parts.push(`${conn.rtt}ms RTT`)
      return { isSlow: true, details: parts.join(' · ') }
    }
  }

  return { isSlow: false, details: '' }
}

export function useNetworkStatus() {
  const isOffline = computed(() => status.value === 'offline')
  const isSlow = computed(() => status.value === 'slow')
  const isRestored = computed(() => status.value === 'restored')
  const isVisible = computed(() => !isDismissed.value && status.value !== 'online')

  const dismiss = () => {
    isDismissed.value = true
  }

  const setRestoredState = () => {
    if (restoreTimer) clearTimeout(restoreTimer)
    status.value = 'restored'
    isDismissed.value = false

    restoreTimer = setTimeout(() => {
      if (status.value === 'restored') {
        status.value = 'online'
      }
    }, 3000)
  }

  const setOfflineState = () => {
    if (restoreTimer) clearTimeout(restoreTimer)
    status.value = 'offline'
    isDismissed.value = false
  }

  const setSlowState = (details = '') => {
    if (status.value !== 'offline') {
      status.value = 'slow'
      networkSpeedDetails.value = details
      isDismissed.value = false
    }
  }

  const setOnlineState = (wasOffline = false) => {
    if (wasOffline) {
      setRestoredState()
    } else {
      status.value = 'online'
      networkSpeedDetails.value = ''
    }
  }

  const checkNetworkStatus = async (isBackground = false) => {
    // 1. Check browser navigator.onLine flag
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOfflineState()
      return
    }

    // 2. Inspect Network Information API
    const netInfo = inspectNetworkApi()

    // 3. If in background and already offline or user dismissed, don't spam probes unnecessarily
    if (isBackground && status.value === 'offline') {
      return
    }

    // 4. Verify connectivity using lightweight probe
    const wasOffline = status.value === 'offline'
    const { online, latency } = await probeConnectivity(3500)

    if (!online) {
      setOfflineState()
      return
    }

    lastMeasuredLatency.value = latency

    // Check slow latency fallback (> 2500ms) or Network Information API
    if (netInfo.isSlow) {
      setSlowState(netInfo.details)
    } else if (latency && latency > 2500) {
      setSlowState(`Latency ~${latency}ms`)
    } else {
      setOnlineState(wasOffline)
    }
  }

  const retryConnection = async () => {
    if (isRetrying.value) return
    isRetrying.value = true

    try {
      const { online, latency } = await probeConnectivity(3500)
      lastMeasuredLatency.value = latency

      if (!online) {
        status.value = 'offline'
        isDismissed.value = false
      } else {
        const netInfo = inspectNetworkApi()
        if (netInfo.isSlow) {
          setSlowState(netInfo.details)
        } else if (latency && latency > 2500) {
          setSlowState(`Latency ~${latency}ms`)
        } else {
          setRestoredState()
        }
      }
    } finally {
      isRetrying.value = false
    }
  }

  const handleOnlineEvent = async () => {
    const wasOffline = status.value === 'offline'
    const { online, latency } = await probeConnectivity(3500)
    lastMeasuredLatency.value = latency

    if (online) {
      const netInfo = inspectNetworkApi()
      if (netInfo.isSlow) {
        setSlowState(netInfo.details)
      } else if (latency && latency > 2500) {
        setSlowState(`Latency ~${latency}ms`)
      } else {
        setRestoredState()
      }
    } else {
      setOfflineState()
    }
  }

  const handleOfflineEvent = () => {
    setOfflineState()
  }

  const handleConnectionChange = () => {
    checkNetworkStatus(false)
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkNetworkStatus(true)
    }
  }

  const startListeners = () => {
    if (typeof window === 'undefined') return

    window.addEventListener('online', handleOnlineEvent)
    window.addEventListener('offline', handleOfflineEvent)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', handleConnectionChange)
    }

    // Initial check
    if (!navigator.onLine) {
      setOfflineState()
    } else {
      checkNetworkStatus(true)
    }

    // Periodic heartbeat probe every 40s
    if (!backgroundCheckInterval) {
      backgroundCheckInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          checkNetworkStatus(true)
        }
      }, 40000)
    }
  }

  const stopListeners = () => {
    if (typeof window === 'undefined') return

    window.removeEventListener('online', handleOnlineEvent)
    window.removeEventListener('offline', handleOfflineEvent)
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn && conn.removeEventListener) {
      conn.removeEventListener('change', handleConnectionChange)
    }

    if (backgroundCheckInterval) {
      clearInterval(backgroundCheckInterval)
      backgroundCheckInterval = null
    }

    if (restoreTimer) {
      clearTimeout(restoreTimer)
      restoreTimer = null
    }
  }

  return {
    status,
    isOffline,
    isSlow,
    isRestored,
    isVisible,
    isRetrying,
    isDismissed,
    networkSpeedDetails,
    lastMeasuredLatency,
    probeConnectivity,
    checkNetworkStatus,
    retryConnection,
    dismiss,
    startListeners,
    stopListeners
  }
}
