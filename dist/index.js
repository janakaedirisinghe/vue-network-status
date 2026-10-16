import { ref as T, computed as f, openBlock as g, createBlock as H, Teleport as U, createVNode as W, Transition as Y, withCtx as F, createElementBlock as h, normalizeClass as G, renderSlot as v, createElementVNode as s, createCommentVNode as _, toDisplayString as p, onMounted as P, onUnmounted as q, watch as J } from "vue";
const a = T("online"), k = T(!1), D = T(!1), V = T(""), B = T(null);
let y = null, S = null;
async function O(n = 3500) {
  const t = new AbortController(), i = setTimeout(() => t.abort(), n), e = performance.now(), r = [
    `https://1.1.1.1/cdn-cgi/trace?_t=${Date.now()}_${Math.random()}`,
    `https://www.google.com/favicon.ico?_t=${Date.now()}_${Math.random()}`
  ];
  for (const c of r)
    try {
      return await fetch(c, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
        signal: t.signal
      }), clearTimeout(i), { online: !0, latency: Math.round(performance.now() - e) };
    } catch {
      continue;
    }
  return clearTimeout(i), { online: !1, latency: null };
}
function x() {
  if (typeof navigator > "u") return { isSlow: !1, details: "" };
  const n = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (n) {
    const t = n.effectiveType === "slow-2g" || n.effectiveType === "2g", i = typeof n.rtt == "number" && n.rtt > 1600, e = typeof n.downlink == "number" && n.downlink > 0 && n.downlink < 0.65;
    if (t || i || e) {
      const r = [];
      return n.effectiveType && r.push(n.effectiveType.toUpperCase()), typeof n.downlink == "number" && n.downlink > 0 && r.push(`${n.downlink} Mbps`), typeof n.rtt == "number" && n.rtt > 0 && r.push(`${n.rtt}ms RTT`), { isSlow: !0, details: r.join(" · ") };
    }
  }
  return { isSlow: !1, details: "" };
}
function K() {
  const n = f(() => a.value === "offline"), t = f(() => a.value === "slow"), i = f(() => a.value === "restored"), e = f(() => !k.value && a.value !== "online"), r = () => {
    k.value = !0;
  }, c = () => {
    y && clearTimeout(y), a.value = "restored", k.value = !1, y = setTimeout(() => {
      a.value === "restored" && (a.value = "online");
    }, 3e3);
  }, d = () => {
    y && clearTimeout(y), a.value = "offline", k.value = !1;
  }, u = (o = "") => {
    a.value !== "offline" && (a.value = "slow", V.value = o, k.value = !1);
  }, E = (o = !1) => {
    o ? c() : (a.value = "online", V.value = "");
  }, m = async (o = !1) => {
    if (typeof navigator < "u" && !navigator.onLine) {
      d();
      return;
    }
    const l = x();
    if (o && a.value === "offline")
      return;
    const w = a.value === "offline", { online: I, latency: b } = await O(3500);
    if (!I) {
      d();
      return;
    }
    B.value = b, l.isSlow ? u(l.details) : b && b > 2500 ? u(`Latency ~${b}ms`) : E(w);
  }, N = async () => {
    if (!D.value) {
      D.value = !0;
      try {
        const { online: o, latency: l } = await O(3500);
        if (B.value = l, !o)
          a.value = "offline", k.value = !1;
        else {
          const w = x();
          w.isSlow ? u(w.details) : l && l > 2500 ? u(`Latency ~${l}ms`) : c();
        }
      } finally {
        D.value = !1;
      }
    }
  }, C = async () => {
    a.value;
    const { online: o, latency: l } = await O(3500);
    if (B.value = l, o) {
      const w = x();
      w.isSlow ? u(w.details) : l && l > 2500 ? u(`Latency ~${l}ms`) : c();
    } else
      d();
  }, R = () => {
    d();
  }, L = () => {
    m(!1);
  }, M = () => {
    document.visibilityState === "visible" && m(!0);
  };
  return {
    status: a,
    isOffline: n,
    isSlow: t,
    isRestored: i,
    isVisible: e,
    isRetrying: D,
    isDismissed: k,
    networkSpeedDetails: V,
    lastMeasuredLatency: B,
    probeConnectivity: O,
    checkNetworkStatus: m,
    retryConnection: N,
    dismiss: r,
    startListeners: () => {
      if (typeof window > "u") return;
      window.addEventListener("online", C), window.addEventListener("offline", R), document.addEventListener("visibilitychange", M);
      const o = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      o && o.addEventListener && o.addEventListener("change", L), navigator.onLine ? m(!0) : d(), S || (S = setInterval(() => {
        document.visibilityState === "visible" && m(!0);
      }, 4e4));
    },
    stopListeners: () => {
      if (typeof window > "u") return;
      window.removeEventListener("online", C), window.removeEventListener("offline", R), document.removeEventListener("visibilitychange", M);
      const o = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      o && o.removeEventListener && o.removeEventListener("change", L), S && (clearInterval(S), S = null), y && (clearTimeout(y), y = null);
    }
  };
}
const Q = (n, t) => {
  const i = n.__vccOpts || n;
  for (const [e, r] of t)
    i[e] = r;
  return i;
}, X = {
  name: "NetworkStatusBanner",
  props: {
    position: {
      type: String,
      default: "top",
      validator: (n) => ["top", "bottom", "floating-top", "floating-bottom"].includes(n)
    },
    teleportTo: {
      type: String,
      default: "body"
    },
    showRetry: {
      type: Boolean,
      default: !0
    },
    showDismiss: {
      type: Boolean,
      default: !0
    },
    showBadge: {
      type: Boolean,
      default: !0
    },
    showSlowWarning: {
      type: Boolean,
      default: !0
    },
    offlineTitle: {
      type: String,
      default: "You are currently offline."
    },
    offlineMessage: {
      type: String,
      default: "Changes may not be saved until reconnected."
    },
    slowTitle: {
      type: String,
      default: "Slow connection detected."
    },
    slowMessage: {
      type: String,
      default: "Syncing and downloads may take longer."
    },
    restoredTitle: {
      type: String,
      default: "Back online!"
    },
    restoredMessage: {
      type: String,
      default: "Your internet connection has been restored."
    },
    retryText: {
      type: String,
      default: "Retry Now"
    },
    retryingText: {
      type: String,
      default: "Checking..."
    },
    dismissAriaLabel: {
      type: String,
      default: "Dismiss network alert"
    }
  },
  emits: ["status-change", "retry", "dismiss"],
  setup(n, { emit: t }) {
    const {
      status: i,
      isOffline: e,
      isSlow: r,
      isRestored: c,
      isVisible: d,
      isRetrying: u,
      networkSpeedDetails: E,
      retryConnection: m,
      dismiss: N,
      startListeners: C,
      stopListeners: R
    } = K();
    P(() => {
      C();
    }), q(() => {
      R();
    }), J(i, (b, j) => {
      t("status-change", { current: b, previous: j });
    });
    const L = f(() => !(!d.value || !n.showSlowWarning && r.value)), M = f(() => n.position.startsWith("floating")), z = f(() => [
      `network-banner--pos-${n.position}`,
      {
        "network-banner--offline": e.value,
        "network-banner--slow": r.value,
        "network-banner--restored": c.value,
        "network-banner--floating": M.value
      }
    ]), A = f(() => n.position.includes("bottom") ? "network-banner-slide-up" : "network-banner-slide-down"), o = f(() => e.value ? n.offlineTitle : r.value ? n.slowTitle : c.value ? n.restoredTitle : ""), l = f(() => e.value ? n.offlineMessage : r.value ? n.slowMessage : c.value ? n.restoredMessage : "");
    return {
      status: i,
      isOffline: e,
      isSlow: r,
      isRestored: c,
      effectiveVisible: L,
      isRetrying: u,
      networkSpeedDetails: E,
      bannerClass: z,
      transitionName: A,
      bannerTitle: o,
      bannerMessage: l,
      handleRetry: async () => {
        t("retry"), await m();
      },
      handleDismiss: () => {
        N(), t("dismiss");
      }
    };
  }
}, Z = { class: "network-banner__container" }, $ = { class: "network-banner__content" }, ee = {
  key: 0,
  class: "network-banner__icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, ne = {
  key: 1,
  class: "network-banner__icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, te = {
  key: 2,
  class: "network-banner__icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "aria-hidden": "true"
}, ie = { class: "network-banner__text-wrap" }, oe = { class: "network-banner__title" }, se = { class: "network-banner__message" }, re = { class: "network-banner__badge" }, ae = { class: "network-banner__actions" }, le = ["disabled"], de = {
  key: 0,
  class: "network-banner__spinner",
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": "true"
}, ce = {
  key: 1,
  class: "network-banner__btn-icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "aria-hidden": "true"
}, fe = ["aria-label"];
function ue(n, t, i, e, r, c) {
  return g(), H(U, { to: i.teleportTo }, [
    W(Y, { name: e.transitionName }, {
      default: F(() => [
        e.effectiveVisible ? (g(), h("aside", {
          key: 0,
          role: "alert",
          "aria-live": "assertive",
          class: G(["network-banner", e.bannerClass])
        }, [
          v(n.$slots, "default", {
            status: e.status,
            isOffline: e.isOffline,
            isSlow: e.isSlow,
            isRestored: e.isRestored,
            isRetrying: e.isRetrying,
            networkSpeedDetails: e.networkSpeedDetails,
            title: e.bannerTitle,
            message: e.bannerMessage,
            retry: e.handleRetry,
            dismiss: e.handleDismiss
          }, () => [
            s("div", Z, [
              s("div", $, [
                v(n.$slots, "icon", {
                  status: e.status,
                  isOffline: e.isOffline,
                  isSlow: e.isSlow,
                  isRestored: e.isRestored
                }, () => [
                  e.isOffline ? (g(), h("svg", ee, [...t[2] || (t[2] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 3l18 18M10.584 10.587a6 6 0 00-4.084 1.713M8.535 5.5A12.07 12.07 0 0112 5c3.18 0 6.07 1.24 8.214 3.268m-2.128 2.13A8.006 8.006 0 0012 9c-.83 0-1.63.125-2.383.359M1.42 9a16 16 0 014.773-3.23M12 20h.01"
                    }, null, -1)
                  ])])) : e.isSlow ? (g(), h("svg", ne, [...t[3] || (t[3] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    }, null, -1)
                  ])])) : e.isRestored ? (g(), h("svg", te, [...t[4] || (t[4] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    }, null, -1)
                  ])])) : _("", !0)
                ], !0),
                s("div", ie, [
                  v(n.$slots, "title", {
                    status: e.status,
                    title: e.bannerTitle
                  }, () => [
                    s("span", oe, p(e.bannerTitle), 1)
                  ], !0),
                  v(n.$slots, "message", {
                    status: e.status,
                    message: e.bannerMessage
                  }, () => [
                    s("span", se, p(e.bannerMessage), 1)
                  ], !0),
                  i.showBadge && e.isSlow && e.networkSpeedDetails ? v(n.$slots, "badge", { details: e.networkSpeedDetails }, () => [
                    s("span", re, p(e.networkSpeedDetails), 1)
                  ], !0, 0) : _("", !0)
                ])
              ]),
              s("div", ae, [
                v(n.$slots, "actions", {
                  isOffline: e.isOffline,
                  isRetrying: e.isRetrying,
                  retry: e.handleRetry,
                  dismiss: e.handleDismiss
                }, () => [
                  i.showRetry && e.isOffline ? v(n.$slots, "retry-btn", {
                    isRetrying: e.isRetrying,
                    retry: e.handleRetry
                  }, () => [
                    s("button", {
                      type: "button",
                      class: "network-banner__btn-retry",
                      disabled: e.isRetrying,
                      onClick: t[0] || (t[0] = (...d) => e.handleRetry && e.handleRetry(...d))
                    }, [
                      e.isRetrying ? (g(), h("svg", de, [...t[5] || (t[5] = [
                        s("circle", {
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          "stroke-width": "3",
                          class: "network-banner__spinner-track"
                        }, null, -1),
                        s("path", {
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, null, -1)
                      ])])) : (g(), h("svg", ce, [...t[6] || (t[6] = [
                        s("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        }, null, -1)
                      ])])),
                      s("span", null, p(e.isRetrying ? i.retryingText : i.retryText), 1)
                    ], 8, le)
                  ], !0, 0) : _("", !0),
                  i.showDismiss ? v(n.$slots, "dismiss-btn", { dismiss: e.handleDismiss }, () => [
                    s("button", {
                      type: "button",
                      class: "network-banner__btn-dismiss",
                      "aria-label": i.dismissAriaLabel,
                      onClick: t[1] || (t[1] = (...d) => e.handleDismiss && e.handleDismiss(...d))
                    }, [...t[7] || (t[7] = [
                      s("svg", {
                        class: "network-banner__btn-icon",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2.5",
                        "aria-hidden": "true"
                      }, [
                        s("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M6 18L18 6M6 6l12 12"
                        })
                      ], -1)
                    ])], 8, fe)
                  ], !0, 1) : _("", !0)
                ], !0)
              ])
            ])
          ], !0)
        ], 2)) : _("", !0)
      ]),
      _: 3
    }, 8, ["name"])
  ], 8, ["to"]);
}
const we = /* @__PURE__ */ Q(X, [["render", ue], ["__scopeId", "data-v-2c32c4a6"]]), ye = {
  install(n) {
    n.component("NetworkStatusBanner", we);
  }
};
export {
  we as NetworkStatusBanner,
  ye as default,
  O as probeConnectivity,
  K as useNetworkStatus
};
