(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$1 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports$1) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports$1.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports$1.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports$1.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports$1.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports$1.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports$1.unstable_now());
    }, b);
  }
  exports$1.unstable_IdlePriority = 5;
  exports$1.unstable_ImmediatePriority = 1;
  exports$1.unstable_LowPriority = 4;
  exports$1.unstable_NormalPriority = 3;
  exports$1.unstable_Profiling = null;
  exports$1.unstable_UserBlockingPriority = 2;
  exports$1.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports$1.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports$1.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports$1.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports$1.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports$1.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_pauseExecution = function() {
  };
  exports$1.unstable_requestPaint = function() {
  };
  exports$1.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_scheduleCallback = function(a, b, c) {
    var d = exports$1.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports$1.unstable_shouldYield = M2;
  exports$1.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
function Landing({ onEnter }) {
  const [phase, setPhase] = reactExports.useState("in");
  reactExports.useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), 2800);
    const t2 = setTimeout(() => onEnter(), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#0B0C1A",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.7s ease",
    opacity: phase === "out" ? 0 : 1
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes starRise {
          from { opacity:0; transform:scale(0.5) rotate(-15deg); }
          to   { opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes wordIn {
          from { opacity:0; transform:translateY(20px); letter-spacing: 8px; }
          to   { opacity:1; transform:translateY(0); letter-spacing: -1px; }
        }
        @keyframes tagIn {
          from { opacity:0; }
          to   { opacity:0.5; }
        }
        @keyframes glowRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,200,66,0.0), 0 0 40px rgba(245,200,66,0.15); }
          50%       { box-shadow: 0 0 0 18px rgba(245,200,66,0.0), 0 0 80px rgba(245,200,66,0.3); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .sachi-logo-icon {
          animation: starRise 0.8s cubic-bezier(0.34,1.56,0.64,1) both, glowRing 2.5s ease-in-out 0.8s infinite;
        }
        .sachi-word {
          animation: wordIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both;
        }
        .sachi-tag {
          animation: tagIn 1s ease 1.2s both;
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        className: "sachi-logo-icon",
        src: "/sachi-icon-v4.png",
        alt: "Sachi",
        style: {
          width: 96,
          height: 96,
          borderRadius: 28,
          marginBottom: 32,
          filter: "drop-shadow(0 0 20px rgba(245,200,66,0.4))"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sachi-word", style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontSize: 62,
      fontWeight: 900,
      lineHeight: 1,
      background: "linear-gradient(135deg, #F5C842 0%, #FFD580 40%, #FF9500 100%)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: -1,
      animation: "shimmer 3s linear 1s infinite"
    }, children: "sachi" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sachi-tag", style: {
      marginTop: 18,
      color: "rgba(255,255,255,0.4)",
      fontSize: 13,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontWeight: 500
    }, children: "Share Everything" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sachi-tag", style: { position: "absolute", bottom: 48, display: "flex", gap: 6 }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: i === 0 ? 20 : 6,
      height: 6,
      borderRadius: 99,
      background: i === 0 ? "#F5C842" : "rgba(255,255,255,0.15)",
      transition: "all 0.3s"
    } }, i)) })
  ] });
}
const APP_ID$1 = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL$1 = "https://sachi-c7f0261c.base44.app/api";
let sessionToken = null;
function setToken(t2) {
  sessionToken = t2;
  localStorage.setItem("sachi_token", t2);
}
function getToken() {
  return sessionToken || localStorage.getItem("sachi_token");
}
function clearToken() {
  sessionToken = null;
  localStorage.removeItem("sachi_token");
  localStorage.removeItem("sachi_user");
}
async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL$1}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : void 0
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) throw new Error(data.message || data.detail || data.error || `Error ${res.status}`);
  return data;
}
const auth = {
  async signIn(email, password) {
    const data = await request("POST", `/apps/${APP_ID$1}/auth/login`, { email, password });
    const token = data.access_token || data.token;
    if (token) setToken(token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async signUp(email, password, fullName) {
    return request("POST", `/apps/${APP_ID$1}/auth/register`, { email, password, full_name: fullName });
  },
  async verifyOtp(email, otpCode) {
    const data = await request("POST", `/apps/${APP_ID$1}/auth/verify-otp`, { email, otp_code: otpCode });
    const token = data.access_token || data.token;
    if (token) setToken(token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async resendOtp(email) {
    return request("POST", `/apps/${APP_ID$1}/auth/resend-otp`, { email });
  },
  getUser() {
    const u2 = localStorage.getItem("sachi_user");
    return u2 ? JSON.parse(u2) : null;
  },
  async forgotPassword(email) {
    return request("POST", `/apps/${APP_ID$1}/auth/reset-password-request`, { email });
  },
  async resetPassword(email, resetToken, newPassword) {
    return request("POST", `/apps/${APP_ID$1}/auth/reset-password`, {
      reset_token: resetToken,
      new_password: newPassword
    });
  },
  signOut() {
    clearToken();
  }
};
const videos = {
  async list(limit = 30, skip = 0) {
    return request("GET", `/apps/${APP_ID$1}/entities/SachiVideo?sort=-created_date&limit=${limit}&skip=${skip}`);
  },
  async create(data) {
    return request("POST", `/apps/${APP_ID$1}/entities/SachiVideo`, data);
  },
  async update(id2, data) {
    return request("PUT", `/apps/${APP_ID$1}/entities/SachiVideo/${id2}`, data);
  },
  async myVideos(userId, userEmail) {
    const res1 = await request("GET", `/apps/${APP_ID$1}/entities/SachiVideo?user_id=${userId}&limit=500&sort=-created_date`);
    const items1 = (res1 == null ? void 0 : res1.items) || (Array.isArray(res1) ? res1 : []);
    let items2 = [];
    if (userEmail) {
      const res2 = await request("GET", `/apps/${APP_ID$1}/entities/SachiVideo?created_by=${encodeURIComponent(userEmail)}&limit=500&sort=-created_date`);
      items2 = (res2 == null ? void 0 : res2.items) || (Array.isArray(res2) ? res2 : []);
    }
    const seen = /* @__PURE__ */ new Set();
    return [...items1, ...items2].filter((v2) => {
      if (seen.has(v2.id)) return false;
      seen.add(v2.id);
      return !v2.is_archived;
    });
  },
  async byUser(userId) {
    let all = [];
    let skip = 0;
    const limit = 100;
    while (true) {
      const res = await request("GET", `/apps/${APP_ID$1}/entities/SachiVideo?limit=${limit}&skip=${skip}&sort=-created_date`);
      const items = Array.isArray(res) ? res : (res == null ? void 0 : res.items) || [];
      all = all.concat(items);
      if (items.length < limit) break;
      skip += limit;
      if (skip > 500) break;
    }
    return all.filter((v2) => v2.user_id === userId && !v2.is_archived);
  },
  async delete(id2) {
    return request("DELETE", `/apps/${APP_ID$1}/entities/SachiVideo/${id2}`);
  }
};
const comments = {
  async list(videoId) {
    return request("GET", `/apps/${APP_ID$1}/entities/SachiComment?video_id=${videoId}&sort=created_date&limit=200`);
  },
  async create(data) {
    return request("POST", `/apps/${APP_ID$1}/entities/SachiComment`, data);
  },
  async update(id2, data) {
    return request("PUT", `/apps/${APP_ID$1}/entities/SachiComment/${id2}`, data);
  },
  async delete(id2) {
    return request("DELETE", `/apps/${APP_ID$1}/entities/SachiComment/${id2}`);
  }
};
async function uploadFile(file) {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(
    `https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/integration-endpoints/Core/UploadFile`,
    { method: "POST", headers, body: form }
  );
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (_) {
    throw new Error(`Upload error ${res.status}: ${text.slice(0, 100)}`);
  }
  if (!res.ok || data.error) throw new Error(data.error || data.message || "Upload failed");
  return data.file_url;
}
const follows = {
  async follow(follower_id, follower_username, following_id, following_username) {
    return request("POST", `/apps/${APP_ID$1}/entities/Follow`, {
      follower_id,
      follower_username,
      following_id,
      following_username
    });
  },
  async unfollow(recordId) {
    return request("DELETE", `/apps/${APP_ID$1}/entities/Follow/${recordId}`);
  },
  async getFollowing(follower_id) {
    return request("GET", `/apps/${APP_ID$1}/entities/Follow?follower_id=${follower_id}&limit=500`);
  },
  async getFollowers(following_id) {
    return request("GET", `/apps/${APP_ID$1}/entities/Follow?following_id=${following_id}&limit=500`);
  }
};
const reports = {
  async create(data) {
    return request("POST", `/apps/${APP_ID$1}/entities/SachiReport`, data);
  },
  async list() {
    return request("GET", `/apps/${APP_ID$1}/entities/SachiReport?sort=-created_date&limit=200`);
  },
  async update(id2, data) {
    return request("PUT", `/apps/${APP_ID$1}/entities/SachiReport/${id2}`, data);
  }
};
const bookmarks = {
  async add(user_id, username, video_id) {
    return request("POST", `/apps/${APP_ID$1}/entities/SachiBookmark`, { user_id, username, video_id });
  },
  async remove(id2) {
    return request("DELETE", `/apps/${APP_ID$1}/entities/SachiBookmark/${id2}`);
  },
  async getByUser(user_id) {
    return request("GET", `/apps/${APP_ID$1}/entities/SachiBookmark?user_id=${user_id}&limit=500`);
  }
};
const blocks = {
  async block(blocker_id, blocker_username, blocked_id, blocked_username) {
    return request("POST", `/apps/${APP_ID$1}/entities/SachiBlock`, { blocker_id, blocker_username, blocked_id, blocked_username });
  },
  async unblock(id2) {
    return request("DELETE", `/apps/${APP_ID$1}/entities/SachiBlock/${id2}`);
  },
  async getBlockedByUser(blocker_id) {
    return request("GET", `/apps/${APP_ID$1}/entities/SachiBlock?blocker_id=${blocker_id}&limit=500`);
  }
};
const interests = {
  async get(userId) {
    try {
      const res = await request("GET", `/apps/${APP_ID$1}/entities/UserInterest?user_id=${userId}&limit=100`);
      return Array.isArray(res) ? res : (res == null ? void 0 : res.items) || [];
    } catch {
      return [];
    }
  },
  async signal(userId, hashtags, points) {
    if (!userId || !(hashtags == null ? void 0 : hashtags.length)) return;
    const existing = await this.get(userId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    for (const tag of hashtags) {
      const clean = tag.replace(/^#/, "").toLowerCase().trim();
      if (!clean) continue;
      const entry = existing.find((e) => e.hashtag === clean);
      if (entry) {
        const decayed = Math.max(0, (entry.score || 0) * 0.95);
        await request("PUT", `/apps/${APP_ID$1}/entities/UserInterest/${entry.id}`, {
          score: decayed + points,
          last_updated: now
        }).catch(() => {
        });
      } else {
        await request("POST", `/apps/${APP_ID$1}/entities/UserInterest`, {
          user_id: userId,
          hashtag: clean,
          score: points,
          last_updated: now
        }).catch(() => {
        });
      }
    }
  },
  async rankFeed(userId, videoList) {
    const byDate = [...videoList].sort(
      (a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()
    );
    if (!userId) return byDate;
    const userInterests = await this.get(userId);
    if (!userInterests.length) return byDate;
    const scoreMap = {};
    for (const i of userInterests) {
      scoreMap[i.hashtag.toLowerCase()] = i.score || 0;
    }
    const totalSignal = Object.values(scoreMap).reduce((s, v2) => s + v2, 0);
    if (totalSignal < 3) return byDate;
    const scored = byDate.map((v2) => {
      const tags = (v2.hashtags || []).map((t2) => t2.replace(/^#/, "").toLowerCase());
      let relevance = 0;
      for (const tag of tags) relevance += scoreMap[tag] || 0;
      return { ...v2, _relevance: relevance };
    });
    const times = scored.map((v2) => new Date(v2.created_date || 0).getTime());
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    const timeRange = maxT - minT || 1;
    const maxRel = Math.max(...scored.map((v2) => v2._relevance), 1);
    scored.sort((a, b) => {
      const recencyA = (new Date(a.created_date || 0).getTime() - minT) / timeRange;
      const recencyB = (new Date(b.created_date || 0).getTime() - minT) / timeRange;
      const relA = a._relevance / maxRel;
      const relB = b._relevance / maxRel;
      const scoreA = relA * 0.3 + recencyA * 0.7;
      const scoreB = relB * 0.3 + recencyB * 0.7;
      return scoreB - scoreA;
    });
    return scored;
  }
};
const likes = {
  async add(video_id, user_id, username, display_name, avatar_url) {
    return request("POST", `/apps/${APP_ID$1}/entities/SachiLike`, {
      video_id,
      user_id,
      username,
      display_name,
      avatar_url
    });
  },
  async remove(id2) {
    return request("DELETE", `/apps/${APP_ID$1}/entities/SachiLike/${id2}`);
  },
  async getByVideo(video_id) {
    return request("GET", `/apps/${APP_ID$1}/entities/SachiLike?video_id=${video_id}&limit=500`);
  },
  async checkUserLiked(video_id, user_id) {
    const res = await request("GET", `/apps/${APP_ID$1}/entities/SachiLike?video_id=${video_id}&user_id=${user_id}&limit=1`);
    const items = Array.isArray(res) ? res : (res == null ? void 0 : res.items) || [];
    return items.length > 0 ? items[0] : null;
  }
};
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Bolivia",
  "Bosnia",
  "Brazil",
  "Bulgaria",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Ethiopia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Guatemala",
  "Haiti",
  "Honduras",
  "Hungary",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Myanmar",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "North Korea",
  "Norway",
  "Oman",
  "Pakistan",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Singapore",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zimbabwe"
];
const GOOGLE_CLIENT_ID = "124061688969-7ebbn8gph1ej84dli790clptp32gosdt.apps.googleusercontent.com";
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";
async function lookupSachiUser(email) {
  try {
    const res = await fetch(
      `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(email)}&limit=5`,
      { headers: { "Content-Type": "application/json" } }
    );
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data == null ? void 0 : data.items) || [];
    return items.find((u2) => u2.email === email) || null;
  } catch {
    return null;
  }
}
function buildSessionUser(found, payload) {
  return {
    id: found.id,
    email: found.email,
    full_name: found.display_name || (payload == null ? void 0 : payload.name) || found.email,
    avatar_url: found.avatar_url || (payload == null ? void 0 : payload.picture) || "",
    username: found.username || found.email.split("@")[0],
    _google: true,
    _sachiProfileId: found.id
  };
}
function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
function buildGoogleAuthUrl() {
  const origin = window.location.origin;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: origin,
    response_type: "id_token",
    scope: "openid email profile",
    nonce: Math.random().toString(36).slice(2),
    prompt: "select_account"
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
async function handleGoogleRedirectCallback() {
  const hash = window.location.hash;
  if (!hash || !hash.includes("id_token=")) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const idToken = params.get("id_token");
  if (!idToken) return null;
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  const payload = decodeJwt(idToken);
  if (!(payload == null ? void 0 : payload.email)) return null;
  localStorage.setItem("sachi_pending_google", JSON.stringify(payload));
  const found = await lookupSachiUser(payload.email);
  if (found) {
    const sessionUser = buildSessionUser(found, payload);
    localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
    localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
    localStorage.removeItem("sachi_pending_google");
    return { sessionUser, needsProfile: false };
  }
  return { payload, needsProfile: true };
}
function FinishStep({ googlePayload, onSuccess }) {
  const { email, name, picture } = googlePayload;
  const suggested = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  const [username, setUsername] = reactExports.useState(suggested);
  const [dob, setDob] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [is18, setIs18] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const inp = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(245,200,66,0.15)",
    borderRadius: 12,
    padding: "11px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    marginBottom: 10
  };
  const btn = {
    display: "block",
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(135deg,#F5C842,#FF9500)",
    border: "none",
    borderRadius: 14,
    color: "#0B0C1A",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 10
  };
  React.useEffect(() => {
    fetch("https://ipapi.co/json/").then((r2) => r2.json()).then((d) => {
      if (d.city && !city) setCity(d.city);
      if (d.country_name && !country) setCountry(d.country_name);
    }).catch(() => {
    });
  }, []);
  const handleFinish = async () => {
    if (!username.trim()) return setError("Please enter a username.");
    if (!dob) return setError("Please enter your birthday.");
    if (!is18) return setError("You must confirm you are 18 years or older.");
    const birthDate = new Date(dob);
    const today = /* @__PURE__ */ new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m2 = today.getMonth() - birthDate.getMonth();
    if (m2 < 0 || m2 === 0 && today.getDate() < birthDate.getDate()) age--;
    if (age < 13) return setError("You must be at least 13 years old to join Sachi.");
    setLoading(true);
    setError("");
    try {
      const created = await fetch(
        `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            username: username.trim().toLowerCase(),
            display_name: name || username.trim(),
            avatar_url: picture || "",
            is_verified: true,
            is_18_plus: true,
            status: "active",
            followers_count: 0,
            following_count: 0,
            videos_count: 0,
            location: city && country ? city + ", " + country : city || country || ""
          })
        }
      ).then((r2) => r2.json());
      localStorage.setItem("sachi_dob", dob);
      if (country) localStorage.setItem("sachi_country", country);
      if (city) localStorage.setItem("sachi_city", city);
      localStorage.removeItem("sachi_pending_google");
      const sessionUser = {
        id: created.id,
        email,
        full_name: name || username.trim(),
        avatar_url: picture || "",
        username: username.trim().toLowerCase(),
        _google: true,
        _sachiProfileId: created.id
      };
      localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
      localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
      onSuccess(sessionUser);
    } catch (e) {
      console.error(e);
      setError("Could not create your profile. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }, children: [
      picture && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: picture, style: { width: 72, height: 72, borderRadius: "50%", border: "3px solid #F5C842", marginBottom: 10 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 17 }, children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13 }, children: email }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(80,200,80,0.12)", border: "1px solid rgba(80,200,80,0.3)", borderRadius: 20, padding: "4px 14px", marginTop: 8, color: "#6fcf6f", fontSize: 12, fontWeight: 700 }, children: "✓ Verified with Google" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 13, marginBottom: 16 }, children: "Just a few more details to set up your profile:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: username,
        onChange: (e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()),
        placeholder: "Choose a username",
        style: inp,
        maxLength: 30
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "left", marginBottom: 4, color: "#888", fontSize: 12 }, children: [
      "Birthday ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff6b6b" }, children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: dob,
        onChange: (e) => setDob(e.target.value),
        type: "date",
        max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        style: { ...inp, colorScheme: "dark" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "left", marginBottom: 4, color: "#888", fontSize: 12 }, children: [
      "City ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888", fontSize: 11 }, children: "(optional)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: city,
        onChange: (e) => setCity(e.target.value),
        placeholder: "e.g. Sydney, Colombo, New York",
        style: inp,
        maxLength: 60
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "left", marginBottom: 4, color: "#888", fontSize: 12 }, children: [
      "Country ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888", fontSize: 11 }, children: "(optional)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        value: country,
        onChange: (e) => setCountry(e.target.value),
        style: { display: "block", width: "100%", boxSizing: "border-box", background: "#1a1b2e", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 12, padding: "14px 16px", color: country ? "#fff" : "#888", fontSize: 15, outline: "none", marginBottom: 12, cursor: "pointer" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", style: { background: "#1a1b2e", color: "#888" }, children: "🌍 Select your country" }),
          COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, style: { background: "#1a1b2e", color: "#fff" }, children: c }, c))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 16, cursor: "pointer", textAlign: "left" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked: is18,
          onChange: (e) => setIs18(e.target.checked),
          style: { width: 20, height: 20, accentColor: "#F5C842", flexShrink: 0 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ccc", fontSize: 14, fontWeight: 600 }, children: "I confirm I am 18 years or older" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", fontSize: 11, marginBottom: 14, lineHeight: 1.5 }, children: [
      "By joining you agree to our",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/terms", target: "_blank", style: { color: "#F5C842" }, children: "Terms" }),
      " &",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/privacy", target: "_blank", style: { color: "#F5C842" }, children: "Privacy Policy" }),
      "."
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff6b6b", fontSize: 13, marginBottom: 12 }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleFinish, disabled: loading, style: { ...btn, opacity: loading ? 0.7 : 1 }, children: loading ? "Setting up your profile…" : "Let's Go 🚀" })
  ] });
}
function AuthModal({ onClose, onSuccess }) {
  const pendingRaw = localStorage.getItem("sachi_pending_google");
  const pending = pendingRaw ? (() => {
    try {
      return JSON.parse(pendingRaw);
    } catch {
      return null;
    }
  })() : null;
  const [step, setStep] = reactExports.useState(pending ? "finish" : "signin");
  const [googlePayload, setGooglePayload] = reactExports.useState(pending || null);
  const [loading, setLoading] = reactExports.useState(false);
  const handleGoogleRedirect = () => {
    localStorage.setItem("sachi_auth_intent", "1");
    window.location.href = buildGoogleAuthUrl();
  };
  if (step === "finish" && googlePayload) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 3e3, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "relative",
        zIndex: 3001,
        background: "#12132A",
        borderRadius: 24,
        border: "1px solid rgba(245,200,66,0.1)",
        padding: "32px 24px",
        width: "100%",
        maxWidth: 380,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.8)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer", lineHeight: 1 }, children: "✕" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 24 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "🌸" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }, children: "Almost there!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FinishStep, { googlePayload, onSuccess })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 3e3, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "relative",
      zIndex: 3001,
      background: "#12132A",
      borderRadius: 24,
      border: "1px solid rgba(245,200,66,0.1)",
      padding: "32px 24px",
      width: "100%",
      maxWidth: 380,
      boxShadow: "0 24px 80px rgba(0,0,0,0.8)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer", lineHeight: 1 }, children: "✕" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 28 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 8 }, children: "🌸" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 800, fontSize: 24, letterSpacing: -0.5, marginBottom: 4 }, children: "Join Sachi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.45)", fontSize: 14 }, children: "Where truth meets community" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleGoogleRedirect,
          disabled: loading,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            width: "100%",
            padding: "15px 20px",
            background: "#fff",
            border: "none",
            borderRadius: 14,
            cursor: loading ? "wait" : "pointer",
            fontSize: 16,
            fontWeight: 700,
            color: "#1a1a2e",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
            marginBottom: 20
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 48 48", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M43.6 20.5H42V20H24v8h11.3C33.6 32.8 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.5-3.2-11.3-7.8l-6.5 5C9.6 39.5 16.4 44 24 44z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.4 4.4-4.5 5.8l6.2 5.2C41.2 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z" })
            ] }),
            "Continue with Google"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.2)", fontSize: 12, textAlign: "center", marginBottom: 20 }, children: "Free to join. No spam. No BS." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#444", fontSize: 11, textAlign: "center", lineHeight: 1.6 }, children: [
        "By continuing you agree to our",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/terms", target: "_blank", style: { color: "#F5C842" }, children: "Terms" }),
        " ",
        "&",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/privacy", target: "_blank", style: { color: "#F5C842" }, children: "Privacy Policy" }),
        "."
      ] })
    ] })
  ] });
}
function Terms() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#0f0f1a", minHeight: "100vh", padding: "32px 20px", color: "#ddd", fontFamily: "sans-serif", maxWidth: 700, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff6b6b", fontSize: 28, fontWeight: 900, marginBottom: 4 }, children: "📋 Terms of Service" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13, marginBottom: 28 }, children: "Last updated: April 1, 2026" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }, children: [
      "Welcome to ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "Sachi" }),
      ", a short-video sharing platform operated by ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "LDNA Consulting, New Providence, NJ 07974" }),
      ". By creating an account or using Sachi, you agree to these Terms of Service. Please read them carefully."
    ] }),
    [
      { title: "1. Eligibility", body: "You must be at least 18 years old to create an account and use Sachi. By registering, you confirm that you are 18 or older. We reserve the right to terminate accounts of users found to be under 18." },
      { title: "2. User Accounts", body: "You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate information when registering and to update it as needed. You are fully responsible for all activity that occurs under your account." },
      { title: "3. Content You Post", body: "You retain ownership of the content you upload. However, by posting on Sachi, you grant LDNA Consulting a non-exclusive, royalty-free, worldwide license to display, distribute, and promote your content within the platform. You are solely responsible for everything you post. You must not post content that is illegal, harassing, defamatory, or infringes on any third party's rights." },
      { title: "4. No Liability for Other Users' Content — YOU MUST READ AND AGREE", body: "Sachi is a user-generated content platform. We do NOT create, endorse, verify, or take responsibility for any content posted by other users. By creating an account, you expressly acknowledge and agree that Sachi and LDNA Consulting are NOT responsible or liable — directly or indirectly — for any content, videos, comments, images, or messages posted by other users. This includes content that is offensive, inaccurate, harmful, illegal, or objectionable. Your interactions with other users and any content you encounter are entirely at your own risk. If you see content that violates these Terms, you may report it using the in-app report feature." },
      { title: "5. Prohibited Content", body: "The following content is strictly prohibited: content involving minors in any sexual context, content that promotes violence or terrorism, content that infringes copyrights or trademarks, spam or misleading information, and any content that violates applicable law." },
      { title: "6. Content Moderation", body: "We reserve the right — but not the obligation — to review, remove, or restrict any content or account that we determine, in our sole discretion, violates these Terms or is harmful to our community." },
      { title: "7. Intellectual Property", body: "The Sachi name, logo, and platform design are the property of LDNA Consulting. You may not copy, reproduce, or use them without prior written permission." },
      { title: "8. Disclaimers", body: "Sachi is provided 'as is' without warranties of any kind. We do not guarantee uninterrupted service or that the platform will be error-free. We are not liable for any user-generated content." },
      { title: "9. Limitation of Liability", body: "To the maximum extent permitted by law, LDNA Consulting shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of Sachi." },
      { title: "10. Termination", body: "We may suspend or terminate your account at any time for violations of these Terms, without prior notice. You may also delete your account at any time." },
      { title: "11. Changes to Terms", body: "We may update these Terms from time to time. Continued use of Sachi after changes are posted constitutes your acceptance of the updated Terms." },
      { title: "12. Governing Law", body: "These Terms are governed by the laws of the State of New Jersey, United States, without regard to its conflict of law provisions." },
      { title: "13. Contact", body: "For questions about these Terms, contact us at: jaygnz27@gmail.com" }
    ].map(({ title, body }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 22 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff8e53", fontWeight: 800, fontSize: 15, marginBottom: 6 }, children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#bbb", fontSize: 14, lineHeight: 1.8, margin: 0 }, children: body })
    ] }, title)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", style: { color: "#ff6b6b", fontSize: 14, textDecoration: "none" }, children: "← Back to Sachi" }) })
  ] });
}
function Privacy() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#0f0f1a", minHeight: "100vh", padding: "32px 20px", color: "#ddd", fontFamily: "sans-serif", maxWidth: 700, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff6b6b", fontSize: 28, fontWeight: 900, marginBottom: 4 }, children: "🔒 Privacy Policy" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13, marginBottom: 28 }, children: "Last updated: April 1, 2026" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }, children: [
      "This Privacy Policy explains how ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "LDNA Consulting" }),
      ' ("we", "us", "our") collects, uses, and protects your personal information when you use ',
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "Sachi" }),
      "."
    ] }),
    [
      { title: "1. Information We Collect", body: "We collect information you provide when creating an account (name, email address, password), content you upload (videos, photos, captions), and usage data (device type, IP address, pages visited, interactions within the app)." },
      { title: "2. How We Use Your Information", body: "We use your information to: operate and improve the Sachi platform, authenticate your identity and secure your account, display your content to other users, send account-related notifications (e.g. email verification, password reset), and comply with legal obligations." },
      { title: "3. Data Sharing", body: "We do not sell your personal information to third parties. We may share data with trusted service providers who help us operate the platform (e.g. cloud storage, email delivery), only to the extent necessary. We may disclose information if required by law or to protect the rights, property, or safety of our users." },
      { title: "4. Cookies & Tracking", body: "Sachi uses local browser storage (localStorage) to maintain your login session. We do not use third-party advertising cookies. Basic analytics may be used to understand how the app is used, without identifying individual users." },
      { title: "5. Data Retention", body: "We retain your account data and content for as long as your account is active. If you delete your account, we will remove your personal information from our systems within 30 days, except where retention is required by law." },
      { title: "6. Your Rights", body: "You have the right to access, update, or delete your personal information at any time. You can update your profile within the app or contact us directly to request deletion of your account and data." },
      { title: "7. Children's Privacy", body: "Sachi is strictly intended for users aged 18 and older. We do not knowingly collect personal information from anyone under 18. If we discover that a user is under 18, their account will be terminated immediately." },
      { title: "8. Security", body: "We take reasonable technical and organizational measures to protect your data against unauthorized access, loss, or misuse. However, no online platform can guarantee absolute security." },
      { title: "9. Changes to This Policy", body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice in the app or via email. Continued use of Sachi after changes are posted means you accept the updated policy." },
      { title: "10. Contact Us", body: "If you have questions or concerns about this Privacy Policy, please contact us at: jaygnz27@gmail.com — LDNA Consulting, New Providence, NJ 07974" }
    ].map(({ title, body }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 22 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff8e53", fontWeight: 800, fontSize: 15, marginBottom: 6 }, children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#bbb", fontSize: 14, lineHeight: 1.8, margin: 0 }, children: body })
    ] }, title)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", style: { color: "#ff6b6b", fontSize: 14, textDecoration: "none" }, children: "← Back to Sachi" }) })
  ] });
}
function ChildSafety() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif", color: "#333", lineHeight: "1.7" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "#1a1a2e", borderBottom: "3px solid #F5C842", paddingBottom: "10px" }, children: "Child Safety Standards" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Last updated: April 8, 2026" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Sachi, operated by ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "LDNA Consulting" }),
      ", is committed to maintaining a safe platform and actively combating child sexual abuse and exploitation (CSAE)."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "1. Prohibited Content" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sachi strictly prohibits any content that sexually exploits minors, including child sexual abuse material (CSAM). Any such content is immediately removed and reported to the National Center for Missing & Exploited Children (NCMEC) and relevant law enforcement authorities." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "2. Age Restrictions" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sachi is intended for users aged 18 and older. Users must confirm their age during registration. Accounts found to belong to minors are immediately suspended." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "3. Content Moderation" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sachi employs both automated AI-based content detection and human moderation to identify and remove harmful content, including CSAM. Our moderation team reviews flagged content promptly." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "4. Reporting Mechanism" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Users can report any content they believe violates our child safety standards using the in-app report feature. Reports are reviewed within 24 hours." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "You may also report directly to: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:safety@sachistream.com", children: "safety@sachistream.com" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "5. CSAM Reporting" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Any discovered CSAM is immediately reported to the ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://www.missingkids.org/gethelpnow/cybertipline", target: "_blank", rel: "noopener noreferrer", children: "NCMEC CyberTipline" }),
      " and cooperating law enforcement agencies. We maintain a zero-tolerance policy."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "6. Designated Safety Contact" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Email:" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:jaygnz27@gmail.com", children: "jaygnz27@gmail.com" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Organization:" }),
      " LDNA Consulting"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "7. Compliance" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sachi complies with the PROTECT Our Children Act, COPPA, and all applicable federal and state laws regarding child safety online." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { marginTop: "40px", fontSize: "14px", color: "#666" }, children: [
      "© 2026 LDNA Consulting. | ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/privacy", children: "Privacy Policy" }),
      " | ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/terms", children: "Terms of Service" })
    ] })
  ] });
}
const CONTENT_TYPES = [
  "Short Videos",
  "Podcasts",
  "Live Streams",
  "News & Commentary",
  "Music",
  "Comedy",
  "Sports",
  "Fitness & Wellness",
  "Food & Lifestyle",
  "Tech & Gaming",
  "Education",
  "Other"
];
const FOLLOWER_OPTIONS = [
  "Just starting out",
  "Under 1K",
  "1K–10K",
  "10K–100K",
  "100K+"
];
const PERKS = [
  { icon: "🌸", title: "Founding Creator Badge", desc: "Permanent verified badge on your profile — shows you were here from day one." },
  { icon: "🎙️", title: "First Live Podcast Slot", desc: "Priority access to go live on Sachi Stream before the public launch." },
  { icon: "📣", title: "Featured in the Feed", desc: "Your content gets promoted to every new user during the first 30 days." },
  { icon: "🚫", title: "Zero Censorship — Ever", desc: "No shadowbanning. No algorithm suppression. No demonetisation risk." },
  { icon: "📊", title: "Early Analytics Access", desc: "Full creator dashboard before it's available to the public." },
  { icon: "💬", title: "Direct Line to the Team", desc: "Your feedback goes straight to the founders. You help shape this platform." }
];
function FoundingCreatorPage({ onBack }) {
  const [step, setStep] = reactExports.useState(1);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    content_type: "",
    social_links: "",
    follower_count: "",
    why_sachi: "",
    content_description: ""
  });
  const set = (k2, v2) => setForm((f2) => ({ ...f2, [k2]: v2 }));
  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.content_type || !form.why_sachi.trim()) {
      setError("Please fill in all required fields marked with *");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await request("POST", "/apps/69b2ee18a8e6fb58c7f0261c/entities/FoundingCreator", { ...form, status: "Pending" });
      setStep(3);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(245,200,66,0.2)",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box"
  };
  if (step === 3) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100dvh", background: "linear-gradient(160deg,#0B0C1A 0%,#12132B 60%,#1a0f2e 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", textAlign: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 80, marginBottom: 16 }, children: "🌸" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { color: "#F5C842", fontSize: 28, fontWeight: 800, margin: "0 0 12px" }, children: "You're In!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#ccc", fontSize: 16, maxWidth: 320, lineHeight: 1.6, margin: "0 0 8px" }, children: "Your application has been received. We'll review it and get back to you within 48 hours." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#888", fontSize: 14, maxWidth: 300, lineHeight: 1.5, margin: "0 0 32px" }, children: [
      "Welcome to the beginning of something real. ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F5C842" }, children: "Sachi means Truth" }),
      " — and you're one of the first to stand for it."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onBack,
        style: { background: "#F5C842", color: "#0B0C1A", border: "none", borderRadius: 14, padding: "14px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer" },
        children: "Back to Sachi Stream"
      }
    )
  ] });
  if (step === 2) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100dvh", background: "linear-gradient(160deg,#0B0C1A 0%,#12132B 100%)", paddingBottom: 40 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(245,200,66,0.15)", position: "sticky", top: 0, background: "#0B0C1A", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), style: { background: "none", border: "none", color: "#F5C842", fontSize: 22, cursor: "pointer", marginRight: 12, padding: 0 }, children: "←" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 800, fontSize: 17 }, children: "Founding Creator Application" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 12 }, children: "Takes about 3 minutes · 50 spots available" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "24px 20px", maxWidth: 480, margin: "0 auto" }, children: [
      [
        { label: "Full Name *", key: "full_name", type: "text", placeholder: "Your full name" },
        { label: "Email Address *", key: "email", type: "email", placeholder: "you@example.com" },
        { label: "Phone (optional)", key: "phone", type: "tel", placeholder: "+1 555-000-0000" },
        { label: "Location (City, Country)", key: "location", type: "text", placeholder: "e.g. New York, USA" },
        { label: "Your Social Media Links", key: "social_links", type: "text", placeholder: "Instagram, TikTok, YouTube, etc." }
      ].map(({ label, key, type, placeholder }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 18 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { color: "#ccc", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type,
            value: form[key],
            placeholder,
            onChange: (e) => set(key, e.target.value),
            style: inputStyle
          }
        )
      ] }, key)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 18 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { color: "#ccc", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }, children: "What type of content do you make? *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: CONTENT_TYPES.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => set("content_type", t2), style: {
          background: form.content_type === t2 ? "#F5C842" : "rgba(255,255,255,0.07)",
          color: form.content_type === t2 ? "#0B0C1A" : "#ccc",
          border: form.content_type === t2 ? "none" : "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "7px 14px",
          fontSize: 13,
          fontWeight: form.content_type === t2 ? 700 : 400,
          cursor: "pointer"
        }, children: t2 }, t2)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 18 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { color: "#ccc", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }, children: "Current audience size (all platforms)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: FOLLOWER_OPTIONS.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => set("follower_count", f2), style: {
          background: form.follower_count === f2 ? "#F5C842" : "rgba(255,255,255,0.07)",
          color: form.follower_count === f2 ? "#0B0C1A" : "#ccc",
          border: form.follower_count === f2 ? "none" : "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "7px 14px",
          fontSize: 13,
          fontWeight: form.follower_count === f2 ? 700 : 400,
          cursor: "pointer"
        }, children: f2 }, f2)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 18 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { color: "#ccc", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }, children: "Tell us about your content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: form.content_description,
            rows: 3,
            placeholder: "What do you create? Who's your audience? What's your style?",
            onChange: (e) => set("content_description", e.target.value),
            style: { ...inputStyle, resize: "none", fontFamily: "inherit" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 24 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { color: "#ccc", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }, children: "Why do you want to join Sachi? *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: form.why_sachi,
            rows: 4,
            placeholder: "What brought you here? What does 'truth in content' mean to you?",
            onChange: (e) => set("why_sachi", e.target.value),
            style: { ...inputStyle, resize: "none", fontFamily: "inherit" }
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#FF6B6B", fontSize: 14, marginBottom: 16, padding: "10px 14px", background: "rgba(255,107,107,0.1)", borderRadius: 10 }, children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: submit, disabled: loading, style: {
        width: "100%",
        background: loading ? "#555" : "linear-gradient(135deg,#F5C842,#e6a800)",
        color: "#0B0C1A",
        border: "none",
        borderRadius: 16,
        padding: "16px",
        fontSize: 17,
        fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer"
      }, children: loading ? "Submitting..." : "🌸 Submit My Application" })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100dvh", background: "linear-gradient(160deg,#0B0C1A 0%,#12132B 60%,#1a0f2e 100%)", overflowY: "auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "16px 20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onBack, style: { background: "none", border: "none", color: "#F5C842", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }, children: "← Back to Sachi" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "20px 24px 32px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 64, marginBottom: 12 }, children: "🌸" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "inline-block", background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 20, padding: "5px 16px", color: "#F5C842", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, marginBottom: 18, textTransform: "uppercase" }, children: "Limited — 50 Founding Spots" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: { color: "#fff", fontSize: 30, fontWeight: 900, margin: "0 0 14px", lineHeight: 1.2 }, children: [
        "Be the Voice of",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F5C842" }, children: "Something Real" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa", fontSize: 16, lineHeight: 1.65, maxWidth: 340, margin: "0 auto 28px" }, children: [
        "Sachi Stream launches ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "May 2026" }),
        ". We're the anti-TikTok — built for authentic creators who are done being censored, suppressed, and replaced by AI. We're looking for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "50 founding creators" }),
        " to shape what this platform becomes."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), style: {
        background: "linear-gradient(135deg,#F5C842,#e6a800)",
        color: "#0B0C1A",
        border: "none",
        borderRadius: 16,
        padding: "16px 40px",
        fontSize: 17,
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 4px 24px rgba(245,200,66,0.35)"
      }, children: "Apply Now — It's Free" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 12, marginTop: 10 }, children: "No charge. No obligation. Just your story." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "linear-gradient(90deg,transparent,rgba(245,200,66,0.2),transparent)", margin: "0 24px 32px" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 20px 32px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "#fff", fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 20 }, children: "What Founding Creators Get" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: PERKS.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,200,66,0.12)", borderRadius: 16, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 28, flexShrink: 0 }, children: p2.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 700, fontSize: 15, marginBottom: 4 }, children: p2.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#999", fontSize: 13, lineHeight: 1.5 }, children: p2.desc })
        ] })
      ] }, p2.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { margin: "0 20px 32px", background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: 20, padding: "24px 20px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 12 }, children: "📣" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#ddd", fontSize: 15, lineHeight: 1.7, margin: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
        '"The biggest platforms reward performance over reality. Sachi was built for creators who are done performing — and ready to just be ',
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#F5C842" }, children: "real" }),
        '."'
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 12, marginTop: 12 }, children: "— Jaya Gunaratne, Founder of Sachi Stream" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 20px 60px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), style: {
        width: "100%",
        maxWidth: 400,
        background: "linear-gradient(135deg,#F5C842,#e6a800)",
        color: "#0B0C1A",
        border: "none",
        borderRadius: 16,
        padding: "16px",
        fontSize: 17,
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 4px 24px rgba(245,200,66,0.3)"
      }, children: "🌸 Apply to Be a Founding Creator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 12, marginTop: 10 }, children: "Launching May 2026 · 50 spots · sachistream.com" })
    ] })
  ] });
}
const APP_NAME = "SachiStream";
const AUDIUS_BASE = "https://api.audius.co/v1";
const GENRES = ["All", "Hip-Hop", "Pop", "Electronic", "R&B/Soul", "Latin", "Rock", "Metal", "Country", "Jazz", "Classical", "Reggae", "Podcasts", "Alternative", "Ambient"];
function formatDuration(secs) {
  const m2 = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m2}:${s.toString().padStart(2, "0")}`;
}
async function fetchTrending(genre) {
  const url = genre && genre !== "All" ? `${AUDIUS_BASE}/tracks/trending?app_name=${APP_NAME}&limit=20&genre=${encodeURIComponent(genre)}` : `${AUDIUS_BASE}/tracks/trending?app_name=${APP_NAME}&limit=20`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data || [];
}
async function searchTracks(query) {
  const res = await fetch(`${AUDIUS_BASE}/tracks/search?app_name=${APP_NAME}&query=${encodeURIComponent(query)}&limit=20`);
  const data = await res.json();
  return data.data || [];
}
function getStreamUrl(trackId) {
  return `${AUDIUS_BASE}/tracks/${trackId}/stream?app_name=${APP_NAME}`;
}
function MusicPicker({ onSelect, onClose, currentSound }) {
  const [tab, setTab] = reactExports.useState("trending");
  const [genre, setGenre] = reactExports.useState("All");
  const [tracks, setTracks] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [searching, setSearching] = reactExports.useState(false);
  const [playing, setPlaying] = reactExports.useState(null);
  const [originalSounds, setOriginalSounds] = reactExports.useState([]);
  const audioRef = reactExports.useRef(null);
  const searchTimer = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (tab !== "trending") return;
    setLoading(true);
    fetchTrending(genre).then(setTracks).catch(() => setTracks([])).finally(() => setLoading(false));
  }, [genre, tab]);
  reactExports.useEffect(() => {
    if (tab !== "search") return;
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) {
      setTracks([]);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(() => {
      searchTracks(searchQuery).then(setTracks).catch(() => setTracks([])).finally(() => setSearching(false));
    }, 400);
  }, [searchQuery, tab]);
  reactExports.useEffect(() => {
    if (tab !== "original") return;
    fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo?has_sound=true&limit=50&sort=-created_date`, {
      headers: { "Content-Type": "application/json" }
    }).then((r2) => r2.json()).then((d) => {
      const all = Array.isArray(d) ? d : d.records || d.data || [];
      const withSound = all.filter((v2) => v2.sound_url || v2.video_url);
      setOriginalSounds(withSound);
    }).catch(() => setOriginalSounds([]));
  }, [tab]);
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setPlaying(null);
  };
  const previewTrack = (track) => {
    if (playing === track.id) {
      stopAudio();
      return;
    }
    stopAudio();
    const audio = new Audio(getStreamUrl(track.id));
    audio.volume = 0.7;
    audio.play().catch(() => {
    });
    audio.onended = () => setPlaying(null);
    audioRef.current = audio;
    setPlaying(track.id);
  };
  const selectAudiusTrack = (track) => {
    var _a, _b;
    stopAudio();
    onSelect({
      sound_title: track.title,
      sound_artist: ((_a = track.user) == null ? void 0 : _a.name) || "Unknown",
      sound_url: getStreamUrl(track.id),
      sound_artwork: ((_b = track.artwork) == null ? void 0 : _b["150x150"]) || null,
      sound_type: "audius",
      sound_id: track.id
    });
  };
  const selectOriginalSound = (video) => {
    stopAudio();
    onSelect({
      sound_title: video.sound_title || video.caption || "Original Sound",
      sound_artist: video.display_name || video.username || "Sachi Creator",
      sound_url: video.sound_url || video.video_url,
      sound_type: "original",
      sound_id: video.id
    });
  };
  const clearSound = () => {
    stopAudio();
    onSelect(null);
  };
  const TAB_STYLE = (active) => ({
    flex: 1,
    padding: "10px 4px",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid #F5C842" : "2px solid transparent",
    color: active ? "#F5C842" : "#888",
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    transition: "all 0.15s"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxHeight: "85dvh", background: "#13142A", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 800, color: "#fff" }, children: "🎵 Add Music" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        stopAudio();
        onClose();
      }, style: { background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer", padding: 0 }, children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: TAB_STYLE(tab === "trending"), onClick: () => setTab("trending"), children: "🔥 Trending" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: TAB_STYLE(tab === "search"), onClick: () => setTab("search"), children: "🔍 Search" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: TAB_STYLE(tab === "original"), onClick: () => setTab("original"), children: "🎤 Sachi Sounds" })
    ] }),
    tab === "trending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px", scrollbarWidth: "none" }, children: GENRES.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setGenre(g), style: {
      flexShrink: 0,
      background: genre === g ? "#F5C842" : "rgba(255,255,255,0.07)",
      color: genre === g ? "#0B0C1A" : "#bbb",
      border: "none",
      borderRadius: 20,
      padding: "6px 14px",
      fontSize: 12,
      fontWeight: genre === g ? 700 : 400,
      cursor: "pointer"
    }, children: g }, g)) }),
    tab === "search" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, children: "🔍" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          autoFocus: true,
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: "Search songs, artists...",
          style: { flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15 }
        }
      ),
      searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), style: { background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18, padding: 0 }, children: "✕" })
    ] }) }),
    currentSound && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { margin: "0 16px 8px", background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontSize: 12, fontWeight: 700 }, children: "♪ Now using" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 13, fontWeight: 600 }, children: currentSound.sound_title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 11 }, children: currentSound.sound_artist })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearSound, style: { background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, padding: "6px 10px", color: "#ff6666", fontSize: 12, cursor: "pointer" }, children: "Remove" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "0 0 20px" }, children: [
      (tab === "trending" || tab === "search") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        (loading || searching) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "40px 20px", color: "#666" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "🎵" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: searching ? "Searching..." : "Loading music..." })
        ] }),
        !loading && !searching && tracks.length === 0 && tab === "search" && searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "40px 20px", color: "#666" }, children: [
          'No results for "',
          searchQuery,
          '"'
        ] }),
        !loading && !searching && tracks.length === 0 && tab === "search" && !searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "40px 20px", color: "#666" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "🎵" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Type to search for music" })
        ] }),
        !loading && !searching && tracks.map((track) => {
          var _a, _b;
          const isPlaying = playing === track.id;
          const artwork = (_a = track.artwork) == null ? void 0 : _a["150x150"];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: isPlaying ? "rgba(245,200,66,0.06)" : "transparent" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }, children: [
              artwork ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: artwork, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: "🎵" }),
              isPlaying && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F5C842", fontSize: 18 }, children: "▶" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: isPlaying ? "#F5C842" : "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: track.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: 12 }, children: [
                (_b = track.user) == null ? void 0 : _b.name,
                " · ",
                formatDuration(track.duration)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", fontSize: 11, marginTop: 1 }, children: [
                track.genre,
                " ",
                track.play_count ? `· ${(track.play_count / 1e3).toFixed(0)}K plays` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexShrink: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => previewTrack(track), style: { background: isPlaying ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: isPlaying ? "#F5C842" : "#ccc", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }, children: isPlaying ? "⏸" : "▶" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => selectAudiusTrack(track), style: { background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 8, padding: "0 12px", height: 34, cursor: "pointer", color: "#F5C842", fontSize: 12, fontWeight: 700 }, children: "Use" })
            ] })
          ] }, track.id);
        }),
        !loading && tracks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "12px", color: "#444", fontSize: 11 }, children: [
          "Music powered by ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#666" }, children: "Audius" }),
          " · Free & licensed for creators"
        ] })
      ] }),
      tab === "original" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "12px 16px 4px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13, lineHeight: 1.5 }, children: "🎤 Sounds created by Sachi creators. Use them on your own videos." }) }),
        originalSounds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "40px 20px", color: "#666" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 10 }, children: "🎤" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, color: "#888", marginBottom: 6 }, children: "No original sounds yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: "Post a video — your audio becomes a sound other creators can use." })
        ] }) : originalSounds.map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.08)" }, children: v2.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v2.thumbnail_url, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }, children: "🎵" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: v2.sound_title || v2.caption || "Original Sound" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 12 }, children: v2.display_name || v2.username })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => selectOriginalSound(v2), style: { background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 8, padding: "0 12px", height: 34, cursor: "pointer", color: "#F5C842", fontSize: 12, fontWeight: 700, flexShrink: 0 }, children: "Use" })
        ] }, v2.id))
      ] })
    ] })
  ] }) });
}
function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });
}
function formatCount(n2) {
  if (!n2) return "0";
  if (n2 >= 1e6) return (n2 / 1e6).toFixed(1) + "M";
  if (n2 >= 1e3) return (n2 / 1e3).toFixed(1) + "K";
  return String(n2);
}
const resolveMediaUrl = (url, isVideo) => {
  if (!url) return url;
  const match = url.match(/\/files\/mp\/public\/([^/]+)\/(.+)$/);
  if (match) {
    const filename = match[2];
    const isVideoFile = /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(filename);
    const bucket = isVideoFile ? "videos" : "images";
    return `https://media.base44.com/${bucket}/public/${match[1]}/${match[2]}`;
  }
  return url;
};
async function getPostLocation() {
  const savedCode = localStorage.getItem("sachi_country_code");
  const savedRegion = localStorage.getItem("sachi_region");
  const savedCity = localStorage.getItem("sachi_city");
  const savedCountry = localStorage.getItem("sachi_country");
  if (savedCode) {
    return { post_country: savedCode, post_region: savedRegion || null, post_city: savedCity || null };
  }
  if (savedCountry) {
    return { post_country: savedCountry, post_region: savedRegion || null, post_city: savedCity || null };
  }
  try {
    const pos = await new Promise(
      (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5e3 })
    );
    const { latitude, longitude } = pos.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await res.json();
    const addr = data.address || {};
    const country = addr.country_code ? addr.country_code.toUpperCase() : null;
    const city = addr.city || addr.town || addr.village || addr.county || null;
    const region = addr.state || addr.region || null;
    if (country) localStorage.setItem("sachi_country_code", country);
    if (region) localStorage.setItem("sachi_region", region);
    if (city) localStorage.setItem("sachi_city", city);
    return { post_country: country, post_region: region, post_city: city };
  } catch {
    try {
      const r2 = await fetch("https://ipapi.co/json/");
      const d = await r2.json();
      const country = d.country_code || null;
      const region = d.region || null;
      const city = d.city || null;
      if (country) localStorage.setItem("sachi_country_code", country);
      if (region) localStorage.setItem("sachi_region", region);
      if (city) localStorage.setItem("sachi_city", city);
      return { post_country: country, post_region: region, post_city: city };
    } catch {
      return {};
    }
  }
}
function getStateAbbr(state, countryCode) {
  if (!state) return "";
  const US_STATES = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "District of Columbia": "DC"
  };
  const AU_STATES = {
    "New South Wales": "NSW",
    "Victoria": "VIC",
    "Queensland": "QLD",
    "South Australia": "SA",
    "Western Australia": "WA",
    "Tasmania": "TAS",
    "Northern Territory": "NT",
    "Australian Capital Territory": "ACT"
  };
  const CA_PROVINCES = {
    "Ontario": "ON",
    "Quebec": "QC",
    "British Columbia": "BC",
    "Alberta": "AB",
    "Manitoba": "MB",
    "Saskatchewan": "SK",
    "Nova Scotia": "NS",
    "New Brunswick": "NB",
    "Newfoundland and Labrador": "NL",
    "Prince Edward Island": "PE",
    "Northwest Territories": "NT",
    "Nunavut": "NU",
    "Yukon": "YT"
  };
  if (countryCode === "US" && US_STATES[state]) return US_STATES[state];
  if (countryCode === "AU" && AU_STATES[state]) return AU_STATES[state];
  if (countryCode === "CA" && CA_PROVINCES[state]) return CA_PROVINCES[state];
  if (state.length <= 4) return state;
  return state;
}
function countryFlag(code) {
  if (!code || code.length !== 2) return "";
  return code.toUpperCase().replace(
    /./g,
    (c) => String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}
async function captureThumbnail(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 888;
        const ctx = canvas.getContext("2d");
        const vw = video.videoWidth, vh2 = video.videoHeight;
        const targetRatio = 500 / 888, srcRatio = vw / vh2;
        let sx = 0, sy = 0, sw = vw, sh2 = vh2;
        if (srcRatio > targetRatio) {
          sw = vh2 * targetRatio;
          sx = (vw - sw) / 2;
        } else {
          sh2 = vw / targetRatio;
          sy = (vh2 - sh2) / 2;
        }
        ctx.drawImage(video, sx, sy, sw, sh2, 0, 0, 500, 888);
        URL.revokeObjectURL(url);
        canvas.toBlob(async (blob) => {
          if (!blob) return resolve(null);
          const thumbFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
          try {
            const url2 = await uploadFile(thumbFile);
            resolve(url2);
          } catch {
            resolve(null);
          }
        }, "image/jpeg", 0.85);
      } catch {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
  });
}
function CommentSheet({ video, currentUser, onClose, onCommentPosted, onNeedAuth }) {
  const [list, setList] = reactExports.useState([]);
  const [text, setText] = reactExports.useState("");
  const [posting, setPosting] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const [replyingTo, setReplyingTo] = reactExports.useState(null);
  const [expandedReplies, setExpandedReplies] = reactExports.useState({});
  const bottomRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!video) return;
    comments.list(video.id).then((r2) => setList(Array.isArray(r2) ? r2 : [])).catch(() => setList([])).finally(() => setLoading(false));
  }, [video == null ? void 0 : video.id]);
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [list]);
  const startReply = (c) => {
    if (!currentUser) {
      onNeedAuth();
      return;
    }
    setReplyingTo({ id: c.id, username: c.username });
    setText(`@${c.username} `);
    setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 100);
  };
  const cancelReply = () => {
    setReplyingTo(null);
    setText("");
  };
  const post = async () => {
    var _a;
    if (!currentUser) {
      onNeedAuth();
      return;
    }
    if (!text.trim()) return;
    setPosting(true);
    try {
      const username = currentUser.full_name || ((_a = currentUser.email) == null ? void 0 : _a.split("@")[0]) || "user";
      if (replyingTo) {
        const reply = { id: Date.now().toString(), username, avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`, comment_text: text.trim(), thumbsUp: 0, hearts: 0, thumbsDown: 0 };
        setList((prev) => prev.map((x2) => x2.id === replyingTo.id ? { ...x2, replies: [...x2.replies || [], reply] } : x2));
        setExpandedReplies((prev) => ({ ...prev, [replyingTo.id]: true }));
        setReplyingTo(null);
        setText("");
      } else {
        const c = await comments.create({
          video_id: video.id,
          username,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
          comment_text: text.trim(),
          likes_count: 0
        });
        const newCount = list.length + 1;
        setList((prev) => [...prev, c]);
        setText("");
        await videos.update(video.id, { comments_count: newCount });
        if (onCommentPosted) onCommentPosted(video.id, newCount);
        setTimeout(() => onClose(), 600);
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setPosting(false);
    }
  };
  const reactToComment = (id2, reaction, isReply, parentId) => {
    if (isReply) {
      setList((prev) => prev.map((x2) => x2.id === parentId ? {
        ...x2,
        replies: (x2.replies || []).map((r2) => r2.id === id2 ? { ...r2, [reaction]: (r2[reaction] || 0) + 1 } : r2)
      } : x2));
    } else {
      setList((prev) => prev.map((x2) => x2.id === id2 ? { ...x2, [reaction]: (x2[reaction] || 0) + 1 } : x2));
    }
  };
  const CommentRow = ({ c, isReply = false, parentId = null }) => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginBottom: 12, paddingLeft: isReply ? 44 : 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.avatar_url, style: { width: isReply ? 28 : 36, height: isReply ? 28 : 36, borderRadius: "50%", border: `2px solid rgba(108,99,255,${isReply ? 0.2 : 0.3})`, flexShrink: 0 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ff6b6b", fontWeight: 700, fontSize: isReply ? 12 : 13 }, children: [
          "@",
          c.username
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ccc", fontSize: isReply ? 13 : 14, marginBottom: 4 }, children: c.comment_text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => reactToComment(c.id, "thumbsUp", isReply, parentId),
              style: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2, color: c.thumbsUp ? "#6bff9a" : "#666", fontSize: 12, padding: 0 },
              children: [
                "👍 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: c.thumbsUp || 0 })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => reactToComment(c.id, "hearts", isReply, parentId),
              style: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2, color: c.hearts ? "#ff6b6b" : "#666", fontSize: 12, padding: 0 },
              children: [
                "❤️ ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: c.hearts || 0 })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => reactToComment(c.id, "thumbsDown", isReply, parentId),
              style: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2, color: c.thumbsDown ? "#ff8e53" : "#666", fontSize: 12, padding: 0 },
              children: [
                "👎 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: c.thumbsDown || 0 })
              ]
            }
          ),
          !isReply && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => startReply(c),
              style: { background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 12, padding: 0, marginLeft: 4 },
              children: "💬 Reply"
            }
          ),
          !isReply && ((_a = c.replies) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setExpandedReplies((prev) => ({ ...prev, [c.id]: !prev[c.id] })),
              style: { background: "none", border: "none", cursor: "pointer", color: "#6c63ff", fontSize: 12, padding: 0 },
              children: expandedReplies[c.id] ? "▲ Hide" : `▼ ${c.replies.length} repl${c.replies.length === 1 ? "y" : "ies"}`
            }
          )
        ] }),
        !isReply && expandedReplies[c.id] && (c.replies || []).map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsx(CommentRow, { c: r2, isReply: true, parentId: c.id }, r2.id))
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 1e3, display: "flex", flexDirection: "column", justifyContent: "flex-end" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", background: "#1a1a2e", borderRadius: "24px 24px 0 0", maxHeight: "75vh", display: "flex", flexDirection: "column", zIndex: 1001 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px 0", flexShrink: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 4, background: "#444", borderRadius: 99, margin: "0 auto 12px" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontWeight: 700, fontSize: 16 }, children: [
            "💬 Comments ",
            list.length > 0 && `(${list.length})`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer" }, children: "✕" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "0 16px 8px" }, children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", textAlign: "center", padding: 32 }, children: "Loading..." }),
        !loading && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", textAlign: "center", padding: 40 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, marginBottom: 8 }, children: "💬" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "No comments yet. Be first!" })
        ] }),
        list.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CommentRow, { c }, c.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 16px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }, children: [
        replyingTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, padding: "4px 10px", background: "rgba(108,99,255,0.15)", borderRadius: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#aaa", fontSize: 12 }, children: [
            "Replying to ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ff6b6b" }, children: [
              "@",
              replyingTo.username
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: cancelReply, style: { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 14 }, children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              value: text,
              onChange: (e) => setText(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && post(),
              placeholder: currentUser ? replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..." : "Log in to comment...",
              style: { flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "8px 14px", color: "#fff", fontSize: 14, outline: "none" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: post,
              disabled: posting,
              style: { background: "linear-gradient(135deg,#ff6b6b,#ff8e53)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "#fff", cursor: "pointer", fontSize: 16 },
              children: "➤"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function GoLiveModal({ currentUser, onClose, onUploaded }) {
  const [phase, setPhase] = reactExports.useState("preview");
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [caption, setCaption] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [chunks, setChunks] = reactExports.useState([]);
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const recorderRef = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const chunksRef = reactExports.useRef([]);
  reactExports.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      setError("Camera access denied. Please allow camera and microphone permissions.");
    }
  };
  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t2) => t2.stop());
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const startLive = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "video/mp4";
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start(500);
    recorderRef.current = recorder;
    setPhase("live");
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((p2) => p2 + 1), 1e3);
  };
  const stopLive = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setPhase("uploading");
    setTimeout(() => uploadLive(), 800);
  };
  const uploadLive = async () => {
    var _a, _b;
    try {
      const mimeType = ((_a = chunksRef.current[0]) == null ? void 0 : _a.type) || "video/webm";
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const file = new File([blob], `live_${Date.now()}.${ext}`, { type: mimeType });
      const file_url = await uploadFile(file);
      let thumbUrl = "";
      try {
        const thumbBlob = await captureThumbnail(file);
        const thumbFile = new File([thumbBlob], "thumb.jpg", { type: "image/jpeg" });
        thumbUrl = await uploadFile(thumbFile);
      } catch (_) {
      }
      const liveGeo = await getPostLocation();
      await videos.create({
        user_id: currentUser.id,
        username: currentUser.username || ((_b = currentUser.email) == null ? void 0 : _b.split("@")[0]) || "user",
        display_name: currentUser.display_name || currentUser.full_name || currentUser.username || "",
        avatar_url: currentUser.avatar_url || "",
        video_url: file_url,
        thumbnail_url: thumbUrl,
        caption: caption || "🔴 Live recording",
        hashtags: ["live"],
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        shares_count: 0,
        is_approved: true,
        is_archived: false,
        is_ai_detected: false,
        duration_seconds: elapsed,
        ...liveGeo
      });
      setPhase("done");
      setTimeout(() => {
        onUploaded();
        onClose();
      }, 2e3);
    } catch (e) {
      setError("Upload failed: " + e.message);
      setPhase("preview");
    }
  };
  const formatElapsed = (s) => {
    const m2 = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m2}:${sec}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, background: "#000", zIndex: 9e3, display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        ref: videoRef,
        autoPlay: true,
        muted: true,
        playsInline: true,
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)"
          /* mirror front cam */
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 120,
      background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          stopCamera();
          onClose();
        },
        style: {
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 100,
          background: "rgba(0,0,0,0.5)",
          border: "none",
          borderRadius: "50%",
          width: 44,
          height: 44,
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: "✕"
      }
    ),
    phase === "live" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 16,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      zIndex: 100
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        background: "#e53935",
        borderRadius: 6,
        padding: "3px 10px",
        color: "#fff",
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: 1,
        boxShadow: "0 0 12px rgba(229,57,53,0.8)",
        animation: "livePulse 1.2s ease infinite"
      }, children: "🔴 LIVE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        background: "rgba(0,0,0,0.6)",
        borderRadius: 6,
        padding: "3px 10px",
        color: "#fff",
        fontWeight: 700,
        fontSize: 13,
        backdropFilter: "blur(4px)"
      }, children: formatElapsed(elapsed) })
    ] }),
    (phase === "preview" || phase === "live") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 160, left: 16, right: 16, zIndex: 100 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: caption,
        onChange: (e) => setCaption(e.target.value),
        placeholder: "Add a caption for your live...",
        style: {
          width: "100%",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 12,
          padding: "10px 14px",
          color: "#fff",
          fontSize: 14,
          backdropFilter: "blur(8px)",
          outline: "none",
          boxSizing: "border-box"
        }
      }
    ) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      background: "rgba(200,0,0,0.85)",
      borderRadius: 12,
      padding: "16px 24px",
      color: "#fff",
      fontSize: 14,
      zIndex: 200,
      textAlign: "center",
      maxWidth: 280
    }, children: error }),
    phase === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      zIndex: 150,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48 }, children: "📤" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 18, fontWeight: 700 }, children: "Uploading your live..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13 }, children: "This may take a moment" })
    ] }),
    phase === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
      zIndex: 150,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 56 }, children: "✅" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 20, fontWeight: 800 }, children: "Posted to feed!" })
    ] }),
    phase === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", zIndex: 100 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: startLive,
          style: {
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#e53935",
            border: "5px solid rgba(255,255,255,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 24px rgba(229,57,53,0.7)",
            fontSize: 28
          },
          children: "🔴"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 8 }, children: "Tap to Go Live" })
    ] }),
    phase === "live" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", zIndex: 100 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: stopLive,
          style: {
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#222",
            border: "5px solid #e53935",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 24px rgba(229,57,53,0.5)",
            fontSize: 28
          },
          children: "⏹️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 8 }, children: "Tap to Stop & Post" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes livePulse {
          0%, 100% { opacity:1; box-shadow: 0 0 12px rgba(229,57,53,0.8); }
          50% { opacity:0.7; box-shadow: 0 0 24px rgba(229,57,53,1); }
        }
      ` })
  ] });
}
function VideoEditor({ file, onDone, onSkip }) {
  const videoRef = reactExports.useRef(null);
  const [duration, setDuration] = reactExports.useState(0);
  const [trimStart, setTrimStart] = reactExports.useState(0);
  const [trimEnd, setTrimEnd] = reactExports.useState(0);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [trimming, setTrimming] = reactExports.useState(false);
  const [activeMode, setActiveMode] = reactExports.useState(null);
  const [textOverlays, setTextOverlays] = reactExports.useState([]);
  const [showTextInput, setShowTextInput] = reactExports.useState(false);
  const [textInputVal, setTextInputVal] = reactExports.useState("");
  const [textColor, setTextColor] = reactExports.useState("#ffffff");
  const [textBg, setTextBg] = reactExports.useState("none");
  const [textSize, setTextSize] = reactExports.useState(22);
  const [isPlaying, setIsPlaying] = reactExports.useState(true);
  const previewUrl = reactExports.useMemo(() => URL.createObjectURL(file), [file]);
  reactExports.useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);
  const onMeta = () => {
    var _a;
    const dur = ((_a = videoRef.current) == null ? void 0 : _a.duration) || 0;
    setDuration(dur);
    setTrimEnd(dur);
  };
  const onTimeUpdate = () => {
    var _a;
    return setCurrentTime(((_a = videoRef.current) == null ? void 0 : _a.currentTime) || 0);
  };
  const fmtTime = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  const addTextOverlay = () => {
    if (!textInputVal.trim()) return;
    setTextOverlays((prev) => [...prev, {
      id: Date.now(),
      text: textInputVal.trim(),
      color: textColor,
      bg: textBg,
      size: textSize,
      x: 50,
      y: 50
    }]);
    setTextInputVal("");
    setShowTextInput(false);
    setActiveMode(null);
  };
  const removeOverlay = (id2) => setTextOverlays((prev) => prev.filter((o) => o.id !== id2));
  const doPost = async () => {
    setTrimming(true);
    if (trimStart <= 0.5 && trimEnd >= duration - 0.5) {
      onDone(file, textOverlays);
      return;
    }
    try {
      const video = document.createElement("video");
      video.src = previewUrl;
      video.muted = true;
      await new Promise((r2) => {
        video.onloadedmetadata = r2;
        video.load();
      });
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);
      const mimeType = "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4e6 });
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      const blob = await new Promise((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        video.currentTime = trimStart;
        video.oncanplay = async () => {
          video.oncanplay = null;
          recorder.start(100);
          const draw = () => {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              requestAnimationFrame(draw);
            }
          };
          draw();
          await video.play();
          setTimeout(() => {
            video.pause();
            recorder.stop();
          }, (trimEnd - trimStart) * 1e3);
        };
      });
      onDone(new File([blob], `trimmed.webm`, { type: mimeType }), textOverlays);
    } catch {
      onDone(file, textOverlays);
    }
    setTrimming(false);
  };
  const TEXT_COLORS = ["#ffffff", "#000000", "#FF6B6B", "#F5C842", "#00E5FF", "#FF69B4", "#7CFC00", "#FF8C00"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 3e3, background: "#000", display: "flex", flexDirection: "column", userSelect: "none" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onSkip,
          style: { width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
          children: "✕"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(0,0,0,0.55)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "7px 14px", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(8px)" }, children: "🎵 Add sound" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 36 } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, position: "relative", overflow: "hidden" }, onClick: activeMode ? void 0 : togglePlay, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "video",
        {
          ref: videoRef,
          src: previewUrl,
          onLoadedMetadata: onMeta,
          onTimeUpdate,
          style: { width: "100%", height: "100%", objectFit: "cover" },
          autoPlay: true,
          loop: true,
          playsInline: true
        }
      ),
      textOverlays.map((ov) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            position: "absolute",
            top: `${ov.y}%`,
            left: `${ov.x}%`,
            transform: "translate(-50%,-50%)",
            color: ov.color,
            fontSize: ov.size,
            fontWeight: 900,
            letterSpacing: 0.5,
            background: ov.bg === "dark" ? "rgba(0,0,0,0.55)" : ov.bg === "colored" ? ov.color.replace(")", ",0.2)").replace("rgb", "rgba") : "transparent",
            padding: ov.bg !== "none" ? "4px 10px" : 0,
            borderRadius: 8,
            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
            whiteSpace: "nowrap",
            cursor: "pointer",
            zIndex: 5,
            maxWidth: "85vw",
            wordBreak: "break-word",
            textAlign: "center"
          },
          onClick: (e) => {
            e.stopPropagation();
            removeOverlay(ov.id);
          },
          children: ov.text
        },
        ov.id
      )),
      !isPlaying && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 70, height: 70, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }, children: "▶" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 20, zIndex: 10 }, children: [
      { icon: "T", label: "Text", mode: "text" },
      { icon: "✂️", label: "Trim", mode: "trim" }
    ].map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => {
          setActiveMode((m2) => m2 === tool.mode ? null : tool.mode);
        },
        style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: activeMode === tool.mode ? "rgba(245,200,66,0.9)" : "rgba(0,0,0,0.55)",
            border: activeMode === tool.mode ? "2px solid #F5C842" : "1.5px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: tool.icon === "T" ? 20 : 18,
            fontWeight: 900,
            color: activeMode === tool.mode ? "#000" : "#fff",
            backdropFilter: "blur(8px)",
            boxShadow: activeMode === tool.mode ? "0 0 14px rgba(245,200,66,0.5)" : "none"
          }, children: tool.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 10, fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }, children: tool.label })
        ]
      },
      tool.mode
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "0 20px 40px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: 18, marginBottom: 20 }, children: [
        { label: "10m" },
        { label: "60s" },
        { label: "15s" },
        { label: "PHOTO", active: false },
        { label: "TEXT", action: "text" }
      ].map((m2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: () => m2.action === "text" ? (setActiveMode("text"), setShowTextInput(true)) : null,
          style: {
            color: m2.action === "text" && activeMode === "text" ? "#F5C842" : "#fff",
            fontWeight: m2.action === "text" ? 900 : 600,
            fontSize: m2.action === "text" ? 16 : 14,
            opacity: m2.action === "text" ? 1 : 0.7,
            cursor: m2.action ? "pointer" : "default",
            padding: m2.action === "text" ? "4px 10px" : "4px 0",
            borderBottom: m2.action === "text" && activeMode === "text" ? "2px solid #F5C842" : "none",
            textShadow: "0 1px 6px rgba(0,0,0,0.9)"
          },
          children: m2.label
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: doPost,
          disabled: trimming,
          style: {
            width: "100%",
            padding: "16px 0",
            background: trimming ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff8e53)",
            border: "none",
            borderRadius: 16,
            color: "#fff",
            fontWeight: 900,
            fontSize: 17,
            cursor: trimming ? "default" : "pointer",
            letterSpacing: 0.5,
            boxShadow: "0 4px 20px rgba(255,107,107,0.4)"
          },
          children: trimming ? "Processing..." : "Next →"
        }
      )
    ] }),
    activeMode === "trim" && duration > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 140, left: 0, right: 0, zIndex: 15, background: "rgba(15,15,26,0.95)", borderRadius: "20px 20px 0 0", padding: "20px 20px 10px", backdropFilter: "blur(16px)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 14, textAlign: "center" }, children: [
        "✂️ Trim — ",
        fmtTime(trimStart),
        " to ",
        fmtTime(trimEnd)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: 11, marginBottom: 4 }, children: [
          "Start: ",
          fmtTime(trimStart)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: duration,
            step: 0.1,
            value: trimStart,
            onChange: (e) => {
              const v2 = Math.min(parseFloat(e.target.value), trimEnd - 1);
              setTrimStart(v2);
              if (videoRef.current) videoRef.current.currentTime = v2;
            },
            style: { width: "100%", accentColor: "#ff6b6b" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: 11, marginBottom: 4 }, children: [
          "End: ",
          fmtTime(trimEnd)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: duration,
            step: 0.1,
            value: trimEnd,
            onChange: (e) => {
              const v2 = Math.max(parseFloat(e.target.value), trimStart + 1);
              setTrimEnd(v2);
              if (videoRef.current) videoRef.current.currentTime = v2;
            },
            style: { width: "100%", accentColor: "#ff6b6b" }
          }
        )
      ] })
    ] }),
    (activeMode === "text" || showTextInput) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, zIndex: 20, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        color: textColor,
        fontSize: textSize,
        fontWeight: 900,
        marginBottom: 20,
        background: textBg === "dark" ? "rgba(0,0,0,0.55)" : "transparent",
        padding: textBg !== "none" ? "6px 16px" : 0,
        borderRadius: 10,
        textShadow: "0 1px 8px rgba(0,0,0,0.9)",
        minHeight: 40,
        textAlign: "center",
        maxWidth: "85vw",
        wordBreak: "break-word"
      }, children: textInputVal || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.3 }, children: "Start typing..." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          autoFocus: true,
          value: textInputVal,
          onChange: (e) => setTextInputVal(e.target.value),
          placeholder: "Type something...",
          style: { width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 16, outline: "none", marginBottom: 16, textAlign: "center" },
          onKeyDown: (e) => e.key === "Enter" && addTextOverlay()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10, marginBottom: 14 }, children: TEXT_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: () => setTextColor(c),
          style: {
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: c,
            border: textColor === c ? "3px solid #F5C842" : "2px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            boxShadow: textColor === c ? "0 0 10px rgba(245,200,66,0.6)" : "none",
            flexShrink: 0
          }
        },
        c
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: 400, marginBottom: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: 11, marginBottom: 6, textAlign: "center" }, children: [
          "Size: ",
          textSize,
          "px"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            min: 14,
            max: 48,
            step: 1,
            value: textSize,
            onChange: (e) => setTextSize(parseInt(e.target.value)),
            style: { width: "100%", accentColor: "#F5C842" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10, marginBottom: 20 }, children: [{ v: "none", l: "No BG" }, { v: "dark", l: "Dark BG" }, { v: "colored", l: "Color BG" }].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setTextBg(b.v),
          style: {
            padding: "8px 14px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            background: textBg === b.v ? "#F5C842" : "rgba(255,255,255,0.12)",
            color: textBg === b.v ? "#000" : "#fff"
          },
          children: b.l
        },
        b.v
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, width: "100%", maxWidth: 400 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setShowTextInput(false);
              setActiveMode(null);
              setTextInputVal("");
            },
            style: { flex: 1, padding: "13px 0", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 14, color: "#aaa", fontWeight: 700, fontSize: 15, cursor: "pointer" },
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: addTextOverlay,
            style: { flex: 2, padding: "13px 0", background: "linear-gradient(135deg,#F5C842,#FF9500)", border: "none", borderRadius: 14, color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer" },
            children: "✓ Add Text"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 11, marginTop: 12 }, children: "Tap a text overlay on video to remove it" })
    ] }),
    trimming && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 30 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 16 }, children: "⚙️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 16 }, children: "Processing video..." })
    ] })
  ] });
}
function UploadModal({ currentUser, onClose, onUploaded }) {
  const [file, setFile] = reactExports.useState(null);
  const [editedFile, setEditedFile] = reactExports.useState(null);
  const [showEditor, setShowEditor] = reactExports.useState(false);
  const [uploadTab, setUploadTab] = reactExports.useState("video");
  const [photos, setPhotos] = reactExports.useState([]);
  const photoRef = reactExports.useRef();
  const [caption, setCaption] = reactExports.useState("");
  const [isMature, setIsMature] = reactExports.useState(false);
  const [matureReason, setMatureReason] = reactExports.useState("other");
  const [maxDuration, setMaxDuration] = reactExports.useState(60);
  const [selectedTrack, setSelectedTrack] = reactExports.useState(null);
  const [showMusicPicker, setShowMusicPicker] = reactExports.useState(false);
  const [musicGenreFilter, setMusicGenreFilter] = reactExports.useState("All");
  const [previewTrack, setPreviewTrack] = reactExports.useState(null);
  const previewAudioRef = reactExports.useRef(null);
  const [musicTracks, setMusicTracks] = reactExports.useState([]);
  const [musicLoading, setMusicLoading] = reactExports.useState(false);
  const [musicSearch, setMusicSearch] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [step, setStep] = reactExports.useState("");
  const fileRef = reactExports.useRef();
  const [notAiConfirmed, setNotAiConfirmed] = reactExports.useState(false);
  const [aiBlocked, setAiBlocked] = reactExports.useState(false);
  const [isAiGenerated, setIsAiGenerated] = reactExports.useState(false);
  const [textPostContent, setTextPostContent] = reactExports.useState("");
  const [textPostTemplate, setTextPostTemplate] = reactExports.useState(0);
  const [showPostDetails, setShowPostDetails] = reactExports.useState(false);
  const [postTitle, setPostTitle] = reactExports.useState("");
  const [postVisibility, setPostVisibility] = reactExports.useState("everyone");
  const [postLocation, setPostLocation] = reactExports.useState(null);
  const [detectingLocation, setDetectingLocation] = reactExports.useState(false);
  const [showVisibilityPicker, setShowVisibilityPicker] = reactExports.useState(false);
  const checkForExplicitContent = (f2, cap) => {
    const explicit = ["nude", "naked", "nsfw", "xxx", "porn", "sex", "explicit", "adult only", "18+", "onlyfans", "erotic"];
    const name = f2.name.toLowerCase();
    const capLower = (cap || "").toLowerCase();
    return explicit.some((kw) => name.includes(kw) || capLower.includes(kw));
  };
  const checkForAiSignatures = (f2, cap) => {
    const name = f2.name.toLowerCase();
    const capLower = (cap || "").toLowerCase();
    const combined = name + " " + capLower;
    const aiKeywords = [
      // ── Top AI video generators ──
      "sora",
      "runway",
      "runwayml",
      "pika",
      "pikaart",
      "kling",
      "luma",
      "lumalabs",
      "gen2",
      "gen3",
      "gen4",
      "gen-2",
      "gen-3",
      "synthesia",
      "deepfake",
      "deep fake",
      "invideo",
      "heygen",
      "he-gen",
      "d-id",
      "did_video",
      "veed",
      "capcut_ai",
      "dreamina",
      "pixverse",
      "pixart",
      "haiper",
      "morph",
      "kaiber",
      "moonvalley",
      "stablevideo",
      "stable video",
      "stablediffusion",
      "stable diffusion",
      "animatediff",
      "animate diff",
      "modelscope",
      "zeroscope",
      "cogvideo",
      "text2video",
      "text to video",
      "img2video",
      "image to video",
      "openai video",
      "dalle video",
      "gemini video",
      "vidnoz",
      "fliki",
      "pictory",
      "flexclip_ai",
      "elai",
      "colossyan",
      "movio",
      "windsor",
      "tavus",
      "argil",
      "captions_ai",
      "captions.ai",
      "nova ai",
      "novaai",
      "steve ai",
      "steveai",
      "rawshorts",
      "wisecut",
      "descript_ai",
      "opus_ai",
      "munch_ai",
      // ── AI image generators used in video ──
      "midjourney",
      "midjrny",
      "dalle",
      "dall-e",
      "dall_e",
      "firefly",
      "adobe_ai",
      "ideogram",
      "leonardo_ai",
      "leonardoai",
      "nightcafe",
      "artbreeder",
      "civitai",
      "civit_ai",
      "playground_ai",
      "playgroundai",
      "tensor_art",
      "tensorart",
      "novelai",
      "novel_ai",
      "nijijourney",
      // ── Generic AI tags ──
      "ai_generated",
      "ai-generated",
      "aigenerated",
      "aigc",
      "ai_made",
      "ai_video",
      "aivideo",
      "made_by_ai",
      "created_by_ai",
      "generated_by_ai",
      "synthetic_media",
      "synthetic media",
      "deepfake",
      "deep_fake",
      "neural_render",
      "neural render",
      "gan_video",
      "diffusion_video",
      "aiart",
      "ai art",
      "ai content",
      "aicontent",
      "virtual human",
      "virtual_human",
      "digital human",
      "digital_human",
      "avatar video",
      "avatar_video",
      "ai avatar",
      "ai_avatar",
      "face swap",
      "faceswap",
      "face_swap",
      "voice clone",
      "voice_clone",
      "lip sync",
      "lipsync",
      "lip_sync",
      // ── Caption/hashtag signals ──
      "#ai",
      "#aiart",
      "#aivideo",
      "#aigc",
      "#artificialintelligence",
      "#aigenerated",
      "#deepfake",
      "#synthetic",
      "#notreal",
      "#virtualinfluencer",
      "#aiinfluencer",
      "#digitalavatar"
    ];
    return aiKeywords.some((kw) => combined.includes(kw));
  };
  const [explicitBlocked, setExplicitBlocked] = reactExports.useState(false);
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setPhotos((prev) => {
      const combined = [...prev, ...files];
      return combined.slice(0, 6);
    });
  };
  const removePhoto = (idx) => setPhotos((p2) => p2.filter((_, i) => i !== idx));
  const uploadPhotos = async () => {
    var _a;
    if (!photos.length) return;
    setUploading(true);
    setProgress(10);
    try {
      setStep("Uploading photos...");
      const urls = [];
      for (let i = 0; i < photos.length; i++) {
        const url = await uploadFile(photos[i]);
        urls.push(url);
        setProgress(10 + Math.round((i + 1) / photos.length * 70));
      }
      setProgress(85);
      setStep("Saving to feed...");
      const photoGeo = await getPostLocation();
      const username = currentUser.full_name || ((_a = currentUser.email) == null ? void 0 : _a.split("@")[0]) || "user";
      const tags = (caption.match(/#\w+/g) || []).map((t2) => t2.toLowerCase());
      await videos.create({
        user_id: currentUser.id,
        username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url: urls[0],
        thumbnail_url: urls[0],
        photo_urls: JSON.stringify(urls),
        is_photo: true,
        caption: (postTitle ? postTitle + "\n" : "") + caption.trim(),
        hashtags: tags,
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        shares_count: 0,
        is_approved: !isAiGenerated && postVisibility !== "only_me",
        is_archived: false,
        is_ai_detected: isAiGenerated,
        is_mature: isMature,
        mature_reason: isMature ? matureReason : null,
        post_visibility: postVisibility,
        post_location_name: (postLocation == null ? void 0 : postLocation.name) || null,
        post_city: (postLocation == null ? void 0 : postLocation.city) || photoGeo.post_city || null,
        ...photoGeo
      });
      setProgress(100);
      if (isAiGenerated) {
        setStep("🤖 Bruh, AI has been flagged! Sent to MOD for review.");
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setStep("Posted! 🎉");
        setTimeout(() => {
          onUploaded();
          onClose();
        }, 1e3);
      }
    } catch (e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false);
      setProgress(0);
      setStep("");
    }
  };
  const upload = async () => {
    var _a;
    if (!file) return;
    if (checkForExplicitContent(file, caption)) {
      alert("🔞 Sexual or explicit content is not allowed on Sachi.");
      return;
    }
    if (aiBlocked || checkForAiSignatures(file, caption)) {
      alert("🚫 This video appears to be AI-generated and cannot be posted on Sachi.");
      return;
    }
    if (!notAiConfirmed && !isAiGenerated) {
      alert("⚠️ Please confirm your video is NOT AI-generated before posting.");
      return;
    }
    try {
      const dur = await new Promise((res, rej) => {
        const v2 = document.createElement("video");
        v2.preload = "metadata";
        v2.onloadedmetadata = () => {
          URL.revokeObjectURL(v2.src);
          res(v2.duration);
        };
        v2.onerror = rej;
        v2.src = URL.createObjectURL(file);
      });
      if (dur > maxDuration) {
        alert(`⚠️ Your video is ${Math.round(dur)}s long. The limit for this format is ${maxDuration === 600 ? "10 minutes" : maxDuration + " seconds"}. Please trim it and try again.`);
        return;
      }
    } catch {
    }
    setUploading(true);
    setProgress(10);
    try {
      setStep("Uploading video...");
      const video_url = await uploadFile(editedFile || file);
      setProgress(60);
      setStep("Generating thumbnail...");
      let thumbnail_url = null;
      try {
        thumbnail_url = await Promise.race([captureThumbnail(file), new Promise((r2) => setTimeout(() => r2(null), 5e3))]);
      } catch {
      }
      setProgress(80);
      setStep("Saving to feed...");
      const videoGeo = await getPostLocation();
      const username = currentUser.full_name || ((_a = currentUser.email) == null ? void 0 : _a.split("@")[0]) || "user";
      const tags = (caption.match(/#\w+/g) || []).map((t2) => t2.toLowerCase());
      await videos.create({
        user_id: currentUser.id,
        username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url,
        thumbnail_url,
        caption: (postTitle ? postTitle + "\n" : "") + caption.trim(),
        hashtags: tags,
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        shares_count: 0,
        is_approved: !isAiGenerated && postVisibility !== "only_me",
        is_archived: false,
        is_ai_detected: isAiGenerated,
        is_mature: isMature,
        mature_reason: isMature ? matureReason : null,
        post_visibility: postVisibility,
        post_location_name: (postLocation == null ? void 0 : postLocation.name) || null,
        post_city: (postLocation == null ? void 0 : postLocation.city) || null,
        sound_title: (selectedTrack == null ? void 0 : selectedTrack.sound_title) || (selectedTrack == null ? void 0 : selectedTrack.title) || null,
        sound_artist: (selectedTrack == null ? void 0 : selectedTrack.sound_artist) || (selectedTrack == null ? void 0 : selectedTrack.artist) || null,
        sound_url: (selectedTrack == null ? void 0 : selectedTrack.sound_url) || (selectedTrack == null ? void 0 : selectedTrack.url) || null,
        ...videoGeo
      });
      setProgress(100);
      if (isAiGenerated) {
        setStep("🤖 Bruh, AI has been flagged! Sent to MOD for review.");
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setStep("Posted! 🎉");
        setTimeout(() => {
          onUploaded();
          onClose();
        }, 1e3);
      }
    } catch (e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false);
      setProgress(0);
      setStep("");
    }
  };
  const detectLocation = async () => {
    setDetectingLocation(true);
    try {
      const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8e3 }));
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
      const data = await resp.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || "";
      const state = addr.state || addr.region || "";
      const country_code = addr.country_code ? addr.country_code.toUpperCase() : "";
      if (city) localStorage.setItem("sachi_city", city);
      if (state) localStorage.setItem("sachi_region", state);
      if (country_code) localStorage.setItem("sachi_country_code", country_code);
      const stateAbbr = getStateAbbr(state, country_code);
      const label = [city, stateAbbr || state].filter(Boolean).join(", ");
      setPostLocation({ name: label, city, state, country_code });
    } catch {
      try {
        const r2 = await fetch("https://ipapi.co/json/");
        const d = await r2.json();
        const city = d.city || "";
        const state = d.region || "";
        const country_code = d.country_code || "";
        if (city) localStorage.setItem("sachi_city", city);
        if (state) localStorage.setItem("sachi_region", state);
        if (country_code) localStorage.setItem("sachi_country_code", country_code);
        const stateAbbr = getStateAbbr(state, country_code);
        const label = [city, stateAbbr || state].filter(Boolean).join(", ");
        setPostLocation({ name: label, city, state, country_code });
      } catch {
        setPostLocation(null);
      }
    }
    setDetectingLocation(false);
  };
  const goToPostDetails = () => {
    detectLocation();
    setShowPostDetails(true);
  };
  const uploadTextPost = async () => {
    var _a;
    if (!textPostContent.trim()) {
      alert("Please write something first!");
      return;
    }
    setUploading(true);
    setProgress(10);
    try {
      setStep("Creating text post...");
      const UPLOAD_TPLS = [
        { bg: ["#f8b4cb", "#f8b4cb"], style: "highlight", hlColor: "#e91e8c", textColor: "#111", emoji: "😊", emojiTop: true },
        { bg: ["#b8d4f0", "#d6e8ff"], style: "highlight", hlColor: "#F5C842", textColor: "#222", emoji: "", emojiTop: false },
        { bg: ["#0B0C1A", "#1a1040"], style: "plain", textColor: "#F5C842", emoji: "🌸", emojiTop: true },
        { bg: ["#d8e8f5", "#eaf2ff"], style: "plain", textColor: "#4a6fa5", emoji: "", emojiTop: false },
        { bg: ["#111111", "#111111"], style: "plain", textColor: "#ffffff", emoji: "🌙", emojiTop: true },
        { bg: ["#FF416C", "#FF9500"], style: "plain", textColor: "#ffffff", emoji: "🌅", emojiTop: true },
        { bg: ["#0F2027", "#2C5364"], style: "plain", textColor: "#00E5FF", emoji: "🌊", emojiTop: true },
        { bg: ["#1a1a1a", "#2d1a00"], style: "plain", textColor: "#F5C842", emoji: "✨", emojiTop: true }
      ];
      const tpl = UPLOAD_TPLS[textPostTemplate] || UPLOAD_TPLS[0];
      const canvas = document.createElement("canvas");
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, 540, 960);
      grad.addColorStop(0, tpl.bg[0]);
      grad.addColorStop(1, tpl.bg[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 540, 960);
      const fontSize = 58;
      const lineH = fontSize * 1.45;
      const maxW = 460;
      ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
      ctx.textBaseline = "top";
      const allWords = textPostContent.trim().split(" ");
      const lines = [];
      let curLine = "";
      for (const w2 of allWords) {
        const test = curLine ? curLine + " " + w2 : w2;
        if (ctx.measureText(test).width > maxW && curLine) {
          lines.push(curLine);
          curLine = w2;
        } else curLine = test;
      }
      if (curLine) lines.push(curLine);
      const totalTextH = lines.length * lineH;
      const emojiH = tpl.emoji ? 90 : 0;
      const emojiGap = tpl.emoji ? 24 : 0;
      const blockH = emojiH + emojiGap + totalTextH;
      let startY = (960 - blockH) / 2;
      if (tpl.emoji) {
        ctx.font = "80px Arial";
        ctx.textAlign = "left";
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.fillText(tpl.emoji, 40, startY);
        startY += emojiH + emojiGap;
      }
      ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
      if (tpl.style === "highlight") {
        const padX = 14, padY = 8;
        lines.forEach((l2, i) => {
          const tw = ctx.measureText(l2).width;
          const rx = 36, ry = startY + i * lineH - padY;
          ctx.fillStyle = tpl.hlColor;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(rx, ry, tw + padX * 2, fontSize + padY * 2, 6) : ctx.rect(rx, ry, tw + padX * 2, fontSize + padY * 2);
          ctx.fill();
          ctx.fillStyle = tpl.textColor;
          ctx.textAlign = "left";
          ctx.fillText(l2, rx + padX, startY + i * lineH);
        });
      } else {
        ctx.textAlign = "center";
        ctx.shadowColor = tpl.bg[0] === "#ffffff" ? "transparent" : "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        lines.forEach((l2, i) => {
          ctx.fillStyle = tpl.textColor;
          ctx.fillText(l2, 270, startY + i * lineH);
        });
      }
      ctx.font = "700 18px Arial";
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.textAlign = "right";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.fillText("sachi™", 520, 930);
      setProgress(30);
      const blob = await new Promise((r2) => canvas.toBlob(r2, "image/jpeg", 0.92));
      const imgFile = new File([blob], `textpost_${Date.now()}.jpg`, { type: "image/jpeg" });
      setStep("Uploading...");
      const img_url = await uploadFile(imgFile);
      setProgress(75);
      setStep("Posting...");
      const textGeo = await getPostLocation();
      const username = currentUser.full_name || ((_a = currentUser.email) == null ? void 0 : _a.split("@")[0]) || "user";
      await videos.create({
        user_id: currentUser.id,
        username,
        display_name: currentUser.full_name || username,
        avatar_url: localStorage.getItem(`avatar_${currentUser.id}`) || localStorage.getItem("avatar_last") || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url: img_url,
        thumbnail_url: img_url,
        photo_urls: JSON.stringify([img_url]),
        is_photo: true,
        caption: (postTitle ? postTitle + "\n" : "") + textPostContent.trim(),
        hashtags: (textPostContent.match(/#\w+/g) || []).map((t2) => t2.toLowerCase()),
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        shares_count: 0,
        is_approved: postVisibility !== "only_me",
        is_archived: false,
        is_ai_detected: false,
        is_mature: false,
        sound_title: "Text Post",
        sound_artist: "sachi",
        post_visibility: postVisibility,
        post_location_name: (postLocation == null ? void 0 : postLocation.name) || null,
        post_city: (postLocation == null ? void 0 : postLocation.city) || null,
        ...textGeo
      });
      setProgress(100);
      setStep("Posted! 🎉");
      setTimeout(() => {
        onUploaded();
        onClose();
      }, 1e3);
    } catch (e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false);
      setProgress(0);
      setStep("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showEditor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      VideoEditor,
      {
        file,
        onDone: (processed, overlays) => {
          setEditedFile(processed);
          if (overlays && overlays.length > 0) {
            const overlayText = overlays.map((o) => o.text).join(" · ");
            setCaption((prev) => prev ? prev + "\n" + overlayText : overlayText);
          }
          setShowEditor(false);
        },
        onSkip: () => {
          setEditedFile(null);
          setShowEditor(false);
        }
      }
    ),
    showPostDetails && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 3500, background: "#0B0C1A", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowPostDetails(false),
            style: { background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1 },
            children: "‹"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 17 }, children: "Post details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32 } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "20px 20px 40px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: postTitle,
              onChange: (e) => setPostTitle(e.target.value),
              placeholder: "Add a catchy title...",
              style: {
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1.5px solid rgba(255,255,255,0.15)",
                padding: "10px 0",
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                outline: "none",
                boxSizing: "border-box"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 12, marginTop: 6 }, children: "Writing a title helps get 3× more views on average" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: uploadTab === "text" ? textPostContent : caption,
            onChange: (e) => uploadTab === "text" ? setTextPostContent(e.target.value) : setCaption(e.target.value),
            placeholder: "Write a caption... #hashtags",
            rows: 3,
            style: {
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "12px 14px",
              color: "#fff",
              fontSize: 14,
              resize: "none",
              outline: "none",
              boxSizing: "border-box"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer" },
              onClick: detectLocation,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: "📍" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 700, fontSize: 15 }, children: "Location" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 8, background: "rgba(245,200,66,0.15)", color: "#F5C842", fontSize: 10, fontWeight: 800, borderRadius: 6, padding: "2px 6px", letterSpacing: 0.5 }, children: "REQUIRED" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  detectingLocation && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F5C842", fontSize: 12, fontWeight: 600 }, children: "📡 Detecting..." }),
                  postLocation && !detectingLocation && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#8BC34A", fontSize: 13, fontWeight: 600 }, children: [
                    "✓ ",
                    postLocation.name
                  ] }),
                  !postLocation && !detectingLocation && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff6b6b", fontSize: 12, fontWeight: 600 }, children: "Not set — tap to detect" })
                ] })
              ]
            }
          ),
          postLocation && !detectingLocation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, paddingBottom: 12, flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(139,195,74,0.12)", border: "1px solid rgba(139,195,74,0.25)", borderRadius: 20, padding: "5px 14px", fontSize: 13, color: "#8BC34A", display: "flex", alignItems: "center", gap: 6 }, children: [
            "📍 ",
            postLocation.name,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { onClick: detectLocation, style: { cursor: "pointer", color: "#666", fontSize: 11, marginLeft: 4 }, children: "↺ refresh" })
          ] }) }),
          !postLocation && !detectingLocation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { paddingBottom: 12 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff6b6b", fontSize: 11, opacity: 0.8 }, children: "📍 Location is required to post on Sachi. Tap above to detect automatically." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 4 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 0", cursor: "pointer" }, onClick: () => setShowVisibilityPicker((v2) => !v2), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: "🌐" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 700, fontSize: 15 }, children: "Who can view" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#aaa", fontSize: 13 }, children: postVisibility === "everyone" ? "Everyone" : postVisibility === "followers" ? "Followers only" : "Only me" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#555", fontSize: 18 }, children: showVisibilityPicker ? "▾" : "›" })
            ] })
          ] }),
          showVisibilityPicker && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 12, background: "rgba(255,255,255,0.04)", borderRadius: 14, overflow: "hidden" }, children: [
            { val: "everyone", icon: "🌐", label: "Everyone", sub: "Anyone on Sachi can see this" },
            { val: "followers", icon: "👥", label: "Followers only", sub: "Only people who follow you" },
            { val: "only_me", icon: "🔒", label: "Only me", sub: "Saved privately, not shown in feed" }
          ].map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: (e) => {
                e.stopPropagation();
                setPostVisibility(v2.val);
                setShowVisibilityPicker(false);
              },
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
                background: postVisibility === v2.val ? "rgba(245,200,66,0.07)" : "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: v2.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 14 }, children: v2.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 11 }, children: v2.sub })
                  ] })
                ] }),
                postVisibility === v2.val && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F5C842", fontSize: 18 }, children: "✓" })
              ]
            },
            v2.val
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 } }),
        uploadTab !== "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", marginBottom: 20 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: "🔞" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15 }, children: "Mature content" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 11 }, children: "18+ viewers only" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: () => setIsMature((m2) => !m2),
              style: {
                width: 48,
                height: 26,
                borderRadius: 13,
                background: isMature ? "#ff6b6b" : "rgba(255,255,255,0.12)",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.2s"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                top: 3,
                left: isMature ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
              } })
            }
          )
        ] }),
        uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 13, marginBottom: 8 }, children: step }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius: 99, transition: "width 0.4s ease" } }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 20px 40px", display: "flex", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowPostDetails(false),
            disabled: uploading,
            style: {
              flex: 1,
              padding: "14px 0",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              color: "#aaa",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer"
            },
            children: "← Back"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (!postLocation) {
                alert("📍 Please allow location access to post on Sachi.");
                detectLocation();
                return;
              }
              if (uploadTab === "text") uploadTextPost();
              else if (uploadTab === "photo") uploadPhotos();
              else upload();
            },
            disabled: uploading || detectingLocation,
            style: {
              flex: 2.5,
              padding: "14px 0",
              background: uploading ? "#333" : !postLocation || detectingLocation ? "rgba(255,107,107,0.25)" : "linear-gradient(135deg,#ff6b6b,#ff8e53)",
              border: !postLocation && !uploading ? "1.5px solid rgba(255,107,107,0.4)" : "none",
              borderRadius: 14,
              color: !postLocation && !uploading ? "rgba(255,255,255,0.4)" : "#fff",
              fontWeight: 900,
              fontSize: 16,
              cursor: uploading || detectingLocation ? "default" : "pointer",
              boxShadow: postLocation && !uploading ? "0 4px 20px rgba(255,107,107,0.35)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            },
            children: uploading ? step : detectingLocation ? "📡 Detecting location..." : !postLocation ? "📍 Location required" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18 }, children: "⬆" }),
              " Post"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 2e3, display: "flex", alignItems: "flex-end", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "relative",
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        background: "#0f0f1a",
        borderRadius: "24px 24px 0 0",
        zIndex: 2001,
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "env(safe-area-inset-bottom, 24px)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { overflowY: "auto", flex: 1, padding: "24px 24px 32px", WebkitOverflowScrolling: "touch" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 4, background: "#444", borderRadius: 99, margin: "0 auto 20px" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20 }, children: uploadTab === "video" ? "📹 Post a Video" : uploadTab === "photo" ? "🖼️ Post Photos" : "✏️ Text Post" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer" }, children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, marginBottom: 18, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 4 }, children: [{ id: "video", label: "🎬 Video" }, { id: "photo", label: "🖼️ Photos" }, { id: "text", label: "✏️ Text" }].map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setUploadTab(t2.id);
              setFile(null);
              setPhotos([]);
            },
            style: {
              flex: 1,
              padding: "10px 0",
              borderRadius: 11,
              border: "none",
              background: uploadTab === t2.id ? t2.id === "text" ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "transparent",
              color: uploadTab === t2.id ? "#fff" : "#888",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer"
            },
            children: t2.label
          },
          t2.id
        )) }),
        uploadTab !== "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }, children: "Video Length" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8 }, children: [
              { label: "15s", val: 15, icon: "⚡" },
              { label: "60s", val: 60, icon: "🎬" },
              { label: "10 min", val: 600, icon: "🎥" }
            ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setMaxDuration(opt.val),
                style: {
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 12,
                  border: maxDuration === opt.val ? "2px solid #ff6b6b" : "1px solid rgba(255,255,255,0.1)",
                  background: maxDuration === opt.val ? "rgba(255,107,107,0.18)" : "rgba(255,255,255,0.05)",
                  color: maxDuration === opt.val ? "#ff6b6b" : "#aaa",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18 }, children: opt.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt.label })
                ]
              },
              opt.val
            )) })
          ] }),
          uploadTab === "photo" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
            photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 12 }, children: [
              photos.map((p2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "2px solid rgba(255,107,107,0.3)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: URL.createObjectURL(p2), style: { width: "100%", height: "100%", objectFit: "cover" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => removePhoto(i),
                    style: {
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.7)",
                      border: "none",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      color: "#fff",
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1
                    },
                    children: "✕"
                  }
                ),
                i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 4, left: 4, background: "rgba(255,107,107,0.85)", borderRadius: 6, padding: "1px 6px", fontSize: 10, color: "#fff", fontWeight: 700 }, children: "Cover" })
              ] }, i)),
              photos.length < 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onClick: () => {
                    var _a;
                    return (_a = photoRef.current) == null ? void 0 : _a.click();
                  },
                  style: {
                    aspectRatio: "1",
                    borderRadius: 10,
                    border: "2px dashed rgba(255,255,255,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#888",
                    fontSize: 12,
                    gap: 4
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 24 }, children: "＋" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add more" })
                  ]
                }
              )
            ] }),
            photos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => {
                  var _a;
                  return (_a = photoRef.current) == null ? void 0 : _a.click();
                },
                style: { border: "2px dashed rgba(255,107,107,0.4)", borderRadius: 16, padding: 40, textAlign: "center", cursor: "pointer" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 10 }, children: "🖼️" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }, children: "Tap to select photos" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 13 }, children: "Up to 6 photos · JPG, PNG, HEIC" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: photoRef, type: "file", accept: "image/*", multiple: true, style: { display: "none" }, onChange: handlePhotoSelect }),
            photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: 12, textAlign: "center", marginTop: 4 }, children: [
              photos.length,
              "/6 photos selected · Tap ✕ to remove"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: !file ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => {
                var _a;
                return (_a = fileRef.current) == null ? void 0 : _a.click();
              },
              style: { border: "2px dashed rgba(255,107,107,0.4)", borderRadius: 16, padding: 48, textAlign: "center", cursor: "pointer", marginBottom: 16 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 10 }, children: "🎬" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }, children: "Tap to select video" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 13 }, children: "MP4, MOV, WebM · Max 500MB" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "video/*", style: { display: "none" }, onChange: (e) => {
                  const f2 = e.target.files[0];
                  if (!f2) return;
                  if (f2.size > 150 * 1024 * 1024) {
                    alert("Video must be under 150MB. Please trim or compress your video before uploading.");
                    e.target.value = "";
                    return;
                  }
                  setFile(f2);
                } })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32 }, children: "🎥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 600, fontSize: 14 }, children: file.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: 12 }, children: [
                (file.size / 1024 / 1024).toFixed(1),
                " MB"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFile(null), style: { background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: 18 }, children: "✕" })
          ] }) }),
          uploadTab !== "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", marginBottom: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: caption,
                onChange: (e) => setCaption(e.target.value.slice(0, 500)),
                placeholder: "Write a caption... #hashtags",
                rows: 3,
                style: { width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${caption.length > 480 ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: 12, color: "#fff", fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", paddingBottom: 28 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 8, right: 12, fontSize: 11, color: caption.length > 480 ? "#ff6b6b" : "#555" }, children: [
              caption.length,
              "/500"
            ] })
          ] })
        ] }),
        uploadTab === "text" && (() => {
          const TEXT_TEMPLATES = [
            {
              name: "Blush",
              id: 0,
              // Pink bg, black text, pink HIGHLIGHT block behind each line, emoji top-left
              bgStyle: "#f8b4cb",
              render: (text, mini) => {
                const lines = text ? text.split(" ").reduce((acc, w2) => {
                  const last = acc[acc.length - 1];
                  if (last && (last + " " + w2).length <= 12) {
                    acc[acc.length - 1] = last + " " + w2;
                  } else acc.push(w2);
                  return acc;
                }, []) : ["Hey", "happy", "Monday"];
                const fs = mini ? 11 : 38;
                const pad = mini ? "2px 5px" : "6px 14px";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: mini ? 3 : 8, padding: mini ? "8px" : "20px", width: "100%" }, children: [
                  !mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, marginBottom: 4 }, children: "😊" }),
                  mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, marginBottom: 2 }, children: "😊" }),
                  lines.map((l2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#e91e8c", display: "inline-block", padding: pad, borderRadius: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 900, color: "#111", fontFamily: "'Arial Black',sans-serif", lineHeight: 1.1 }, children: l2 }) }, i))
                ] });
              }
            },
            {
              name: "Note",
              id: 1,
              bgStyle: "linear-gradient(160deg,#b8d4f0,#d6e8ff)",
              render: (text, mini) => {
                const lines = text ? text.split(" ").reduce((acc, w2) => {
                  const last = acc[acc.length - 1];
                  if (last && (last + " " + w2).length <= 12) {
                    acc[acc.length - 1] = last + " " + w2;
                  } else acc.push(w2);
                  return acc;
                }, []) : ["Hey", "happy", "Monday"];
                const fs = mini ? 10 : 34;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: mini ? 2 : 6, padding: mini ? "8px" : "24px", width: "100%", height: "100%" }, children: lines.map((l2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#F5C842", display: "inline-block", padding: mini ? "1px 5px" : "4px 12px", borderRadius: 3, transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 900, color: "#222", fontFamily: "'Arial Black',sans-serif", lineHeight: 1.1 }, children: l2 }) }, i)) });
              }
            },
            {
              name: "Sakura",
              id: 2,
              bgStyle: "linear-gradient(135deg,#0B0C1A,#1a1040)",
              render: (text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: mini ? 3 : 10, padding: mini ? "8px" : "24px", width: "100%", height: "100%" }, children: [
                  !mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 4 }, children: "🌸" }),
                  mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12 }, children: "🌸" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 900, color: "#F5C842", fontFamily: "Georgia,serif", textAlign: "center", lineHeight: 1.3, wordBreak: "break-word" }, children: words })
                ] });
              }
            },
            {
              name: "Misty",
              id: 3,
              bgStyle: "linear-gradient(160deg,#d8e8f5,#eaf2ff)",
              render: (text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 30;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: mini ? "8px" : "24px", width: "100%", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 700, color: "#4a6fa5", fontFamily: "Georgia,serif", textAlign: "center", lineHeight: 1.4, wordBreak: "break-word", opacity: 0.85 }, children: words }) });
              }
            },
            {
              name: "Midnight",
              id: 4,
              bgStyle: "#111111",
              render: (text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: mini ? "8px" : "24px", width: "100%", height: "100%" }, children: [
                  mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12 }, children: "🌙" }),
                  !mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "🌙" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 900, color: "#fff", fontFamily: "'Arial Black',sans-serif", textAlign: "center", lineHeight: 1.3, wordBreak: "break-word" }, children: words })
                ] });
              }
            },
            {
              name: "Sunset",
              id: 5,
              bgStyle: "linear-gradient(135deg,#FF416C,#FF9500)",
              render: (text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: mini ? "8px" : "24px", width: "100%", height: "100%" }, children: [
                  !mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "🌅" }),
                  mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12 }, children: "🌅" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 900, color: "#fff", fontFamily: "'Arial Black',sans-serif", textAlign: "center", lineHeight: 1.3, wordBreak: "break-word", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }, children: words })
                ] });
              }
            },
            {
              name: "Ocean",
              id: 6,
              bgStyle: "linear-gradient(160deg,#0F2027,#2C5364)",
              render: (text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 32;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: mini ? "8px" : "24px", width: "100%", height: "100%" }, children: [
                  !mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "🌊" }),
                  mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12 }, children: "🌊" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 800, color: "#00E5FF", fontFamily: "Arial,sans-serif", textAlign: "center", lineHeight: 1.3, wordBreak: "break-word" }, children: words })
                ] });
              }
            },
            {
              name: "Gold",
              id: 7,
              bgStyle: "linear-gradient(135deg,#1a1a1a,#2d1a00)",
              render: (text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: mini ? "8px" : "24px", width: "100%", height: "100%" }, children: [
                  !mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "✨" }),
                  mini && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12 }, children: "✨" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: fs, fontWeight: 900, color: "#F5C842", fontFamily: "Georgia,serif", textAlign: "center", lineHeight: 1.3, wordBreak: "break-word", textShadow: "0 0 20px rgba(245,200,66,0.4)" }, children: words })
                ] });
              }
            }
          ];
          const tpl = TEXT_TEMPLATES[textPostTemplate] || TEXT_TEMPLATES[0];
          const displayText = textPostContent || "";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 14,
              aspectRatio: "4/5",
              maxHeight: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              position: "relative",
              background: tpl.bgStyle,
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)"
            }, children: [
              tpl.render(displayText, false),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                position: "absolute",
                bottom: 10,
                right: 14,
                color: "rgba(0,0,0,0.18)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1
              }, children: "sachi™" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                autoFocus: true,
                value: textPostContent,
                onChange: (e) => setTextPostContent(e.target.value),
                placeholder: "What's on your mind?",
                rows: 2,
                style: {
                  width: "100%",
                  background: "rgba(255,255,255,0.07)",
                  border: "2px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  color: "#fff",
                  fontSize: 16,
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 14,
                  fontWeight: 600,
                  lineHeight: 1.5
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 13, fontWeight: 600, marginBottom: 10 }, children: "Select a style" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }, children: TEXT_TEMPLATES.map((t2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onClick: () => setTextPostTemplate(i),
                style: {
                  flexShrink: 0,
                  width: 76,
                  height: 104,
                  borderRadius: 12,
                  background: t2.bgStyle,
                  border: textPostTemplate === i ? "3px solid #F5C842" : "2px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "stretch",
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: textPostTemplate === i ? "0 0 16px rgba(245,200,66,0.5)" : "0 2px 8px rgba(0,0,0,0.4)",
                  transition: "all 0.15s",
                  transform: textPostTemplate === i ? "scale(1.06)" : "scale(1)"
                },
                children: t2.render(displayText || "Hey happy Monday", true)
              },
              i
            )) })
          ] });
        })(),
        uploadTab !== "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setShowMusicPicker(true),
              style: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: `1px solid ${selectedTrack ? "rgba(245,200,66,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12, cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22 }, children: "🎵" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: selectedTrack ? "#F5C842" : "#fff", fontWeight: 700, fontSize: 14 }, children: selectedTrack ? selectedTrack.sound_title || selectedTrack.title : "Add Sound" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 12 }, children: selectedTrack ? selectedTrack.sound_artist || selectedTrack.artist : "Pick from trending, search, or Sachi creators" })
                ] }),
                selectedTrack && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                  e.stopPropagation();
                  setSelectedTrack(null);
                }, style: { background: "none", border: "none", color: "#ff6b6b", fontSize: 16, cursor: "pointer", padding: 0 }, children: "✕" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 18 }, children: "▶" })
              ]
            }
          ),
          showMusicPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
            MusicPicker,
            {
              currentSound: selectedTrack,
              onSelect: (track) => {
                setSelectedTrack(track);
                setShowMusicPicker(false);
              },
              onClose: () => setShowMusicPicker(false)
            }
          ),
          explicitBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.4)", borderRadius: 12, padding: "14px 16px", marginBottom: 12, display: "flex", gap: 10, alignItems: "flex-start" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, flexShrink: 0 }, children: "🔞" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff4444", fontWeight: 700, fontSize: 14, marginBottom: 4 }, children: "Explicit Content Not Allowed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#cc6666", fontSize: 13, lineHeight: 1.5 }, children: "Sachi does not allow sexual or explicit content. Please upload appropriate videos only." })
            ] })
          ] }),
          aiBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.4)", borderRadius: 12, padding: "14px 16px", marginBottom: 12, display: "flex", gap: 10, alignItems: "flex-start" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, flexShrink: 0 }, children: "🚫" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff4444", fontWeight: 700, fontSize: 16, marginBottom: 4 }, children: "Bruh. 💀" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#cc6666", fontSize: 14, lineHeight: 1.6 }, children: [
                "You can't upload AI videos on this site. 🚫🤖",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "Keep it real — post your own original content."
              ] })
            ] })
          ] }),
          !aiBlocked && !explicitBlocked && file && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => setIsMature((p2) => !p2),
                style: { display: "flex", gap: 10, alignItems: "center", cursor: "pointer", padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: `1px solid ${isMature ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}` },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 20, height: 20, borderRadius: 5, border: `2px solid ${isMature ? "#ff6b6b" : "#555"}`, background: isMature ? "#ff6b6b" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }, children: isMature && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: 13, fontWeight: 900 }, children: "✓" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: isMature ? "#ff6b6b" : "#888", fontSize: 13, lineHeight: 1.4 }, children: [
                    "🔞 This video contains ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "mature content" }),
                    " (violence, fighting, adult themes)"
                  ] })
                ]
              }
            ),
            isMature && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: matureReason,
                onChange: (e) => setMatureReason(e.target.value),
                style: { marginTop: 8, width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, color: "#fff", fontSize: 13, outline: "none" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "violence", children: "⚔️ Violence" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fighting", children: "🥊 Fighting / Combat" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "adult_themes", children: "🔞 Adult Themes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "strong_language", children: "🤬 Strong Language" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "⚠️ Other Mature Content" })
                ]
              }
            )
          ] }),
          !aiBlocked && !explicitBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => setIsAiGenerated((p2) => !p2),
                style: {
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "10px 14px",
                  background: isAiGenerated ? "rgba(255,149,0,0.08)" : "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  border: `1px solid ${isAiGenerated ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.1)"}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    border: `2px solid ${isAiGenerated ? "#FF9500" : "#555"}`,
                    background: isAiGenerated ? "#FF9500" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                    boxShadow: isAiGenerated ? "0 0 10px 3px rgba(255,149,0,0.7), 0 0 20px 6px rgba(255,149,0,0.3)" : "none"
                  }, children: isAiGenerated && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: 13, fontWeight: 900 }, children: "✓" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: isAiGenerated ? "#FF9500" : "#888", fontSize: 13, lineHeight: 1.4 }, children: [
                    "🤖 ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Flag as AI" }),
                    " — let your viewers know this content was AI generated"
                  ] })
                ]
              }
            ),
            isAiGenerated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8, padding: "10px 14px", background: "rgba(255,149,0,0.07)", borderRadius: 10, border: "1px solid rgba(255,149,0,0.2)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#FF9500", fontSize: 12, lineHeight: 1.5 }, children: [
              "⚠️ Your post will be ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "held for MOD review" }),
              " before going live. If approved, it will show an ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "🤖 AI Generated" }),
              " badge. Sachi values truth — thanks for being honest."
            ] }) })
          ] }),
          !aiBlocked && !explicitBlocked && !isAiGenerated && file && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setNotAiConfirmed((p2) => !p2),
              style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 14, cursor: "pointer", padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: `1px solid ${notAiConfirmed ? "rgba(107,255,154,0.4)" : "rgba(255,255,255,0.1)"}` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 20, height: 20, borderRadius: 5, border: `2px solid ${notAiConfirmed ? "#6bff9a" : "#555"}`, background: notAiConfirmed ? "#6bff9a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }, children: notAiConfirmed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#0a0a14", fontSize: 13, fontWeight: 900 }, children: "✓" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: notAiConfirmed ? "#6bff9a" : "#888", fontSize: 13, lineHeight: 1.4 }, children: [
                  "I confirm this is ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "my original video" }),
                  " and is ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "NOT AI-generated" })
                ] })
              ]
            }
          )
        ] }),
        uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 13, marginBottom: 6 }, children: step }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius: 99, transition: "width 0.4s ease" } }) })
        ] }),
        uploadTab === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => textPostContent.trim() && !uploading && goToPostDetails(),
            disabled: !textPostContent.trim() || uploading,
            style: { width: "100%", padding: 14, background: textPostContent.trim() && !uploading ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16, cursor: textPostContent.trim() && !uploading ? "pointer" : "not-allowed", opacity: textPostContent.trim() && !uploading ? 1 : 0.5 },
            children: uploading ? step : "Next →"
          }
        ) : uploadTab === "photo" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => photos.length && !uploading && goToPostDetails(),
            disabled: !photos.length || uploading,
            style: { width: "100%", padding: 14, background: photos.length && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16, cursor: photos.length && !uploading ? "pointer" : "not-allowed", opacity: photos.length && !uploading ? 1 : 0.5 },
            children: uploading ? step : "Next →"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) && goToPostDetails(),
            disabled: !file || uploading || aiBlocked || explicitBlocked || !notAiConfirmed && !isAiGenerated,
            style: { width: "100%", padding: 14, background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16, cursor: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? "pointer" : "not-allowed", opacity: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? 1 : 0.5 },
            children: uploading ? step : "Next →"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: previewAudioRef, onEnded: () => setPreviewTrack(null), style: { display: "none" } })
  ] });
}
function getUserAge() {
  const dob = localStorage.getItem("sachi_dob");
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = /* @__PURE__ */ new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m2 = today.getMonth() - birthDate.getMonth();
  if (m2 < 0 || m2 === 0 && today.getDate() < birthDate.getDate()) age--;
  return age;
}
function VideoCard({ video, currentUser, onCommentOpen, onLike, onView, onNeedAuth, onDelete, onProfileOpen, followedUserIds, onFollowChange, onShareCount, onBookmark, blockedIds }) {
  var _a;
  const videoRef = reactExports.useRef(null);
  const soundRef = reactExports.useRef(null);
  const viewedRef = reactExports.useRef(false);
  const [playing, setPlaying] = reactExports.useState(false);
  const [liked, setLiked] = reactExports.useState(false);
  if (window.__sachiMuted === void 0) window.__sachiMuted = true;
  const [muted, _setMutedLocal] = reactExports.useState(() => window.__sachiMuted);
  const setMuted = (val) => {
    const newVal = typeof val === "function" ? val(window.__sachiMuted) : val;
    window.__sachiMuted = newVal;
    _setMutedLocal(newVal);
    window.dispatchEvent(new CustomEvent("sachi-mute-change", { detail: newVal }));
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      _setMutedLocal(e.detail);
    };
    window.addEventListener("sachi-mute-change", handler);
    return () => window.removeEventListener("sachi-mute-change", handler);
  }, []);
  const [photoIdx, setPhotoIdx] = reactExports.useState(0);
  reactExports.useRef(null);
  const [followRecord, setFollowRecord] = reactExports.useState(null);
  const isFollowing = followedUserIds ? followedUserIds.has(video.user_id || video.created_by) : !!followRecord;
  const [followLoading, setFollowLoading] = reactExports.useState(false);
  const [reportTarget, setReportTarget] = reactExports.useState(null);
  const [showUI, setShowUI] = reactExports.useState(false);
  const [userTapped, setUserTapped] = reactExports.useState(false);
  const uiTimerRef = reactExports.useRef(null);
  const photoUrls = video.is_photo && video.photo_urls ? Array.isArray(video.photo_urls) ? video.photo_urls : JSON.parse(video.photo_urls) : null;
  const isOwnVideo = currentUser && (currentUser.id === video.user_id || currentUser.email === video.created_by || currentUser.username && currentUser.username === video.username);
  const [ageGateUnlocked, setAgeGateUnlocked] = reactExports.useState(false);
  const userAge = getUserAge();
  const isUnder18 = userAge !== null && userAge < 18;
  const showMatureBlock = video.is_mature && isUnder18 && !ageGateUnlocked;
  const hideUIAfterDelay = (delay = 2e3) => {
    if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
    uiTimerRef.current = setTimeout(() => {
      setShowUI(false);
      setUserTapped(false);
    }, delay);
  };
  reactExports.useEffect(() => {
    return () => {
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    if (videoRef.current) videoRef.current.muted = video.sound_url ? true : muted;
    if (soundRef.current) {
      if (muted) {
        soundRef.current.pause();
      } else if (playing && video.sound_url) {
        soundRef.current.play().catch(() => {
        });
      }
    }
  }, [muted]);
  reactExports.useEffect(() => {
    const el2 = videoRef.current;
    if (!el2) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const currentlyMuted = window.__sachiMuted !== void 0 ? window.__sachiMuted : true;
        el2.muted = video.sound_url ? true : currentlyMuted;
        el2.play().catch(() => {
        });
        setPlaying(true);
        if (!currentlyMuted && soundRef.current && video.sound_url) {
          soundRef.current.play().catch(() => {
          });
        }
        setShowUI(true);
        hideUIAfterDelay(1500);
        if (!viewedRef.current) {
          viewedRef.current = true;
          onView && onView(video.id);
        }
      } else {
        el2.pause();
        setPlaying(false);
        if (soundRef.current) soundRef.current.pause();
        if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
        setShowUI(false);
        setUserTapped(false);
      }
    }, { threshold: 0.6 });
    obs.observe(el2);
    return () => obs.disconnect();
  }, []);
  reactExports.useEffect(() => {
    if (!currentUser) return;
    likes.checkUserLiked(video.id, currentUser.id).then((rec) => {
      if (rec) {
        setLiked(true);
        setLikeRecordId(rec.id);
      }
    }).catch(() => {
    });
  }, [video.id, currentUser == null ? void 0 : currentUser.id]);
  const doMute = () => {
    const el2 = videoRef.current;
    if (!el2) return;
    const wasPlaying = !el2.paused;
    const nm = !muted;
    el2.muted = video.sound_url ? true : nm;
    setMuted(nm);
    if (!nm && wasPlaying) {
      el2.play().catch(() => {
      });
      setPlaying(true);
      hideUIAfterDelay(1500);
    }
  };
  const doTogglePlay = () => {
    const el2 = videoRef.current;
    if (!el2) return;
    if (el2.paused) {
      el2.play();
      setPlaying(true);
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
      uiTimerRef.current = setTimeout(() => {
        setShowUI(false);
      }, 400);
    } else {
      el2.pause();
      setPlaying(false);
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
      setShowUI(true);
    }
  };
  const likeLockedRef = React$1.useRef(false);
  const doLike = async () => {
    var _a2;
    if (!currentUser) {
      onNeedAuth();
      return;
    }
    if (likeLockedRef.current || likeLoading) return;
    likeLockedRef.current = true;
    setLikeLoading(true);
    setTimeout(() => {
      likeLockedRef.current = false;
    }, 1e3);
    try {
      if (liked) {
        if (likeRecordId) await likes.remove(likeRecordId);
        setLiked(false);
        setLikeRecordId(null);
        onLike(video.id, -1);
      } else {
        const rec = await likes.add(
          video.id,
          currentUser.id,
          currentUser.username || ((_a2 = currentUser.email) == null ? void 0 : _a2.split("@")[0]) || "user",
          currentUser.display_name || currentUser.full_name || currentUser.username || "User",
          currentUser.avatar_url || currentUser.picture || ""
        );
        setLiked(true);
        setLikeRecordId(rec.id);
        onLike(video.id, 1);
      }
    } catch (e) {
      console.error("like error", e);
    }
    setLikeLoading(false);
  };
  const openLikesPanel = async () => {
    setShowLikesPanel(true);
    setLikesListLoading(true);
    try {
      const res = await likes.getByVideo(video.id);
      const items = Array.isArray(res) ? res : (res == null ? void 0 : res.items) || [];
      setLikesList(items);
    } catch (e) {
      setLikesList([]);
    }
    setLikesListLoading(false);
  };
  const doFollow = async () => {
    var _a2;
    if (!currentUser) {
      onNeedAuth();
      return;
    }
    if (isOwnVideo) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        try {
          const res = await follows.getFollowing(currentUser.id);
          const rec = (res.items || res || []).find((r2) => r2.following_id === (video.user_id || video.created_by));
          if (rec) await follows.unfollow(rec.id);
        } catch (e) {
        }
        setFollowRecord(null);
        if (onFollowChange) onFollowChange(video.user_id || video.created_by, false);
      } else {
        const rec = await follows.follow(
          currentUser.id,
          currentUser.username || ((_a2 = currentUser.email) == null ? void 0 : _a2.split("@")[0]),
          video.user_id,
          video.username
        );
        setFollowRecord(rec);
        if (onFollowChange) onFollowChange(video.user_id || video.created_by, true);
      }
    } catch (err) {
      console.error(err);
    }
    setFollowLoading(false);
  };
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [showFullCaption, setShowFullCaption] = reactExports.useState(false);
  const doDelete = async () => {
    if (!currentUser || !isOwnVideo) return;
    setShowDeleteConfirm(true);
  };
  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await videos.delete(video.id);
      onDelete && onDelete(video.id);
    } catch (err) {
      alert("Failed to delete. Try again.");
    }
  };
  const tap = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "100%", height: "100svh", background: "#0B0C1A", flexShrink: 0, scrollSnapAlign: "start" }, children: [
    showMatureBlock && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      inset: 0,
      zIndex: 200,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(11,12,26,0.92)",
      backdropFilter: "blur(20px)",
      gap: 16,
      padding: 32
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 52 }, children: "🔞" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 900, fontSize: 20, textAlign: "center" }, children: "Mature Content" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 14, textAlign: "center", lineHeight: 1.6 }, children: "This video contains content that may not be suitable for viewers under 18." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#666", fontSize: 12, textAlign: "center" }, children: [
        "Content type: ",
        video.mature_reason ? video.mature_reason.replace(/_/g, " ") : "mature"
      ] }),
      userAge === null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontSize: 13, textAlign: "center" }, children: "Sign in or verify your age to view this content." }),
      userAge !== null && userAge >= 18 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setAgeGateUnlocked(true),
          style: {
            padding: "12px 28px",
            background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
            border: "none",
            borderRadius: 14,
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer"
          },
          children: "I'm 18+ — View Anyway"
        }
      )
    ] }),
    photoUrls ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#000", display: "flex", flexDirection: "column", touchAction: "pan-y" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, position: "relative", overflow: "hidden", pointerEvents: "none" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: resolveMediaUrl(photoUrls[photoIdx]),
            style: { width: "100%", height: "100%", objectFit: "contain", display: "block", userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none" }
          }
        ),
        photoUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(0,0,0,0.7)",
          borderRadius: 20,
          padding: "4px 12px",
          fontSize: 13,
          fontWeight: 700,
          color: "#fff",
          zIndex: 50,
          pointerEvents: "none",
          letterSpacing: 0.5
        }, children: [
          photoIdx + 1,
          " / ",
          photoUrls.length
        ] })
      ] }),
      photoUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        bottom: 70,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        zIndex: 400,
        background: "rgba(0,0,0,0.6)",
        borderRadius: 40,
        padding: "10px 20px",
        backdropFilter: "blur(4px)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onTouchEnd: (e) => {
              e.stopPropagation();
              e.preventDefault();
              setPhotoIdx((p2) => Math.max(p2 - 1, 0));
            },
            onClick: (e) => {
              e.stopPropagation();
              setPhotoIdx((p2) => Math.max(p2 - 1, 0));
            },
            disabled: photoIdx === 0,
            style: {
              background: photoIdx === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              lineHeight: 1,
              color: photoIdx === 0 ? "rgba(255,255,255,0.25)" : "#fff",
              cursor: photoIdx === 0 ? "default" : "pointer",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              transition: "all 0.2s"
            },
            children: "‹"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: photoUrls.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: i === photoIdx ? 28 : 10,
          height: 10,
          borderRadius: 99,
          background: i === photoIdx ? "#F5C842" : "rgba(255,255,255,0.5)",
          transition: "all 0.25s ease",
          boxShadow: i === photoIdx ? "0 0 10px rgba(245,200,66,0.9)" : "none"
        } }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onTouchEnd: (e) => {
              e.stopPropagation();
              e.preventDefault();
              setPhotoIdx((p2) => Math.min(p2 + 1, photoUrls.length - 1));
            },
            onClick: (e) => {
              e.stopPropagation();
              setPhotoIdx((p2) => Math.min(p2 + 1, photoUrls.length - 1));
            },
            disabled: photoIdx === photoUrls.length - 1,
            style: {
              background: photoIdx === photoUrls.length - 1 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              lineHeight: 1,
              color: photoIdx === photoUrls.length - 1 ? "rgba(255,255,255,0.25)" : "#fff",
              cursor: photoIdx === photoUrls.length - 1 ? "default" : "pointer",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              transition: "all 0.2s"
            },
            children: "›"
          }
        )
      ] }),
      video.sound_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            ref: soundRef,
            src: video.sound_url,
            loop: true,
            preload: "auto",
            style: { display: "none" },
            onCanPlay: () => {
              if (!muted && soundRef.current) soundRef.current.play().catch(() => {
              });
            }
          }
        ),
        muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onTouchStart: (e) => {
              e.stopPropagation();
              setMuted(false);
              if (soundRef.current) {
                soundRef.current.play().catch(() => {
                });
              }
            },
            onClick: (e) => {
              e.stopPropagation();
              setMuted(false);
              if (soundRef.current) {
                soundRef.current.play().catch(() => {
                });
              }
            },
            style: {
              position: "absolute",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 200,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "6px 16px",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              whiteSpace: "nowrap"
            },
            children: "🔇 Tap to hear music"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onTouchStart: (e) => {
              e.stopPropagation();
              setMuted(true);
              if (soundRef.current) {
                soundRef.current.pause();
              }
            },
            onClick: (e) => {
              e.stopPropagation();
              setMuted(true);
              if (soundRef.current) {
                soundRef.current.pause();
              }
            },
            style: {
              position: "absolute",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 200,
              background: "rgba(245,200,66,0.2)",
              border: "1px solid rgba(245,200,66,0.5)",
              borderRadius: 20,
              padding: "6px 16px",
              color: "#F5C842",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              whiteSpace: "nowrap"
            },
            children: [
              "🎵 ",
              video.sound_title || "Playing music"
            ]
          }
        )
      ] })
    ] }) : (() => {
      const resolvedVideoUrl = resolveMediaUrl(video.video_url);
      const isImg = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "");
      if (isImg) return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: resolvedVideoUrl,
          style: { width: "100%", height: "100%", objectFit: "contain", background: "#000", display: "block" }
        }
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            src: resolvedVideoUrl,
            poster: resolveMediaUrl(video.thumbnail_url),
            loop: true,
            playsInline: true,
            muted: muted || !!video.sound_url,
            onPlay: () => {
              setPlaying(true);
              hideUIAfterDelay(1500);
              if (soundRef.current && video.sound_url && !muted) {
                soundRef.current.play().catch(() => {
                });
              }
            },
            onPause: () => {
              setPlaying(false);
              if (soundRef.current) soundRef.current.pause();
            },
            style: { width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: "block" }
          }
        ),
        video.sound_url && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            ref: soundRef,
            src: video.sound_url,
            loop: true,
            preload: "none",
            style: { display: "none" }
          }
        ),
        muted && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onTouchStart: (e) => {
              e.stopPropagation();
              const el2 = videoRef.current;
              if (el2) {
                const wasPlaying = !el2.paused;
                el2.muted = false;
                setMuted(false);
                if (wasPlaying) {
                  el2.play().catch(() => {
                  });
                  setPlaying(true);
                  hideUIAfterDelay(1500);
                  if (soundRef.current && video.sound_url) {
                    soundRef.current.play().catch(() => {
                    });
                  }
                }
              }
            },
            onClick: (e) => {
              e.stopPropagation();
              const el2 = videoRef.current;
              if (el2) {
                const wasPlaying = !el2.paused;
                el2.muted = false;
                setMuted(false);
                if (wasPlaying) {
                  el2.play().catch(() => {
                  });
                  setPlaying(true);
                  hideUIAfterDelay(1500);
                  if (soundRef.current && video.sound_url) {
                    soundRef.current.play().catch(() => {
                    });
                  }
                }
              }
            },
            style: {
              position: "absolute",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 200,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "6px 16px",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              whiteSpace: "nowrap"
            },
            children: "🔇 Tap to unmute"
          }
        )
      ] });
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,12,26,0.95) 0%, rgba(11,12,26,0.3) 50%, transparent 80%)", pointerEvents: "none", zIndex: 10, transition: "opacity 0.4s ease", opacity: showUI || !!photoUrls ? 1 : 0, visibility: showUI || !!photoUrls ? "visible" : "hidden" } }),
    !photoUrls && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: tap(() => {
          const resolvedVideoUrl = resolveMediaUrl(video.video_url);
          const isImg = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "");
          if (isImg || !video.video_url) {
            setShowUI((v2) => !v2);
            if (!showUI) setShowFullCaption(true);
          } else {
            doTogglePlay();
          }
        }),
        style: { position: "absolute", top: 60, left: 0, right: 0, bottom: 80, zIndex: 50, cursor: "pointer" }
      }
    ),
    !playing && !photoUrls && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: tap(doTogglePlay), style: {
      background: "rgba(11,12,26,0.7)",
      border: "1.5px solid rgba(245,200,66,0.4)",
      borderRadius: "50%",
      width: 64,
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "auto",
      cursor: "pointer",
      fontSize: 26
    }, children: "▶" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 148, left: 16, right: 16, zIndex: 500, transition: "opacity 0.4s ease", opacity: showUI || !!photoUrls ? 1 : 0, pointerEvents: showUI || !!photoUrls ? "auto" : "none", visibility: showUI || !!photoUrls ? "visible" : "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: { display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" },
          onClick: tap(() => onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }, children: video.display_name || video.username }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.35)", fontSize: 12 }, children: [
              "@",
              video.username
            ] })
          ]
        }
      ),
      video.sound_title && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6, overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, flexShrink: 0, animation: playing ? "spin 3s linear infinite" : "none", display: "inline-block" }, children: "🎵" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflow: "hidden", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          color: "rgba(255,255,255,0.85)",
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
          animation: playing ? "marquee 8s linear infinite" : "none",
          display: "inline-block"
        }, children: [
          video.sound_title,
          video.sound_artist ? ` · ${video.sound_artist}` : ""
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }, children: !video.is_ai_detected ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, background: "rgba(107,255,154,0.15)", color: "#6BFFB8", padding: "2px 9px", borderRadius: 20, fontWeight: 700, border: "1px solid rgba(107,255,154,0.3)" }, children: "✓ Real" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, background: "rgba(255,149,0,0.15)", color: "#FF9500", padding: "2px 9px", borderRadius: 20, fontWeight: 700, border: "1px solid rgba(255,149,0,0.3)" }, children: "🤖 AI Generated" }) }),
      video.caption && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontSize: 14, lineHeight: 1.5 }, children: [
        showFullCaption || (video.caption || "").length <= 80 ? video.caption : (video.caption || "").slice(0, 80) + "…",
        (video.caption || "").length > 80 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            onClick: tap(() => setShowFullCaption((v2) => !v2)),
            style: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginLeft: 6, cursor: "pointer", fontWeight: 600 },
            children: showFullCaption ? "see less" : "see more"
          }
        )
      ] }),
      ((_a = video.hashtags) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontSize: 13, marginTop: 4 }, children: video.hashtags.slice(0, 4).map((t2) => `#${t2.replace(/^#/, "")}`).join(" ") }),
      video.created_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        marginTop: 8,
        background: "rgba(0,0,0,0.45)",
        borderRadius: 20,
        padding: "3px 10px",
        width: "fit-content"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12 }, children: "📅" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }, children: [
          formatDate(video.created_date),
          video.post_country && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: 6, opacity: 0.9 }, children: [
            countryFlag(video.post_country),
            (() => {
              const city = video.post_city || null;
              const stateAbbr = video.post_region ? getStateAbbr(video.post_region, video.post_country) : null;
              if (city && stateAbbr) return ` ${city}, ${stateAbbr}`;
              if (city) return ` ${city}`;
              if (stateAbbr) return ` ${stateAbbr}`;
              return ` ${video.post_country}`;
            })()
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 72, left: 14, display: "flex", flexDirection: "row", alignItems: "center", gap: 10, zIndex: 999 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: (e) => {
            e.stopPropagation();
            onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name);
          },
          style: { width: 22, height: 22, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(245,200,66,0.7)", cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.5)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: video.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username)}&background=random&color=fff&size=128&bold=true&format=png`,
              style: { width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }
            }
          )
        }
      ),
      !isOwnVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            doFollow();
          },
          disabled: followLoading,
          style: {
            height: 28,
            borderRadius: 20,
            border: isFollowing ? "1.5px solid #F5C842" : "1.5px solid rgba(255,255,255,0.5)",
            background: isFollowing ? "rgba(245,200,66,0.15)" : "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            color: isFollowing ? "#F5C842" : "#fff",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.3,
            padding: "0 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            boxShadow: isFollowing ? "0 0 10px rgba(245,200,66,0.3)" : "none",
            transition: "all 0.25s",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation"
          },
          children: followLoading ? "·" : isFollowing ? "✓ Following" : "+ Follow"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", right: 12, bottom: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 500, transition: "opacity 0.4s ease", opacity: showUI || !!photoUrls ? 1 : 0, pointerEvents: showUI || !!photoUrls ? "auto" : "none", visibility: showUI || !!photoUrls ? "visible" : "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: tap(doMute),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 28, height: 28, borderRadius: 8, background: muted ? "rgba(245,200,66,0.12)" : "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: muted ? "1px solid rgba(245,200,66,0.35)" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }, children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#F5C842", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "17", y1: "9", x2: "23", y2: "15" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.9)", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: tap(async () => {
            if (!currentUser) {
              onNeedAuth();
              return;
            }
            if (!window.confirm(video.is_ai_detected ? "Clear AI flag from this post?" : "Flag this post as AI-generated content?")) return;
            try {
              const newFlag = !video.is_ai_detected;
              await videos.update(video.id, { is_ai_detected: newFlag });
              onLike(video.id, 0);
            } catch (e) {
            }
          }),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 28,
              height: 28,
              borderRadius: 8,
              background: video.is_ai_detected ? "rgba(0,255,120,0.12)" : "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: video.is_ai_detected ? "2px solid rgba(0,255,120,0.9)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: video.is_ai_detected ? "0 0 10px 3px rgba(0,255,120,0.5), 0 0 20px 6px rgba(0,255,120,0.2)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13 }, children: video.is_ai_detected ? "🤖" : "🚩" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: video.is_ai_detected ? "#00ff78" : "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 700 }, children: video.is_ai_detected ? "AI" : "Flag" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: tap(doLike),
            disabled: likeLoading,
            style: {
              background: "none",
              border: "none",
              cursor: likeLoading ? "default" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              opacity: likeLoading ? 0.6 : 1
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 28,
              height: 28,
              borderRadius: 8,
              background: liked ? "rgba(255,107,107,0.25)" : "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: liked ? "1px solid rgba(255,107,107,0.5)" : "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: liked ? "heartpop 0.4s ease forwards" : "none",
              transformOrigin: "center",
              transition: "background 0.2s, border 0.2s"
            }, children: likeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: "⏳" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: liked ? "#FF6B6B" : "none", stroke: "#FF6B6B", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: tap(openLikesPanel),
            style: { background: "none", border: "none", cursor: "pointer", padding: 0, WebkitTapHighlightColor: "transparent" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.8)", fontSize: 9, fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.3)" }, children: formatCount(video.likes_count || 0) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: tap(() => onCommentOpen(video)),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.9)", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.8)", fontSize: 9, fontWeight: 600 }, children: formatCount(video.comments_count) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: tap(async () => {
            var _a2;
            const shareUrl = `${window.location.origin}?v=${video.id}`;
            if (navigator.share) {
              navigator.share({ title: video.caption || "Check this out on Sachi", url: shareUrl });
            } else {
              (_a2 = navigator.clipboard) == null ? void 0 : _a2.writeText(shareUrl);
              alert("Link copied!");
            }
            try {
              const newCount = (video.shares_count || 0) + 1;
              onShareCount && onShareCount(video.id, newCount);
              await videos.update(video.id, { shares_count: newCount });
            } catch (e) {
            }
          }),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.9)", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "5", r: "3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6", cy: "12", r: "3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "19", r: "3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.8)", fontSize: 9, fontWeight: 600 }, children: formatCount(video.shares_count || 0) })
          ]
        }
      ),
      currentUser && (() => {
        var _a2;
        const isBookmarked = (_a2 = onBookmark == null ? void 0 : onBookmark.isBookmarked) == null ? void 0 : _a2.call(onBookmark, video.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: tap(async () => {
              if (!currentUser) {
                onNeedAuth && onNeedAuth();
                return;
              }
              (onBookmark == null ? void 0 : onBookmark.handle) && onBookmark.handle(video.id, !isBookmarked);
            }),
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 28, height: 28, borderRadius: 8, background: isBookmarked ? "rgba(245,200,66,0.15)" : "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: `1px solid ${isBookmarked ? "rgba(245,200,66,0.5)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: isBookmarked ? "#F5C842" : "none", stroke: isBookmarked ? "#F5C842" : "rgba(255,255,255,0.9)", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: isBookmarked ? "#F5C842" : "rgba(255,255,255,0.8)", fontSize: 9, fontWeight: 600 }, children: "Save" })
            ]
          }
        );
      })(),
      isOwnVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: tap(doDelete),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 28, height: 28, borderRadius: 8, background: "rgba(255,60,60,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,60,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#ff5555", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "3 6 5 6 21 6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 11v6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 11v6" })
          ] }) })
        }
      )
    ] }),
    reportTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(ReportModal, { video: reportTarget, currentUser, onClose: () => setReportTarget(null) }),
    showLikesPanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center" },
        onClick: () => setShowLikesPanel(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), style: { width: "100%", maxWidth: 480, background: "#13142A", borderRadius: "24px 24px 0 0", padding: "0 0 40px", maxHeight: "70vh", display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18 }, children: "❤️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 800, fontSize: 16 }, children: likesListLoading ? "Likes" : `${likesList.length} ${likesList.length === 1 ? "Like" : "Likes"}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowLikesPanel(false), style: { background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 22, lineHeight: 1, padding: "2px 6px" }, children: "✕" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowY: "auto", flex: 1 }, children: likesListLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555", padding: 40, fontSize: 14 }, children: "Loading…" }) : likesList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: 40 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, marginBottom: 8 }, children: "🤍" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 14 }, children: "No likes yet — be the first!" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column" }, children: likesList.map((lk2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: lk2.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(lk2.display_name || lk2.username || "?")}&background=random&color=fff&size=64&bold=true&format=png`,
                style: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: lk2.display_name || lk2.username || "User" }),
              lk2.username && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 12 }, children: [
                "@",
                lk2.username
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#FF6B6B", fontSize: 16 }, children: "❤️" })
          ] }, lk2.id || i)) }) })
        ] })
      }
    ),
    showDeleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center" },
        onClick: () => setShowDeleteConfirm(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), style: { width: "100%", maxWidth: 480, background: "#1a1a2e", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", display: "flex", flexDirection: "column", gap: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, marginBottom: 8 }, children: "🗑️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 18, fontWeight: 700 }, children: "Delete Video?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 6 }, children: "This can't be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: confirmDelete,
              style: { width: "100%", padding: "14px", background: "#ff3b30", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
              children: "Yes, Delete"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowDeleteConfirm(false),
              style: { width: "100%", padding: "14px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" },
              children: "Cancel"
            }
          )
        ] })
      }
    )
  ] });
}
const REPORT_REASONS = [
  { id: "ai", icon: "🤖", label: "AI-Generated Video", desc: "This video was made by AI, not a real person" },
  { id: "sexual", icon: "🔞", label: "Sexual / Explicit Content", desc: "Contains nudity or sexual content" },
  { id: "fake", icon: "🎭", label: "Fake / Misleading", desc: "This video is fake or spreading misinformation" },
  { id: "spam", icon: "📢", label: "Spam", desc: "Repetitive, irrelevant, or promotional spam" },
  { id: "violence", icon: "⚠️", label: "Violence / Harmful Content", desc: "Contains graphic violence or harmful acts" },
  { id: "other", icon: "💬", label: "Other", desc: "Something else not listed above" }
];
function ReportModal({ video, currentUser, onClose }) {
  const [selected, setSelected] = reactExports.useState(null);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const submit = async () => {
    if (!selected) return;
    setSubmitted(true);
    try {
      await reports.create({
        video_id: video.id,
        reporter_id: (currentUser == null ? void 0 : currentUser.id) || "guest",
        reporter_username: (currentUser == null ? void 0 : currentUser.username) || (currentUser == null ? void 0 : currentUser.email) || "guest",
        video_caption: video.caption || "",
        video_username: video.username || video.display_name || "",
        reason: selected,
        status: "pending"
      });
    } catch (e) {
      console.error("Report failed:", e);
    }
    setTimeout(() => onClose(), 1800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 3e3, display: "flex", alignItems: "flex-end", justifyContent: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", background: "#1a1a2e", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "20px 20px 40px", zIndex: 3001 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 4, background: "#444", borderRadius: 99, margin: "0 auto 16px" } }),
      submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "24px 0" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "✅" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 6 }, children: "Report Submitted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 14 }, children: "Thanks for keeping Sachi safe. We'll review this video." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 16 }, children: "🚩 Report Video" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer" }, children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13, marginBottom: 16 }, children: "Why are you reporting this video?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }, children: REPORT_REASONS.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => setSelected(r2.id),
            style: { display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 12, cursor: "pointer", background: selected === r2.id ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${selected === r2.id ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.08)"}`, transition: "all 0.15s" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, flexShrink: 0 }, children: r2.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: selected === r2.id ? "#ff6b6b" : "#fff", fontWeight: 600, fontSize: 14 }, children: r2.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 12, marginTop: 2 }, children: r2.desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected === r2.id ? "#ff6b6b" : "#444"}`, background: selected === r2.id ? "#ff6b6b" : "transparent", flexShrink: 0 } })
            ]
          },
          r2.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: submit,
            disabled: !selected,
            style: { width: "100%", padding: 14, background: selected ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 700, fontSize: 15, cursor: selected ? "pointer" : "not-allowed", opacity: selected ? 1 : 0.5 },
            children: "Submit Report"
          }
        )
      ] })
    ] })
  ] });
}
const spinStyle = document.createElement("style");
spinStyle.textContent = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
  @keyframes heartbeat {
    0%   { transform: scale(1); }
    14%  { transform: scale(1.35); }
    28%  { transform: scale(1); }
    42%  { transform: scale(1.25); }
    56%  { transform: scale(1); }
    100% { transform: scale(1); }
  }
  @keyframes heartpop {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.5); }
    60%  { transform: scale(0.9); }
    80%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
