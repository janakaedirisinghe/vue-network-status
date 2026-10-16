import { ref as p, computed as y, openBlock as d, createBlock as z, Teleport as I, createVNode as j, Transition as A, withCtx as H, createElementBlock as v, normalizeClass as U, createElementVNode as i, createCommentVNode as L, toDisplayString as T, onMounted as Y, onUnmounted as G } from "vue";
const r = p("online"), b = p(!1), M = p(!1), N = p(""), E = p(null);
let w = null, _ = null;
async function B(t = 3500) {
  const n = new AbortController(), s = setTimeout(() => n.abort(), t), e = performance.now(), a = [
    `https://1.1.1.1/cdn-cgi/trace?_t=${Date.now()}_${Math.random()}`,
    `https://www.google.com/favicon.ico?_t=${Date.now()}_${Math.random()}`
  ];
  for (const u of a)
    try {
      return await fetch(u, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
        signal: n.signal
      }), clearTimeout(s), { online: !0, latency: Math.round(performance.now() - e) };
    } catch {
      continue;
    }
  return clearTimeout(s), { online: !1, latency: null };
}
function D() {
  if (typeof navigator > "u") return { isSlow: !1, details: "" };
  const t = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (t) {
    const n = t.effectiveType === "slow-2g" || t.effectiveType === "2g", s = typeof t.rtt == "number" && t.rtt > 1600, e = typeof t.downlink == "number" && t.downlink > 0 && t.downlink < 0.65;
    if (n || s || e) {
      const a = [];
      return t.effectiveType && a.push(t.effectiveType.toUpperCase()), typeof t.downlink == "number" && t.downlink > 0 && a.push(`${t.downlink} Mbps`), typeof t.rtt == "number" && t.rtt > 0 && a.push(`${t.rtt}ms RTT`), { isSlow: !0, details: a.join(" · ") };
    }
  }
  return { isSlow: !1, details: "" };
}
function P() {
  const t = y(() => r.value === "offline"), n = y(() => r.value === "slow"), s = y(() => r.value === "restored"), e = y(() => !b.value && r.value !== "online"), a = () => {
    b.value = !0;
  }, u = () => {
    w && clearTimeout(w), r.value = "restored", b.value = !1, w = setTimeout(() => {
      r.value === "restored" && (r.value = "online");
    }, 3e3);
  }, l = () => {
    w && clearTimeout(w), r.value = "offline", b.value = !1;
  }, f = (o = "") => {
    r.value !== "offline" && (r.value = "slow", N.value = o, b.value = !1);
  }, x = (o = !1) => {
    o ? u() : (r.value = "online", N.value = "");
  }, k = async (o = !1) => {
    if (typeof navigator < "u" && !navigator.onLine) {
      l();
      return;
    }
    const c = D();
    if (o && r.value === "offline")
      return;
    const m = r.value === "offline", { online: V, latency: S } = await B(3500);
    if (!V) {
      l();
      return;
    }
    E.value = S, c.isSlow ? f(c.details) : S && S > 2500 ? f(`Latency ~${S}ms`) : x(m);
  }, R = async () => {
    if (!M.value) {
      M.value = !0;
      try {
        const { online: o, latency: c } = await B(3500);
        if (E.value = c, !o)
          r.value = "offline", b.value = !1;
        else {
          const m = D();
          m.isSlow ? f(m.details) : c && c > 2500 ? f(`Latency ~${c}ms`) : u();
        }
      } finally {
        M.value = !1;
      }
    }
  }, h = async () => {
    r.value;
    const { online: o, latency: c } = await B(3500);
    if (E.value = c, o) {
      const m = D();
      m.isSlow ? f(m.details) : c && c > 2500 ? f(`Latency ~${c}ms`) : u();
    } else
      l();
  }, g = () => {
    l();
  }, C = () => {
    k(!1);
  }, O = () => {
    document.visibilityState === "visible" && k(!0);
  };
  return {
    status: r,
    isOffline: t,
    isSlow: n,
    isRestored: s,
    isVisible: e,
    isRetrying: M,
    isDismissed: b,
    networkSpeedDetails: N,
    lastMeasuredLatency: E,
    probeConnectivity: B,
    checkNetworkStatus: k,
    retryConnection: R,
    dismiss: a,
    startListeners: () => {
      if (typeof window > "u") return;
      window.addEventListener("online", h), window.addEventListener("offline", g), document.addEventListener("visibilitychange", O);
      const o = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      o && o.addEventListener && o.addEventListener("change", C), navigator.onLine ? k(!0) : l(), _ || (_ = setInterval(() => {
        document.visibilityState === "visible" && k(!0);
      }, 4e4));
    },
    stopListeners: () => {
      if (typeof window > "u") return;
      window.removeEventListener("online", h), window.removeEventListener("offline", g), document.removeEventListener("visibilitychange", O);
      const o = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      o && o.removeEventListener && o.removeEventListener("change", C), _ && (clearInterval(_), _ = null), w && (clearTimeout(w), w = null);
    }
  };
}
const q = (t, n) => {
  const s = t.__vccOpts || t;
  for (const [e, a] of n)
    s[e] = a;
  return s;
}, F = {
  name: "NetworkStatusBanner",
  setup() {
    const {
      status: t,
      isOffline: n,
      isSlow: s,
      isRestored: e,
      isVisible: a,
      isRetrying: u,
      networkSpeedDetails: l,
      retryConnection: f,
      dismiss: x,
      startListeners: k,
      stopListeners: R
    } = P();
    Y(() => {
      k();
    }), G(() => {
      R();
    });
    const h = y(() => ({
      "network-banner--offline": n.value,
      "network-banner--slow": s.value,
      "network-banner--restored": e.value
    })), g = y(() => n.value ? "You are currently offline." : s.value ? "Slow connection detected." : e.value ? "Back online!" : ""), C = y(() => n.value ? "Changes may not be saved until reconnected." : s.value ? "Syncing and downloads may take longer." : e.value ? "Your internet connection has been restored." : "");
    return {
      status: t,
      isOffline: n,
      isSlow: s,
      isRestored: e,
      isVisible: a,
      isRetrying: u,
      networkSpeedDetails: l,
      bannerClass: h,
      bannerTitle: g,
      bannerMessage: C,
      retryConnection: f,
      dismiss: x
    };
  }
}, J = { class: "network-banner__container" }, K = { class: "network-banner__content" }, Q = {
  key: 0,
  class: "network-banner__icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, W = {
  key: 1,
  class: "network-banner__icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, X = {
  key: 2,
  class: "network-banner__icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "aria-hidden": "true"
}, Z = { class: "network-banner__text-wrap" }, $ = { class: "network-banner__title" }, ee = { class: "network-banner__message" }, ne = {
  key: 0,
  class: "network-banner__badge"
}, te = { class: "network-banner__actions" }, oe = ["disabled"], ie = {
  key: 0,
  class: "network-banner__spinner",
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": "true"
}, re = {
  key: 1,
  class: "network-banner__btn-icon",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "aria-hidden": "true"
};
function se(t, n, s, e, a, u) {
  return d(), z(I, { to: "body" }, [
    j(A, { name: "network-banner-slide" }, {
      default: H(() => [
        e.isVisible ? (d(), v("aside", {
          key: 0,
          role: "alert",
          "aria-live": "assertive",
          class: U(["network-banner", e.bannerClass])
        }, [
          i("div", J, [
            i("div", K, [
              e.isOffline ? (d(), v("svg", Q, [...n[2] || (n[2] = [
                i("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M3 3l18 18M10.584 10.587a6 6 0 00-4.084 1.713M8.535 5.5A12.07 12.07 0 0112 5c3.18 0 6.07 1.24 8.214 3.268m-2.128 2.13A8.006 8.006 0 0012 9c-.83 0-1.63.125-2.383.359M1.42 9a16 16 0 014.773-3.23M12 20h.01"
                }, null, -1)
              ])])) : e.isSlow ? (d(), v("svg", W, [...n[3] || (n[3] = [
                i("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                }, null, -1)
              ])])) : e.isRestored ? (d(), v("svg", X, [...n[4] || (n[4] = [
                i("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                }, null, -1)
              ])])) : L("", !0),
              i("div", Z, [
                i("span", $, T(e.bannerTitle), 1),
                i("span", ee, T(e.bannerMessage), 1),
                e.isSlow && e.networkSpeedDetails ? (d(), v("span", ne, T(e.networkSpeedDetails), 1)) : L("", !0)
              ])
            ]),
            i("div", te, [
              e.isOffline ? (d(), v("button", {
                key: 0,
                type: "button",
                class: "network-banner__btn-retry",
                disabled: e.isRetrying,
                onClick: n[0] || (n[0] = (...l) => e.retryConnection && e.retryConnection(...l))
              }, [
                e.isRetrying ? (d(), v("svg", ie, [...n[5] || (n[5] = [
                  i("circle", {
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "3",
                    class: "network-banner__spinner-track"
                  }, null, -1),
                  i("path", {
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  }, null, -1)
                ])])) : (d(), v("svg", re, [...n[6] || (n[6] = [
                  i("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  }, null, -1)
                ])])),
                i("span", null, T(e.isRetrying ? "Checking..." : "Retry Now"), 1)
              ], 8, oe)) : L("", !0),
              i("button", {
                type: "button",
                class: "network-banner__btn-dismiss",
                "aria-label": "Dismiss network alert",
                onClick: n[1] || (n[1] = (...l) => e.dismiss && e.dismiss(...l))
              }, [...n[7] || (n[7] = [
                i("svg", {
                  class: "network-banner__btn-icon",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "stroke-width": "2.5",
                  "aria-hidden": "true"
                }, [
                  i("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M6 18L18 6M6 6l12 12"
                  })
                ], -1)
              ])])
            ])
          ])
        ], 2)) : L("", !0)
      ]),
      _: 1
    })
  ]);
}
const ae = /* @__PURE__ */ q(F, [["render", se], ["__scopeId", "data-v-fb817b04"]]), ue = {
  install(t) {
    t.component("NetworkStatusBanner", ae);
  }
};
export {
  ae as NetworkStatusBanner,
  ue as default,
  B as probeConnectivity,
  P as useNetworkStatus
};
