<template>
  <Teleport :to="teleportTo">
    <Transition :name="transitionName">
      <aside
        v-if="effectiveVisible"
        role="alert"
        aria-live="assertive"
        class="network-banner"
        :class="bannerClass"
      >
        <!-- Scoped default slot allows total override if desired -->
        <slot
          :status="status"
          :is-offline="isOffline"
          :is-slow="isSlow"
          :is-restored="isRestored"
          :is-retrying="isRetrying"
          :network-speed-details="networkSpeedDetails"
          :title="bannerTitle"
          :message="bannerMessage"
          :retry="handleRetry"
          :dismiss="handleDismiss"
        >
          <div class="network-banner__container">
            <!-- Main Content Area -->
            <div class="network-banner__content">
              <!-- Icon Slot -->
              <slot
                name="icon"
                :status="status"
                :is-offline="isOffline"
                :is-slow="isSlow"
                :is-restored="isRestored"
              >
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
              </slot>

              <!-- Text & Badge -->
              <div class="network-banner__text-wrap">
                <slot name="title" :status="status" :title="bannerTitle">
                  <span class="network-banner__title">{{ bannerTitle }}</span>
                </slot>
                <slot name="message" :status="status" :message="bannerMessage">
                  <span class="network-banner__message">{{ bannerMessage }}</span>
                </slot>
                <slot
                  v-if="showBadge && isSlow && networkSpeedDetails"
                  name="badge"
                  :details="networkSpeedDetails"
                >
                  <span class="network-banner__badge">
                    {{ networkSpeedDetails }}
                  </span>
                </slot>
              </div>
            </div>

            <!-- Actions Area -->
            <div class="network-banner__actions">
              <slot
                name="actions"
                :is-offline="isOffline"
                :is-retrying="isRetrying"
                :retry="handleRetry"
                :dismiss="handleDismiss"
              >
                <!-- Retry Button (Offline State) -->
                <slot
                  v-if="showRetry && isOffline"
                  name="retry-btn"
                  :is-retrying="isRetrying"
                  :retry="handleRetry"
                >
                  <button
                    type="button"
                    class="network-banner__btn-retry"
                    :disabled="isRetrying"
                    @click="handleRetry"
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
                    <span>{{ isRetrying ? retryingText : retryText }}</span>
                  </button>
                </slot>

                <!-- Dismiss Button (All States) -->
                <slot
                  v-if="showDismiss"
                  name="dismiss-btn"
                  :dismiss="handleDismiss"
                >
                  <button
                    type="button"
                    class="network-banner__btn-dismiss"
                    :aria-label="dismissAriaLabel"
                    @click="handleDismiss"
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
                </slot>
              </slot>
            </div>
          </div>
        </slot>
      </aside>
    </Transition>
  </Teleport>
</template>

<script>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useNetworkStatus } from '../composables/useNetworkStatus.js'

export default {
  name: 'NetworkStatusBanner',
  props: {
    position: {
      type: String,
      default: 'top',
      validator: (v) => ['top', 'bottom', 'floating-top', 'floating-bottom'].includes(v)
    },
    teleportTo: {
      type: String,
      default: 'body'
    },
    showRetry: {
      type: Boolean,
      default: true
    },
    showDismiss: {
      type: Boolean,
      default: true
    },
    showBadge: {
      type: Boolean,
      default: true
    },
    showSlowWarning: {
      type: Boolean,
      default: true
    },
    offlineTitle: {
      type: String,
      default: 'You are currently offline.'
    },
    offlineMessage: {
      type: String,
      default: 'Changes may not be saved until reconnected.'
    },
    slowTitle: {
      type: String,
      default: 'Slow connection detected.'
    },
    slowMessage: {
      type: String,
      default: 'Syncing and downloads may take longer.'
    },
    restoredTitle: {
      type: String,
      default: 'Back online!'
    },
    restoredMessage: {
      type: String,
      default: 'Your internet connection has been restored.'
    },
    retryText: {
      type: String,
      default: 'Retry Now'
    },
    retryingText: {
      type: String,
      default: 'Checking...'
    },
    dismissAriaLabel: {
      type: String,
      default: 'Dismiss network alert'
    }
  },
  emits: ['status-change', 'retry', 'dismiss'],
  setup(props, { emit }) {
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

    watch(status, (current, previous) => {
      emit('status-change', { current, previous })
    })

    const effectiveVisible = computed(() => {
      if (!isVisible.value) return false
      if (!props.showSlowWarning && isSlow.value) return false
      return true
    })

    const isFloating = computed(() => props.position.startsWith('floating'))

    const bannerClass = computed(() => {
      return [
        `network-banner--pos-${props.position}`,
        {
          'network-banner--offline': isOffline.value,
          'network-banner--slow': isSlow.value,
          'network-banner--restored': isRestored.value,
          'network-banner--floating': isFloating.value
        }
      ]
    })

    const transitionName = computed(() => {
      return props.position.includes('bottom')
        ? 'network-banner-slide-up'
        : 'network-banner-slide-down'
    })

    const bannerTitle = computed(() => {
      if (isOffline.value) return props.offlineTitle
      if (isSlow.value) return props.slowTitle
      if (isRestored.value) return props.restoredTitle
      return ''
    })

    const bannerMessage = computed(() => {
      if (isOffline.value) return props.offlineMessage
      if (isSlow.value) return props.slowMessage
      if (isRestored.value) return props.restoredMessage
      return ''
    })

    const handleRetry = async () => {
      emit('retry')
      await retryConnection()
    }

    const handleDismiss = () => {
      dismiss()
      emit('dismiss')
    }

    return {
      status,
      isOffline,
      isSlow,
      isRestored,
      effectiveVisible,
      isRetrying,
      networkSpeedDetails,
      bannerClass,
      transitionName,
      bannerTitle,
      bannerMessage,
      handleRetry,
      handleDismiss
    }
  }
}
</script>