`;
if (!document.getElementById("spin-style")) {
  spinStyle.id = "spin-style";
  document.head.appendChild(spinStyle);
}
const AVATAR_STYLES = [
  { label: "Cartoon", style: "avataaars", seeds: ["Felix", "Aneka", "Mia", "Zara", "Leo", "Nova", "Kira", "Blaze", "Pixel", "Storm", "Echo", "Sage", "Raya", "Kofi", "Priya", "Omar", "Mei", "Ava", "Jake", "Luna", "Diego", "Aisha", "Nate", "Yuki"] },
  { label: "Portraits", style: "lorelei", seeds: ["Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Riley", "Quinn", "Avery", "Blake", "Cameron", "Dana", "Ellis", "Fynn", "Gwen", "Harley", "Indie", "Jules", "Kai"] },
  { label: "Fun", style: "bottts", seeds: ["R2D2", "BB8", "Wall-E", "Robo", "Zap", "Bolt", "Chip", "Digi", "Glitch", "Mega", "Nano", "Pixel", "Spark", "Vibe", "Wave", "Flux", "Glow", "Nova", "Atom", "Echo"] },
  { label: "Minimal", style: "thumbs", seeds: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon"] }
];
function AvatarCropEditor({ imageUrl, onSave, onCancel }) {
  const canvasRef = reactExports.useRef();
  const [scale, setScale] = reactExports.useState(1);
  const [offset, setOffset] = reactExports.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = reactExports.useState(false);
  const dragStart = reactExports.useRef(null);
  const imgRef = reactExports.useRef(new window.Image());
  const SIZE = 300;
  reactExports.useEffect(() => {
    const img = imgRef.current;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const fit = Math.max(SIZE / img.width, SIZE / img.height);
      setScale(fit);
      setOffset({ x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
      draw(fit, { x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
    };
    img.src = imageUrl;
  }, [imageUrl]);
  const draw = (s = scale, o = offset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRef.current, o.x, o.y, imgRef.current.width * s, imgRef.current.height * s);
    ctx.restore();
  };
  reactExports.useEffect(() => {
    draw();
  }, [scale, offset]);
  const onMouseDown = (e) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const newOffset = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    setOffset(newOffset);
  };
  const onMouseUp = () => setDragging(false);
  const onTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y };
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (!dragging) return;
    setOffset({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  };
  const onTouchEnd = () => setDragging(false);
  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onSave(dataUrl);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 3e3, background: "rgba(0,0,0,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 900, fontSize: 18, marginBottom: 8 }, children: "✂️ Crop your avatar" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13, marginBottom: 20 }, children: "Drag to reposition • Zoom with slider" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderRadius: "50%", overflow: "hidden", border: "3px solid #F5C842", boxShadow: "0 0 30px rgba(245,200,66,0.3)", marginBottom: 20, cursor: dragging ? "grabbing" : "grab" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        ref: canvasRef,
        width: SIZE,
        height: SIZE,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave: onMouseUp,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        style: { display: "block", touchAction: "none" }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: 280, marginBottom: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 12 }, children: "🔍 Zoom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          const img = imgRef.current;
          const fit = Math.min(SIZE / img.width, SIZE / img.height);
          setScale(fit);
          setOffset({ x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
        }, style: { background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.4)", borderRadius: 8, padding: "3px 10px", color: "#F5C842", fontSize: 11, fontWeight: 700, cursor: "pointer" }, children: "Fit whole image" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: 0.05,
          max: 4,
          step: 0.01,
          value: scale,
          onChange: (e) => setScale(parseFloat(e.target.value)),
          style: { width: "100%", accentColor: "#F5C842" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, width: "100%", maxWidth: 280 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, style: { flex: 1, padding: "13px 0", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, color: "#aaa", fontWeight: 700, fontSize: 15, cursor: "pointer" }, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, style: { flex: 2, padding: "13px 0", background: "linear-gradient(135deg,#F5C842,#FF9500)", border: "none", borderRadius: 14, color: "#0B0C1A", fontWeight: 900, fontSize: 15, cursor: "pointer" }, children: "✓ Use this photo" })
    ] })
  ] });
}
function AvatarPickerModal({ currentAvatar, onSelect, onClose }) {
  const [uploading, setUploading] = reactExports.useState(false);
  const [activeStyle, setActiveStyle] = reactExports.useState(0);
  const [cropImageUrl, setCropImageUrl] = reactExports.useState(null);
  const fileRef = reactExports.useRef();
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropImageUrl(url);
  };
  const handleCropSave = async (dataUrl) => {
    setCropImageUrl(null);
    setUploading(true);
    try {
      const base64 = dataUrl;
      const res = await fetch("https://sachi-c7f0261c.base44.app/functions/uploadAvatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, mime_type: "image/jpeg" })
      });
      const data = await res.json();
      if (data.file_url) {
        onSelect(data.file_url);
        return;
      }
      throw new Error(data.error || "Upload failed");
    } catch (e) {
      console.warn("Avatar upload failed:", e);
      alert("Could not save avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    cropImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AvatarCropEditor,
      {
        imageUrl: cropImageUrl,
        onSave: handleCropSave,
        onCancel: () => setCropImageUrl(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 2e3, display: "flex", alignItems: "flex-end", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", background: "#1a1a2e", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "20px 20px 36px", zIndex: 2001 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 4, background: "#444", borderRadius: 99, margin: "0 auto 16px" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 16 }, children: "🎨 Choose your avatar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer" }, children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: handleFileUpload }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                var _a;
                return (_a = fileRef.current) == null ? void 0 : _a.click();
              },
              disabled: uploading,
              style: { width: "100%", padding: "13px", background: "linear-gradient(135deg,rgba(245,200,66,0.15),rgba(255,149,0,0.1))", border: "2px dashed rgba(245,200,66,0.5)", borderRadius: 14, color: "#F5C842", fontWeight: 800, fontSize: 15, cursor: "pointer" },
              children: uploading ? "⏳ Uploading..." : "📷 Upload & crop your photo"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", scrollbarWidth: "none" }, children: AVATAR_STYLES.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setActiveStyle(i),
            style: {
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              background: activeStyle === i ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.07)",
              color: activeStyle === i ? "#fff" : "#aaa"
            },
            children: s.label
          },
          i
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, maxHeight: 260, overflowY: "auto", paddingBottom: 4 }, children: AVATAR_STYLES[activeStyle].seeds.map((seed, i) => {
          const style = AVATAR_STYLES[activeStyle].style;
          const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0B0C1A,1a1a2e,2d2d44`;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onSelect(url),
              style: {
                background: currentAvatar === url ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.06)",
                border: currentAvatar === url ? "3px solid #F5C842" : "3px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                width: 64,
                height: 64,
                margin: "0 auto",
                padding: 4,
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border 0.2s, transform 0.15s, box-shadow 0.2s",
                boxShadow: currentAvatar === url ? "0 0 12px rgba(245,200,66,0.4)" : "none",
                transform: currentAvatar === url ? "scale(1.12)" : "scale(1)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, style: { width: "100%", height: "100%", pointerEvents: "none", display: "block", borderRadius: 10, background: "rgba(255,255,255,0.05)" }, loading: "lazy" })
            },
            i
          );
        }) })
      ] })
    ] })
  ] });
}
function ProfileVideoPlayer({ videos: vids, startIndex, onClose, profile, username }) {
  const [idx, setIdx] = React$1.useState(startIndex || 0);
  const [muted, setMuted] = React$1.useState(false);
  const videoRef = React$1.useRef(null);
  const touchStartY = React$1.useRef(null);
  const v2 = vids[idx];
  React$1.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
      });
    }
  }, [idx]);
  const goNext = () => {
    if (idx < vids.length - 1) setIdx((i) => i + 1);
  };
  const goPrev = () => {
    if (idx > 0) setIdx((i) => i - 1);
  };
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartY.current = null;
  };
  if (!v2) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onTouchStart,
      onTouchEnd,
      style: { position: "fixed", inset: 0, zIndex: 5e3, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            src: resolveMediaUrl(v2.video_url),
            autoPlay: true,
            playsInline: true,
            loop: true,
            muted,
            onClick: () => {
              if (videoRef.current.paused) videoRef.current.play();
              else videoRef.current.pause();
            },
            style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
          },
          v2.id
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", padding: "50px 16px 16px", zIndex: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              style: {
                background: "rgba(0,0,0,0.4)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: "←"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, textAlign: "center", color: "#fff", fontWeight: 800, fontSize: 15 }, children: (profile == null ? void 0 : profile.display_name) || username }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setMuted((m2) => !m2),
              style: {
                background: "rgba(0,0,0,0.4)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: muted ? "🔇" : "🔊"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 40px", zIndex: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: (profile == null ? void 0 : profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
                style: { width: 36, height: 36, borderRadius: "50%", border: "2px solid #ff6b6b" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontWeight: 800, fontSize: 14 }, children: [
              "@",
              username
            ] })
          ] }),
          v2.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 13, lineHeight: 1.5, marginBottom: 8 }, children: v2.caption }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.7)", fontSize: 12 }, children: [
              "❤️ ",
              v2.likes_count || 0
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.7)", fontSize: 12 }, children: [
              "💬 ",
              v2.comments_count || 0
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.7)", fontSize: 12 }, children: [
              "👁 ",
              v2.views_count || 0
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 4, zIndex: 10 }, children: vids.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => setIdx(i),
            style: {
              width: 4,
              height: i === idx ? 20 : 6,
              borderRadius: 4,
              background: i === idx ? "#ff6b6b" : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "height 0.2s"
            }
          },
          i
        )) }),
        idx > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: goPrev,
            style: {
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              zIndex: 10
            },
            children: "↑"
          }
        ),
        idx < vids.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: goNext,
            style: {
              position: "absolute",
              top: "50%",
              right: 54,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              zIndex: 10
            },
            children: "↓"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 16, right: 16, color: "rgba(255,255,255,0.5)", fontSize: 11, zIndex: 10 }, children: [
          idx + 1,
          " / ",
          vids.length
        ] })
      ]
    }
  );
}
function UserProfileSheet({ userId, username, currentUser, onClose }) {
  const [profile, setProfile] = React$1.useState(null);
  const [userVideos, setUserVideos] = React$1.useState([]);
  const [loading, setLoading] = React$1.useState(true);
  const [followRecord, setFollowRecord] = React$1.useState(null);
  const [followLoading, setFollowLoading] = React$1.useState(false);
  const [playerIndex, setPlayerIndex] = React$1.useState(null);
  const isOwnProfile = currentUser && currentUser.id === userId;
  React$1.useEffect(() => {
    setLoading(true);
    Promise.all([
      request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser?limit=200`).catch(() => null),
      videos.byUser(userId).catch(() => []),
      // Live follower count: how many people follow this profile
      request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?following_id=${userId}&limit=500`).catch(() => null),
      // Live following count: how many people this profile follows
      request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_id=${userId}&limit=500`).catch(() => null)
    ]).then(([userRes, vids, followersRes, followingRes]) => {
      const allUsers = (userRes == null ? void 0 : userRes.items) || userRes || [];
      const u2 = allUsers.find((x2) => x2.id === userId || x2.created_by === userId) || null;
      const liveFollowers = ((followersRes == null ? void 0 : followersRes.items) || followersRes || []).length;
      const liveFollowing = ((followingRes == null ? void 0 : followingRes.items) || followingRes || []).length;
      setProfile(u2 ? { ...u2, followers_count: liveFollowers, following_count: liveFollowing } : { followers_count: liveFollowers, following_count: liveFollowing });
      const vidList = Array.isArray(vids) ? vids : (vids == null ? void 0 : vids.items) || [];
      setUserVideos(vidList);
      setLoading(false);
    });
    if (currentUser && !isOwnProfile) {
      follows.getFollowing(currentUser.id).then((res) => {
        const rec = (res.items || res || []).find((r2) => r2.following_id === userId);
        if (rec) setFollowRecord(rec);
      }).catch(() => {
      });
    }
  }, [userId]);
  const doFollow = async () => {
    var _a;
    if (!currentUser || isOwnProfile) return;
    setFollowLoading(true);
    try {
      if (followRecord) {
        await follows.unfollow(followRecord.id);
        setFollowRecord(null);
        setProfile((p2) => p2 ? { ...p2, followers_count: Math.max(0, (p2.followers_count || 1) - 1) } : p2);
      } else {
        const rec = await follows.follow(
          currentUser.id,
          currentUser.username || ((_a = currentUser.email) == null ? void 0 : _a.split("@")[0]),
          userId,
          username
        );
        setFollowRecord(rec);
        setProfile((p2) => p2 ? { ...p2, followers_count: (p2.followers_count || 0) + 1 } : p2);
      }
      try {
        const myFollowingRes = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_id=${currentUser.id}&limit=500`);
        const myFollowingCount = ((myFollowingRes == null ? void 0 : myFollowingRes.items) || myFollowingRes || []).length;
        setProfile((p2) => p2 ? { ...p2 } : p2);
        localStorage.setItem(`sachi_following_count_${currentUser.id}`, myFollowingCount);
      } catch (e) {
      }
    } catch (e) {
      console.error(e);
    }
    setFollowLoading(false);
  };
  const displayName = (profile == null ? void 0 : profile.display_name) || username || "User";
  const avatarUrl = (profile == null ? void 0 : profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 4e3, display: "flex", alignItems: "flex-end", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "relative",
        background: "#0f0f1a",
        borderRadius: "24px 24px 0 0",
        width: "100%",
        maxWidth: 480,
        maxHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        zIndex: 4001,
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 4, background: "#333", borderRadius: 99, margin: "14px auto 0", flexShrink: 0 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: {
          position: "absolute",
          top: 12,
          right: 16,
          background: "none",
          border: "none",
          color: "#888",
          fontSize: 22,
          cursor: "pointer",
          zIndex: 1
        }, children: "✕" }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: 60, color: "#555" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, marginBottom: 8 }, children: "⏳" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Loading profile..." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 20px 20px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: avatarUrl,
                style: { width: 80, height: 80, borderRadius: "50%", border: "3px solid #ff6b6b", marginBottom: 10, background: "#1a1a2e" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 18 }, children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#666", fontSize: 13, marginBottom: 4 }, children: [
              "@",
              username
            ] }),
            (profile == null ? void 0 : profile.bio) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: 13, marginBottom: 8, lineHeight: 1.5 }, children: profile.bio }),
            (profile == null ? void 0 : profile.location) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#666", fontSize: 12, marginBottom: 8 }, children: [
              "📍 ",
              profile.location
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: 28, marginTop: 12, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 18 }, children: userVideos.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 11 }, children: "Videos" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 18 }, children: (profile == null ? void 0 : profile.followers_count) || 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 11 }, children: "Followers" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 18 }, children: (profile == null ? void 0 : profile.following_count) || 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 11 }, children: "Following" })
              ] })
            ] }),
            !isOwnProfile && currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: doFollow,
                disabled: followLoading,
                style: {
                  padding: "10px 40px",
                  borderRadius: 24,
                  background: followRecord ? "#22c55e" : "#ff0000",
                  border: "none",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  opacity: followLoading ? 0.6 : 1,
                  boxShadow: followRecord ? "0 2px 12px rgba(34,197,94,0.5)" : "0 2px 12px rgba(255,0,0,0.4)",
                  transition: "background 0.25s, box-shadow 0.25s",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation"
                },
                children: followLoading ? "..." : followRecord ? "✓ Following" : "+ Follow"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowY: "auto", flex: 1, padding: 2 }, children: userVideos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: 40, color: "#444" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, marginBottom: 8 }, children: "🎬" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "No videos yet" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }, children: userVideos.map((v2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setPlayerIndex(i),
              style: { position: "relative", aspectRatio: "1/1", background: "#111", overflow: "hidden", cursor: "pointer" },
              children: [
                v2.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: resolveMediaUrl(v2.thumbnail_url), style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: resolveMediaUrl(v2.video_url), style: { width: "100%", height: "100%", objectFit: "cover" }, muted: true, playsInline: true, preload: "metadata" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, opacity: 0.8 }, children: "▶" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 4, left: 6, color: "#fff", fontSize: 11, fontWeight: 700 }, children: [
                  "❤️ ",
                  v2.likes_count || 0
                ] })
              ]
            },
            v2.id
          )) }) })
        ] })
      ] })
    ] }),
    playerIndex !== null && userVideos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfileVideoPlayer,
      {
        videos: userVideos,
        startIndex: playerIndex,
        profile,
        username,
        onClose: () => setPlayerIndex(null)
      }
    )
  ] });
}
function VideoManageGrid({ videos: vids, onRefresh }) {
  const [menuVideo, setMenuVideo] = React$1.useState(null);
  const [editVideo, setEditVideo] = React$1.useState(null);
  const [editCaption, setEditCaption] = React$1.useState("");
  const [saving, setSaving] = React$1.useState(false);
  const [confirmDelete, setConfirmDelete] = React$1.useState(null);
  const handleDelete = async () => {
    try {
      setSaving(true);
      await videos.delete(confirmDelete.id);
      setConfirmDelete(null);
      onRefresh();
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };
  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await videos.update(editVideo.id, { caption: editCaption });
      setEditVideo(null);
      onRefresh();
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };
  if (!vids || vids.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#555" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 8 }, children: "📹" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "No videos yet" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }, children: vids.map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: { position: "relative", aspectRatio: "9/16", background: "#111", overflow: "hidden", cursor: "pointer" },
        onClick: () => setMenuVideo(v2),
        children: [
          v2.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: resolveMediaUrl(v2.thumbnail_url), style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }, children: "🎬" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            top: 6,
            right: 6,
            background: "rgba(0,0,0,0.6)",
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#fff",
            lineHeight: 1
          }, children: "⋮" }),
          v2.views_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            bottom: 4,
            left: 4,
            background: "rgba(0,0,0,0.6)",
            borderRadius: 8,
            padding: "2px 6px",
            fontSize: 10,
            color: "#fff"
          }, children: [
            "👁 ",
            v2.views_count
          ] })
        ]
      },
      v2.id
    )) }),
    menuVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 8e3, display: "flex", flexDirection: "column", justifyContent: "flex-end" },
        onClick: () => setMenuVideo(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { background: "#1a1a2e", borderRadius: "20px 20px 0 0", padding: 20, maxWidth: 480, width: "100%", margin: "0 auto" },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 54, height: 72, background: "#111", borderRadius: 8, overflow: "hidden", flexShrink: 0 }, children: menuVideo.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: menuVideo.thumbnail_url, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }, children: "🎬" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 14 }, children: menuVideo.caption || "(no caption)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: 12, marginTop: 4 }, children: [
                    "👁 ",
                    menuVideo.views_count || 0,
                    "  ❤️ ",
                    menuVideo.likes_count || 0,
                    "  💬 ",
                    menuVideo.comments_count || 0
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setEditCaption(menuVideo.caption || "");
                    setEditVideo(menuVideo);
                    setMenuVideo(null);
                  },
                  style: {
                    width: "100%",
                    padding: "14px 0",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10
                  },
                  children: "✏️ Edit Caption"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setConfirmDelete(menuVideo);
                    setMenuVideo(null);
                  },
                  style: {
                    width: "100%",
                    padding: "14px 0",
                    background: "rgba(229,57,53,0.15)",
                    border: "1px solid rgba(229,57,53,0.4)",
                    borderRadius: 12,
                    color: "#ff6b6b",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10
                  },
                  children: "🗑️ Delete Video"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setMenuVideo(null),
                  style: { width: "100%", padding: "12px 0", background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer" },
                  children: "Cancel"
                }
              )
            ]
          }
        )
      }
    ),
    editVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 8e3, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
        onClick: () => setEditVideo(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { background: "#1a1a2e", borderRadius: 20, padding: 24, width: "100%", maxWidth: 420 },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 16 }, children: "✏️ Edit Caption" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: editCaption,
                  onChange: (e) => setEditCaption(e.target.value),
                  placeholder: "Write a caption...",
                  rows: 4,
                  style: {
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    color: "#fff",
                    padding: 12,
                    fontSize: 14,
                    resize: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setEditVideo(null),
                    style: {
                      flex: 1,
                      padding: "12px 0",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      color: "#aaa",
                      fontSize: 14,
                      cursor: "pointer"
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleSaveEdit,
                    disabled: saving,
                    style: {
                      flex: 2,
                      padding: "12px 0",
                      background: "linear-gradient(135deg,#e91e63,#9c27b0)",
                      border: "none",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.7 : 1
                    },
                    children: saving ? "Saving..." : "Save Changes"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    confirmDelete && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "fixed", inset: 0, zIndex: 8e3, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#1a1a2e", borderRadius: 20, padding: 24, width: "100%", maxWidth: 380, textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🗑️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 8 }, children: "Delete this video?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13, marginBottom: 24 }, children: "This can't be undone. The video will be permanently removed." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setConfirmDelete(null),
            style: {
              flex: 1,
              padding: "12px 0",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#aaa",
              fontSize: 14,
              cursor: "pointer"
            },
            children: "Keep it"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleDelete,
            disabled: saving,
            style: {
              flex: 1,
              padding: "12px 0",
              background: "rgba(229,57,53,0.9)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer"
            },
            children: saving ? "Deleting..." : "Yes, Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
function Toast({ msg, type = "success" }) {
  if (!msg) return null;
  const bg2 = type === "error" ? "linear-gradient(135deg,#c62828,#b71c1c)" : type === "live" ? "linear-gradient(135deg,#e53935,#b71c1c)" : "linear-gradient(135deg,#2e7d32,#1b5e20)";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: bg2, color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 30, boxShadow: "0 6px 28px rgba(0,0,0,0.5)", whiteSpace: "nowrap", pointerEvents: "none" }, children: msg });
}
function RecentEpisodes({ episodes = [], loading = false, onEpisodeClick }) {
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 24, marginBottom: 8 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }, children: "Recent Episodes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.2)", fontSize: 13, padding: "12px 0" }, children: "Loading..." })
  ] });
  if (!episodes || !episodes.length) return null;
  const fmtDuration = (sec) => {
    if (!sec) return "";
    const h = Math.floor(sec / 3600);
    const m2 = Math.floor(sec % 3600 / 60);
    if (h > 0) return `${h}h ${m2}m`;
    return `${m2}m`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 24, marginBottom: 8 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }, children: "Recent Episodes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: episodes.map((ep, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => onEpisodeClick && onEpisodeClick(ep), style: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", transition: "background 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(108,60,247,0.15)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#6c3cf7,#4527a0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "#fff", fontSize: 14 }, children: ep.episode_number || i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }, children: ep.title }),
        ep.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: 6 }, children: ep.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          ep.duration_seconds > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: 11 }, children: [
            "⏱ ",
            fmtDuration(ep.duration_seconds)
          ] }),
          ep.listener_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: 11 }, children: [
            "🎧 ",
            ep.listener_count
          ] })
        ] })
      ] })
    ] }, ep.id || i)) })
  ] });
}
const PODCAST_COVER_COLORS = [
  { bg: "linear-gradient(135deg,#6c3cf7,#4527a0)", emoji: "🎙️" },
  { bg: "linear-gradient(135deg,#e53935,#b71c1c)", emoji: "🔥" },
  { bg: "linear-gradient(135deg,#0288d1,#01579b)", emoji: "🌊" },
  { bg: "linear-gradient(135deg,#2e7d32,#1b5e20)", emoji: "🌿" },
  { bg: "linear-gradient(135deg,#f57c00,#e65100)", emoji: "⚡" },
  { bg: "linear-gradient(135deg,#ad1457,#880e4f)", emoji: "💫" },
  { bg: "linear-gradient(135deg,#00838f,#006064)", emoji: "🎵" },
  { bg: "linear-gradient(135deg,#4e342e,#3e2723)", emoji: "☕" }
];
function PodcastPage({ currentUser, onNeedAuth }) {
  var _a;
  const CATEGORIES = ["All", "News & Politics", "Business", "Entertainment", "Comedy", "Sports", "Technology", "Health & Wellness", "True Crime", "Education"];
  const [podcasts, setPodcasts] = reactExports.useState([]);
  const [myShows, setMyShows] = reactExports.useState([]);
  const [loadingPodcasts, setLoadingPodcasts] = reactExports.useState(true);
  const [selectedCat, setSelectedCat] = reactExports.useState("All");
  const [selectedPodcast, setSelectedPodcast] = reactExports.useState(null);
  const [podcastEpisodes, setPodcastEpisodes] = reactExports.useState([]);
  const [episodesLoading, setEpisodesLoading] = reactExports.useState(false);
  const [showRegister, setShowRegister] = reactExports.useState(false);
  const [registerForm, setRegisterForm] = reactExports.useState({ title: "", host_name: "", description: "", category: "Business", live_stream_url: "", coverIdx: 0 });
  const [registering, setRegistering] = reactExports.useState(false);
  const [registerDone, setRegisterDone] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const [goingLive, setGoingLive] = reactExports.useState(false);
  const [endingLive, setEndingLive] = reactExports.useState(false);
  const [editingStream, setEditingStream] = reactExports.useState(false);
  const [selectedEpisode, setSelectedEpisode] = reactExports.useState(null);
  const [newStreamUrl, setNewStreamUrl] = reactExports.useState("");
  const [liveNewsChannel, setLiveNewsChannel] = reactExports.useState(null);
  const LIVE_NEWS_CHANNELS = [
    { id: "ctv", name: "CTV News", emoji: "🍁", desc: "Canada's #1 news network", color: "linear-gradient(135deg,#c62828,#b71c1c)", url: "https://www.youtube.com/embed/live_stream?channel=UCt2BNvKMDuNg38w2MgI4mIA&autoplay=1" },
    { id: "abc", name: "ABC News", emoji: "🇺🇸", desc: "Live U.S. news coverage", color: "linear-gradient(135deg,#1565c0,#0d47a1)", url: "https://www.youtube.com/embed/live_stream?channel=UCBi2mrWuNuyYy4gbM6fU18Q&autoplay=1" },
    { id: "bbc", name: "BBC News", emoji: "🇬🇧", desc: "Global news from London", color: "linear-gradient(135deg,#b71c1c,#880e4f)", url: "https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA&autoplay=1" },
    { id: "aljaz", name: "Al Jazeera", emoji: "🌍", desc: "Breaking news worldwide", color: "linear-gradient(135deg,#1b5e20,#004d40)", url: "https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1" },
    { id: "cnn", name: "CNN", emoji: "📡", desc: "24/7 breaking news", color: "linear-gradient(135deg,#c62828,#4a148c)", url: "https://www.youtube.com/embed/live_stream?channel=UCupvZG-5ko_eiXAupbDfxWw&autoplay=1" },
    { id: "sky", name: "Sky News", emoji: "🌐", desc: "Live from the UK", color: "linear-gradient(135deg,#0277bd,#01579b)", url: "https://www.youtube.com/embed/live_stream?channel=UCiU6U_f2KO7P6LFID9eQ4bA&autoplay=1" },
    { id: "dw", name: "DW News", emoji: "🇩🇪", desc: "International news in English", color: "linear-gradient(135deg,#37474f,#263238)", url: "https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1" },
    { id: "france", name: "France 24", emoji: "🇫🇷", desc: "Global news in English", color: "linear-gradient(135deg,#1565c0,#e53935)", url: "https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAoBw&autoplay=1" }
  ];
  const showToast = (msg, type = "success", ms = 3e3) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), ms);
  };
  reactExports.useEffect(() => {
    loadPodcasts();
  }, []);
  reactExports.useEffect(() => {
    if (currentUser) loadMyShows();
  }, [currentUser]);
  const loadPodcasts = async () => {
    setLoadingPodcasts(true);
    try {
      const APP_ID2 = "69b2ee18a8e6fb58c7f0261c";
      const data = await request("GET", `/apps/${APP_ID2}/entities/SachiPodcast?status=Active`);
      const list = Array.isArray(data) ? data : data.records || data.items || [];
      setPodcasts(list);
    } catch (e) {
      console.error("loadPodcasts failed:", e);
    } finally {
      setLoadingPodcasts(false);
    }
  };
  const loadMyShows = async () => {
    if (!currentUser) return;
    try {
      const APP_ID2 = "69b2ee18a8e6fb58c7f0261c";
      const data = await request("GET", `/apps/${APP_ID2}/entities/SachiPodcast`);
      const all = Array.isArray(data) ? data : data.records || data.items || [];
      const mine = all.filter(
        (p2) => {
          var _a2;
          return p2.host_user_id === currentUser.id || p2.host_username === (currentUser.full_name || ((_a2 = currentUser.email) == null ? void 0 : _a2.split("@")[0])) || p2.created_by === currentUser.email || currentUser.email === "jaygnz27@gmail.com" || currentUser.email === "lasanjaya@gmail.com";
        }
      );
      setMyShows(mine);
    } catch (e) {
      console.error("loadMyShows failed:", e);
    }
  };
  const filtered = selectedCat === "All" ? podcasts : podcasts.filter((p2) => p2.category === selectedCat);
  const livePodcasts = filtered.filter((p2) => p2.is_live);
  const regularPodcasts = filtered.filter((p2) => !p2.is_live);
  const handleRegister = async () => {
    var _a2;
    if (!registerForm.title || !registerForm.host_name) return;
    setRegistering(true);
    try {
      const cover = PODCAST_COVER_COLORS[registerForm.coverIdx || 0];
      await request("POST", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast`, {
        title: registerForm.title,
        host_name: registerForm.host_name,
        description: registerForm.description,
        category: registerForm.category,
        live_stream_url: registerForm.live_stream_url || "",
        cover_color: cover.bg,
        cover_emoji: cover.emoji,
        status: "Active",
        is_live: false,
        listener_count: 0,
        episode_count: 0,
        follower_count: 0,
        host_user_id: (currentUser == null ? void 0 : currentUser.id) || "",
        host_username: (currentUser == null ? void 0 : currentUser.full_name) || ((_a2 = currentUser == null ? void 0 : currentUser.email) == null ? void 0 : _a2.split("@")[0]) || ""
      });
      setRegisterDone(true);
      await loadPodcasts();
      await loadMyShows();
      fetch("https://sachi-c7f0261c.base44.app/functions/podcastWelcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host_email: (currentUser == null ? void 0 : currentUser.email) || "",
          host_name: registerForm.host_name,
          podcast_title: registerForm.title,
          category: registerForm.category
        })
      }).catch(() => {
      });
      setRegisterForm({ title: "", host_name: "", description: "", category: "Business", live_stream_url: "", coverIdx: 0 });
    } catch (e) {
      console.error(e);
      showToast("Something went wrong. Please try again.", "error");
    }
    setRegistering(false);
  };
  if (selectedEpisode) {
    const epUrl = selectedEpisode.live_stream_url || selectedEpisode.audio_url || selectedEpisode.video_url || "";
    const getEpEmbed = (url) => {
      if (!url) return null;
      if (url.includes("youtube.com/watch")) return url.replace("watch?v=", "embed/").split("&")[0] + "?autoplay=1";
      if (url.includes("youtu.be/")) return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1].split("?")[0] + "?autoplay=1";
      if (url.includes("rumble.com/embed")) return url.includes("?") ? url : url + "?pub=4";
      if (url.includes("rumble.com")) {
        const rmMatch = url.match(/rumble\.com\/(v[\w]+)-/);
        if (rmMatch) return `https://rumble.com/embed/${rmMatch[1]}/?pub=4`;
        return url;
      }
      if (url.includes("spotify.com/show/") || url.includes("spotify.com/episode/")) {
        const id2 = url.split("/").pop().split("?")[0];
        return url.includes("/episode/") ? `https://open.spotify.com/embed/episode/${id2}` : `https://open.spotify.com/embed/show/${id2}`;
      }
      return url;
    };
    const embedUrl = getEpEmbed(epUrl);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, background: "#0B0C1A", zIndex: 200, display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedEpisode(null), style: { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: 18 }, children: "←" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: selectedEpisode.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 12 }, children: [
            "Episode ",
            selectedEpisode.episode_number
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }, children: [
        embedUrl && (embedUrl.includes("youtube.com/embed") || embedUrl.includes("spotify.com/embed") || embedUrl.includes("rumble.com/embed")) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            src: embedUrl,
            style: { width: "100%", maxWidth: 700, height: embedUrl.includes("spotify") ? 232 : "56vw", maxHeight: 500, borderRadius: 16, border: "none" },
            allow: "autoplay; encrypted-media; fullscreen",
            allowFullScreen: true
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxWidth: 500, background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 32, textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 64, marginBottom: 16 }, children: "🎙️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }, children: selectedEpisode.title }),
          selectedEpisode.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }, children: selectedEpisode.description }),
          epUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: epUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              style: { display: "inline-block", background: "linear-gradient(135deg,#6c3cf7,#4527a0)", color: "#fff", padding: "14px 28px", borderRadius: 50, fontWeight: 700, fontSize: 15, textDecoration: "none" },
              children: "🎧 Listen Now"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.3)", fontSize: 14 }, children: "No stream URL available yet" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 24, width: "100%", maxWidth: 500 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7 }, children: selectedEpisode.description }) })
      ] })
    ] });
  }
  if (selectedPodcast) {
    const isHost = currentUser && (currentUser.id === selectedPodcast.host_user_id || currentUser.email === selectedPodcast.created_by || currentUser.full_name && currentUser.full_name === selectedPodcast.host_username || ((_a = currentUser.email) == null ? void 0 : _a.split("@")[0]) === selectedPodcast.host_username || currentUser.email === "jaygnz27@gmail.com" || currentUser.email === "lasanjaya@gmail.com");
    const coverBg = selectedPodcast.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
    const coverEmoji = selectedPodcast.cover_emoji || "🎙️";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 600, background: "#0B0C1A", overflowY: "auto" }, children: [
      toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { msg: toast.msg, type: toast.type }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", height: 240, background: coverBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSelectedPodcast(null),
            style: { position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.3)", border: "none", borderRadius: "50%", width: 38, height: 38, color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
            children: "←"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 60, marginBottom: 10 }, children: coverEmoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20, textAlign: "center", padding: "0 60px", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }, children: selectedPodcast.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 4 }, children: [
          "by ",
          selectedPodcast.host_name
        ] }),
        selectedPodcast.is_live && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 16, right: 16, background: "#e53935", borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6, animation: "pulse 1.5s infinite" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 7, height: 7, borderRadius: "50%", background: "#fff" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 800, fontSize: 12 }, children: "LIVE" })
        ] }),
        selectedPodcast.status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 16, right: 16, background: "rgba(245,200,66,0.9)", borderRadius: 20, padding: "5px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#000", fontWeight: 800, fontSize: 11 }, children: "⏳ PENDING REVIEW" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px 20px 100px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 0, marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 16, overflow: "hidden" }, children: [
          { val: selectedPodcast.follower_count || 0, label: "Followers" },
          { val: selectedPodcast.episode_count || 0, label: "Episodes" },
          { val: selectedPodcast.is_live ? selectedPodcast.listener_count || 0 : "—", label: "Listening", red: selectedPodcast.is_live }
        ].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "center", padding: "14px 0", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: s.red ? "#e53935" : "#fff", fontWeight: 800, fontSize: 18 }, children: s.val }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }, children: s.label })
        ] }, i)) }),
        selectedPodcast.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 16, marginBottom: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6 }, children: selectedPodcast.description }) }) : null,
        isHost && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 700, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }, children: "🎙️ Host Controls" }),
          selectedPodcast.is_live ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(229,57,53,0.08)", border: "1px solid rgba(229,57,53,0.3)", borderRadius: 14, padding: 14, marginBottom: 12, textAlign: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#e53935", fontWeight: 700, fontSize: 13 }, children: "🔴 You are currently LIVE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }, children: [
                selectedPodcast.listener_count || 0,
                " listeners tuned in"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 14, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }, children: "🔗 Stream URL" }),
              editingStream ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: newStreamUrl,
                    onChange: (e) => setNewStreamUrl(e.target.value),
                    placeholder: "https://youtube.com/watch?v=...",
                    style: { flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
                  try {
                    await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
                    setSelectedPodcast((p2) => ({ ...p2, live_stream_url: newStreamUrl }));
                    setEditingStream(false);
                    showToast("✅ Stream URL saved!", "success");
                  } catch (e) {
                    showToast("Failed to save URL", "error");
                  }
                }, style: { background: "#6c3cf7", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }, children: "Save" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingStream(false), style: { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontSize: 13, cursor: "pointer" }, children: "✕" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }, children: selectedPodcast.live_stream_url || "No stream URL set yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setNewStreamUrl(selectedPodcast.live_stream_url || "");
                      setEditingStream(true);
                    },
                    style: { background: "rgba(108,60,247,0.2)", border: "1px solid rgba(108,60,247,0.4)", borderRadius: 8, padding: "5px 12px", color: "#a78bfa", fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0 },
                    children: selectedPodcast.live_stream_url ? "Edit" : "Add URL"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: async () => {
                  if (endingLive) return;
                  setEndingLive(true);
                  try {
                    await fetch("https://sachi-c7f0261c.base44.app/functions/podcastGoLiveNotify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ podcast_id: selectedPodcast.id, set_live: false, admin_email: currentUser == null ? void 0 : currentUser.email })
                    }).catch(() => {
                    });
                    try {
                      await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, { is_live: false, listener_count: 0 });
                    } catch {
                    }
                    setSelectedPodcast((p2) => ({ ...p2, is_live: false, listener_count: 0 }));
                    setPodcasts((ps) => ps.map((p2) => p2.id === selectedPodcast.id ? { ...p2, is_live: false } : p2));
                    showToast("✅ Live session ended successfully", "success");
                  } catch (e) {
                    showToast("Failed to end session. Try again.", "error");
                  }
                  setEndingLive(false);
                },
                style: { width: "100%", padding: "15px 0", background: endingLive ? "rgba(229,57,53,0.3)" : "rgba(229,57,53,0.12)", border: "2px solid #e53935", borderRadius: 16, color: "#e53935", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
                children: endingLive ? "Ending..." : "⏹️ End Live Session"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 14, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }, children: [
                "🔗 Stream URL ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.25)" }, children: "(YouTube Live, Twitch, etc.)" })
              ] }),
              editingStream ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: newStreamUrl,
                    onChange: (e) => setNewStreamUrl(e.target.value),
                    placeholder: "https://youtube.com/live/...",
                    style: { flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
                  try {
                    await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
                    setSelectedPodcast((p2) => ({ ...p2, live_stream_url: newStreamUrl }));
                    setEditingStream(false);
                    showToast("✅ Stream URL saved!", "success");
                  } catch (e) {
                    showToast("Failed to save URL", "error");
                  }
                }, style: { background: "#6c3cf7", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }, children: "Save" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingStream(false), style: { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontSize: 13, cursor: "pointer" }, children: "✕" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }, children: selectedPodcast.live_stream_url || "No stream URL set yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setNewStreamUrl(selectedPodcast.live_stream_url || "");
                      setEditingStream(true);
                    },
                    style: { background: "rgba(108,60,247,0.2)", border: "1px solid rgba(108,60,247,0.4)", borderRadius: 8, padding: "5px 12px", color: "#a78bfa", fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0 },
                    children: selectedPodcast.live_stream_url ? "Edit" : "Add URL"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: async () => {
                  if (goingLive) return;
                  setGoingLive(true);
                  try {
                    const resp = await fetch("https://sachi-c7f0261c.base44.app/functions/podcastGoLiveNotify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ podcast_id: selectedPodcast.id, podcast_title: selectedPodcast.title, host_name: selectedPodcast.host_name, live_stream_url: selectedPodcast.live_stream_url || "", set_live: true, admin_email: currentUser == null ? void 0 : currentUser.email })
                    });
                    try {
                      await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, { is_live: true });
                    } catch {
                    }
                    setSelectedPodcast((p2) => ({ ...p2, is_live: true }));
                    setPodcasts((ps) => ps.map((p2) => p2.id === selectedPodcast.id ? { ...p2, is_live: true } : p2));
                    showToast("🔴 You are LIVE! Users are being notified.", "live");
                  } catch (e) {
                    showToast("Could not go live. Try again.", "error");
                  }
                  setGoingLive(false);
                },
                style: { width: "100%", padding: "16px 0", background: goingLive ? "rgba(229,57,53,0.4)" : "linear-gradient(135deg,#e53935,#b71c1c)", border: "none", borderRadius: 16, color: "#fff", fontWeight: 800, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 4px 24px rgba(229,57,53,0.35)" },
                children: goingLive ? "Going Live..." : "🔴 Go Live Now"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", marginTop: 8 }, children: "Tapping Go Live notifies ALL Sachi users instantly via email" })
          ] })
        ] }),
        !isHost && currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 16 }, children: selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
          const getEmbedUrl = (url) => {
            if (!url) return null;
            if (url.includes("rumble.com/c/")) {
              const ch2 = url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, "");
              return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${ch2}`;
            }
            const rumbleVideo = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)-/);
            if (rumbleVideo) return `https://rumble.com/embed/${rumbleVideo[1]}/`;
            if (url.includes("rumble.com/embed/")) return url;
            if (url.includes("youtube.com/embed/")) return url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1&rel=0");
            const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
            if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
            const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
            const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
            if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&rel=0`;
            return url;
          };
          const embedUrl = getEmbedUrl(selectedPodcast.live_stream_url);
          const [showPlayer, setShowPlayer] = React$1.useState(false);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 10, height: 10, background: "#e53935", borderRadius: "50%", animation: "pulse 1.2s infinite" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#e53935", fontWeight: 800, fontSize: 13, letterSpacing: 1 }, children: "LIVE NOW" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.35)", fontSize: 12 }, children: [
                "· ",
                selectedPodcast.listener_count || 0,
                " watching"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setShowPlayer(true),
                style: { display: "flex", width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#e53935,#b71c1c)", border: "none", borderRadius: 16, color: "#fff", fontWeight: 800, fontSize: 17, cursor: "pointer", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12, boxShadow: "0 4px 20px rgba(229,57,53,0.35)" },
                children: "🎧 Watch Live Now"
              }
            ),
            showPlayer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#000", zIndex: 9999, display: "flex", flexDirection: "column" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(0,0,0,0.85)", flexShrink: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 10, height: 10, background: "#e53935", borderRadius: "50%", animation: "pulse 1.2s infinite" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 800, fontSize: 15 }, children: selectedPodcast.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPlayer(false), style: { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: "✕" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "iframe",
                {
                  src: embedUrl,
                  style: { flex: 1, width: "100%", border: "none" },
                  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
                  allowFullScreen: true,
                  title: selectedPodcast.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 16px", background: "rgba(0,0,0,0.85)", textAlign: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.35)", fontSize: 12 }, children: "Streaming via Sachi · sachistream.com" }) })
            ] })
          ] });
        })() : !selectedPodcast.is_live ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => showToast("🔔 You will be notified when " + selectedPodcast.title + " goes live!", "success"),
            style: { width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#6c3cf7,#4527a0)", border: "none", borderRadius: 16, color: "#fff", fontWeight: 800, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 },
            children: "🔔 Follow & Get Notified"
          }
        ) : null }),
        !isHost && !currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 16 }, children: selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
          const getEmbedUrl = (url) => {
            if (!url) return null;
            if (url.includes("rumble.com/c/")) {
              const ch2 = url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, "");
              return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${ch2}`;
            }
            const rumbleVideo = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)-/);
            if (rumbleVideo) return `https://rumble.com/embed/${rumbleVideo[1]}/`;
            if (url.includes("rumble.com/embed/")) return url;
            if (url.includes("youtube.com/embed/")) return url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1&rel=0");
            const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
            if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
            const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
            const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
            if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&rel=0`;
            return url;
          };
          const embedUrl = getEmbedUrl(selectedPodcast.live_stream_url);
          return embedUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 10, height: 10, background: "#e53935", borderRadius: "50%", animation: "pulse 1.2s infinite" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#e53935", fontWeight: 800, fontSize: 13, letterSpacing: 1 }, children: "LIVE NOW" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: 14, overflow: "hidden", background: "#000", boxShadow: "0 4px 24px rgba(229,57,53,0.25)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "iframe",
              {
                src: embedUrl,
                style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" },
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
                title: selectedPodcast.title
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onNeedAuth, style: { width: "100%", marginTop: 12, padding: "13px 0", background: "rgba(108,60,247,0.15)", border: "1px solid rgba(108,60,247,0.4)", borderRadius: 14, color: "#a78bfa", fontWeight: 700, fontSize: 15, cursor: "pointer" }, children: "Sign in to Follow this Podcast" })
          ] }) : null;
        })() : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onNeedAuth, style: { width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#6c3cf7,#4527a0)", border: "none", borderRadius: 16, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", marginBottom: 16 }, children: "Sign in to Follow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RecentEpisodes, { episodes: podcastEpisodes, loading: episodesLoading, onEpisodeClick: setSelectedEpisode }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(108,60,247,0.2)", border: "1px solid rgba(108,60,247,0.4)", borderRadius: 20, padding: "4px 14px", color: "#a78bfa", fontSize: 12, fontWeight: 600 }, children: selectedPodcast.category }) })
      ] })
    ] });
  }
  if (showRegister) {
    const selectedCover = PODCAST_COVER_COLORS[registerForm.coverIdx || 0];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 600, background: "#0B0C1A", overflowY: "auto" }, children: [
      toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { msg: toast.msg, type: toast.type }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px", paddingTop: "calc(env(safe-area-inset-top,0px) + 20px)", paddingBottom: 60 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowRegister(false), style: { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 38, height: 38, color: "#fff", fontSize: 20, cursor: "pointer", flexShrink: 0 }, children: "←" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20 }, children: "🎙️ Register Your Podcast" })
        ] }),
        registerDone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "40px 20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 72, marginBottom: 16 }, children: "🎉" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 24, marginBottom: 10 }, children: "You are on the list!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 8, lineHeight: 1.6 }, children: [
            "Your show is ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#81c784" }, children: "live on Sachi right now." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "No waiting. No approval needed."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(46,125,50,0.1)", border: "1px solid rgba(46,125,50,0.3)", borderRadius: 14, padding: 16, margin: "20px 0 28px", textAlign: "left" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#81c784", fontWeight: 700, fontSize: 13, marginBottom: 8 }, children: "⚡ You are all set — here's how to go live:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7 }, children: [
              "1. Go to ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#fff" }, children: "Podcasts tab" }),
              ' and find your show under "My Shows"',
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "2. Tap your show to open it",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "3. (Optional) Add your stream link — YouTube Live, Twitch, etc.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "4. Tap ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "#e53935" }, children: "🔴 Go Live Now" }),
              " — all Sachi users get notified instantly"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setRegisterDone(false);
                setShowRegister(false);
              },
              style: { background: "linear-gradient(135deg,#6c3cf7,#4527a0)", border: "none", borderRadius: 14, padding: "14px 36px", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" },
              children: "Back to Podcasts"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 18 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 10, fontWeight: 600 }, children: "Choose Your Show Cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: PODCAST_COVER_COLORS.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setRegisterForm((p2) => ({ ...p2, coverIdx: i })),
                style: { width: 52, height: 52, borderRadius: 14, background: c.bg, border: registerForm.coverIdx === i ? "3px solid #F5C842" : "3px solid transparent", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" },
                children: c.emoji
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 12, width: "100%", height: 70, borderRadius: 16, background: selectedCover.bg, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 32 }, children: selectedCover.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 800, fontSize: 15, opacity: registerForm.title ? 1 : 0.4 }, children: registerForm.title || "Your Show Name" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6, fontWeight: 600 }, children: [
              "Podcast Title ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#e53935" }, children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: registerForm.title,
                onChange: (e) => setRegisterForm((p2) => ({ ...p2, title: e.target.value })),
                placeholder: "e.g. The Daily Grind",
                style: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6, fontWeight: 600 }, children: [
              "Your Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#e53935" }, children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: registerForm.host_name,
                onChange: (e) => setRegisterForm((p2) => ({ ...p2, host_name: e.target.value })),
                placeholder: "Full name or stage name",
                style: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6, fontWeight: 600 }, children: "What is your podcast about?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: registerForm.description,
                onChange: (e) => setRegisterForm((p2) => ({ ...p2, description: e.target.value })),
                placeholder: "Tell listeners what to expect — topics, guests, vibe...",
                rows: 3,
                style: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "#fff", fontSize: 15, outline: "none", resize: "none", boxSizing: "border-box" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6, fontWeight: 600 }, children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: registerForm.category,
                onChange: (e) => setRegisterForm((p2) => ({ ...p2, category: e.target.value })),
                style: { width: "100%", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "#fff", fontSize: 15, outline: "none" },
                children: ["Business", "News & Politics", "Entertainment", "Comedy", "Sports", "Technology", "Health & Wellness", "True Crime", "Society & Culture", "Education", "Other"].map(
                  (c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, style: { background: "#111" }, children: c }, c)
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6, fontWeight: 600 }, children: [
              "Stream URL ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.25)", fontWeight: 400 }, children: "(optional — add later too)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: registerForm.live_stream_url,
                onChange: (e) => setRegisterForm((p2) => ({ ...p2, live_stream_url: e.target.value })),
                placeholder: "https://youtube.com/live/... or Twitch link",
                style: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 5 }, children: "Where listeners will tune in when you go live. You can update this anytime." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleRegister,
              disabled: registering || !registerForm.title || !registerForm.host_name,
              style: { width: "100%", padding: "16px 0", background: !registerForm.title || !registerForm.host_name ? "rgba(108,60,247,0.3)" : registering ? "rgba(108,60,247,0.5)" : "linear-gradient(135deg,#6c3cf7,#4527a0)", border: "none", borderRadius: 16, color: "#fff", fontWeight: 800, fontSize: 17, cursor: !registerForm.title || !registerForm.host_name ? "not-allowed" : "pointer", marginTop: 4 },
              children: registering ? "⏳ Submitting..." : "Submit My Podcast →"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.2)", fontSize: 12, textAlign: "center" }, children: "Reviewed and approved within 24 hours" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { paddingTop: 70, paddingBottom: 80, minHeight: "100svh", background: "#0B0C1A" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { margin: "0 16px 20px", background: "linear-gradient(135deg,#1a0a2e,#0d1b4b)", borderRadius: 20, padding: "24px 20px", position: "relative", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: -20, right: -20, fontSize: 100, opacity: 0.07 }, children: "🎙️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#a78bfa", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }, children: "Sachi Podcasts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 8 }, children: [
          "Listen Live.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Discover New Shows."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }, children: "Tune into live sessions or browse on-demand — all in one place." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (!currentUser) {
                onNeedAuth();
                return;
              }
              setShowRegister(true);
            },
            style: { background: "linear-gradient(135deg,#6c3cf7,#4527a0)", border: "none", borderRadius: 12, padding: "10px 20px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
            children: "🎙️ Register Your Podcast"
          }
        )
      ] }),
      currentUser && myShows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { margin: "0 16px 20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 700, fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }, children: "🎙️ My Shows" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: myShows.map((p2) => {
          const coverBg = p2.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
          const coverEmoji = p2.cover_emoji || "🎙️";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: async () => {
                setSelectedPodcast(p2);
                setEpisodesLoading(true);
                setPodcastEpisodes([]);
                try {
                  const token = localStorage.getItem("token");
                  const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
                  const res = await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs });
                  const json = await res.json();
                  const items = Array.isArray(json) ? json : (json == null ? void 0 : json.records) || (json == null ? void 0 : json.items) || [];
                  const filtered2 = items.filter((ep) => ep.podcast_id === p2.id);
                  const sorted = filtered2.sort((a, b) => (b.episode_number || 0) - (a.episode_number || 0));
                  setPodcastEpisodes(sorted);
                } catch (e) {
                  setPodcastEpisodes([]);
                } finally {
                  setEpisodesLoading(false);
                }
              },
              style: { background: "rgba(245,200,66,0.05)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: 16, padding: 14, cursor: "pointer", display: "flex", gap: 14, alignItems: "center" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 52, height: 52, borderRadius: 12, background: coverBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }, children: coverEmoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: p2.title }),
                    p2.is_live && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#e53935", borderRadius: 20, padding: "2px 8px", color: "#fff", fontWeight: 700, fontSize: 10, flexShrink: 0 }, children: "LIVE" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 4 }, children: [
                    "by ",
                    p2.host_name
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "inline-block", background: p2.is_live ? "rgba(229,57,53,0.2)" : "rgba(46,125,50,0.2)", borderRadius: 20, padding: "2px 10px", color: p2.is_live ? "#ef9a9a" : "#81c784", fontSize: 11, fontWeight: 700 }, children: p2.is_live ? "🔴 Live Now" : "✅ Active" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.2)", fontSize: 20 }, children: "›" })
              ]
            },
            p2.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 16px 4px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#e53935", animation: "heartbeat 1.4s ease-in-out infinite" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 800, fontSize: 16 }, children: "Live News" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: 12 }, children: "• tap to watch" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto", display: "flex", gap: 12, paddingBottom: 16, scrollbarWidth: "none" }, children: LIVE_NEWS_CHANNELS.map((ch2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => setLiveNewsChannel(ch2),
            style: { flexShrink: 0, width: 140, borderRadius: 16, overflow: "hidden", cursor: "pointer", position: "relative" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 80, background: ch2.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }, children: ch2.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "8px 10px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 5, height: 5, borderRadius: "50%", background: "#e53935", flexShrink: 0 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: ch2.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 10, lineHeight: 1.3 }, children: ch2.desc })
              ] })
            ]
          },
          ch2.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto", display: "flex", gap: 8, padding: "0 16px 16px", scrollbarWidth: "none" }, children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedCat(cat),
          style: { flexShrink: 0, padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: selectedCat === cat ? "#6c3cf7" : "rgba(255,255,255,0.07)", color: selectedCat === cat ? "#fff" : "rgba(255,255,255,0.5)", WebkitTapHighlightColor: "transparent" },
          children: cat
        },
        cat
      )) }),
      livePodcasts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 24 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 16px 12px", display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#e53935" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 800, fontSize: 16 }, children: "Live Now" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 12, padding: "0 16px", overflowX: "auto", scrollbarWidth: "none" }, children: livePodcasts.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: async () => {
              setSelectedPodcast(p2);
              setEpisodesLoading(true);
              setPodcastEpisodes([]);
              try {
                const token = localStorage.getItem("token");
                const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
                const res = await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs });
                const json = await res.json();
                const items = Array.isArray(json) ? json : (json == null ? void 0 : json.records) || (json == null ? void 0 : json.items) || [];
                const filtered2 = items.filter((ep) => ep.podcast_id === p2.id);
                const sorted = filtered2.sort((a, b) => (b.episode_number || 0) - (a.episode_number || 0));
                setPodcastEpisodes(sorted);
              } catch (e) {
                setPodcastEpisodes([]);
              } finally {
                setEpisodesLoading(false);
              }
            },
            style: { flexShrink: 0, width: 200, background: "rgba(229,57,53,0.08)", border: "1.5px solid rgba(229,57,53,0.3)", borderRadius: 16, padding: 16, cursor: "pointer" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#e53935", display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 20, padding: "3px 10px", marginBottom: 10 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 6, height: 6, borderRadius: "50%", background: "#fff" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 700, fontSize: 11 }, children: "LIVE" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, marginBottom: 8 }, children: "🎙️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }, children: p2.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 8 }, children: p2.host_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#e53935", fontSize: 12, fontWeight: 600 }, children: [
                "🎧 ",
                p2.listener_count || 0,
                " listening"
              ] })
            ]
          },
          p2.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 16px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }, children: selectedCat === "All" ? "All Shows" : selectedCat }),
        loadingPodcasts && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "60px 0", color: "rgba(245,200,66,0.5)", fontSize: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 12, animation: "spin 1.5s linear infinite", display: "inline-block" }, children: "⟳" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Loading podcasts..." })
        ] }),
        !loadingPodcasts && regularPodcasts.length === 0 && livePodcasts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)", fontSize: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎙️" }),
          "No podcasts in this category yet."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: regularPodcasts.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: async () => {
              setSelectedPodcast(p2);
              setEpisodesLoading(true);
              setPodcastEpisodes([]);
              try {
                const token = localStorage.getItem("token");
                const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
                const res = await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs });
                const json = await res.json();
                const items = Array.isArray(json) ? json : (json == null ? void 0 : json.records) || (json == null ? void 0 : json.items) || [];
                const filtered2 = items.filter((ep) => ep.podcast_id === p2.id);
                const sorted = filtered2.sort((a, b) => (b.episode_number || 0) - (a.episode_number || 0));
                setPodcastEpisodes(sorted);
              } catch (e) {
                setPodcastEpisodes([]);
              } finally {
                setEpisodesLoading(false);
              }
            },
            style: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, cursor: "pointer", display: "flex", gap: 14, alignItems: "center" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 64, height: 64, borderRadius: 12, background: "linear-gradient(135deg,#1a0a2e,#0d1b4b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }, children: "🎙️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: p2.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 6 }, children: p2.host_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(108,60,247,0.2)", borderRadius: 20, padding: "2px 10px", color: "#a78bfa", fontSize: 11, fontWeight: 600 }, children: p2.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.25)", fontSize: 11 }, children: [
                    p2.follower_count || 0,
                    " followers"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.2)", fontSize: 20 }, children: "›" })
            ]
          },
          p2.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { margin: "32px 16px 0", background: "rgba(108,60,247,0.08)", border: "1px solid rgba(108,60,247,0.2)", borderRadius: 20, padding: 24, textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 12 }, children: "🚀" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 18, marginBottom: 8 }, children: "Have a podcast?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 16, lineHeight: 1.5 }, children: "Join Sachi and reach new listeners through our For You feed every day." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (!currentUser) {
                onNeedAuth();
                return;
              }
              setShowRegister(true);
            },
            style: { background: "linear-gradient(135deg,#6c3cf7,#4527a0)", border: "none", borderRadius: 14, padding: "13px 28px", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" },
            children: "Get Started Free →"
          }
        )
      ] })
    ] }),
    liveNewsChannel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 9999, background: "#000", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        background: "rgba(0,0,0,0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        zIndex: 1e4
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setLiveNewsChannel(null),
            style: { background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 4 },
            children: "✕"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#e53935", animation: "heartbeat 1.4s ease-in-out infinite" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fff", fontWeight: 800, fontSize: 16 }, children: [
            liveNewsChannel.emoji,
            " ",
            liveNewsChannel.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: "#e53935", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 6, padding: "2px 8px", letterSpacing: 1 }, children: "LIVE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40 } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "iframe",
        {
          src: liveNewsChannel.url,
          allow: "autoplay; encrypted-media; fullscreen; picture-in-picture",
          allowFullScreen: true,
          style: { position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" },
          title: liveNewsChannel.name + " Live"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        background: "rgba(0,0,0,0.9)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 16px",
        overflowX: "auto",
        display: "flex",
        gap: 10,
        scrollbarWidth: "none"
      }, children: LIVE_NEWS_CHANNELS.map((ch2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setLiveNewsChannel(ch2),
          style: {
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            background: ch2.id === liveNewsChannel.id ? "rgba(229,57,53,0.3)" : "rgba(255,255,255,0.07)",
            outline: ch2.id === liveNewsChannel.id ? "1.5px solid #e53935" : "none"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, children: ch2.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }, children: ch2.name })
          ]
        },
        ch2.id
      )) })
    ] })
  ] });
}
function AdminPanel({ currentUser }) {
  const [modTab, setModTab] = reactExports.useState("videos");
  const [allVideos, setAllVideos] = reactExports.useState([]);
  const [allUsers, setAllUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [analyticsLoading, setAnalyticsLoading] = reactExports.useState(false);
  const [analyticsData, setAnalyticsData] = reactExports.useState(null);
  const [analyticsError, setAnalyticsError] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await request("GET", "/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo?limit=500&sort=-created_date");
      setAllVideos(res.items || res || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const resp = await fetch("https://sachi-c7f0261c.base44.app/functions/getAdminStats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setAllUsers(data.users || []);
      setAnalyticsData(data.analytics);
    } catch (e) {
      console.error("analytics error", e);
      setAnalyticsError(e.message || "Failed to load analytics");
    }
    setAnalyticsLoading(false);
  };
  reactExports.useEffect(() => {
    loadVideos();
  }, []);
  reactExports.useEffect(() => {
    loadAnalytics();
  }, []);
  reactExports.useEffect(() => {
    if (modTab === "analytics") loadAnalytics();
  }, [modTab]);
  reactExports.useEffect(() => {
    if (modTab === "users") loadRegisteredUsers();
  }, [modTab]);
  const [registeredUsers, setRegisteredUsers] = reactExports.useState([]);
  const [usersLoading, setUsersLoading] = reactExports.useState(false);
  const loadRegisteredUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await fetch("https://sachi-c7f0261c.base44.app/functions/getAdminStats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      }).then((r2) => r2.json());
      if (data.error) throw new Error(data.error);
      setRegisteredUsers(data.users || []);
    } catch (e) {
      console.error("loadRegisteredUsers error", e);
    }
    setUsersLoading(false);
  };
  const toggleMature = async (video, reason) => {
    setSaving(video.id);
    try {
      const newMature = !video.is_mature;
      await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/${video.id}`, {
        is_mature: newMature,
        mature_reason: newMature ? reason || "other" : null
      });
      setAllVideos((prev) => prev.map((v2) => v2.id === video.id ? { ...v2, is_mature: newMature, mature_reason: newMature ? reason || "other" : null } : v2));
    } catch (e) {
      alert("Failed to update: " + e.message);
    }
    setSaving(null);
  };
  const deleteVideo = async (video) => {
    if (!window.confirm(`Delete "${video.caption || "this video"}"? This cannot be undone.`)) return;
    setSaving(video.id);
    try {
      await request("DELETE", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/${video.id}`);
      setAllVideos((prev) => prev.filter((v2) => v2.id !== video.id));
    } catch (e) {
      alert("Failed to delete: " + e.message);
    }
    setSaving(null);
  };
  const flagAI = async (video) => {
    setSaving(video.id);
    try {
      const newFlag = !video.is_ai_detected;
      await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/${video.id}`, { is_ai_detected: newFlag });
      setAllVideos((prev) => prev.map((v2) => v2.id === video.id ? { ...v2, is_ai_detected: newFlag } : v2));
    } catch (e) {
      alert("Failed to update: " + e.message);
    }
    setSaving(null);
  };
  const filtered = allVideos.filter((v2) => {
    if (filter === "mature" && !v2.is_mature) return false;
    if (filter === "clean" && v2.is_mature) return false;
    if (search && !((v2.caption || "").toLowerCase().includes(search.toLowerCase()) || (v2.username || "").toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });
  const reasons = ["violence", "fighting", "adult_themes", "strong_language", "other"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100svh", background: "#0B0C1A", paddingBottom: 120, paddingTop: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(14,14,28,0.98)", borderBottom: "1px solid rgba(245,200,66,0.15)", padding: "16px 20px 10px", position: "sticky", top: 0, zIndex: 100 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 900, fontSize: 20 }, children: "🛡️ Mod Panel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => modTab === "analytics" ? loadAnalytics() : modTab === "users" ? loadRegisteredUsers() : loadVideos(),
            style: { background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 20, padding: "7px 14px", color: "#888", fontWeight: 700, fontSize: 12, cursor: "pointer" },
            children: "↻ Refresh"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: modTab === "videos" ? 10 : 0 }, children: [["videos", "🎬 Videos"], ["ai", "🤖 AI Flagged"], ["users", "👥 Users"], ["analytics", "📊 Analytics"]].map(([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setModTab(val),
          style: {
            padding: "8px 18px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            background: modTab === val ? "linear-gradient(135deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.07)",
            color: modTab === val ? "#0B0C1A" : "#888",
            transition: "all 0.2s"
          },
          children: label
        },
        val
      )) }),
      modTab === "videos" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search by caption or username…",
            style: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", marginBottom: 10 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8 }, children: [["all", "All"], ["mature", "🔞 Mature"], ["clean", "✅ Clean"]].map(([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFilter(val),
            style: {
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              background: filter === val ? "linear-gradient(135deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.07)",
              color: filter === val ? "#0B0C1A" : "#888"
            },
            children: label
          },
          val
        )) })
      ] })
    ] }),
    modTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "16px 16px 20px" }, children: analyticsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555", padding: 60, fontSize: 14 }, children: "Loading analytics…" }) : analyticsError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "#FF6B6B", padding: 40, fontSize: 13 }, children: [
      "⚠️ ",
      analyticsError,
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: loadAnalytics, style: { marginTop: 12, background: "#F5C842", color: "#0B0C1A", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 700, cursor: "pointer" }, children: "Retry" })
    ] }) : !analyticsData ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555", padding: 60, fontSize: 14 }, children: "No data yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      (() => {
        const engRate = analyticsData.totalViews > 0 ? ((analyticsData.totalLikes + analyticsData.totalComments) / analyticsData.totalViews * 100).toFixed(1) : "0.0";
        const avgViews = analyticsData.totalVideos > 0 ? Math.round(analyticsData.totalViews / analyticsData.totalVideos) : 0;
        const activeCreators = analyticsData.topCreators ? analyticsData.topCreators.length : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }, children: [
            ["👥", "Users", analyticsData.totalUsers, "#6B8AFF"],
            ["🎬", "Videos", analyticsData.totalVideos, "#F5C842"],
            ["👁", "Views", analyticsData.totalViews.toLocaleString(), "#6BFFB8"],
            ["❤️", "Likes", analyticsData.totalLikes, "#FF9500"],
            ["💬", "Comments", analyticsData.totalComments, "#FF6B6B"],
            ["🔞", "Mature", analyticsData.matureCount, "#FF6B6B"]
          ].map(([icon, label, val, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: `1px solid ${color}22` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, marginBottom: 3 }, children: icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color, fontWeight: 900, fontSize: 18, lineHeight: 1 }, children: typeof val === "number" ? val.toLocaleString() : val }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 10, marginTop: 3 }, children: label })
          ] }, label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }, children: [
            ["📊", "Eng. Rate", `${engRate}%`, "#A78BFA"],
            ["🎯", "Avg Views", avgViews, "#34D399"],
            ["🎨", "Creators", activeCreators, "#F472B6"]
          ].map(([icon, label, val, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: `1px solid ${color}22` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, marginBottom: 3 }, children: icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color, fontWeight: 900, fontSize: 18, lineHeight: 1 }, children: typeof val === "number" ? val.toLocaleString() : val }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 10, marginTop: 3 }, children: label })
          ] }, label)) })
        ] });
      })(),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(107,138,255,0.07)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(107,138,255,0.2)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#6B8AFF", fontWeight: 900, fontSize: 15, marginBottom: 12 }, children: "👥 User Registrations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10, marginBottom: 14 }, children: (() => {
          const today = /* @__PURE__ */ new Date();
          const weekAgoD = /* @__PURE__ */ new Date();
          weekAgoD.setDate(today.getDate() - 6);
          const weekLabel = `${weekAgoD.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
          return [
            ["Today", analyticsData.newToday, "#6BFFB8"],
            [weekLabel, analyticsData.newThisWeek, "#F5C842"],
            ["All Time", analyticsData.totalUsers, "#6B8AFF"]
          ].map(([label, val, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 6px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color, fontWeight: 900, fontSize: 22, lineHeight: 1 }, children: val }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 10, marginTop: 4 }, children: label })
          ] }, label));
        })() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontWeight: 700, fontSize: 11, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }, children: [
          "All Registered Users (",
          (analyticsData.recentUsers || []).length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }, children: (analyticsData.recentUsers || []).map((u2, i) => {
          const joinDate = u2.created_date ? new Date(u2.created_date) : null;
          const today = /* @__PURE__ */ new Date();
          const isNew = joinDate && today - joinDate < 24 * 60 * 60 * 1e3;
          const isThisWeek = joinDate && today - joinDate < 7 * 24 * 60 * 60 * 1e3;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", border: isNew ? "1px solid rgba(107,255,184,0.25)" : "1px solid transparent" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#444", fontWeight: 700, fontSize: 11, width: 18, textAlign: "right", flexShrink: 0 }, children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: u2.avatar_url || u2.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u2.display_name || u2.username || u2.email || "?")}&background=random&color=fff&size=64&bold=true&format=png`,
                style: { width: 32, height: 32, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                u2.display_name || u2.full_name || u2.username || "—",
                isNew && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 6, background: "#6BFFB8", color: "#0B0C1A", fontSize: 9, fontWeight: 900, padding: "1px 6px", borderRadius: 20 }, children: "NEW" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                u2.email || "",
                u2.username ? ` · @${u2.username}` : ""
              ] }),
              u2.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#444", fontSize: 10, marginTop: 1 }, children: [
                "📍 ",
                u2.location
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: isNew ? "#6BFFB8" : isThisWeek ? "#F5C842" : "#444", fontSize: 10, fontWeight: 600 }, children: joinDate ? joinDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#333" }, children: joinDate ? joinDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "" })
            ] })
          ] }, u2.id || i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(245,200,66,0.1)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 800, fontSize: 14, marginBottom: 12 }, children: "📈 Daily Videos (14 days)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "flex-end", gap: 4, height: 60 }, children: analyticsData.dailyVideos.map(({ date, count }, i) => {
          const maxV = Math.max(...analyticsData.dailyVideos.map((d) => d.count), 1);
          const h = Math.max(count / maxV * 56, count > 0 ? 4 : 1);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#555" }, children: count > 0 ? count : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: h, borderRadius: 3, background: count > 0 ? "linear-gradient(180deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.06)", transition: "height 0.3s" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 8, color: "#444", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 22, overflow: "hidden" }, children: date.slice(5) })
          ] }, i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(107,138,255,0.15)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#6B8AFF", fontWeight: 800, fontSize: 14, marginBottom: 12 }, children: "👥 Daily New Users (14 days)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "flex-end", gap: 4, height: 60 }, children: analyticsData.dailyUsers.map(({ date, count }, i) => {
          const maxV = Math.max(...analyticsData.dailyUsers.map((d) => d.count), 1);
          const h = Math.max(count / maxV * 56, count > 0 ? 4 : 1);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#555" }, children: count > 0 ? count : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: h, borderRadius: 3, background: count > 0 ? "linear-gradient(180deg,#6B8AFF,#4A67FF)" : "rgba(255,255,255,0.06)", transition: "height 0.3s" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 8, color: "#444", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 22, overflow: "hidden" }, children: date.slice(5) })
          ] }, i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(107,255,184,0.1)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#6BFFB8", fontWeight: 800, fontSize: 14, marginBottom: 10 }, children: "🏆 Top Creators" }),
        analyticsData.topCreators.map(({ username, count }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#F5C842", fontWeight: 900, fontSize: 13, width: 18 }, children: [
            "#",
            i + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, color: "#fff", fontSize: 13 }, children: [
            "@",
            username
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(245,200,66,0.15)", color: "#F5C842", fontWeight: 800, fontSize: 12, padding: "3px 10px", borderRadius: 20 }, children: [
            count,
            " videos"
          ] })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(255,107,107,0.1)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#FF6B6B", fontWeight: 800, fontSize: 14, marginBottom: 10 }, children: "🔥 Top Videos by Views" }),
        analyticsData.topVideos.map((v2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#F5C842", fontWeight: 900, fontSize: 13, width: 18 }, children: [
            "#",
            i + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 36, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#1a1a2e" }, children: v2.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: resolveMediaUrl(v2.thumbnail_url), style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#333", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: "🎬" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: v2.caption || "(no caption)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", fontSize: 11 }, children: [
              "@",
              v2.username,
              " · 👁 ",
              (v2.views_count || 0).toLocaleString(),
              " · ❤️ ",
              v2.likes_count || 0,
              " · 💬 ",
              v2.comments_count || 0
            ] })
          ] })
        ] }, i))
      ] })
    ] }) }),
    modTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "16px 16px 20px" }, children: usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555", padding: 60, fontSize: 14 }, children: "Loading users…" }) : (() => {
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const weekAgo = /* @__PURE__ */ new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newToday = registeredUsers.filter((u2) => (u2.created_date || "").slice(0, 10) === todayStr).length;
      const newThisWeek = registeredUsers.filter((u2) => new Date(u2.created_date) >= weekAgo).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }, children: [
          ["👥", "Total", registeredUsers.length, "#6B8AFF"],
          ["🌅", "Today", newToday, "#6BFFB8"],
          ["📅", "This Week", newThisWeek, "#F5C842"]
        ].map(([icon, label, val, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: `1px solid ${color}33` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, marginBottom: 4 }, children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color, fontWeight: 900, fontSize: 26, lineHeight: 1 }, children: val }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 11, marginTop: 4 }, children: label })
        ] }, label)) }),
        (() => {
          const countries = {};
          registeredUsers.forEach((u2) => {
            const loc = u2.location || "Unknown";
            countries[loc] = (countries[loc] || 0) + 1;
          });
          const sorted = Object.entries(countries).sort((a, b) => b[1] - a[1]);
          return sorted.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(245,200,66,0.06)", borderRadius: 16, border: "1px solid rgba(245,200,66,0.15)", padding: "12px 16px", marginBottom: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontWeight: 800, fontSize: 13, marginBottom: 8 }, children: "🌍 Users by Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: sorted.map(([loc, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(245,200,66,0.12)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#F5C842", fontWeight: 600 }, children: [
              loc === "Unknown" ? "🌍" : loc.toLowerCase().includes("australia") ? "🇦🇺" : loc.toLowerCase().includes("sri lanka") ? "🇱🇰" : loc.toLowerCase().includes("united states") || loc.toLowerCase().includes("usa") ? "🇺🇸" : "🌍",
              " ",
              loc,
              " · ",
              count
            ] }, loc)) })
          ] }) : null;
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(107,138,255,0.06)", borderRadius: 16, border: "1px solid rgba(107,138,255,0.15)", overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#6B8AFF", fontWeight: 800, fontSize: 14 }, children: "All Registered Users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#444", fontSize: 12 }, children: [
              registeredUsers.length,
              " total"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxHeight: 500, overflowY: "auto" }, children: [
            registeredUsers.map((u2, i) => {
              const locationFlag = (loc) => {
                if (!loc) return "🌍 Unknown";
                const l2 = loc.toLowerCase();
                if (l2.includes("australia") || l2.includes("au")) return "🇦🇺 " + loc;
                if (l2.includes("sri lanka") || l2.includes("lk")) return "🇱🇰 " + loc;
                if (l2.includes("united states") || l2.includes("usa") || l2.includes("us")) return "🇺🇸 " + loc;
                if (l2.includes("new zealand") || l2.includes("nz")) return "🇳🇿 " + loc;
                if (l2.includes("india")) return "🇮🇳 " + loc;
                if (l2.includes("canada")) return "🇨🇦 " + loc;
                if (l2.includes("uk") || l2.includes("united kingdom")) return "🇬🇧 " + loc;
                return "🌍 " + loc;
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: u2.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u2.username || u2.email || "?")}&background=random&color=fff&size=64&bold=true&format=png`,
                    style: { width: 40, height: 40, borderRadius: "50%", flexShrink: 0, objectFit: "cover", border: "2px solid rgba(107,138,255,0.3)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u2.display_name || u2.username || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }, children: [
                    "@",
                    u2.username || "?",
                    " · ",
                    u2.email || "no email"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontSize: 11, fontWeight: 600, marginTop: 2 }, children: locationFlag(u2.location) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flexShrink: 0, textAlign: "right" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 11 }, children: u2.created_date ? new Date(u2.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#777", fontSize: 10, marginTop: 1 }, children: u2.created_date ? new Date(u2.created_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: u2.status === "active" ? "#6BFFB8" : "#FF6B6B", fontSize: 10, fontWeight: 700, marginTop: 2 }, children: u2.status || "active" })
                ] })
              ] }, u2.id || i);
            }),
            registeredUsers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#444", padding: 40, fontSize: 13 }, children: "No users yet." })
          ] })
        ] })
      ] });
    })() }),
    modTab === "ai" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 12, marginBottom: 16 }, children: [
        ["⏳ Pending Review", allVideos.filter((v2) => v2.is_ai_detected && !v2.is_approved).length, "#FF9500"],
        ["🤖 Live AI Posts", allVideos.filter((v2) => v2.is_ai_detected && v2.is_approved).length, "#ffcc44"],
        ["✅ Clean Posts", allVideos.filter((v2) => !v2.is_ai_detected && v2.is_approved).length, "#6BFFB8"]
      ].map(([label, count, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 0", textAlign: "center", border: `1px solid ${color}22` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color, fontWeight: 900, fontSize: 20 }, children: count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 11 }, children: label })
      ] }, label)) }),
      allVideos.filter((v2) => v2.is_ai_detected && !v2.is_approved).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#FF9500", fontWeight: 800, fontSize: 13, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }, children: "⏳ Pending Your Review" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: allVideos.filter((v2) => v2.is_ai_detected && !v2.is_approved).map((video) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,149,0,0.08)", borderRadius: 16, border: "2px solid rgba(255,149,0,0.5)", overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, padding: "12px 14px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 64, height: 80, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#1a1a2e" }, children: video.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: video.thumbnail_url, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 24 }, children: "🎬" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, background: "rgba(255,149,0,0.3)", color: "#FF9500", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }, children: "⏳ Awaiting MOD" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: 11, marginBottom: 3 }, children: [
                "@",
                video.username || "unknown"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: video.caption || "(no caption)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#FF9500" }, children: "Creator self-disclosed as AI" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: async () => {
                  setSaving(video.id);
                  await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/${video.id}`, { is_approved: true });
                  setAllVideos((p2) => p2.map((v2) => v2.id === video.id ? { ...v2, is_approved: true } : v2));
                  setSaving(null);
                },
                disabled: saving === video.id,
                style: {
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(107,255,154,0.1)",
                  color: "#6bff9a"
                },
                children: saving === video.id ? "Saving…" : "✅ Approve & Post with AI Badge"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => deleteVideo(video),
                disabled: saving === video.id,
                style: {
                  width: 56,
                  padding: "10px 0",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  background: "rgba(255,0,0,0.08)",
                  color: "#ff4444"
                },
                children: "🗑"
              }
            )
          ] })
        ] }, video.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ffcc44", fontWeight: 800, fontSize: 13, marginBottom: 10 }, children: "🤖 Live AI-Badged Posts" }),
      allVideos.filter((v2) => v2.is_ai_detected && v2.is_approved).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555", padding: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#444" }, children: "No approved AI posts yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: allVideos.filter((v2) => v2.is_ai_detected && v2.is_approved).map((video) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,149,0,0.06)", borderRadius: 16, border: "1px solid rgba(255,149,0,0.3)", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, padding: "12px 14px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 64, height: 80, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#1a1a2e" }, children: video.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: video.thumbnail_url, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 24 }, children: "🎬" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, background: "rgba(255,149,0,0.2)", color: "#FF9500", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }, children: "🤖 AI Detected" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: 11, marginBottom: 3 }, children: [
              "@",
              video.username || "unknown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: video.caption || "(no caption)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "#555" }, children: [
                "👁 ",
                video.views_count || 0
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "#555" }, children: [
                "❤️ ",
                video.likes_count || 0
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => flagAI(video),
              disabled: saving === video.id,
              style: {
                flex: 1,
                padding: "10px 0",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                borderRight: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(107,255,154,0.08)",
                color: "#6bff9a"
              },
              children: saving === video.id ? "Saving…" : "✅ Clear AI Flag"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => deleteVideo(video),
              disabled: saving === video.id,
              style: {
                width: 56,
                padding: "10px 0",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                background: "rgba(255,0,0,0.06)",
                color: "#ff4444"
              },
              children: "🗑"
            }
          )
        ] })
      ] }, video.id)) })
    ] }),
    modTab === "videos" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 12, padding: "12px 20px" }, children: [
        ["Total", allVideos.length, "#F5C842"],
        ["Mature", allVideos.filter((v2) => v2.is_mature).length, "#ff6b6b"],
        ["Clean", allVideos.filter((v2) => !v2.is_mature).length, "#6bff9a"]
      ].map(([label, count, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 0", textAlign: "center", border: `1px solid ${color}22` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color, fontWeight: 900, fontSize: 20 }, children: count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 11 }, children: label })
      ] }, label)) }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555", padding: 40 }, children: "Loading videos…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#555", padding: 40 }, children: "No videos match this filter." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }, children: filtered.map((video) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 16, border: `1px solid ${video.is_mature ? "rgba(255,107,107,0.3)" : "rgba(255,255,255,0.07)"}`, overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, padding: "12px 14px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 64, height: 80, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#1a1a2e" }, children: video.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: video.thumbnail_url, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 24 }, children: "🎬" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa", fontSize: 11, marginBottom: 3 }, children: [
              "@",
              video.username || "unknown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: video.caption || "(no caption)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "#555" }, children: [
                "👁 ",
                video.views_count || 0
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "#555" }, children: [
                "❤️ ",
                video.likes_count || 0
              ] }),
              video.is_mature && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, background: "rgba(255,107,107,0.2)", color: "#ff6b6b", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }, children: [
                "🔞 ",
                (video.mature_reason || "mature").replace(/_/g, " ")
              ] })
            ] }),
            video.is_mature && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: video.mature_reason || "other",
                onChange: (e) => toggleMature({ ...video, is_mature: true }, e.target.value),
                style: { width: "100%", padding: "6px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, color: "#fff", fontSize: 12, outline: "none", marginBottom: 4 },
                children: reasons.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r2, children: r2.replace(/_/g, " ") }, r2))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => toggleMature(video),
              disabled: saving === video.id,
              style: {
                flex: 1,
                padding: "10px 0",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                borderRight: "1px solid rgba(255,255,255,0.05)",
                background: video.is_mature ? "rgba(107,255,154,0.08)" : "rgba(255,107,107,0.08)",
                color: video.is_mature ? "#6bff9a" : "#ff6b6b"
              },
              children: saving === video.id ? "Saving…" : video.is_mature ? "✅ Clear Mature Flag" : "🔞 Mark as Mature"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => deleteVideo(video),
              disabled: saving === video.id,
              style: {
                width: 56,
                padding: "10px 0",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                background: "rgba(255,0,0,0.06)",
                color: "#ff4444"
              },
              children: "🗑"
            }
          )
        ] })
      ] }, video.id)) })
    ] })
  ] });
}
function App() {
  var _a;
  const path = window.location.pathname;
  if (path === "/terms") return /* @__PURE__ */ jsxRuntimeExports.jsx(Terms, {});
  if (path === "/privacy") return /* @__PURE__ */ jsxRuntimeExports.jsx(Privacy, {});
  if (path === "/child-safety") return /* @__PURE__ */ jsxRuntimeExports.jsx(ChildSafety, {});
  if (path === "/founding-creator" || path === "/apply") return /* @__PURE__ */ jsxRuntimeExports.jsx(FoundingCreatorPage, { onBack: () => window.location.href = "/" });
  const [hasEntered, setHasEntered] = reactExports.useState(false);
  const [currentUser, setCurrentUser] = reactExports.useState(() => auth.getUser());
  reactExports.useEffect(() => {
    handleGoogleRedirectCallback().then((result) => {
      if (!result) return;
      if (result.sessionUser) {
        setCurrentUser(result.sessionUser);
        setFeedKey((k2) => k2 + 1);
        setLoginToast(true);
        setTimeout(() => setLoginToast(false), 4e3);
      } else if (result.needsProfile) {
        setShowAuth(true);
      }
    });
    if (localStorage.getItem("sachi_auth_intent") && window.location.hash.includes("id_token")) {
      localStorage.removeItem("sachi_auth_intent");
    }
  }, []);
  (currentUser == null ? void 0 : currentUser.email) === "jaygnz27@gmail.com" || (currentUser == null ? void 0 : currentUser.email) === "lasanjaya@gmail.com";
  const [videoList, setVideoList] = reactExports.useState([]);
  const feedContainerRef = reactExports.useRef(null);
  const [feedKey, setFeedKey] = React$1.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("feed");
  const [showAdmin, setShowAdmin] = reactExports.useState(false);
  const [showGoLive, setShowGoLive] = reactExports.useState(false);
  const [profileSheet, setProfileSheet] = reactExports.useState(null);
  const [showSearch, setShowSearch] = reactExports.useState(false);
  const [authToast, setAuthToast] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [feedTab, setFeedTab] = reactExports.useState("forYou");
  const [followingVideos, setFollowingVideos] = reactExports.useState([]);
  const [followedUserIds, setFollowedUserIds] = reactExports.useState(/* @__PURE__ */ new Set());
  React$1.useEffect(() => {
    if (!currentUser) {
      setFollowedUserIds(/* @__PURE__ */ new Set());
      return;
    }
    follows.getFollowing(currentUser.id).then((res) => {
      setFollowedUserIds(new Set((res.items || res || []).map((r2) => r2.following_id)));
    }).catch(() => {
    });
  }, [currentUser]);
  const handleFollowChange = (userId, isNowFollowing) => {
    setFollowedUserIds((prev) => {
      const next = new Set(prev);
      if (isNowFollowing) next.add(userId);
      else next.delete(userId);
      return next;
    });
  };
  const [followingIds, setFollowingIds] = reactExports.useState([]);
  const [bookmarkedIds, setBookmarkedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [bookmarkRecords, setBookmarkRecords] = reactExports.useState({});
  const [blockedIds, setBlockedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [feedPage, setFeedPage] = reactExports.useState(1);
  const [feedHasMore, setFeedHasMore] = reactExports.useState(true);
  const FEED_PAGE_SIZE = 30;
  const [commentVideo, setCommentVideo] = reactExports.useState(null);
  const [showUpload, setShowUpload] = reactExports.useState(false);
  const [uploadToast, setUploadToast] = reactExports.useState(false);
  const [loginToast, setLoginToast] = reactExports.useState(false);
  const [showAuth, setShowAuth] = reactExports.useState(false);
  const [myVideos, setMyVideos] = reactExports.useState([]);
  const [meFollowersCount, setMeFollowersCount] = reactExports.useState(0);
  const [meFollowingCount, setMeFollowingCount] = reactExports.useState(0);
  const [showFollowersList, setShowFollowersList] = reactExports.useState(false);
  const [showFollowingList, setShowFollowingList] = reactExports.useState(false);
  const [followersList, setFollowersList] = reactExports.useState([]);
  const [followingList, setFollowingList] = reactExports.useState([]);
  const [followListLoading, setFollowListLoading] = reactExports.useState(false);
  const [avatarUrl, setAvatarUrl] = reactExports.useState(() => {
    try {
      const last = localStorage.getItem("avatar_last");
      if (last) return last;
      const keys = Object.keys(localStorage).filter((k2) => k2.startsWith("avatar_"));
      if (keys.length > 0) return localStorage.getItem(keys[0]) || null;
    } catch (e) {
    }
    return null;
  });
  const [showAvatarPicker, setShowAvatarPicker] = reactExports.useState(false);
  const [showEditProfile, setShowEditProfile] = reactExports.useState(false);
  const [editProfileName, setEditProfileName] = reactExports.useState("");
  const [editProfileSaving, setEditProfileSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadVideos();
  }, []);
  reactExports.useEffect(() => {
    const handleSachiShare = (e) => {
      const { type, uri, url } = e.detail || {};
      if (type === "video" || type === "url") {
        setShowUpload(true);
        window._sachiSharedContent = { type, uri, url };
      }
    };
    window.addEventListener("sachi-share", handleSachiShare);
    return () => window.removeEventListener("sachi-share", handleSachiShare);
  }, []);
  reactExports.useEffect(() => {
    if (currentUser) loadFollowingVideos(currentUser);
  }, [currentUser]);
  reactExports.useEffect(() => {
    const loadAvatar = async () => {
      if (currentUser) {
        try {
          const usersData = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser/?email=${encodeURIComponent(currentUser.email)}`);
          const users = Array.isArray(usersData) ? usersData : usersData.items || [];
          const match = users.find((u2) => u2.email === currentUser.email || u2.user_id === currentUser.id);
          if (match && match.avatar_url && !match.avatar_url.startsWith("data:")) {
            setAvatarUrl(match.avatar_url);
            localStorage.setItem(`avatar_${currentUser.id}`, match.avatar_url);
            localStorage.setItem("avatar_last", match.avatar_url);
          } else if (currentUser.avatar_url && !currentUser.avatar_url.startsWith("data:")) {
            setAvatarUrl(currentUser.avatar_url);
          } else {
            const localSaved = localStorage.getItem(`avatar_${currentUser.id}`);
            if (localSaved && !localSaved.startsWith("data:")) setAvatarUrl(localSaved);
          }
        } catch (e) {
          if (currentUser.avatar_url) setAvatarUrl(currentUser.avatar_url);
          else {
            const saved = localStorage.getItem(`avatar_${currentUser.id}`);
            if (saved) setAvatarUrl(saved);
          }
        }
      }
    };
    loadAvatar();
  }, [currentUser]);
  const loadFollowingVideos = async (user) => {
    if (!user) return;
    try {
      const res = await follows.getFollowing(user.id);
      const items = res.items || res || [];
      const ids = items.map((r2) => r2.following_id);
      setFollowingIds(ids);
      if (ids.length === 0) {
        setFollowingVideos([]);
        return;
      }
      const allVids = await videos.list();
      const vids = (allVids.items || allVids || []).filter((v2) => ids.includes(v2.user_id));
      setFollowingVideos(vids);
    } catch (e) {
      console.error(e);
    }
  };
  const loadVideos = async (user, append = false, page = 1) => {
    if (!append) setLoading(true);
    try {
      const skip = (page - 1) * FEED_PAGE_SIZE;
      const data = await videos.list(FEED_PAGE_SIZE, skip);
      const rawAll = Array.isArray(data) ? data : (data == null ? void 0 : data.items) || (data == null ? void 0 : data.records) || [];
      const raw = rawAll.filter((v2) => !v2.is_archived);
      setFeedHasMore(rawAll.length === FEED_PAGE_SIZE);
      if (!raw.length && !append) {
        setVideoList([]);
        setLoading(false);
        return;
      }
      const sorted = [...raw].sort((a, b) => {
        const ageDiffHours = (new Date(b.created_date || 0) - new Date(a.created_date || 0)) / 36e5;
        const engA = (a.likes_count || 0) * 2 + (a.comments_count || 0) * 3 + (a.views_count || 0) * 0.01;
        const engB = (b.likes_count || 0) * 2 + (b.comments_count || 0) * 3 + (b.views_count || 0) * 0.01;
        if (Math.abs(ageDiffHours) > 48 && engB - engA > 50) return 1;
        if (Math.abs(ageDiffHours) > 48 && engA - engB > 50) return -1;
        return new Date(b.created_date || 0) - new Date(a.created_date || 0);
      });
      const ranked = sorted;
      if (append) {
        setVideoList((prev) => {
          const existing = new Set(prev.map((v2) => v2.id));
          return [...prev, ...ranked.filter((v2) => !existing.has(v2.id))];
        });
      } else {
        setVideoList(ranked);
        requestAnimationFrame(() => {
          const el2 = feedContainerRef.current || window.__sachiEl;
          if (el2) el2.scrollTo({ top: 0, behavior: "instant" });
        });
      }
    } catch (err) {
      console.error("loadVideos error:", err);
      if (!append) setVideoList([]);
    }
    setLoading(false);
  };
  const loadMoreVideos = () => {
    if (!feedHasMore || loading) return;
    const nextPage = feedPage + 1;
    setFeedPage(nextPage);
    loadVideos(currentUser, true, nextPage);
  };
  reactExports.useEffect(() => {
    if (!currentUser) {
      setBookmarkedIds(/* @__PURE__ */ new Set());
      setBookmarkRecords({});
      setBlockedIds(/* @__PURE__ */ new Set());
      return;
    }
    bookmarks.getByUser(currentUser.id).then((res) => {
      const items = res.items || res || [];
      const ids = new Set(items.map((b) => b.video_id));
      const recs = {};
      items.forEach((b) => {
        recs[b.video_id] = b.id;
      });
      setBookmarkedIds(ids);
      setBookmarkRecords(recs);
    }).catch(() => {
    });
    blocks.getBlockedByUser(currentUser.id).then((res) => {
      const items = res.items || res || [];
      setBlockedIds(new Set(items.map((b) => b.blocked_id)));
    }).catch(() => {
    });
  }, [currentUser]);
  const handleBookmark = async (videoId, shouldBookmark) => {
    if (!currentUser) {
      setShowAuth(true);
      return;
    }
    if (shouldBookmark) {
      try {
        const rec = await bookmarks.add(currentUser.id, currentUser.username || currentUser.email, videoId);
        setBookmarkedIds((prev) => /* @__PURE__ */ new Set([...prev, videoId]));
        setBookmarkRecords((prev) => ({ ...prev, [videoId]: rec.id }));
      } catch (e) {
      }
    } else {
      const recId = bookmarkRecords[videoId];
      if (recId) {
        try {
          await bookmarks.remove(recId);
          setBookmarkedIds((prev) => {
            const n2 = new Set(prev);
            n2.delete(videoId);
            return n2;
          });
          setBookmarkRecords((prev) => {
            const n2 = { ...prev };
            delete n2[videoId];
            return n2;
          });
        } catch (e) {
        }
      }
    }
  };
  const goHome = () => {
    setActiveTab("feed");
    setFeedPage(1);
    setFeedKey((k2) => k2 + 1);
    loadVideos(currentUser, false, 1);
  };
  reactExports.useEffect(() => {
    var _a2;
    if (activeTab === "profile" && currentUser) {
      videos.myVideos(currentUser.id, currentUser.email).then((r2) => setMyVideos(Array.isArray(r2) ? r2 : [])).catch(() => setMyVideos([]));
      const myUsername = currentUser.full_name || ((_a2 = currentUser.email) == null ? void 0 : _a2.split("@")[0]) || "";
      (async () => {
        try {
          const r1 = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?following_id=${currentUser.id}&limit=500`).catch(() => null);
          const r2 = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?following_username=${encodeURIComponent(myUsername)}&limit=500`).catch(() => null);
          const all = [...(r1 == null ? void 0 : r1.items) || r1 || [], ...(r2 == null ? void 0 : r2.items) || r2 || []];
          const unique = [...new Map(all.map((f2) => [f2.id, f2])).values()];
          setMeFollowersCount(unique.length);
        } catch (e) {
        }
      })();
      (async () => {
        try {
          const r1 = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_id=${currentUser.id}&limit=500`).catch(() => null);
          const r2 = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_username=${encodeURIComponent(myUsername)}&limit=500`).catch(() => null);
          const all = [...(r1 == null ? void 0 : r1.items) || r1 || [], ...(r2 == null ? void 0 : r2.items) || r2 || []];
          const unique = [...new Map(all.map((f2) => [f2.id, f2])).values()];
          setMeFollowingCount(unique.length);
        } catch (e) {
        }
      })();
    }
  }, [activeTab, currentUser]);
  const handleLike = React$1.useCallback((videoId, delta) => {
    const feedEl = feedContainerRef.current;
    const savedScroll = feedEl ? feedEl.scrollTop : 0;
    setVideoList((vs) => {
      const updated = vs.map((v2) => {
        var _a2;
        if (v2.id !== videoId) return v2;
        const newCount = Math.max(0, (v2.likes_count || 0) + delta);
        videos.update(videoId, { likes_count: newCount }).catch(() => {
        });
        if (currentUser && ((_a2 = v2.hashtags) == null ? void 0 : _a2.length)) {
          interests.signal(currentUser.id, v2.hashtags, delta > 0 ? 3 : -1).catch(() => {
          });
        }
        return { ...v2, likes_count: newCount };
      });
      return updated;
    });
    if (feedEl) {
      requestAnimationFrame(() => {
        feedEl.scrollTop = savedScroll;
      });
    }
  }, [currentUser, feedContainerRef]);
  const handleView = (videoId) => {
    var _a2;
    setVideoList((vs) => vs.map((v2) => v2.id === videoId ? { ...v2, views_count: (v2.views_count || 0) + 1 } : v2));
    const vid = videoList.find((v2) => v2.id === videoId);
    if (vid) {
      videos.update(videoId, { views_count: (vid.views_count || 0) + 1 }).catch(() => {
      });
      if (currentUser && ((_a2 = vid.hashtags) == null ? void 0 : _a2.length)) {
        interests.signal(currentUser.id, vid.hashtags, 1).catch(() => {
        });
      }
    }
  };
  const handleCommentCount = (videoId, count) => {
    setVideoList((vs) => vs.map((v2) => v2.id === videoId ? { ...v2, comments_count: count } : v2));
  };
  const requireAuth = (cb2) => {
    if (currentUser) {
      cb2();
    } else {
      setShowAuth(true);
      setAuthToast(true);
      setTimeout(() => setAuthToast(false), 3e3);
    }
  };
  const username = (currentUser == null ? void 0 : currentUser.full_name) || ((_a = currentUser == null ? void 0 : currentUser.email) == null ? void 0 : _a.split("@")[0]) || "";
  if (!hasEntered) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Landing, { onEnter: () => setHasEntered(true) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#0B0C1A", minHeight: "100svh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 300, paddingTop: "env(safe-area-inset-top,0px)", background: "linear-gradient(to bottom, rgba(11,12,26,0.92) 0%, transparent 100%)", backdropFilter: "blur(8px)", pointerEvents: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 6px", pointerEvents: "auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/sachi-icon-v4.png", alt: "Sachi", style: { width: 30, height: 30, borderRadius: 8, filter: "drop-shadow(0 0 6px rgba(245,200,66,0.5))" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 24, fontWeight: 900, letterSpacing: -0.5, background: "linear-gradient(135deg,#F5C842,#FF9500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }, children: "Sachi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: "#F5C842", lineHeight: 1, marginBottom: 2 }, children: "™" })
        ] })
      ] }),
      activeTab === "feed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 24, padding: 3, gap: 2 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setFeedTab("following");
              if (currentUser) loadFollowingVideos(currentUser);
            },
            style: {
              background: feedTab === "following" ? "rgba(245,200,66,0.2)" : "none",
              border: "none",
              cursor: "pointer",
              padding: "5px 16px",
              color: feedTab === "following" ? "#F5C842" : "rgba(255,255,255,0.45)",
              fontWeight: feedTab === "following" ? 700 : 500,
              fontSize: 13,
              borderRadius: 20,
              transition: "all 0.2s",
              WebkitTapHighlightColor: "transparent"
            },
            children: "Following"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFeedTab("forYou"),
            style: {
              background: feedTab === "forYou" ? "rgba(245,200,66,0.2)" : "none",
              border: "none",
              cursor: "pointer",
              padding: "5px 16px",
              color: feedTab === "forYou" ? "#F5C842" : "rgba(255,255,255,0.45)",
              fontWeight: feedTab === "forYou" ? 700 : 500,
              fontSize: 13,
              borderRadius: 20,
              transition: "all 0.2s",
              WebkitTapHighlightColor: "transparent"
            },
            children: "For You"
          }
        )
      ] }),
      activeTab !== "feed" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: 0.2 }, children: activeTab === "profile" ? "Profile" : activeTab === "explore" ? "Explore" : activeTab === "podcast" ? "Podcasts" : "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => requireAuth(() => setShowGoLive(true)),
          style: { background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 20, padding: "4px 10px", color: "#F5C842", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3, WebkitTapHighlightColor: "transparent", display: "flex", alignItems: "center", gap: 4 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "#F5C842", display: "inline-block", animation: "heartbeat 1.4s ease-in-out infinite" } }),
            "Live"
          ]
        }
      ) })
    ] }) }),
    activeTab === "feed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: (el2) => {
      feedContainerRef.current = el2;
      window.__sachiEl = el2;
    }, style: { height: "100svh", overflowY: "scroll", scrollSnapType: "y mandatory", isolation: "isolate", touchAction: "pan-y" }, children: [
      feedTab === "following" && followingIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.5)",
        gap: 16,
        padding: 32,
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 56 }, children: "👥" }),
        !currentUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: "#fff" }, children: "Sign in to follow people" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14 }, children: "Create a free account to follow your favourite creators" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowAuth(true),
              style: { marginTop: 8, background: "linear-gradient(135deg,#F5C842,#FF9500)", border: "none", borderRadius: 14, padding: "12px 28px", color: "#0B0C1A", fontWeight: 800, fontSize: 15, cursor: "pointer" },
              children: "Sign Up / Log In"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: "#fff" }, children: "No one to show yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 14 }, children: [
            "Tap ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "+ Follow" }),
            " on any video to see their posts here"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFeedTab("forYou"),
              style: { marginTop: 8, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "10px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
              children: "Browse For You →"
            }
          )
        ] })
      ] }),
      loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "100svh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48 }, children: "🎬" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(245,200,66,0.7)", fontSize: 14, letterSpacing: 1, fontWeight: 600 }, children: "Loading..." })
      ] }),
      !loading && videoList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "100svh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 64 }, children: "🎬" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 22 }, children: "No videos yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 15 }, children: "Be the first to post!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => requireAuth(() => setShowUpload(true)),
            style: { marginTop: 12, background: "linear-gradient(135deg,#F5C842,#FF9500)", border: "none", borderRadius: 14, padding: "12px 28px", color: "#0B0C1A", fontWeight: 800, fontSize: 16, cursor: "pointer" },
            children: "+ Upload Video"
          }
        )
      ] }),
      (feedTab === "forYou" ? videoList : followingVideos).filter((v2) => !blockedIds.has(v2.user_id)).map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        VideoCard,
        {
          video: v2,
          currentUser,
          onCommentOpen: setCommentVideo,
          onLike: handleLike,
          onView: handleView,
          onNeedAuth: () => setShowAuth(true),
          onDelete: (id2) => setVideoList((prev) => prev.filter((v22) => v22.id !== id2)),
          onProfileOpen: (uid, uname) => setProfileSheet({ userId: uid, username: uname }),
          followedUserIds,
          onFollowChange: handleFollowChange,
          onShareCount: (videoId, newCount) => setVideoList((prev) => prev.map((v22) => v22.id === videoId ? { ...v22, shares_count: newCount } : v22)),
          onBookmark: { isBookmarked: (vid) => bookmarkedIds.has(vid), handle: handleBookmark },
          blockedIds
        },
        v2.id
      )),
      feedTab === "forYou" && feedHasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: "24px 0 40px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: loadMoreVideos, style: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "10px 28px", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600 }, children: "Load more" }) }),
      feedTab === "following" && followingVideos.length === 0 && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "60px 24px", color: "rgba(255,255,255,0.3)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: "👀" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, fontWeight: 600, marginBottom: 8 }, children: "Nothing here yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: "Follow creators to see their posts here" })
      ] })
    ] }, feedKey),
    activeTab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { paddingTop: 70, paddingBottom: 80, minHeight: "100svh", background: "#0B0C1A", position: "relative", zIndex: 10, isolation: "isolate" }, children: !currentUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: 60 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: { position: "relative", display: "inline-block", cursor: "pointer", marginBottom: 16 },
          onClick: () => setShowAuth(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "3px solid rgba(245,200,66,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44
            }, children: "👤" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              bottom: 2,
              right: 2,
              background: "#F5C842",
              borderRadius: "50%",
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              border: "2px solid #0B0C1A"
            }, children: "📷" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 8 }, children: "You're not logged in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 14, marginBottom: 24 }, children: "Sign up to post and build your profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowAuth(true),
          style: { background: "linear-gradient(135deg,#F5C842,#FF9500)", border: "none", borderRadius: 14, padding: "13px 32px", color: "#0B0C1A", fontWeight: 800, fontSize: 16, cursor: "pointer" },
          children: "Sign Up / Log In"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px 20px 0", textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 12, gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { position: "relative", display: "inline-block", cursor: "pointer" },
              onClick: () => setShowAvatarPicker(true),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
                    style: { width: 90, height: 90, borderRadius: "50%", border: "3px solid #F5C842", display: "block", background: "rgba(255,255,255,0.05)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  background: "#F5C842",
                  borderRadius: "50%",
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  border: "2px solid #0B0C1A"
                }, children: "✏️" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowAvatarPicker(true),
              style: {
                background: "rgba(245,200,66,0.1)",
                border: "1px solid rgba(245,200,66,0.3)",
                borderRadius: 20,
                padding: "6px 18px",
                color: "#F5C842",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer"
              },
              children: "Change Avatar"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" },
            onClick: () => {
              setEditProfileName((currentUser == null ? void 0 : currentUser.full_name) || "");
              setShowEditProfile(true);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20 }, children: currentUser.full_name || username }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "#888" }, children: "✏️" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: 13, marginTop: 2 }, children: [
          "@",
          username
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: 0, marginTop: 20, marginBottom: 20, pointerEvents: "auto" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "10px 24px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20 }, children: myVideos.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 12 }, children: "Videos" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              style: { textAlign: "center", padding: "10px 24px", background: "none", border: "none", cursor: "pointer", pointerEvents: "auto", WebkitTapHighlightColor: "transparent" },
              onClick: async () => {
                setShowFollowersList(true);
                setFollowListLoading(true);
                try {
                  const r1 = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?following_id=${currentUser.id}&limit=500`).catch(() => null);
                  const all = (r1 == null ? void 0 : r1.items) || r1 || [];
                  const unique = [...new Map(all.map((f2) => [f2.id, f2])).values()];
                  setFollowersList(unique);
                } catch (e) {
                  setFollowersList([]);
                }
                setFollowListLoading(false);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20 }, children: meFollowersCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontSize: 12, fontWeight: 600 }, children: "Followers" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              style: { textAlign: "center", padding: "10px 24px", background: "none", border: "none", cursor: "pointer", pointerEvents: "auto", WebkitTapHighlightColor: "transparent" },
              onClick: async () => {
                setShowFollowingList(true);
                setFollowListLoading(true);
                try {
                  const r1 = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_id=${currentUser.id}&limit=500`).catch(() => null);
                  const all = (r1 == null ? void 0 : r1.items) || r1 || [];
                  const unique = [...new Map(all.map((f2) => [f2.id, f2])).values()];
                  setFollowingList(unique);
                } catch (e) {
                  setFollowingList([]);
                }
                setFollowListLoading(false);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 20 }, children: meFollowingCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#F5C842", fontSize: 12, fontWeight: 600 }, children: "Following" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VideoManageGrid, { videos: myVideos, onRefresh: () => videos.myVideos(currentUser.id, currentUser.email).then((r2) => setMyVideos(Array.isArray(r2) ? r2 : [])).catch(() => {
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0 20px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => window.location.href = "/founding-creator",
          style: {
            width: "100%",
            padding: "15px 0",
            background: "linear-gradient(135deg,rgba(245,200,66,0.15),rgba(245,200,66,0.08))",
            border: "1.5px solid rgba(245,200,66,0.4)",
            borderRadius: 14,
            color: "#F5C842",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          },
          children: "🌸 Apply to be a Founding Creator"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "24px 20px 32px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            auth.signOut();
            localStorage.removeItem("sachi_google_user");
            setCurrentUser(null);
            setActiveTab("feed");
          },
          style: {
            width: "100%",
            padding: "14px 0",
            background: "rgba(255,50,50,0.1)",
            border: "1.5px solid rgba(255,80,80,0.3)",
            borderRadius: 14,
            color: "#ff5555",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          },
          children: "🚪 Log Out"
        }
      ) })
    ] }) }),
    activeTab === "explore" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { paddingTop: 70, paddingBottom: 80, minHeight: "100svh", background: "#0B0C1A" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 22, padding: "8px 14px", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.4)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            autoFocus: true,
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "Search users or videos...",
            style: { flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15 }
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), style: { background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, padding: 0 }, children: "✕" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 16 }, children: searchQuery.trim() === "" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }, children: "🔥 Trending Now" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }, children: [...videoList].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 18).map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { aspectRatio: "9/16", background: "#111", borderRadius: 4, overflow: "hidden", position: "relative", cursor: "pointer" },
            onClick: () => {
              setSearchQuery("");
              setActiveTab("feed");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: resolveMediaUrl(v2.video_url), style: { width: "100%", height: "100%", objectFit: "cover" }, muted: true, playsInline: true, preload: "metadata" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "linear-gradient(transparent,rgba(0,0,0,0.8))", fontSize: 10, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "@",
                  v2.username
                ] }),
                v2.views_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#aaa" }, children: [
                  "👁 ",
                  v2.views_count
                ] })
              ] })
            ]
          },
          v2.id
        )) }),
        videoList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.25)", marginTop: 60, fontSize: 14 }, children: "No videos yet — be the first to post!" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }, children: "Results" }),
        videoList.filter(
          (v2) => (v2.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.25)", marginTop: 60, fontSize: 14 }, children: [
          'No results for "',
          searchQuery,
          '"'
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }, children: videoList.filter(
          (v2) => (v2.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
        ).map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { aspectRatio: "9/16", background: "#111", borderRadius: 4, overflow: "hidden", position: "relative", cursor: "pointer" },
            onClick: () => {
              setSearchQuery("");
              setActiveTab("feed");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: resolveMediaUrl(v2.video_url), style: { width: "100%", height: "100%", objectFit: "cover" }, muted: true, playsInline: true, preload: "metadata" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "linear-gradient(transparent,rgba(0,0,0,0.7))", fontSize: 10, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                "@",
                v2.username
              ] })
            ]
          },
          v2.id
        )) })
      ] }) })
    ] }),
    activeTab === "podcast" && /* @__PURE__ */ jsxRuntimeExports.jsx(PodcastPage, { currentUser, onNeedAuth: () => setShowAuth(true) }),
    activeTab === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPanel, { currentUser }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 200, paddingBottom: "env(safe-area-inset-bottom,8px)", paddingTop: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { pointerEvents: "auto", margin: "0 16px 8px", background: "rgba(14,14,28,0.96)", backdropFilter: "blur(30px)", borderRadius: 40, border: "1px solid rgba(245,200,66,0.15)", display: "flex", alignItems: "center", padding: "6px 8px", gap: 2, boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: goHome,
          style: { flex: 1, minWidth: 52, padding: "8px 12px 6px", background: activeTab === "feed" ? "rgba(245,200,66,0.15)" : "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, WebkitTapHighlightColor: "transparent", borderRadius: 32, transition: "background 0.2s" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: activeTab === "feed" ? "#F5C842" : "none", stroke: activeTab === "feed" ? "#F5C842" : "#4A4A6A", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: activeTab === "feed" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab === "feed" ? 700 : 400, letterSpacing: 0.3 }, children: "Home" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab("explore"),
          style: { flex: 1, minWidth: 52, padding: "8px 12px 6px", background: activeTab === "explore" ? "rgba(245,200,66,0.15)" : "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, WebkitTapHighlightColor: "transparent", borderRadius: 32, transition: "background 0.2s" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", stroke: activeTab === "explore" ? "#F5C842" : "#4A4A6A", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: activeTab === "explore" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab === "explore" ? 700 : 400, letterSpacing: 0.3 }, children: "Explore" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => requireAuth(() => setShowUpload(true)),
          style: { flex: 1, minWidth: 52, padding: "8px 10px 6px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, WebkitTapHighlightColor: "transparent", borderRadius: 32, transition: "background 0.2s" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", stroke: "#F5C842", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "16" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#F5C842", fontWeight: 600, letterSpacing: 0.3 }, children: "Post" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab("podcast"),
          style: { flex: 1, minWidth: 52, padding: "8px 12px 6px", background: activeTab === "podcast" ? "rgba(245,200,66,0.15)" : "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, WebkitTapHighlightColor: "transparent", borderRadius: 32, transition: "background 0.2s" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", stroke: activeTab === "podcast" ? "#F5C842" : "#4A4A6A", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "23" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "23", x2: "16", y2: "23" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: activeTab === "podcast" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab === "podcast" ? 700 : 400, letterSpacing: 0.3 }, children: "Podcasts" })
          ]
        }
      ),
      ((currentUser == null ? void 0 : currentUser.email) === "jaygnz27@gmail.com" || (currentUser == null ? void 0 : currentUser.email) === "lasanjaya@gmail.com") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab("admin"),
          style: { flex: 1, minWidth: 52, padding: "8px 10px 6px", background: activeTab === "admin" ? "rgba(245,200,66,0.15)" : "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, WebkitTapHighlightColor: "transparent", borderRadius: 32, transition: "background 0.2s" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", stroke: activeTab === "admin" ? "#F5C842" : "#4A4A6A", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: activeTab === "admin" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab === "admin" ? 700 : 400, letterSpacing: 0.3 }, children: "Mod" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab("profile"),
          style: { flex: 1, minWidth: 52, padding: "8px 12px 6px", background: activeTab === "profile" ? "rgba(245,200,66,0.15)" : "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, WebkitTapHighlightColor: "transparent", borderRadius: 32, transition: "background 0.2s" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: activeTab === "profile" ? "#F5C842" : "none", stroke: activeTab === "profile" ? "#F5C842" : "#4A4A6A", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: activeTab === "profile" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab === "profile" ? 700 : 400, letterSpacing: 0.3 }, children: "Me" })
          ]
        }
      )
    ] }) }),
    showSearch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "fixed", inset: 0, zIndex: 500, background: "#000", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", paddingTop: "calc(env(safe-area-inset-top,0px) + 12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 22, padding: "8px 14px", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.4)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              autoFocus: true,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: "Search users or videos...",
              style: { flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15 }
            }
          ),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), style: { background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, padding: 0 }, children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowSearch(false);
          setSearchQuery("");
        }, style: { background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer", fontWeight: 600, padding: "0 4px", WebkitTapHighlightColor: "transparent" }, children: "Cancel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: 16 }, children: searchQuery.trim() === "" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.25)", marginTop: 60, fontSize: 14 }, children: "Search for users or video captions" }) : videoList.filter(
        (v2) => (v2.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
      ).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.25)", marginTop: 60, fontSize: 14 }, children: [
        'No results for "',
        searchQuery,
        '"'
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }, children: videoList.filter(
        (v2) => (v2.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v2.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
      ).map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: { aspectRatio: "9/16", background: "#111", borderRadius: 4, overflow: "hidden", position: "relative", cursor: "pointer" },
          onClick: () => {
            setShowSearch(false);
            setSearchQuery("");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: resolveMediaUrl(v2.video_url), style: { width: "100%", height: "100%", objectFit: "cover" }, muted: true, playsInline: true, preload: "metadata" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "linear-gradient(transparent,rgba(0,0,0,0.7))", fontSize: 10, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
              "@",
              v2.username
            ] })
          ]
        },
        v2.id
      )) }) })
    ] }),
    profileSheet && /* @__PURE__ */ jsxRuntimeExports.jsx(
      UserProfileSheet,
      {
        userId: profileSheet.userId,
        username: profileSheet.username,
        currentUser,
        onClose: () => setProfileSheet(null)
      }
    ),
    showFollowersList && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 19999, display: "flex", alignItems: "flex-end" },
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowFollowersList(false);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxHeight: "75vh", background: "#13142A", borderRadius: "20px 20px 0 0", overflowY: "auto", paddingBottom: 32 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            position: "sticky",
            top: 0,
            background: "#13142A",
            zIndex: 1
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 800, fontSize: 17, color: "#fff" }, children: [
              "Followers (",
              followersList.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setShowFollowersList(false),
                style: { background: "none", border: "none", color: "#888", fontSize: 24, cursor: "pointer", lineHeight: 1 },
                children: "✕"
              }
            )
          ] }),
          followListLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: 40, color: "#888" }, children: "Loading..." }) : followersList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: 40, color: "#888" }, children: "No followers yet" }) : followersList.map((f2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer"
              },
              onClick: () => {
                setShowFollowersList(false);
                setProfileSheet({ userId: f2.follower_id, username: f2.follower_username });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: `https://ui-avatars.com/api/?name=${encodeURIComponent(f2.follower_username || "U")}&background=random&color=fff&size=80&bold=true&format=png`,
                    style: { width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(245,200,66,0.4)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15 }, children: f2.follower_username || "Unknown" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: 12 }, children: [
                    "@",
                    f2.follower_username
                  ] })
                ] })
              ]
            },
            f2.id || i
          ))
        ] })
      }
    ),
    showFollowingList && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 19999, display: "flex", alignItems: "flex-end" },
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowFollowingList(false);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", maxHeight: "75vh", background: "#13142A", borderRadius: "20px 20px 0 0", overflowY: "auto", paddingBottom: 32 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            position: "sticky",
            top: 0,
            background: "#13142A",
            zIndex: 1
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 800, fontSize: 17, color: "#fff" }, children: [
              "Following (",
              followingList.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setShowFollowingList(false),
                style: { background: "none", border: "none", color: "#888", fontSize: 24, cursor: "pointer", lineHeight: 1 },
                children: "✕"
              }
            )
          ] }),
          followListLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: 40, color: "#888" }, children: "Loading..." }) : followingList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: 40, color: "#888" }, children: "Not following anyone yet" }) : followingList.map((f2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer"
              },
              onClick: () => {
                setShowFollowingList(false);
                setProfileSheet({ userId: f2.following_id, username: f2.following_username });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: `https://ui-avatars.com/api/?name=${encodeURIComponent(f2.following_username || "U")}&background=random&color=fff&size=80&bold=true&format=png`,
                    style: { width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(245,200,66,0.4)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15 }, children: f2.following_username || "Unknown" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: 12 }, children: [
                    "@",
                    f2.following_username
                  ] })
                ] })
              ]
            },
            f2.id || i
          ))
        ] })
      }
    ),
    commentVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(CommentSheet, { video: commentVideo, currentUser, onClose: () => setCommentVideo(null), onCommentPosted: handleCommentCount, onNeedAuth: () => {
      setCommentVideo(null);
      setShowAuth(true);
    } }),
    showUpload && currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(UploadModal, { currentUser, onClose: () => setShowUpload(false), onUploaded: () => {
      goHome();
      setUploadToast(true);
      setTimeout(() => setUploadToast(false), 4e3);
    } }),
    showGoLive && currentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(GoLiveModal, { currentUser, onClose: () => setShowGoLive(false), onUploaded: () => {
      goHome();
      setUploadToast(true);
      setTimeout(() => setUploadToast(false), 4e3);
    } }),
    authToast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      bottom: 90,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      background: "linear-gradient(135deg,#1a1a2e,#16213e)",
      border: "1.5px solid #ff6b6b",
      borderRadius: 16,
      padding: "14px 22px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      whiteSpace: "nowrap"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22 }, children: "🔐" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15 }, children: "Sign in required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff9999", fontSize: 12, marginTop: 2 }, children: "Create a free account to continue" })
      ] })
    ] }),
    uploadToast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      bottom: 90,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      background: "linear-gradient(135deg,#1a2e1a,#1e3a1e)",
      border: "1.5px solid #4caf50",
      borderRadius: 16,
      padding: "14px 22px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      animation: "slideUp 0.35s ease"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32, height: 32, borderRadius: "50%", background: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }, children: "✓" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 15 }, children: "Your video has been uploaded!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#81c784", fontSize: 12, marginTop: 2 }, children: "Now live in the feed 🎉" })
      ] })
    ] }),
    loginToast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      top: 24,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      background: "linear-gradient(135deg,#1a1a2e,#16213e)",
      border: "1.5px solid #6c63ff",
      borderRadius: 18,
      padding: "14px 22px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      animation: "slideDown 0.35s ease",
      whiteSpace: "nowrap"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#6c63ff,#ff6b6b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        flexShrink: 0
      }, children: "✓" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }, children: "✨ Sachi is Live for you" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#a09de8", fontSize: 12, marginTop: 2 }, children: "Welcome in — let's go 🔥" })
      ] })
    ] }),
    showAuth && /* @__PURE__ */ jsxRuntimeExports.jsx(AuthModal, { onClose: () => setShowAuth(false), onSuccess: (user) => {
      setCurrentUser(user);
      setShowAuth(false);
      setActiveTab("feed");
      setFeedKey((k2) => k2 + 1);
      setLoginToast(true);
      setTimeout(() => setLoginToast(false), 4e3);
    } }),
    showEditProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 9e3, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
        onClick: () => setShowEditProfile(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { background: "#1a1a2e", borderRadius: 20, padding: 24, width: "100%", maxWidth: 420 },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 16 }, children: "✏️ Edit Display Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: editProfileName,
                  onChange: (e) => setEditProfileName(e.target.value),
                  placeholder: (currentUser == null ? void 0 : currentUser.full_name) || username || "Your display name",
                  defaultValue: (currentUser == null ? void 0 : currentUser.full_name) || "",
                  style: {
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    color: "#fff",
                    padding: "12px 14px",
                    fontSize: 15,
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setShowEditProfile(false),
                    style: {
                      flex: 1,
                      padding: "12px 0",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      color: "#aaa",
                      fontSize: 14,
                      cursor: "pointer"
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: async () => {
                      if (!editProfileName.trim()) return;
                      setEditProfileSaving(true);
                      try {
                        await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/auth/me`, { full_name: editProfileName.trim() });
                        setCurrentUser((u2) => ({ ...u2, full_name: editProfileName.trim() }));
                        setShowEditProfile(false);
                      } catch (e) {
                        alert("Save failed: " + e.message);
                      } finally {
                        setEditProfileSaving(false);
                      }
                    },
                    disabled: editProfileSaving,
                    style: {
                      flex: 2,
                      padding: "12px 0",
                      background: "linear-gradient(135deg,#e91e63,#9c27b0)",
                      border: "none",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: editProfileSaving ? "not-allowed" : "pointer"
                    },
                    children: editProfileSaving ? "Saving..." : "Save Name"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    showAvatarPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarPickerModal, { currentAvatar: avatarUrl, onSelect: async (url) => {
      var _a2;
      setAvatarUrl(url);
      setCurrentUser((u2) => ({ ...u2, avatar_url: url }));
      setShowAvatarPicker(false);
      if (!currentUser || url.startsWith("data:")) return;
      localStorage.setItem(`avatar_${currentUser.id}`, url);
      localStorage.setItem("avatar_last", url);
      localStorage.setItem("sachi_user", JSON.stringify({ ...currentUser, avatar_url: url }));
      try {
        const usersData = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser/?email=${encodeURIComponent(currentUser.email)}`);
        const users = Array.isArray(usersData) ? usersData : (usersData == null ? void 0 : usersData.items) || (usersData == null ? void 0 : usersData.records) || [];
        const match = users.find((u2) => u2.email === currentUser.email || u2.user_id === currentUser.id);
        if (match) {
          if (url.startsWith("https://") || url.startsWith("http://")) {
            await fetch("https://sachi-c7f0261c.base44.app/functions/uploadAvatar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image_base64: url, mime_type: "image/jpeg", entity_id: match.id })
            });
          }
        }
      } catch (e) {
        console.warn("User entity update failed:", e);
      }
      try {
        await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/auth/me`, { avatar_url: url });
      } catch (e) {
        console.warn("Auth avatar update failed (ok for Google users):", e);
      }
      try {
        const vidsData = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/?username=${encodeURIComponent(currentUser.username || ((_a2 = currentUser.email) == null ? void 0 : _a2.split("@")[0]))}&limit=200`);
        const vids = Array.isArray(vidsData) ? vidsData : (vidsData == null ? void 0 : vidsData.items) || (vidsData == null ? void 0 : vidsData.records) || [];
        await Promise.all(vids.map((v2) => request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/${v2.id}/`, { avatar_url: url })));
        setVideoList((vs) => vs.map(
          (v2) => {
            var _a3;
            return v2.user_id === currentUser.id || v2.created_by === currentUser.id || v2.username === (currentUser.username || ((_a3 = currentUser.email) == null ? void 0 : _a3.split("@")[0])) ? { ...v2, avatar_url: url } : v2;
          }
        ));
      } catch (e) {
        console.warn("Video avatar sync failed:", e);
      }
    }, onClose: () => setShowAvatarPicker(false) })
  ] });
}
class ErrorBoundary extends React$1.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  render() {
    var _a;
    if (this.state.error) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#0f0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#1a1a2e", borderRadius: 16, padding: 32, maxWidth: 340, width: "100%", textAlign: "center", border: "1px solid rgba(255,107,107,0.3)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "😅" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff6b6b", fontWeight: 800, fontSize: 18, marginBottom: 8 }, children: "Something went wrong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#888", fontSize: 13, marginBottom: 24 }, children: ((_a = this.state.error) == null ? void 0 : _a.message) || "Unknown error" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            style: { background: "linear-gradient(135deg,#ff6b6b,#ff8e53)", border: "none", borderRadius: 12, padding: "12px 24px", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" },
            children: "Reload App"
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
function Root() {
  const path = window.location.pathname;
  if (path === "/privacy" || path === "/privacy/") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Privacy, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(App, {});
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, {}) })
);
