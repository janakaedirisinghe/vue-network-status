<template>
  <Teleport to="body">
    <Transition name="network-banner-slide">
      <aside
        v-if="isVisible"
        role="alert"
        aria-live="assertive"
        class="network-banner"
        :class="bannerClass"
      >
        <div class="network-banner__container">
          <!-- Main Content Area -->
          <div class="network-banner__content">
            <!-- Offline Icon -->
            <svg
              v-if="isOffline"
              class="network-banner__icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3l18 18M10.584 10.587a6 6 0 00-4.084 1.713M8.535 5.5A12.07 12.07 0 0112 5c3.18 0 6.07 1.24 8.214 3.268m-2.128 2.13A8.006 8.006 0 0012 9c-.83 0-1.63.125-2.383.359M1.42 9a16 16 0 014.773-3.23M12 20h.01"
              />
            </svg>

            <!-- Slow Connection Icon -->
            <svg
              v-else-if="isSlow"
              class="network-banner__icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>

            <!-- Restored Icon -->
            <svg
              v-else-if="isRestored"
              class="network-banner__icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <!-- Text & Badge -->
            <div class="network-banner__text-wrap">
              <span class="network-banner__title">{{ bannerTitle }}</span>
              <span class="network-banner__message">{{ bannerMessage }}</span>
              <span
                v-if="isSlow && networkSpeedDetails"
                class="network-banner__badge"
              >
                {{ networkSpeedDetails }}
              </span>
            </div>
          </div>

          <!-- Actions Area -->
          <div class="network-banner__actions">
            <!-- Retry Button (Offline State) -->
            <button
              v-if="isOffline"
              type="button"
              class="network-banner__btn-retry"
              :disabled="isRetrying"
              @click="retryConnection"
            >
              <svg
                v-if="isRetrying"
                class="network-banner__spinner"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="3"
                  class="network-banner__spinner-track"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <svg
                v-else
                class="network-banner__btn-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{{ isRetrying ? 'Checking...' : 'Retry Now' }}</span>
            </button>

            <!-- Dismiss Button (All States) -->
            <button
              type="button"
              class="network-banner__btn-dismiss"
              aria-label="Dismiss network alert"
              @click="dismiss"
            >
              <svg
                class="network-banner__btn-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue'
import { useNetworkStatus } from '../composables/useNetworkStatus.js'

export default {
  name: 'NetworkStatusBanner',
  setup() {
    const {
      status,
      isOffline,
      isSlow,
      isRestored,
      isVisible,
      isRetrying,
      networkSpeedDetails,
      retryConnection,
      dismiss,
      startListeners,
      stopListeners
    } = useNetworkStatus()

    onMounted(() => {
      startListeners()
    })

    onUnmounted(() => {
      stopListeners()
    })

    const bannerClass = computed(() => {
      return {
        'network-banner--offline': isOffline.value,
        'network-banner--slow': isSlow.value,
        'network-banner--restored': isRestored.value
      }
    })

    const bannerTitle = computed(() => {
      if (isOffline.value) return 'You are currently offline.'
      if (isSlow.value) return 'Slow connection detected.'
      if (isRestored.value) return 'Back online!'
      return ''
    })

    const bannerMessage = computed(() => {
      if (isOffline.value) return 'Changes may not be saved until reconnected.'
      if (isSlow.value) return 'Syncing and downloads may take longer.'
      if (isRestored.value) return 'Your internet connection has been restored.'
      return ''
    })

    return {
      status,
      isOffline,
      isSlow,
      isRestored,
      isVisible,
      isRetrying,
      networkSpeedDetails,
      bannerClass,
      bannerTitle,
      bannerMessage,
      retryConnection,
      dismiss
    }
  }
}
</script>

<style scoped>
/* ── Main Banner Layout ── */
.network-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  width: 100%;
  color: #ffffff;
  padding: 8px 16px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.28), 0 2px 6px -1px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: inherit;
  box-sizing: border-box;
}

/* ── Status Variant Gradients ── */
.network-banner--offline {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
  border-bottom: 1px solid rgba(254, 202, 202, 0.35);
}

.network-banner--slow {
  background: linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%);
  border-bottom: 1px solid rgba(253, 230, 138, 0.35);
}

.network-banner--restored {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%);
  border-bottom: 1px solid rgba(187, 247, 208, 0.35);
}

/* ── Inner Container ── */
.network-banner__container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 28px;
}

/* ── Content Area ── */
.network-banner__content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 auto;
  min-width: 0;
}

.network-banner__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
}

.network-banner__text-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 8px;
  font-size: 13px;
  line-height: 1.4;
}

.network-banner__title {
  font-weight: 700;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.network-banner__message {
  font-weight: 400;
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.network-banner__badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #ffffff;
  letter-spacing: 0.02em;
}

/* ── Action Buttons ── */
.network-banner__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.network-banner__btn-retry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.network-banner__btn-retry:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.32);
  border-color: rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
}

.network-banner__btn-retry:active:not(:disabled) {
  transform: translateY(0);
}

.network-banner__btn-retry:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.network-banner__btn-dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: all 0.18s ease;
}

.network-banner__btn-dismiss:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.network-banner__btn-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.network-banner__spinner {
  width: 14px;
  height: 14px;
  animation: network-spin 0.8s linear infinite;
  flex-shrink: 0;
}

.network-banner__spinner-track {
  opacity: 0.25;
}

@keyframes network-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── Slide Down / Up Transition ── */
.network-banner-slide-enter-active,
.network-banner-slide-leave-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.network-banner-slide-enter-from,
.network-banner-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.network-banner-slide-enter-to,
.network-banner-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* ── Mobile Responsive Adjustments ── */
@media (max-width: 640px) {
  .network-banner {
    padding: 8px 12px;
  }

  .network-banner__container {
    flex-wrap: nowrap;
  }

  .network-banner__text-wrap {
    font-size: 12px;
  }

  .network-banner__btn-retry {
    padding: 3px 8px;
    font-size: 11px;
  }
}
</style>