<style scoped>
/* ── CSS Custom Properties & Base Banner Layout ── */
.network-banner {
  --vns-bg-offline: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
  --vns-border-offline: rgba(254, 202, 202, 0.35);
  --vns-bg-slow: linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%);
  --vns-border-slow: rgba(253, 230, 138, 0.35);
  --vns-bg-restored: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%);
  --vns-border-restored: rgba(187, 247, 208, 0.35);
  --vns-text-color: #ffffff;
  --vns-z-index: 999999;
  --vns-font-family: inherit;
  --vns-offset-top: 0px;
  --vns-offset-bottom: 0px;
  --vns-radius: 0px;

  position: fixed;
  z-index: var(--vns-z-index);
  color: var(--vns-text-color);
  font-family: var(--vns-font-family);
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.28), 0 2px 6px -1px rgba(0, 0, 0, 0.16);
}

/* ── Positions: Fixed Full-Width ── */
.network-banner--pos-top {
  top: var(--vns-offset-top);
  left: 0;
  right: 0;
  width: 100%;
  padding: 8px 16px;
  border-radius: var(--vns-radius);
}

.network-banner--pos-bottom {
  bottom: var(--vns-offset-bottom);
  left: 0;
  right: 0;
  width: 100%;
  padding: 8px 16px;
  border-radius: var(--vns-radius);
}

/* ── Positions: Floating Toast Pill ── */
.network-banner--pos-floating-top {
  top: calc(var(--vns-offset-top) + 16px);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 680px;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

.network-banner--pos-floating-bottom {
  bottom: calc(var(--vns-offset-bottom) + 16px);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 680px;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

/* ── Status Variant Colors ── */
.network-banner--offline {
  background: var(--vns-bg-offline);
  border-bottom: 1px solid var(--vns-border-offline);
}

.network-banner--slow {
  background: var(--vns-bg-slow);
  border-bottom: 1px solid var(--vns-border-slow);
}

.network-banner--restored {
  background: var(--vns-bg-restored);
  border-bottom: 1px solid var(--vns-border-restored);
}

/* Floating borders surround entire pill */
.network-banner--floating.network-banner--offline {
  border: 1px solid var(--vns-border-offline);
}
.network-banner--floating.network-banner--slow {
  border: 1px solid var(--vns-border-slow);
}
.network-banner--floating.network-banner--restored {
  border: 1px solid var(--vns-border-restored);
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

/* ── Slide Down Transitions (Top & Floating-Top) ── */
.network-banner-slide-down-enter-active,
.network-banner-slide-down-leave-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.network-banner--pos-top.network-banner-slide-down-enter-from,
.network-banner--pos-top.network-banner-slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.network-banner--pos-top.network-banner-slide-down-enter-to,
.network-banner--pos-top.network-banner-slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.network-banner--pos-floating-top.network-banner-slide-down-enter-from,
.network-banner--pos-floating-top.network-banner-slide-down-leave-to {
  transform: translate(-50%, -120%);
  opacity: 0;
}

.network-banner--pos-floating-top.network-banner-slide-down-enter-to,
.network-banner--pos-floating-top.network-banner-slide-down-leave-from {
  transform: translate(-50%, 0);
  opacity: 1;
}

/* ── Slide Up Transitions (Bottom & Floating-Bottom) ── */
.network-banner-slide-up-enter-active,
.network-banner-slide-up-leave-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.network-banner--pos-bottom.network-banner-slide-up-enter-from,
.network-banner--pos-bottom.network-banner-slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.network-banner--pos-bottom.network-banner-slide-up-enter-to,
.network-banner--pos-bottom.network-banner-slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.network-banner--pos-floating-bottom.network-banner-slide-up-enter-from,
.network-banner--pos-floating-bottom.network-banner-slide-up-leave-to {
  transform: translate(-50%, 120%);
  opacity: 0;
}

.network-banner--pos-floating-bottom.network-banner-slide-up-enter-to,
.network-banner--pos-floating-bottom.network-banner-slide-up-leave-from {
  transform: translate(-50%, 0);
  opacity: 1;
}

/* ── Mobile Responsive Adjustments ── */
@media (max-width: 640px) {
  .network-banner--pos-top,
  .network-banner--pos-bottom {
    padding: 8px 12px;
  }

  .network-banner--pos-floating-top,
  .network-banner--pos-floating-bottom {
    width: calc(100% - 20px);
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
