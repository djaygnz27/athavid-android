//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region node_modules/react/cjs/react.production.min.js
/**
* @license React
* react.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var l = Symbol.for("react.element"), n = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), q = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z = Symbol.iterator;
	function A(a) {
		if (null === a || "object" !== typeof a) return null;
		a = z && a[z] || a["@@iterator"];
		return "function" === typeof a ? a : null;
	}
	var B = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, C = Object.assign, D = {};
	function E(a, b, e) {
		this.props = a;
		this.context = b;
		this.refs = D;
		this.updater = e || B;
	}
	E.prototype.isReactComponent = {};
	E.prototype.setState = function(a, b) {
		if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, a, b, "setState");
	};
	E.prototype.forceUpdate = function(a) {
		this.updater.enqueueForceUpdate(this, a, "forceUpdate");
	};
	function F() {}
	F.prototype = E.prototype;
	function G(a, b, e) {
		this.props = a;
		this.context = b;
		this.refs = D;
		this.updater = e || B;
	}
	var H = G.prototype = new F();
	H.constructor = G;
	C(H, E.prototype);
	H.isPureReactComponent = !0;
	var I = Array.isArray, J = Object.prototype.hasOwnProperty, K = { current: null }, L = {
		key: !0,
		ref: !0,
		__self: !0,
		__source: !0
	};
	function M(a, b, e) {
		var d, c = {}, k = null, h = null;
		if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
		var g = arguments.length - 2;
		if (1 === g) c.children = e;
		else if (1 < g) {
			for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
			c.children = f;
		}
		if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
		return {
			$$typeof: l,
			type: a,
			key: k,
			ref: h,
			props: c,
			_owner: K.current
		};
	}
	function N(a, b) {
		return {
			$$typeof: l,
			type: a.type,
			key: b,
			ref: a.ref,
			props: a.props,
			_owner: a._owner
		};
	}
	function O(a) {
		return "object" === typeof a && null !== a && a.$$typeof === l;
	}
	function escape(a) {
		var b = {
			"=": "=0",
			":": "=2"
		};
		return "$" + a.replace(/[=:]/g, function(a) {
			return b[a];
		});
	}
	var P = /\/+/g;
	function Q(a, b) {
		return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
	}
	function R(a, b, e, d, c) {
		var k = typeof a;
		if ("undefined" === k || "boolean" === k) a = null;
		var h = !1;
		if (null === a) h = !0;
		else switch (k) {
			case "string":
			case "number":
				h = !0;
				break;
			case "object": switch (a.$$typeof) {
				case l:
				case n: h = !0;
			}
		}
		if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a) {
			return a;
		})) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
		h = 0;
		d = "" === d ? "." : d + ":";
		if (I(a)) for (var g = 0; g < a.length; g++) {
			k = a[g];
			var f = d + Q(k, g);
			h += R(k, b, e, f, c);
		}
		else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done;) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
		else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
		return h;
	}
	function S(a, b, e) {
		if (null == a) return a;
		var d = [], c = 0;
		R(a, d, "", "", function(a) {
			return b.call(e, a, c++);
		});
		return d;
	}
	function T(a) {
		if (-1 === a._status) {
			var b = a._result;
			b = b();
			b.then(function(b) {
				if (0 === a._status || -1 === a._status) a._status = 1, a._result = b;
			}, function(b) {
				if (0 === a._status || -1 === a._status) a._status = 2, a._result = b;
			});
			-1 === a._status && (a._status = 0, a._result = b);
		}
		if (1 === a._status) return a._result.default;
		throw a._result;
	}
	var U = { current: null }, V = { transition: null }, W = {
		ReactCurrentDispatcher: U,
		ReactCurrentBatchConfig: V,
		ReactCurrentOwner: K
	};
	function X() {
		throw Error("act(...) is not supported in production builds of React.");
	}
	exports.Children = {
		map: S,
		forEach: function(a, b, e) {
			S(a, function() {
				b.apply(this, arguments);
			}, e);
		},
		count: function(a) {
			var b = 0;
			S(a, function() {
				b++;
			});
			return b;
		},
		toArray: function(a) {
			return S(a, function(a) {
				return a;
			}) || [];
		},
		only: function(a) {
			if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
			return a;
		}
	};
	exports.Component = E;
	exports.Fragment = p;
	exports.Profiler = r;
	exports.PureComponent = G;
	exports.StrictMode = q;
	exports.Suspense = w;
	exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
	exports.act = X;
	exports.cloneElement = function(a, b, e) {
		if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
		var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
		if (null != b) {
			void 0 !== b.ref && (k = b.ref, h = K.current);
			void 0 !== b.key && (c = "" + b.key);
			if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
			for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
		}
		var f = arguments.length - 2;
		if (1 === f) d.children = e;
		else if (1 < f) {
			g = Array(f);
			for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
			d.children = g;
		}
		return {
			$$typeof: l,
			type: a.type,
			key: c,
			ref: k,
			props: d,
			_owner: h
		};
	};
	exports.createContext = function(a) {
		a = {
			$$typeof: u,
			_currentValue: a,
			_currentValue2: a,
			_threadCount: 0,
			Provider: null,
			Consumer: null,
			_defaultValue: null,
			_globalName: null
		};
		a.Provider = {
			$$typeof: t,
			_context: a
		};
		return a.Consumer = a;
	};
	exports.createElement = M;
	exports.createFactory = function(a) {
		var b = M.bind(null, a);
		b.type = a;
		return b;
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(a) {
		return {
			$$typeof: v,
			render: a
		};
	};
	exports.isValidElement = O;
	exports.lazy = function(a) {
		return {
			$$typeof: y,
			_payload: {
				_status: -1,
				_result: a
			},
			_init: T
		};
	};
	exports.memo = function(a, b) {
		return {
			$$typeof: x,
			type: a,
			compare: void 0 === b ? null : b
		};
	};
	exports.startTransition = function(a) {
		var b = V.transition;
		V.transition = {};
		try {
			a();
		} finally {
			V.transition = b;
		}
	};
	exports.unstable_act = X;
	exports.useCallback = function(a, b) {
		return U.current.useCallback(a, b);
	};
	exports.useContext = function(a) {
		return U.current.useContext(a);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(a) {
		return U.current.useDeferredValue(a);
	};
	exports.useEffect = function(a, b) {
		return U.current.useEffect(a, b);
	};
	exports.useId = function() {
		return U.current.useId();
	};
	exports.useImperativeHandle = function(a, b, e) {
		return U.current.useImperativeHandle(a, b, e);
	};
	exports.useInsertionEffect = function(a, b) {
		return U.current.useInsertionEffect(a, b);
	};
	exports.useLayoutEffect = function(a, b) {
		return U.current.useLayoutEffect(a, b);
	};
	exports.useMemo = function(a, b) {
		return U.current.useMemo(a, b);
	};
	exports.useReducer = function(a, b, e) {
		return U.current.useReducer(a, b, e);
	};
	exports.useRef = function(a) {
		return U.current.useRef(a);
	};
	exports.useState = function(a) {
		return U.current.useState(a);
	};
	exports.useSyncExternalStore = function(a, b, e) {
		return U.current.useSyncExternalStore(a, b, e);
	};
	exports.useTransition = function() {
		return U.current.useTransition();
	};
	exports.version = "18.3.1";
}));
//#endregion
//#region node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production_min();
}));
//#endregion
//#region node_modules/scheduler/cjs/scheduler.production.min.js
/**
* @license React
* scheduler.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_scheduler_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	function f(a, b) {
		var c = a.length;
		a.push(b);
		a: for (; 0 < c;) {
			var d = c - 1 >>> 1, e = a[d];
			if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
			else break a;
		}
	}
	function h(a) {
		return 0 === a.length ? null : a[0];
	}
	function k(a) {
		if (0 === a.length) return null;
		var b = a[0], c = a.pop();
		if (c !== b) {
			a[0] = c;
			a: for (var d = 0, e = a.length, w = e >>> 1; d < w;) {
				var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
				if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
				else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
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
		var l = performance;
		exports.unstable_now = function() {
			return l.now();
		};
	} else {
		var p = Date, q = p.now();
		exports.unstable_now = function() {
			return p.now() - q;
		};
	}
	var r = [], t = [], u = 1, v = null, y = 3, z = !1, A = !1, B = !1, D = "function" === typeof setTimeout ? setTimeout : null, E = "function" === typeof clearTimeout ? clearTimeout : null, F = "undefined" !== typeof setImmediate ? setImmediate : null;
	"undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
	function G(a) {
		for (var b = h(t); null !== b;) {
			if (null === b.callback) k(t);
			else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
			else break;
			b = h(t);
		}
	}
	function H(a) {
		B = !1;
		G(a);
		if (!A) if (null !== h(r)) A = !0, I(J);
		else {
			var b = h(t);
			null !== b && K(H, b.startTime - a);
		}
	}
	function J(a, b) {
		A = !1;
		B && (B = !1, E(L), L = -1);
		z = !0;
		var c = y;
		try {
			G(b);
			for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M());) {
				var d = v.callback;
				if ("function" === typeof d) {
					v.callback = null;
					y = v.priorityLevel;
					var e = d(v.expirationTime <= b);
					b = exports.unstable_now();
					"function" === typeof e ? v.callback = e : v === h(r) && k(r);
					G(b);
				} else k(r);
				v = h(r);
			}
			if (null !== v) var w = !0;
			else {
				var m = h(t);
				null !== m && K(H, m.startTime - b);
				w = !1;
			}
			return w;
		} finally {
			v = null, y = c, z = !1;
		}
	}
	var N = !1, O = null, L = -1, P = 5, Q = -1;
	function M() {
		return exports.unstable_now() - Q < P ? !1 : !0;
	}
	function R() {
		if (null !== O) {
			var a = exports.unstable_now();
			Q = a;
			var b = !0;
			try {
				b = O(!0, a);
			} finally {
				b ? S() : (N = !1, O = null);
			}
		} else N = !1;
	}
	var S;
	if ("function" === typeof F) S = function() {
		F(R);
	};
	else if ("undefined" !== typeof MessageChannel) {
		var T = new MessageChannel(), U = T.port2;
		T.port1.onmessage = R;
		S = function() {
			U.postMessage(null);
		};
	} else S = function() {
		D(R, 0);
	};
	function I(a) {
		O = a;
		N || (N = !0, S());
	}
	function K(a, b) {
		L = D(function() {
			a(exports.unstable_now());
		}, b);
	}
	exports.unstable_IdlePriority = 5;
	exports.unstable_ImmediatePriority = 1;
	exports.unstable_LowPriority = 4;
	exports.unstable_NormalPriority = 3;
	exports.unstable_Profiling = null;
	exports.unstable_UserBlockingPriority = 2;
	exports.unstable_cancelCallback = function(a) {
		a.callback = null;
	};
	exports.unstable_continueExecution = function() {
		A || z || (A = !0, I(J));
	};
	exports.unstable_forceFrameRate = function(a) {
		0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
	};
	exports.unstable_getCurrentPriorityLevel = function() {
		return y;
	};
	exports.unstable_getFirstCallbackNode = function() {
		return h(r);
	};
	exports.unstable_next = function(a) {
		switch (y) {
			case 1:
			case 2:
			case 3:
				var b = 3;
				break;
			default: b = y;
		}
		var c = y;
		y = b;
		try {
			return a();
		} finally {
			y = c;
		}
	};
	exports.unstable_pauseExecution = function() {};
	exports.unstable_requestPaint = function() {};
	exports.unstable_runWithPriority = function(a, b) {
		switch (a) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: a = 3;
		}
		var c = y;
		y = a;
		try {
			return b();
		} finally {
			y = c;
		}
	};
	exports.unstable_scheduleCallback = function(a, b, c) {
		var d = exports.unstable_now();
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
			default: e = 5e3;
		}
		e = c + e;
		a = {
			id: u++,
			callback: b,
			priorityLevel: a,
			startTime: c,
			expirationTime: e,
			sortIndex: -1
		};
		c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = !0, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = !0, I(J)));
		return a;
	};
	exports.unstable_shouldYield = M;
	exports.unstable_wrapCallback = function(a) {
		var b = y;
		return function() {
			var c = y;
			y = b;
			try {
				return a.apply(this, arguments);
			} finally {
				y = c;
			}
		};
	};
}));
//#endregion
//#region node_modules/scheduler/index.js
var require_scheduler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_scheduler_production_min();
}));
//#endregion
//#region node_modules/react-dom/cjs/react-dom.production.min.js
/**
* @license React
* react-dom.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var aa = require_react(), ca = require_scheduler();
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
		if (ja.call(ma, a)) return !0;
		if (ja.call(la, a)) return !1;
		if (ka.test(a)) return ma[a] = !0;
		la[a] = !0;
		return !1;
	}
	function pa(a, b, c, d) {
		if (null !== c && 0 === c.type) return !1;
		switch (typeof b) {
			case "function":
			case "symbol": return !0;
			case "boolean":
				if (d) return !1;
				if (null !== c) return !c.acceptsBooleans;
				a = a.toLowerCase().slice(0, 5);
				return "data-" !== a && "aria-" !== a;
			default: return !1;
		}
	}
	function qa(a, b, c, d) {
		if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return !0;
		if (d) return !1;
		if (null !== c) switch (c.type) {
			case 3: return !b;
			case 4: return !1 === b;
			case 5: return isNaN(b);
			case 6: return isNaN(b) || 1 > b;
		}
		return !1;
	}
	function v(a, b, c, d, e, f, g) {
		this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
		this.attributeName = d;
		this.attributeNamespace = e;
		this.mustUseProperty = c;
		this.propertyName = a;
		this.type = b;
		this.sanitizeURL = f;
		this.removeEmptyString = g;
	}
	var z = {};
	"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
		z[a] = new v(a, 0, !1, a, null, !1, !1);
	});
	[
		["acceptCharset", "accept-charset"],
		["className", "class"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"]
	].forEach(function(a) {
		var b = a[0];
		z[b] = new v(b, 1, !1, a[1], null, !1, !1);
	});
	[
		"contentEditable",
		"draggable",
		"spellCheck",
		"value"
	].forEach(function(a) {
		z[a] = new v(a, 2, !1, a.toLowerCase(), null, !1, !1);
	});
	[
		"autoReverse",
		"externalResourcesRequired",
		"focusable",
		"preserveAlpha"
	].forEach(function(a) {
		z[a] = new v(a, 2, !1, a, null, !1, !1);
	});
	"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
		z[a] = new v(a, 3, !1, a.toLowerCase(), null, !1, !1);
	});
	[
		"checked",
		"multiple",
		"muted",
		"selected"
	].forEach(function(a) {
		z[a] = new v(a, 3, !0, a, null, !1, !1);
	});
	["capture", "download"].forEach(function(a) {
		z[a] = new v(a, 4, !1, a, null, !1, !1);
	});
	[
		"cols",
		"rows",
		"size",
		"span"
	].forEach(function(a) {
		z[a] = new v(a, 6, !1, a, null, !1, !1);
	});
	["rowSpan", "start"].forEach(function(a) {
		z[a] = new v(a, 5, !1, a.toLowerCase(), null, !1, !1);
	});
	var ra = /[\-:]([a-z])/g;
	function sa(a) {
		return a[1].toUpperCase();
	}
	"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
		var b = a.replace(ra, sa);
		z[b] = new v(b, 1, !1, a, null, !1, !1);
	});
	"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
		var b = a.replace(ra, sa);
		z[b] = new v(b, 1, !1, a, "http://www.w3.org/1999/xlink", !1, !1);
	});
	[
		"xml:base",
		"xml:lang",
		"xml:space"
	].forEach(function(a) {
		var b = a.replace(ra, sa);
		z[b] = new v(b, 1, !1, a, "http://www.w3.org/XML/1998/namespace", !1, !1);
	});
	["tabIndex", "crossOrigin"].forEach(function(a) {
		z[a] = new v(a, 1, !1, a.toLowerCase(), null, !1, !1);
	});
	z.xlinkHref = new v("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
	[
		"src",
		"href",
		"action",
		"formAction"
	].forEach(function(a) {
		z[a] = new v(a, 1, !1, a.toLowerCase(), null, !0, !0);
	});
	function ta(a, b, c, d) {
		var e = z.hasOwnProperty(b) ? z[b] : null;
		if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? !1 : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && !0 === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
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
	var Na = !1;
	function Oa(a, b) {
		if (!a || Na) return "";
		Na = !0;
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
				} catch (l) {
					var d = l;
				}
				Reflect.construct(a, [], b);
			} else {
				try {
					b.call();
				} catch (l) {
					d = l;
				}
				a.call(b.prototype);
			}
			else {
				try {
					throw Error();
				} catch (l) {
					d = l;
				}
				a();
			}
		} catch (l) {
			if (l && d && "string" === typeof l.stack) {
				for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h];) h--;
				for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
					if (1 !== g || 1 !== h) do
						if (g--, h--, 0 > h || e[g] !== f[h]) {
							var k = "\n" + e[g].replace(" at new ", " at ");
							a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
							return k;
						}
					while (1 <= g && 0 <= h);
					break;
				}
			}
		} finally {
			Na = !1, Error.prepareStackTrace = c;
		}
		return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
	}
	function Pa(a) {
		switch (a.tag) {
			case 5: return Ma(a.type);
			case 16: return Ma("Lazy");
			case 13: return Ma("Suspense");
			case 19: return Ma("SuspenseList");
			case 0:
			case 2:
			case 15: return a = Oa(a.type, !1), a;
			case 11: return a = Oa(a.type.render, !1), a;
			case 1: return a = Oa(a.type, !0), a;
			default: return "";
		}
	}
	function Qa(a) {
		if (null == a) return null;
		if ("function" === typeof a) return a.displayName || a.name || null;
		if ("string" === typeof a) return a;
		switch (a) {
			case ya: return "Fragment";
			case wa: return "Portal";
			case Aa: return "Profiler";
			case za: return "StrictMode";
			case Ea: return "Suspense";
			case Fa: return "SuspenseList";
		}
		if ("object" === typeof a) switch (a.$$typeof) {
			case Ca: return (a.displayName || "Context") + ".Consumer";
			case Ba: return (a._context.displayName || "Context") + ".Provider";
			case Da:
				var b = a.render;
				a = a.displayName;
				a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
				return a;
			case Ga: return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
			case Ha:
				b = a._payload;
				a = a._init;
				try {
					return Qa(a(b));
				} catch (c) {}
		}
		return null;
	}
	function Ra(a) {
		var b = a.type;
		switch (a.tag) {
			case 24: return "Cache";
			case 9: return (b.displayName || "Context") + ".Consumer";
			case 10: return (b._context.displayName || "Context") + ".Provider";
			case 18: return "DehydratedFragment";
			case 11: return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
			case 7: return "Fragment";
			case 5: return b;
			case 4: return "Portal";
			case 3: return "Root";
			case 6: return "Text";
			case 16: return Qa(b);
			case 8: return b === za ? "StrictMode" : "Mode";
			case 22: return "Offscreen";
			case 12: return "Profiler";
			case 21: return "Scope";
			case 13: return "Suspense";
			case 19: return "SuspenseList";
			case 25: return "TracingMarker";
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
			case "undefined": return a;
			case "object": return a;
			default: return "";
		}
	}
	function Ta(a) {
		var b = a.type;
		return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
	}
	function Ua(a) {
		var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
		if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
			var e = c.get, f = c.set;
			Object.defineProperty(a, b, {
				configurable: !0,
				get: function() {
					return e.call(this);
				},
				set: function(a) {
					d = "" + a;
					f.call(this, a);
				}
			});
			Object.defineProperty(a, b, { enumerable: c.enumerable });
			return {
				getValue: function() {
					return d;
				},
				setValue: function(a) {
					d = "" + a;
				},
				stopTracking: function() {
					a._valueTracker = null;
					delete a[b];
				}
			};
		}
	}
	function Va(a) {
		a._valueTracker || (a._valueTracker = Ua(a));
	}
	function Wa(a) {
		if (!a) return !1;
		var b = a._valueTracker;
		if (!b) return !0;
		var c = b.getValue();
		var d = "";
		a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
		a = d;
		return a !== c ? (b.setValue(a), !0) : !1;
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
		return A({}, b, {
			defaultChecked: void 0,
			defaultValue: void 0,
			value: void 0,
			checked: null != c ? c : a._wrapperState.initialChecked
		});
	}
	function Za(a, b) {
		var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
		c = Sa(null != b.value ? b.value : c);
		a._wrapperState = {
			initialChecked: d,
			initialValue: c,
			controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value
		};
	}
	function ab(a, b) {
		b = b.checked;
		null != b && ta(a, "checked", b, !1);
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
			for (var e = 0; e < c.length; e++) b["$" + c[e]] = !0;
			for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = !0);
		} else {
			c = "" + Sa(c);
			b = null;
			for (e = 0; e < a.length; e++) {
				if (a[e].value === c) {
					a[e].selected = !0;
					d && (a[e].defaultSelected = !0);
					return;
				}
				null !== b || a[e].disabled || (b = a[e]);
			}
			null !== b && (b.selected = !0);
		}
	}
	function gb(a, b) {
		if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
		return A({}, b, {
			value: void 0,
			defaultValue: void 0,
			children: "" + a._wrapperState.initialValue
		});
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
			b ??= "";
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
			case "svg": return "http://www.w3.org/2000/svg";
			case "math": return "http://www.w3.org/1998/Math/MathML";
			default: return "http://www.w3.org/1999/xhtml";
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
			for (b = mb.firstChild; a.firstChild;) a.removeChild(a.firstChild);
			for (; b.firstChild;) a.appendChild(b.firstChild);
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
		animationIterationCount: !0,
		aspectRatio: !0,
		borderImageOutset: !0,
		borderImageSlice: !0,
		borderImageWidth: !0,
		boxFlex: !0,
		boxFlexGroup: !0,
		boxOrdinalGroup: !0,
		columnCount: !0,
		columns: !0,
		flex: !0,
		flexGrow: !0,
		flexPositive: !0,
		flexShrink: !0,
		flexNegative: !0,
		flexOrder: !0,
		gridArea: !0,
		gridRow: !0,
		gridRowEnd: !0,
		gridRowSpan: !0,
		gridRowStart: !0,
		gridColumn: !0,
		gridColumnEnd: !0,
		gridColumnSpan: !0,
		gridColumnStart: !0,
		fontWeight: !0,
		lineClamp: !0,
		lineHeight: !0,
		opacity: !0,
		order: !0,
		orphans: !0,
		tabSize: !0,
		widows: !0,
		zIndex: !0,
		zoom: !0,
		fillOpacity: !0,
		floodOpacity: !0,
		stopOpacity: !0,
		strokeDasharray: !0,
		strokeDashoffset: !0,
		strokeMiterlimit: !0,
		strokeOpacity: !0,
		strokeWidth: !0
	}, qb = [
		"Webkit",
		"ms",
		"Moz",
		"O"
	];
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
	var tb = A({ menuitem: !0 }, {
		area: !0,
		base: !0,
		br: !0,
		col: !0,
		embed: !0,
		hr: !0,
		img: !0,
		input: !0,
		keygen: !0,
		link: !0,
		meta: !0,
		param: !0,
		source: !0,
		track: !0,
		wbr: !0
	});
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
			case "missing-glyph": return !1;
			default: return !0;
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
	function Hb() {}
	var Ib = !1;
	function Jb(a, b, c) {
		if (Ib) return a(b, c);
		Ib = !0;
		try {
			return Gb(a, b, c);
		} finally {
			if (Ib = !1, null !== zb || null !== Ab) Hb(), Fb();
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
			default: a = !1;
		}
		if (a) return null;
		if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
		return c;
	}
	var Lb = !1;
	if (ia) try {
		var Mb = {};
		Object.defineProperty(Mb, "passive", { get: function() {
			Lb = !0;
		} });
		window.addEventListener("test", Mb, Mb);
		window.removeEventListener("test", Mb, Mb);
	} catch (a) {
		Lb = !1;
	}
	function Nb(a, b, c, d, e, f, g, h, k) {
		var l = Array.prototype.slice.call(arguments, 3);
		try {
			b.apply(c, l);
		} catch (m) {
			this.onError(m);
		}
	}
	var Ob = !1, Pb = null, Qb = !1, Rb = null, Sb = { onError: function(a) {
		Ob = !0;
		Pb = a;
	} };
	function Tb(a, b, c, d, e, f, g, h, k) {
		Ob = !1;
		Pb = null;
		Nb.apply(Sb, arguments);
	}
	function Ub(a, b, c, d, e, f, g, h, k) {
		Tb.apply(this, arguments);
		if (Ob) {
			if (Ob) {
				var l = Pb;
				Ob = !1;
				Pb = null;
			} else throw Error(p(198));
			Qb || (Qb = !0, Rb = l);
		}
	}
	function Vb(a) {
		var b = a, c = a;
		if (a.alternate) for (; b.return;) b = b.return;
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
		for (var c = a, d = b;;) {
			var e = c.return;
			if (null === e) break;
			var f = e.alternate;
			if (null === f) {
				d = e.return;
				if (null !== d) {
					c = d;
					continue;
				}
				break;
			}
			if (e.child === f.child) {
				for (f = e.child; f;) {
					if (f === c) return Xb(e), a;
					if (f === d) return Xb(e), b;
					f = f.sibling;
				}
				throw Error(p(188));
			}
			if (c.return !== d.return) c = e, d = f;
			else {
				for (var g = !1, h = e.child; h;) {
					if (h === c) {
						g = !0;
						c = e;
						d = f;
						break;
					}
					if (h === d) {
						g = !0;
						d = e;
						c = f;
						break;
					}
					h = h.sibling;
				}
				if (!g) {
					for (h = f.child; h;) {
						if (h === c) {
							g = !0;
							c = f;
							d = e;
							break;
						}
						if (h === d) {
							g = !0;
							d = f;
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
		for (a = a.child; null !== a;) {
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
		} catch (b) {}
	}
	var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
	function nc(a) {
		a >>>= 0;
		return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
	}
	var rc = 64, sc = 4194304;
	function tc(a) {
		switch (a & -a) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
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
			case 2097152: return a & 4194240;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
			case 67108864: return a & 130023424;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 1073741824;
			default: return a;
		}
	}
	function uc(a, b) {
		var c = a.pendingLanes;
		if (0 === c) return 0;
		var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
		if (0 !== g) {
			var h = g & ~e;
			0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
		} else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
		if (0 === d) return 0;
		if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
		0 !== (d & 4) && (d |= c & 16);
		b = a.entangledLanes;
		if (0 !== b) for (a = a.entanglements, b &= d; 0 < b;) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
		return d;
	}
	function vc(a, b) {
		switch (a) {
			case 1:
			case 2:
			case 4: return b + 250;
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
			case 2097152: return b + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
			case 67108864: return -1;
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function wc(a, b) {
		for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f;) {
			var g = 31 - oc(f), h = 1 << g, k = e[g];
			if (-1 === k) {
				if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
			} else k <= b && (a.expiredLanes |= h);
			f &= ~h;
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
		for (a = a.expirationTimes; 0 < c;) {
			var e = 31 - oc(c), f = 1 << e;
			b[e] = 0;
			d[e] = -1;
			a[e] = -1;
			c &= ~f;
		}
	}
	function Cc(a, b) {
		var c = a.entangledLanes |= b;
		for (a = a.entanglements; c;) {
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
	var Ec, Fc, Gc, Hc, Ic, Jc = !1, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
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
			case "lostpointercapture": Pc.delete(b.pointerId);
		}
	}
	function Tc(a, b, c, d, e, f) {
		if (null === a || a.nativeEvent !== f) return a = {
			blockedOn: b,
			domEventName: c,
			eventSystemFlags: d,
			nativeEvent: f,
			targetContainers: [e]
		}, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
		a.eventSystemFlags |= d;
		b = a.targetContainers;
		null !== e && -1 === b.indexOf(e) && b.push(e);
		return a;
	}
	function Uc(a, b, c, d, e) {
		switch (b) {
			case "focusin": return Lc = Tc(Lc, a, b, c, d, e), !0;
			case "dragenter": return Mc = Tc(Mc, a, b, c, d, e), !0;
			case "mouseover": return Nc = Tc(Nc, a, b, c, d, e), !0;
			case "pointerover":
				var f = e.pointerId;
				Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
				return !0;
			case "gotpointercapture": return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), !0;
		}
		return !1;
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
		if (null !== a.blockedOn) return !1;
		for (var b = a.targetContainers; 0 < b.length;) {
			var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
			if (null === c) {
				c = a.nativeEvent;
				var d = new c.constructor(c.type, c);
				wb = d;
				c.target.dispatchEvent(d);
				wb = null;
			} else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, !1;
			b.shift();
		}
		return !0;
	}
	function Zc(a, b, c) {
		Xc(a) && c.delete(b);
	}
	function $c() {
		Jc = !1;
		null !== Lc && Xc(Lc) && (Lc = null);
		null !== Mc && Xc(Mc) && (Mc = null);
		null !== Nc && Xc(Nc) && (Nc = null);
		Oc.forEach(Zc);
		Pc.forEach(Zc);
	}
	function ad(a, b) {
		a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = !0, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
	}
	function bd(a) {
		function b(b) {
			return ad(b, a);
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
		for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn);) Vc(c), null === c.blockedOn && Qc.shift();
	}
	var cd = ua.ReactCurrentBatchConfig, dd = !0;
	function ed(a, b, c, d) {
		var e = C, f = cd.transition;
		cd.transition = null;
		try {
			C = 1, fd(a, b, c, d);
		} finally {
			C = e, cd.transition = f;
		}
	}
	function gd(a, b, c, d) {
		var e = C, f = cd.transition;
		cd.transition = null;
		try {
			C = 4, fd(a, b, c, d);
		} finally {
			C = e, cd.transition = f;
		}
	}
	function fd(a, b, c, d) {
		if (dd) {
			var e = Yc(a, b, c, d);
			if (null === e) hd(a, b, d, id, c), Sc(a, d);
			else if (Uc(e, a, b, c, d)) d.stopPropagation();
			else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
				for (; null !== e;) {
					var f = Cb(e);
					null !== f && Ec(f);
					f = Yc(a, b, c, d);
					null === f && hd(a, b, d, id, c);
					if (f === e) break;
					e = f;
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
			case "selectstart": return 1;
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
			case "pointerleave": return 4;
			case "message": switch (ec()) {
				case fc: return 1;
				case gc: return 4;
				case hc:
				case ic: return 16;
				case jc: return 536870912;
				default: return 16;
			}
			default: return 16;
		}
	}
	var kd = null, ld = null, md = null;
	function nd() {
		if (md) return md;
		var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
		for (a = 0; a < c && b[a] === e[a]; a++);
		var g = c - a;
		for (d = 1; d <= g && b[c - d] === e[f - d]; d++);
		return md = e.slice(a, 1 < d ? 1 - d : void 0);
	}
	function od(a) {
		var b = a.keyCode;
		"charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
		10 === a && (a = 13);
		return 32 <= a || 13 === a ? a : 0;
	}
	function pd() {
		return !0;
	}
	function qd() {
		return !1;
	}
	function rd(a) {
		function b(b, d, e, f, g) {
			this._reactName = b;
			this._targetInst = e;
			this.type = d;
			this.nativeEvent = f;
			this.target = g;
			this.currentTarget = null;
			for (var c in a) a.hasOwnProperty(c) && (b = a[c], this[c] = b ? b(f) : f[c]);
			this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : !1 === f.returnValue) ? pd : qd;
			this.isPropagationStopped = qd;
			return this;
		}
		A(b.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var a = this.nativeEvent;
				a && (a.preventDefault ? a.preventDefault() : "unknown" !== typeof a.returnValue && (a.returnValue = !1), this.isDefaultPrevented = pd);
			},
			stopPropagation: function() {
				var a = this.nativeEvent;
				a && (a.stopPropagation ? a.stopPropagation() : "unknown" !== typeof a.cancelBubble && (a.cancelBubble = !0), this.isPropagationStopped = pd);
			},
			persist: function() {},
			isPersistent: pd
		});
		return b;
	}
	var sd = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(a) {
			return a.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, td = rd(sd), ud = A({}, sd, {
		view: 0,
		detail: 0
	}), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: zd,
		button: 0,
		buttons: 0,
		relatedTarget: function(a) {
			return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
		},
		movementX: function(a) {
			if ("movementX" in a) return a.movementX;
			a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
			return wd;
		},
		movementY: function(a) {
			return "movementY" in a ? a.movementY : xd;
		}
	}), Bd = rd(Ad), Dd = rd(A({}, Ad, { dataTransfer: 0 })), Fd = rd(A({}, ud, { relatedTarget: 0 })), Hd = rd(A({}, sd, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Jd = rd(A({}, sd, { clipboardData: function(a) {
		return "clipboardData" in a ? a.clipboardData : window.clipboardData;
	} })), Ld = rd(A({}, sd, { data: 0 })), Md = {
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
	}, Od = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Pd(a) {
		var b = this.nativeEvent;
		return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : !1;
	}
	function zd() {
		return Pd;
	}
	var Rd = rd(A({}, ud, {
		key: function(a) {
			if (a.key) {
				var b = Md[a.key] || a.key;
				if ("Unidentified" !== b) return b;
			}
			return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: zd,
		charCode: function(a) {
			return "keypress" === a.type ? od(a) : 0;
		},
		keyCode: function(a) {
			return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
		},
		which: function(a) {
			return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
		}
	})), Td = rd(A({}, Ad, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Vd = rd(A({}, ud, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: zd
	})), Xd = rd(A({}, sd, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Zd = rd(A({}, Ad, {
		deltaX: function(a) {
			return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
		},
		deltaY: function(a) {
			return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), $d = [
		9,
		13,
		27,
		32
	], ae = ia && "CompositionEvent" in window, be = null;
	ia && "documentMode" in document && (be = document.documentMode);
	var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = !1;
	function ge(a, b) {
		switch (a) {
			case "keyup": return -1 !== $d.indexOf(b.keyCode);
			case "keydown": return 229 !== b.keyCode;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function he(a) {
		a = a.detail;
		return "object" === typeof a && "data" in a ? a.data : null;
	}
	var ie = !1;
	function je(a, b) {
		switch (a) {
			case "compositionend": return he(b);
			case "keypress":
				if (32 !== b.which) return null;
				fe = !0;
				return ee;
			case "textInput": return a = b.data, a === ee && fe ? null : a;
			default: return null;
		}
	}
	function ke(a, b) {
		if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = !1, a) : null;
		switch (a) {
			case "paste": return null;
			case "keypress":
				if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
					if (b.char && 1 < b.char.length) return b.char;
					if (b.which) return String.fromCharCode(b.which);
				}
				return null;
			case "compositionend": return de && "ko" !== b.locale ? null : b.data;
			default: return null;
		}
	}
	var le = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function me(a) {
		var b = a && a.nodeName && a.nodeName.toLowerCase();
		return "input" === b ? !!le[a.type] : "textarea" === b ? !0 : !1;
	}
	function ne(a, b, c, d) {
		Eb(d);
		b = oe(b, "onChange");
		0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({
			event: c,
			listeners: b
		}));
	}
	var pe = null, qe = null;
	function re(a) {
		se(a, 0);
	}
	function te(a) {
		if (Wa(ue(a))) return a;
	}
	function ve(a, b) {
		if ("change" === a) return b;
	}
	var we = !1;
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
		} else xe = !1;
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
		if (He(a, b)) return !0;
		if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return !1;
		var c = Object.keys(a), d = Object.keys(b);
		if (c.length !== d.length) return !1;
		for (d = 0; d < c.length; d++) {
			var e = c[d];
			if (!ja.call(b, e) || !He(a[e], b[e])) return !1;
		}
		return !0;
	}
	function Je(a) {
		for (; a && a.firstChild;) a = a.firstChild;
		return a;
	}
	function Ke(a, b) {
		var c = Je(a);
		a = 0;
		for (var d; c;) {
			if (3 === c.nodeType) {
				d = a + c.textContent.length;
				if (a <= b && d >= b) return {
					node: c,
					offset: b - a
				};
				a = d;
			}
			a: {
				for (; c;) {
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
		return a && b ? a === b ? !0 : a && 3 === a.nodeType ? !1 : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : !1 : !1;
	}
	function Me() {
		for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement;) {
			try {
				var c = "string" === typeof b.contentWindow.location.href;
			} catch (d) {
				c = !1;
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
					var e = c.textContent.length, f = Math.min(d.start, e);
					d = void 0 === d.end ? f : Math.min(d.end, e);
					!a.extend && f > d && (e = d, d = f, f = e);
					e = Ke(c, f);
					var g = Ke(c, d);
					e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
				}
			}
			b = [];
			for (a = c; a = a.parentNode;) 1 === a.nodeType && b.push({
				element: a,
				left: a.scrollLeft,
				top: a.scrollTop
			});
			"function" === typeof c.focus && c.focus();
			for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
		}
	}
	var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = !1;
	function Ue(a, b, c) {
		var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
		Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = {
			start: d.selectionStart,
			end: d.selectionEnd
		} : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = {
			anchorNode: d.anchorNode,
			anchorOffset: d.anchorOffset,
			focusNode: d.focusNode,
			focusOffset: d.focusOffset
		}), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({
			event: b,
			listeners: d
		}), b.target = Qe)));
	}
	function Ve(a, b) {
		var c = {};
		c[a.toLowerCase()] = b.toLowerCase();
		c["Webkit" + a] = "webkit" + b;
		c["Moz" + a] = "moz" + b;
		return c;
	}
	var We = {
		animationend: Ve("Animation", "AnimationEnd"),
		animationiteration: Ve("Animation", "AnimationIteration"),
		animationstart: Ve("Animation", "AnimationStart"),
		transitionend: Ve("Transition", "TransitionEnd")
	}, Xe = {}, Ye = {};
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
		var hf = ef[gf];
		ff(hf.toLowerCase(), "on" + (hf[0].toUpperCase() + hf.slice(1)));
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
	fa("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]);
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
				var f = void 0;
				if (b) for (var g = d.length - 1; 0 <= g; g--) {
					var h = d[g], k = h.instance, l = h.currentTarget;
					h = h.listener;
					if (k !== f && e.isPropagationStopped()) break a;
					nf(e, h, l);
					f = k;
				}
				else for (g = 0; g < d.length; g++) {
					h = d[g];
					k = h.instance;
					l = h.currentTarget;
					h = h.listener;
					if (k !== f && e.isPropagationStopped()) break a;
					nf(e, h, l);
					f = k;
				}
			}
		}
		if (Qb) throw a = Rb, Qb = !1, Rb = null, a;
	}
	function D(a, b) {
		var c = b[of];
		void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
		var d = a + "__bubble";
		c.has(d) || (pf(b, a, 2, !1), c.add(d));
	}
	function qf(a, b, c) {
		var d = 0;
		b && (d |= 4);
		pf(c, a, d, b);
	}
	var rf = "_reactListening" + Math.random().toString(36).slice(2);
	function sf(a) {
		if (!a[rf]) {
			a[rf] = !0;
			da.forEach(function(b) {
				"selectionchange" !== b && (mf.has(b) || qf(b, !1, a), qf(b, !0, a));
			});
			var b = 9 === a.nodeType ? a : a.ownerDocument;
			null === b || b[rf] || (b[rf] = !0, qf("selectionchange", !1, b));
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
			default: e = fd;
		}
		c = e.bind(null, b, c, a);
		e = void 0;
		!Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = !0);
		d ? void 0 !== e ? a.addEventListener(b, c, {
			capture: !0,
			passive: e
		}) : a.addEventListener(b, c, !0) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, !1);
	}
	function hd(a, b, c, d, e) {
		var f = d;
		if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (;;) {
			if (null === d) return;
			var g = d.tag;
			if (3 === g || 4 === g) {
				var h = d.stateNode.containerInfo;
				if (h === e || 8 === h.nodeType && h.parentNode === e) break;
				if (4 === g) for (g = d.return; null !== g;) {
					var k = g.tag;
					if (3 === k || 4 === k) {
						if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
					}
					g = g.return;
				}
				for (; null !== h;) {
					g = Wc(h);
					if (null === g) return;
					k = g.tag;
					if (5 === k || 6 === k) {
						d = f = g;
						continue a;
					}
					h = h.parentNode;
				}
			}
			d = d.return;
		}
		Jb(function() {
			var d = f, e = xb(c), g = [];
			a: {
				var h = df.get(a);
				if (void 0 !== h) {
					var k = td, n = a;
					switch (a) {
						case "keypress": if (0 === od(c)) break a;
						case "keydown":
						case "keyup":
							k = Rd;
							break;
						case "focusin":
							n = "focus";
							k = Fd;
							break;
						case "focusout":
							n = "blur";
							k = Fd;
							break;
						case "beforeblur":
						case "afterblur":
							k = Fd;
							break;
						case "click": if (2 === c.button) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							k = Bd;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							k = Dd;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							k = Vd;
							break;
						case $e:
						case af:
						case bf:
							k = Hd;
							break;
						case cf:
							k = Xd;
							break;
						case "scroll":
							k = vd;
							break;
						case "wheel":
							k = Zd;
							break;
						case "copy":
						case "cut":
						case "paste":
							k = Jd;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup": k = Td;
					}
					var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h ? h + "Capture" : null : h;
					t = [];
					for (var w = d, u; null !== w;) {
						u = w;
						var F = u.stateNode;
						5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
						if (J) break;
						w = w.return;
					}
					0 < t.length && (h = new k(h, n, null, c, e), g.push({
						event: h,
						listeners: t
					}));
				}
			}
			if (0 === (b & 7)) {
				a: {
					h = "mouseover" === a || "pointerover" === a;
					k = "mouseout" === a || "pointerout" === a;
					if (h && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
					if (k || h) {
						h = e.window === e ? e : (h = e.ownerDocument) ? h.defaultView || h.parentWindow : window;
						if (k) {
							if (n = c.relatedTarget || c.toElement, k = d, n = n ? Wc(n) : null, null !== n && (J = Vb(n), n !== J || 5 !== n.tag && 6 !== n.tag)) n = null;
						} else k = null, n = d;
						if (k !== n) {
							t = Bd;
							F = "onMouseLeave";
							x = "onMouseEnter";
							w = "mouse";
							if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
							J = null == k ? h : ue(k);
							u = null == n ? h : ue(n);
							h = new t(F, w + "leave", k, c, e);
							h.target = J;
							h.relatedTarget = u;
							F = null;
							Wc(e) === d && (t = new t(x, w + "enter", n, c, e), t.target = u, t.relatedTarget = J, F = t);
							J = F;
							if (k && n) b: {
								t = k;
								x = n;
								w = 0;
								for (u = t; u; u = vf(u)) w++;
								u = 0;
								for (F = x; F; F = vf(F)) u++;
								for (; 0 < w - u;) t = vf(t), w--;
								for (; 0 < u - w;) x = vf(x), u--;
								for (; w--;) {
									if (t === x || null !== x && t === x.alternate) break b;
									t = vf(t);
									x = vf(x);
								}
								t = null;
							}
							else t = null;
							null !== k && wf(g, h, k, t, !1);
							null !== n && null !== J && wf(g, J, n, t, !0);
						}
					}
				}
				a: {
					h = d ? ue(d) : window;
					k = h.nodeName && h.nodeName.toLowerCase();
					if ("select" === k || "input" === k && "file" === h.type) var na = ve;
					else if (me(h)) if (we) na = Fe;
					else {
						na = De;
						var xa = Ce;
					}
					else (k = h.nodeName) && "input" === k.toLowerCase() && ("checkbox" === h.type || "radio" === h.type) && (na = Ee);
					if (na && (na = na(a, d))) {
						ne(g, na, c, e);
						break a;
					}
					xa && xa(a, h, d);
					"focusout" === a && (xa = h._wrapperState) && xa.controlled && "number" === h.type && cb(h, "number", h.value);
				}
				xa = d ? ue(d) : window;
				switch (a) {
					case "focusin":
						if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d, Se = null;
						break;
					case "focusout":
						Se = Re = Qe = null;
						break;
					case "mousedown":
						Te = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Te = !1;
						Ue(g, c, e);
						break;
					case "selectionchange": if (Pe) break;
					case "keydown":
					case "keyup": Ue(g, c, e);
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
				ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e, ld = "value" in kd ? kd.value : kd.textContent, ie = !0)), xa = oe(d, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e), g.push({
					event: ba,
					listeners: xa
				}), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
				if ($a = ce ? je(a, c) : ke(a, c)) d = oe(d, "onBeforeInput"), 0 < d.length && (e = new Ld("onBeforeInput", "beforeinput", null, c, e), g.push({
					event: e,
					listeners: d
				}), e.data = $a);
			}
			se(g, b);
		});
	}
	function tf(a, b, c) {
		return {
			instance: a,
			listener: b,
			currentTarget: c
		};
	}
	function oe(a, b) {
		for (var c = b + "Capture", d = []; null !== a;) {
			var e = a, f = e.stateNode;
			5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
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
		for (var f = b._reactName, g = []; null !== c && c !== d;) {
			var h = c, k = h.alternate, l = h.stateNode;
			if (null !== k && k === d) break;
			5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
			c = c.return;
		}
		0 !== g.length && a.push({
			event: b,
			listeners: g
		});
	}
	var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
	function zf(a) {
		return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
	}
	function Af(a, b, c) {
		b = zf(b);
		if (zf(a) !== b && c) throw Error(p(425));
	}
	function Bf() {}
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
		for (var b = 0; a;) {
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
		for (var c = a.parentNode; c;) {
			if (b = c[uf] || c[Of]) {
				c = b.alternate;
				if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a;) {
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
	var Vf = {}, H = Uf(Vf), Wf = Uf(!1), Xf = Vf;
	function Yf(a, b) {
		var c = a.type.contextTypes;
		if (!c) return Vf;
		var d = a.stateNode;
		if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
		var e = {}, f;
		for (f in c) e[f] = b[f];
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
		return !0;
	}
	function dg(a, b, c) {
		var d = a.stateNode;
		if (!d) throw Error(p(169));
		c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
		G(Wf, c);
	}
	var eg = null, fg = !1, gg = !1;
	function hg(a) {
		null === eg ? eg = [a] : eg.push(a);
	}
	function ig(a) {
		fg = !0;
		hg(a);
	}
	function jg() {
		if (!gg && null !== eg) {
			gg = !0;
			var a = 0, b = C;
			try {
				var c = eg;
				for (C = 1; a < c.length; a++) {
					var d = c[a];
					do
						d = d(!0);
					while (null !== d);
				}
				eg = null;
				fg = !1;
			} catch (e) {
				throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
			} finally {
				C = b, gg = !1;
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
		var f = 32 - oc(b) + e;
		if (30 < f) {
			var g = e - e % 5;
			f = (d & (1 << g) - 1).toString(32);
			d >>= g;
			e -= g;
			rg = 1 << 32 - oc(b) + e | c << e | d;
			sg = f + a;
		} else rg = 1 << f | c << e | d, sg = a;
	}
	function vg(a) {
		null !== a.return && (tg(a, 1), ug(a, 1, 0));
	}
	function wg(a) {
		for (; a === mg;) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
		for (; a === qg;) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
	}
	var xg = null, yg = null, I = !1, zg = null;
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
				return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), !0) : !1;
			case 6: return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, !0) : !1;
			case 13: return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? {
				id: rg,
				overflow: sg
			} : null, a.memoizedState = {
				dehydrated: b,
				treeContext: c,
				retryLane: 1073741824
			}, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, !0) : !1;
			default: return !1;
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
					b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = !1, xg = a);
				}
			} else {
				if (Dg(a)) throw Error(p(418));
				a.flags = a.flags & -4097 | 2;
				I = !1;
				xg = a;
			}
		}
	}
	function Fg(a) {
		for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag;) a = a.return;
		xg = a;
	}
	function Gg(a) {
		if (a !== xg) return !1;
		if (!I) return Fg(a), I = !0, !1;
		var b;
		(b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
		if (b && (b = yg)) {
			if (Dg(a)) throw Hg(), Error(p(418));
			for (; b;) Ag(a, b), b = Lf(b.nextSibling);
		}
		Fg(a);
		if (13 === a.tag) {
			a = a.memoizedState;
			a = null !== a ? a.dehydrated : null;
			if (!a) throw Error(p(317));
			a: {
				a = a.nextSibling;
				for (b = 0; a;) {
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
		return !0;
	}
	function Hg() {
		for (var a = yg; a;) a = Lf(a.nextSibling);
	}
	function Ig() {
		yg = xg = null;
		I = !1;
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
				var e = d, f = "" + a;
				if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
				b = function(a) {
					var b = e.refs;
					null === a ? delete b[f] : b[f] = a;
				};
				b._stringRef = f;
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
		function b(b, c) {
			if (a) {
				var d = b.deletions;
				null === d ? (b.deletions = [c], b.flags |= 16) : d.push(c);
			}
		}
		function c(c, d) {
			if (!a) return null;
			for (; null !== d;) b(c, d), d = d.sibling;
			return null;
		}
		function d(a, b) {
			for (a = /* @__PURE__ */ new Map(); null !== b;) null !== b.key ? a.set(b.key, b) : a.set(b.index, b), b = b.sibling;
			return a;
		}
		function e(a, b) {
			a = Pg(a, b);
			a.index = 0;
			a.sibling = null;
			return a;
		}
		function f(b, c, d) {
			b.index = d;
			if (!a) return b.flags |= 1048576, c;
			d = b.alternate;
			if (null !== d) return d = d.index, d < c ? (b.flags |= 2, c) : d;
			b.flags |= 2;
			return c;
		}
		function g(b) {
			a && null === b.alternate && (b.flags |= 2);
			return b;
		}
		function h(a, b, c, d) {
			if (null === b || 6 !== b.tag) return b = Qg(c, a.mode, d), b.return = a, b;
			b = e(b, c);
			b.return = a;
			return b;
		}
		function k(a, b, c, d) {
			var f = c.type;
			if (f === ya) return m(a, b, c.props.children, d, c.key);
			if (null !== b && (b.elementType === f || "object" === typeof f && null !== f && f.$$typeof === Ha && Ng(f) === b.type)) return d = e(b, c.props), d.ref = Lg(a, b, c), d.return = a, d;
			d = Rg(c.type, c.key, c.props, null, a.mode, d);
			d.ref = Lg(a, b, c);
			d.return = a;
			return d;
		}
		function l(a, b, c, d) {
			if (null === b || 4 !== b.tag || b.stateNode.containerInfo !== c.containerInfo || b.stateNode.implementation !== c.implementation) return b = Sg(c, a.mode, d), b.return = a, b;
			b = e(b, c.children || []);
			b.return = a;
			return b;
		}
		function m(a, b, c, d, f) {
			if (null === b || 7 !== b.tag) return b = Tg(c, a.mode, d, f), b.return = a, b;
			b = e(b, c);
			b.return = a;
			return b;
		}
		function q(a, b, c) {
			if ("string" === typeof b && "" !== b || "number" === typeof b) return b = Qg("" + b, a.mode, c), b.return = a, b;
			if ("object" === typeof b && null !== b) {
				switch (b.$$typeof) {
					case va: return c = Rg(b.type, b.key, b.props, null, a.mode, c), c.ref = Lg(a, null, b), c.return = a, c;
					case wa: return b = Sg(b, a.mode, c), b.return = a, b;
					case Ha:
						var d = b._init;
						return q(a, d(b._payload), c);
				}
				if (eb(b) || Ka(b)) return b = Tg(b, a.mode, c, null), b.return = a, b;
				Mg(a, b);
			}
			return null;
		}
		function r(a, b, c, d) {
			var e = null !== b ? b.key : null;
			if ("string" === typeof c && "" !== c || "number" === typeof c) return null !== e ? null : h(a, b, "" + c, d);
			if ("object" === typeof c && null !== c) {
				switch (c.$$typeof) {
					case va: return c.key === e ? k(a, b, c, d) : null;
					case wa: return c.key === e ? l(a, b, c, d) : null;
					case Ha: return e = c._init, r(a, b, e(c._payload), d);
				}
				if (eb(c) || Ka(c)) return null !== e ? null : m(a, b, c, d, null);
				Mg(a, c);
			}
			return null;
		}
		function y(a, b, c, d, e) {
			if ("string" === typeof d && "" !== d || "number" === typeof d) return a = a.get(c) || null, h(b, a, "" + d, e);
			if ("object" === typeof d && null !== d) {
				switch (d.$$typeof) {
					case va: return a = a.get(null === d.key ? c : d.key) || null, k(b, a, d, e);
					case wa: return a = a.get(null === d.key ? c : d.key) || null, l(b, a, d, e);
					case Ha:
						var f = d._init;
						return y(a, b, c, f(d._payload), e);
				}
				if (eb(d) || Ka(d)) return a = a.get(c) || null, m(b, a, d, e, null);
				Mg(b, d);
			}
			return null;
		}
		function n(e, g, h, k) {
			for (var l = null, m = null, u = g, w = g = 0, x = null; null !== u && w < h.length; w++) {
				u.index > w ? (x = u, u = null) : x = u.sibling;
				var n = r(e, u, h[w], k);
				if (null === n) {
					null === u && (u = x);
					break;
				}
				a && u && null === n.alternate && b(e, u);
				g = f(n, g, w);
				null === m ? l = n : m.sibling = n;
				m = n;
				u = x;
			}
			if (w === h.length) return c(e, u), I && tg(e, w), l;
			if (null === u) {
				for (; w < h.length; w++) u = q(e, h[w], k), null !== u && (g = f(u, g, w), null === m ? l = u : m.sibling = u, m = u);
				I && tg(e, w);
				return l;
			}
			for (u = d(e, u); w < h.length; w++) x = y(u, e, w, h[w], k), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g = f(x, g, w), null === m ? l = x : m.sibling = x, m = x);
			a && u.forEach(function(a) {
				return b(e, a);
			});
			I && tg(e, w);
			return l;
		}
		function t(e, g, h, k) {
			var l = Ka(h);
			if ("function" !== typeof l) throw Error(p(150));
			h = l.call(h);
			if (null == h) throw Error(p(151));
			for (var u = l = null, m = g, w = g = 0, x = null, n = h.next(); null !== m && !n.done; w++, n = h.next()) {
				m.index > w ? (x = m, m = null) : x = m.sibling;
				var t = r(e, m, n.value, k);
				if (null === t) {
					null === m && (m = x);
					break;
				}
				a && m && null === t.alternate && b(e, m);
				g = f(t, g, w);
				null === u ? l = t : u.sibling = t;
				u = t;
				m = x;
			}
			if (n.done) return c(e, m), I && tg(e, w), l;
			if (null === m) {
				for (; !n.done; w++, n = h.next()) n = q(e, n.value, k), null !== n && (g = f(n, g, w), null === u ? l = n : u.sibling = n, u = n);
				I && tg(e, w);
				return l;
			}
			for (m = d(e, m); !n.done; w++, n = h.next()) n = y(m, e, w, n.value, k), null !== n && (a && null !== n.alternate && m.delete(null === n.key ? w : n.key), g = f(n, g, w), null === u ? l = n : u.sibling = n, u = n);
			a && m.forEach(function(a) {
				return b(e, a);
			});
			I && tg(e, w);
			return l;
		}
		function J(a, d, f, h) {
			"object" === typeof f && null !== f && f.type === ya && null === f.key && (f = f.props.children);
			if ("object" === typeof f && null !== f) {
				switch (f.$$typeof) {
					case va:
						a: {
							for (var k = f.key, l = d; null !== l;) {
								if (l.key === k) {
									k = f.type;
									if (k === ya) {
										if (7 === l.tag) {
											c(a, l.sibling);
											d = e(l, f.props.children);
											d.return = a;
											a = d;
											break a;
										}
									} else if (l.elementType === k || "object" === typeof k && null !== k && k.$$typeof === Ha && Ng(k) === l.type) {
										c(a, l.sibling);
										d = e(l, f.props);
										d.ref = Lg(a, l, f);
										d.return = a;
										a = d;
										break a;
									}
									c(a, l);
									break;
								} else b(a, l);
								l = l.sibling;
							}
							f.type === ya ? (d = Tg(f.props.children, a.mode, h, f.key), d.return = a, a = d) : (h = Rg(f.type, f.key, f.props, null, a.mode, h), h.ref = Lg(a, d, f), h.return = a, a = h);
						}
						return g(a);
					case wa:
						a: {
							for (l = f.key; null !== d;) {
								if (d.key === l) if (4 === d.tag && d.stateNode.containerInfo === f.containerInfo && d.stateNode.implementation === f.implementation) {
									c(a, d.sibling);
									d = e(d, f.children || []);
									d.return = a;
									a = d;
									break a;
								} else {
									c(a, d);
									break;
								}
								else b(a, d);
								d = d.sibling;
							}
							d = Sg(f, a.mode, h);
							d.return = a;
							a = d;
						}
						return g(a);
					case Ha: return l = f._init, J(a, d, l(f._payload), h);
				}
				if (eb(f)) return n(a, d, f, h);
				if (Ka(f)) return t(a, d, f, h);
				Mg(a, f);
			}
			return "string" === typeof f && "" !== f || "number" === typeof f ? (f = "" + f, null !== d && 6 === d.tag ? (c(a, d.sibling), d = e(d, f), d.return = a, a = d) : (c(a, d), d = Qg(f, a.mode, h), d.return = a, a = d), g(a)) : c(a, d);
		}
		return J;
	}
	var Ug = Og(!0), Vg = Og(!1), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
	function $g() {
		Zg = Yg = Xg = null;
	}
	function ah(a) {
		var b = Wg.current;
		E(Wg);
		a._currentValue = b;
	}
	function bh(a, b, c) {
		for (; null !== a;) {
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
		null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = !0), a.firstContext = null);
	}
	function eh(a) {
		var b = a._currentValue;
		if (Zg !== a) if (a = {
			context: a,
			memoizedValue: b,
			next: null
		}, null === Yg) {
			if (null === Xg) throw Error(p(308));
			Yg = a;
			Xg.dependencies = {
				lanes: 0,
				firstContext: a
			};
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
		for (a = a.return; null !== a;) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
		return 3 === c.tag ? c.stateNode : null;
	}
	var jh = !1;
	function kh(a) {
		a.updateQueue = {
			baseState: a.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				interleaved: null,
				lanes: 0
			},
			effects: null
		};
	}
	function lh(a, b) {
		a = a.updateQueue;
		b.updateQueue === a && (b.updateQueue = {
			baseState: a.baseState,
			firstBaseUpdate: a.firstBaseUpdate,
			lastBaseUpdate: a.lastBaseUpdate,
			shared: a.shared,
			effects: a.effects
		});
	}
	function mh(a, b) {
		return {
			eventTime: a,
			lane: b,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
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
			var e = null, f = null;
			c = c.firstBaseUpdate;
			if (null !== c) {
				do {
					var g = {
						eventTime: c.eventTime,
						lane: c.lane,
						tag: c.tag,
						payload: c.payload,
						callback: c.callback,
						next: null
					};
					null === f ? e = f = g : f = f.next = g;
					c = c.next;
				} while (null !== c);
				null === f ? e = f = b : f = f.next = b;
			} else e = f = b;
			c = {
				baseState: d.baseState,
				firstBaseUpdate: e,
				lastBaseUpdate: f,
				shared: d.shared,
				effects: d.effects
			};
			a.updateQueue = c;
			return;
		}
		a = c.lastBaseUpdate;
		null === a ? c.firstBaseUpdate = b : a.next = b;
		c.lastBaseUpdate = b;
	}
	function qh(a, b, c, d) {
		var e = a.updateQueue;
		jh = !1;
		var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
		if (null !== h) {
			e.shared.pending = null;
			var k = h, l = k.next;
			k.next = null;
			null === g ? f = l : g.next = l;
			g = k;
			var m = a.alternate;
			null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
		}
		if (null !== f) {
			var q = e.baseState;
			g = 0;
			m = l = k = null;
			h = f;
			do {
				var r = h.lane, y = h.eventTime;
				if ((d & r) === r) {
					null !== m && (m = m.next = {
						eventTime: y,
						lane: 0,
						tag: h.tag,
						payload: h.payload,
						callback: h.callback,
						next: null
					});
					a: {
						var n = a, t = h;
						r = b;
						y = c;
						switch (t.tag) {
							case 1:
								n = t.payload;
								if ("function" === typeof n) {
									q = n.call(y, q, r);
									break a;
								}
								q = n;
								break a;
							case 3: n.flags = n.flags & -65537 | 128;
							case 0:
								n = t.payload;
								r = "function" === typeof n ? n.call(y, q, r) : n;
								if (null === r || void 0 === r) break a;
								q = A({}, q, r);
								break a;
							case 2: jh = !0;
						}
					}
					null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
				} else y = {
					eventTime: y,
					lane: r,
					tag: h.tag,
					payload: h.payload,
					callback: h.callback,
					next: null
				}, null === m ? (l = m = y, k = q) : m = m.next = y, g |= r;
				h = h.next;
				if (null === h) if (h = e.shared.pending, null === h) break;
				else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
			} while (1);
			null === m && (k = q);
			e.baseState = k;
			e.firstBaseUpdate = l;
			e.lastBaseUpdate = m;
			b = e.shared.interleaved;
			if (null !== b) {
				e = b;
				do
					g |= e.lane, e = e.next;
				while (e !== b);
			} else null === f && (e.shared.lanes = 0);
			rh |= g;
			a.lanes = g;
			a.memoizedState = q;
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
			default: a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
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
		for (var b = a; null !== b;) {
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
			for (; null === b.sibling;) {
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
	var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = !1, Jh = !1, Kh = 0, Lh = 0;
	function P() {
		throw Error(p(321));
	}
	function Mh(a, b) {
		if (null === b) return !1;
		for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return !1;
		return !0;
	}
	function Nh(a, b, c, d, e, f) {
		Hh = f;
		M = b;
		b.memoizedState = null;
		b.updateQueue = null;
		b.lanes = 0;
		Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
		a = c(d, e);
		if (Jh) {
			f = 0;
			do {
				Jh = !1;
				Kh = 0;
				if (25 <= f) throw Error(p(301));
				f += 1;
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
		Ih = !1;
		if (b) throw Error(p(300));
		return a;
	}
	function Sh() {
		var a = 0 !== Kh;
		Kh = 0;
		return a;
	}
	function Th() {
		var a = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
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
			a = {
				memoizedState: N.memoizedState,
				baseState: N.baseState,
				baseQueue: N.baseQueue,
				queue: N.queue,
				next: null
			};
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
		var d = N, e = d.baseQueue, f = c.pending;
		if (null !== f) {
			if (null !== e) {
				var g = e.next;
				e.next = f.next;
				f.next = g;
			}
			d.baseQueue = e = f;
			c.pending = null;
		}
		if (null !== e) {
			f = e.next;
			d = d.baseState;
			var h = g = null, k = null, l = f;
			do {
				var m = l.lane;
				if ((Hh & m) === m) null !== k && (k = k.next = {
					lane: 0,
					action: l.action,
					hasEagerState: l.hasEagerState,
					eagerState: l.eagerState,
					next: null
				}), d = l.hasEagerState ? l.eagerState : a(d, l.action);
				else {
					var q = {
						lane: m,
						action: l.action,
						hasEagerState: l.hasEagerState,
						eagerState: l.eagerState,
						next: null
					};
					null === k ? (h = k = q, g = d) : k = k.next = q;
					M.lanes |= m;
					rh |= m;
				}
				l = l.next;
			} while (null !== l && l !== f);
			null === k ? g = d : k.next = h;
			He(d, b.memoizedState) || (dh = !0);
			b.memoizedState = d;
			b.baseState = g;
			b.baseQueue = k;
			c.lastRenderedState = d;
		}
		a = c.interleaved;
		if (null !== a) {
			e = a;
			do
				f = e.lane, M.lanes |= f, rh |= f, e = e.next;
			while (e !== a);
		} else null === e && (c.lanes = 0);
		return [b.memoizedState, c.dispatch];
	}
	function Xh(a) {
		var b = Uh(), c = b.queue;
		if (null === c) throw Error(p(311));
		c.lastRenderedReducer = a;
		var d = c.dispatch, e = c.pending, f = b.memoizedState;
		if (null !== e) {
			c.pending = null;
			var g = e = e.next;
			do
				f = a(f, g.action), g = g.next;
			while (g !== e);
			He(f, b.memoizedState) || (dh = !0);
			b.memoizedState = f;
			null === b.baseQueue && (b.baseState = f);
			c.lastRenderedState = f;
		}
		return [f, d];
	}
	function Yh() {}
	function Zh(a, b) {
		var c = M, d = Uh(), e = b(), f = !He(d.memoizedState, e);
		f && (d.memoizedState = e, dh = !0);
		d = d.queue;
		$h(ai.bind(null, c, d, a), [a]);
		if (d.getSnapshot !== b || f || null !== O && O.memoizedState.tag & 1) {
			c.flags |= 2048;
			bi(9, ci.bind(null, c, d, e, b), void 0, null);
			if (null === Q) throw Error(p(349));
			0 !== (Hh & 30) || di(c, b, e);
		}
		return e;
	}
	function di(a, b, c) {
		a.flags |= 16384;
		a = {
			getSnapshot: b,
			value: c
		};
		b = M.updateQueue;
		null === b ? (b = {
			lastEffect: null,
			stores: null
		}, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
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
			return !0;
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
		a = {
			pending: null,
			interleaved: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Vh,
			lastRenderedState: a
		};
		b.queue = a;
		a = a.dispatch = ii.bind(null, M, a);
		return [b.memoizedState, a];
	}
	function bi(a, b, c, d) {
		a = {
			tag: a,
			create: b,
			destroy: c,
			deps: d,
			next: null
		};
		b = M.updateQueue;
		null === b ? (b = {
			lastEffect: null,
			stores: null
		}, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
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
		var f = void 0;
		if (null !== N) {
			var g = N.memoizedState;
			f = g.destroy;
			if (null !== d && Mh(d, g.deps)) {
				e.memoizedState = bi(b, c, f, d);
				return;
			}
		}
		M.flags |= a;
		e.memoizedState = bi(1 | b, c, f, d);
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
	function ri() {}
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
		if (0 === (Hh & 21)) return a.baseState && (a.baseState = !1, dh = !0), a.memoizedState = c;
		He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = !0);
		return b;
	}
	function vi(a, b) {
		var c = C;
		C = 0 !== c && 4 > c ? c : 4;
		a(!0);
		var d = Gh.transition;
		Gh.transition = {};
		try {
			a(!1), b();
		} finally {
			C = c, Gh.transition = d;
		}
	}
	function wi() {
		return Uh().memoizedState;
	}
	function xi(a, b, c) {
		var d = yi(a);
		c = {
			lane: d,
			action: c,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (zi(a)) Ai(b, c);
		else if (c = hh(a, b, c, d), null !== c) {
			var e = R();
			gi(c, a, d, e);
			Bi(c, b, d);
		}
	}
	function ii(a, b, c) {
		var d = yi(a), e = {
			lane: d,
			action: c,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (zi(a)) Ai(b, e);
		else {
			var f = a.alternate;
			if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
				var g = b.lastRenderedState, h = f(g, c);
				e.hasEagerState = !0;
				e.eagerState = h;
				if (He(h, g)) {
					var k = b.interleaved;
					null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
					b.interleaved = e;
					return;
				}
			} catch (l) {}
			c = hh(a, b, e, d);
			null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
		}
	}
	function zi(a) {
		var b = a.alternate;
		return a === M || null !== b && b === M;
	}
	function Ai(a, b) {
		Jh = Ih = !0;
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
	var Rh = {
		readContext: eh,
		useCallback: P,
		useContext: P,
		useEffect: P,
		useImperativeHandle: P,
		useInsertionEffect: P,
		useLayoutEffect: P,
		useMemo: P,
		useReducer: P,
		useRef: P,
		useState: P,
		useDebugValue: P,
		useDeferredValue: P,
		useTransition: P,
		useMutableSource: P,
		useSyncExternalStore: P,
		useId: P,
		unstable_isNewReconciler: !1
	}, Oh = {
		readContext: eh,
		useCallback: function(a, b) {
			Th().memoizedState = [a, void 0 === b ? null : b];
			return a;
		},
		useContext: eh,
		useEffect: mi,
		useImperativeHandle: function(a, b, c) {
			c = null !== c && void 0 !== c ? c.concat([a]) : null;
			return ki(4194308, 4, pi.bind(null, b, a), c);
		},
		useLayoutEffect: function(a, b) {
			return ki(4194308, 4, a, b);
		},
		useInsertionEffect: function(a, b) {
			return ki(4, 2, a, b);
		},
		useMemo: function(a, b) {
			var c = Th();
			b = void 0 === b ? null : b;
			a = a();
			c.memoizedState = [a, b];
			return a;
		},
		useReducer: function(a, b, c) {
			var d = Th();
			b = void 0 !== c ? c(b) : b;
			d.memoizedState = d.baseState = b;
			a = {
				pending: null,
				interleaved: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: a,
				lastRenderedState: b
			};
			d.queue = a;
			a = a.dispatch = xi.bind(null, M, a);
			return [d.memoizedState, a];
		},
		useRef: function(a) {
			var b = Th();
			a = { current: a };
			return b.memoizedState = a;
		},
		useState: hi,
		useDebugValue: ri,
		useDeferredValue: function(a) {
			return Th().memoizedState = a;
		},
		useTransition: function() {
			var a = hi(!1), b = a[0];
			a = vi.bind(null, a[1]);
			Th().memoizedState = a;
			return [b, a];
		},
		useMutableSource: function() {},
		useSyncExternalStore: function(a, b, c) {
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
			var f = {
				value: c,
				getSnapshot: b
			};
			e.queue = f;
			mi(ai.bind(null, d, f, a), [a]);
			d.flags |= 2048;
			bi(9, ci.bind(null, d, f, c, b), void 0, null);
			return c;
		},
		useId: function() {
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
		},
		unstable_isNewReconciler: !1
	}, Ph = {
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
			return ui(Uh(), N.memoizedState, a);
		},
		useTransition: function() {
			return [Wh(Vh)[0], Uh().memoizedState];
		},
		useMutableSource: Yh,
		useSyncExternalStore: Zh,
		useId: wi,
		unstable_isNewReconciler: !1
	}, Qh = {
		readContext: eh,
		useCallback: si,
		useContext: eh,
		useEffect: $h,
		useImperativeHandle: qi,
		useInsertionEffect: ni,
		useLayoutEffect: oi,
		useMemo: ti,
		useReducer: Xh,
		useRef: ji,
		useState: function() {
			return Xh(Vh);
		},
		useDebugValue: ri,
		useDeferredValue: function(a) {
			var b = Uh();
			return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
		},
		useTransition: function() {
			return [Xh(Vh)[0], Uh().memoizedState];
		},
		useMutableSource: Yh,
		useSyncExternalStore: Zh,
		useId: wi,
		unstable_isNewReconciler: !1
	};
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
	var Ei = {
		isMounted: function(a) {
			return (a = a._reactInternals) ? Vb(a) === a : !1;
		},
		enqueueSetState: function(a, b, c) {
			a = a._reactInternals;
			var d = R(), e = yi(a), f = mh(d, e);
			f.payload = b;
			void 0 !== c && null !== c && (f.callback = c);
			b = nh(a, f, e);
			null !== b && (gi(b, a, e, d), oh(b, a, e));
		},
		enqueueReplaceState: function(a, b, c) {
			a = a._reactInternals;
			var d = R(), e = yi(a), f = mh(d, e);
			f.tag = 1;
			f.payload = b;
			void 0 !== c && null !== c && (f.callback = c);
			b = nh(a, f, e);
			null !== b && (gi(b, a, e, d), oh(b, a, e));
		},
		enqueueForceUpdate: function(a, b) {
			a = a._reactInternals;
			var c = R(), d = yi(a), e = mh(c, d);
			e.tag = 2;
			void 0 !== b && null !== b && (e.callback = b);
			b = nh(a, e, d);
			null !== b && (gi(b, a, d, c), oh(b, a, d));
		}
	};
	function Fi(a, b, c, d, e, f, g) {
		a = a.stateNode;
		return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f) : !0;
	}
	function Gi(a, b, c) {
		var d = !1, e = Vf;
		var f = b.contextType;
		"object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
		b = new b(c, f);
		a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
		b.updater = Ei;
		a.stateNode = b;
		b._reactInternals = a;
		d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
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
		var f = b.contextType;
		"object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H.current, e.context = Yf(a, f));
		e.state = a.memoizedState;
		f = b.getDerivedStateFromProps;
		"function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
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
		} catch (f) {
			e = "\nError generating stack: " + f.message + "\n" + f.stack;
		}
		return {
			value: a,
			source: b,
			stack: e,
			digest: null
		};
	}
	function Ki(a, b, c) {
		return {
			value: a,
			source: null,
			stack: null != c ? c : null,
			digest: null != b ? b : null
		};
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
			Oi || (Oi = !0, Pi = d);
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
		var f = a.stateNode;
		null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
			Li(a, b);
			"function" !== typeof d && (null === Ri ? Ri = new Set([this]) : Ri.add(this));
			var c = b.stack;
			this.componentDidCatch(b.value, { componentStack: null !== c ? c : "" });
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
			if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? !0 : !1 : !0;
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
	var Wi = ua.ReactCurrentOwner, dh = !1;
	function Xi(a, b, c, d) {
		b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
	}
	function Yi(a, b, c, d, e) {
		c = c.render;
		var f = b.ref;
		ch(b, e);
		d = Nh(a, b, c, d, f, e);
		c = Sh();
		if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
		I && c && vg(b);
		b.flags |= 1;
		Xi(a, b, d, e);
		return b.child;
	}
	function $i(a, b, c, d, e) {
		if (null === a) {
			var f = c.type;
			if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
			a = Rg(c.type, null, d, b, b.mode, e);
			a.ref = b.ref;
			a.return = b;
			return b.child = a;
		}
		f = a.child;
		if (0 === (a.lanes & e)) {
			var g = f.memoizedProps;
			c = c.compare;
			c = null !== c ? c : Ie;
			if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
		}
		b.flags |= 1;
		a = Pg(f, d);
		a.ref = b.ref;
		a.return = b;
		return b.child = a;
	}
	function bj(a, b, c, d, e) {
		if (null !== a) {
			var f = a.memoizedProps;
			if (Ie(f, d) && a.ref === b.ref) if (dh = !1, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = !0);
			else return b.lanes = a.lanes, Zi(a, b, e);
		}
		return cj(a, b, c, d, e);
	}
	function dj(a, b, c) {
		var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
		if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = {
			baseLanes: 0,
			cachePool: null,
			transitions: null
		}, G(ej, fj), fj |= c;
		else {
			if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = {
				baseLanes: a,
				cachePool: null,
				transitions: null
			}, b.updateQueue = null, G(ej, fj), fj |= a, null;
			b.memoizedState = {
				baseLanes: 0,
				cachePool: null,
				transitions: null
			};
			d = null !== f ? f.baseLanes : c;
			G(ej, fj);
			fj |= d;
		}
		else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
		Xi(a, b, e, c);
		return b.child;
	}
	function gj(a, b) {
		var c = b.ref;
		if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
	}
	function cj(a, b, c, d, e) {
		var f = Zf(c) ? Xf : H.current;
		f = Yf(b, f);
		ch(b, e);
		c = Nh(a, b, c, d, f, e);
		d = Sh();
		if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
		I && d && vg(b);
		b.flags |= 1;
		Xi(a, b, c, e);
		return b.child;
	}
	function hj(a, b, c, d, e) {
		if (Zf(c)) {
			var f = !0;
			cg(b);
		} else f = !1;
		ch(b, e);
		if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = !0;
		else if (null === a) {
			var g = b.stateNode, h = b.memoizedProps;
			g.props = h;
			var k = g.context, l = c.contextType;
			"object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H.current, l = Yf(b, l));
			var m = c.getDerivedStateFromProps, q = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
			q || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
			jh = !1;
			var r = b.memoizedState;
			g.state = r;
			qh(b, d, g, e);
			k = b.memoizedState;
			h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = !1);
		} else {
			g = b.stateNode;
			lh(a, b);
			h = b.memoizedProps;
			l = b.type === b.elementType ? h : Ci(b.type, h);
			g.props = l;
			q = b.pendingProps;
			r = g.context;
			k = c.contextType;
			"object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H.current, k = Yf(b, k));
			var y = c.getDerivedStateFromProps;
			(m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q || r !== k) && Hi(b, g, d, k);
			jh = !1;
			r = b.memoizedState;
			g.state = r;
			qh(b, d, g, e);
			var n = b.memoizedState;
			h !== q || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || !1) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = !1);
		}
		return jj(a, b, c, d, f, e);
	}
	function jj(a, b, c, d, e, f) {
		gj(a, b);
		var g = 0 !== (b.flags & 128);
		if (!d && !g) return e && dg(b, c, !1), Zi(a, b, f);
		d = b.stateNode;
		Wi.current = b;
		var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
		b.flags |= 1;
		null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
		b.memoizedState = d.state;
		e && dg(b, c, !0);
		return b.child;
	}
	function kj(a) {
		var b = a.stateNode;
		b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, !1);
		yh(a, b.containerInfo);
	}
	function lj(a, b, c, d, e) {
		Ig();
		Jg(e);
		b.flags |= 256;
		Xi(a, b, c, d);
		return b.child;
	}
	var mj = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0
	};
	function nj(a) {
		return {
			baseLanes: a,
			cachePool: null,
			transitions: null
		};
	}
	function oj(a, b, c) {
		var d = b.pendingProps, e = L.current, f = !1, g = 0 !== (b.flags & 128), h;
		(h = g) || (h = null !== a && null === a.memoizedState ? !1 : 0 !== (e & 2));
		if (h) f = !0, b.flags &= -129;
		else if (null === a || null !== a.memoizedState) e |= 1;
		G(L, e & 1);
		if (null === a) {
			Eg(b);
			a = b.memoizedState;
			if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
			g = d.children;
			a = d.fallback;
			return f ? (d = b.mode, f = b.child, g = {
				mode: "hidden",
				children: g
			}, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
		}
		e = a.memoizedState;
		if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
		if (f) {
			f = d.fallback;
			g = b.mode;
			e = a.child;
			h = e.sibling;
			var k = {
				mode: "hidden",
				children: d.children
			};
			0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
			null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
			f.return = b;
			d.return = b;
			d.sibling = f;
			b.child = d;
			d = f;
			f = b.child;
			g = a.child.memoizedState;
			g = null === g ? nj(c) : {
				baseLanes: g.baseLanes | c,
				cachePool: null,
				transitions: g.transitions
			};
			f.memoizedState = g;
			f.childLanes = a.childLanes & ~c;
			b.memoizedState = mj;
			return d;
		}
		f = a.child;
		a = f.sibling;
		d = Pg(f, {
			mode: "visible",
			children: d.children
		});
		0 === (b.mode & 1) && (d.lanes = c);
		d.return = b;
		d.sibling = null;
		null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
		b.child = d;
		b.memoizedState = null;
		return d;
	}
	function qj(a, b) {
		b = pj({
			mode: "visible",
			children: b
		}, a.mode, 0, null);
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
	function rj(a, b, c, d, e, f, g) {
		if (c) {
			if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
			if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
			f = d.fallback;
			e = b.mode;
			d = pj({
				mode: "visible",
				children: d.children
			}, e, 0, null);
			f = Tg(f, e, g, null);
			f.flags |= 2;
			d.return = b;
			f.return = b;
			d.sibling = f;
			b.child = d;
			0 !== (b.mode & 1) && Ug(b, a.child, null, g);
			b.child.memoizedState = nj(g);
			b.memoizedState = mj;
			return f;
		}
		if (0 === (b.mode & 1)) return sj(a, b, g, null);
		if ("$!" === e.data) {
			d = e.nextSibling && e.nextSibling.dataset;
			if (d) var h = d.dgst;
			d = h;
			f = Error(p(419));
			d = Ki(f, d, void 0);
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
					default: e = 0;
				}
				e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
				0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
			}
			tj();
			d = Ki(Error(p(421)));
			return sj(a, b, g, d);
		}
		if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
		a = f.treeContext;
		yg = Lf(e.nextSibling);
		xg = b;
		I = !0;
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
		var f = a.memoizedState;
		null === f ? a.memoizedState = {
			isBackwards: b,
			rendering: null,
			renderingStartTime: 0,
			last: d,
			tail: c,
			tailMode: e
		} : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
	}
	function xj(a, b, c) {
		var d = b.pendingProps, e = d.revealOrder, f = d.tail;
		Xi(a, b, d.children, c);
		d = L.current;
		if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
		else {
			if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a;) {
				if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
				else if (19 === a.tag) vj(a, c, b);
				else if (null !== a.child) {
					a.child.return = a;
					a = a.child;
					continue;
				}
				if (a === b) break a;
				for (; null === a.sibling;) {
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
				for (e = null; null !== c;) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
				c = e;
				null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
				wj(b, !1, e, c, f);
				break;
			case "backwards":
				c = null;
				e = b.child;
				for (b.child = null; null !== e;) {
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
				wj(b, !0, c, null, f);
				break;
			case "together":
				wj(b, !1, null, null, void 0);
				break;
			default: b.memoizedState = null;
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
			for (c.return = b; null !== a.sibling;) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
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
			case 23: return b.lanes = 0, dj(a, b, c);
		}
		return Zi(a, b, c);
	}
	var zj = function(a, b) {
		for (var c = b.child; null !== c;) {
			if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
			else if (4 !== c.tag && null !== c.child) {
				c.child.return = c;
				c = c.child;
				continue;
			}
			if (c === b) break;
			for (; null === c.sibling;) {
				if (null === c.return || c.return === b) return;
				c = c.return;
			}
			c.sibling.return = c.return;
			c = c.sibling;
		}
	}, Aj = function() {}, Bj = function(a, b, c, d) {
		var e = a.memoizedProps;
		if (e !== d) {
			a = b.stateNode;
			xh(uh.current);
			var f = null;
			switch (c) {
				case "input":
					e = Ya(a, e);
					d = Ya(a, d);
					f = [];
					break;
				case "select":
					e = A({}, e, { value: void 0 });
					d = A({}, d, { value: void 0 });
					f = [];
					break;
				case "textarea":
					e = gb(a, e);
					d = gb(a, d);
					f = [];
					break;
				default: "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
			}
			ub(c, d);
			var g;
			c = null;
			for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
				var h = e[l];
				for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
			} else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
			for (l in d) {
				var k = d[l];
				h = null != e ? e[l] : void 0;
				if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
					for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
					for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
				} else c || (f || (f = []), f.push(l, c)), c = k;
				else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
			}
			c && (f = f || []).push("style", c);
			var l = f;
			if (b.updateQueue = l) b.flags |= 4;
		}
	}, Cj = function(a, b, c, d) {
		c !== d && (b.flags |= 4);
	};
	function Dj(a, b) {
		if (!I) switch (a.tailMode) {
			case "hidden":
				b = a.tail;
				for (var c = null; null !== b;) null !== b.alternate && (c = b), b = b.sibling;
				null === c ? a.tail = null : c.sibling = null;
				break;
			case "collapsed":
				c = a.tail;
				for (var d = null; null !== c;) null !== c.alternate && (d = c), c = c.sibling;
				null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
		}
	}
	function S(a) {
		var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
		if (b) for (var e = a.child; null !== e;) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
		else for (e = a.child; null !== e;) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
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
			case 14: return S(b), null;
			case 1: return Zf(b.type) && $f(), S(b), null;
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
						var f = b.memoizedProps;
						d[Of] = b;
						d[Pf] = f;
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
								D("error", d);
								D("load", d);
								break;
							case "details":
								D("toggle", d);
								break;
							case "input":
								Za(d, f);
								D("invalid", d);
								break;
							case "select":
								d._wrapperState = { wasMultiple: !!f.multiple };
								D("invalid", d);
								break;
							case "textarea": hb(d, f), D("invalid", d);
						}
						ub(c, f);
						e = null;
						for (var g in f) if (f.hasOwnProperty(g)) {
							var h = f[g];
							"children" === g ? "string" === typeof h ? d.textContent !== h && (!0 !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (!0 !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
						}
						switch (c) {
							case "input":
								Va(d);
								db(d, f, !0);
								break;
							case "textarea":
								Va(d);
								jb(d);
								break;
							case "select":
							case "option": break;
							default: "function" === typeof f.onClick && (d.onclick = Bf);
						}
						d = e;
						b.updateQueue = d;
						null !== d && (b.flags |= 4);
					} else {
						g = 9 === e.nodeType ? e : e.ownerDocument;
						"http://www.w3.org/1999/xhtml" === a && (a = kb(c));
						"http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = !0 : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
						a[Of] = b;
						a[Pf] = d;
						zj(a, b, !1, !1);
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
									D("error", a);
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
								default: e = d;
							}
							ub(c, e);
							h = e;
							for (f in h) if (h.hasOwnProperty(f)) {
								var k = h[f];
								"style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D("scroll", a) : null != k && ta(a, f, k, g));
							}
							switch (c) {
								case "input":
									Va(a);
									db(a, d, !1);
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
									f = d.value;
									null != f ? fb(a, !!d.multiple, f, !1) : null != d.defaultValue && fb(a, !!d.multiple, d.defaultValue, !0);
									break;
								default: "function" === typeof e.onClick && (a.onclick = Bf);
							}
							switch (c) {
								case "button":
								case "input":
								case "select":
								case "textarea":
									d = !!d.autoFocus;
									break a;
								case "img":
									d = !0;
									break a;
								default: d = !1;
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
						if (f = d.nodeValue !== c) {
							if (a = xg, null !== a) switch (a.tag) {
								case 3:
									Af(d.nodeValue, c, 0 !== (a.mode & 1));
									break;
								case 5: !0 !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
							}
						}
						f && (b.flags |= 4);
					} else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
				}
				S(b);
				return null;
			case 13:
				E(L);
				d = b.memoizedState;
				if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
					if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = !1;
					else if (f = Gg(b), null !== d && null !== d.dehydrated) {
						if (null === a) {
							if (!f) throw Error(p(318));
							f = b.memoizedState;
							f = null !== f ? f.dehydrated : null;
							if (!f) throw Error(p(317));
							f[Of] = b;
						} else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
						S(b);
						f = !1;
					} else null !== zg && (Fj(zg), zg = null), f = !0;
					if (!f) return b.flags & 65536 ? b : null;
				}
				if (0 !== (b.flags & 128)) return b.lanes = c, b;
				d = null !== d;
				d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
				null !== b.updateQueue && (b.flags |= 4);
				S(b);
				return null;
			case 4: return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
			case 10: return ah(b.type._context), S(b), null;
			case 17: return Zf(b.type) && $f(), S(b), null;
			case 19:
				E(L);
				f = b.memoizedState;
				if (null === f) return S(b), null;
				d = 0 !== (b.flags & 128);
				g = f.rendering;
				if (null === g) if (d) Dj(f, !1);
				else {
					if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a;) {
						g = Ch(a);
						if (null !== g) {
							b.flags |= 128;
							Dj(f, !1);
							d = g.updateQueue;
							null !== d && (b.updateQueue = d, b.flags |= 4);
							b.subtreeFlags = 0;
							d = c;
							for (c = b.child; null !== c;) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : {
								lanes: a.lanes,
								firstContext: a.firstContext
							}), c = c.sibling;
							G(L, L.current & 1 | 2);
							return b.child;
						}
						a = a.sibling;
					}
					null !== f.tail && B() > Gj && (b.flags |= 128, d = !0, Dj(f, !1), b.lanes = 4194304);
				}
				else {
					if (!d) if (a = Ch(g), null !== a) {
						if (b.flags |= 128, d = !0, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, !0), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
					} else 2 * B() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = !0, Dj(f, !1), b.lanes = 4194304);
					f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
				}
				if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
				S(b);
				return null;
			case 22:
			case 23: return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
			case 24: return null;
			case 25: return null;
		}
		throw Error(p(156, b.tag));
	}
	function Ij(a, b) {
		wg(b);
		switch (b.tag) {
			case 1: return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
			case 3: return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
			case 5: return Bh(b), null;
			case 13:
				E(L);
				a = b.memoizedState;
				if (null !== a && null !== a.dehydrated) {
					if (null === b.alternate) throw Error(p(340));
					Ig();
				}
				a = b.flags;
				return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
			case 19: return E(L), null;
			case 4: return zh(), null;
			case 10: return ah(b.type._context), null;
			case 22:
			case 23: return Hj(), null;
			case 24: return null;
			default: return null;
		}
	}
	var Jj = !1, U = !1, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
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
	var Nj = !1;
	function Oj(a, b) {
		Cf = dd;
		a = Me();
		if (Ne(a)) {
			if ("selectionStart" in a) var c = {
				start: a.selectionStart,
				end: a.selectionEnd
			};
			else a: {
				c = (c = a.ownerDocument) && c.defaultView || window;
				var d = c.getSelection && c.getSelection();
				if (d && 0 !== d.rangeCount) {
					c = d.anchorNode;
					var e = d.anchorOffset, f = d.focusNode;
					d = d.focusOffset;
					try {
						c.nodeType, f.nodeType;
					} catch (F) {
						c = null;
						break a;
					}
					var g = 0, h = -1, k = -1, l = 0, m = 0, q = a, r = null;
					b: for (;;) {
						for (var y;;) {
							q !== c || 0 !== e && 3 !== q.nodeType || (h = g + e);
							q !== f || 0 !== d && 3 !== q.nodeType || (k = g + d);
							3 === q.nodeType && (g += q.nodeValue.length);
							if (null === (y = q.firstChild)) break;
							r = q;
							q = y;
						}
						for (;;) {
							if (q === a) break b;
							r === c && ++l === e && (h = g);
							r === f && ++m === d && (k = g);
							if (null !== (y = q.nextSibling)) break;
							q = r;
							r = q.parentNode;
						}
						q = y;
					}
					c = -1 === h || -1 === k ? null : {
						start: h,
						end: k
					};
				} else c = null;
			}
			c = c || {
				start: 0,
				end: 0
			};
		} else c = null;
		Df = {
			focusedElem: a,
			selectionRange: c
		};
		dd = !1;
		for (V = b; null !== V;) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
		else for (; null !== V;) {
			b = V;
			try {
				var n = b.alternate;
				if (0 !== (b.flags & 1024)) switch (b.tag) {
					case 0:
					case 11:
					case 15: break;
					case 1:
						if (null !== n) {
							var t = n.memoizedProps, J = n.memoizedState, x = b.stateNode;
							x.__reactInternalSnapshotBeforeUpdate = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
						}
						break;
					case 3:
						var u = b.stateNode.containerInfo;
						1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
						break;
					case 5:
					case 6:
					case 4:
					case 17: break;
					default: throw Error(p(163));
				}
			} catch (F) {
				W(b, b.return, F);
			}
			a = b.sibling;
			if (null !== a) {
				a.return = b.return;
				V = a;
				break;
			}
			V = b.return;
		}
		n = Nj;
		Nj = !1;
		return n;
	}
	function Pj(a, b, c) {
		var d = b.updateQueue;
		d = null !== d ? d.lastEffect : null;
		if (null !== d) {
			var e = d = d.next;
			do {
				if ((e.tag & a) === a) {
					var f = e.destroy;
					e.destroy = void 0;
					void 0 !== f && Mj(b, c, f);
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
				default: a = c;
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
		a: for (;;) {
			for (; null === a.sibling;) {
				if (null === a.return || Tj(a.return)) return null;
				a = a.return;
			}
			a.sibling.return = a.return;
			for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag;) {
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
		else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a;) Vj(a, b, c), a = a.sibling;
	}
	function Wj(a, b, c) {
		var d = a.tag;
		if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
		else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a;) Wj(a, b, c), a = a.sibling;
	}
	var X = null, Xj = !1;
	function Yj(a, b, c) {
		for (c = c.child; null !== c;) Zj(a, b, c), c = c.sibling;
	}
	function Zj(a, b, c) {
		if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
			lc.onCommitFiberUnmount(kc, c);
		} catch (h) {}
		switch (c.tag) {
			case 5: U || Lj(c, b);
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
				Xj = !0;
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
						var f = e, g = f.destroy;
						f = f.tag;
						void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
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
			default: Yj(a, b, c);
		}
	}
	function ak(a) {
		var b = a.updateQueue;
		if (null !== b) {
			a.updateQueue = null;
			var c = a.stateNode;
			null === c && (c = a.stateNode = new Kj());
			b.forEach(function(b) {
				var d = bk.bind(null, a, b);
				c.has(b) || (c.add(b), b.then(d, d));
			});
		}
	}
	function ck(a, b) {
		var c = b.deletions;
		if (null !== c) for (var d = 0; d < c.length; d++) {
			var e = c[d];
			try {
				var f = a, g = b, h = g;
				a: for (; null !== h;) {
					switch (h.tag) {
						case 5:
							X = h.stateNode;
							Xj = !1;
							break a;
						case 3:
							X = h.stateNode.containerInfo;
							Xj = !0;
							break a;
						case 4:
							X = h.stateNode.containerInfo;
							Xj = !0;
							break a;
					}
					h = h.return;
				}
				if (null === X) throw Error(p(160));
				Zj(f, g, e);
				X = null;
				Xj = !1;
				var k = e.alternate;
				null !== k && (k.return = null);
				e.return = null;
			} catch (l) {
				W(e, b, l);
			}
		}
		if (b.subtreeFlags & 12854) for (b = b.child; null !== b;) dk(b, a), b = b.sibling;
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
					} catch (t) {
						W(a, a.return, t);
					}
					try {
						Pj(5, a, a.return);
					} catch (t) {
						W(a, a.return, t);
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
					} catch (t) {
						W(a, a.return, t);
					}
				}
				if (d & 4 && (e = a.stateNode, null != e)) {
					var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
					a.updateQueue = null;
					if (null !== k) try {
						"input" === h && "radio" === f.type && null != f.name && ab(e, f);
						vb(h, g);
						var l = vb(h, f);
						for (g = 0; g < k.length; g += 2) {
							var m = k[g], q = k[g + 1];
							"style" === m ? sb(e, q) : "dangerouslySetInnerHTML" === m ? nb(e, q) : "children" === m ? ob(e, q) : ta(e, m, q, l);
						}
						switch (h) {
							case "input":
								bb(e, f);
								break;
							case "textarea":
								ib(e, f);
								break;
							case "select":
								var r = e._wrapperState.wasMultiple;
								e._wrapperState.wasMultiple = !!f.multiple;
								var y = f.value;
								null != y ? fb(e, !!f.multiple, y, !1) : r !== !!f.multiple && (null != f.defaultValue ? fb(e, !!f.multiple, f.defaultValue, !0) : fb(e, !!f.multiple, f.multiple ? [] : "", !1));
						}
						e[Pf] = f;
					} catch (t) {
						W(a, a.return, t);
					}
				}
				break;
			case 6:
				ck(b, a);
				ek(a);
				if (d & 4) {
					if (null === a.stateNode) throw Error(p(162));
					e = a.stateNode;
					f = a.memoizedProps;
					try {
						e.nodeValue = f;
					} catch (t) {
						W(a, a.return, t);
					}
				}
				break;
			case 3:
				ck(b, a);
				ek(a);
				if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
					bd(b.containerInfo);
				} catch (t) {
					W(a, a.return, t);
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
				e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
				d & 4 && ak(a);
				break;
			case 22:
				m = null !== c && null !== c.memoizedState;
				a.mode & 1 ? (U = (l = U) || m, ck(b, a), U = l) : ck(b, a);
				ek(a);
				if (d & 8192) {
					l = null !== a.memoizedState;
					if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m;) {
						for (q = V = m; null !== V;) {
							r = V;
							y = r.child;
							switch (r.tag) {
								case 0:
								case 11:
								case 14:
								case 15:
									Pj(4, r, r.return);
									break;
								case 1:
									Lj(r, r.return);
									var n = r.stateNode;
									if ("function" === typeof n.componentWillUnmount) {
										d = r;
										c = r.return;
										try {
											b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
										} catch (t) {
											W(d, c, t);
										}
									}
									break;
								case 5:
									Lj(r, r.return);
									break;
								case 22: if (null !== r.memoizedState) {
									gk(q);
									continue;
								}
							}
							null !== y ? (y.return = r, V = y) : gk(q);
						}
						m = m.sibling;
					}
					a: for (m = null, q = a;;) {
						if (5 === q.tag) {
							if (null === m) {
								m = q;
								try {
									e = q.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
								} catch (t) {
									W(a, a.return, t);
								}
							}
						} else if (6 === q.tag) {
							if (null === m) try {
								q.stateNode.nodeValue = l ? "" : q.memoizedProps;
							} catch (t) {
								W(a, a.return, t);
							}
						} else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a) && null !== q.child) {
							q.child.return = q;
							q = q.child;
							continue;
						}
						if (q === a) break a;
						for (; null === q.sibling;) {
							if (null === q.return || q.return === a) break a;
							m === q && (m = null);
							q = q.return;
						}
						m === q && (m = null);
						q.sibling.return = q.return;
						q = q.sibling;
					}
				}
				break;
			case 19:
				ck(b, a);
				ek(a);
				d & 4 && ak(a);
				break;
			case 21: break;
			default: ck(b, a), ek(a);
		}
	}
	function ek(a) {
		var b = a.flags;
		if (b & 2) {
			try {
				a: {
					for (var c = a.return; null !== c;) {
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
						Wj(a, Uj(a), e);
						break;
					case 3:
					case 4:
						var g = d.stateNode.containerInfo;
						Vj(a, Uj(a), g);
						break;
					default: throw Error(p(161));
				}
			} catch (k) {
				W(a, a.return, k);
			}
			a.flags &= -3;
		}
		b & 4096 && (a.flags &= -4097);
	}
	function hk(a, b, c) {
		V = a;
		ik(a, b, c);
	}
	function ik(a, b, c) {
		for (var d = 0 !== (a.mode & 1); null !== V;) {
			var e = V, f = e.child;
			if (22 === e.tag && d) {
				var g = null !== e.memoizedState || Jj;
				if (!g) {
					var h = e.alternate, k = null !== h && null !== h.memoizedState || U;
					h = Jj;
					var l = U;
					Jj = g;
					if ((U = k) && !l) for (V = e; null !== V;) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
					for (; null !== f;) V = f, ik(f, b, c), f = f.sibling;
					V = e;
					Jj = h;
					U = l;
				}
				kk(a, b, c);
			} else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a, b, c);
		}
	}
	function kk(a) {
		for (; null !== V;) {
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
							var f = b.updateQueue;
							null !== f && sh(b, f, d);
							break;
						case 3:
							var g = b.updateQueue;
							if (null !== g) {
								c = null;
								if (null !== b.child) switch (b.child.tag) {
									case 5:
										c = b.child.stateNode;
										break;
									case 1: c = b.child.stateNode;
								}
								sh(b, g, c);
							}
							break;
						case 5:
							var h = b.stateNode;
							if (null === c && b.flags & 4) {
								c = h;
								var k = b.memoizedProps;
								switch (b.type) {
									case "button":
									case "input":
									case "select":
									case "textarea":
										k.autoFocus && c.focus();
										break;
									case "img": k.src && (c.src = k.src);
								}
							}
							break;
						case 6: break;
						case 4: break;
						case 12: break;
						case 13:
							if (null === b.memoizedState) {
								var l = b.alternate;
								if (null !== l) {
									var m = l.memoizedState;
									if (null !== m) {
										var q = m.dehydrated;
										null !== q && bd(q);
									}
								}
							}
							break;
						case 19:
						case 17:
						case 21:
						case 22:
						case 23:
						case 25: break;
						default: throw Error(p(163));
					}
					U || b.flags & 512 && Rj(b);
				} catch (r) {
					W(b, b.return, r);
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
		for (; null !== V;) {
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
		for (; null !== V;) {
			var b = V;
			try {
				switch (b.tag) {
					case 0:
					case 11:
					case 15:
						var c = b.return;
						try {
							Qj(4, b);
						} catch (k) {
							W(b, c, k);
						}
						break;
					case 1:
						var d = b.stateNode;
						if ("function" === typeof d.componentDidMount) {
							var e = b.return;
							try {
								d.componentDidMount();
							} catch (k) {
								W(b, e, k);
							}
						}
						var f = b.return;
						try {
							Rj(b);
						} catch (k) {
							W(b, f, k);
						}
						break;
					case 5:
						var g = b.return;
						try {
							Rj(b);
						} catch (k) {
							W(b, g, k);
						}
				}
			} catch (k) {
				W(b, b.return, k);
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
	var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = !1, Pi = null, Ri = null, vk = !1, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
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
					default: c = hc;
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
			var f = Jk();
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
			mk.current = f;
			K = e;
			null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
		}
		if (0 !== b) {
			2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
			if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
			if (6 === b) Ck(a, d);
			else {
				e = a.current.alternate;
				if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
				a.finishedWork = e;
				a.finishedLanes = d;
				switch (b) {
					case 0:
					case 1: throw Error(p(345));
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
						for (e = -1; 0 < d;) {
							var g = 31 - oc(d);
							f = 1 << g;
							g = b[g];
							g > e && (e = g);
							d &= ~f;
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
					default: throw Error(p(329));
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
		for (var b = a;;) {
			if (b.flags & 16384) {
				var c = b.updateQueue;
				if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
					var e = c[d], f = e.getSnapshot;
					e = e.value;
					try {
						if (!He(f(), e)) return !1;
					} catch (g) {
						return !1;
					}
				}
			}
			c = b.child;
			if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
			else {
				if (b === a) break;
				for (; null === b.sibling;) {
					if (null === b.return || b.return === a) return !0;
					b = b.return;
				}
				b.sibling.return = b.return;
				b = b.sibling;
			}
		}
		return !0;
	}
	function Ck(a, b) {
		b &= ~rk;
		b &= ~qk;
		a.suspendedLanes |= b;
		a.pingedLanes &= ~b;
		for (a = a.expirationTimes; 0 < b;) {
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
		if (null !== Y) for (c = Y.return; null !== c;) {
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
				case 23: Hj();
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
				var e = d.next, f = c.pending;
				if (null !== f) {
					var g = f.next;
					f.next = e;
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
					for (var d = M.memoizedState; null !== d;) {
						var e = d.queue;
						null !== e && (e.pending = null);
						d = d.next;
					}
					Ih = !1;
				}
				Hh = 0;
				O = N = M = null;
				Jh = !1;
				Kh = 0;
				nk.current = null;
				if (null === c || null === c.return) {
					T = 1;
					pk = b;
					Y = null;
					break;
				}
				a: {
					var f = a, g = c.return, h = c, k = b;
					b = Z;
					h.flags |= 32768;
					if (null !== k && "object" === typeof k && "function" === typeof k.then) {
						var l = k, m = h, q = m.tag;
						if (0 === (m.mode & 1) && (0 === q || 11 === q || 15 === q)) {
							var r = m.alternate;
							r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
						}
						var y = Ui(g);
						if (null !== y) {
							y.flags &= -257;
							Vi(y, g, h, f, b);
							y.mode & 1 && Si(f, l, b);
							b = y;
							k = l;
							var n = b.updateQueue;
							if (null === n) {
								var t = /* @__PURE__ */ new Set();
								t.add(k);
								b.updateQueue = t;
							} else n.add(k);
							break a;
						} else {
							if (0 === (b & 1)) {
								Si(f, l, b);
								tj();
								break a;
							}
							k = Error(p(426));
						}
					} else if (I && h.mode & 1) {
						var J = Ui(g);
						if (null !== J) {
							0 === (J.flags & 65536) && (J.flags |= 256);
							Vi(J, g, h, f, b);
							Jg(Ji(k, h));
							break a;
						}
					}
					f = k = Ji(k, h);
					4 !== T && (T = 2);
					null === sk ? sk = [f] : sk.push(f);
					f = g;
					do {
						switch (f.tag) {
							case 3:
								f.flags |= 65536;
								b &= -b;
								f.lanes |= b;
								var x = Ni(f, k, b);
								ph(f, x);
								break a;
							case 1:
								h = k;
								var w = f.type, u = f.stateNode;
								if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
									f.flags |= 65536;
									b &= -b;
									f.lanes |= b;
									var F = Qi(f, h, b);
									ph(f, F);
									break a;
								}
						}
						f = f.return;
					} while (null !== f);
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
		for (; null !== Y;) Uk(Y);
	}
	function Lk() {
		for (; null !== Y && !cc();) Uk(Y);
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
		var f = c.lanes | c.childLanes;
		Bc(a, f);
		a === Q && (Y = Q = null, Z = 0);
		0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = !0, Fk(hc, function() {
			Hk();
			return null;
		}));
		f = 0 !== (c.flags & 15990);
		if (0 !== (c.subtreeFlags & 15990) || f) {
			f = ok.transition;
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
			hk(c, a, e);
			dc();
			K = h;
			C = g;
			ok.transition = f;
		} else a.current = c;
		vk && (vk = !1, wk = a, xk = e);
		f = a.pendingLanes;
		0 === f && (Ri = null);
		mc(c.stateNode, d);
		Dk(a, B());
		if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, {
			componentStack: e.stack,
			digest: e.digest
		});
		if (Oi) throw Oi = !1, a = Pi, Pi = null, a;
		0 !== (xk & 1) && 0 !== a.tag && Hk();
		f = a.pendingLanes;
		0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
		jg();
		return null;
	}
	function Hk() {
		if (null !== wk) {
			var a = Dc(xk), b = ok.transition, c = C;
			try {
				ok.transition = null;
				C = 16 > a ? 16 : a;
				if (null === wk) var d = !1;
				else {
					a = wk;
					wk = null;
					xk = 0;
					if (0 !== (K & 6)) throw Error(p(331));
					var e = K;
					K |= 4;
					for (V = a.current; null !== V;) {
						var f = V, g = f.child;
						if (0 !== (V.flags & 16)) {
							var h = f.deletions;
							if (null !== h) {
								for (var k = 0; k < h.length; k++) {
									var l = h[k];
									for (V = l; null !== V;) {
										var m = V;
										switch (m.tag) {
											case 0:
											case 11:
											case 15: Pj(8, m, f);
										}
										var q = m.child;
										if (null !== q) q.return = m, V = q;
										else for (; null !== V;) {
											m = V;
											var r = m.sibling, y = m.return;
											Sj(m);
											if (m === l) {
												V = null;
												break;
											}
											if (null !== r) {
												r.return = y;
												V = r;
												break;
											}
											V = y;
										}
									}
								}
								var n = f.alternate;
								if (null !== n) {
									var t = n.child;
									if (null !== t) {
										n.child = null;
										do {
											var J = t.sibling;
											t.sibling = null;
											t = J;
										} while (null !== t);
									}
								}
								V = f;
							}
						}
						if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
						else b: for (; null !== V;) {
							f = V;
							if (0 !== (f.flags & 2048)) switch (f.tag) {
								case 0:
								case 11:
								case 15: Pj(9, f, f.return);
							}
							var x = f.sibling;
							if (null !== x) {
								x.return = f.return;
								V = x;
								break b;
							}
							V = f.return;
						}
					}
					var w = a.current;
					for (V = w; null !== V;) {
						g = V;
						var u = g.child;
						if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
						else b: for (g = w; null !== V;) {
							h = V;
							if (0 !== (h.flags & 2048)) try {
								switch (h.tag) {
									case 0:
									case 11:
									case 15: Qj(9, h);
								}
							} catch (na) {
								W(h, h.return, na);
							}
							if (h === g) {
								V = null;
								break b;
							}
							var F = h.sibling;
							if (null !== F) {
								F.return = h.return;
								V = F;
								break b;
							}
							V = h.return;
						}
					}
					K = e;
					jg();
					if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
						lc.onPostCommitFiberRoot(kc, a);
					} catch (na) {}
					d = !0;
				}
				return d;
			} finally {
				C = c, ok.transition = b;
			}
		}
		return !1;
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
		else for (; null !== b;) {
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
			default: throw Error(p(314));
		}
		null !== d && d.delete(b);
		Yk(a, c);
	}
	var Vk = function(a, b, c) {
		if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = !0;
		else {
			if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = !1, yj(a, b, c);
			dh = 0 !== (a.flags & 131072) ? !0 : !1;
		}
		else dh = !1, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
		b.lanes = 0;
		switch (b.tag) {
			case 2:
				var d = b.type;
				ij(a, b);
				a = b.pendingProps;
				var e = Yf(b, H.current);
				ch(b, c);
				e = Nh(null, b, d, a, e, c);
				var f = Sh();
				b.flags |= 1;
				"object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = !0, cg(b)) : f = !1, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, !0, f, c)) : (b.tag = 0, I && f && vg(b), Xi(null, b, e, c), b = b.child);
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
					throw Error(p(306, d, ""));
				}
				return b;
			case 0: return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
			case 1: return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
			case 3:
				a: {
					kj(b);
					if (null === a) throw Error(p(387));
					d = b.pendingProps;
					f = b.memoizedState;
					e = f.element;
					lh(a, b);
					qh(b, d, null, c);
					var g = b.memoizedState;
					d = g.element;
					if (f.isDehydrated) if (f = {
						element: d,
						isDehydrated: !1,
						cache: g.cache,
						pendingSuspenseBoundaries: g.pendingSuspenseBoundaries,
						transitions: g.transitions
					}, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
						e = Ji(Error(p(423)), b);
						b = lj(a, b, d, c, e);
						break a;
					} else if (d !== e) {
						e = Ji(Error(p(424)), b);
						b = lj(a, b, d, c, e);
						break a;
					} else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = !0, zg = null, c = Vg(b, null, d, c), b.child = c; c;) c.flags = c.flags & -3 | 4096, c = c.sibling;
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
			case 5: return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
			case 6: return null === a && Eg(b), null;
			case 13: return oj(a, b, c);
			case 4: return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
			case 11: return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
			case 7: return Xi(a, b, b.pendingProps, c), b.child;
			case 8: return Xi(a, b, b.pendingProps.children, c), b.child;
			case 12: return Xi(a, b, b.pendingProps.children, c), b.child;
			case 10:
				a: {
					d = b.type._context;
					e = b.pendingProps;
					f = b.memoizedProps;
					g = e.value;
					G(Wg, d._currentValue);
					d._currentValue = g;
					if (null !== f) if (He(f.value, g)) {
						if (f.children === e.children && !Wf.current) {
							b = Zi(a, b, c);
							break a;
						}
					} else for (f = b.child, null !== f && (f.return = b); null !== f;) {
						var h = f.dependencies;
						if (null !== h) {
							g = f.child;
							for (var k = h.firstContext; null !== k;) {
								if (k.context === d) {
									if (1 === f.tag) {
										k = mh(-1, c & -c);
										k.tag = 2;
										var l = f.updateQueue;
										if (null !== l) {
											l = l.shared;
											var m = l.pending;
											null === m ? k.next = k : (k.next = m.next, m.next = k);
											l.pending = k;
										}
									}
									f.lanes |= c;
									k = f.alternate;
									null !== k && (k.lanes |= c);
									bh(f.return, c, b);
									h.lanes |= c;
									break;
								}
								k = k.next;
							}
						} else if (10 === f.tag) g = f.type === b.type ? null : f.child;
						else if (18 === f.tag) {
							g = f.return;
							if (null === g) throw Error(p(341));
							g.lanes |= c;
							h = g.alternate;
							null !== h && (h.lanes |= c);
							bh(g, c, b);
							g = f.sibling;
						} else g = f.child;
						if (null !== g) g.return = f;
						else for (g = f; null !== g;) {
							if (g === b) {
								g = null;
								break;
							}
							f = g.sibling;
							if (null !== f) {
								f.return = g.return;
								g = f;
								break;
							}
							g = g.return;
						}
						f = g;
					}
					Xi(a, b, e.children, c);
					b = b.child;
				}
				return b;
			case 9: return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
			case 14: return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
			case 15: return bj(a, b, b.type, b.pendingProps, c);
			case 17: return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = !0, cg(b)) : a = !1, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, !0, a, c);
			case 19: return xj(a, b, c);
			case 22: return dj(a, b, c);
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
		c.dependencies = null === b ? null : {
			lanes: b.lanes,
			firstContext: b.firstContext
		};
		c.sibling = a.sibling;
		c.index = a.index;
		c.ref = a.ref;
		return c;
	}
	function Rg(a, b, c, d, e, f) {
		var g = 2;
		d = a;
		if ("function" === typeof a) aj(a) && (g = 1);
		else if ("string" === typeof a) g = 5;
		else a: switch (a) {
			case ya: return Tg(c.children, e, f, b);
			case za:
				g = 8;
				e |= 8;
				break;
			case Aa: return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
			case Ea: return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
			case Fa: return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
			case Ia: return pj(c, e, f, b);
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
		b.lanes = f;
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
		a.stateNode = { isHidden: !1 };
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
		b.stateNode = {
			containerInfo: a.containerInfo,
			pendingChildren: null,
			implementation: a.implementation
		};
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
	function bl(a, b, c, d, e, f, g, h, k) {
		a = new al(a, b, c, h, k);
		1 === b ? (b = 1, !0 === f && (b |= 8)) : b = 0;
		f = Bg(3, null, null, b);
		a.current = f;
		f.stateNode = a;
		f.memoizedState = {
			element: d,
			isDehydrated: c,
			cache: null,
			transitions: null,
			pendingSuspenseBoundaries: null
		};
		kh(f);
		return a;
	}
	function cl(a, b, c) {
		var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return {
			$$typeof: wa,
			key: null == d ? null : "" + d,
			children: a,
			containerInfo: b,
			implementation: c
		};
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
					case 1: if (Zf(b.type)) {
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
	function el(a, b, c, d, e, f, g, h, k) {
		a = bl(c, d, !0, a, e, f, g, h, k);
		a.context = dl(null);
		c = a.current;
		d = R();
		e = yi(c);
		f = mh(d, e);
		f.callback = void 0 !== b && null !== b ? b : null;
		nh(c, f, e);
		a.current.lanes = e;
		Ac(a, e, d);
		Dk(a, d);
		return a;
	}
	function fl(a, b, c, d) {
		var e = b.current, f = R(), g = yi(e);
		c = dl(c);
		null === b.context ? b.context = c : b.pendingContext = c;
		b = mh(f, g);
		b.payload = { element: a };
		d = void 0 === d ? null : d;
		null !== d && (b.callback = d);
		a = nh(e, b, g);
		null !== a && (gi(a, e, g, f), oh(a, e, g));
		return g;
	}
	function gl(a) {
		a = a.current;
		if (!a.child) return null;
		switch (a.child.tag) {
			case 5: return a.child.stateNode;
			default: return a.child.stateNode;
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
			a = {
				blockedOn: null,
				target: a,
				priority: b
			};
			for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++);
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
	function pl() {}
	function ql(a, b, c, d, e) {
		if (e) {
			if ("function" === typeof d) {
				var f = d;
				d = function() {
					var a = gl(g);
					f.call(a);
				};
			}
			var g = el(b, d, a, 0, null, !1, !1, "", pl);
			a._reactRootContainer = g;
			a[uf] = g.current;
			sf(8 === a.nodeType ? a.parentNode : a);
			Rk();
			return g;
		}
		for (; e = a.lastChild;) a.removeChild(e);
		if ("function" === typeof d) {
			var h = d;
			d = function() {
				var a = gl(k);
				h.call(a);
			};
		}
		var k = bl(a, 0, !1, null, null, !1, !1, "", pl);
		a._reactRootContainer = k;
		a[uf] = k.current;
		sf(8 === a.nodeType ? a.parentNode : a);
		Rk(function() {
			fl(b, k, c, d);
		});
		return k;
	}
	function rl(a, b, c, d, e) {
		var f = c._reactRootContainer;
		if (f) {
			var g = f;
			if ("function" === typeof e) {
				var h = e;
				e = function() {
					var a = gl(g);
					h.call(a);
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
			case 13: Rk(function() {
				var b = ih(a, 1);
				if (null !== b) gi(b, a, 1, R());
			}), il(a, 1);
		}
	};
	Fc = function(a) {
		if (13 === a.tag) {
			var b = ih(a, 134217728);
			if (null !== b) gi(b, a, 134217728, R());
			il(a, 134217728);
		}
	};
	Gc = function(a) {
		if (13 === a.tag) {
			var b = yi(a), c = ih(a, b);
			if (null !== c) gi(c, a, b, R());
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
					for (c = a; c.parentNode;) c = c.parentNode;
					c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + "][type=\"radio\"]");
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
			case "select": b = c.value, null != b && fb(a, !!c.multiple, b, !1);
		}
	};
	Gb = Qk;
	Hb = Rk;
	var sl = {
		usingClientEntryPoint: !1,
		Events: [
			Cb,
			ue,
			Db,
			Eb,
			Fb,
			Qk
		]
	}, tl = {
		findFiberByHostInstance: Wc,
		bundleType: 0,
		version: "18.3.1",
		rendererPackageName: "react-dom"
	};
	var ul = {
		bundleType: tl.bundleType,
		version: tl.version,
		rendererPackageName: tl.rendererPackageName,
		rendererConfig: tl.rendererConfig,
		overrideHookState: null,
		overrideHookStateDeletePath: null,
		overrideHookStateRenamePath: null,
		overrideProps: null,
		overridePropsDeletePath: null,
		overridePropsRenamePath: null,
		setErrorHandler: null,
		setSuspenseHandler: null,
		scheduleUpdate: null,
		currentDispatcherRef: ua.ReactCurrentDispatcher,
		findHostInstanceByFiber: function(a) {
			a = Zb(a);
			return null === a ? null : a.stateNode;
		},
		findFiberByHostInstance: tl.findFiberByHostInstance || jl,
		findHostInstancesForRefresh: null,
		scheduleRefresh: null,
		scheduleRoot: null,
		setRefreshHandler: null,
		getCurrentFiber: null,
		reconcilerVersion: "18.3.1-next-f1338f8080-20240426"
	};
	if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
		var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!vl.isDisabled && vl.supportsFiber) try {
			kc = vl.inject(ul), lc = vl;
		} catch (a) {}
	}
	exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
	exports.createPortal = function(a, b) {
		var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
		if (!nl(b)) throw Error(p(200));
		return cl(a, b, null, c);
	};
	exports.createRoot = function(a, b) {
		if (!nl(a)) throw Error(p(299));
		var c = !1, d = "", e = kl;
		null !== b && void 0 !== b && (!0 === b.unstable_strictMode && (c = !0), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
		b = bl(a, 1, !1, null, null, c, !1, d, e);
		a[uf] = b.current;
		sf(8 === a.nodeType ? a.parentNode : a);
		return new ll(b);
	};
	exports.findDOMNode = function(a) {
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
	exports.flushSync = function(a) {
		return Rk(a);
	};
	exports.hydrate = function(a, b, c) {
		if (!ol(b)) throw Error(p(200));
		return rl(null, a, b, !0, c);
	};
	exports.hydrateRoot = function(a, b, c) {
		if (!nl(a)) throw Error(p(405));
		var d = null != c && c.hydratedSources || null, e = !1, f = "", g = kl;
		null !== c && void 0 !== c && (!0 === c.unstable_strictMode && (e = !0), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
		b = el(b, null, a, 1, null != c ? c : null, e, !1, f, g);
		a[uf] = b.current;
		sf(a);
		if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(c, e);
		return new ml(b);
	};
	exports.render = function(a, b, c) {
		if (!ol(b)) throw Error(p(200));
		return rl(null, a, b, !1, c);
	};
	exports.unmountComponentAtNode = function(a) {
		if (!ol(a)) throw Error(p(40));
		return a._reactRootContainer ? (Rk(function() {
			rl(null, null, a, !1, function() {
				a._reactRootContainer = null;
				a[uf] = null;
			});
		}), !0) : !1;
	};
	exports.unstable_batchedUpdates = Qk;
	exports.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
		if (!ol(c)) throw Error(p(200));
		if (null == a || void 0 === a._reactInternals) throw Error(p(38));
		return rl(a, b, c, !1, d);
	};
	exports.version = "18.3.1-next-f1338f8080-20240426";
}));
//#endregion
//#region node_modules/react-dom/index.js
var require_react_dom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_production_min();
}));
//#endregion
//#region node_modules/react-dom/client.js
var require_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	var m = require_react_dom();
	exports.createRoot = m.createRoot;
	exports.hydrateRoot = m.hydrateRoot;
}));
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.min.js
/**
* @license React
* react-jsx-runtime.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var f = require_react(), k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = {
		key: !0,
		ref: !0,
		__self: !0,
		__source: !0
	};
	function q(c, a, g) {
		var b, d = {}, e = null, h = null;
		void 0 !== g && (e = "" + g);
		void 0 !== a.key && (e = "" + a.key);
		void 0 !== a.ref && (h = a.ref);
		for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
		if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
		return {
			$$typeof: k,
			type: c,
			key: e,
			ref: h,
			props: d,
			_owner: n.current
		};
	}
	exports.Fragment = l;
	exports.jsx = q;
	exports.jsxs = q;
}));
//#endregion
//#region node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production_min();
}));
//#endregion
//#region src/Landing.jsx
var import_client = /* @__PURE__ */ __toESM(require_client());
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Landing({ onEnter }) {
	const [phase, setPhase] = (0, import_react.useState)("in");
	(0, import_react.useEffect)(() => {
		const t1 = setTimeout(() => setPhase("out"), 2800);
		const t2 = setTimeout(() => onEnter(), 3500);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
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
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sachi-word",
				style: { textAlign: "center" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 62,
						fontWeight: 900,
						lineHeight: 1,
						background: "linear-gradient(135deg, #F5C842 0%, #FFD580 40%, #FF9500 100%)",
						backgroundSize: "200% auto",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						letterSpacing: -1,
						animation: "shimmer 3s linear 1s infinite"
					},
					children: "sachi"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sachi-tag",
				style: {
					marginTop: 18,
					color: "rgba(255,255,255,0.4)",
					fontSize: 13,
					letterSpacing: 3,
					textTransform: "uppercase",
					fontWeight: 500
				},
				children: "Share Everything"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sachi-tag",
				style: {
					position: "absolute",
					bottom: 48,
					display: "flex",
					gap: 6
				},
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					width: i === 0 ? 20 : 6,
					height: 6,
					borderRadius: 99,
					background: i === 0 ? "#F5C842" : "rgba(255,255,255,0.15)",
					transition: "all 0.3s"
				} }, i))
			})
		]
	});
}
//#endregion
//#region src/api.js
var APP_ID$1 = "69b2ee18a8e6fb58c7f0261c";
var BASE_URL$1 = "https://sachi-c7f0261c.base44.app/api";
var sessionToken = null;
function setToken(t) {
	sessionToken = t;
	localStorage.setItem("sachi_token", t);
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
var auth = {
	async signIn(email, password) {
		const data = await request("POST", `/apps/${APP_ID$1}/auth/login`, {
			email,
			password
		});
		const token = data.access_token || data.token;
		if (token) setToken(token);
		if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
		return data;
	},
	async signUp(email, password, fullName) {
		return request("POST", `/apps/${APP_ID$1}/auth/register`, {
			email,
			password,
			full_name: fullName
		});
	},
	async verifyOtp(email, otpCode) {
		const data = await request("POST", `/apps/${APP_ID$1}/auth/verify-otp`, {
			email,
			otp_code: otpCode
		});
		const token = data.access_token || data.token;
		if (token) setToken(token);
		if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
		return data;
	},
	async resendOtp(email) {
		return request("POST", `/apps/${APP_ID$1}/auth/resend-otp`, { email });
	},
	getUser() {
		const u = localStorage.getItem("sachi_user");
		return u ? JSON.parse(u) : null;
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
var videos = {
	async list(limit = 30, skip = 0) {
		return request("GET", `/apps/${APP_ID$1}/entities/SachiVideo?sort=-created_date&limit=${limit}&skip=${skip}`);
	},
	async create(data) {
		return request("POST", `/apps/${APP_ID$1}/entities/SachiVideo`, data);
	},
	async update(id, data) {
		return request("PUT", `/apps/${APP_ID$1}/entities/SachiVideo/${id}`, data);
	},
	async myVideos(userId) {
		return request("GET", `/apps/${APP_ID$1}/entities/SachiVideo?user_id=${userId}`);
	},
	async byUser(userId) {
		let all = [];
		let skip = 0;
		const limit = 100;
		while (true) {
			const res = await request("GET", `/apps/${APP_ID$1}/entities/SachiVideo?limit=${limit}&skip=${skip}&sort=-created_date`);
			const items = Array.isArray(res) ? res : res?.items || [];
			all = all.concat(items);
			if (items.length < limit) break;
			skip += limit;
			if (skip > 500) break;
		}
		return all.filter((v) => v.user_id === userId && !v.is_archived);
	},
	async delete(id) {
		return request("DELETE", `/apps/${APP_ID$1}/entities/SachiVideo/${id}`);
	}
};
var comments = {
	async list(videoId) {
		return request("GET", `/apps/${APP_ID$1}/entities/SachiComment?video_id=${videoId}&sort=created_date&limit=200`);
	},
	async create(data) {
		return request("POST", `/apps/${APP_ID$1}/entities/SachiComment`, data);
	},
	async update(id, data) {
		return request("PUT", `/apps/${APP_ID$1}/entities/SachiComment/${id}`, data);
	},
	async delete(id) {
		return request("DELETE", `/apps/${APP_ID$1}/entities/SachiComment/${id}`);
	}
};
async function uploadFile(file) {
	const token = getToken();
	const form = new FormData();
	form.append("file", file);
	const headers = {};
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const res = await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/integration-endpoints/Core/UploadFile`, {
		method: "POST",
		headers,
		body: form
	});
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
var follows = {
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
var reports = {
	async create(data) {
		return request("POST", `/apps/${APP_ID$1}/entities/SachiReport`, data);
	},
	async list() {
		return request("GET", `/apps/${APP_ID$1}/entities/SachiReport?sort=-created_date&limit=200`);
	},
	async update(id, data) {
		return request("PUT", `/apps/${APP_ID$1}/entities/SachiReport/${id}`, data);
	}
};
var bookmarks = {
	async add(user_id, username, video_id) {
		return request("POST", `/apps/${APP_ID$1}/entities/SachiBookmark`, {
			user_id,
			username,
			video_id
		});
	},
	async remove(id) {
		return request("DELETE", `/apps/${APP_ID$1}/entities/SachiBookmark/${id}`);
	},
	async getByUser(user_id) {
		return request("GET", `/apps/${APP_ID$1}/entities/SachiBookmark?user_id=${user_id}&limit=500`);
	}
};
var blocks = {
	async block(blocker_id, blocker_username, blocked_id, blocked_username) {
		return request("POST", `/apps/${APP_ID$1}/entities/SachiBlock`, {
			blocker_id,
			blocker_username,
			blocked_id,
			blocked_username
		});
	},
	async unblock(id) {
		return request("DELETE", `/apps/${APP_ID$1}/entities/SachiBlock/${id}`);
	},
	async getBlockedByUser(blocker_id) {
		return request("GET", `/apps/${APP_ID$1}/entities/SachiBlock?blocker_id=${blocker_id}&limit=500`);
	}
};
var interests = {
	async get(userId) {
		try {
			const res = await request("GET", `/apps/${APP_ID$1}/entities/UserInterest?user_id=${userId}&limit=100`);
			return Array.isArray(res) ? res : res?.items || [];
		} catch {
			return [];
		}
	},
	async signal(userId, hashtags, points) {
		if (!userId || !hashtags?.length) return;
		const existing = await this.get(userId);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		for (const tag of hashtags) {
			const clean = tag.replace(/^#/, "").toLowerCase().trim();
			if (!clean) continue;
			const entry = existing.find((e) => e.hashtag === clean);
			if (entry) {
				const decayed = Math.max(0, (entry.score || 0) * .95);
				await request("PUT", `/apps/${APP_ID$1}/entities/UserInterest/${entry.id}`, {
					score: decayed + points,
					last_updated: now
				}).catch(() => {});
			} else await request("POST", `/apps/${APP_ID$1}/entities/UserInterest`, {
				user_id: userId,
				hashtag: clean,
				score: points,
				last_updated: now
			}).catch(() => {});
		}
	},
	async rankFeed(userId, videoList) {
		const byDate = [...videoList].sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime());
		if (!userId) return byDate;
		const userInterests = await this.get(userId);
		if (!userInterests.length) return byDate;
		const scoreMap = {};
		for (const i of userInterests) scoreMap[i.hashtag.toLowerCase()] = i.score || 0;
		if (Object.values(scoreMap).reduce((s, v) => s + v, 0) < 3) return byDate;
		const scored = byDate.map((v) => {
			const tags = (v.hashtags || []).map((t) => t.replace(/^#/, "").toLowerCase());
			let relevance = 0;
			for (const tag of tags) relevance += scoreMap[tag] || 0;
			return {
				...v,
				_relevance: relevance
			};
		});
		const times = scored.map((v) => new Date(v.created_date || 0).getTime());
		const minT = Math.min(...times);
		const timeRange = Math.max(...times) - minT || 1;
		const maxRel = Math.max(...scored.map((v) => v._relevance), 1);
		scored.sort((a, b) => {
			const recencyA = (new Date(a.created_date || 0).getTime() - minT) / timeRange;
			const recencyB = (new Date(b.created_date || 0).getTime() - minT) / timeRange;
			const relA = a._relevance / maxRel;
			const relB = b._relevance / maxRel;
			const scoreA = relA * .3 + recencyA * .7;
			return relB * .3 + recencyB * .7 - scoreA;
		});
		return scored;
	}
};
//#endregion
//#region src/AuthModal.jsx
var COUNTRIES = [
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
var GOOGLE_CLIENT_ID = "124061688969-7ebbn8gph1ej84dli790clptp32gosdt.apps.googleusercontent.com";
var APP_ID = "69b2ee18a8e6fb58c7f0261c";
var BASE_URL = "https://sachi-c7f0261c.base44.app/api";
async function lookupSachiUser(email) {
	try {
		const data = await (await fetch(`${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(email)}&limit=5`, { headers: { "Content-Type": "application/json" } })).json();
		return (Array.isArray(data) ? data : data?.items || []).find((u) => u.email === email) || null;
	} catch {
		return null;
	}
}
function buildSessionUser(found, payload) {
	return {
		id: found.id,
		email: found.email,
		full_name: found.display_name || payload?.name || found.email,
		avatar_url: found.avatar_url || payload?.picture || "",
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
	return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
		client_id: GOOGLE_CLIENT_ID,
		redirect_uri: origin,
		response_type: "id_token",
		scope: "openid email profile",
		nonce: Math.random().toString(36).slice(2),
		prompt: "select_account"
	}).toString()}`;
}
async function handleGoogleRedirectCallback() {
	const hash = window.location.hash;
	if (!hash || !hash.includes("id_token=")) return null;
	const idToken = new URLSearchParams(hash.replace(/^#/, "")).get("id_token");
	if (!idToken) return null;
	window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
	const payload = decodeJwt(idToken);
	if (!payload?.email) return null;
	localStorage.setItem("sachi_pending_google", JSON.stringify(payload));
	const found = await lookupSachiUser(payload.email);
	if (found) {
		const sessionUser = buildSessionUser(found, payload);
		localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
		localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
		localStorage.removeItem("sachi_pending_google");
		return {
			sessionUser,
			needsProfile: false
		};
	}
	return {
		payload,
		needsProfile: true
	};
}
function FinishStep({ googlePayload, onSuccess }) {
	const { email, name, picture } = googlePayload;
	const [username, setUsername] = (0, import_react.useState)(email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase());
	const [dob, setDob] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [is18, setIs18] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
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
	const handleFinish = async () => {
		if (!username.trim()) return setError("Please enter a username.");
		if (!dob) return setError("Please enter your birthday.");
		if (!is18) return setError("You must confirm you are 18 years or older.");
		const birthDate = new Date(dob);
		const today = /* @__PURE__ */ new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) age--;
		if (age < 13) return setError("You must be at least 13 years old to join Sachi.");
		setLoading(true);
		setError("");
		try {
			const created = await fetch(`${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser`, {
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
					videos_count: 0
				})
			}).then((r) => r.json());
			localStorage.setItem("sachi_dob", dob);
			if (country) localStorage.setItem("sachi_country", country);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: { textAlign: "center" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					marginBottom: 20
				},
				children: [
					picture && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: picture,
						style: {
							width: 72,
							height: 72,
							borderRadius: "50%",
							border: "3px solid #F5C842",
							marginBottom: 10
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 800,
							fontSize: 17
						},
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#888",
							fontSize: 13
						},
						children: email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							background: "rgba(80,200,80,0.12)",
							border: "1px solid rgba(80,200,80,0.3)",
							borderRadius: 20,
							padding: "4px 14px",
							marginTop: 8,
							color: "#6fcf6f",
							fontSize: 12,
							fontWeight: 700
						},
						children: "✓ Verified with Google"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#aaa",
					fontSize: 13,
					marginBottom: 16
				},
				children: "Just a few more details to set up your profile:"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: username,
				onChange: (e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()),
				placeholder: "Choose a username",
				style: inp,
				maxLength: 30
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					textAlign: "left",
					marginBottom: 4,
					color: "#888",
					fontSize: 12
				},
				children: ["Birthday ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: { color: "#ff6b6b" },
					children: "*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: dob,
				onChange: (e) => setDob(e.target.value),
				type: "date",
				max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				style: {
					...inp,
					colorScheme: "dark"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					textAlign: "left",
					marginBottom: 4,
					color: "#888",
					fontSize: 12
				},
				children: ["Where are you from? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						color: "#888",
						fontSize: 11
					},
					children: "(optional)"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: country,
				onChange: (e) => setCountry(e.target.value),
				style: {
					display: "block",
					width: "100%",
					boxSizing: "border-box",
					background: "#1a1b2e",
					border: "1px solid rgba(245,200,66,0.3)",
					borderRadius: 12,
					padding: "14px 16px",
					color: country ? "#fff" : "#888",
					fontSize: 15,
					outline: "none",
					marginBottom: 12,
					cursor: "pointer"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					style: {
						background: "#1a1b2e",
						color: "#888"
					},
					children: "🌍 Select your country"
				}), COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: c,
					style: {
						background: "#1a1b2e",
						color: "#fff"
					},
					children: c
				}, c))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				style: {
					display: "flex",
					gap: 10,
					alignItems: "center",
					marginBottom: 16,
					cursor: "pointer",
					textAlign: "left"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: is18,
					onChange: (e) => setIs18(e.target.checked),
					style: {
						width: 20,
						height: 20,
						accentColor: "#F5C842",
						flexShrink: 0
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						color: "#ccc",
						fontSize: 14,
						fontWeight: 600
					},
					children: "I confirm I am 18 years or older"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					color: "#555",
					fontSize: 11,
					marginBottom: 14,
					lineHeight: 1.5
				},
				children: [
					"By joining you agree to our",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/terms",
						target: "_blank",
						style: { color: "#F5C842" },
						children: "Terms"
					}),
					" &",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/privacy",
						target: "_blank",
						style: { color: "#F5C842" },
						children: "Privacy Policy"
					}),
					"."
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#ff6b6b",
					fontSize: 13,
					marginBottom: 12
				},
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleFinish,
				disabled: loading,
				style: {
					...btn,
					opacity: loading ? .7 : 1
				},
				children: loading ? "Setting up your profile…" : "Let's Go 🚀"
			})
		]
	});
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
	const [step, setStep] = (0, import_react.useState)(pending ? "finish" : "signin");
	const [googlePayload, setGooglePayload] = (0, import_react.useState)(pending || null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleGoogleRedirect = () => {
		localStorage.setItem("sachi_auth_intent", "1");
		window.location.href = buildGoogleAuthUrl();
	};
	if (step === "finish" && googlePayload) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 3e3,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "0 16px"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			style: {
				position: "absolute",
				inset: 0,
				background: "rgba(0,0,0,0.88)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
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
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					style: {
						position: "absolute",
						top: 16,
						right: 16,
						background: "none",
						border: "none",
						color: "rgba(255,255,255,0.4)",
						fontSize: 22,
						cursor: "pointer",
						lineHeight: 1
					},
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						textAlign: "center",
						marginBottom: 24
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 32,
							marginBottom: 8
						},
						children: "🌸"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#F5C842",
							fontWeight: 800,
							fontSize: 22,
							letterSpacing: -.5
						},
						children: "Almost there!"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinishStep, {
					googlePayload,
					onSuccess
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 3e3,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "0 16px"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			style: {
				position: "absolute",
				inset: 0,
				background: "rgba(0,0,0,0.88)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "relative",
				zIndex: 3001,
				background: "#12132A",
				borderRadius: 24,
				border: "1px solid rgba(245,200,66,0.1)",
				padding: "32px 24px",
				width: "100%",
				maxWidth: 380,
				boxShadow: "0 24px 80px rgba(0,0,0,0.8)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					style: {
						position: "absolute",
						top: 16,
						right: 16,
						background: "none",
						border: "none",
						color: "rgba(255,255,255,0.4)",
						fontSize: 22,
						cursor: "pointer",
						lineHeight: 1
					},
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						textAlign: "center",
						marginBottom: 28
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 40,
								marginBottom: 8
							},
							children: "🌸"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#F5C842",
								fontWeight: 800,
								fontSize: 24,
								letterSpacing: -.5,
								marginBottom: 4
							},
							children: "Join Sachi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.45)",
								fontSize: 14
							},
							children: "Where truth meets community"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "22",
						height: "22",
						viewBox: "0 0 48 48",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#4285F4",
								d: "M43.6 20.5H42V20H24v8h11.3C33.6 32.8 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#34A853",
								d: "M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#FBBC05",
								d: "M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.5-3.2-11.3-7.8l-6.5 5C9.6 39.5 16.4 44 24 44z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#EA4335",
								d: "M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.4 4.4-4.5 5.8l6.2 5.2C41.2 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"
							})
						]
					}), "Continue with Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "rgba(255,255,255,0.2)",
						fontSize: 12,
						textAlign: "center",
						marginBottom: 20
					},
					children: "Free to join. No spam. No BS."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						color: "#444",
						fontSize: 11,
						textAlign: "center",
						lineHeight: 1.6
					},
					children: [
						"By continuing you agree to our",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/terms",
							target: "_blank",
							style: { color: "#F5C842" },
							children: "Terms"
						}),
						" ",
						"&",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/privacy",
							target: "_blank",
							style: { color: "#F5C842" },
							children: "Privacy Policy"
						}),
						"."
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/Terms.jsx
function Terms() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: "#0f0f1a",
			minHeight: "100vh",
			padding: "32px 20px",
			color: "#ddd",
			fontFamily: "sans-serif",
			maxWidth: 700,
			margin: "0 auto"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#ff6b6b",
					fontSize: 28,
					fontWeight: 900,
					marginBottom: 4
				},
				children: "📋 Terms of Service"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#888",
					fontSize: 13,
					marginBottom: 28
				},
				children: "Last updated: April 1, 2026"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					color: "#aaa",
					fontSize: 14,
					lineHeight: 1.8,
					marginBottom: 20
				},
				children: [
					"Welcome to ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						style: { color: "#fff" },
						children: "Sachi"
					}),
					", a short-video sharing platform operated by ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						style: { color: "#fff" },
						children: "LDNA Consulting, New Providence, NJ 07974"
					}),
					". By creating an account or using Sachi, you agree to these Terms of Service. Please read them carefully."
				]
			}),
			[
				{
					title: "1. Eligibility",
					body: "You must be at least 18 years old to create an account and use Sachi. By registering, you confirm that you are 18 or older. We reserve the right to terminate accounts of users found to be under 18."
				},
				{
					title: "2. User Accounts",
					body: "You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate information when registering and to update it as needed. You are fully responsible for all activity that occurs under your account."
				},
				{
					title: "3. Content You Post",
					body: "You retain ownership of the content you upload. However, by posting on Sachi, you grant LDNA Consulting a non-exclusive, royalty-free, worldwide license to display, distribute, and promote your content within the platform. You are solely responsible for everything you post. You must not post content that is illegal, harassing, defamatory, or infringes on any third party's rights."
				},
				{
					title: "4. No Liability for Other Users' Content — YOU MUST READ AND AGREE",
					body: "Sachi is a user-generated content platform. We do NOT create, endorse, verify, or take responsibility for any content posted by other users. By creating an account, you expressly acknowledge and agree that Sachi and LDNA Consulting are NOT responsible or liable — directly or indirectly — for any content, videos, comments, images, or messages posted by other users. This includes content that is offensive, inaccurate, harmful, illegal, or objectionable. Your interactions with other users and any content you encounter are entirely at your own risk. If you see content that violates these Terms, you may report it using the in-app report feature."
				},
				{
					title: "5. Prohibited Content",
					body: "The following content is strictly prohibited: content involving minors in any sexual context, content that promotes violence or terrorism, content that infringes copyrights or trademarks, spam or misleading information, and any content that violates applicable law."
				},
				{
					title: "6. Content Moderation",
					body: "We reserve the right — but not the obligation — to review, remove, or restrict any content or account that we determine, in our sole discretion, violates these Terms or is harmful to our community."
				},
				{
					title: "7. Intellectual Property",
					body: "The Sachi name, logo, and platform design are the property of LDNA Consulting. You may not copy, reproduce, or use them without prior written permission."
				},
				{
					title: "8. Disclaimers",
					body: "Sachi is provided 'as is' without warranties of any kind. We do not guarantee uninterrupted service or that the platform will be error-free. We are not liable for any user-generated content."
				},
				{
					title: "9. Limitation of Liability",
					body: "To the maximum extent permitted by law, LDNA Consulting shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of Sachi."
				},
				{
					title: "10. Termination",
					body: "We may suspend or terminate your account at any time for violations of these Terms, without prior notice. You may also delete your account at any time."
				},
				{
					title: "11. Changes to Terms",
					body: "We may update these Terms from time to time. Continued use of Sachi after changes are posted constitutes your acceptance of the updated Terms."
				},
				{
					title: "12. Governing Law",
					body: "These Terms are governed by the laws of the State of New Jersey, United States, without regard to its conflict of law provisions."
				},
				{
					title: "13. Contact",
					body: "For questions about these Terms, contact us at: jaygnz27@gmail.com"
				}
			].map(({ title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { marginBottom: 22 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#ff8e53",
						fontWeight: 800,
						fontSize: 15,
						marginBottom: 6
					},
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						color: "#bbb",
						fontSize: 14,
						lineHeight: 1.8,
						margin: 0
					},
					children: body
				})]
			}, title)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					marginTop: 32,
					paddingTop: 20,
					borderTop: "1px solid rgba(255,255,255,0.1)",
					textAlign: "center"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					style: {
						color: "#ff6b6b",
						fontSize: 14,
						textDecoration: "none"
					},
					children: "← Back to Sachi"
				})
			})
		]
	});
}
//#endregion
//#region src/Privacy.jsx
function Privacy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: "#0f0f1a",
			minHeight: "100vh",
			padding: "32px 20px",
			color: "#ddd",
			fontFamily: "sans-serif",
			maxWidth: 700,
			margin: "0 auto"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#ff6b6b",
					fontSize: 28,
					fontWeight: 900,
					marginBottom: 4
				},
				children: "🔒 Privacy Policy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#888",
					fontSize: 13,
					marginBottom: 28
				},
				children: "Last updated: April 1, 2026"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					color: "#aaa",
					fontSize: 14,
					lineHeight: 1.8,
					marginBottom: 20
				},
				children: [
					"This Privacy Policy explains how ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						style: { color: "#fff" },
						children: "LDNA Consulting"
					}),
					" (\"we\", \"us\", \"our\") collects, uses, and protects your personal information when you use ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						style: { color: "#fff" },
						children: "Sachi"
					}),
					"."
				]
			}),
			[
				{
					title: "1. Information We Collect",
					body: "We collect information you provide when creating an account (name, email address, password), content you upload (videos, photos, captions), and usage data (device type, IP address, pages visited, interactions within the app)."
				},
				{
					title: "2. How We Use Your Information",
					body: "We use your information to: operate and improve the Sachi platform, authenticate your identity and secure your account, display your content to other users, send account-related notifications (e.g. email verification, password reset), and comply with legal obligations."
				},
				{
					title: "3. Data Sharing",
					body: "We do not sell your personal information to third parties. We may share data with trusted service providers who help us operate the platform (e.g. cloud storage, email delivery), only to the extent necessary. We may disclose information if required by law or to protect the rights, property, or safety of our users."
				},
				{
					title: "4. Cookies & Tracking",
					body: "Sachi uses local browser storage (localStorage) to maintain your login session. We do not use third-party advertising cookies. Basic analytics may be used to understand how the app is used, without identifying individual users."
				},
				{
					title: "5. Data Retention",
					body: "We retain your account data and content for as long as your account is active. If you delete your account, we will remove your personal information from our systems within 30 days, except where retention is required by law."
				},
				{
					title: "6. Your Rights",
					body: "You have the right to access, update, or delete your personal information at any time. You can update your profile within the app or contact us directly to request deletion of your account and data."
				},
				{
					title: "7. Children's Privacy",
					body: "Sachi is strictly intended for users aged 18 and older. We do not knowingly collect personal information from anyone under 18. If we discover that a user is under 18, their account will be terminated immediately."
				},
				{
					title: "8. Security",
					body: "We take reasonable technical and organizational measures to protect your data against unauthorized access, loss, or misuse. However, no online platform can guarantee absolute security."
				},
				{
					title: "9. Changes to This Policy",
					body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice in the app or via email. Continued use of Sachi after changes are posted means you accept the updated policy."
				},
				{
					title: "10. Contact Us",
					body: "If you have questions or concerns about this Privacy Policy, please contact us at: jaygnz27@gmail.com — LDNA Consulting, New Providence, NJ 07974"
				}
			].map(({ title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { marginBottom: 22 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#ff8e53",
						fontWeight: 800,
						fontSize: 15,
						marginBottom: 6
					},
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						color: "#bbb",
						fontSize: 14,
						lineHeight: 1.8,
						margin: 0
					},
					children: body
				})]
			}, title)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					marginTop: 32,
					paddingTop: 20,
					borderTop: "1px solid rgba(255,255,255,0.1)",
					textAlign: "center"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					style: {
						color: "#ff6b6b",
						fontSize: 14,
						textDecoration: "none"
					},
					children: "← Back to Sachi"
				})
			})
		]
	});
}
//#endregion
//#region src/App.jsx
function formatDate(d) {
	if (!d) return "";
	return new Date(d).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "America/New_York"
	});
}
function formatCount(n) {
	if (!n) return "0";
	if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
	if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
	return String(n);
}
var resolveMediaUrl = (url, isVideo) => {
	if (!url) return url;
	const match = url.match(/\/files\/mp\/public\/([^/]+)\/(.+)$/);
	if (match) {
		const filename = match[2];
		return `https://media.base44.com/${isVideo || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(filename) ? "videos" : "images"}/public/${match[1]}/${match[2]}`;
	}
	return url;
};
async function getPostLocation() {
	const savedCountry = localStorage.getItem("sachi_country");
	const savedRegion = localStorage.getItem("sachi_region");
	const savedCode = localStorage.getItem("sachi_country_code");
	if (savedCode) return {
		post_country: savedCode,
		post_region: savedRegion || null
	};
	if (savedCountry) return {
		post_country: savedCountry,
		post_region: savedRegion || null
	};
	try {
		const { latitude, longitude } = (await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5e3 }))).coords;
		const addr = (await (await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)).json()).address || {};
		const country = addr.country_code ? addr.country_code.toUpperCase() : null;
		const region = addr.state || addr.city || addr.county || null;
		if (country) localStorage.setItem("sachi_country_code", country);
		if (region) localStorage.setItem("sachi_region", region);
		return {
			post_country: country,
			post_region: region
		};
	} catch {
		return {};
	}
}
function countryFlag(code) {
	if (!code || code.length !== 2) return "";
	return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
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
			video.currentTime = Math.min(1, video.duration * .1);
		};
		video.onseeked = () => {
			try {
				const canvas = document.createElement("canvas");
				canvas.width = 500;
				canvas.height = 888;
				const ctx = canvas.getContext("2d");
				const vw = video.videoWidth, vh = video.videoHeight;
				const targetRatio = 500 / 888, srcRatio = vw / vh;
				let sx = 0, sy = 0, sw = vw, sh = vh;
				if (srcRatio > targetRatio) {
					sw = vh * targetRatio;
					sx = (vw - sw) / 2;
				} else {
					sh = vw / targetRatio;
					sy = (vh - sh) / 2;
				}
				ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 500, 888);
				URL.revokeObjectURL(url);
				canvas.toBlob(async (blob) => {
					if (!blob) return resolve(null);
					const thumbFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
					try {
						resolve(await uploadFile(thumbFile));
					} catch {
						resolve(null);
					}
				}, "image/jpeg", .85);
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
	const [list, setList] = (0, import_react.useState)([]);
	const [text, setText] = (0, import_react.useState)("");
	const [posting, setPosting] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [replyingTo, setReplyingTo] = (0, import_react.useState)(null);
	const [expandedReplies, setExpandedReplies] = (0, import_react.useState)({});
	const bottomRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!video) return;
		comments.list(video.id).then((r) => setList(Array.isArray(r) ? r : [])).catch(() => setList([])).finally(() => setLoading(false));
	}, [video?.id]);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [list]);
	const startReply = (c) => {
		if (!currentUser) {
			onNeedAuth();
			return;
		}
		setReplyingTo({
			id: c.id,
			username: c.username
		});
		setText(`@${c.username} `);
		setTimeout(() => inputRef.current?.focus(), 100);
	};
	const cancelReply = () => {
		setReplyingTo(null);
		setText("");
	};
	const post = async () => {
		if (!currentUser) {
			onNeedAuth();
			return;
		}
		if (!text.trim()) return;
		setPosting(true);
		try {
			const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
			if (replyingTo) {
				const reply = {
					id: Date.now().toString(),
					username,
					avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
					comment_text: text.trim(),
					thumbsUp: 0,
					hearts: 0,
					thumbsDown: 0
				};
				setList((prev) => prev.map((x) => x.id === replyingTo.id ? {
					...x,
					replies: [...x.replies || [], reply]
				} : x));
				setExpandedReplies((prev) => ({
					...prev,
					[replyingTo.id]: true
				}));
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
	const reactToComment = (id, reaction, isReply, parentId) => {
		if (isReply) setList((prev) => prev.map((x) => x.id === parentId ? {
			...x,
			replies: (x.replies || []).map((r) => r.id === id ? {
				...r,
				[reaction]: (r[reaction] || 0) + 1
			} : r)
		} : x));
		else setList((prev) => prev.map((x) => x.id === id ? {
			...x,
			[reaction]: (x[reaction] || 0) + 1
		} : x));
	};
	const CommentRow = ({ c, isReply = false, parentId = null }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			gap: 10,
			marginBottom: 12,
			paddingLeft: isReply ? 44 : 0
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: c.avatar_url,
			style: {
				width: isReply ? 28 : 36,
				height: isReply ? 28 : 36,
				borderRadius: "50%",
				border: `2px solid rgba(108,99,255,${isReply ? .2 : .3})`,
				flexShrink: 0
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: { flex: 1 },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						color: "#ff6b6b",
						fontWeight: 700,
						fontSize: isReply ? 12 : 13
					},
					children: ["@", c.username]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#ccc",
						fontSize: isReply ? 13 : 14,
						marginBottom: 4
					},
					children: c.comment_text
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 10,
						alignItems: "center",
						flexWrap: "wrap"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => reactToComment(c.id, "thumbsUp", isReply, parentId),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: 2,
								color: c.thumbsUp ? "#6bff9a" : "#666",
								fontSize: 12,
								padding: 0
							},
							children: ["👍 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { fontSize: 10 },
								children: c.thumbsUp || 0
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => reactToComment(c.id, "hearts", isReply, parentId),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: 2,
								color: c.hearts ? "#ff6b6b" : "#666",
								fontSize: 12,
								padding: 0
							},
							children: ["❤️ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { fontSize: 10 },
								children: c.hearts || 0
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => reactToComment(c.id, "thumbsDown", isReply, parentId),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: 2,
								color: c.thumbsDown ? "#ff8e53" : "#666",
								fontSize: 12,
								padding: 0
							},
							children: ["👎 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { fontSize: 10 },
								children: c.thumbsDown || 0
							})]
						}),
						!isReply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => startReply(c),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								color: "#888",
								fontSize: 12,
								padding: 0,
								marginLeft: 4
							},
							children: "💬 Reply"
						}),
						!isReply && c.replies?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setExpandedReplies((prev) => ({
								...prev,
								[c.id]: !prev[c.id]
							})),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								color: "#6c63ff",
								fontSize: 12,
								padding: 0
							},
							children: expandedReplies[c.id] ? "▲ Hide" : `▼ ${c.replies.length} repl${c.replies.length === 1 ? "y" : "ies"}`
						})
					]
				}),
				!isReply && expandedReplies[c.id] && (c.replies || []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, {
					c: r,
					isReply: true,
					parentId: c.id
				}, r.id))
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1e3,
			display: "flex",
			flexDirection: "column",
			justifyContent: "flex-end"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			style: {
				position: "absolute",
				inset: 0,
				background: "rgba(0,0,0,0.7)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "relative",
				background: "#1a1a2e",
				borderRadius: "24px 24px 0 0",
				maxHeight: "75vh",
				display: "flex",
				flexDirection: "column",
				zIndex: 1001
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "12px 16px 0",
						flexShrink: 0
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 40,
						height: 4,
						background: "#444",
						borderRadius: 99,
						margin: "0 auto 12px"
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 12
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#fff",
								fontWeight: 700,
								fontSize: 16
							},
							children: ["💬 Comments ", list.length > 0 && `(${list.length})`]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							style: {
								background: "rgba(255,255,255,0.1)",
								border: "none",
								borderRadius: "50%",
								width: 30,
								height: 30,
								color: "#fff",
								cursor: "pointer"
							},
							children: "✕"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						overflowY: "auto",
						padding: "0 16px 8px"
					},
					children: [
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#666",
								textAlign: "center",
								padding: 32
							},
							children: "Loading..."
						}),
						!loading && list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#555",
								textAlign: "center",
								padding: 40
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 36,
									marginBottom: 8
								},
								children: "💬"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "No comments yet. Be first!" })]
						}),
						list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, { c }, c.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "8px 16px 32px",
						borderTop: "1px solid rgba(255,255,255,0.07)",
						flexShrink: 0
					},
					children: [replyingTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 6,
							padding: "4px 10px",
							background: "rgba(108,99,255,0.15)",
							borderRadius: 8
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: {
								color: "#aaa",
								fontSize: 12
							},
							children: ["Replying to ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: { color: "#ff6b6b" },
								children: ["@", replyingTo.username]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: cancelReply,
							style: {
								background: "none",
								border: "none",
								color: "#666",
								cursor: "pointer",
								fontSize: 14
							},
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 8,
							alignItems: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							value: text,
							onChange: (e) => setText(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && post(),
							placeholder: currentUser ? replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..." : "Log in to comment...",
							style: {
								flex: 1,
								background: "rgba(255,255,255,0.08)",
								border: "1px solid rgba(255,255,255,0.12)",
								borderRadius: 20,
								padding: "8px 14px",
								color: "#fff",
								fontSize: 14,
								outline: "none"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: post,
							disabled: posting,
							style: {
								background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
								border: "none",
								borderRadius: "50%",
								width: 36,
								height: 36,
								color: "#fff",
								cursor: "pointer",
								fontSize: 16
							},
							children: "➤"
						})]
					})]
				})
			]
		})]
	});
}
function GoLiveModal({ currentUser, onClose, onUploaded }) {
	const [phase, setPhase] = (0, import_react.useState)("preview");
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [caption, setCaption] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [chunks, setChunks] = (0, import_react.useState)([]);
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const recorderRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		startCamera();
		return () => stopCamera();
	}, []);
	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user" },
				audio: true
			});
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
		if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
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
		timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1e3);
	};
	const stopLive = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
		setPhase("uploading");
		setTimeout(() => uploadLive(), 800);
	};
	const uploadLive = async () => {
		try {
			const mimeType = chunksRef.current[0]?.type || "video/webm";
			const ext = mimeType.includes("mp4") ? "mp4" : "webm";
			const blob = new Blob(chunksRef.current, { type: mimeType });
			const file = new File([blob], `live_${Date.now()}.${ext}`, { type: mimeType });
			const file_url = await uploadFile(file);
			let thumbUrl = "";
			try {
				const thumbBlob = await captureThumbnail(file);
				thumbUrl = await uploadFile(new File([thumbBlob], "thumb.jpg", { type: "image/jpeg" }));
			} catch (_) {}
			const liveGeo = await getPostLocation();
			await videos.create({
				user_id: currentUser.id,
				username: currentUser.username || currentUser.email?.split("@")[0] || "user",
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
		return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			background: "#000",
			zIndex: 9e3,
			display: "flex",
			flexDirection: "column"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
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
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				height: 120,
				background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
				pointerEvents: "none"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				bottom: 0,
				left: 0,
				right: 0,
				height: 200,
				background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
				pointerEvents: "none"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
			}),
			phase === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 16,
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					alignItems: "center",
					gap: 8,
					zIndex: 100
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						background: "#e53935",
						borderRadius: 6,
						padding: "3px 10px",
						color: "#fff",
						fontWeight: 800,
						fontSize: 13,
						letterSpacing: 1,
						boxShadow: "0 0 12px rgba(229,57,53,0.8)",
						animation: "livePulse 1.2s ease infinite"
					},
					children: "🔴 LIVE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						background: "rgba(0,0,0,0.6)",
						borderRadius: 6,
						padding: "3px 10px",
						color: "#fff",
						fontWeight: 700,
						fontSize: 13,
						backdropFilter: "blur(4px)"
					},
					children: formatElapsed(elapsed)
				})]
			}),
			(phase === "preview" || phase === "live") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					bottom: 160,
					left: 16,
					right: 16,
					zIndex: 100
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
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
				},
				children: error
			}),
			phase === "uploading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					background: "rgba(0,0,0,0.75)",
					zIndex: 150,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 16
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { fontSize: 48 },
						children: "📤"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontSize: 18,
							fontWeight: 700
						},
						children: "Uploading your live..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "rgba(255,255,255,0.6)",
							fontSize: 13
						},
						children: "This may take a moment"
					})
				]
			}),
			phase === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					background: "rgba(0,0,0,0.85)",
					zIndex: 150,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 16
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { fontSize: 56 },
					children: "✅"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#fff",
						fontSize: 20,
						fontWeight: 800
					},
					children: "Posted to feed!"
				})]
			}),
			phase === "preview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 60,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 100
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "rgba(255,255,255,0.7)",
						fontSize: 12,
						textAlign: "center",
						marginTop: 8
					},
					children: "Tap to Go Live"
				})]
			}),
			phase === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 60,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 100
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "rgba(255,255,255,0.7)",
						fontSize: 12,
						textAlign: "center",
						marginTop: 8
					},
					children: "Tap to Stop & Post"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes livePulse {
          0%, 100% { opacity:1; box-shadow: 0 0 12px rgba(229,57,53,0.8); }
          50% { opacity:0.7; box-shadow: 0 0 24px rgba(229,57,53,1); }
        }
      ` })
		]
	});
}
function VideoEditor({ file, onDone, onSkip }) {
	const videoRef = (0, import_react.useRef)(null);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [trimStart, setTrimStart] = (0, import_react.useState)(0);
	const [trimEnd, setTrimEnd] = (0, import_react.useState)(0);
	const [currentTime, setCurrentTime] = (0, import_react.useState)(0);
	const [trimming, setTrimming] = (0, import_react.useState)(false);
	const [activeMode, setActiveMode] = (0, import_react.useState)(null);
	const [textOverlays, setTextOverlays] = (0, import_react.useState)([]);
	const [showTextInput, setShowTextInput] = (0, import_react.useState)(false);
	const [textInputVal, setTextInputVal] = (0, import_react.useState)("");
	const [textColor, setTextColor] = (0, import_react.useState)("#ffffff");
	const [textBg, setTextBg] = (0, import_react.useState)("none");
	const [textSize, setTextSize] = (0, import_react.useState)(22);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(true);
	const previewUrl = (0, import_react.useMemo)(() => URL.createObjectURL(file), [file]);
	(0, import_react.useEffect)(() => {
		return () => URL.revokeObjectURL(previewUrl);
	}, [previewUrl]);
	const onMeta = () => {
		const dur = videoRef.current?.duration || 0;
		setDuration(dur);
		setTrimEnd(dur);
	};
	const onTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime || 0);
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
	const removeOverlay = (id) => setTextOverlays((prev) => prev.filter((o) => o.id !== id));
	const doPost = async () => {
		setTrimming(true);
		if (trimStart <= .5 && trimEnd >= duration - .5) {
			onDone(file, textOverlays);
			return;
		}
		try {
			const video = document.createElement("video");
			video.src = previewUrl;
			video.muted = true;
			await new Promise((r) => {
				video.onloadedmetadata = r;
				video.load();
			});
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			const stream = canvas.captureStream(30);
			const mimeType = "video/webm";
			const recorder = new MediaRecorder(stream, {
				mimeType,
				videoBitsPerSecond: 4e6
			});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 3e3,
			background: "#000",
			display: "flex",
			flexDirection: "column",
			userSelect: "none"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 10,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "16px 18px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onSkip,
						style: {
							width: 36,
							height: 36,
							borderRadius: "50%",
							background: "rgba(0,0,0,0.5)",
							border: "1.5px solid rgba(255,255,255,0.25)",
							color: "#fff",
							fontSize: 18,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						},
						children: "✕"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 8
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								background: "rgba(0,0,0,0.55)",
								border: "1.5px solid rgba(255,255,255,0.25)",
								borderRadius: 20,
								padding: "7px 14px",
								color: "#fff",
								fontSize: 13,
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								gap: 6,
								backdropFilter: "blur(8px)"
							},
							children: "🎵 Add sound"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 36 } })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					flex: 1,
					position: "relative",
					overflow: "hidden"
				},
				onClick: activeMode ? void 0 : togglePlay,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						src: previewUrl,
						onLoadedMetadata: onMeta,
						onTimeUpdate,
						style: {
							width: "100%",
							height: "100%",
							objectFit: "cover"
						},
						autoPlay: true,
						loop: true,
						playsInline: true
					}),
					textOverlays.map((ov) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							top: `${ov.y}%`,
							left: `${ov.x}%`,
							transform: "translate(-50%,-50%)",
							color: ov.color,
							fontSize: ov.size,
							fontWeight: 900,
							letterSpacing: .5,
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
					}, ov.id)),
					!isPlaying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							inset: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							pointerEvents: "none"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 70,
								height: 70,
								borderRadius: "50%",
								background: "rgba(0,0,0,0.5)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 30
							},
							children: "▶"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					right: 14,
					top: "50%",
					transform: "translateY(-50%)",
					display: "flex",
					flexDirection: "column",
					gap: 20,
					zIndex: 10
				},
				children: [{
					icon: "T",
					label: "Text",
					mode: "text"
				}, {
					icon: "✂️",
					label: "Trim",
					mode: "trim"
				}].map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => {
						setActiveMode((m) => m === tool.mode ? null : tool.mode);
					},
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 4,
						cursor: "pointer"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
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
						},
						children: tool.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontSize: 10,
							fontWeight: 700,
							textShadow: "0 1px 4px rgba(0,0,0,0.9)"
						},
						children: tool.label
					})]
				}, tool.mode))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 10,
					padding: "0 20px 40px"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						justifyContent: "center",
						gap: 18,
						marginBottom: 20
					},
					children: [
						{ label: "10m" },
						{ label: "60s" },
						{ label: "15s" },
						{
							label: "PHOTO",
							active: false
						},
						{
							label: "TEXT",
							action: "text"
						}
					].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						onClick: () => m.action === "text" ? (setActiveMode("text"), setShowTextInput(true)) : null,
						style: {
							color: m.action === "text" && activeMode === "text" ? "#F5C842" : "#fff",
							fontWeight: m.action === "text" ? 900 : 600,
							fontSize: m.action === "text" ? 16 : 14,
							opacity: m.action === "text" ? 1 : .7,
							cursor: m.action ? "pointer" : "default",
							padding: m.action === "text" ? "4px 10px" : "4px 0",
							borderBottom: m.action === "text" && activeMode === "text" ? "2px solid #F5C842" : "none",
							textShadow: "0 1px 6px rgba(0,0,0,0.9)"
						},
						children: m.label
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						letterSpacing: .5,
						boxShadow: "0 4px 20px rgba(255,107,107,0.4)"
					},
					children: trimming ? "Processing..." : "Next →"
				})]
			}),
			activeMode === "trim" && duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 140,
					left: 0,
					right: 0,
					zIndex: 15,
					background: "rgba(15,15,26,0.95)",
					borderRadius: "20px 20px 0 0",
					padding: "20px 20px 10px",
					backdropFilter: "blur(16px)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							color: "#fff",
							fontWeight: 800,
							fontSize: 15,
							marginBottom: 14,
							textAlign: "center"
						},
						children: [
							"✂️ Trim — ",
							fmtTime(trimStart),
							" to ",
							fmtTime(trimEnd)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginBottom: 12 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#aaa",
								fontSize: 11,
								marginBottom: 4
							},
							children: ["Start: ", fmtTime(trimStart)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: duration,
							step: .1,
							value: trimStart,
							onChange: (e) => {
								const v = Math.min(parseFloat(e.target.value), trimEnd - 1);
								setTrimStart(v);
								if (videoRef.current) videoRef.current.currentTime = v;
							},
							style: {
								width: "100%",
								accentColor: "#ff6b6b"
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							color: "#aaa",
							fontSize: 11,
							marginBottom: 4
						},
						children: ["End: ", fmtTime(trimEnd)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: duration,
						step: .1,
						value: trimEnd,
						onChange: (e) => {
							const v = Math.max(parseFloat(e.target.value), trimStart + 1);
							setTrimEnd(v);
							if (videoRef.current) videoRef.current.currentTime = v;
						},
						style: {
							width: "100%",
							accentColor: "#ff6b6b"
						}
					})] })
				]
			}),
			(activeMode === "text" || showTextInput) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 20,
					background: "rgba(0,0,0,0.75)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: 24
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
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
						},
						children: textInputVal || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: { opacity: .3 },
							children: "Start typing..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: textInputVal,
						onChange: (e) => setTextInputVal(e.target.value),
						placeholder: "Type something...",
						style: {
							width: "100%",
							maxWidth: 400,
							background: "rgba(255,255,255,0.12)",
							border: "2px solid rgba(255,255,255,0.3)",
							borderRadius: 14,
							padding: "14px 16px",
							color: "#fff",
							fontSize: 16,
							outline: "none",
							marginBottom: 16,
							textAlign: "center"
						},
						onKeyDown: (e) => e.key === "Enter" && addTextOverlay()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 10,
							marginBottom: 14
						},
						children: [
							"#ffffff",
							"#000000",
							"#FF6B6B",
							"#F5C842",
							"#00E5FF",
							"#FF69B4",
							"#7CFC00",
							"#FF8C00"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							width: "100%",
							maxWidth: 400,
							marginBottom: 14
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#aaa",
								fontSize: 11,
								marginBottom: 6,
								textAlign: "center"
							},
							children: [
								"Size: ",
								textSize,
								"px"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 14,
							max: 48,
							step: 1,
							value: textSize,
							onChange: (e) => setTextSize(parseInt(e.target.value)),
							style: {
								width: "100%",
								accentColor: "#F5C842"
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 10,
							marginBottom: 20
						},
						children: [
							{
								v: "none",
								l: "No BG"
							},
							{
								v: "dark",
								l: "Dark BG"
							},
							{
								v: "colored",
								l: "Color BG"
							}
						].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						}, b.v))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 12,
							width: "100%",
							maxWidth: 400
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setShowTextInput(false);
								setActiveMode(null);
								setTextInputVal("");
							},
							style: {
								flex: 1,
								padding: "13px 0",
								background: "rgba(255,255,255,0.1)",
								border: "none",
								borderRadius: 14,
								color: "#aaa",
								fontWeight: 700,
								fontSize: 15,
								cursor: "pointer"
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addTextOverlay,
							style: {
								flex: 2,
								padding: "13px 0",
								background: "linear-gradient(135deg,#F5C842,#FF9500)",
								border: "none",
								borderRadius: 14,
								color: "#000",
								fontWeight: 900,
								fontSize: 15,
								cursor: "pointer"
							},
							children: "✓ Add Text"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#666",
							fontSize: 11,
							marginTop: 12
						},
						children: "Tap a text overlay on video to remove it"
					})
				]
			}),
			trimming && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					background: "rgba(0,0,0,0.85)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 30
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 40,
						marginBottom: 16
					},
					children: "⚙️"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#fff",
						fontWeight: 700,
						fontSize: 16
					},
					children: "Processing video..."
				})]
			})
		]
	});
}
function UploadModal({ currentUser, onClose, onUploaded }) {
	const [file, setFile] = (0, import_react.useState)(null);
	const [editedFile, setEditedFile] = (0, import_react.useState)(null);
	const [showEditor, setShowEditor] = (0, import_react.useState)(false);
	const [uploadTab, setUploadTab] = (0, import_react.useState)("video");
	const [photos, setPhotos] = (0, import_react.useState)([]);
	const photoRef = (0, import_react.useRef)();
	const [caption, setCaption] = (0, import_react.useState)("");
	const [isMature, setIsMature] = (0, import_react.useState)(false);
	const [matureReason, setMatureReason] = (0, import_react.useState)("other");
	const [maxDuration, setMaxDuration] = (0, import_react.useState)(60);
	const [selectedTrack, setSelectedTrack] = (0, import_react.useState)(null);
	const [showMusicPicker, setShowMusicPicker] = (0, import_react.useState)(false);
	const [musicGenreFilter, setMusicGenreFilter] = (0, import_react.useState)("All");
	const [previewTrack, setPreviewTrack] = (0, import_react.useState)(null);
	const previewAudioRef = (0, import_react.useRef)(null);
	const [musicTracks, setMusicTracks] = (0, import_react.useState)([]);
	const [musicLoading, setMusicLoading] = (0, import_react.useState)(false);
	const [musicSearch, setMusicSearch] = (0, import_react.useState)("");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [step, setStep] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)();
	const [notAiConfirmed, setNotAiConfirmed] = (0, import_react.useState)(false);
	const [aiBlocked, setAiBlocked] = (0, import_react.useState)(false);
	const [isAiGenerated, setIsAiGenerated] = (0, import_react.useState)(false);
	const [textPostContent, setTextPostContent] = (0, import_react.useState)("");
	const [textPostTemplate, setTextPostTemplate] = (0, import_react.useState)(0);
	const [showPostDetails, setShowPostDetails] = (0, import_react.useState)(false);
	const [postTitle, setPostTitle] = (0, import_react.useState)("");
	const [postVisibility, setPostVisibility] = (0, import_react.useState)("everyone");
	const [postLocation, setPostLocation] = (0, import_react.useState)(null);
	const [detectingLocation, setDetectingLocation] = (0, import_react.useState)(false);
	const [showVisibilityPicker, setShowVisibilityPicker] = (0, import_react.useState)(false);
	const checkForExplicitContent = (f, cap) => {
		const explicit = [
			"nude",
			"naked",
			"nsfw",
			"xxx",
			"porn",
			"sex",
			"explicit",
			"adult only",
			"18+",
			"onlyfans",
			"erotic"
		];
		const name = f.name.toLowerCase();
		const capLower = (cap || "").toLowerCase();
		return explicit.some((kw) => name.includes(kw) || capLower.includes(kw));
	};
	const checkForAiSignatures = (f, cap) => {
		const name = f.name.toLowerCase();
		const capLower = (cap || "").toLowerCase();
		const combined = name + " " + capLower;
		return [
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
		].some((kw) => combined.includes(kw));
	};
	const [explicitBlocked, setExplicitBlocked] = (0, import_react.useState)(false);
	const handlePhotoSelect = (e) => {
		const files = Array.from(e.target.files);
		if (!files.length) return;
		setPhotos((prev) => {
			return [...prev, ...files].slice(0, 6);
		});
	};
	const removePhoto = (idx) => setPhotos((p) => p.filter((_, i) => i !== idx));
	const uploadPhotos = async () => {
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
			const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
			const tags = (caption.match(/#\w+/g) || []).map((t) => t.toLowerCase());
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
				post_location_name: postLocation?.name || null,
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
				const v = document.createElement("video");
				v.preload = "metadata";
				v.onloadedmetadata = () => {
					URL.revokeObjectURL(v.src);
					res(v.duration);
				};
				v.onerror = rej;
				v.src = URL.createObjectURL(file);
			});
			if (dur > maxDuration) {
				alert(`⚠️ Your video is ${Math.round(dur)}s long. The limit for this format is ${maxDuration === 600 ? "10 minutes" : maxDuration + " seconds"}. Please trim it and try again.`);
				return;
			}
		} catch {}
		setUploading(true);
		setProgress(10);
		try {
			setStep("Uploading video...");
			const video_url = await uploadFile(editedFile || file);
			setProgress(60);
			setStep("Generating thumbnail...");
			let thumbnail_url = null;
			try {
				thumbnail_url = await Promise.race([captureThumbnail(file), new Promise((r) => setTimeout(() => r(null), 5e3))]);
			} catch {}
			setProgress(80);
			setStep("Saving to feed...");
			const videoGeo = await getPostLocation();
			const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
			const tags = (caption.match(/#\w+/g) || []).map((t) => t.toLowerCase());
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
				post_location_name: postLocation?.name || null,
				sound_title: selectedTrack?.title || null,
				sound_artist: selectedTrack?.artist || null,
				sound_url: selectedTrack?.url || null,
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
	const JAMENDO_CLIENT_ID = "c9f4d87f";
	const GENRE_TAG_MAP = {
		"All": "",
		"Lo-Fi": "lounge",
		"Hip-Hop": "hiphop",
		"Electronic": "electronic",
		"R&B": "rnb",
		"Pop": "pop",
		"Chill": "relaxation",
		"Afrobeats": "afrobeats",
		"Jazz": "jazz",
		"Rock": "rock",
		"Acoustic": "acoustic",
		"Classical": "classical"
	};
	const GENRE_EMOJI = {
		"lounge": "🌆",
		"hiphop": "🔥",
		"electronic": "⚡",
		"rnb": "❤️",
		"pop": "🌈",
		"relaxation": "🌊",
		"afrobeats": "🌍",
		"jazz": "🎷",
		"rock": "🎸",
		"acoustic": "🎸",
		"classical": "🎻"
	};
	const fetchMusicTracks = async (genre = "All", search = "") => {
		setMusicLoading(true);
		setMusicTracks([]);
		try {
			const tag = GENRE_TAG_MAP[genre] || "";
			let apiUrl = `https://sachi-c7f0261c.base44.app/api/functions/getMusicTracks?genre=${encodeURIComponent(genre)}&limit=30`;
			if (search) apiUrl += `&search=${encodeURIComponent(search)}`;
			console.log("[Sachi Music] Fetching via proxy:", apiUrl);
			let tracks = [];
			try {
				const resp = await fetch(apiUrl);
				if (resp.ok) {
					tracks = (await resp.json()).tracks || [];
					console.log("[Sachi Music] Proxy results:", tracks.length);
				}
			} catch (proxyErr) {
				console.warn("[Sachi Music] Proxy failed, trying direct:", proxyErr);
			}
			if (tracks.length === 0) {
				let directUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=30&order=popularity_week&include=musicinfo&audioformat=mp31&imagesize=100`;
				if (tag) directUrl += `&tags=${encodeURIComponent(tag)}`;
				if (search) directUrl += `&namesearch=${encodeURIComponent(search)}`;
				console.log("[Sachi Music] Trying direct:", directUrl);
				const resp2 = await fetch(directUrl);
				if (resp2.ok) {
					tracks = ((await resp2.json()).results || []).map((t) => ({
						id: `j_${t.id}`,
						title: t.name,
						artist: t.artist_name,
						url: t.audio || t.audiodownload,
						genre: genre === "All" ? t.musicinfo?.tags?.genres?.[0] || "Music" : genre,
						emoji: GENRE_EMOJI[tag] || "🎵",
						duration: t.duration,
						image: t.image
					})).filter((t) => t.url);
					console.log("[Sachi Music] Direct results:", tracks.length);
				}
			}
			if (tracks.length > 0) setMusicTracks(tracks);
			else throw new Error("No tracks from any source");
		} catch (e) {
			console.error("[Sachi Music] All sources failed:", e);
			const fallback = MUSIC_TRACKS.filter((t) => genre === "All" || t.genre === genre);
			setMusicTracks(fallback.length > 0 ? fallback : MUSIC_TRACKS);
		}
		setMusicLoading(false);
	};
	const detectLocation = async () => {
		setDetectingLocation(true);
		try {
			const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8e3 }));
			const addr = (await (await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)).json()).address || {};
			const city = addr.city || addr.town || addr.county || addr.state || "";
			setPostLocation({
				name: addr.suburb || addr.neighbourhood || addr.district || city,
				city
			});
		} catch {
			setPostLocation(null);
		}
		setDetectingLocation(false);
	};
	const goToPostDetails = () => {
		if (!postLocation && navigator.geolocation) detectLocation();
		setShowPostDetails(true);
	};
	const uploadTextPost = async () => {
		if (!textPostContent.trim()) {
			alert("Please write something first!");
			return;
		}
		setUploading(true);
		setProgress(10);
		try {
			setStep("Creating text post...");
			const UPLOAD_TPLS = [
				{
					bg: ["#f8b4cb", "#f8b4cb"],
					style: "highlight",
					hlColor: "#e91e8c",
					textColor: "#111",
					emoji: "😊",
					emojiTop: true
				},
				{
					bg: ["#b8d4f0", "#d6e8ff"],
					style: "highlight",
					hlColor: "#F5C842",
					textColor: "#222",
					emoji: "",
					emojiTop: false
				},
				{
					bg: ["#0B0C1A", "#1a1040"],
					style: "plain",
					textColor: "#F5C842",
					emoji: "🌸",
					emojiTop: true
				},
				{
					bg: ["#d8e8f5", "#eaf2ff"],
					style: "plain",
					textColor: "#4a6fa5",
					emoji: "",
					emojiTop: false
				},
				{
					bg: ["#111111", "#111111"],
					style: "plain",
					textColor: "#ffffff",
					emoji: "🌙",
					emojiTop: true
				},
				{
					bg: ["#FF416C", "#FF9500"],
					style: "plain",
					textColor: "#ffffff",
					emoji: "🌅",
					emojiTop: true
				},
				{
					bg: ["#0F2027", "#2C5364"],
					style: "plain",
					textColor: "#00E5FF",
					emoji: "🌊",
					emojiTop: true
				},
				{
					bg: ["#1a1a1a", "#2d1a00"],
					style: "plain",
					textColor: "#F5C842",
					emoji: "✨",
					emojiTop: true
				}
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
			for (const w of allWords) {
				const test = curLine ? curLine + " " + w : w;
				if (ctx.measureText(test).width > maxW && curLine) {
					lines.push(curLine);
					curLine = w;
				} else curLine = test;
			}
			if (curLine) lines.push(curLine);
			const totalTextH = lines.length * lineH;
			const emojiH = tpl.emoji ? 90 : 0;
			const emojiGap = tpl.emoji ? 24 : 0;
			let startY = (960 - (emojiH + emojiGap + totalTextH)) / 2;
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
				lines.forEach((l, i) => {
					const tw = ctx.measureText(l).width;
					const rx = 36, ry = startY + i * lineH - padY;
					ctx.fillStyle = tpl.hlColor;
					ctx.beginPath();
					ctx.roundRect ? ctx.roundRect(rx, ry, tw + padX * 2, fontSize + padY * 2, 6) : ctx.rect(rx, ry, tw + padX * 2, fontSize + padY * 2);
					ctx.fill();
					ctx.fillStyle = tpl.textColor;
					ctx.textAlign = "left";
					ctx.fillText(l, rx + padX, startY + i * lineH);
				});
			} else {
				ctx.textAlign = "center";
				ctx.shadowColor = tpl.bg[0] === "#ffffff" ? "transparent" : "rgba(0,0,0,0.3)";
				ctx.shadowBlur = 10;
				lines.forEach((l, i) => {
					ctx.fillStyle = tpl.textColor;
					ctx.fillText(l, 270, startY + i * lineH);
				});
			}
			ctx.font = "700 18px Arial";
			ctx.fillStyle = "rgba(0,0,0,0.15)";
			ctx.textAlign = "right";
			ctx.shadowColor = "transparent";
			ctx.shadowBlur = 0;
			ctx.fillText("sachi™", 520, 930);
			setProgress(30);
			const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", .92));
			const imgFile = new File([blob], `textpost_${Date.now()}.jpg`, { type: "image/jpeg" });
			setStep("Uploading...");
			const img_url = await uploadFile(imgFile);
			setProgress(75);
			setStep("Posting...");
			const textGeo = await getPostLocation();
			const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
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
				hashtags: (textPostContent.match(/#\w+/g) || []).map((t) => t.toLowerCase()),
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
				post_location_name: postLocation?.name || null,
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		showEditor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoEditor, {
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
		}),
		showPostDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 3500,
				background: "#0B0C1A",
				display: "flex",
				flexDirection: "column"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "16px 20px",
						borderBottom: "1px solid rgba(255,255,255,0.08)"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowPostDetails(false),
							style: {
								background: "none",
								border: "none",
								color: "#fff",
								fontSize: 22,
								cursor: "pointer",
								lineHeight: 1
							},
							children: "‹"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 800,
								fontSize: 17
							},
							children: "Post details"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 32 } })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						overflowY: "auto",
						padding: "20px 20px 40px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { marginBottom: 20 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#555",
									fontSize: 12,
									marginTop: 6
								},
								children: "Writing a title helps get 3× more views on average"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { marginBottom: 20 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
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
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							height: 1,
							background: "rgba(255,255,255,0.06)",
							marginBottom: 20
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { marginBottom: 4 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "14px 0",
									cursor: "pointer"
								},
								onClick: detectLocation,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 12
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { fontSize: 20 },
										children: "📍"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#fff",
											fontWeight: 700,
											fontSize: 15
										},
										children: "Location"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 8
									},
									children: [
										detectingLocation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: "#888",
												fontSize: 12
											},
											children: "Detecting..."
										}),
										postLocation && !detectingLocation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: "#aaa",
												fontSize: 13
											},
											children: postLocation.name || postLocation.city
										}),
										!postLocation && !detectingLocation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: "#555",
												fontSize: 13
											},
											children: "Tap to add"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: "#555",
												fontSize: 18
											},
											children: "›"
										})
									]
								})]
							}), postLocation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									gap: 8,
									paddingBottom: 12,
									flexWrap: "wrap"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										background: "rgba(255,255,255,0.07)",
										borderRadius: 20,
										padding: "5px 12px",
										fontSize: 13,
										color: "#ccc",
										display: "flex",
										alignItems: "center",
										gap: 6
									},
									children: [
										"📍 ",
										postLocation.name || postLocation.city,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											onClick: () => setPostLocation(null),
											style: {
												cursor: "pointer",
												color: "#888",
												fontSize: 14,
												marginLeft: 4
											},
											children: "✕"
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							height: 1,
							background: "rgba(255,255,255,0.06)",
							marginBottom: 4
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								padding: "14px 0",
								cursor: "pointer"
							},
							onClick: () => setShowVisibilityPicker((v) => !v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 12
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { fontSize: 20 },
										children: "🌐"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#fff",
											fontWeight: 700,
											fontSize: 15
										},
										children: "Who can view"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 8
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#aaa",
											fontSize: 13
										},
										children: postVisibility === "everyone" ? "Everyone" : postVisibility === "followers" ? "Followers only" : "Only me"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#555",
											fontSize: 18
										},
										children: showVisibilityPicker ? "▾" : "›"
									})]
								})]
							}), showVisibilityPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 12,
									background: "rgba(255,255,255,0.04)",
									borderRadius: 14,
									overflow: "hidden"
								},
								children: [
									{
										val: "everyone",
										icon: "🌐",
										label: "Everyone",
										sub: "Anyone on Sachi can see this"
									},
									{
										val: "followers",
										icon: "👥",
										label: "Followers only",
										sub: "Only people who follow you"
									},
									{
										val: "only_me",
										icon: "🔒",
										label: "Only me",
										sub: "Saved privately, not shown in feed"
									}
								].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: (e) => {
										e.stopPropagation();
										setPostVisibility(v.val);
										setShowVisibilityPicker(false);
									},
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										padding: "14px 16px",
										borderBottom: "1px solid rgba(255,255,255,0.05)",
										cursor: "pointer",
										background: postVisibility === v.val ? "rgba(245,200,66,0.07)" : "transparent"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 12
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { fontSize: 20 },
											children: v.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 700,
												fontSize: 14
											},
											children: v.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#666",
												fontSize: 11
											},
											children: v.sub
										})] })]
									}), postVisibility === v.val && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#F5C842",
											fontSize: 18
										},
										children: "✓"
									})]
								}, v.val))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							height: 1,
							background: "rgba(255,255,255,0.06)",
							marginBottom: 24
						} }),
						uploadTab !== "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "4px 0",
								marginBottom: 20
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 12
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { fontSize: 20 },
									children: "🔞"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#fff",
										fontWeight: 700,
										fontSize: 15
									},
									children: "Mature content"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#555",
										fontSize: 11
									},
									children: "18+ viewers only"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: () => setIsMature((m) => !m),
								style: {
									width: 48,
									height: 26,
									borderRadius: 13,
									background: isMature ? "#ff6b6b" : "rgba(255,255,255,0.12)",
									position: "relative",
									cursor: "pointer",
									transition: "background 0.2s"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
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
							})]
						}),
						uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { marginBottom: 20 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#aaa",
									fontSize: 13,
									marginBottom: 8
								},
								children: step
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									background: "rgba(255,255,255,0.08)",
									borderRadius: 99,
									height: 6,
									overflow: "hidden"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									height: "100%",
									width: `${progress}%`,
									background: "linear-gradient(90deg,#ff6b6b,#ff8e53)",
									borderRadius: 99,
									transition: "width 0.4s ease"
								} })
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "12px 20px 40px",
						display: "flex",
						gap: 12,
						borderTop: "1px solid rgba(255,255,255,0.06)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (uploadTab === "text") uploadTextPost();
							else if (uploadTab === "photo") uploadPhotos();
							else upload();
						},
						disabled: uploading,
						style: {
							flex: 2.5,
							padding: "14px 0",
							background: uploading ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff8e53)",
							border: "none",
							borderRadius: 14,
							color: "#fff",
							fontWeight: 900,
							fontSize: 16,
							cursor: uploading ? "default" : "pointer",
							boxShadow: "0 4px 20px rgba(255,107,107,0.35)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 8
						},
						children: uploading ? step : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: { fontSize: 18 },
							children: "⬆"
						}), " Post"] })
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 2e3,
				display: "flex",
				alignItems: "flex-end",
				justifyContent: "center"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: onClose,
				style: {
					position: "absolute",
					inset: 0,
					background: "rgba(0,0,0,0.85)"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
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
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						overflowY: "auto",
						flex: 1,
						padding: "24px 24px 32px",
						WebkitOverflowScrolling: "touch"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: 40,
							height: 4,
							background: "#444",
							borderRadius: 99,
							margin: "0 auto 20px"
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 16
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#fff",
									fontWeight: 800,
									fontSize: 20
								},
								children: uploadTab === "video" ? "📹 Post a Video" : uploadTab === "photo" ? "🖼️ Post Photos" : "✏️ Text Post"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onClose,
								style: {
									background: "rgba(255,255,255,0.1)",
									border: "none",
									borderRadius: "50%",
									width: 32,
									height: 32,
									color: "#fff",
									cursor: "pointer"
								},
								children: "✕"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								gap: 8,
								marginBottom: 18,
								background: "rgba(255,255,255,0.05)",
								borderRadius: 14,
								padding: 4
							},
							children: [
								{
									id: "video",
									label: "🎬 Video"
								},
								{
									id: "photo",
									label: "🖼️ Photos"
								},
								{
									id: "text",
									label: "✏️ Text"
								}
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setUploadTab(t.id);
									setFile(null);
									setPhotos([]);
								},
								style: {
									flex: 1,
									padding: "10px 0",
									borderRadius: 11,
									border: "none",
									background: uploadTab === t.id ? t.id === "text" ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "transparent",
									color: uploadTab === t.id ? "#fff" : "#888",
									fontWeight: 800,
									fontSize: 13,
									cursor: "pointer"
								},
								children: t.label
							}, t.id))
						}),
						uploadTab !== "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { marginBottom: 16 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#aaa",
										fontSize: 12,
										fontWeight: 600,
										marginBottom: 8,
										textTransform: "uppercase",
										letterSpacing: 1
									},
									children: "Video Length"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										display: "flex",
										gap: 8
									},
									children: [
										{
											label: "15s",
											val: 15,
											icon: "⚡"
										},
										{
											label: "60s",
											val: 60,
											icon: "🎬"
										},
										{
											label: "10 min",
											val: 600,
											icon: "🎥"
										}
									].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { fontSize: 18 },
											children: opt.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt.label })]
									}, opt.val))
								})]
							}),
							uploadTab === "photo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { marginBottom: 16 },
								children: [
									photos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "grid",
											gridTemplateColumns: "repeat(3,1fr)",
											gap: 6,
											marginBottom: 12
										},
										children: [photos.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												position: "relative",
												aspectRatio: "1",
												borderRadius: 10,
												overflow: "hidden",
												border: "2px solid rgba(255,107,107,0.3)"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: URL.createObjectURL(p),
													style: {
														width: "100%",
														height: "100%",
														objectFit: "cover"
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
												}),
												i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														position: "absolute",
														bottom: 4,
														left: 4,
														background: "rgba(255,107,107,0.85)",
														borderRadius: 6,
														padding: "1px 6px",
														fontSize: 10,
														color: "#fff",
														fontWeight: 700
													},
													children: "Cover"
												})
											]
										}, i)), photos.length < 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => photoRef.current?.click(),
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { fontSize: 24 },
												children: "＋"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add more" })]
										})]
									}),
									photos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => photoRef.current?.click(),
										style: {
											border: "2px dashed rgba(255,107,107,0.4)",
											borderRadius: 16,
											padding: 40,
											textAlign: "center",
											cursor: "pointer"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													fontSize: 48,
													marginBottom: 10
												},
												children: "🖼️"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													color: "#fff",
													fontWeight: 700,
													fontSize: 16,
													marginBottom: 6
												},
												children: "Tap to select photos"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													color: "#666",
													fontSize: 13
												},
												children: "Up to 6 photos · JPG, PNG, HEIC"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: photoRef,
										type: "file",
										accept: "image/*",
										multiple: true,
										style: { display: "none" },
										onChange: handlePhotoSelect
									}),
									photos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											color: "#888",
											fontSize: 12,
											textAlign: "center",
											marginTop: 4
										},
										children: [photos.length, "/6 photos selected · Tap ✕ to remove"]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: !file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => fileRef.current?.click(),
								style: {
									border: "2px dashed rgba(255,107,107,0.4)",
									borderRadius: 16,
									padding: 48,
									textAlign: "center",
									cursor: "pointer",
									marginBottom: 16
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: 48,
											marginBottom: 10
										},
										children: "🎬"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#fff",
											fontWeight: 700,
											fontSize: 16,
											marginBottom: 6
										},
										children: "Tap to select video"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#666",
											fontSize: 13
										},
										children: "MP4, MOV, WebM · Max 500MB"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "video/*",
										style: { display: "none" },
										onChange: (e) => {
											const f = e.target.files[0];
											if (!f) return;
											if (f.size > 150 * 1024 * 1024) {
												alert("Video must be under 150MB. Please trim or compress your video before uploading.");
												e.target.value = "";
												return;
											}
											setFile(f);
										}
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									background: "rgba(255,107,107,0.08)",
									border: "1px solid rgba(255,107,107,0.2)",
									borderRadius: 12,
									padding: 14,
									marginBottom: 16,
									display: "flex",
									alignItems: "center",
									gap: 10
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { fontSize: 32 },
										children: "🎥"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { flex: 1 },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 600,
												fontSize: 14
											},
											children: file.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												color: "#888",
												fontSize: 12
											},
											children: [(file.size / 1024 / 1024).toFixed(1), " MB"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setFile(null),
										style: {
											background: "none",
											border: "none",
											color: "#ff6b6b",
											cursor: "pointer",
											fontSize: 18
										},
										children: "✕"
									})
								]
							}) }),
							uploadTab !== "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									position: "relative",
									marginBottom: 16
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: caption,
									onChange: (e) => setCaption(e.target.value.slice(0, 500)),
									placeholder: "Write a caption... #hashtags",
									rows: 3,
									style: {
										width: "100%",
										background: "rgba(255,255,255,0.06)",
										border: `1px solid ${caption.length > 480 ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}`,
										borderRadius: 12,
										padding: 12,
										color: "#fff",
										fontSize: 14,
										resize: "none",
										outline: "none",
										boxSizing: "border-box",
										paddingBottom: 28
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "absolute",
										bottom: 8,
										right: 12,
										fontSize: 11,
										color: caption.length > 480 ? "#ff6b6b" : "#555"
									},
									children: [caption.length, "/500"]
								})]
							}),
							!localStorage.getItem("sachi_country_code") && !localStorage.getItem("sachi_country") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									background: "rgba(245,200,66,0.07)",
									border: "1px solid rgba(245,200,66,0.2)",
									borderRadius: 12,
									padding: "12px 14px",
									marginBottom: 14
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#F5C842",
											fontWeight: 800,
											fontSize: 13,
											marginBottom: 4
										},
										children: "📍 Add your location to this post?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#777",
											fontSize: 11,
											marginBottom: 10
										},
										children: "Posts with location get more reach. Enable once, applies to all future posts."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											if (navigator.geolocation) navigator.geolocation.getCurrentPosition((pos) => {
												fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`).then((r) => r.json()).then((data) => {
													const addr = data.address || {};
													const code = addr.country_code ? addr.country_code.toUpperCase() : null;
													const region = addr.state || addr.city || addr.county || null;
													if (code) localStorage.setItem("sachi_country_code", code);
													if (region) localStorage.setItem("sachi_region", region);
												}).catch(() => {});
											}, () => {}, { timeout: 8e3 });
										},
										style: {
											width: "100%",
											padding: "10px 0",
											background: "linear-gradient(135deg,#F5C842,#FF9500)",
											border: "none",
											borderRadius: 10,
											color: "#0B0C1A",
											fontWeight: 800,
											fontSize: 13,
											cursor: "pointer"
										},
										children: "📍 Enable Location"
									})
								]
							})
						] }),
						uploadTab === "text" && (() => {
							const TEXT_TEMPLATES = [
								{
									name: "Blush",
									id: 0,
									bgStyle: "#f8b4cb",
									render: (text, mini) => {
										const lines = text ? text.split(" ").reduce((acc, w) => {
											const last = acc[acc.length - 1];
											if (last && (last + " " + w).length <= 12) acc[acc.length - 1] = last + " " + w;
											else acc.push(w);
											return acc;
										}, []) : [
											"Hey",
											"happy",
											"Monday"
										];
										const fs = mini ? 11 : 38;
										const pad = mini ? "2px 5px" : "6px 14px";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												gap: mini ? 3 : 8,
												padding: mini ? "8px" : "20px",
												width: "100%"
											},
											children: [
												!mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														fontSize: 36,
														marginBottom: 4
													},
													children: "😊"
												}),
												mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														fontSize: 14,
														marginBottom: 2
													},
													children: "😊"
												}),
												lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														background: "#e91e8c",
														display: "inline-block",
														padding: pad,
														borderRadius: 4
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															fontSize: fs,
															fontWeight: 900,
															color: "#111",
															fontFamily: "'Arial Black',sans-serif",
															lineHeight: 1.1
														},
														children: l
													})
												}, i))
											]
										});
									}
								},
								{
									name: "Note",
									id: 1,
									bgStyle: "linear-gradient(160deg,#b8d4f0,#d6e8ff)",
									render: (text, mini) => {
										const lines = text ? text.split(" ").reduce((acc, w) => {
											const last = acc[acc.length - 1];
											if (last && (last + " " + w).length <= 12) acc[acc.length - 1] = last + " " + w;
											else acc.push(w);
											return acc;
										}, []) : [
											"Hey",
											"happy",
											"Monday"
										];
										const fs = mini ? 10 : 34;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												gap: mini ? 2 : 6,
												padding: mini ? "8px" : "24px",
												width: "100%",
												height: "100%"
											},
											children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													background: "#F5C842",
													display: "inline-block",
													padding: mini ? "1px 5px" : "4px 12px",
													borderRadius: 3,
													transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: fs,
														fontWeight: 900,
														color: "#222",
														fontFamily: "'Arial Black',sans-serif",
														lineHeight: 1.1
													},
													children: l
												})
											}, i))
										});
									}
								},
								{
									name: "Sakura",
									id: 2,
									bgStyle: "linear-gradient(135deg,#0B0C1A,#1a1040)",
									render: (text, mini) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												gap: mini ? 3 : 10,
												padding: mini ? "8px" : "24px",
												width: "100%",
												height: "100%"
											},
											children: [
												!mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														fontSize: 32,
														marginBottom: 4
													},
													children: "🌸"
												}),
												mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: { fontSize: 12 },
													children: "🌸"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: mini ? 9 : 34,
														fontWeight: 900,
														color: "#F5C842",
														fontFamily: "Georgia,serif",
														textAlign: "center",
														lineHeight: 1.3,
														wordBreak: "break-word"
													},
													children: text || "Hey happy Monday"
												})
											]
										});
									}
								},
								{
									name: "Misty",
									id: 3,
									bgStyle: "linear-gradient(160deg,#d8e8f5,#eaf2ff)",
									render: (text, mini) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												padding: mini ? "8px" : "24px",
												width: "100%",
												height: "100%"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: mini ? 9 : 30,
													fontWeight: 700,
													color: "#4a6fa5",
													fontFamily: "Georgia,serif",
													textAlign: "center",
													lineHeight: 1.4,
													wordBreak: "break-word",
													opacity: .85
												},
												children: text || "Hey happy Monday"
											})
										});
									}
								},
								{
									name: "Midnight",
									id: 4,
									bgStyle: "#111111",
									render: (text, mini) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												padding: mini ? "8px" : "24px",
												width: "100%",
												height: "100%"
											},
											children: [
												mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: { fontSize: 12 },
													children: "🌙"
												}),
												!mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														fontSize: 32,
														marginBottom: 8
													},
													children: "🌙"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: mini ? 9 : 34,
														fontWeight: 900,
														color: "#fff",
														fontFamily: "'Arial Black',sans-serif",
														textAlign: "center",
														lineHeight: 1.3,
														wordBreak: "break-word"
													},
													children: text || "Hey happy Monday"
												})
											]
										});
									}
								},
								{
									name: "Sunset",
									id: 5,
									bgStyle: "linear-gradient(135deg,#FF416C,#FF9500)",
									render: (text, mini) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												padding: mini ? "8px" : "24px",
												width: "100%",
												height: "100%"
											},
											children: [
												!mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														fontSize: 32,
														marginBottom: 8
													},
													children: "🌅"
												}),
												mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: { fontSize: 12 },
													children: "🌅"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: mini ? 9 : 34,
														fontWeight: 900,
														color: "#fff",
														fontFamily: "'Arial Black',sans-serif",
														textAlign: "center",
														lineHeight: 1.3,
														wordBreak: "break-word",
														textShadow: "0 2px 8px rgba(0,0,0,0.3)"
													},
													children: text || "Hey happy Monday"
												})
											]
										});
									}
								},
								{
									name: "Ocean",
									id: 6,
									bgStyle: "linear-gradient(160deg,#0F2027,#2C5364)",
									render: (text, mini) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												padding: mini ? "8px" : "24px",
												width: "100%",
												height: "100%"
											},
											children: [
												!mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														fontSize: 32,
														marginBottom: 8
													},
													children: "🌊"
												}),
												mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: { fontSize: 12 },
													children: "🌊"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: mini ? 9 : 32,
														fontWeight: 800,
														color: "#00E5FF",
														fontFamily: "Arial,sans-serif",
														textAlign: "center",
														lineHeight: 1.3,
														wordBreak: "break-word"
													},
													children: text || "Hey happy Monday"
												})
											]
										});
									}
								},
								{
									name: "Gold",
									id: 7,
									bgStyle: "linear-gradient(135deg,#1a1a1a,#2d1a00)",
									render: (text, mini) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												padding: mini ? "8px" : "24px",
												width: "100%",
												height: "100%"
											},
											children: [
												!mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														fontSize: 32,
														marginBottom: 8
													},
													children: "✨"
												}),
												mini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: { fontSize: 12 },
													children: "✨"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: mini ? 9 : 34,
														fontWeight: 900,
														color: "#F5C842",
														fontFamily: "Georgia,serif",
														textAlign: "center",
														lineHeight: 1.3,
														wordBreak: "break-word",
														textShadow: "0 0 20px rgba(245,200,66,0.4)"
													},
													children: text || "Hey happy Monday"
												})
											]
										});
									}
								}
							];
							const tpl = TEXT_TEMPLATES[textPostTemplate] || TEXT_TEMPLATES[0];
							const displayText = textPostContent || "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { marginBottom: 16 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
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
										},
										children: [tpl.render(displayText, false), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												position: "absolute",
												bottom: 10,
												right: 14,
												color: "rgba(0,0,0,0.18)",
												fontSize: 10,
												fontWeight: 700,
												letterSpacing: 1
											},
											children: "sachi™"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
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
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#aaa",
											fontSize: 13,
											fontWeight: 600,
											marginBottom: 10
										},
										children: "Select a style"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											display: "flex",
											gap: 8,
											overflowX: "auto",
											paddingBottom: 8,
											scrollbarWidth: "none",
											WebkitOverflowScrolling: "touch"
										},
										children: TEXT_TEMPLATES.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											onClick: () => setTextPostTemplate(i),
											style: {
												flexShrink: 0,
												width: 76,
												height: 104,
												borderRadius: 12,
												background: t.bgStyle,
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
											children: t.render(displayText || "Hey happy Monday", true)
										}, i))
									})
								]
							});
						})(),
						uploadTab !== "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => {
									const next = !showMusicPicker;
									setShowMusicPicker(next);
									if (next && musicTracks.length === 0) fetchMusicTracks("All", "");
								},
								style: {
									display: "flex",
									alignItems: "center",
									gap: 10,
									background: "rgba(255,255,255,0.06)",
									border: "1px solid rgba(255,255,255,0.1)",
									borderRadius: 12,
									padding: "12px 14px",
									marginBottom: 12,
									cursor: "pointer"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { fontSize: 22 },
										children: "🎵"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { flex: 1 },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 700,
												fontSize: 14
											},
											children: selectedTrack ? selectedTrack.title : "Add Sound"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#888",
												fontSize: 12
											},
											children: selectedTrack ? selectedTrack.artist : "Pick from free music library"
										})]
									}),
									selectedTrack && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => {
											e.stopPropagation();
											setSelectedTrack(null);
										},
										style: {
											background: "none",
											border: "none",
											color: "#ff6b6b",
											fontSize: 16,
											cursor: "pointer"
										},
										children: "✕"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#888",
											fontSize: 18
										},
										children: showMusicPicker ? "▲" : "▼"
									})
								]
							}),
							showMusicPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									position: "fixed",
									inset: 0,
									zIndex: 3500,
									display: "flex",
									flexDirection: "column",
									justifyContent: "flex-end"
								},
								onClick: (e) => {
									if (e.target === e.currentTarget) setShowMusicPicker(false);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										background: "#0f0f1a",
										borderRadius: "20px 20px 0 0",
										maxHeight: "70vh",
										display: "flex",
										flexDirection: "column",
										boxShadow: "0 -8px 40px rgba(0,0,0,0.8)",
										border: "1px solid rgba(255,255,255,0.08)"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												padding: "14px 16px 8px"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													color: "#fff",
													fontWeight: 800,
													fontSize: 15
												},
												children: "🎵 Add Sound"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setShowMusicPicker(false),
												style: {
													background: "rgba(255,255,255,0.1)",
													border: "none",
													borderRadius: "50%",
													width: 30,
													height: 30,
													color: "#fff",
													cursor: "pointer",
													fontSize: 16
												},
												children: "✕"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: { padding: "0 12px 8px" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													display: "flex",
													alignItems: "center",
													background: "rgba(255,255,255,0.07)",
													borderRadius: 10,
													padding: "8px 12px",
													gap: 8
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: { fontSize: 14 },
														children: "🔍"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: musicSearch,
														onChange: (e) => setMusicSearch(e.target.value),
														onKeyDown: (e) => e.key === "Enter" && fetchMusicTracks(musicGenreFilter, musicSearch),
														placeholder: "Search songs, artists...",
														style: {
															flex: 1,
															background: "transparent",
															border: "none",
															outline: "none",
															color: "#fff",
															fontSize: 13
														}
													}),
													musicSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => {
															setMusicSearch("");
															fetchMusicTracks(musicGenreFilter, "");
														},
														style: {
															background: "none",
															border: "none",
															color: "#888",
															cursor: "pointer",
															fontSize: 14,
															padding: 0
														},
														children: "✕"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => fetchMusicTracks(musicGenreFilter, musicSearch),
														style: {
															background: "rgba(255,107,107,0.25)",
															border: "none",
															borderRadius: 8,
															padding: "4px 10px",
															color: "#ff6b6b",
															fontSize: 11,
															fontWeight: 700,
															cursor: "pointer"
														},
														children: "Go"
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												display: "flex",
												gap: 6,
												padding: "0 12px 8px",
												overflowX: "auto",
												scrollbarWidth: "none",
												flexShrink: 0
											},
											children: [
												"All",
												"Lo-Fi",
												"Hip-Hop",
												"Electronic",
												"R&B",
												"Pop",
												"Chill",
												"Afrobeats",
												"Jazz",
												"Rock",
												"Acoustic",
												"Classical"
											].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setMusicGenreFilter(g);
													fetchMusicTracks(g, musicSearch);
												},
												style: {
													flexShrink: 0,
													padding: "5px 12px",
													borderRadius: 20,
													border: "none",
													cursor: "pointer",
													fontSize: 11,
													fontWeight: 700,
													background: musicGenreFilter === g ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.07)",
													color: musicGenreFilter === g ? "#fff" : "#aaa"
												},
												children: g
											}, g))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												flex: 1,
												overflowY: "auto",
												WebkitOverflowScrolling: "touch"
											},
											children: musicLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													padding: "20px",
													textAlign: "center",
													color: "#666",
													fontSize: 13
												},
												children: "🎵 Loading tracks..."
											}) : musicTracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													padding: "20px",
													textAlign: "center",
													color: "#666",
													fontSize: 13
												},
												children: "No tracks found. Try another genre or search."
											}) : musicTracks.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => {
													setSelectedTrack(track);
													setShowMusicPicker(false);
													if (previewAudioRef.current) {
														previewAudioRef.current.pause();
														setPreviewTrack(null);
													}
												},
												style: {
													display: "flex",
													alignItems: "center",
													gap: 10,
													padding: "10px 14px",
													borderBottom: "1px solid rgba(255,255,255,0.05)",
													cursor: "pointer",
													background: selectedTrack?.id === track.id ? "rgba(255,107,107,0.15)" : "transparent"
												},
												children: [
													track.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: track.image,
														style: {
															width: 36,
															height: 36,
															borderRadius: 6,
															objectFit: "cover",
															flexShrink: 0
														}
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														style: {
															fontSize: 22,
															width: 36,
															textAlign: "center"
														},
														children: track.emoji || "🎵"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														style: {
															flex: 1,
															minWidth: 0
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															style: {
																color: "#fff",
																fontWeight: 600,
																fontSize: 13,
																overflow: "hidden",
																textOverflow: "ellipsis",
																whiteSpace: "nowrap"
															},
															children: track.title
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															style: {
																color: "#888",
																fontSize: 11,
																overflow: "hidden",
																textOverflow: "ellipsis",
																whiteSpace: "nowrap"
															},
															children: [track.artist, track.duration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																style: {
																	color: "rgba(255,107,107,0.6)",
																	marginLeft: 6
																},
																children: [
																	Math.floor(track.duration / 60),
																	":",
																	String(track.duration % 60).padStart(2, "0")
																]
															}) : null]
														})]
													}),
													selectedTrack?.id === track.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															color: "#ff6b6b",
															fontSize: 14,
															marginRight: 4
														},
														children: "✓"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: (e) => {
															e.stopPropagation();
															e.preventDefault();
															if (previewTrack === track.id) {
																if (previewAudioRef.current) {
																	previewAudioRef.current.pause();
																	previewAudioRef.current.currentTime = 0;
																}
																setPreviewTrack(null);
															} else {
																setPreviewTrack(track.id);
																if (previewAudioRef.current) {
																	previewAudioRef.current.pause();
																	previewAudioRef.current.src = track.url;
																	previewAudioRef.current.load();
																	previewAudioRef.current.play().catch((err) => console.warn("[Sachi Preview]", err));
																}
															}
														},
														style: {
															background: previewTrack === track.id ? "rgba(255,107,107,0.5)" : "rgba(255,107,107,0.2)",
															border: "2px solid rgba(255,107,107,0.4)",
															borderRadius: "50%",
															width: 38,
															height: 38,
															color: "#ff6b6b",
															cursor: "pointer",
															fontSize: 16,
															flexShrink: 0,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															WebkitTapHighlightColor: "transparent",
															touchAction: "manipulation"
														},
														children: previewTrack === track.id ? "⏹" : "▶"
													})
												]
											}, track.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												padding: "6px 14px 16px",
												color: "#444",
												fontSize: 10,
												textAlign: "right"
											},
											children: "Powered by Jamendo • Free music"
										})
									]
								})
							}),
							explicitBlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									background: "rgba(255,50,50,0.12)",
									border: "1px solid rgba(255,50,50,0.4)",
									borderRadius: 12,
									padding: "14px 16px",
									marginBottom: 12,
									display: "flex",
									gap: 10,
									alignItems: "flex-start"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 22,
										flexShrink: 0
									},
									children: "🔞"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#ff4444",
										fontWeight: 700,
										fontSize: 14,
										marginBottom: 4
									},
									children: "Explicit Content Not Allowed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#cc6666",
										fontSize: 13,
										lineHeight: 1.5
									},
									children: "Sachi does not allow sexual or explicit content. Please upload appropriate videos only."
								})] })]
							}),
							aiBlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									background: "rgba(255,50,50,0.12)",
									border: "1px solid rgba(255,50,50,0.4)",
									borderRadius: 12,
									padding: "14px 16px",
									marginBottom: 12,
									display: "flex",
									gap: 10,
									alignItems: "flex-start"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 22,
										flexShrink: 0
									},
									children: "🚫"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#ff4444",
										fontWeight: 700,
										fontSize: 16,
										marginBottom: 4
									},
									children: "Bruh. 💀"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										color: "#cc6666",
										fontSize: 14,
										lineHeight: 1.6
									},
									children: [
										"You can't upload AI videos on this site. 🚫🤖",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"Keep it real — post your own original content."
									]
								})] })]
							}),
							!aiBlocked && !explicitBlocked && file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { marginBottom: 14 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setIsMature((p) => !p),
									style: {
										display: "flex",
										gap: 10,
										alignItems: "center",
										cursor: "pointer",
										padding: "10px 14px",
										background: "rgba(255,255,255,0.04)",
										borderRadius: 10,
										border: `1px solid ${isMature ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}`
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 20,
											height: 20,
											borderRadius: 5,
											border: `2px solid ${isMature ? "#ff6b6b" : "#555"}`,
											background: isMature ? "#ff6b6b" : "transparent",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
											transition: "all 0.2s"
										},
										children: isMature && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: "#fff",
												fontSize: 13,
												fontWeight: 900
											},
											children: "✓"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											color: isMature ? "#ff6b6b" : "#888",
											fontSize: 13,
											lineHeight: 1.4
										},
										children: [
											"🔞 This video contains ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "mature content" }),
											" (violence, fighting, adult themes)"
										]
									})]
								}), isMature && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: matureReason,
									onChange: (e) => setMatureReason(e.target.value),
									style: {
										marginTop: 8,
										width: "100%",
										padding: "10px 14px",
										background: "rgba(255,255,255,0.06)",
										border: "1px solid rgba(255,107,107,0.3)",
										borderRadius: 10,
										color: "#fff",
										fontSize: 13,
										outline: "none"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "violence",
											children: "⚔️ Violence"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fighting",
											children: "🥊 Fighting / Combat"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "adult_themes",
											children: "🔞 Adult Themes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "strong_language",
											children: "🤬 Strong Language"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "other",
											children: "⚠️ Other Mature Content"
										})
									]
								})]
							}),
							!aiBlocked && !explicitBlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { marginBottom: 14 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setIsAiGenerated((p) => !p),
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
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
										},
										children: isAiGenerated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: "#fff",
												fontSize: 13,
												fontWeight: 900
											},
											children: "✓"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											color: isAiGenerated ? "#FF9500" : "#888",
											fontSize: 13,
											lineHeight: 1.4
										},
										children: [
											"🤖 ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Flag as AI" }),
											" — let your viewers know this content was AI generated"
										]
									})]
								}), isAiGenerated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										marginTop: 8,
										padding: "10px 14px",
										background: "rgba(255,149,0,0.07)",
										borderRadius: 10,
										border: "1px solid rgba(255,149,0,0.2)"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											color: "#FF9500",
											fontSize: 12,
											lineHeight: 1.5
										},
										children: [
											"⚠️ Your post will be ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "held for MOD review" }),
											" before going live. If approved, it will show an ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "🤖 AI Generated" }),
											" badge. Sachi values truth — thanks for being honest."
										]
									})
								})]
							}),
							!aiBlocked && !explicitBlocked && !isAiGenerated && file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setNotAiConfirmed((p) => !p),
								style: {
									display: "flex",
									gap: 10,
									alignItems: "center",
									marginBottom: 14,
									cursor: "pointer",
									padding: "10px 14px",
									background: "rgba(255,255,255,0.04)",
									borderRadius: 10,
									border: `1px solid ${notAiConfirmed ? "rgba(107,255,154,0.4)" : "rgba(255,255,255,0.1)"}`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 20,
										height: 20,
										borderRadius: 5,
										border: `2px solid ${notAiConfirmed ? "#6bff9a" : "#555"}`,
										background: notAiConfirmed ? "#6bff9a" : "transparent",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
										transition: "all 0.2s"
									},
									children: notAiConfirmed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#0a0a14",
											fontSize: 13,
											fontWeight: 900
										},
										children: "✓"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										color: notAiConfirmed ? "#6bff9a" : "#888",
										fontSize: 13,
										lineHeight: 1.4
									},
									children: [
										"I confirm this is ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "my original video" }),
										" and is ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT AI-generated" })
									]
								})]
							})
						] }),
						uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { marginBottom: 16 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#aaa",
									fontSize: 13,
									marginBottom: 6
								},
								children: step
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									background: "rgba(255,255,255,0.08)",
									borderRadius: 99,
									height: 6,
									overflow: "hidden"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									height: "100%",
									width: `${progress}%`,
									background: "linear-gradient(90deg,#ff6b6b,#ff8e53)",
									borderRadius: 99,
									transition: "width 0.4s ease"
								} })
							})]
						}),
						uploadTab === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => textPostContent.trim() && !uploading && goToPostDetails(),
							disabled: !textPostContent.trim() || uploading,
							style: {
								width: "100%",
								padding: 14,
								background: textPostContent.trim() && !uploading ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "rgba(255,255,255,0.08)",
								border: "none",
								borderRadius: 14,
								color: "#fff",
								fontWeight: 800,
								fontSize: 16,
								cursor: textPostContent.trim() && !uploading ? "pointer" : "not-allowed",
								opacity: textPostContent.trim() && !uploading ? 1 : .5
							},
							children: uploading ? step : "Next →"
						}) : uploadTab === "photo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => photos.length && !uploading && goToPostDetails(),
							disabled: !photos.length || uploading,
							style: {
								width: "100%",
								padding: 14,
								background: photos.length && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)",
								border: "none",
								borderRadius: 14,
								color: "#fff",
								fontWeight: 800,
								fontSize: 16,
								cursor: photos.length && !uploading ? "pointer" : "not-allowed",
								opacity: photos.length && !uploading ? 1 : .5
							},
							children: uploading ? step : "Next →"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) && goToPostDetails(),
							disabled: !file || uploading || aiBlocked || explicitBlocked || !notAiConfirmed && !isAiGenerated,
							style: {
								width: "100%",
								padding: 14,
								background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)",
								border: "none",
								borderRadius: 14,
								color: "#fff",
								fontWeight: 800,
								fontSize: 16,
								cursor: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? "pointer" : "not-allowed",
								opacity: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? 1 : .5
							},
							children: uploading ? step : "Next →"
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			ref: previewAudioRef,
			onEnded: () => setPreviewTrack(null),
			style: { display: "none" }
		})
	] });
}
function getUserAge() {
	const dob = localStorage.getItem("sachi_dob");
	if (!dob) return null;
	const birthDate = new Date(dob);
	const today = /* @__PURE__ */ new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) age--;
	return age;
}
function VideoCard({ video, currentUser, onCommentOpen, onLike, onView, onNeedAuth, onDelete, onProfileOpen, followedUserIds, onFollowChange, onShareCount, onBookmark, blockedIds }) {
	const videoRef = (0, import_react.useRef)(null);
	const soundRef = (0, import_react.useRef)(null);
	const viewedRef = (0, import_react.useRef)(false);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [liked, setLiked] = (0, import_react.useState)(false);
	if (window.__sachiMuted === void 0) window.__sachiMuted = true;
	const [muted, _setMutedLocal] = (0, import_react.useState)(() => window.__sachiMuted);
	const setMuted = (val) => {
		const newVal = typeof val === "function" ? val(window.__sachiMuted) : val;
		window.__sachiMuted = newVal;
		_setMutedLocal(newVal);
		window.dispatchEvent(new CustomEvent("sachi-mute-change", { detail: newVal }));
	};
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			_setMutedLocal(e.detail);
		};
		window.addEventListener("sachi-mute-change", handler);
		return () => window.removeEventListener("sachi-mute-change", handler);
	}, []);
	const [photoIdx, setPhotoIdx] = (0, import_react.useState)(0);
	(0, import_react.useRef)(null);
	const [followRecord, setFollowRecord] = (0, import_react.useState)(null);
	const isFollowing = followedUserIds ? followedUserIds.has(video.user_id || video.created_by) : !!followRecord;
	const [followLoading, setFollowLoading] = (0, import_react.useState)(false);
	const [reportTarget, setReportTarget] = (0, import_react.useState)(null);
	const [showUI, setShowUI] = (0, import_react.useState)(false);
	const [userTapped, setUserTapped] = (0, import_react.useState)(false);
	const uiTimerRef = (0, import_react.useRef)(null);
	const photoUrls = video.is_photo && video.photo_urls ? Array.isArray(video.photo_urls) ? video.photo_urls : JSON.parse(video.photo_urls) : null;
	const isOwnVideo = currentUser && (currentUser.id === video.user_id || currentUser.email === video.created_by || currentUser.username && currentUser.username === video.username);
	const [ageGateUnlocked, setAgeGateUnlocked] = (0, import_react.useState)(false);
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
	(0, import_react.useEffect)(() => {
		return () => {
			if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (videoRef.current) videoRef.current.muted = muted;
		if (soundRef.current) {
			if (muted) soundRef.current.pause();
			else if (playing && video.sound_url) soundRef.current.play().catch(() => {});
		}
	}, [muted]);
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el) return;
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				const currentlyMuted = window.__sachiMuted !== void 0 ? window.__sachiMuted : true;
				el.muted = currentlyMuted;
				el.play().catch(() => {});
				setPlaying(true);
				if (!currentlyMuted && soundRef.current && video.sound_url) soundRef.current.play().catch(() => {});
				setShowUI(true);
				hideUIAfterDelay(1500);
				if (!viewedRef.current) {
					viewedRef.current = true;
					onView && onView(video.id);
				}
			} else {
				el.pause();
				setPlaying(false);
				if (soundRef.current) soundRef.current.pause();
				if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
				setShowUI(false);
				setUserTapped(false);
			}
		}, { threshold: .6 });
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	const doMute = () => {
		const el = videoRef.current;
		if (!el) return;
		const wasPlaying = !el.paused;
		const nm = !muted;
		el.muted = nm;
		setMuted(nm);
		if (!nm && wasPlaying) {
			el.play().catch(() => {});
			setPlaying(true);
			hideUIAfterDelay(1500);
		}
	};
	const doTogglePlay = () => {
		const el = videoRef.current;
		if (!el) return;
		if (el.paused) {
			el.play();
			setPlaying(true);
			if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
			uiTimerRef.current = setTimeout(() => {
				setShowUI(false);
			}, 400);
		} else {
			el.pause();
			setPlaying(false);
			if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
			setShowUI(true);
		}
	};
	const likeLockedRef = import_react.useRef(false);
	const doLike = () => {
		if (!currentUser) {
			onNeedAuth();
			return;
		}
		if (likeLockedRef.current) return;
		likeLockedRef.current = true;
		setTimeout(() => {
			likeLockedRef.current = false;
		}, 500);
		setLiked((prev) => {
			const newLiked = !prev;
			onLike(video.id, newLiked ? 1 : -1);
			return newLiked;
		});
	};
	const doFollow = async () => {
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
					const rec = (res.items || res || []).find((r) => r.following_id === (video.user_id || video.created_by));
					if (rec) await follows.unfollow(rec.id);
				} catch (e) {}
				setFollowRecord(null);
				if (onFollowChange) onFollowChange(video.user_id || video.created_by, false);
			} else {
				setFollowRecord(await follows.follow(currentUser.id, currentUser.username || currentUser.email?.split("@")[0], video.user_id, video.username));
				if (onFollowChange) onFollowChange(video.user_id || video.created_by, true);
			}
		} catch (err) {
			console.error(err);
		}
		setFollowLoading(false);
	};
	const [showDeleteConfirm, setShowDeleteConfirm] = (0, import_react.useState)(false);
	const [showFullCaption, setShowFullCaption] = (0, import_react.useState)(false);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100svh",
			background: "#0B0C1A",
			flexShrink: 0,
			scrollSnapAlign: "start"
		},
		children: [
			showMatureBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
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
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { fontSize: 52 },
						children: "🔞"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 900,
							fontSize: 20,
							textAlign: "center"
						},
						children: "Mature Content"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#aaa",
							fontSize: 14,
							textAlign: "center",
							lineHeight: 1.6
						},
						children: "This video contains content that may not be suitable for viewers under 18."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							color: "#666",
							fontSize: 12,
							textAlign: "center"
						},
						children: ["Content type: ", video.mature_reason ? video.mature_reason.replace(/_/g, " ") : "mature"]
					}),
					userAge === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#F5C842",
							fontSize: 13,
							textAlign: "center"
						},
						children: "Sign in or verify your age to view this content."
					}),
					userAge !== null && userAge >= 18 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					})
				]
			}),
			photoUrls ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					width: "100%",
					height: "100%",
					position: "relative",
					overflow: "hidden",
					background: "#000",
					display: "flex",
					flexDirection: "column",
					touchAction: "pan-y"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							flex: 1,
							position: "relative",
							overflow: "hidden",
							pointerEvents: "none"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: resolveMediaUrl(photoUrls[photoIdx]),
							style: {
								width: "100%",
								height: "100%",
								objectFit: "contain",
								display: "block",
								userSelect: "none",
								WebkitUserSelect: "none",
								pointerEvents: "none"
							}
						}), photoUrls.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
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
								letterSpacing: .5
							},
							children: [
								photoIdx + 1,
								" / ",
								photoUrls.length
							]
						})]
					}),
					photoUrls.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
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
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onTouchEnd: (e) => {
									e.stopPropagation();
									e.preventDefault();
									setPhotoIdx((p) => Math.max(p - 1, 0));
								},
								onClick: (e) => {
									e.stopPropagation();
									setPhotoIdx((p) => Math.max(p - 1, 0));
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									gap: 8,
									alignItems: "center"
								},
								children: photoUrls.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: i === photoIdx ? 28 : 10,
									height: 10,
									borderRadius: 99,
									background: i === photoIdx ? "#F5C842" : "rgba(255,255,255,0.5)",
									transition: "all 0.25s ease",
									boxShadow: i === photoIdx ? "0 0 10px rgba(245,200,66,0.9)" : "none"
								} }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onTouchEnd: (e) => {
									e.stopPropagation();
									e.preventDefault();
									setPhotoIdx((p) => Math.min(p + 1, photoUrls.length - 1));
								},
								onClick: (e) => {
									e.stopPropagation();
									setPhotoIdx((p) => Math.min(p + 1, photoUrls.length - 1));
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
							})
						]
					}),
					video.sound_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						ref: soundRef,
						src: video.sound_url,
						loop: true,
						preload: "auto",
						style: { display: "none" },
						onCanPlay: () => {
							if (!muted && soundRef.current) soundRef.current.play().catch(() => {});
						}
					}), muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						onTouchStart: (e) => {
							e.stopPropagation();
							setMuted(false);
							if (soundRef.current) soundRef.current.play().catch(() => {});
						},
						onClick: (e) => {
							e.stopPropagation();
							setMuted(false);
							if (soundRef.current) soundRef.current.play().catch(() => {});
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
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onTouchStart: (e) => {
							e.stopPropagation();
							setMuted(true);
							if (soundRef.current) soundRef.current.pause();
						},
						onClick: (e) => {
							e.stopPropagation();
							setMuted(true);
							if (soundRef.current) soundRef.current.pause();
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
						children: ["🎵 ", video.sound_title || "Playing music"]
					})] })
				]
			}) : (() => {
				const resolvedVideoUrl = resolveMediaUrl(video.video_url);
				if (/\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: resolvedVideoUrl,
					style: {
						width: "100%",
						height: "100%",
						objectFit: "contain",
						background: "#000",
						display: "block"
					}
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						src: resolvedVideoUrl,
						poster: resolveMediaUrl(video.thumbnail_url),
						loop: true,
						playsInline: true,
						onPlay: () => {
							setPlaying(true);
							hideUIAfterDelay(1500);
							if (soundRef.current && video.sound_url && !muted) soundRef.current.play().catch(() => {});
						},
						onPause: () => {
							setPlaying(false);
							if (soundRef.current) soundRef.current.pause();
						},
						style: {
							width: "100%",
							height: "100%",
							objectFit: "cover",
							pointerEvents: "none",
							display: "block"
						}
					}),
					video.sound_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						ref: soundRef,
						src: video.sound_url,
						loop: true,
						preload: "none",
						style: { display: "none" }
					}),
					muted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						onTouchStart: (e) => {
							e.stopPropagation();
							const el = videoRef.current;
							if (el) {
								const wasPlaying = !el.paused;
								el.muted = false;
								setMuted(false);
								if (wasPlaying) {
									el.play().catch(() => {});
									setPlaying(true);
									hideUIAfterDelay(1500);
									if (soundRef.current && video.sound_url) soundRef.current.play().catch(() => {});
								}
							}
						},
						onClick: (e) => {
							e.stopPropagation();
							const el = videoRef.current;
							if (el) {
								const wasPlaying = !el.paused;
								el.muted = false;
								setMuted(false);
								if (wasPlaying) {
									el.play().catch(() => {});
									setPlaying(true);
									hideUIAfterDelay(1500);
									if (soundRef.current && video.sound_url) soundRef.current.play().catch(() => {});
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
					})
				] });
			})(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(to top, rgba(11,12,26,0.95) 0%, rgba(11,12,26,0.3) 50%, transparent 80%)",
				pointerEvents: "none",
				zIndex: 10,
				transition: "opacity 0.4s ease",
				opacity: showUI || !!photoUrls ? 1 : 0,
				visibility: showUI || !!photoUrls ? "visible" : "hidden"
			} }),
			!photoUrls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: tap(() => {
					const resolvedVideoUrl = resolveMediaUrl(video.video_url);
					if (/\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "") || !video.video_url) {
						setShowUI((v) => !v);
						if (!showUI) setShowFullCaption(true);
					} else doTogglePlay();
				}),
				style: {
					position: "absolute",
					top: 60,
					left: 0,
					right: 0,
					bottom: 80,
					zIndex: 50,
					cursor: "pointer"
				}
			}),
			!playing && !photoUrls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					pointerEvents: "none",
					zIndex: 20
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onClick: tap(doTogglePlay),
					style: {
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
					},
					children: "▶"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 148,
					left: 16,
					right: 16,
					zIndex: 500,
					transition: "opacity 0.4s ease",
					opacity: showUI || !!photoUrls ? 1 : 0,
					pointerEvents: showUI || !!photoUrls ? "auto" : "none",
					visibility: showUI || !!photoUrls ? "visible" : "hidden"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
							marginBottom: 8,
							cursor: "pointer"
						},
						onClick: tap(() => onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#F5C842",
								fontWeight: 800,
								fontSize: 16,
								letterSpacing: -.3
							},
							children: video.display_name || video.username
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "rgba(255,255,255,0.35)",
								fontSize: 12
							},
							children: ["@", video.username]
						})]
					}),
					video.sound_title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 6,
							marginBottom: 6,
							overflow: "hidden"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 14,
								flexShrink: 0,
								animation: playing ? "spin 3s linear infinite" : "none",
								display: "inline-block"
							},
							children: "🎵"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								overflow: "hidden",
								flex: 1
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									color: "rgba(255,255,255,0.85)",
									fontSize: 12,
									fontWeight: 600,
									whiteSpace: "nowrap",
									animation: playing ? "marquee 8s linear infinite" : "none",
									display: "inline-block"
								},
								children: [video.sound_title, video.sound_artist ? ` · ${video.sound_artist}` : ""]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 6,
							marginBottom: 4,
							flexWrap: "wrap"
						},
						children: !video.is_ai_detected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 10,
								background: "rgba(107,255,154,0.15)",
								color: "#6BFFB8",
								padding: "2px 9px",
								borderRadius: 20,
								fontWeight: 700,
								border: "1px solid rgba(107,255,154,0.3)"
							},
							children: "✓ Real"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 10,
								background: "rgba(255,149,0,0.15)",
								color: "#FF9500",
								padding: "2px 9px",
								borderRadius: 20,
								fontWeight: 700,
								border: "1px solid rgba(255,149,0,0.3)"
							},
							children: "🤖 AI Generated"
						})
					}),
					video.caption && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							color: "#fff",
							fontSize: 14,
							lineHeight: 1.5
						},
						children: [showFullCaption || (video.caption || "").length <= 80 ? video.caption : (video.caption || "").slice(0, 80) + "…", (video.caption || "").length > 80 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							onClick: tap(() => setShowFullCaption((v) => !v)),
							style: {
								color: "rgba(255,255,255,0.6)",
								fontSize: 13,
								marginLeft: 6,
								cursor: "pointer",
								fontWeight: 600
							},
							children: showFullCaption ? "see less" : "see more"
						})]
					}),
					video.hashtags?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#F5C842",
							fontSize: 13,
							marginTop: 4
						},
						children: video.hashtags.slice(0, 4).map((t) => `#${t.replace(/^#/, "")}`).join(" ")
					}),
					video.created_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "inline-flex",
							alignItems: "center",
							gap: 5,
							marginTop: 8,
							background: "rgba(0,0,0,0.45)",
							borderRadius: 20,
							padding: "3px 10px",
							width: "fit-content"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: { fontSize: 12 },
							children: "📅"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: {
								color: "rgba(255,255,255,0.85)",
								fontSize: 12,
								fontWeight: 600
							},
							children: [formatDate(video.created_date), video.post_country && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									marginLeft: 6,
									opacity: .9
								},
								children: [countryFlag(video.post_country), video.post_region ? ` ${video.post_region}` : ` ${video.post_country}`]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 72,
					left: 14,
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
					zIndex: 999
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onClick: (e) => {
						e.stopPropagation();
						onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name);
					},
					style: {
						width: 22,
						height: 22,
						borderRadius: "50%",
						overflow: "hidden",
						border: "1.5px solid rgba(245,200,66,0.7)",
						cursor: "pointer",
						flexShrink: 0,
						boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: video.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username)}&background=random&color=fff&size=128&bold=true&format=png`,
						style: {
							width: "100%",
							height: "100%",
							objectFit: "cover",
							pointerEvents: "none"
						}
					})
				}), !isOwnVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						letterSpacing: .3,
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
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					right: 12,
					bottom: 120,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 10,
					zIndex: 500,
					transition: "opacity 0.4s ease",
					opacity: showUI || !!photoUrls ? 1 : 0,
					pointerEvents: showUI || !!photoUrls ? "auto" : "none",
					visibility: showUI || !!photoUrls ? "visible" : "hidden"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 28,
								height: 28,
								borderRadius: 8,
								background: muted ? "rgba(245,200,66,0.12)" : "rgba(255,255,255,0.08)",
								backdropFilter: "blur(12px)",
								border: muted ? "1px solid rgba(245,200,66,0.35)" : "1px solid rgba(255,255,255,0.1)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								transition: "all 0.2s"
							},
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "#F5C842",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "23",
										y1: "9",
										x2: "17",
										y2: "15"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "17",
										y1: "9",
										x2: "23",
										y2: "15"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "rgba(255,255,255,0.9)",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
							} catch (e) {}
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
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
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { fontSize: 13 },
								children: video.is_ai_detected ? "🤖" : "🚩"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: video.is_ai_detected ? "#00ff78" : "rgba(255,255,255,0.5)",
								fontSize: 9,
								fontWeight: 700
							},
							children: video.is_ai_detected ? "AI" : "Flag"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: tap(doLike),
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
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
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								width: "13",
								height: "13",
								viewBox: "0 0 24 24",
								fill: liked ? "#FF6B6B" : "none",
								stroke: "#FF6B6B",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.8)",
								fontSize: 9,
								fontWeight: 600
							},
							children: formatCount(video.likes_count || 0)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 28,
								height: 28,
								borderRadius: 8,
								background: "rgba(255,255,255,0.08)",
								backdropFilter: "blur(12px)",
								border: "1px solid rgba(255,255,255,0.1)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								width: "13",
								height: "13",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "rgba(255,255,255,0.9)",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.8)",
								fontSize: 9,
								fontWeight: 600
							},
							children: formatCount(video.comments_count)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: tap(async () => {
							const shareUrl = `${window.location.origin}?v=${video.id}`;
							if (navigator.share) navigator.share({
								title: video.caption || "Check this out on Sachi",
								url: shareUrl
							});
							else {
								navigator.clipboard?.writeText(shareUrl);
								alert("Link copied!");
							}
							try {
								const newCount = (video.shares_count || 0) + 1;
								onShareCount && onShareCount(video.id, newCount);
								await videos.update(video.id, { shares_count: newCount });
							} catch (e) {}
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 28,
								height: 28,
								borderRadius: 8,
								background: "rgba(255,255,255,0.08)",
								backdropFilter: "blur(12px)",
								border: "1px solid rgba(255,255,255,0.1)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "13",
								height: "13",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "rgba(255,255,255,0.9)",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "18",
										cy: "5",
										r: "3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "6",
										cy: "12",
										r: "3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "18",
										cy: "19",
										r: "3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "8.59",
										y1: "13.51",
										x2: "15.42",
										y2: "17.49"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "15.41",
										y1: "6.51",
										x2: "8.59",
										y2: "10.49"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.8)",
								fontSize: 9,
								fontWeight: 600
							},
							children: formatCount(video.shares_count || 0)
						})]
					}),
					currentUser && (() => {
						const isBookmarked = onBookmark?.isBookmarked?.(video.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: tap(async () => {
								if (!currentUser) {
									onNeedAuth && onNeedAuth();
									return;
								}
								onBookmark?.handle && onBookmark.handle(video.id, !isBookmarked);
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: 28,
									height: 28,
									borderRadius: 8,
									background: isBookmarked ? "rgba(245,200,66,0.15)" : "rgba(255,255,255,0.08)",
									backdropFilter: "blur(12px)",
									border: `1px solid ${isBookmarked ? "rgba(245,200,66,0.5)" : "rgba(255,255,255,0.1)"}`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: isBookmarked ? "#F5C842" : "none",
									stroke: isBookmarked ? "#F5C842" : "rgba(255,255,255,0.9)",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: isBookmarked ? "#F5C842" : "rgba(255,255,255,0.8)",
									fontSize: 9,
									fontWeight: 600
								},
								children: "Save"
							})]
						});
					})(),
					isOwnVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 28,
								height: 28,
								borderRadius: 8,
								background: "rgba(255,60,60,0.12)",
								backdropFilter: "blur(12px)",
								border: "1px solid rgba(255,60,60,0.3)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "#ff5555",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "3 6 5 6 21 6" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 11v6" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 11v6" })
								]
							})
						})
					})
				]
			}),
			reportTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModal, {
				video: reportTarget,
				currentUser,
				onClose: () => setReportTarget(null)
			}),
			showDeleteConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 9999,
					background: "rgba(0,0,0,0.7)",
					display: "flex",
					alignItems: "flex-end",
					justifyContent: "center"
				},
				onClick: () => setShowDeleteConfirm(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: (e) => e.stopPropagation(),
					style: {
						width: "100%",
						maxWidth: 480,
						background: "#1a1a2e",
						borderRadius: "24px 24px 0 0",
						padding: "28px 24px 48px",
						display: "flex",
						flexDirection: "column",
						gap: 16
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { textAlign: "center" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 36,
										marginBottom: 8
									},
									children: "🗑️"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#fff",
										fontSize: 18,
										fontWeight: 700
									},
									children: "Delete Video?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "rgba(255,255,255,0.5)",
										fontSize: 14,
										marginTop: 6
									},
									children: "This can't be undone."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: confirmDelete,
							style: {
								width: "100%",
								padding: "14px",
								background: "#ff3b30",
								border: "none",
								borderRadius: 14,
								color: "#fff",
								fontSize: 16,
								fontWeight: 700,
								cursor: "pointer"
							},
							children: "Yes, Delete"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowDeleteConfirm(false),
							style: {
								width: "100%",
								padding: "14px",
								background: "rgba(255,255,255,0.1)",
								border: "none",
								borderRadius: 14,
								color: "#fff",
								fontSize: 16,
								fontWeight: 600,
								cursor: "pointer"
							},
							children: "Cancel"
						})
					]
				})
			})
		]
	});
}
var REPORT_REASONS = [
	{
		id: "ai",
		icon: "🤖",
		label: "AI-Generated Video",
		desc: "This video was made by AI, not a real person"
	},
	{
		id: "sexual",
		icon: "🔞",
		label: "Sexual / Explicit Content",
		desc: "Contains nudity or sexual content"
	},
	{
		id: "fake",
		icon: "🎭",
		label: "Fake / Misleading",
		desc: "This video is fake or spreading misinformation"
	},
	{
		id: "spam",
		icon: "📢",
		label: "Spam",
		desc: "Repetitive, irrelevant, or promotional spam"
	},
	{
		id: "violence",
		icon: "⚠️",
		label: "Violence / Harmful Content",
		desc: "Contains graphic violence or harmful acts"
	},
	{
		id: "other",
		icon: "💬",
		label: "Other",
		desc: "Something else not listed above"
	}
];
function ReportModal({ video, currentUser, onClose }) {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const submit = async () => {
		if (!selected) return;
		setSubmitted(true);
		try {
			await reports.create({
				video_id: video.id,
				reporter_id: currentUser?.id || "guest",
				reporter_username: currentUser?.username || currentUser?.email || "guest",
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 3e3,
			display: "flex",
			alignItems: "flex-end",
			justifyContent: "center"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			style: {
				position: "absolute",
				inset: 0,
				background: "rgba(0,0,0,0.8)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "relative",
				background: "#1a1a2e",
				borderRadius: "24px 24px 0 0",
				width: "100%",
				maxWidth: 480,
				padding: "20px 20px 40px",
				zIndex: 3001
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				width: 40,
				height: 4,
				background: "#444",
				borderRadius: 99,
				margin: "0 auto 16px"
			} }), submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					textAlign: "center",
					padding: "24px 0"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 48,
							marginBottom: 12
						},
						children: "✅"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 700,
							fontSize: 18,
							marginBottom: 6
						},
						children: "Report Submitted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#888",
							fontSize: 14
						},
						children: "Thanks for keeping Sachi safe. We'll review this video."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 6
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 700,
							fontSize: 16
						},
						children: "🚩 Report Video"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						style: {
							background: "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "50%",
							width: 30,
							height: 30,
							color: "#fff",
							cursor: "pointer"
						},
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#888",
						fontSize: 13,
						marginBottom: 16
					},
					children: "Why are you reporting this video?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 8,
						marginBottom: 20
					},
					children: REPORT_REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setSelected(r.id),
						style: {
							display: "flex",
							gap: 12,
							alignItems: "center",
							padding: "12px 14px",
							borderRadius: 12,
							cursor: "pointer",
							background: selected === r.id ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.04)",
							border: `1px solid ${selected === r.id ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.08)"}`,
							transition: "all 0.15s"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 22,
									flexShrink: 0
								},
								children: r.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: selected === r.id ? "#ff6b6b" : "#fff",
									fontWeight: 600,
									fontSize: 14
								},
								children: r.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#666",
									fontSize: 12,
									marginTop: 2
								},
								children: r.desc
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								marginLeft: "auto",
								width: 18,
								height: 18,
								borderRadius: "50%",
								border: `2px solid ${selected === r.id ? "#ff6b6b" : "#444"}`,
								background: selected === r.id ? "#ff6b6b" : "transparent",
								flexShrink: 0
							} })
						]
					}, r.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: submit,
					disabled: !selected,
					style: {
						width: "100%",
						padding: 14,
						background: selected ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)",
						border: "none",
						borderRadius: 14,
						color: "#fff",
						fontWeight: 700,
						fontSize: 15,
						cursor: selected ? "pointer" : "not-allowed",
						opacity: selected ? 1 : .5
					},
					children: "Submit Report"
				})
			] })]
		})]
	});
}
var spinStyle = document.createElement("style");
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
var AVATAR_STYLES = [
	{
		label: "Cartoon",
		style: "avataaars",
		seeds: [
			"Felix",
			"Aneka",
			"Mia",
			"Zara",
			"Leo",
			"Nova",
			"Kira",
			"Blaze",
			"Pixel",
			"Storm",
			"Echo",
			"Sage",
			"Raya",
			"Kofi",
			"Priya",
			"Omar",
			"Mei",
			"Ava",
			"Jake",
			"Luna",
			"Diego",
			"Aisha",
			"Nate",
			"Yuki"
		]
	},
	{
		label: "Portraits",
		style: "lorelei",
		seeds: [
			"Alex",
			"Sam",
			"Jordan",
			"Taylor",
			"Morgan",
			"Casey",
			"Jamie",
			"Riley",
			"Quinn",
			"Avery",
			"Blake",
			"Cameron",
			"Dana",
			"Ellis",
			"Fynn",
			"Gwen",
			"Harley",
			"Indie",
			"Jules",
			"Kai"
		]
	},
	{
		label: "Fun",
		style: "bottts",
		seeds: [
			"R2D2",
			"BB8",
			"Wall-E",
			"Robo",
			"Zap",
			"Bolt",
			"Chip",
			"Digi",
			"Glitch",
			"Mega",
			"Nano",
			"Pixel",
			"Spark",
			"Vibe",
			"Wave",
			"Flux",
			"Glow",
			"Nova",
			"Atom",
			"Echo"
		]
	},
	{
		label: "Minimal",
		style: "thumbs",
		seeds: [
			"Alpha",
			"Beta",
			"Gamma",
			"Delta",
			"Epsilon",
			"Zeta",
			"Eta",
			"Theta",
			"Iota",
			"Kappa",
			"Lambda",
			"Mu",
			"Nu",
			"Xi",
			"Omicron",
			"Pi",
			"Rho",
			"Sigma",
			"Tau",
			"Upsilon"
		]
	}
];
function AvatarCropEditor({ imageUrl, onSave, onCancel }) {
	const canvasRef = (0, import_react.useRef)();
	const [scale, setScale] = (0, import_react.useState)(1);
	const [offset, setOffset] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const dragStart = (0, import_react.useRef)(null);
	const imgRef = (0, import_react.useRef)(new window.Image());
	const SIZE = 300;
	(0, import_react.useEffect)(() => {
		const img = imgRef.current;
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const fit = Math.max(SIZE / img.width, SIZE / img.height);
			setScale(fit);
			setOffset({
				x: (SIZE - img.width * fit) / 2,
				y: (SIZE - img.height * fit) / 2
			});
			draw(fit, {
				x: (SIZE - img.width * fit) / 2,
				y: (SIZE - img.height * fit) / 2
			});
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
	(0, import_react.useEffect)(() => {
		draw();
	}, [scale, offset]);
	const onMouseDown = (e) => {
		setDragging(true);
		dragStart.current = {
			x: e.clientX - offset.x,
			y: e.clientY - offset.y
		};
	};
	const onMouseMove = (e) => {
		if (!dragging) return;
		setOffset({
			x: e.clientX - dragStart.current.x,
			y: e.clientY - dragStart.current.y
		});
	};
	const onMouseUp = () => setDragging(false);
	const onTouchStart = (e) => {
		e.preventDefault();
		setDragging(true);
		dragStart.current = {
			x: e.touches[0].clientX - offset.x,
			y: e.touches[0].clientY - offset.y
		};
	};
	const onTouchMove = (e) => {
		e.preventDefault();
		if (!dragging) return;
		setOffset({
			x: e.touches[0].clientX - dragStart.current.x,
			y: e.touches[0].clientY - dragStart.current.y
		});
	};
	const onTouchEnd = () => setDragging(false);
	const handleSave = () => {
		onSave(canvasRef.current.toDataURL("image/jpeg", .85));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 3e3,
			background: "rgba(0,0,0,0.95)",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			padding: 20
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#fff",
					fontWeight: 900,
					fontSize: 18,
					marginBottom: 8
				},
				children: "✂️ Crop your avatar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#888",
					fontSize: 13,
					marginBottom: 20
				},
				children: "Drag to reposition • Zoom with slider"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					borderRadius: "50%",
					overflow: "hidden",
					border: "3px solid #F5C842",
					boxShadow: "0 0 30px rgba(245,200,66,0.3)",
					marginBottom: 20,
					cursor: dragging ? "grabbing" : "grab"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
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
					style: {
						display: "block",
						touchAction: "none"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					width: "100%",
					maxWidth: 280,
					marginBottom: 24
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 6
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#aaa",
							fontSize: 12
						},
						children: "🔍 Zoom"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							const img = imgRef.current;
							const fit = Math.min(SIZE / img.width, SIZE / img.height);
							setScale(fit);
							setOffset({
								x: (SIZE - img.width * fit) / 2,
								y: (SIZE - img.height * fit) / 2
							});
						},
						style: {
							background: "rgba(245,200,66,0.15)",
							border: "1px solid rgba(245,200,66,0.4)",
							borderRadius: 8,
							padding: "3px 10px",
							color: "#F5C842",
							fontSize: 11,
							fontWeight: 700,
							cursor: "pointer"
						},
						children: "Fit whole image"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: .05,
					max: 4,
					step: .01,
					value: scale,
					onChange: (e) => setScale(parseFloat(e.target.value)),
					style: {
						width: "100%",
						accentColor: "#F5C842"
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					gap: 12,
					width: "100%",
					maxWidth: 280
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onCancel,
					style: {
						flex: 1,
						padding: "13px 0",
						background: "rgba(255,255,255,0.08)",
						border: "none",
						borderRadius: 14,
						color: "#aaa",
						fontWeight: 700,
						fontSize: 15,
						cursor: "pointer"
					},
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleSave,
					style: {
						flex: 2,
						padding: "13px 0",
						background: "linear-gradient(135deg,#F5C842,#FF9500)",
						border: "none",
						borderRadius: 14,
						color: "#0B0C1A",
						fontWeight: 900,
						fontSize: 15,
						cursor: "pointer"
					},
					children: "✓ Use this photo"
				})]
			})
		]
	});
}
function AvatarPickerModal({ currentAvatar, onSelect, onClose }) {
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [activeStyle, setActiveStyle] = (0, import_react.useState)(0);
	const [cropImageUrl, setCropImageUrl] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)();
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setCropImageUrl(URL.createObjectURL(file));
	};
	const handleCropSave = async (dataUrl) => {
		setCropImageUrl(null);
		setUploading(true);
		try {
			if (localStorage.getItem("sachi_token")) {
				const blob = await (await fetch(dataUrl)).blob();
				const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
				try {
					onSelect(await uploadFile(file));
					return;
				} catch (e) {
					console.warn("Server upload failed, falling back to base64:", e);
				}
			}
			onSelect(dataUrl);
		} catch (e) {
			alert("Could not save avatar. Try again.");
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [cropImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarCropEditor, {
		imageUrl: cropImageUrl,
		onSave: handleCropSave,
		onCancel: () => setCropImageUrl(null)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 2e3,
			display: "flex",
			alignItems: "flex-end",
			justifyContent: "center"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			style: {
				position: "absolute",
				inset: 0,
				background: "rgba(0,0,0,0.75)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "relative",
				background: "#1a1a2e",
				borderRadius: "24px 24px 0 0",
				width: "100%",
				maxWidth: 480,
				padding: "20px 20px 36px",
				zIndex: 2001
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					width: 40,
					height: 4,
					background: "#444",
					borderRadius: 99,
					margin: "0 auto 16px"
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 14
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 700,
							fontSize: 16
						},
						children: "🎨 Choose your avatar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						style: {
							background: "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "50%",
							width: 30,
							height: 30,
							color: "#fff",
							cursor: "pointer"
						},
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { marginBottom: 14 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						style: { display: "none" },
						onChange: handleFileUpload
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => fileRef.current?.click(),
						disabled: uploading,
						style: {
							width: "100%",
							padding: "13px",
							background: "linear-gradient(135deg,rgba(245,200,66,0.15),rgba(255,149,0,0.1))",
							border: "2px dashed rgba(245,200,66,0.5)",
							borderRadius: 14,
							color: "#F5C842",
							fontWeight: 800,
							fontSize: 15,
							cursor: "pointer"
						},
						children: uploading ? "⏳ Uploading..." : "📷 Upload & crop your photo"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						gap: 6,
						marginBottom: 12,
						overflowX: "auto",
						scrollbarWidth: "none"
					},
					children: AVATAR_STYLES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(4, 1fr)",
						gap: 14,
						maxHeight: 260,
						overflowY: "auto",
						paddingBottom: 4
					},
					children: AVATAR_STYLES[activeStyle].seeds.map((seed, i) => {
						const url = `https://api.dicebear.com/7.x/${AVATAR_STYLES[activeStyle].style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0B0C1A,1a1a2e,2d2d44`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: url,
								style: {
									width: "100%",
									height: "100%",
									pointerEvents: "none",
									display: "block",
									borderRadius: 10,
									background: "rgba(255,255,255,0.05)"
								},
								loading: "lazy"
							})
						}, i);
					})
				})
			]
		})]
	})] });
}
function ProfileVideoPlayer({ videos: vids, startIndex, onClose, profile, username }) {
	const [idx, setIdx] = import_react.useState(startIndex || 0);
	const [muted, setMuted] = import_react.useState(false);
	const videoRef = import_react.useRef(null);
	const touchStartY = import_react.useRef(null);
	const v = vids[idx];
	import_react.useEffect(() => {
		if (videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play().catch(() => {});
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
		if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
		touchStartY.current = null;
	};
	if (!v) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onTouchStart,
		onTouchEnd,
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 5e3,
			background: "#000",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				src: resolveMediaUrl(v.video_url),
				autoPlay: true,
				playsInline: true,
				loop: true,
				muted,
				onClick: () => {
					if (videoRef.current.paused) videoRef.current.play();
					else videoRef.current.pause();
				},
				style: {
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover"
				}
			}, v.id),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
				pointerEvents: "none"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					display: "flex",
					alignItems: "center",
					padding: "50px 16px 16px",
					zIndex: 10
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							flex: 1,
							textAlign: "center",
							color: "#fff",
							fontWeight: 800,
							fontSize: 15
						},
						children: profile?.display_name || username
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMuted((m) => !m),
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
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					padding: "0 16px 40px",
					zIndex: 10
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 10,
							marginBottom: 8
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
							style: {
								width: 36,
								height: 36,
								borderRadius: "50%",
								border: "2px solid #ff6b6b"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#fff",
								fontWeight: 800,
								fontSize: 14
							},
							children: ["@", username]
						})]
					}),
					v.caption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontSize: 13,
							lineHeight: 1.5,
							marginBottom: 8
						},
						children: v.caption
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 16
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									color: "rgba(255,255,255,0.7)",
									fontSize: 12
								},
								children: ["❤️ ", v.likes_count || 0]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									color: "rgba(255,255,255,0.7)",
									fontSize: 12
								},
								children: ["💬 ", v.comments_count || 0]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									color: "rgba(255,255,255,0.7)",
									fontSize: 12
								},
								children: ["👁 ", v.views_count || 0]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					right: 8,
					top: "50%",
					transform: "translateY(-50%)",
					display: "flex",
					flexDirection: "column",
					gap: 4,
					zIndex: 10
				},
				children: vids.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onClick: () => setIdx(i),
					style: {
						width: 4,
						height: i === idx ? 20 : 6,
						borderRadius: 4,
						background: i === idx ? "#ff6b6b" : "rgba(255,255,255,0.3)",
						cursor: "pointer",
						transition: "height 0.2s"
					}
				}, i))
			}),
			idx > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
			}),
			idx < vids.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 16,
					right: 16,
					color: "rgba(255,255,255,0.5)",
					fontSize: 11,
					zIndex: 10
				},
				children: [
					idx + 1,
					" / ",
					vids.length
				]
			})
		]
	});
}
function UserProfileSheet({ userId, username, currentUser, onClose }) {
	const [profile, setProfile] = import_react.useState(null);
	const [userVideos, setUserVideos] = import_react.useState([]);
	const [loading, setLoading] = import_react.useState(true);
	const [followRecord, setFollowRecord] = import_react.useState(null);
	const [followLoading, setFollowLoading] = import_react.useState(false);
	const [playerIndex, setPlayerIndex] = import_react.useState(null);
	const isOwnProfile = currentUser && currentUser.id === userId;
	import_react.useEffect(() => {
		setLoading(true);
		Promise.all([
			request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser?limit=200`).catch(() => null),
			videos.byUser(userId).catch(() => []),
			request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?following_id=${userId}&limit=500`).catch(() => null),
			request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_id=${userId}&limit=500`).catch(() => null)
		]).then(([userRes, vids, followersRes, followingRes]) => {
			const u = (userRes?.items || userRes || []).find((x) => x.id === userId || x.created_by === userId) || null;
			const liveFollowers = (followersRes?.items || followersRes || []).length;
			const liveFollowing = (followingRes?.items || followingRes || []).length;
			setProfile(u ? {
				...u,
				followers_count: liveFollowers,
				following_count: liveFollowing
			} : {
				followers_count: liveFollowers,
				following_count: liveFollowing
			});
			setUserVideos(Array.isArray(vids) ? vids : vids?.items || []);
			setLoading(false);
		});
		if (currentUser && !isOwnProfile) follows.getFollowing(currentUser.id).then((res) => {
			const rec = (res.items || res || []).find((r) => r.following_id === userId);
			if (rec) setFollowRecord(rec);
		}).catch(() => {});
	}, [userId]);
	const doFollow = async () => {
		if (!currentUser || isOwnProfile) return;
		setFollowLoading(true);
		try {
			if (followRecord) {
				await follows.unfollow(followRecord.id);
				setFollowRecord(null);
				setProfile((p) => p ? {
					...p,
					followers_count: Math.max(0, (p.followers_count || 1) - 1)
				} : p);
			} else {
				setFollowRecord(await follows.follow(currentUser.id, currentUser.username || currentUser.email?.split("@")[0], userId, username));
				setProfile((p) => p ? {
					...p,
					followers_count: (p.followers_count || 0) + 1
				} : p);
			}
			try {
				const myFollowingRes = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_id=${currentUser.id}&limit=500`);
				const myFollowingCount = (myFollowingRes?.items || myFollowingRes || []).length;
				setProfile((p) => p ? { ...p } : p);
				localStorage.setItem(`sachi_following_count_${currentUser.id}`, myFollowingCount);
			} catch (e) {}
		} catch (e) {
			console.error(e);
		}
		setFollowLoading(false);
	};
	const displayName = profile?.display_name || username || "User";
	const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 4e3,
			display: "flex",
			alignItems: "flex-end",
			justifyContent: "center"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			style: {
				position: "absolute",
				inset: 0,
				background: "rgba(0,0,0,0.75)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
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
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					width: 40,
					height: 4,
					background: "#333",
					borderRadius: 99,
					margin: "14px auto 0",
					flexShrink: 0
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					style: {
						position: "absolute",
						top: 12,
						right: 16,
						background: "none",
						border: "none",
						color: "#888",
						fontSize: 22,
						cursor: "pointer",
						zIndex: 1
					},
					children: "✕"
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						textAlign: "center",
						padding: 60,
						color: "#555"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 36,
							marginBottom: 8
						},
						children: "⏳"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading profile..." })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "16px 20px 20px",
						textAlign: "center",
						borderBottom: "1px solid rgba(255,255,255,0.06)",
						flexShrink: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: avatarUrl,
							style: {
								width: 80,
								height: 80,
								borderRadius: "50%",
								border: "3px solid #ff6b6b",
								marginBottom: 10,
								background: "#1a1a2e"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 800,
								fontSize: 18
							},
							children: displayName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#666",
								fontSize: 13,
								marginBottom: 4
							},
							children: ["@", username]
						}),
						profile?.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#aaa",
								fontSize: 13,
								marginBottom: 8,
								lineHeight: 1.5
							},
							children: profile.bio
						}),
						profile?.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#666",
								fontSize: 12,
								marginBottom: 8
							},
							children: ["📍 ", profile.location]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								justifyContent: "center",
								gap: 28,
								marginTop: 12,
								marginBottom: 14
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { textAlign: "center" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#fff",
											fontWeight: 800,
											fontSize: 18
										},
										children: userVideos.length
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#666",
											fontSize: 11
										},
										children: "Videos"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { textAlign: "center" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#fff",
											fontWeight: 800,
											fontSize: 18
										},
										children: profile?.followers_count || 0
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#666",
											fontSize: 11
										},
										children: "Followers"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { textAlign: "center" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#fff",
											fontWeight: 800,
											fontSize: 18
										},
										children: profile?.following_count || 0
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#666",
											fontSize: 11
										},
										children: "Following"
									})]
								})
							]
						}),
						!isOwnProfile && currentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								opacity: followLoading ? .6 : 1,
								boxShadow: followRecord ? "0 2px 12px rgba(34,197,94,0.5)" : "0 2px 12px rgba(255,0,0,0.4)",
								transition: "background 0.25s, box-shadow 0.25s",
								WebkitTapHighlightColor: "transparent",
								touchAction: "manipulation"
							},
							children: followLoading ? "..." : followRecord ? "✓ Following" : "+ Follow"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						overflowY: "auto",
						flex: 1,
						padding: 2
					},
					children: userVideos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							textAlign: "center",
							padding: 40,
							color: "#444"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 36,
								marginBottom: 8
							},
							children: "🎬"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "No videos yet" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(4,1fr)",
							gap: 2
						},
						children: userVideos.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setPlayerIndex(i),
							style: {
								position: "relative",
								aspectRatio: "1/1",
								background: "#111",
								overflow: "hidden",
								cursor: "pointer"
							},
							children: [
								v.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: resolveMediaUrl(v.thumbnail_url),
									style: {
										width: "100%",
										height: "100%",
										objectFit: "cover"
									}
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: resolveMediaUrl(v.video_url),
									style: {
										width: "100%",
										height: "100%",
										objectFit: "cover"
									},
									muted: true,
									playsInline: true,
									preload: "metadata"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										position: "absolute",
										inset: 0,
										background: "rgba(0,0,0,0.15)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: 22,
											opacity: .8
										},
										children: "▶"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									position: "absolute",
									inset: 0,
									background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "absolute",
										bottom: 4,
										left: 6,
										color: "#fff",
										fontSize: 11,
										fontWeight: 700
									},
									children: ["❤️ ", v.likes_count || 0]
								})
							]
						}, v.id))
					})
				})] })
			]
		})]
	}), playerIndex !== null && userVideos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileVideoPlayer, {
		videos: userVideos,
		startIndex: playerIndex,
		profile,
		username,
		onClose: () => setPlayerIndex(null)
	})] });
}
function VideoManageGrid({ videos: vids, onRefresh }) {
	const [menuVideo, setMenuVideo] = import_react.useState(null);
	const [editVideo, setEditVideo] = import_react.useState(null);
	const [editCaption, setEditCaption] = import_react.useState("");
	const [saving, setSaving] = import_react.useState(false);
	const [confirmDelete, setConfirmDelete] = import_react.useState(null);
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
	if (!vids || vids.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			gridColumn: "1/-1",
			textAlign: "center",
			padding: 40,
			color: "#555"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				fontSize: 40,
				marginBottom: 8
			},
			children: "📹"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "No videos yet" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: 2
			},
			children: vids.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "relative",
					aspectRatio: "9/16",
					background: "#111",
					overflow: "hidden",
					cursor: "pointer"
				},
				onClick: () => setMenuVideo(v),
				children: [
					v.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: resolveMediaUrl(v.thumbnail_url),
						style: {
							width: "100%",
							height: "100%",
							objectFit: "cover"
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 24
						},
						children: "🎬"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
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
						},
						children: "⋮"
					}),
					v.views_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							position: "absolute",
							bottom: 4,
							left: 4,
							background: "rgba(0,0,0,0.6)",
							borderRadius: 8,
							padding: "2px 6px",
							fontSize: 10,
							color: "#fff"
						},
						children: ["👁 ", v.views_count]
					})
				]
			}, v.id))
		}),
		menuVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 8e3,
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end"
			},
			onClick: () => setMenuVideo(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: "#1a1a2e",
					borderRadius: "20px 20px 0 0",
					padding: 20,
					maxWidth: 480,
					width: "100%",
					margin: "0 auto"
				},
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 12,
							marginBottom: 20,
							alignItems: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 54,
								height: 72,
								background: "#111",
								borderRadius: 8,
								overflow: "hidden",
								flexShrink: 0
							},
							children: menuVideo.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: menuVideo.thumbnail_url,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 20
								},
								children: "🎬"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 700,
								fontSize: 14
							},
							children: menuVideo.caption || "(no caption)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "#888",
								fontSize: 12,
								marginTop: 4
							},
							children: [
								"👁 ",
								menuVideo.views_count || 0,
								"  ❤️ ",
								menuVideo.likes_count || 0,
								"  💬 ",
								menuVideo.comments_count || 0
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMenuVideo(null),
						style: {
							width: "100%",
							padding: "12px 0",
							background: "none",
							border: "none",
							color: "#888",
							fontSize: 14,
							cursor: "pointer"
						},
						children: "Cancel"
					})
				]
			})
		}),
		editVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 8e3,
				background: "rgba(0,0,0,0.8)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 20
			},
			onClick: () => setEditVideo(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: "#1a1a2e",
					borderRadius: 20,
					padding: 24,
					width: "100%",
					maxWidth: 420
				},
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 700,
							fontSize: 17,
							marginBottom: 16
						},
						children: "✏️ Edit Caption"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 10,
							marginTop: 14
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								opacity: saving ? .7 : 1
							},
							children: saving ? "Saving..." : "Save Changes"
						})]
					})
				]
			})
		}),
		confirmDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 8e3,
				background: "rgba(0,0,0,0.85)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 20
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: "#1a1a2e",
					borderRadius: 20,
					padding: 24,
					width: "100%",
					maxWidth: 380,
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 48,
							marginBottom: 12
						},
						children: "🗑️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 700,
							fontSize: 17,
							marginBottom: 8
						},
						children: "Delete this video?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#888",
							fontSize: 13,
							marginBottom: 24
						},
						children: "This can't be undone. The video will be permanently removed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 10
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						})]
					})
				]
			})
		})
	] });
}
function Toast({ msg, type = "success" }) {
	if (!msg) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			bottom: 100,
			left: "50%",
			transform: "translateX(-50%)",
			zIndex: 9999,
			background: type === "error" ? "linear-gradient(135deg,#c62828,#b71c1c)" : type === "live" ? "linear-gradient(135deg,#e53935,#b71c1c)" : "linear-gradient(135deg,#2e7d32,#1b5e20)",
			color: "#fff",
			fontWeight: 700,
			fontSize: 14,
			padding: "12px 24px",
			borderRadius: 30,
			boxShadow: "0 6px 28px rgba(0,0,0,0.5)",
			whiteSpace: "nowrap",
			pointerEvents: "none"
		},
		children: msg
	});
}
function RecentEpisodes({ episodes = [], loading = false, onEpisodeClick }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			marginTop: 24,
			marginBottom: 8
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				color: "rgba(255,255,255,0.35)",
				fontSize: 12,
				fontWeight: 700,
				textTransform: "uppercase",
				letterSpacing: 1.2,
				marginBottom: 12
			},
			children: "Recent Episodes"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				color: "rgba(255,255,255,0.2)",
				fontSize: 13,
				padding: "12px 0"
			},
			children: "Loading..."
		})]
	});
	if (!episodes || !episodes.length) return null;
	const fmtDuration = (sec) => {
		if (!sec) return "";
		const h = Math.floor(sec / 3600);
		const m = Math.floor(sec % 3600 / 60);
		if (h > 0) return `${h}h ${m}m`;
		return `${m}m`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			marginTop: 24,
			marginBottom: 8
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				color: "rgba(255,255,255,0.5)",
				fontSize: 12,
				fontWeight: 700,
				textTransform: "uppercase",
				letterSpacing: 1.2,
				marginBottom: 12
			},
			children: "Recent Episodes"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: 10
			},
			children: episodes.map((ep, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => onEpisodeClick && onEpisodeClick(ep),
				style: {
					background: "rgba(255,255,255,0.04)",
					border: "1px solid rgba(255,255,255,0.07)",
					borderRadius: 14,
					padding: "14px 16px",
					display: "flex",
					alignItems: "flex-start",
					gap: 14,
					cursor: "pointer",
					transition: "background 0.2s"
				},
				onMouseEnter: (e) => e.currentTarget.style.background = "rgba(108,60,247,0.15)",
				onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: 40,
						height: 40,
						borderRadius: 10,
						background: "linear-gradient(135deg,#6c3cf7,#4527a0)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
						fontWeight: 800,
						color: "#fff",
						fontSize: 14
					},
					children: ep.episode_number || i + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						minWidth: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 700,
								fontSize: 14,
								lineHeight: 1.4,
								marginBottom: 4,
								overflow: "hidden",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical"
							},
							children: ep.title
						}),
						ep.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.4)",
								fontSize: 12,
								lineHeight: 1.5,
								overflow: "hidden",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								marginBottom: 6
							},
							children: ep.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 10
							},
							children: [ep.duration_seconds > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									color: "rgba(255,255,255,0.3)",
									fontSize: 11
								},
								children: ["⏱ ", fmtDuration(ep.duration_seconds)]
							}), ep.listener_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									color: "rgba(255,255,255,0.3)",
									fontSize: 11
								},
								children: ["🎧 ", ep.listener_count]
							})]
						})
					]
				})]
			}, ep.id || i))
		})]
	});
}
var PODCAST_COVER_COLORS = [
	{
		bg: "linear-gradient(135deg,#6c3cf7,#4527a0)",
		emoji: "🎙️"
	},
	{
		bg: "linear-gradient(135deg,#e53935,#b71c1c)",
		emoji: "🔥"
	},
	{
		bg: "linear-gradient(135deg,#0288d1,#01579b)",
		emoji: "🌊"
	},
	{
		bg: "linear-gradient(135deg,#2e7d32,#1b5e20)",
		emoji: "🌿"
	},
	{
		bg: "linear-gradient(135deg,#f57c00,#e65100)",
		emoji: "⚡"
	},
	{
		bg: "linear-gradient(135deg,#ad1457,#880e4f)",
		emoji: "💫"
	},
	{
		bg: "linear-gradient(135deg,#00838f,#006064)",
		emoji: "🎵"
	},
	{
		bg: "linear-gradient(135deg,#4e342e,#3e2723)",
		emoji: "☕"
	}
];
function PodcastPage({ currentUser, onNeedAuth }) {
	const CATEGORIES = [
		"All",
		"News & Politics",
		"Business",
		"Entertainment",
		"Comedy",
		"Sports",
		"Technology",
		"Health & Wellness",
		"True Crime",
		"Education"
	];
	const [podcasts, setPodcasts] = (0, import_react.useState)([]);
	const [myShows, setMyShows] = (0, import_react.useState)([]);
	const [loadingPodcasts, setLoadingPodcasts] = (0, import_react.useState)(true);
	const [selectedCat, setSelectedCat] = (0, import_react.useState)("All");
	const [selectedPodcast, setSelectedPodcast] = (0, import_react.useState)(null);
	const [podcastEpisodes, setPodcastEpisodes] = (0, import_react.useState)([]);
	const [episodesLoading, setEpisodesLoading] = (0, import_react.useState)(false);
	const [showRegister, setShowRegister] = (0, import_react.useState)(false);
	const [registerForm, setRegisterForm] = (0, import_react.useState)({
		title: "",
		host_name: "",
		description: "",
		category: "Business",
		live_stream_url: "",
		coverIdx: 0
	});
	const [registering, setRegistering] = (0, import_react.useState)(false);
	const [registerDone, setRegisterDone] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [goingLive, setGoingLive] = (0, import_react.useState)(false);
	const [endingLive, setEndingLive] = (0, import_react.useState)(false);
	const [editingStream, setEditingStream] = (0, import_react.useState)(false);
	const [selectedEpisode, setSelectedEpisode] = (0, import_react.useState)(null);
	const [newStreamUrl, setNewStreamUrl] = (0, import_react.useState)("");
	const [liveNewsChannel, setLiveNewsChannel] = (0, import_react.useState)(null);
	const LIVE_NEWS_CHANNELS = [
		{
			id: "ctv",
			name: "CTV News",
			emoji: "🍁",
			desc: "Canada's #1 news network",
			color: "linear-gradient(135deg,#c62828,#b71c1c)",
			url: "https://www.youtube.com/embed/live_stream?channel=UCt2BNvKMDuNg38w2MgI4mIA&autoplay=1"
		},
		{
			id: "abc",
			name: "ABC News",
			emoji: "🇺🇸",
			desc: "Live U.S. news coverage",
			color: "linear-gradient(135deg,#1565c0,#0d47a1)",
			url: "https://www.youtube.com/embed/live_stream?channel=UCBi2mrWuNuyYy4gbM6fU18Q&autoplay=1"
		},
		{
			id: "bbc",
			name: "BBC News",
			emoji: "🇬🇧",
			desc: "Global news from London",
			color: "linear-gradient(135deg,#b71c1c,#880e4f)",
			url: "https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA&autoplay=1"
		},
		{
			id: "aljaz",
			name: "Al Jazeera",
			emoji: "🌍",
			desc: "Breaking news worldwide",
			color: "linear-gradient(135deg,#1b5e20,#004d40)",
			url: "https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1"
		},
		{
			id: "cnn",
			name: "CNN",
			emoji: "📡",
			desc: "24/7 breaking news",
			color: "linear-gradient(135deg,#c62828,#4a148c)",
			url: "https://www.youtube.com/embed/live_stream?channel=UCupvZG-5ko_eiXAupbDfxWw&autoplay=1"
		},
		{
			id: "sky",
			name: "Sky News",
			emoji: "🌐",
			desc: "Live from the UK",
			color: "linear-gradient(135deg,#0277bd,#01579b)",
			url: "https://www.youtube.com/embed/live_stream?channel=UCiU6U_f2KO7P6LFID9eQ4bA&autoplay=1"
		},
		{
			id: "dw",
			name: "DW News",
			emoji: "🇩🇪",
			desc: "International news in English",
			color: "linear-gradient(135deg,#37474f,#263238)",
			url: "https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1"
		},
		{
			id: "france",
			name: "France 24",
			emoji: "🇫🇷",
			desc: "Global news in English",
			color: "linear-gradient(135deg,#1565c0,#e53935)",
			url: "https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAoBw&autoplay=1"
		}
	];
	const showToast = (msg, type = "success", ms = 3e3) => {
		setToast({
			msg,
			type
		});
		setTimeout(() => setToast(null), ms);
	};
	(0, import_react.useEffect)(() => {
		loadPodcasts();
	}, []);
	(0, import_react.useEffect)(() => {
		if (currentUser) loadMyShows();
	}, [currentUser]);
	const loadPodcasts = async () => {
		setLoadingPodcasts(true);
		try {
			const data = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast?status=Active`);
			setPodcasts(Array.isArray(data) ? data : data.records || data.items || []);
		} catch (e) {
			console.error("loadPodcasts failed:", e);
		} finally {
			setLoadingPodcasts(false);
		}
	};
	const loadMyShows = async () => {
		if (!currentUser) return;
		try {
			const data = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast`);
			setMyShows((Array.isArray(data) ? data : data.records || data.items || []).filter((p) => p.host_user_id === currentUser.id || p.host_username === (currentUser.full_name || currentUser.email?.split("@")[0]) || p.created_by === currentUser.email || currentUser.email === "jaygnz27@gmail.com" || currentUser.email === "lasanjaya@gmail.com"));
		} catch (e) {
			console.error("loadMyShows failed:", e);
		}
	};
	const filtered = selectedCat === "All" ? podcasts : podcasts.filter((p) => p.category === selectedCat);
	const livePodcasts = filtered.filter((p) => p.is_live);
	const regularPodcasts = filtered.filter((p) => !p.is_live);
	const handleRegister = async () => {
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
				host_user_id: currentUser?.id || "",
				host_username: currentUser?.full_name || currentUser?.email?.split("@")[0] || ""
			});
			setRegisterDone(true);
			await loadPodcasts();
			await loadMyShows();
			fetch("https://sachi-c7f0261c.base44.app/functions/podcastWelcome", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					host_email: currentUser?.email || "",
					host_name: registerForm.host_name,
					podcast_title: registerForm.title,
					category: registerForm.category
				})
			}).catch(() => {});
			setRegisterForm({
				title: "",
				host_name: "",
				description: "",
				category: "Business",
				live_stream_url: "",
				coverIdx: 0
			});
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
				const id = url.split("/").pop().split("?")[0];
				return url.includes("/episode/") ? `https://open.spotify.com/embed/episode/${id}` : `https://open.spotify.com/embed/show/${id}`;
			}
			return url;
		};
		const embedUrl = getEpEmbed(epUrl);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "fixed",
				inset: 0,
				background: "#0B0C1A",
				zIndex: 200,
				display: "flex",
				flexDirection: "column"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 12,
					padding: "16px 20px",
					borderBottom: "1px solid rgba(255,255,255,0.08)",
					flexShrink: 0
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSelectedEpisode(null),
					style: {
						background: "rgba(255,255,255,0.08)",
						border: "none",
						borderRadius: 10,
						width: 36,
						height: 36,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						color: "#fff",
						fontSize: 18
					},
					children: "←"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						minWidth: 0
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 700,
							fontSize: 15,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						children: selectedEpisode.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							color: "rgba(255,255,255,0.4)",
							fontSize: 12
						},
						children: ["Episode ", selectedEpisode.episode_number]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: 20
				},
				children: [embedUrl && (embedUrl.includes("youtube.com/embed") || embedUrl.includes("spotify.com/embed") || embedUrl.includes("rumble.com/embed")) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					src: embedUrl,
					style: {
						width: "100%",
						maxWidth: 700,
						height: embedUrl.includes("spotify") ? 232 : "56vw",
						maxHeight: 500,
						borderRadius: 16,
						border: "none"
					},
					allow: "autoplay; encrypted-media; fullscreen",
					allowFullScreen: true
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						width: "100%",
						maxWidth: 500,
						background: "rgba(255,255,255,0.05)",
						borderRadius: 20,
						padding: 32,
						textAlign: "center"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 64,
								marginBottom: 16
							},
							children: "🎙️"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 700,
								fontSize: 16,
								marginBottom: 8
							},
							children: selectedEpisode.title
						}),
						selectedEpisode.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.5)",
								fontSize: 13,
								marginBottom: 24,
								lineHeight: 1.6
							},
							children: selectedEpisode.description
						}),
						epUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: epUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							style: {
								display: "inline-block",
								background: "linear-gradient(135deg,#6c3cf7,#4527a0)",
								color: "#fff",
								padding: "14px 28px",
								borderRadius: 50,
								fontWeight: 700,
								fontSize: 15,
								textDecoration: "none"
							},
							children: "🎧 Listen Now"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.3)",
								fontSize: 14
							},
							children: "No stream URL available yet"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						marginTop: 24,
						width: "100%",
						maxWidth: 500
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "rgba(255,255,255,0.5)",
							fontSize: 13,
							lineHeight: 1.7
						},
						children: selectedEpisode.description
					})
				})]
			})]
		});
	}
	if (selectedPodcast) {
		const isHost = currentUser && (currentUser.id === selectedPodcast.host_user_id || currentUser.email === selectedPodcast.created_by || currentUser.full_name && currentUser.full_name === selectedPodcast.host_username || currentUser.email?.split("@")[0] === selectedPodcast.host_username || currentUser.email === "jaygnz27@gmail.com" || currentUser.email === "lasanjaya@gmail.com");
		const coverBg = selectedPodcast.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
		const coverEmoji = selectedPodcast.cover_emoji || "🎙️";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 600,
				background: "#0B0C1A",
				overflowY: "auto"
			},
			children: [
				toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, {
					msg: toast.msg,
					type: toast.type
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						position: "relative",
						height: 240,
						background: coverBg,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedPodcast(null),
							style: {
								position: "absolute",
								top: 16,
								left: 16,
								background: "rgba(0,0,0,0.3)",
								border: "none",
								borderRadius: "50%",
								width: 38,
								height: 38,
								color: "#fff",
								fontSize: 20,
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							},
							children: "←"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 60,
								marginBottom: 10
							},
							children: coverEmoji
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 800,
								fontSize: 20,
								textAlign: "center",
								padding: "0 60px",
								textShadow: "0 2px 8px rgba(0,0,0,0.5)"
							},
							children: selectedPodcast.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "rgba(255,255,255,0.65)",
								fontSize: 13,
								marginTop: 4
							},
							children: ["by ", selectedPodcast.host_name]
						}),
						selectedPodcast.is_live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								position: "absolute",
								top: 16,
								right: 16,
								background: "#e53935",
								borderRadius: 20,
								padding: "5px 12px",
								display: "flex",
								alignItems: "center",
								gap: 6,
								animation: "pulse 1.5s infinite"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								width: 7,
								height: 7,
								borderRadius: "50%",
								background: "#fff"
							} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									color: "#fff",
									fontWeight: 800,
									fontSize: 12
								},
								children: "LIVE"
							})]
						}),
						selectedPodcast.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								position: "absolute",
								top: 16,
								right: 16,
								background: "rgba(245,200,66,0.9)",
								borderRadius: 20,
								padding: "5px 12px"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									color: "#000",
									fontWeight: 800,
									fontSize: 11
								},
								children: "⏳ PENDING REVIEW"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { padding: "20px 20px 100px" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								gap: 0,
								marginBottom: 20,
								background: "rgba(255,255,255,0.04)",
								borderRadius: 16,
								overflow: "hidden"
							},
							children: [
								{
									val: selectedPodcast.follower_count || 0,
									label: "Followers"
								},
								{
									val: selectedPodcast.episode_count || 0,
									label: "Episodes"
								},
								{
									val: selectedPodcast.is_live ? selectedPodcast.listener_count || 0 : "—",
									label: "Listening",
									red: selectedPodcast.is_live
								}
							].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									flex: 1,
									textAlign: "center",
									padding: "14px 0",
									borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: s.red ? "#e53935" : "#fff",
										fontWeight: 800,
										fontSize: 18
									},
									children: s.val
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "rgba(255,255,255,0.35)",
										fontSize: 11,
										marginTop: 2
									},
									children: s.label
								})]
							}, i))
						}),
						selectedPodcast.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								background: "rgba(255,255,255,0.04)",
								borderRadius: 14,
								padding: 16,
								marginBottom: 20
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "rgba(255,255,255,0.7)",
									fontSize: 14,
									lineHeight: 1.6
								},
								children: selectedPodcast.description
							})
						}) : null,
						isHost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { marginBottom: 20 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#F5C842",
									fontWeight: 700,
									fontSize: 12,
									letterSpacing: 1.2,
									textTransform: "uppercase",
									marginBottom: 12
								},
								children: "🎙️ Host Controls"
							}), selectedPodcast.is_live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										background: "rgba(229,57,53,0.08)",
										border: "1px solid rgba(229,57,53,0.3)",
										borderRadius: 14,
										padding: 14,
										marginBottom: 12,
										textAlign: "center"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#e53935",
											fontWeight: 700,
											fontSize: 13
										},
										children: "🔴 You are currently LIVE"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											color: "rgba(255,255,255,0.4)",
											fontSize: 12,
											marginTop: 4
										},
										children: [selectedPodcast.listener_count || 0, " listeners tuned in"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										background: "rgba(255,255,255,0.04)",
										borderRadius: 14,
										padding: 14,
										marginBottom: 14
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "rgba(255,255,255,0.5)",
											fontSize: 12,
											marginBottom: 6
										},
										children: "🔗 Stream URL"
									}), editingStream ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											gap: 8
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: newStreamUrl,
												onChange: (e) => setNewStreamUrl(e.target.value),
												placeholder: "https://youtube.com/watch?v=...",
												style: {
													flex: 1,
													background: "rgba(255,255,255,0.08)",
													border: "1px solid rgba(255,255,255,0.15)",
													borderRadius: 10,
													padding: "8px 12px",
													color: "#fff",
													fontSize: 13,
													outline: "none"
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: async () => {
													try {
														await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
														setSelectedPodcast((p) => ({
															...p,
															live_stream_url: newStreamUrl
														}));
														setEditingStream(false);
														showToast("✅ Stream URL saved!", "success");
													} catch (e) {
														showToast("Failed to save URL", "error");
													}
												},
												style: {
													background: "#6c3cf7",
													border: "none",
													borderRadius: 10,
													padding: "8px 14px",
													color: "#fff",
													fontWeight: 700,
													fontSize: 13,
													cursor: "pointer"
												},
												children: "Save"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setEditingStream(false),
												style: {
													background: "rgba(255,255,255,0.08)",
													border: "none",
													borderRadius: 10,
													padding: "8px 14px",
													color: "#fff",
													fontSize: 13,
													cursor: "pointer"
												},
												children: "✕"
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)",
												fontSize: 13,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												maxWidth: "75%"
											},
											children: selectedPodcast.live_stream_url || "No stream URL set yet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setNewStreamUrl(selectedPodcast.live_stream_url || "");
												setEditingStream(true);
											},
											style: {
												background: "rgba(108,60,247,0.2)",
												border: "1px solid rgba(108,60,247,0.4)",
												borderRadius: 8,
												padding: "5px 12px",
												color: "#a78bfa",
												fontSize: 12,
												cursor: "pointer",
												fontWeight: 600,
												flexShrink: 0
											},
											children: selectedPodcast.live_stream_url ? "Edit" : "Add URL"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: async () => {
										if (endingLive) return;
										setEndingLive(true);
										try {
											await fetch("https://sachi-c7f0261c.base44.app/functions/podcastGoLiveNotify", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({
													podcast_id: selectedPodcast.id,
													set_live: false,
													admin_email: currentUser?.email
												})
											}).catch(() => {});
											try {
												await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, {
													is_live: false,
													listener_count: 0
												});
											} catch {}
											setSelectedPodcast((p) => ({
												...p,
												is_live: false,
												listener_count: 0
											}));
											setPodcasts((ps) => ps.map((p) => p.id === selectedPodcast.id ? {
												...p,
												is_live: false
											} : p));
											showToast("✅ Live session ended successfully", "success");
										} catch (e) {
											showToast("Failed to end session. Try again.", "error");
										}
										setEndingLive(false);
									},
									style: {
										width: "100%",
										padding: "15px 0",
										background: endingLive ? "rgba(229,57,53,0.3)" : "rgba(229,57,53,0.12)",
										border: "2px solid #e53935",
										borderRadius: 16,
										color: "#e53935",
										fontWeight: 800,
										fontSize: 16,
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: 10
									},
									children: endingLive ? "Ending..." : "⏹️ End Live Session"
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										background: "rgba(255,255,255,0.04)",
										borderRadius: 14,
										padding: 14,
										marginBottom: 14
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											color: "rgba(255,255,255,0.5)",
											fontSize: 12,
											marginBottom: 6
										},
										children: ["🔗 Stream URL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "rgba(255,255,255,0.25)" },
											children: "(YouTube Live, Twitch, etc.)"
										})]
									}), editingStream ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											gap: 8
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: newStreamUrl,
												onChange: (e) => setNewStreamUrl(e.target.value),
												placeholder: "https://youtube.com/live/...",
												style: {
													flex: 1,
													background: "rgba(255,255,255,0.08)",
													border: "1px solid rgba(255,255,255,0.15)",
													borderRadius: 10,
													padding: "8px 12px",
													color: "#fff",
													fontSize: 13,
													outline: "none"
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: async () => {
													try {
														await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
														setSelectedPodcast((p) => ({
															...p,
															live_stream_url: newStreamUrl
														}));
														setEditingStream(false);
														showToast("✅ Stream URL saved!", "success");
													} catch (e) {
														showToast("Failed to save URL", "error");
													}
												},
												style: {
													background: "#6c3cf7",
													border: "none",
													borderRadius: 10,
													padding: "8px 14px",
													color: "#fff",
													fontWeight: 700,
													fontSize: 13,
													cursor: "pointer"
												},
												children: "Save"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setEditingStream(false),
												style: {
													background: "rgba(255,255,255,0.08)",
													border: "none",
													borderRadius: 10,
													padding: "8px 14px",
													color: "#fff",
													fontSize: 13,
													cursor: "pointer"
												},
												children: "✕"
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)",
												fontSize: 13,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												maxWidth: "75%"
											},
											children: selectedPodcast.live_stream_url || "No stream URL set yet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setNewStreamUrl(selectedPodcast.live_stream_url || "");
												setEditingStream(true);
											},
											style: {
												background: "rgba(108,60,247,0.2)",
												border: "1px solid rgba(108,60,247,0.4)",
												borderRadius: 8,
												padding: "5px 12px",
												color: "#a78bfa",
												fontSize: 12,
												cursor: "pointer",
												fontWeight: 600,
												flexShrink: 0
											},
											children: selectedPodcast.live_stream_url ? "Edit" : "Add URL"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: async () => {
										if (goingLive) return;
										setGoingLive(true);
										try {
											await fetch("https://sachi-c7f0261c.base44.app/functions/podcastGoLiveNotify", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({
													podcast_id: selectedPodcast.id,
													podcast_title: selectedPodcast.title,
													host_name: selectedPodcast.host_name,
													live_stream_url: selectedPodcast.live_stream_url || "",
													set_live: true,
													admin_email: currentUser?.email
												})
											});
											try {
												await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcast/${selectedPodcast.id}`, { is_live: true });
											} catch {}
											setSelectedPodcast((p) => ({
												...p,
												is_live: true
											}));
											setPodcasts((ps) => ps.map((p) => p.id === selectedPodcast.id ? {
												...p,
												is_live: true
											} : p));
											showToast("🔴 You are LIVE! Users are being notified.", "live");
										} catch (e) {
											showToast("Could not go live. Try again.", "error");
										}
										setGoingLive(false);
									},
									style: {
										width: "100%",
										padding: "16px 0",
										background: goingLive ? "rgba(229,57,53,0.4)" : "linear-gradient(135deg,#e53935,#b71c1c)",
										border: "none",
										borderRadius: 16,
										color: "#fff",
										fontWeight: 800,
										fontSize: 17,
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: 10,
										boxShadow: "0 4px 24px rgba(229,57,53,0.35)"
									},
									children: goingLive ? "Going Live..." : "🔴 Go Live Now"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "rgba(255,255,255,0.3)",
										fontSize: 12,
										textAlign: "center",
										marginTop: 8
									},
									children: "Tapping Go Live notifies ALL Sachi users instantly via email"
								})
							] })]
						}),
						!isHost && currentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { marginBottom: 16 },
							children: selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
								const getEmbedUrl = (url) => {
									if (!url) return null;
									if (url.includes("rumble.com/c/")) return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, "")}`;
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
								const [showPlayer, setShowPlayer] = import_react.useState(false);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { marginBottom: 16 },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 8,
												marginBottom: 10
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
													width: 10,
													height: 10,
													background: "#e53935",
													borderRadius: "50%",
													animation: "pulse 1.2s infinite"
												} }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														color: "#e53935",
														fontWeight: 800,
														fontSize: 13,
														letterSpacing: 1
													},
													children: "LIVE NOW"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													style: {
														color: "rgba(255,255,255,0.35)",
														fontSize: 12
													},
													children: [
														"· ",
														selectedPodcast.listener_count || 0,
														" watching"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setShowPlayer(true),
											style: {
												display: "flex",
												width: "100%",
												padding: "16px 0",
												background: "linear-gradient(135deg,#e53935,#b71c1c)",
												border: "none",
												borderRadius: 16,
												color: "#fff",
												fontWeight: 800,
												fontSize: 17,
												cursor: "pointer",
												alignItems: "center",
												justifyContent: "center",
												gap: 10,
												marginBottom: 12,
												boxShadow: "0 4px 20px rgba(229,57,53,0.35)"
											},
											children: "🎧 Watch Live Now"
										}),
										showPlayer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												position: "fixed",
												top: 0,
												left: 0,
												width: "100vw",
												height: "100vh",
												background: "#000",
												zIndex: 9999,
												display: "flex",
												flexDirection: "column"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													style: {
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														padding: "12px 16px",
														background: "rgba(0,0,0,0.85)",
														flexShrink: 0
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														style: {
															display: "flex",
															alignItems: "center",
															gap: 10
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
															width: 10,
															height: 10,
															background: "#e53935",
															borderRadius: "50%",
															animation: "pulse 1.2s infinite"
														} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															style: {
																color: "#fff",
																fontWeight: 800,
																fontSize: 15
															},
															children: selectedPodcast.title
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setShowPlayer(false),
														style: {
															background: "rgba(255,255,255,0.15)",
															border: "none",
															color: "#fff",
															borderRadius: "50%",
															width: 34,
															height: 34,
															fontSize: 18,
															cursor: "pointer",
															display: "flex",
															alignItems: "center",
															justifyContent: "center"
														},
														children: "✕"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
													src: embedUrl,
													style: {
														flex: 1,
														width: "100%",
														border: "none"
													},
													allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
													allowFullScreen: true,
													title: selectedPodcast.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														padding: "10px 16px",
														background: "rgba(0,0,0,0.85)",
														textAlign: "center",
														flexShrink: 0
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															color: "rgba(255,255,255,0.35)",
															fontSize: 12
														},
														children: "Streaming via Sachi · sachistream.com"
													})
												})
											]
										})
									]
								});
							})() : !selectedPodcast.is_live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => showToast("🔔 You will be notified when " + selectedPodcast.title + " goes live!", "success"),
								style: {
									width: "100%",
									padding: "16px 0",
									background: "linear-gradient(135deg,#6c3cf7,#4527a0)",
									border: "none",
									borderRadius: 16,
									color: "#fff",
									fontWeight: 800,
									fontSize: 17,
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 10,
									marginBottom: 12
								},
								children: "🔔 Follow & Get Notified"
							}) : null
						}),
						!isHost && !currentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { marginBottom: 16 },
							children: selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
								const getEmbedUrl = (url) => {
									if (!url) return null;
									if (url.includes("rumble.com/c/")) return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, "")}`;
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
								return embedUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { marginBottom: 16 },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 8,
												marginBottom: 10
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
												width: 10,
												height: 10,
												background: "#e53935",
												borderRadius: "50%",
												animation: "pulse 1.2s infinite"
											} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													color: "#e53935",
													fontWeight: 800,
													fontSize: 13,
													letterSpacing: 1
												},
												children: "LIVE NOW"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												position: "relative",
												width: "100%",
												paddingBottom: "56.25%",
												borderRadius: 14,
												overflow: "hidden",
												background: "#000",
												boxShadow: "0 4px 24px rgba(229,57,53,0.25)"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
												src: embedUrl,
												style: {
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: "100%",
													border: "none"
												},
												allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
												allowFullScreen: true,
												title: selectedPodcast.title
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: onNeedAuth,
											style: {
												width: "100%",
												marginTop: 12,
												padding: "13px 0",
												background: "rgba(108,60,247,0.15)",
												border: "1px solid rgba(108,60,247,0.4)",
												borderRadius: 14,
												color: "#a78bfa",
												fontWeight: 700,
												fontSize: 15,
												cursor: "pointer"
											},
											children: "Sign in to Follow this Podcast"
										})
									]
								}) : null;
							})() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onNeedAuth,
								style: {
									width: "100%",
									padding: "16px 0",
									background: "linear-gradient(135deg,#6c3cf7,#4527a0)",
									border: "none",
									borderRadius: 16,
									color: "#fff",
									fontWeight: 800,
									fontSize: 16,
									cursor: "pointer",
									marginBottom: 16
								},
								children: "Sign in to Follow"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentEpisodes, {
							episodes: podcastEpisodes,
							loading: episodesLoading,
							onEpisodeClick: setSelectedEpisode
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								gap: 8,
								flexWrap: "wrap",
								marginTop: 16
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									background: "rgba(108,60,247,0.2)",
									border: "1px solid rgba(108,60,247,0.4)",
									borderRadius: 20,
									padding: "4px 14px",
									color: "#a78bfa",
									fontSize: 12,
									fontWeight: 600
								},
								children: selectedPodcast.category
							})
						})
					]
				})
			]
		});
	}
	if (showRegister) {
		const selectedCover = PODCAST_COVER_COLORS[registerForm.coverIdx || 0];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 600,
				background: "#0B0C1A",
				overflowY: "auto"
			},
			children: [toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, {
				msg: toast.msg,
				type: toast.type
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					padding: "20px",
					paddingTop: "calc(env(safe-area-inset-top,0px) + 20px)",
					paddingBottom: 60
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 12,
						marginBottom: 24
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowRegister(false),
						style: {
							background: "rgba(255,255,255,0.08)",
							border: "none",
							borderRadius: "50%",
							width: 38,
							height: 38,
							color: "#fff",
							fontSize: 20,
							cursor: "pointer",
							flexShrink: 0
						},
						children: "←"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 800,
							fontSize: 20
						},
						children: "🎙️ Register Your Podcast"
					})]
				}), registerDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						textAlign: "center",
						padding: "40px 20px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 72,
								marginBottom: 16
							},
							children: "🎉"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 800,
								fontSize: 24,
								marginBottom: 10
							},
							children: "You are on the list!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "rgba(255,255,255,0.5)",
								fontSize: 15,
								marginBottom: 8,
								lineHeight: 1.6
							},
							children: [
								"Your show is ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									style: { color: "#81c784" },
									children: "live on Sachi right now."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"No waiting. No approval needed."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(46,125,50,0.1)",
								border: "1px solid rgba(46,125,50,0.3)",
								borderRadius: 14,
								padding: 16,
								margin: "20px 0 28px",
								textAlign: "left"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#81c784",
									fontWeight: 700,
									fontSize: 13,
									marginBottom: 8
								},
								children: "⚡ You are all set — here's how to go live:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									color: "rgba(255,255,255,0.6)",
									fontSize: 13,
									lineHeight: 1.7
								},
								children: [
									"1. Go to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										style: { color: "#fff" },
										children: "Podcasts tab"
									}),
									" and find your show under \"My Shows\"",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"2. Tap your show to open it",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"3. (Optional) Add your stream link — YouTube Live, Twitch, etc.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"4. Tap ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										style: { color: "#e53935" },
										children: "🔴 Go Live Now"
									}),
									" — all Sachi users get notified instantly"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setRegisterDone(false);
								setShowRegister(false);
							},
							style: {
								background: "linear-gradient(135deg,#6c3cf7,#4527a0)",
								border: "none",
								borderRadius: 14,
								padding: "14px 36px",
								color: "#fff",
								fontWeight: 800,
								fontSize: 16,
								cursor: "pointer"
							},
							children: "Back to Podcasts"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 18
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "rgba(255,255,255,0.6)",
									fontSize: 13,
									marginBottom: 10,
									fontWeight: 600
								},
								children: "Choose Your Show Cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									gap: 10,
									flexWrap: "wrap"
								},
								children: PODCAST_COVER_COLORS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setRegisterForm((p) => ({
										...p,
										coverIdx: i
									})),
									style: {
										width: 52,
										height: 52,
										borderRadius: 14,
										background: c.bg,
										border: registerForm.coverIdx === i ? "3px solid #F5C842" : "3px solid transparent",
										cursor: "pointer",
										fontSize: 22,
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									},
									children: c.emoji
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									marginTop: 12,
									width: "100%",
									height: 70,
									borderRadius: 16,
									background: selectedCover.bg,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 12
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { fontSize: 32 },
									children: selectedCover.emoji
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										color: "#fff",
										fontWeight: 800,
										fontSize: 15,
										opacity: registerForm.title ? 1 : .4
									},
									children: registerForm.title || "Your Show Name"
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "rgba(255,255,255,0.6)",
								fontSize: 13,
								marginBottom: 6,
								fontWeight: 600
							},
							children: ["Podcast Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { color: "#e53935" },
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: registerForm.title,
							onChange: (e) => setRegisterForm((p) => ({
								...p,
								title: e.target.value
							})),
							placeholder: "e.g. The Daily Grind",
							style: {
								width: "100%",
								background: "rgba(255,255,255,0.06)",
								border: "1px solid rgba(255,255,255,0.12)",
								borderRadius: 12,
								padding: "13px 14px",
								color: "#fff",
								fontSize: 15,
								outline: "none",
								boxSizing: "border-box"
							}
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: "rgba(255,255,255,0.6)",
								fontSize: 13,
								marginBottom: 6,
								fontWeight: 600
							},
							children: ["Your Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { color: "#e53935" },
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: registerForm.host_name,
							onChange: (e) => setRegisterForm((p) => ({
								...p,
								host_name: e.target.value
							})),
							placeholder: "Full name or stage name",
							style: {
								width: "100%",
								background: "rgba(255,255,255,0.06)",
								border: "1px solid rgba(255,255,255,0.12)",
								borderRadius: 12,
								padding: "13px 14px",
								color: "#fff",
								fontSize: 15,
								outline: "none",
								boxSizing: "border-box"
							}
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.6)",
								fontSize: 13,
								marginBottom: 6,
								fontWeight: 600
							},
							children: "What is your podcast about?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: registerForm.description,
							onChange: (e) => setRegisterForm((p) => ({
								...p,
								description: e.target.value
							})),
							placeholder: "Tell listeners what to expect — topics, guests, vibe...",
							rows: 3,
							style: {
								width: "100%",
								background: "rgba(255,255,255,0.06)",
								border: "1px solid rgba(255,255,255,0.12)",
								borderRadius: 12,
								padding: "13px 14px",
								color: "#fff",
								fontSize: 15,
								outline: "none",
								resize: "none",
								boxSizing: "border-box"
							}
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.6)",
								fontSize: 13,
								marginBottom: 6,
								fontWeight: 600
							},
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: registerForm.category,
							onChange: (e) => setRegisterForm((p) => ({
								...p,
								category: e.target.value
							})),
							style: {
								width: "100%",
								background: "#1a1a2e",
								border: "1px solid rgba(255,255,255,0.12)",
								borderRadius: 12,
								padding: "13px 14px",
								color: "#fff",
								fontSize: 15,
								outline: "none"
							},
							children: [
								"Business",
								"News & Politics",
								"Entertainment",
								"Comedy",
								"Sports",
								"Technology",
								"Health & Wellness",
								"True Crime",
								"Society & Culture",
								"Education",
								"Other"
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								style: { background: "#111" },
								children: c
							}, c))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									color: "rgba(255,255,255,0.6)",
									fontSize: 13,
									marginBottom: 6,
									fontWeight: 600
								},
								children: ["Stream URL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										color: "rgba(255,255,255,0.25)",
										fontWeight: 400
									},
									children: "(optional — add later too)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: registerForm.live_stream_url,
								onChange: (e) => setRegisterForm((p) => ({
									...p,
									live_stream_url: e.target.value
								})),
								placeholder: "https://youtube.com/live/... or Twitch link",
								style: {
									width: "100%",
									background: "rgba(255,255,255,0.06)",
									border: "1px solid rgba(255,255,255,0.12)",
									borderRadius: 12,
									padding: "13px 14px",
									color: "#fff",
									fontSize: 15,
									outline: "none",
									boxSizing: "border-box"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "rgba(255,255,255,0.25)",
									fontSize: 12,
									marginTop: 5
								},
								children: "Where listeners will tune in when you go live. You can update this anytime."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleRegister,
							disabled: registering || !registerForm.title || !registerForm.host_name,
							style: {
								width: "100%",
								padding: "16px 0",
								background: !registerForm.title || !registerForm.host_name ? "rgba(108,60,247,0.3)" : registering ? "rgba(108,60,247,0.5)" : "linear-gradient(135deg,#6c3cf7,#4527a0)",
								border: "none",
								borderRadius: 16,
								color: "#fff",
								fontWeight: 800,
								fontSize: 17,
								cursor: !registerForm.title || !registerForm.host_name ? "not-allowed" : "pointer",
								marginTop: 4
							},
							children: registering ? "⏳ Submitting..." : "Submit My Podcast →"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.2)",
								fontSize: 12,
								textAlign: "center"
							},
							children: "Reviewed and approved within 24 hours"
						})
					]
				})]
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			paddingTop: 70,
			paddingBottom: 80,
			minHeight: "100svh",
			background: "#0B0C1A"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					margin: "0 16px 20px",
					background: "linear-gradient(135deg,#1a0a2e,#0d1b4b)",
					borderRadius: 20,
					padding: "24px 20px",
					position: "relative",
					overflow: "hidden"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							top: -20,
							right: -20,
							fontSize: 100,
							opacity: .07
						},
						children: "🎙️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#a78bfa",
							fontSize: 12,
							fontWeight: 700,
							letterSpacing: 1.5,
							textTransform: "uppercase",
							marginBottom: 8
						},
						children: "Sachi Podcasts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							color: "#fff",
							fontWeight: 800,
							fontSize: 22,
							lineHeight: 1.3,
							marginBottom: 8
						},
						children: [
							"Listen Live.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Discover New Shows."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "rgba(255,255,255,0.5)",
							fontSize: 13,
							marginBottom: 16,
							lineHeight: 1.5
						},
						children: "Tune into live sessions or browse on-demand — all in one place."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (!currentUser) {
								onNeedAuth();
								return;
							}
							setShowRegister(true);
						},
						style: {
							background: "linear-gradient(135deg,#6c3cf7,#4527a0)",
							border: "none",
							borderRadius: 12,
							padding: "10px 20px",
							color: "#fff",
							fontWeight: 700,
							fontSize: 14,
							cursor: "pointer"
						},
						children: "🎙️ Register Your Podcast"
					})
				]
			}),
			currentUser && myShows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { margin: "0 16px 20px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#F5C842",
						fontWeight: 700,
						fontSize: 13,
						letterSpacing: 1.2,
						textTransform: "uppercase",
						marginBottom: 12
					},
					children: "🎙️ My Shows"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 10
					},
					children: myShows.map((p) => {
						const coverBg = p.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
						const coverEmoji = p.cover_emoji || "🎙️";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: async () => {
								setSelectedPodcast(p);
								setEpisodesLoading(true);
								setPodcastEpisodes([]);
								try {
									const token = localStorage.getItem("token");
									const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
									const json = await (await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs })).json();
									setPodcastEpisodes((Array.isArray(json) ? json : json?.records || json?.items || []).filter((ep) => ep.podcast_id === p.id).sort((a, b) => (b.episode_number || 0) - (a.episode_number || 0)));
								} catch (e) {
									setPodcastEpisodes([]);
								} finally {
									setEpisodesLoading(false);
								}
							},
							style: {
								background: "rgba(245,200,66,0.05)",
								border: "1px solid rgba(245,200,66,0.2)",
								borderRadius: 16,
								padding: 14,
								cursor: "pointer",
								display: "flex",
								gap: 14,
								alignItems: "center"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 52,
										height: 52,
										borderRadius: 12,
										background: coverBg,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: 24,
										flexShrink: 0
									},
									children: coverEmoji
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										minWidth: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 8,
												marginBottom: 3
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													color: "#fff",
													fontWeight: 700,
													fontSize: 15,
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis"
												},
												children: p.title
											}), p.is_live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													background: "#e53935",
													borderRadius: 20,
													padding: "2px 8px",
													color: "#fff",
													fontWeight: 700,
													fontSize: 10,
													flexShrink: 0
												},
												children: "LIVE"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												color: "rgba(255,255,255,0.4)",
												fontSize: 12,
												marginBottom: 4
											},
											children: ["by ", p.host_name]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												display: "inline-block",
												background: p.is_live ? "rgba(229,57,53,0.2)" : "rgba(46,125,50,0.2)",
												borderRadius: 20,
												padding: "2px 10px",
												color: p.is_live ? "#ef9a9a" : "#81c784",
												fontSize: 11,
												fontWeight: 700
											},
											children: p.is_live ? "🔴 Live Now" : "✅ Active"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "rgba(255,255,255,0.2)",
										fontSize: 20
									},
									children: "›"
								})
							]
						}, p.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { padding: "0 16px 4px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 8,
						marginBottom: 14
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: 8,
							height: 8,
							borderRadius: "50%",
							background: "#e53935",
							animation: "heartbeat 1.4s ease-in-out infinite"
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								color: "#fff",
								fontWeight: 800,
								fontSize: 16
							},
							children: "Live News"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								color: "rgba(255,255,255,0.3)",
								fontSize: 12
							},
							children: "• tap to watch"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						overflowX: "auto",
						display: "flex",
						gap: 12,
						paddingBottom: 16,
						scrollbarWidth: "none"
					},
					children: LIVE_NEWS_CHANNELS.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setLiveNewsChannel(ch),
						style: {
							flexShrink: 0,
							width: 140,
							borderRadius: 16,
							overflow: "hidden",
							cursor: "pointer",
							position: "relative"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								height: 80,
								background: ch.color,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 36
							},
							children: ch.emoji
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(255,255,255,0.05)",
								border: "1px solid rgba(255,255,255,0.08)",
								borderTop: "none",
								borderRadius: "0 0 16px 16px",
								padding: "8px 10px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 5,
									marginBottom: 2
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: 5,
									height: 5,
									borderRadius: "50%",
									background: "#e53935",
									flexShrink: 0
								} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										color: "#fff",
										fontWeight: 700,
										fontSize: 13,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis"
									},
									children: ch.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "rgba(255,255,255,0.4)",
									fontSize: 10,
									lineHeight: 1.3
								},
								children: ch.desc
							})]
						})]
					}, ch.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					overflowX: "auto",
					display: "flex",
					gap: 8,
					padding: "0 16px 16px",
					scrollbarWidth: "none"
				},
				children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSelectedCat(cat),
					style: {
						flexShrink: 0,
						padding: "7px 16px",
						borderRadius: 20,
						border: "none",
						cursor: "pointer",
						fontWeight: 600,
						fontSize: 13,
						background: selectedCat === cat ? "#6c3cf7" : "rgba(255,255,255,0.07)",
						color: selectedCat === cat ? "#fff" : "rgba(255,255,255,0.5)",
						WebkitTapHighlightColor: "transparent"
					},
					children: cat
				}, cat))
			}),
			livePodcasts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { marginBottom: 24 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "0 16px 12px",
						display: "flex",
						alignItems: "center",
						gap: 8
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 8,
						height: 8,
						borderRadius: "50%",
						background: "#e53935"
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							color: "#fff",
							fontWeight: 800,
							fontSize: 16
						},
						children: "Live Now"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						gap: 12,
						padding: "0 16px",
						overflowX: "auto",
						scrollbarWidth: "none"
					},
					children: livePodcasts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: async () => {
							setSelectedPodcast(p);
							setEpisodesLoading(true);
							setPodcastEpisodes([]);
							try {
								const token = localStorage.getItem("token");
								const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
								const json = await (await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs })).json();
								setPodcastEpisodes((Array.isArray(json) ? json : json?.records || json?.items || []).filter((ep) => ep.podcast_id === p.id).sort((a, b) => (b.episode_number || 0) - (a.episode_number || 0)));
							} catch (e) {
								setPodcastEpisodes([]);
							} finally {
								setEpisodesLoading(false);
							}
						},
						style: {
							flexShrink: 0,
							width: 200,
							background: "rgba(229,57,53,0.08)",
							border: "1.5px solid rgba(229,57,53,0.3)",
							borderRadius: 16,
							padding: 16,
							cursor: "pointer"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									background: "#e53935",
									display: "inline-flex",
									alignItems: "center",
									gap: 5,
									borderRadius: 20,
									padding: "3px 10px",
									marginBottom: 10
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#fff"
								} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										color: "#fff",
										fontWeight: 700,
										fontSize: 11
									},
									children: "LIVE"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 28,
									marginBottom: 8
								},
								children: "🎙️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#fff",
									fontWeight: 700,
									fontSize: 15,
									marginBottom: 4
								},
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "rgba(255,255,255,0.5)",
									fontSize: 12,
									marginBottom: 8
								},
								children: p.host_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									color: "#e53935",
									fontSize: 12,
									fontWeight: 600
								},
								children: [
									"🎧 ",
									p.listener_count || 0,
									" listening"
								]
							})
						]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { padding: "0 16px" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "rgba(255,255,255,0.5)",
							fontSize: 13,
							fontWeight: 700,
							marginBottom: 12,
							letterSpacing: 1,
							textTransform: "uppercase"
						},
						children: selectedCat === "All" ? "All Shows" : selectedCat
					}),
					loadingPodcasts && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							textAlign: "center",
							padding: "60px 0",
							color: "rgba(245,200,66,0.5)",
							fontSize: 14
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 40,
								marginBottom: 12,
								animation: "spin 1.5s linear infinite",
								display: "inline-block"
							},
							children: "⟳"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading podcasts..." })]
					}),
					!loadingPodcasts && regularPodcasts.length === 0 && livePodcasts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							textAlign: "center",
							padding: "60px 0",
							color: "rgba(255,255,255,0.25)",
							fontSize: 14
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 48,
								marginBottom: 12
							},
							children: "🎙️"
						}), "No podcasts in this category yet."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 12
						},
						children: regularPodcasts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: async () => {
								setSelectedPodcast(p);
								setEpisodesLoading(true);
								setPodcastEpisodes([]);
								try {
									const token = localStorage.getItem("token");
									const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
									const json = await (await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs })).json();
									setPodcastEpisodes((Array.isArray(json) ? json : json?.records || json?.items || []).filter((ep) => ep.podcast_id === p.id).sort((a, b) => (b.episode_number || 0) - (a.episode_number || 0)));
								} catch (e) {
									setPodcastEpisodes([]);
								} finally {
									setEpisodesLoading(false);
								}
							},
							style: {
								background: "rgba(255,255,255,0.04)",
								border: "1px solid rgba(255,255,255,0.07)",
								borderRadius: 16,
								padding: 16,
								cursor: "pointer",
								display: "flex",
								gap: 14,
								alignItems: "center"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 64,
										height: 64,
										borderRadius: 12,
										background: "linear-gradient(135deg,#1a0a2e,#0d1b4b)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: 28,
										flexShrink: 0
									},
									children: "🎙️"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										minWidth: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 700,
												fontSize: 15,
												marginBottom: 2,
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis"
											},
											children: p.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "rgba(255,255,255,0.45)",
												fontSize: 12,
												marginBottom: 6
											},
											children: p.host_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												gap: 10,
												alignItems: "center"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													background: "rgba(108,60,247,0.2)",
													borderRadius: 20,
													padding: "2px 10px",
													color: "#a78bfa",
													fontSize: 11,
													fontWeight: 600
												},
												children: p.category
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													color: "rgba(255,255,255,0.25)",
													fontSize: 11
												},
												children: [p.follower_count || 0, " followers"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "rgba(255,255,255,0.2)",
										fontSize: 20
									},
									children: "›"
								})
							]
						}, p.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					margin: "32px 16px 0",
					background: "rgba(108,60,247,0.08)",
					border: "1px solid rgba(108,60,247,0.2)",
					borderRadius: 20,
					padding: 24,
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 32,
							marginBottom: 12
						},
						children: "🚀"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#fff",
							fontWeight: 800,
							fontSize: 18,
							marginBottom: 8
						},
						children: "Have a podcast?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "rgba(255,255,255,0.5)",
							fontSize: 14,
							marginBottom: 16,
							lineHeight: 1.5
						},
						children: "Join Sachi and reach new listeners through our For You feed every day."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (!currentUser) {
								onNeedAuth();
								return;
							}
							setShowRegister(true);
						},
						style: {
							background: "linear-gradient(135deg,#6c3cf7,#4527a0)",
							border: "none",
							borderRadius: 14,
							padding: "13px 28px",
							color: "#fff",
							fontWeight: 800,
							fontSize: 15,
							cursor: "pointer"
						},
						children: "Get Started Free →"
					})
				]
			})
		]
	});
}
function AdminPanel({ currentUser }) {
	const [modTab, setModTab] = (0, import_react.useState)("videos");
	const [allVideos, setAllVideos] = (0, import_react.useState)([]);
	const [allUsers, setAllUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [analyticsLoading, setAnalyticsLoading] = (0, import_react.useState)(false);
	const [analyticsData, setAnalyticsData] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
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
		try {
			const [vRes, uRes, cRes] = await Promise.all([
				request("GET", "/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo?limit=500&sort=-created_date"),
				request("GET", "/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser?limit=500&sort=-created_date"),
				request("GET", "/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiComment?limit=500&sort=-created_date")
			]);
			const videos = vRes.items || vRes || [];
			const users = uRes.items || uRes || [];
			const comments = cRes.items || cRes || [];
			setAllUsers(users);
			const now = /* @__PURE__ */ new Date();
			const days = Array.from({ length: 14 }, (_, i) => {
				const d = new Date(now);
				d.setDate(d.getDate() - (13 - i));
				return d.toISOString().slice(0, 10);
			});
			const byDay = (arr, dateField) => {
				const map = {};
				days.forEach((d) => map[d] = 0);
				arr.forEach((item) => {
					const d = (item[dateField] || "").slice(0, 10);
					if (map[d] !== void 0) map[d]++;
				});
				return days.map((d) => ({
					date: d,
					count: map[d]
				}));
			};
			const creatorMap = {};
			videos.forEach((v) => {
				const u = v.username || "unknown";
				creatorMap[u] = (creatorMap[u] || 0) + 1;
			});
			const topCreators = Object.entries(creatorMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([username, count]) => ({
				username,
				count
			}));
			const topVideos = [...videos].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);
			const totalViews = videos.reduce((s, v) => s + (v.views_count || 0), 0);
			const totalLikes = videos.reduce((s, v) => s + (v.likes_count || 0), 0);
			const matureCount = videos.filter((v) => v.is_mature).length;
			const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const weekAgo = /* @__PURE__ */ new Date();
			weekAgo.setDate(weekAgo.getDate() - 7);
			const newToday = users.filter((u) => (u.created_date || "").slice(0, 10) === todayStr).length;
			const newThisWeek = users.filter((u) => new Date(u.created_date) >= weekAgo).length;
			const recentUsers = [...users].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 20);
			setAnalyticsData({
				totalVideos: videos.length,
				totalUsers: users.length,
				totalComments: comments.length,
				totalViews,
				totalLikes,
				matureCount,
				newToday,
				newThisWeek,
				dailyVideos: byDay(videos, "created_date"),
				dailyUsers: byDay(users, "created_date"),
				topCreators,
				topVideos,
				recentUsers
			});
		} catch (e) {
			console.error("analytics error", e);
		}
		setAnalyticsLoading(false);
	};
	(0, import_react.useEffect)(() => {
		loadVideos();
	}, []);
	(0, import_react.useEffect)(() => {
		if (modTab === "analytics") loadAnalytics();
	}, [modTab]);
	(0, import_react.useEffect)(() => {
		if (modTab === "users") loadRegisteredUsers();
	}, [modTab]);
	const [registeredUsers, setRegisteredUsers] = (0, import_react.useState)([]);
	const [usersLoading, setUsersLoading] = (0, import_react.useState)(false);
	const loadRegisteredUsers = async () => {
		setUsersLoading(true);
		try {
			const res = await request("GET", "/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser?limit=500&sort=-created_date");
			setRegisteredUsers(res.items || res || []);
		} catch (e) {
			console.error(e);
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
			setAllVideos((prev) => prev.map((v) => v.id === video.id ? {
				...v,
				is_mature: newMature,
				mature_reason: newMature ? reason || "other" : null
			} : v));
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
			setAllVideos((prev) => prev.filter((v) => v.id !== video.id));
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
			setAllVideos((prev) => prev.map((v) => v.id === video.id ? {
				...v,
				is_ai_detected: newFlag
			} : v));
		} catch (e) {
			alert("Failed to update: " + e.message);
		}
		setSaving(null);
	};
	const filtered = allVideos.filter((v) => {
		if (filter === "mature" && !v.is_mature) return false;
		if (filter === "clean" && v.is_mature) return false;
		if (search && !((v.caption || "").toLowerCase().includes(search.toLowerCase()) || (v.username || "").toLowerCase().includes(search.toLowerCase()))) return false;
		return true;
	});
	const reasons = [
		"violence",
		"fighting",
		"adult_themes",
		"strong_language",
		"other"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			minHeight: "100svh",
			background: "#0B0C1A",
			paddingBottom: 120,
			paddingTop: 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: "rgba(14,14,28,0.98)",
					borderBottom: "1px solid rgba(245,200,66,0.15)",
					padding: "16px 20px 10px",
					position: "sticky",
					top: 0,
					zIndex: 100
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: 12
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#F5C842",
								fontWeight: 900,
								fontSize: 20
							},
							children: "🛡️ Mod Panel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => modTab === "analytics" ? loadAnalytics() : loadVideos(),
							style: {
								background: "rgba(255,255,255,0.07)",
								border: "none",
								borderRadius: 20,
								padding: "7px 14px",
								color: "#888",
								fontWeight: 700,
								fontSize: 12,
								cursor: "pointer"
							},
							children: "↻ Refresh"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 6,
							marginBottom: modTab === "videos" ? 10 : 0
						},
						children: [
							["videos", "🎬 Videos"],
							["ai", "🤖 AI Flagged"],
							["users", "👥 Users"],
							["analytics", "📊 Analytics"]
						].map(([val, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						}, val))
					}),
					modTab === "videos" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search by caption or username…",
						style: {
							width: "100%",
							boxSizing: "border-box",
							background: "rgba(255,255,255,0.07)",
							border: "1px solid rgba(255,255,255,0.1)",
							borderRadius: 12,
							padding: "10px 14px",
							color: "#fff",
							fontSize: 14,
							outline: "none",
							marginBottom: 10
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 8
						},
						children: [
							["all", "All"],
							["mature", "🔞 Mature"],
							["clean", "✅ Clean"]
						].map(([val, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						}, val))
					})] })
				]
			}),
			modTab === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { padding: "16px 16px 20px" },
				children: analyticsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						textAlign: "center",
						color: "#555",
						padding: 60,
						fontSize: 14
					},
					children: "Loading analytics…"
				}) : !analyticsData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						textAlign: "center",
						color: "#555",
						padding: 60,
						fontSize: 14
					},
					children: "No data yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 10,
							marginBottom: 20
						},
						children: [
							[
								"👥",
								"Users",
								analyticsData.totalUsers,
								"#6B8AFF"
							],
							[
								"🎬",
								"Videos",
								analyticsData.totalVideos,
								"#F5C842"
							],
							[
								"💬",
								"Comments",
								analyticsData.totalComments,
								"#FF6B6B"
							],
							[
								"👁",
								"Views",
								analyticsData.totalViews,
								"#6BFFB8"
							],
							[
								"❤️",
								"Likes",
								analyticsData.totalLikes,
								"#FF9500"
							],
							[
								"🔞",
								"Mature",
								analyticsData.matureCount,
								"#FF6B6B"
							]
						].map(([icon, label, val, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(255,255,255,0.04)",
								borderRadius: 14,
								padding: "12px 10px",
								textAlign: "center",
								border: `1px solid ${color}22`
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 18,
										marginBottom: 3
									},
									children: icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color,
										fontWeight: 900,
										fontSize: 18,
										lineHeight: 1
									},
									children: val.toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#555",
										fontSize: 10,
										marginTop: 3
									},
									children: label
								})
							]
						}, label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(107,138,255,0.07)",
							borderRadius: 16,
							padding: "14px 16px",
							marginBottom: 14,
							border: "1px solid rgba(107,138,255,0.2)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#6B8AFF",
									fontWeight: 900,
									fontSize: 15,
									marginBottom: 12
								},
								children: "👥 User Registrations"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									gap: 10,
									marginBottom: 14
								},
								children: [
									[
										"Today",
										analyticsData.newToday,
										"#6BFFB8"
									],
									[
										"This Week",
										analyticsData.newThisWeek,
										"#F5C842"
									],
									[
										"All Time",
										analyticsData.totalUsers,
										"#6B8AFF"
									]
								].map(([label, val, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										background: "rgba(255,255,255,0.04)",
										borderRadius: 12,
										padding: "10px 6px",
										textAlign: "center"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color,
											fontWeight: 900,
											fontSize: 22,
											lineHeight: 1
										},
										children: val
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#555",
											fontSize: 10,
											marginTop: 4
										},
										children: label
									})]
								}, label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#888",
									fontWeight: 700,
									fontSize: 11,
									marginBottom: 8,
									letterSpacing: .5,
									textTransform: "uppercase"
								},
								children: "Recent Sign-ups"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 6
								},
								children: (analyticsData.recentUsers || []).map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 10,
										background: "rgba(255,255,255,0.03)",
										borderRadius: 10,
										padding: "8px 10px"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || u.email || "?")}&background=random&color=fff&size=64&bold=true&format=png`,
											style: {
												width: 28,
												height: 28,
												borderRadius: "50%",
												flexShrink: 0,
												objectFit: "cover"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												flex: 1,
												minWidth: 0
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													color: "#fff",
													fontSize: 13,
													fontWeight: 600,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap"
												},
												children: u.display_name || u.username || "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													color: "#555",
													fontSize: 11,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap"
												},
												children: u.email || "@" + (u.username || "")
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#444",
												fontSize: 10,
												flexShrink: 0
											},
											children: u.created_date ? new Date(u.created_date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric"
											}) : ""
										})
									]
								}, i))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(255,255,255,0.04)",
							borderRadius: 16,
							padding: "14px 16px",
							marginBottom: 14,
							border: "1px solid rgba(245,200,66,0.1)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#F5C842",
								fontWeight: 800,
								fontSize: 14,
								marginBottom: 12
							},
							children: "📈 Daily Videos (14 days)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								alignItems: "flex-end",
								gap: 4,
								height: 60
							},
							children: analyticsData.dailyVideos.map(({ date, count }, i) => {
								const maxV = Math.max(...analyticsData.dailyVideos.map((d) => d.count), 1);
								const h = Math.max(count / maxV * 56, count > 0 ? 4 : 1);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 2
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												fontSize: 9,
												color: "#555"
											},
											children: count > 0 ? count : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
											width: "100%",
											height: h,
											borderRadius: 3,
											background: count > 0 ? "linear-gradient(180deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.06)",
											transition: "height 0.3s"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												fontSize: 8,
												color: "#444",
												writingMode: "vertical-rl",
												transform: "rotate(180deg)",
												height: 22,
												overflow: "hidden"
											},
											children: date.slice(5)
										})
									]
								}, i);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(255,255,255,0.04)",
							borderRadius: 16,
							padding: "14px 16px",
							marginBottom: 14,
							border: "1px solid rgba(107,138,255,0.15)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#6B8AFF",
								fontWeight: 800,
								fontSize: 14,
								marginBottom: 12
							},
							children: "👥 Daily New Users (14 days)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								alignItems: "flex-end",
								gap: 4,
								height: 60
							},
							children: analyticsData.dailyUsers.map(({ date, count }, i) => {
								const maxV = Math.max(...analyticsData.dailyUsers.map((d) => d.count), 1);
								const h = Math.max(count / maxV * 56, count > 0 ? 4 : 1);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 2
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												fontSize: 9,
												color: "#555"
											},
											children: count > 0 ? count : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
											width: "100%",
											height: h,
											borderRadius: 3,
											background: count > 0 ? "linear-gradient(180deg,#6B8AFF,#4A67FF)" : "rgba(255,255,255,0.06)",
											transition: "height 0.3s"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												fontSize: 8,
												color: "#444",
												writingMode: "vertical-rl",
												transform: "rotate(180deg)",
												height: 22,
												overflow: "hidden"
											},
											children: date.slice(5)
										})
									]
								}, i);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(255,255,255,0.04)",
							borderRadius: 16,
							padding: "14px 16px",
							marginBottom: 14,
							border: "1px solid rgba(107,255,184,0.1)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#6BFFB8",
								fontWeight: 800,
								fontSize: 14,
								marginBottom: 10
							},
							children: "🏆 Top Creators"
						}), analyticsData.topCreators.map(({ username, count }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 10,
								marginBottom: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										color: "#F5C842",
										fontWeight: 900,
										fontSize: 13,
										width: 18
									},
									children: ["#", i + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										color: "#fff",
										fontSize: 13
									},
									children: ["@", username]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										background: "rgba(245,200,66,0.15)",
										color: "#F5C842",
										fontWeight: 800,
										fontSize: 12,
										padding: "3px 10px",
										borderRadius: 20
									},
									children: [count, " videos"]
								})
							]
						}, i))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(255,255,255,0.04)",
							borderRadius: 16,
							padding: "14px 16px",
							border: "1px solid rgba(255,107,107,0.1)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#FF6B6B",
								fontWeight: 800,
								fontSize: 14,
								marginBottom: 10
							},
							children: "🔥 Top Videos by Views"
						}), analyticsData.topVideos.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 10,
								marginBottom: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										color: "#F5C842",
										fontWeight: 900,
										fontSize: 13,
										width: 18
									},
									children: ["#", i + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 36,
										height: 44,
										borderRadius: 8,
										overflow: "hidden",
										flexShrink: 0,
										background: "#1a1a2e"
									},
									children: v.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: resolveMediaUrl(v.thumbnail_url),
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover"
										}
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#333",
											fontSize: 16,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											height: "100%"
										},
										children: "🎬"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										minWidth: 0
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: "#fff",
											fontSize: 12,
											fontWeight: 600,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap"
										},
										children: v.caption || "(no caption)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											color: "#555",
											fontSize: 11
										},
										children: [
											"@",
											v.username,
											" · 👁 ",
											(v.views_count || 0).toLocaleString()
										]
									})]
								})
							]
						}, i))]
					})
				] })
			}),
			modTab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { padding: "16px 16px 20px" },
				children: usersLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						textAlign: "center",
						color: "#555",
						padding: 60,
						fontSize: 14
					},
					children: "Loading users…"
				}) : (() => {
					const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
					const weekAgo = /* @__PURE__ */ new Date();
					weekAgo.setDate(weekAgo.getDate() - 7);
					const newToday = registeredUsers.filter((u) => (u.created_date || "").slice(0, 10) === todayStr).length;
					const newThisWeek = registeredUsers.filter((u) => new Date(u.created_date) >= weekAgo).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 10,
							marginBottom: 20
						},
						children: [
							[
								"👥",
								"Total",
								registeredUsers.length,
								"#6B8AFF"
							],
							[
								"🌅",
								"Today",
								newToday,
								"#6BFFB8"
							],
							[
								"📅",
								"This Week",
								newThisWeek,
								"#F5C842"
							]
						].map(([icon, label, val, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(255,255,255,0.04)",
								borderRadius: 14,
								padding: "14px 10px",
								textAlign: "center",
								border: `1px solid ${color}33`
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 20,
										marginBottom: 4
									},
									children: icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color,
										fontWeight: 900,
										fontSize: 26,
										lineHeight: 1
									},
									children: val
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#555",
										fontSize: 11,
										marginTop: 4
									},
									children: label
								})
							]
						}, label))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(107,138,255,0.06)",
							borderRadius: 16,
							border: "1px solid rgba(107,138,255,0.15)",
							overflow: "hidden"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								padding: "12px 16px",
								borderBottom: "1px solid rgba(255,255,255,0.06)",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#6B8AFF",
									fontWeight: 800,
									fontSize: 14
								},
								children: "All Registered Users"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									color: "#444",
									fontSize: 12
								},
								children: [registeredUsers.length, " total"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								maxHeight: 500,
								overflowY: "auto"
							},
							children: [registeredUsers.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 12,
									padding: "10px 16px",
									borderBottom: "1px solid rgba(255,255,255,0.04)",
									background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || u.email || "?")}&background=random&color=fff&size=64&bold=true&format=png`,
										style: {
											width: 36,
											height: 36,
											borderRadius: "50%",
											flexShrink: 0,
											objectFit: "cover",
											border: "2px solid rgba(107,138,255,0.3)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											flex: 1,
											minWidth: 0
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 700,
												fontSize: 14,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap"
											},
											children: u.display_name || u.username || "—"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												color: "#555",
												fontSize: 11,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap"
											},
											children: [
												"@",
												u.username || "?",
												" · ",
												u.email || "no email"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											flexShrink: 0,
											textAlign: "right"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#444",
												fontSize: 11
											},
											children: u.created_date ? new Date(u.created_date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "2-digit"
											}) : ""
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: u.status === "active" ? "#6BFFB8" : "#FF6B6B",
												fontSize: 10,
												fontWeight: 700,
												marginTop: 2
											},
											children: u.status || "active"
										})]
									})
								]
							}, u.id || i)), registeredUsers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									textAlign: "center",
									color: "#444",
									padding: 40,
									fontSize: 13
								},
								children: "No users yet."
							})]
						})]
					})] });
				})()
			}),
			modTab === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { padding: "16px" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 12,
							marginBottom: 16
						},
						children: [
							[
								"⏳ Pending Review",
								allVideos.filter((v) => v.is_ai_detected && !v.is_approved).length,
								"#FF9500"
							],
							[
								"🤖 Live AI Posts",
								allVideos.filter((v) => v.is_ai_detected && v.is_approved).length,
								"#ffcc44"
							],
							[
								"✅ Clean Posts",
								allVideos.filter((v) => !v.is_ai_detected && v.is_approved).length,
								"#6BFFB8"
							]
						].map(([label, count, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								flex: 1,
								background: "rgba(255,255,255,0.04)",
								borderRadius: 12,
								padding: "10px 0",
								textAlign: "center",
								border: `1px solid ${color}22`
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color,
									fontWeight: 900,
									fontSize: 20
								},
								children: count
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#555",
									fontSize: 11
								},
								children: label
							})]
						}, label))
					}),
					allVideos.filter((v) => v.is_ai_detected && !v.is_approved).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginBottom: 20 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#FF9500",
								fontWeight: 800,
								fontSize: 13,
								marginBottom: 10,
								display: "flex",
								alignItems: "center",
								gap: 6
							},
							children: "⏳ Pending Your Review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: 12
							},
							children: allVideos.filter((v) => v.is_ai_detected && !v.is_approved).map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									background: "rgba(255,149,0,0.08)",
									borderRadius: 16,
									border: "2px solid rgba(255,149,0,0.5)",
									overflow: "hidden"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										gap: 12,
										padding: "12px 14px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 64,
											height: 80,
											borderRadius: 10,
											overflow: "hidden",
											flexShrink: 0,
											background: "#1a1a2e"
										},
										children: video.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: video.thumbnail_url,
											style: {
												width: "100%",
												height: "100%",
												objectFit: "cover"
											}
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												width: "100%",
												height: "100%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "#444",
												fontSize: 24
											},
											children: "🎬"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											flex: 1,
											minWidth: 0
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: 6,
													marginBottom: 4
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: 11,
														background: "rgba(255,149,0,0.3)",
														color: "#FF9500",
														padding: "2px 8px",
														borderRadius: 20,
														fontWeight: 700
													},
													children: "⏳ Awaiting MOD"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													color: "#aaa",
													fontSize: 11,
													marginBottom: 3
												},
												children: ["@", video.username || "unknown"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													color: "#fff",
													fontSize: 13,
													fontWeight: 600,
													marginBottom: 6,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap"
												},
												children: video.caption || "(no caption)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													fontSize: 11,
													color: "#FF9500"
												},
												children: "Creator self-disclosed as AI"
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										gap: 0,
										borderTop: "1px solid rgba(255,255,255,0.05)"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: async () => {
											setSaving(video.id);
											await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/${video.id}`, { is_approved: true });
											setAllVideos((p) => p.map((v) => v.id === video.id ? {
												...v,
												is_approved: true
											} : v));
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
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
									})]
								})]
							}, video.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#ffcc44",
							fontWeight: 800,
							fontSize: 13,
							marginBottom: 10
						},
						children: "🤖 Live AI-Badged Posts"
					}),
					allVideos.filter((v) => v.is_ai_detected && v.is_approved).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							textAlign: "center",
							color: "#555",
							padding: 24
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 12,
								color: "#444"
							},
							children: "No approved AI posts yet."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 12
						},
						children: allVideos.filter((v) => v.is_ai_detected && v.is_approved).map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(255,149,0,0.06)",
								borderRadius: 16,
								border: "1px solid rgba(255,149,0,0.3)",
								overflow: "hidden"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: 12,
									padding: "12px 14px"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 64,
										height: 80,
										borderRadius: 10,
										overflow: "hidden",
										flexShrink: 0,
										background: "#1a1a2e"
									},
									children: video.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: video.thumbnail_url,
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover"
										}
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: "100%",
											height: "100%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#444",
											fontSize: 24
										},
										children: "🎬"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										flex: 1,
										minWidth: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 6,
												marginBottom: 4
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: 11,
													background: "rgba(255,149,0,0.2)",
													color: "#FF9500",
													padding: "2px 8px",
													borderRadius: 20,
													fontWeight: 700
												},
												children: "🤖 AI Detected"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												color: "#aaa",
												fontSize: 11,
												marginBottom: 3
											},
											children: ["@", video.username || "unknown"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontSize: 13,
												fontWeight: 600,
												marginBottom: 6,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap"
											},
											children: video.caption || "(no caption)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												gap: 8
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												style: {
													fontSize: 11,
													color: "#555"
												},
												children: ["👁 ", video.views_count || 0]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												style: {
													fontSize: 11,
													color: "#555"
												},
												children: ["❤️ ", video.likes_count || 0]
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: 0,
									borderTop: "1px solid rgba(255,255,255,0.05)"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								})]
							})]
						}, video.id))
					})
				]
			}),
			modTab === "videos" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					display: "flex",
					gap: 12,
					padding: "12px 20px"
				},
				children: [
					[
						"Total",
						allVideos.length,
						"#F5C842"
					],
					[
						"Mature",
						allVideos.filter((v) => v.is_mature).length,
						"#ff6b6b"
					],
					[
						"Clean",
						allVideos.filter((v) => !v.is_mature).length,
						"#6bff9a"
					]
				].map(([label, count, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						background: "rgba(255,255,255,0.04)",
						borderRadius: 12,
						padding: "10px 0",
						textAlign: "center",
						border: `1px solid ${color}22`
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color,
							fontWeight: 900,
							fontSize: 20
						},
						children: count
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#555",
							fontSize: 11
						},
						children: label
					})]
				}, label))
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					textAlign: "center",
					color: "#555",
					padding: 40
				},
				children: "Loading videos…"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					textAlign: "center",
					color: "#555",
					padding: 40
				},
				children: "No videos match this filter."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					padding: "0 16px",
					display: "flex",
					flexDirection: "column",
					gap: 12
				},
				children: filtered.map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "rgba(255,255,255,0.04)",
						borderRadius: 16,
						border: `1px solid ${video.is_mature ? "rgba(255,107,107,0.3)" : "rgba(255,255,255,0.07)"}`,
						overflow: "hidden"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 12,
							padding: "12px 14px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 64,
								height: 80,
								borderRadius: 10,
								overflow: "hidden",
								flexShrink: 0,
								background: "#1a1a2e"
							},
							children: video.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: video.thumbnail_url,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#444",
									fontSize: 24
								},
								children: "🎬"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								flex: 1,
								minWidth: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										color: "#aaa",
										fontSize: 11,
										marginBottom: 3
									},
									children: ["@", video.username || "unknown"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#fff",
										fontSize: 13,
										fontWeight: 600,
										marginBottom: 6,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap"
									},
									children: video.caption || "(no caption)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										gap: 8,
										flexWrap: "wrap",
										marginBottom: 6
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												fontSize: 11,
												color: "#555"
											},
											children: ["👁 ", video.views_count || 0]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												fontSize: 11,
												color: "#555"
											},
											children: ["❤️ ", video.likes_count || 0]
										}),
										video.is_mature && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												fontSize: 11,
												background: "rgba(255,107,107,0.2)",
												color: "#ff6b6b",
												padding: "2px 8px",
												borderRadius: 20,
												fontWeight: 700
											},
											children: ["🔞 ", (video.mature_reason || "mature").replace(/_/g, " ")]
										})
									]
								}),
								video.is_mature && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: video.mature_reason || "other",
									onChange: (e) => toggleMature({
										...video,
										is_mature: true
									}, e.target.value),
									style: {
										width: "100%",
										padding: "6px 10px",
										background: "rgba(255,255,255,0.06)",
										border: "1px solid rgba(255,107,107,0.3)",
										borderRadius: 8,
										color: "#fff",
										fontSize: 12,
										outline: "none",
										marginBottom: 4
									},
									children: reasons.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: r,
										children: r.replace(/_/g, " ")
									}, r))
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 0,
							borderTop: "1px solid rgba(255,255,255,0.05)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						})]
					})]
				}, video.id))
			})] })
		]
	});
}
function App() {
	const path = window.location.pathname;
	if (path === "/terms") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terms, {});
	if (path === "/privacy") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Privacy, {});
	const [hasEntered, setHasEntered] = (0, import_react.useState)(false);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(() => auth.getUser());
	(0, import_react.useEffect)(() => {
		handleGoogleRedirectCallback().then((result) => {
			if (!result) return;
			if (result.sessionUser) {
				setCurrentUser(result.sessionUser);
				setFeedKey((k) => k + 1);
				setLoginToast(true);
				setTimeout(() => setLoginToast(false), 4e3);
			} else if (result.needsProfile) setShowAuth(true);
		});
		if (localStorage.getItem("sachi_auth_intent") && window.location.hash.includes("id_token")) localStorage.removeItem("sachi_auth_intent");
	}, []);
	currentUser?.email === "jaygnz27@gmail.com" || currentUser?.email;
	const [videoList, setVideoList] = (0, import_react.useState)([]);
	const feedContainerRef = (0, import_react.useRef)(null);
	const [feedKey, setFeedKey] = import_react.useState(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [activeTab, setActiveTab] = (0, import_react.useState)("feed");
	const [showAdmin, setShowAdmin] = (0, import_react.useState)(false);
	const [showGoLive, setShowGoLive] = (0, import_react.useState)(false);
	const [profileSheet, setProfileSheet] = (0, import_react.useState)(null);
	const [showSearch, setShowSearch] = (0, import_react.useState)(false);
	const [authToast, setAuthToast] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [feedTab, setFeedTab] = (0, import_react.useState)("forYou");
	const [followingVideos, setFollowingVideos] = (0, import_react.useState)([]);
	const [followedUserIds, setFollowedUserIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	import_react.useEffect(() => {
		if (!currentUser) {
			setFollowedUserIds(/* @__PURE__ */ new Set());
			return;
		}
		follows.getFollowing(currentUser.id).then((res) => {
			setFollowedUserIds(new Set((res.items || res || []).map((r) => r.following_id)));
		}).catch(() => {});
	}, [currentUser]);
	const handleFollowChange = (userId, isNowFollowing) => {
		setFollowedUserIds((prev) => {
			const next = new Set(prev);
			if (isNowFollowing) next.add(userId);
			else next.delete(userId);
			return next;
		});
	};
	const [followingIds, setFollowingIds] = (0, import_react.useState)([]);
	const [bookmarkedIds, setBookmarkedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bookmarkRecords, setBookmarkRecords] = (0, import_react.useState)({});
	const [blockedIds, setBlockedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [feedPage, setFeedPage] = (0, import_react.useState)(1);
	const [feedHasMore, setFeedHasMore] = (0, import_react.useState)(true);
	const FEED_PAGE_SIZE = 30;
	const [commentVideo, setCommentVideo] = (0, import_react.useState)(null);
	const [showUpload, setShowUpload] = (0, import_react.useState)(false);
	const [uploadToast, setUploadToast] = (0, import_react.useState)(false);
	const [loginToast, setLoginToast] = (0, import_react.useState)(false);
	const [showAuth, setShowAuth] = (0, import_react.useState)(false);
	const [myVideos, setMyVideos] = (0, import_react.useState)([]);
	const [meFollowersCount, setMeFollowersCount] = (0, import_react.useState)(0);
	const [meFollowingCount, setMeFollowingCount] = (0, import_react.useState)(0);
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)(() => {
		try {
			const last = localStorage.getItem("avatar_last");
			if (last) return last;
			const keys = Object.keys(localStorage).filter((k) => k.startsWith("avatar_"));
			if (keys.length > 0) return localStorage.getItem(keys[0]) || null;
		} catch (e) {}
		return null;
	});
	const [showAvatarPicker, setShowAvatarPicker] = (0, import_react.useState)(false);
	const [showEditProfile, setShowEditProfile] = (0, import_react.useState)(false);
	const [editProfileName, setEditProfileName] = (0, import_react.useState)("");
	const [editProfileSaving, setEditProfileSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		loadVideos();
	}, []);
	(0, import_react.useEffect)(() => {
		const handleSachiShare = (e) => {
			const { type, uri, url } = e.detail || {};
			if (type === "video" || type === "url") {
				setShowUpload(true);
				window._sachiSharedContent = {
					type,
					uri,
					url
				};
			}
		};
		window.addEventListener("sachi-share", handleSachiShare);
		return () => window.removeEventListener("sachi-share", handleSachiShare);
	}, []);
	(0, import_react.useEffect)(() => {
		if (currentUser) loadFollowingVideos(currentUser);
	}, [currentUser]);
	(0, import_react.useEffect)(() => {
		const loadAvatar = async () => {
			if (currentUser) try {
				const usersData = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser/?email=${encodeURIComponent(currentUser.email)}`);
				const match = (Array.isArray(usersData) ? usersData : usersData.items || []).find((u) => u.email === currentUser.email || u.user_id === currentUser.id);
				const localSaved = localStorage.getItem(`avatar_${currentUser.id}`);
				if (localSaved) setAvatarUrl(localSaved);
				else if (match && match.avatar_url) {
					setAvatarUrl(match.avatar_url);
					localStorage.setItem(`avatar_${currentUser.id}`, match.avatar_url);
					localStorage.setItem(`avatar_last`, match.avatar_url);
				} else if (currentUser.avatar_url) setAvatarUrl(currentUser.avatar_url);
			} catch (e) {
				if (currentUser.avatar_url) setAvatarUrl(currentUser.avatar_url);
				else {
					const saved = localStorage.getItem(`avatar_${currentUser.id}`);
					if (saved) setAvatarUrl(saved);
				}
			}
		};
		loadAvatar();
	}, [currentUser]);
	const loadFollowingVideos = async (user) => {
		if (!user) return;
		try {
			const res = await follows.getFollowing(user.id);
			const ids = (res.items || res || []).map((r) => r.following_id);
			setFollowingIds(ids);
			if (ids.length === 0) {
				setFollowingVideos([]);
				return;
			}
			const allVids = await videos.list();
			setFollowingVideos((allVids.items || allVids || []).filter((v) => ids.includes(v.user_id)));
		} catch (e) {
			console.error(e);
		}
	};
	const loadVideos = async (user, append = false, page = 1) => {
		if (!append) setLoading(true);
		try {
			const skip = (page - 1) * FEED_PAGE_SIZE;
			const data = await videos.list(FEED_PAGE_SIZE, skip);
			const rawAll = Array.isArray(data) ? data : data?.items || data?.records || [];
			const raw = rawAll.filter((v) => !v.is_archived);
			setFeedHasMore(rawAll.length === FEED_PAGE_SIZE);
			if (!raw.length && !append) {
				setVideoList([]);
				setLoading(false);
				return;
			}
			const ranked = [...raw].sort((a, b) => {
				const ageDiffHours = (new Date(b.created_date || 0) - new Date(a.created_date || 0)) / 36e5;
				const engA = (a.likes_count || 0) * 2 + (a.comments_count || 0) * 3 + (a.views_count || 0) * .01;
				const engB = (b.likes_count || 0) * 2 + (b.comments_count || 0) * 3 + (b.views_count || 0) * .01;
				if (Math.abs(ageDiffHours) > 48 && engB - engA > 50) return 1;
				if (Math.abs(ageDiffHours) > 48 && engA - engB > 50) return -1;
				return new Date(b.created_date || 0) - new Date(a.created_date || 0);
			});
			if (append) setVideoList((prev) => {
				const existing = new Set(prev.map((v) => v.id));
				return [...prev, ...ranked.filter((v) => !existing.has(v.id))];
			});
			else {
				setVideoList(ranked);
				requestAnimationFrame(() => {
					const el = feedContainerRef.current || window.__sachiEl;
					if (el) el.scrollTo({
						top: 0,
						behavior: "instant"
					});
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
	(0, import_react.useEffect)(() => {
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
		}).catch(() => {});
		blocks.getBlockedByUser(currentUser.id).then((res) => {
			const items = res.items || res || [];
			setBlockedIds(new Set(items.map((b) => b.blocked_id)));
		}).catch(() => {});
	}, [currentUser]);
	const handleBookmark = async (videoId, shouldBookmark) => {
		if (!currentUser) {
			setShowAuth(true);
			return;
		}
		if (shouldBookmark) try {
			const rec = await bookmarks.add(currentUser.id, currentUser.username || currentUser.email, videoId);
			setBookmarkedIds((prev) => new Set([...prev, videoId]));
			setBookmarkRecords((prev) => ({
				...prev,
				[videoId]: rec.id
			}));
		} catch (e) {}
		else {
			const recId = bookmarkRecords[videoId];
			if (recId) try {
				await bookmarks.remove(recId);
				setBookmarkedIds((prev) => {
					const n = new Set(prev);
					n.delete(videoId);
					return n;
				});
				setBookmarkRecords((prev) => {
					const n = { ...prev };
					delete n[videoId];
					return n;
				});
			} catch (e) {}
		}
	};
	const goHome = () => {
		setActiveTab("feed");
		setFeedPage(1);
		setFeedKey((k) => k + 1);
		loadVideos(currentUser, false, 1);
	};
	(0, import_react.useEffect)(() => {
		if (activeTab === "profile" && currentUser) {
			videos.myVideos(currentUser.id).then((r) => setMyVideos(Array.isArray(r) ? r : [])).catch(() => setMyVideos([]));
			request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?following_id=${currentUser.id}&limit=500`).then((res) => setMeFollowersCount((res?.items || res || []).length)).catch(() => {});
			request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/Follow?follower_id=${currentUser.id}&limit=500`).then((res) => setMeFollowingCount((res?.items || res || []).length)).catch(() => {});
		}
	}, [activeTab, currentUser]);
	const handleLike = import_react.useCallback((videoId, delta) => {
		const feedEl = feedContainerRef.current;
		const savedScroll = feedEl ? feedEl.scrollTop : 0;
		setVideoList((vs) => {
			return vs.map((v) => {
				if (v.id !== videoId) return v;
				const newCount = Math.max(0, (v.likes_count || 0) + delta);
				videos.update(videoId, { likes_count: newCount }).catch(() => {});
				if (currentUser && v.hashtags?.length) interests.signal(currentUser.id, v.hashtags, delta > 0 ? 3 : -1).catch(() => {});
				return {
					...v,
					likes_count: newCount
				};
			});
		});
		if (feedEl) requestAnimationFrame(() => {
			feedEl.scrollTop = savedScroll;
		});
	}, [currentUser, feedContainerRef]);
	const handleView = (videoId) => {
		setVideoList((vs) => vs.map((v) => v.id === videoId ? {
			...v,
			views_count: (v.views_count || 0) + 1
		} : v));
		const vid = videoList.find((v) => v.id === videoId);
		if (vid) {
			videos.update(videoId, { views_count: (vid.views_count || 0) + 1 }).catch(() => {});
			if (currentUser && vid.hashtags?.length) interests.signal(currentUser.id, vid.hashtags, 1).catch(() => {});
		}
	};
	const handleCommentCount = (videoId, count) => {
		setVideoList((vs) => vs.map((v) => v.id === videoId ? {
			...v,
			comments_count: count
		} : v));
	};
	const requireAuth = (cb) => {
		if (currentUser) cb();
		else {
			setShowAuth(true);
			setAuthToast(true);
			setTimeout(() => setAuthToast(false), 3e3);
		}
	};
	const username = currentUser?.full_name || currentUser?.email?.split("@")[0] || "";
	if (!hasEntered) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landing, { onEnter: () => setHasEntered(true) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: "#0B0C1A",
			minHeight: "100svh",
			maxWidth: 480,
			margin: "0 auto",
			position: "relative",
			fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					top: 0,
					left: "50%",
					transform: "translateX(-50%)",
					width: "100%",
					maxWidth: 480,
					zIndex: 300,
					paddingTop: "env(safe-area-inset-top,0px)",
					background: "linear-gradient(to bottom, rgba(11,12,26,0.92) 0%, transparent 100%)",
					backdropFilter: "blur(8px)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "10px 16px 6px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 7
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/sachi-icon-v4.png",
								alt: "Sachi",
								style: {
									width: 30,
									height: 30,
									borderRadius: 8,
									filter: "drop-shadow(0 0 6px rgba(245,200,66,0.5))"
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "baseline",
									gap: 1
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 24,
										fontWeight: 900,
										letterSpacing: -.5,
										background: "linear-gradient(135deg,#F5C842,#FF9500)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									},
									children: "Sachi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 12,
										fontWeight: 700,
										color: "#F5C842",
										lineHeight: 1,
										marginBottom: 2
									},
									children: "™"
								})]
							})]
						}),
						activeTab === "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								background: "rgba(255,255,255,0.07)",
								borderRadius: 24,
								padding: 3,
								gap: 2
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
							})]
						}),
						activeTab !== "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 16,
								fontWeight: 800,
								color: "#fff",
								letterSpacing: .2
							},
							children: activeTab === "profile" ? "Profile" : activeTab === "explore" ? "Explore" : activeTab === "podcast" ? "Podcasts" : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 8
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => requireAuth(() => setShowGoLive(true)),
								style: {
									background: "rgba(245,200,66,0.12)",
									border: "1px solid rgba(245,200,66,0.3)",
									borderRadius: 20,
									padding: "4px 10px",
									color: "#F5C842",
									fontSize: 11,
									fontWeight: 700,
									cursor: "pointer",
									letterSpacing: .3,
									WebkitTapHighlightColor: "transparent",
									display: "flex",
									alignItems: "center",
									gap: 4
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#F5C842",
									display: "inline-block",
									animation: "heartbeat 1.4s ease-in-out infinite"
								} }), "Live"]
							})
						})
					]
				})
			}),
			activeTab === "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: (el) => {
					feedContainerRef.current = el;
					window.__sachiEl = el;
				},
				style: {
					height: "100svh",
					overflowY: "scroll",
					scrollSnapType: "y mandatory",
					isolation: "isolate",
					touchAction: "pan-y"
				},
				children: [
					feedTab === "following" && followingIds.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							height: "100svh",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							color: "rgba(255,255,255,0.5)",
							gap: 16,
							padding: 32,
							textAlign: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { fontSize: 56 },
							children: "👥"
						}), !currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 18,
									fontWeight: 700,
									color: "#fff"
								},
								children: "Sign in to follow people"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { fontSize: 14 },
								children: "Create a free account to follow your favourite creators"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowAuth(true),
								style: {
									marginTop: 8,
									background: "linear-gradient(135deg,#F5C842,#FF9500)",
									border: "none",
									borderRadius: 14,
									padding: "12px 28px",
									color: "#0B0C1A",
									fontWeight: 800,
									fontSize: 15,
									cursor: "pointer"
								},
								children: "Sign Up / Log In"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 18,
									fontWeight: 700,
									color: "#fff"
								},
								children: "No one to show yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { fontSize: 14 },
								children: [
									"Tap ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "+ Follow" }),
									" on any video to see their posts here"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFeedTab("forYou"),
								style: {
									marginTop: 8,
									background: "rgba(255,255,255,0.1)",
									border: "1.5px solid rgba(255,255,255,0.2)",
									borderRadius: 14,
									padding: "10px 24px",
									color: "#fff",
									fontWeight: 700,
									fontSize: 14,
									cursor: "pointer"
								},
								children: "Browse For You →"
							})
						] })]
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							height: "100svh",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							gap: 12
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { fontSize: 48 },
							children: "🎬"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(245,200,66,0.7)",
								fontSize: 14,
								letterSpacing: 1,
								fontWeight: 600
							},
							children: "Loading..."
						})]
					}),
					!loading && videoList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							height: "100svh",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							gap: 12
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { fontSize: 64 },
								children: "🎬"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#fff",
									fontWeight: 800,
									fontSize: 22
								},
								children: "No videos yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: "#888",
									fontSize: 15
								},
								children: "Be the first to post!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => requireAuth(() => setShowUpload(true)),
								style: {
									marginTop: 12,
									background: "linear-gradient(135deg,#F5C842,#FF9500)",
									border: "none",
									borderRadius: 14,
									padding: "12px 28px",
									color: "#0B0C1A",
									fontWeight: 800,
									fontSize: 16,
									cursor: "pointer"
								},
								children: "+ Upload Video"
							})
						]
					}),
					(feedTab === "forYou" ? videoList : followingVideos).filter((v) => !blockedIds.has(v.user_id)).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
						video: v,
						currentUser,
						onCommentOpen: setCommentVideo,
						onLike: handleLike,
						onView: handleView,
						onNeedAuth: () => setShowAuth(true),
						onDelete: (id) => setVideoList((prev) => prev.filter((v) => v.id !== id)),
						onProfileOpen: (uid, uname) => setProfileSheet({
							userId: uid,
							username: uname
						}),
						followedUserIds,
						onFollowChange: handleFollowChange,
						onShareCount: (videoId, newCount) => setVideoList((prev) => prev.map((v) => v.id === videoId ? {
							...v,
							shares_count: newCount
						} : v)),
						onBookmark: {
							isBookmarked: (vid) => bookmarkedIds.has(vid),
							handle: handleBookmark
						},
						blockedIds
					}, v.id)),
					feedTab === "forYou" && feedHasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							textAlign: "center",
							padding: "24px 0 40px"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: loadMoreVideos,
							style: {
								background: "rgba(255,255,255,0.08)",
								border: "1px solid rgba(255,255,255,0.15)",
								borderRadius: 20,
								padding: "10px 28px",
								color: "#fff",
								fontSize: 14,
								cursor: "pointer",
								fontWeight: 600
							},
							children: "Load more"
						})
					}),
					feedTab === "following" && followingVideos.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							textAlign: "center",
							padding: "60px 24px",
							color: "rgba(255,255,255,0.3)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 48,
									marginBottom: 16
								},
								children: "👀"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 16,
									fontWeight: 600,
									marginBottom: 8
								},
								children: "Nothing here yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { fontSize: 13 },
								children: "Follow creators to see their posts here"
							})
						]
					})
				]
			}, feedKey),
			activeTab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					paddingTop: 70,
					paddingBottom: 80,
					minHeight: "100svh",
					background: "#0B0C1A"
				},
				children: !currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						textAlign: "center",
						padding: 60
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								position: "relative",
								display: "inline-block",
								cursor: "pointer",
								marginBottom: 16
							},
							onClick: () => setShowAuth(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: 90,
									height: 90,
									borderRadius: "50%",
									background: "rgba(255,255,255,0.08)",
									border: "3px solid rgba(245,200,66,0.4)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 44
								},
								children: "👤"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
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
								},
								children: "📷"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 800,
								fontSize: 20,
								marginBottom: 8
							},
							children: "You're not logged in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#666",
								fontSize: 14,
								marginBottom: 24
							},
							children: "Sign up to post and build your profile"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowAuth(true),
							style: {
								background: "linear-gradient(135deg,#F5C842,#FF9500)",
								border: "none",
								borderRadius: 14,
								padding: "13px 32px",
								color: "#0B0C1A",
								fontWeight: 800,
								fontSize: 16,
								cursor: "pointer"
							},
							children: "Sign Up / Log In"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							padding: "20px 20px 0",
							textAlign: "center"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									marginBottom: 12,
									gap: 8
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "relative",
										display: "inline-block",
										cursor: "pointer"
									},
									onClick: () => setShowAvatarPicker(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
										style: {
											width: 90,
											height: 90,
											borderRadius: "50%",
											border: "3px solid #F5C842",
											display: "block",
											background: "rgba(255,255,255,0.05)"
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
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
										},
										children: "✏️"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 8,
									cursor: "pointer"
								},
								onClick: () => {
									setEditProfileName(currentUser?.full_name || "");
									setShowEditProfile(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										color: "#fff",
										fontWeight: 800,
										fontSize: 20
									},
									children: currentUser.full_name || username
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 13,
										color: "#888"
									},
									children: "✏️"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									color: "#888",
									fontSize: 13,
									marginTop: 2
								},
								children: ["@", username]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									justifyContent: "center",
									gap: 32,
									marginTop: 20,
									marginBottom: 20
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { textAlign: "center" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 800,
												fontSize: 20
											},
											children: myVideos.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#888",
												fontSize: 12
											},
											children: "Videos"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { textAlign: "center" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 800,
												fontSize: 20
											},
											children: meFollowersCount
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#888",
												fontSize: 12
											},
											children: "Followers"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { textAlign: "center" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#fff",
												fontWeight: 800,
												fontSize: 20
											},
											children: meFollowingCount
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: "#888",
												fontSize: 12
											},
											children: "Following"
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoManageGrid, {
						videos: myVideos,
						onRefresh: () => videos.myVideos(currentUser.id).then(setMyVideos).catch(() => {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { padding: "24px 20px 32px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						})
					})
				] })
			}),
			activeTab === "explore" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					paddingTop: 70,
					paddingBottom: 80,
					minHeight: "100svh",
					background: "#0B0C1A"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						padding: "16px 16px 8px",
						display: "flex",
						alignItems: "center",
						gap: 10,
						borderBottom: "1px solid rgba(255,255,255,0.07)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							flex: 1,
							display: "flex",
							alignItems: "center",
							background: "rgba(255,255,255,0.08)",
							borderRadius: 22,
							padding: "8px 14px",
							gap: 8
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "16",
								height: "16",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "rgba(255,255,255,0.4)",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "11",
									cy: "11",
									r: "7"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "21",
									y1: "21",
									x2: "16.65",
									y2: "16.65"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search users or videos...",
								style: {
									flex: 1,
									background: "none",
									border: "none",
									outline: "none",
									color: "#fff",
									fontSize: 15
								}
							}),
							searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSearchQuery(""),
								style: {
									background: "none",
									border: "none",
									color: "rgba(255,255,255,0.4)",
									cursor: "pointer",
									fontSize: 18,
									padding: 0
								},
								children: "✕"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { padding: 16 },
					children: searchQuery.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "rgba(255,255,255,0.5)",
								fontSize: 13,
								fontWeight: 700,
								marginBottom: 12,
								letterSpacing: 1,
								textTransform: "uppercase"
							},
							children: "🔥 Trending Now"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
								gap: 2
							},
							children: [...videoList].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 18).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									aspectRatio: "9/16",
									background: "#111",
									borderRadius: 4,
									overflow: "hidden",
									position: "relative",
									cursor: "pointer"
								},
								onClick: () => {
									setSearchQuery("");
									setActiveTab("feed");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: resolveMediaUrl(v.video_url),
									style: {
										width: "100%",
										height: "100%",
										objectFit: "cover"
									},
									muted: true,
									playsInline: true,
									preload: "metadata"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "absolute",
										bottom: 0,
										left: 0,
										right: 0,
										padding: "4px 6px",
										background: "linear-gradient(transparent,rgba(0,0,0,0.8))",
										fontSize: 10,
										color: "#fff",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["@", v.username] }), v.views_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { color: "#aaa" },
										children: ["👁 ", v.views_count]
									})]
								})]
							}, v.id))
						}),
						videoList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								textAlign: "center",
								color: "rgba(255,255,255,0.25)",
								marginTop: 60,
								fontSize: 14
							},
							children: "No videos yet — be the first to post!"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "rgba(255,255,255,0.5)",
							fontSize: 13,
							fontWeight: 700,
							marginBottom: 12,
							letterSpacing: 1,
							textTransform: "uppercase"
						},
						children: "Results"
					}), videoList.filter((v) => (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							textAlign: "center",
							color: "rgba(255,255,255,0.25)",
							marginTop: 60,
							fontSize: 14
						},
						children: [
							"No results for \"",
							searchQuery,
							"\""
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 2
						},
						children: videoList.filter((v) => (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								aspectRatio: "9/16",
								background: "#111",
								borderRadius: 4,
								overflow: "hidden",
								position: "relative",
								cursor: "pointer"
							},
							onClick: () => {
								setSearchQuery("");
								setActiveTab("feed");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: resolveMediaUrl(v.video_url),
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								},
								muted: true,
								playsInline: true,
								preload: "metadata"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
									padding: "4px 6px",
									background: "linear-gradient(transparent,rgba(0,0,0,0.7))",
									fontSize: 10,
									color: "#fff",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								},
								children: ["@", v.username]
							})]
						}, v.id))
					})] })
				})]
			}),
			activeTab === "podcast" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PodcastPage, {
				currentUser,
				onNeedAuth: () => setShowAuth(true)
			}),
			activeTab === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPanel, { currentUser }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					bottom: 0,
					left: "50%",
					transform: "translateX(-50%)",
					width: "100%",
					maxWidth: 480,
					zIndex: 200,
					paddingBottom: "env(safe-area-inset-bottom,8px)",
					paddingTop: 0,
					display: "flex",
					justifyContent: "center",
					pointerEvents: "none"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						pointerEvents: "auto",
						margin: "0 16px 8px",
						background: "rgba(14,14,28,0.96)",
						backdropFilter: "blur(30px)",
						borderRadius: 40,
						border: "1px solid rgba(245,200,66,0.15)",
						display: "flex",
						alignItems: "center",
						padding: "6px 8px",
						gap: 2,
						boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: goHome,
							style: {
								flex: 1,
								minWidth: 52,
								padding: "8px 12px 6px",
								background: activeTab === "feed" ? "rgba(245,200,66,0.15)" : "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 3,
								WebkitTapHighlightColor: "transparent",
								borderRadius: 32,
								transition: "background 0.2s"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "21",
								height: "21",
								viewBox: "0 0 24 24",
								fill: activeTab === "feed" ? "#F5C842" : "none",
								stroke: activeTab === "feed" ? "#F5C842" : "#4A4A6A",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "9 22 9 12 15 12 15 22" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 9,
									color: activeTab === "feed" ? "#F5C842" : "#4A4A6A",
									fontWeight: activeTab === "feed" ? 700 : 400,
									letterSpacing: .3
								},
								children: "Home"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("explore"),
							style: {
								flex: 1,
								minWidth: 52,
								padding: "8px 12px 6px",
								background: activeTab === "explore" ? "rgba(245,200,66,0.15)" : "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 3,
								WebkitTapHighlightColor: "transparent",
								borderRadius: 32,
								transition: "background 0.2s"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "21",
								height: "21",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: activeTab === "explore" ? "#F5C842" : "#4A4A6A",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "11",
									cy: "11",
									r: "7"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "21",
									y1: "21",
									x2: "16.65",
									y2: "16.65"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 9,
									color: activeTab === "explore" ? "#F5C842" : "#4A4A6A",
									fontWeight: activeTab === "explore" ? 700 : 400,
									letterSpacing: .3
								},
								children: "Explore"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => requireAuth(() => setShowUpload(true)),
							style: {
								flex: 1,
								minWidth: 52,
								padding: "8px 10px 6px",
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 3,
								WebkitTapHighlightColor: "transparent",
								borderRadius: 32,
								transition: "background 0.2s"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "21",
								height: "21",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "#F5C842",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "12",
										cy: "12",
										r: "10"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "12",
										y1: "8",
										x2: "12",
										y2: "16"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "8",
										y1: "12",
										x2: "16",
										y2: "12"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 9,
									color: "#F5C842",
									fontWeight: 600,
									letterSpacing: .3
								},
								children: "Post"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("podcast"),
							style: {
								flex: 1,
								minWidth: 52,
								padding: "8px 12px 6px",
								background: activeTab === "podcast" ? "rgba(245,200,66,0.15)" : "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 3,
								WebkitTapHighlightColor: "transparent",
								borderRadius: 32,
								transition: "background 0.2s"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "21",
								height: "21",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: activeTab === "podcast" ? "#F5C842" : "#4A4A6A",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "12",
										y1: "19",
										x2: "12",
										y2: "23"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "8",
										y1: "23",
										x2: "16",
										y2: "23"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 9,
									color: activeTab === "podcast" ? "#F5C842" : "#4A4A6A",
									fontWeight: activeTab === "podcast" ? 700 : 400,
									letterSpacing: .3
								},
								children: "Podcasts"
							})]
						}),
						(currentUser?.email === "jaygnz27@gmail.com" || currentUser?.email === "lasanjaya@gmail.com") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("admin"),
							style: {
								flex: 1,
								minWidth: 52,
								padding: "8px 10px 6px",
								background: activeTab === "admin" ? "rgba(245,200,66,0.15)" : "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 3,
								WebkitTapHighlightColor: "transparent",
								borderRadius: 32,
								transition: "background 0.2s"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								width: "21",
								height: "21",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: activeTab === "admin" ? "#F5C842" : "#4A4A6A",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 9,
									color: activeTab === "admin" ? "#F5C842" : "#4A4A6A",
									fontWeight: activeTab === "admin" ? 700 : 400,
									letterSpacing: .3
								},
								children: "Mod"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("profile"),
							style: {
								flex: 1,
								minWidth: 52,
								padding: "8px 12px 6px",
								background: activeTab === "profile" ? "rgba(245,200,66,0.15)" : "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 3,
								WebkitTapHighlightColor: "transparent",
								borderRadius: 32,
								transition: "background 0.2s"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "21",
								height: "21",
								viewBox: "0 0 24 24",
								fill: activeTab === "profile" ? "#F5C842" : "none",
								stroke: activeTab === "profile" ? "#F5C842" : "#4A4A6A",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "12",
									cy: "7",
									r: "4"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 9,
									color: activeTab === "profile" ? "#F5C842" : "#4A4A6A",
									fontWeight: activeTab === "profile" ? 700 : 400,
									letterSpacing: .3
								},
								children: "Me"
							})]
						})
					]
				})
			}),
			showSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 500,
					background: "#000",
					display: "flex",
					flexDirection: "column"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 10,
						padding: "12px 16px",
						paddingTop: "calc(env(safe-area-inset-top,0px) + 12px)",
						borderBottom: "1px solid rgba(255,255,255,0.08)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							flex: 1,
							display: "flex",
							alignItems: "center",
							background: "rgba(255,255,255,0.08)",
							borderRadius: 22,
							padding: "8px 14px",
							gap: 8
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "rgba(255,255,255,0.4)",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "11",
									cy: "11",
									r: "7"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "21",
									y1: "21",
									x2: "16.65",
									y2: "16.65"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search users or videos...",
								style: {
									flex: 1,
									background: "none",
									border: "none",
									outline: "none",
									color: "#fff",
									fontSize: 15
								}
							}),
							searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSearchQuery(""),
								style: {
									background: "none",
									border: "none",
									color: "rgba(255,255,255,0.4)",
									cursor: "pointer",
									fontSize: 18,
									padding: 0
								},
								children: "✕"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setShowSearch(false);
							setSearchQuery("");
						},
						style: {
							background: "none",
							border: "none",
							color: "rgba(255,255,255,0.6)",
							fontSize: 14,
							cursor: "pointer",
							fontWeight: 600,
							padding: "0 4px",
							WebkitTapHighlightColor: "transparent"
						},
						children: "Cancel"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						flex: 1,
						overflowY: "auto",
						padding: 16
					},
					children: searchQuery.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							textAlign: "center",
							color: "rgba(255,255,255,0.25)",
							marginTop: 60,
							fontSize: 14
						},
						children: "Search for users or video captions"
					}) : videoList.filter((v) => (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							textAlign: "center",
							color: "rgba(255,255,255,0.25)",
							marginTop: 60,
							fontSize: 14
						},
						children: [
							"No results for \"",
							searchQuery,
							"\""
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 2
						},
						children: videoList.filter((v) => (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								aspectRatio: "9/16",
								background: "#111",
								borderRadius: 4,
								overflow: "hidden",
								position: "relative",
								cursor: "pointer"
							},
							onClick: () => {
								setShowSearch(false);
								setSearchQuery("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: resolveMediaUrl(v.video_url),
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								},
								muted: true,
								playsInline: true,
								preload: "metadata"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
									padding: "4px 6px",
									background: "linear-gradient(transparent,rgba(0,0,0,0.7))",
									fontSize: 10,
									color: "#fff",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								},
								children: ["@", v.username]
							})]
						}, v.id))
					})
				})]
			}),
			profileSheet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProfileSheet, {
				userId: profileSheet.userId,
				username: profileSheet.username,
				currentUser,
				onClose: () => setProfileSheet(null)
			}),
			commentVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentSheet, {
				video: commentVideo,
				currentUser,
				onClose: () => setCommentVideo(null),
				onCommentPosted: handleCommentCount,
				onNeedAuth: () => {
					setCommentVideo(null);
					setShowAuth(true);
				}
			}),
			showUpload && currentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadModal, {
				currentUser,
				onClose: () => setShowUpload(false),
				onUploaded: () => {
					goHome();
					setUploadToast(true);
					setTimeout(() => setUploadToast(false), 4e3);
				}
			}),
			showGoLive && currentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoLiveModal, {
				currentUser,
				onClose: () => setShowGoLive(false),
				onUploaded: () => {
					goHome();
					setUploadToast(true);
					setTimeout(() => setUploadToast(false), 4e3);
				}
			}),
			authToast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
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
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { fontSize: 22 },
					children: "🔐"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#fff",
						fontWeight: 700,
						fontSize: 15
					},
					children: "Sign in required"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#ff9999",
						fontSize: 12,
						marginTop: 2
					},
					children: "Create a free account to continue"
				})] })]
			}),
			uploadToast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
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
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: 32,
						height: 32,
						borderRadius: "50%",
						background: "#4caf50",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 18,
						flexShrink: 0
					},
					children: "✓"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#fff",
						fontWeight: 700,
						fontSize: 15
					},
					children: "Your video has been uploaded!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#81c784",
						fontSize: 12,
						marginTop: 2
					},
					children: "Now live in the feed 🎉"
				})] })]
			}),
			loginToast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
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
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: 34,
						height: 34,
						borderRadius: "50%",
						background: "linear-gradient(135deg,#6c63ff,#ff6b6b)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 18,
						flexShrink: 0
					},
					children: "✓"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#fff",
						fontWeight: 800,
						fontSize: 15,
						letterSpacing: .3
					},
					children: "✨ Sachi is Live for you"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "#a09de8",
						fontSize: 12,
						marginTop: 2
					},
					children: "Welcome in — let's go 🔥"
				})] })]
			}),
			showAuth && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {
				onClose: () => setShowAuth(false),
				onSuccess: (user) => {
					setCurrentUser(user);
					setShowAuth(false);
					setActiveTab("feed");
					setFeedKey((k) => k + 1);
					setLoginToast(true);
					setTimeout(() => setLoginToast(false), 4e3);
				}
			}),
			showEditProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 9e3,
					background: "rgba(0,0,0,0.85)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 20
				},
				onClick: () => setShowEditProfile(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "#1a1a2e",
						borderRadius: 20,
						padding: 24,
						width: "100%",
						maxWidth: 420
					},
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "#fff",
								fontWeight: 700,
								fontSize: 17,
								marginBottom: 16
							},
							children: "✏️ Edit Display Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: editProfileName,
							onChange: (e) => setEditProfileName(e.target.value),
							placeholder: currentUser?.full_name || username || "Your display name",
							defaultValue: currentUser?.full_name || "",
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 10,
								marginTop: 14
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									if (!editProfileName.trim()) return;
									setEditProfileSaving(true);
									try {
										await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/auth/me`, { full_name: editProfileName.trim() });
										setCurrentUser((u) => ({
											...u,
											full_name: editProfileName.trim()
										}));
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
							})]
						})
					]
				})
			}),
			showAvatarPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarPickerModal, {
				currentAvatar: avatarUrl,
				onSelect: async (url) => {
					setAvatarUrl(url);
					setCurrentUser((u) => ({
						...u,
						avatar_url: url
					}));
					if (currentUser) {
						localStorage.setItem(`avatar_${currentUser.id}`, url);
						localStorage.setItem("avatar_last", url);
					}
					setShowAvatarPicker(false);
					if (currentUser && !url.startsWith("data:")) {
						try {
							await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/auth/me`, { avatar_url: url });
						} catch (e) {
							console.warn("Auth avatar update failed:", e);
						}
						try {
							const usersData = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser/?created_by=${currentUser.id}`);
							const users = Array.isArray(usersData) ? usersData : usersData?.items || [];
							if (users[0]) await request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser/${users[0].id}/`, { avatar_url: url });
						} catch (e) {
							console.warn("User entity update failed:", e);
						}
						try {
							const vidsData = await request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/?created_by=${currentUser.id}&limit=200`);
							const vids = Array.isArray(vidsData) ? vidsData : vidsData?.items || [];
							await Promise.all(vids.map((v) => request("PATCH", `/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo/${v.id}/`, { avatar_url: url })));
							setVideoList((vs) => vs.map((v) => v.user_id === currentUser.id || v.created_by === currentUser.id ? {
								...v,
								avatar_url: url
							} : v));
						} catch (e) {
							console.warn("Video avatar sync failed:", e);
						}
					} else if (currentUser && url.startsWith("data:")) setVideoList((vs) => vs.map((v) => v.user_id === currentUser.id || v.created_by === currentUser.id ? {
						...v,
						avatar_url: url
					} : v));
				},
				onClose: () => setShowAvatarPicker(false)
			})
		]
	});
}
//#endregion
//#region src/main.jsx
var ErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}
	static getDerivedStateFromError(e) {
		return { error: e };
	}
	render() {
		if (this.state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				background: "#0f0f1a",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 24
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: "#1a1a2e",
					borderRadius: 16,
					padding: 32,
					maxWidth: 340,
					width: "100%",
					textAlign: "center",
					border: "1px solid rgba(255,107,107,0.3)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 48,
							marginBottom: 12
						},
						children: "😅"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#ff6b6b",
							fontWeight: 800,
							fontSize: 18,
							marginBottom: 8
						},
						children: "Something went wrong"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#888",
							fontSize: 13,
							marginBottom: 24
						},
						children: this.state.error?.message || "Unknown error"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => window.location.reload(),
						style: {
							background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
							border: "none",
							borderRadius: 12,
							padding: "12px 24px",
							color: "#fff",
							fontWeight: 800,
							fontSize: 15,
							cursor: "pointer"
						},
						children: "Reload App"
					})
				]
			})
		});
		return this.props.children;
	}
};
function Root() {
	const path = window.location.pathname;
	if (path === "/privacy" || path === "/privacy/") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Privacy, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
import_client.createRoot(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {}) }));
//#endregion
