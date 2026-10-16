import NetworkStatusBanner from './components/NetworkStatusBanner.vue'
import { useNetworkStatus, probeConnectivity } from './composables/useNetworkStatus.js'

export {
  NetworkStatusBanner,
  useNetworkStatus,
  probeConnectivity
}

const VueNetworkStatusPlugin = {
  install(app) {
    app.component('NetworkStatusBanner', NetworkStatusBanner)
  }
}

export default VueNetworkStatusPlugin
