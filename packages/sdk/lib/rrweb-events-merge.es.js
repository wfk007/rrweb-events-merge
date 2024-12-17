var Tl = Object.defineProperty, Bl = (i, e, t) => e in i ? Tl(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, ar = (i, e, t) => Bl(i, typeof e != "symbol" ? e + "" : e, t), oi, Fl = Object.defineProperty, zl = (i, e, t) => e in i ? Fl(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, li = (i, e, t) => zl(i, typeof e != "symbol" ? e + "" : e, t);
const ai = {
  Node: ["childNodes", "parentNode", "parentElement", "textContent"],
  ShadowRoot: ["host", "styleSheets"],
  Element: ["shadowRoot", "querySelector", "querySelectorAll"],
  MutationObserver: []
}, ui = {
  Node: ["contains", "getRootNode"],
  ShadowRoot: ["getSelection"],
  Element: [],
  MutationObserver: ["constructor"]
}, Ve = {}, Wl = () => !!globalThis.Zone;
function Os(i) {
  if (Ve[i])
    return Ve[i];
  const e = globalThis[i], t = e.prototype, r = i in ai ? ai[i] : void 0, s = !!(r && // @ts-expect-error 2345
  r.every(
    (a) => {
      var l, u;
      return !!((u = (l = Object.getOwnPropertyDescriptor(t, a)) == null ? void 0 : l.get) != null && u.toString().includes("[native code]"));
    }
  )), n = i in ui ? ui[i] : void 0, o = !!(n && n.every(
    // @ts-expect-error 2345
    (a) => {
      var l;
      return typeof t[a] == "function" && ((l = t[a]) == null ? void 0 : l.toString().includes("[native code]"));
    }
  ));
  if (s && o && !Wl())
    return Ve[i] = e.prototype, e.prototype;
  try {
    const a = document.createElement("iframe");
    document.body.appendChild(a);
    const l = a.contentWindow;
    if (!l) return e.prototype;
    const u = l[i].prototype;
    return document.body.removeChild(a), u ? Ve[i] = u : t;
  } catch {
    return t;
  }
}
const ur = {};
function Q(i, e, t) {
  var r;
  const s = `${i}.${String(t)}`;
  if (ur[s])
    return ur[s].call(
      e
    );
  const n = Os(i), o = (r = Object.getOwnPropertyDescriptor(
    n,
    t
  )) == null ? void 0 : r.get;
  return o ? (ur[s] = o, o.call(e)) : e[t];
}
const fr = {};
function bn(i, e, t) {
  const r = `${i}.${String(t)}`;
  if (fr[r])
    return fr[r].bind(
      e
    );
  const n = Os(i)[t];
  return typeof n != "function" ? e[t] : (fr[r] = n, n.bind(e));
}
function jl(i) {
  return Q("Node", i, "childNodes");
}
function Gl(i) {
  return Q("Node", i, "parentNode");
}
function Vl(i) {
  return Q("Node", i, "parentElement");
}
function Yl(i) {
  return Q("Node", i, "textContent");
}
function Zl(i, e) {
  return bn("Node", i, "contains")(e);
}
function Jl(i) {
  return bn("Node", i, "getRootNode")();
}
function Hl(i) {
  return !i || !("host" in i) ? null : Q("ShadowRoot", i, "host");
}
function Kl(i) {
  return i.styleSheets;
}
function Xl(i) {
  return !i || !("shadowRoot" in i) ? null : Q("Element", i, "shadowRoot");
}
function Ql(i, e) {
  return Q("Element", i, "querySelector")(e);
}
function ql(i, e) {
  return Q("Element", i, "querySelectorAll")(e);
}
function ea() {
  return Os("MutationObserver").constructor;
}
const It = {
  childNodes: jl,
  parentNode: Gl,
  parentElement: Vl,
  textContent: Yl,
  contains: Zl,
  getRootNode: Jl,
  host: Hl,
  styleSheets: Kl,
  shadowRoot: Xl,
  querySelector: Ql,
  querySelectorAll: ql,
  mutationObserver: ea
};
function ta(i) {
  const e = (
    // anchor and textarea elements also have a `host` property
    // but only shadow roots have a `mode` property
    i && "host" in i && "mode" in i && It.host(i) || null
  );
  return !!(e && "shadowRoot" in e && It.shadowRoot(e) === i);
}
let ra = class {
  constructor() {
    li(this, "idNodeMap", /* @__PURE__ */ new Map()), li(this, "nodeMetaMap", /* @__PURE__ */ new WeakMap());
  }
  getId(e) {
    var t;
    return e ? ((t = this.getMeta(e)) == null ? void 0 : t.id) ?? -1 : -1;
  }
  getNode(e) {
    return this.idNodeMap.get(e) || null;
  }
  getIds() {
    return Array.from(this.idNodeMap.keys());
  }
  getMeta(e) {
    return this.nodeMetaMap.get(e) || null;
  }
  // removes the node from idNodeMap
  // doesn't remove the node from nodeMetaMap
  removeNodeFromMap(e) {
    const t = this.getId(e);
    this.idNodeMap.delete(t), e.childNodes && e.childNodes.forEach(
      (r) => this.removeNodeFromMap(r)
    );
  }
  has(e) {
    return this.idNodeMap.has(e);
  }
  hasNode(e) {
    return this.nodeMetaMap.has(e);
  }
  add(e, t) {
    const r = t.id;
    this.idNodeMap.set(r, e), this.nodeMetaMap.set(e, t);
  }
  replace(e, t) {
    const r = this.getNode(e);
    if (r) {
      const s = this.nodeMetaMap.get(r);
      s && this.nodeMetaMap.set(t, s);
    }
    this.idNodeMap.set(e, t);
  }
  reset() {
    this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
  }
};
function sa() {
  return new ra();
}
const ia = -2;
function Ir(i, e, t) {
  if (!i) return !1;
  if (i.nodeType !== i.ELEMENT_NODE)
    return t ? Ir(It.parentNode(i), e, t) : !1;
  for (let r = i.classList.length; r--; ) {
    const s = i.classList[r];
    if (e.test(s))
      return !0;
  }
  return t ? Ir(It.parentNode(i), e, t) : !1;
}
function na(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function oa(i) {
  if (i.__esModule) return i;
  var e = i.default;
  if (typeof e == "function") {
    var t = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(i).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(i, r);
    Object.defineProperty(t, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return i[r];
      }
    });
  }), t;
}
var As = { exports: {} }, A = String, Cn = function() {
  return { isColorSupported: !1, reset: A, bold: A, dim: A, italic: A, underline: A, inverse: A, hidden: A, strikethrough: A, black: A, red: A, green: A, yellow: A, blue: A, magenta: A, cyan: A, white: A, gray: A, bgBlack: A, bgRed: A, bgGreen: A, bgYellow: A, bgBlue: A, bgMagenta: A, bgCyan: A, bgWhite: A };
};
As.exports = Cn();
As.exports.createColors = Cn;
var la = As.exports;
const aa = {}, ua = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: aa
}, Symbol.toStringTag, { value: "Module" })), W = /* @__PURE__ */ oa(ua);
let fi = la, hi = W, Nr = class $n extends Error {
  constructor(e, t, r, s, n, o) {
    super(e), this.name = "CssSyntaxError", this.reason = e, n && (this.file = n), s && (this.source = s), o && (this.plugin = o), typeof t < "u" && typeof r < "u" && (typeof t == "number" ? (this.line = t, this.column = r) : (this.line = t.line, this.column = t.column, this.endLine = r.line, this.endColumn = r.column)), this.setMessage(), Error.captureStackTrace && Error.captureStackTrace(this, $n);
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "", this.message += this.file ? this.file : "<css input>", typeof this.line < "u" && (this.message += ":" + this.line + ":" + this.column), this.message += ": " + this.reason;
  }
  showSourceCode(e) {
    if (!this.source) return "";
    let t = this.source;
    e == null && (e = fi.isColorSupported), hi && e && (t = hi(t));
    let r = t.split(/\r?\n/), s = Math.max(this.line - 3, 0), n = Math.min(this.line + 2, r.length), o = String(n).length, a, l;
    if (e) {
      let { bold: u, gray: f, red: c } = fi.createColors(!0);
      a = (p) => u(c(p)), l = (p) => f(p);
    } else
      a = l = (u) => u;
    return r.slice(s, n).map((u, f) => {
      let c = s + 1 + f, p = " " + (" " + c).slice(-o) + " | ";
      if (c === this.line) {
        let d = l(p.replace(/\d/g, " ")) + u.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return a(">") + l(p) + u + `
 ` + d + a("^");
      }
      return " " + l(p) + u;
    }).join(`
`);
  }
  toString() {
    let e = this.showSourceCode();
    return e && (e = `

` + e + `
`), this.name + ": " + this.message + e;
  }
};
var Rs = Nr;
Nr.default = Nr;
var Be = {};
Be.isClean = Symbol("isClean");
Be.my = Symbol("my");
const ci = {
  after: `
`,
  beforeClose: `
`,
  beforeComment: `
`,
  beforeDecl: `
`,
  beforeOpen: " ",
  beforeRule: `
`,
  colon: ": ",
  commentLeft: " ",
  commentRight: " ",
  emptyBody: "",
  indent: "    ",
  semicolon: !1
};
function fa(i) {
  return i[0].toUpperCase() + i.slice(1);
}
let Pr = class {
  constructor(e) {
    this.builder = e;
  }
  atrule(e, t) {
    let r = "@" + e.name, s = e.params ? this.rawValue(e, "params") : "";
    if (typeof e.raws.afterName < "u" ? r += e.raws.afterName : s && (r += " "), e.nodes)
      this.block(e, r + s);
    else {
      let n = (e.raws.between || "") + (t ? ";" : "");
      this.builder(r + s + n, e);
    }
  }
  beforeAfter(e, t) {
    let r;
    e.type === "decl" ? r = this.raw(e, null, "beforeDecl") : e.type === "comment" ? r = this.raw(e, null, "beforeComment") : t === "before" ? r = this.raw(e, null, "beforeRule") : r = this.raw(e, null, "beforeClose");
    let s = e.parent, n = 0;
    for (; s && s.type !== "root"; )
      n += 1, s = s.parent;
    if (r.includes(`
`)) {
      let o = this.raw(e, null, "indent");
      if (o.length)
        for (let a = 0; a < n; a++) r += o;
    }
    return r;
  }
  block(e, t) {
    let r = this.raw(e, "between", "beforeOpen");
    this.builder(t + r + "{", e, "start");
    let s;
    e.nodes && e.nodes.length ? (this.body(e), s = this.raw(e, "after")) : s = this.raw(e, "after", "emptyBody"), s && this.builder(s), this.builder("}", e, "end");
  }
  body(e) {
    let t = e.nodes.length - 1;
    for (; t > 0 && e.nodes[t].type === "comment"; )
      t -= 1;
    let r = this.raw(e, "semicolon");
    for (let s = 0; s < e.nodes.length; s++) {
      let n = e.nodes[s], o = this.raw(n, "before");
      o && this.builder(o), this.stringify(n, t !== s || r);
    }
  }
  comment(e) {
    let t = this.raw(e, "left", "commentLeft"), r = this.raw(e, "right", "commentRight");
    this.builder("/*" + t + e.text + r + "*/", e);
  }
  decl(e, t) {
    let r = this.raw(e, "between", "colon"), s = e.prop + r + this.rawValue(e, "value");
    e.important && (s += e.raws.important || " !important"), t && (s += ";"), this.builder(s, e);
  }
  document(e) {
    this.body(e);
  }
  raw(e, t, r) {
    let s;
    if (r || (r = t), t && (s = e.raws[t], typeof s < "u"))
      return s;
    let n = e.parent;
    if (r === "before" && (!n || n.type === "root" && n.first === e || n && n.type === "document"))
      return "";
    if (!n) return ci[r];
    let o = e.root();
    if (o.rawCache || (o.rawCache = {}), typeof o.rawCache[r] < "u")
      return o.rawCache[r];
    if (r === "before" || r === "after")
      return this.beforeAfter(e, r);
    {
      let a = "raw" + fa(r);
      this[a] ? s = this[a](o, e) : o.walk((l) => {
        if (s = l.raws[t], typeof s < "u") return !1;
      });
    }
    return typeof s > "u" && (s = ci[r]), o.rawCache[r] = s, s;
  }
  rawBeforeClose(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length > 0 && typeof r.raws.after < "u")
        return t = r.raws.after, t.includes(`
`) && (t = t.replace(/[^\n]+$/, "")), !1;
    }), t && (t = t.replace(/\S/g, "")), t;
  }
  rawBeforeComment(e, t) {
    let r;
    return e.walkComments((s) => {
      if (typeof s.raws.before < "u")
        return r = s.raws.before, r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")), !1;
    }), typeof r > "u" ? r = this.raw(t, null, "beforeDecl") : r && (r = r.replace(/\S/g, "")), r;
  }
  rawBeforeDecl(e, t) {
    let r;
    return e.walkDecls((s) => {
      if (typeof s.raws.before < "u")
        return r = s.raws.before, r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")), !1;
    }), typeof r > "u" ? r = this.raw(t, null, "beforeRule") : r && (r = r.replace(/\S/g, "")), r;
  }
  rawBeforeOpen(e) {
    let t;
    return e.walk((r) => {
      if (r.type !== "decl" && (t = r.raws.between, typeof t < "u"))
        return !1;
    }), t;
  }
  rawBeforeRule(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && (r.parent !== e || e.first !== r) && typeof r.raws.before < "u")
        return t = r.raws.before, t.includes(`
`) && (t = t.replace(/[^\n]+$/, "")), !1;
    }), t && (t = t.replace(/\S/g, "")), t;
  }
  rawColon(e) {
    let t;
    return e.walkDecls((r) => {
      if (typeof r.raws.between < "u")
        return t = r.raws.between.replace(/[^\s:]/g, ""), !1;
    }), t;
  }
  rawEmptyBody(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length === 0 && (t = r.raws.after, typeof t < "u"))
        return !1;
    }), t;
  }
  rawIndent(e) {
    if (e.raws.indent) return e.raws.indent;
    let t;
    return e.walk((r) => {
      let s = r.parent;
      if (s && s !== e && s.parent && s.parent === e && typeof r.raws.before < "u") {
        let n = r.raws.before.split(`
`);
        return t = n[n.length - 1], t = t.replace(/\S/g, ""), !1;
      }
    }), t;
  }
  rawSemicolon(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length && r.last.type === "decl" && (t = r.raws.semicolon, typeof t < "u"))
        return !1;
    }), t;
  }
  rawValue(e, t) {
    let r = e[t], s = e.raws[t];
    return s && s.value === r ? s.raw : r;
  }
  root(e) {
    this.body(e), e.raws.after && this.builder(e.raws.after);
  }
  rule(e) {
    this.block(e, this.rawValue(e, "selector")), e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, "end");
  }
  stringify(e, t) {
    if (!this[e.type])
      throw new Error(
        "Unknown AST node type " + e.type + ". Maybe you need to change PostCSS stringifier."
      );
    this[e.type](e, t);
  }
};
var Sn = Pr;
Pr.default = Pr;
let ha = Sn;
function Mr(i, e) {
  new ha(e).stringify(i);
}
var jt = Mr;
Mr.default = Mr;
let { isClean: Ye, my: ca } = Be, pa = Rs, da = Sn, ma = jt;
function _r(i, e) {
  let t = new i.constructor();
  for (let r in i) {
    if (!Object.prototype.hasOwnProperty.call(i, r) || r === "proxyCache") continue;
    let s = i[r], n = typeof s;
    r === "parent" && n === "object" ? e && (t[r] = e) : r === "source" ? t[r] = s : Array.isArray(s) ? t[r] = s.map((o) => _r(o, t)) : (n === "object" && s !== null && (s = _r(s)), t[r] = s);
  }
  return t;
}
let Lr = class {
  constructor(e = {}) {
    this.raws = {}, this[Ye] = !1, this[ca] = !0;
    for (let t in e)
      if (t === "nodes") {
        this.nodes = [];
        for (let r of e[t])
          typeof r.clone == "function" ? this.append(r.clone()) : this.append(r);
      } else
        this[t] = e[t];
  }
  addToError(e) {
    if (e.postcssNode = this, e.stack && this.source && /\n\s{4}at /.test(e.stack)) {
      let t = this.source;
      e.stack = e.stack.replace(
        /\n\s{4}at /,
        `$&${t.input.from}:${t.start.line}:${t.start.column}$&`
      );
    }
    return e;
  }
  after(e) {
    return this.parent.insertAfter(this, e), this;
  }
  assign(e = {}) {
    for (let t in e)
      this[t] = e[t];
    return this;
  }
  before(e) {
    return this.parent.insertBefore(this, e), this;
  }
  cleanRaws(e) {
    delete this.raws.before, delete this.raws.after, e || delete this.raws.between;
  }
  clone(e = {}) {
    let t = _r(this);
    for (let r in e)
      t[r] = e[r];
    return t;
  }
  cloneAfter(e = {}) {
    let t = this.clone(e);
    return this.parent.insertAfter(this, t), t;
  }
  cloneBefore(e = {}) {
    let t = this.clone(e);
    return this.parent.insertBefore(this, t), t;
  }
  error(e, t = {}) {
    if (this.source) {
      let { end: r, start: s } = this.rangeBy(t);
      return this.source.input.error(
        e,
        { column: s.column, line: s.line },
        { column: r.column, line: r.line },
        t
      );
    }
    return new pa(e);
  }
  getProxyProcessor() {
    return {
      get(e, t) {
        return t === "proxyOf" ? e : t === "root" ? () => e.root().toProxy() : e[t];
      },
      set(e, t, r) {
        return e[t] === r || (e[t] = r, (t === "prop" || t === "value" || t === "name" || t === "params" || t === "important" || /* c8 ignore next */
        t === "text") && e.markDirty()), !0;
      }
    };
  }
  markDirty() {
    if (this[Ye]) {
      this[Ye] = !1;
      let e = this;
      for (; e = e.parent; )
        e[Ye] = !1;
    }
  }
  next() {
    if (!this.parent) return;
    let e = this.parent.index(this);
    return this.parent.nodes[e + 1];
  }
  positionBy(e, t) {
    let r = this.source.start;
    if (e.index)
      r = this.positionInside(e.index, t);
    else if (e.word) {
      t = this.toString();
      let s = t.indexOf(e.word);
      s !== -1 && (r = this.positionInside(s, t));
    }
    return r;
  }
  positionInside(e, t) {
    let r = t || this.toString(), s = this.source.start.column, n = this.source.start.line;
    for (let o = 0; o < e; o++)
      r[o] === `
` ? (s = 1, n += 1) : s += 1;
    return { column: s, line: n };
  }
  prev() {
    if (!this.parent) return;
    let e = this.parent.index(this);
    return this.parent.nodes[e - 1];
  }
  rangeBy(e) {
    let t = {
      column: this.source.start.column,
      line: this.source.start.line
    }, r = this.source.end ? {
      column: this.source.end.column + 1,
      line: this.source.end.line
    } : {
      column: t.column + 1,
      line: t.line
    };
    if (e.word) {
      let s = this.toString(), n = s.indexOf(e.word);
      n !== -1 && (t = this.positionInside(n, s), r = this.positionInside(n + e.word.length, s));
    } else
      e.start ? t = {
        column: e.start.column,
        line: e.start.line
      } : e.index && (t = this.positionInside(e.index)), e.end ? r = {
        column: e.end.column,
        line: e.end.line
      } : typeof e.endIndex == "number" ? r = this.positionInside(e.endIndex) : e.index && (r = this.positionInside(e.index + 1));
    return (r.line < t.line || r.line === t.line && r.column <= t.column) && (r = { column: t.column + 1, line: t.line }), { end: r, start: t };
  }
  raw(e, t) {
    return new da().raw(this, e, t);
  }
  remove() {
    return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
  }
  replaceWith(...e) {
    if (this.parent) {
      let t = this, r = !1;
      for (let s of e)
        s === this ? r = !0 : r ? (this.parent.insertAfter(t, s), t = s) : this.parent.insertBefore(t, s);
      r || this.remove();
    }
    return this;
  }
  root() {
    let e = this;
    for (; e.parent && e.parent.type !== "document"; )
      e = e.parent;
    return e;
  }
  toJSON(e, t) {
    let r = {}, s = t == null;
    t = t || /* @__PURE__ */ new Map();
    let n = 0;
    for (let o in this) {
      if (!Object.prototype.hasOwnProperty.call(this, o) || o === "parent" || o === "proxyCache") continue;
      let a = this[o];
      if (Array.isArray(a))
        r[o] = a.map((l) => typeof l == "object" && l.toJSON ? l.toJSON(null, t) : l);
      else if (typeof a == "object" && a.toJSON)
        r[o] = a.toJSON(null, t);
      else if (o === "source") {
        let l = t.get(a.input);
        l == null && (l = n, t.set(a.input, n), n++), r[o] = {
          end: a.end,
          inputId: l,
          start: a.start
        };
      } else
        r[o] = a;
    }
    return s && (r.inputs = [...t.keys()].map((o) => o.toJSON())), r;
  }
  toProxy() {
    return this.proxyCache || (this.proxyCache = new Proxy(this, this.getProxyProcessor())), this.proxyCache;
  }
  toString(e = ma) {
    e.stringify && (e = e.stringify);
    let t = "";
    return e(this, (r) => {
      t += r;
    }), t;
  }
  warn(e, t, r) {
    let s = { node: this };
    for (let n in r) s[n] = r[n];
    return e.warn(t, s);
  }
  get proxyOf() {
    return this;
  }
};
var Gt = Lr;
Lr.default = Lr;
let ga = Gt, kr = class extends ga {
  constructor(e) {
    e && typeof e.value < "u" && typeof e.value != "string" && (e = { ...e, value: String(e.value) }), super(e), this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};
var Vt = kr;
kr.default = kr;
let ya = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", wa = (i, e = 21) => (t = e) => {
  let r = "", s = t;
  for (; s--; )
    r += i[Math.random() * i.length | 0];
  return r;
}, ba = (i = 21) => {
  let e = "", t = i;
  for (; t--; )
    e += ya[Math.random() * 64 | 0];
  return e;
};
var Ca = { nanoid: ba, customAlphabet: wa };
let { SourceMapConsumer: pi, SourceMapGenerator: di } = W, { existsSync: $a, readFileSync: Sa } = W, { dirname: hr, join: va } = W;
function xa(i) {
  return Buffer ? Buffer.from(i, "base64").toString() : window.atob(i);
}
let Dr = class {
  constructor(e, t) {
    if (t.map === !1) return;
    this.loadAnnotation(e), this.inline = this.startWith(this.annotation, "data:");
    let r = t.map ? t.map.prev : void 0, s = this.loadMap(t.from, r);
    !this.mapFile && t.from && (this.mapFile = t.from), this.mapFile && (this.root = hr(this.mapFile)), s && (this.text = s);
  }
  consumer() {
    return this.consumerCache || (this.consumerCache = new pi(this.text)), this.consumerCache;
  }
  decodeInline(e) {
    let t = /^data:application\/json;charset=utf-?8;base64,/, r = /^data:application\/json;base64,/, s = /^data:application\/json;charset=utf-?8,/, n = /^data:application\/json,/;
    if (s.test(e) || n.test(e))
      return decodeURIComponent(e.substr(RegExp.lastMatch.length));
    if (t.test(e) || r.test(e))
      return xa(e.substr(RegExp.lastMatch.length));
    let o = e.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + o);
  }
  getAnnotationURL(e) {
    return e.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  isMap(e) {
    return typeof e != "object" ? !1 : typeof e.mappings == "string" || typeof e._mappings == "string" || Array.isArray(e.sections);
  }
  loadAnnotation(e) {
    let t = e.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!t) return;
    let r = e.lastIndexOf(t.pop()), s = e.indexOf("*/", r);
    r > -1 && s > -1 && (this.annotation = this.getAnnotationURL(e.substring(r, s)));
  }
  loadFile(e) {
    if (this.root = hr(e), $a(e))
      return this.mapFile = e, Sa(e, "utf-8").toString().trim();
  }
  loadMap(e, t) {
    if (t === !1) return !1;
    if (t) {
      if (typeof t == "string")
        return t;
      if (typeof t == "function") {
        let r = t(e);
        if (r) {
          let s = this.loadFile(r);
          if (!s)
            throw new Error(
              "Unable to load previous source map: " + r.toString()
            );
          return s;
        }
      } else {
        if (t instanceof pi)
          return di.fromSourceMap(t).toString();
        if (t instanceof di)
          return t.toString();
        if (this.isMap(t))
          return JSON.stringify(t);
        throw new Error(
          "Unsupported previous source map format: " + t.toString()
        );
      }
    } else {
      if (this.inline)
        return this.decodeInline(this.annotation);
      if (this.annotation) {
        let r = this.annotation;
        return e && (r = va(hr(e), r)), this.loadFile(r);
      }
    }
  }
  startWith(e, t) {
    return e ? e.substr(0, t.length) === t : !1;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
};
var vn = Dr;
Dr.default = Dr;
let { SourceMapConsumer: Oa, SourceMapGenerator: Aa } = W, { fileURLToPath: mi, pathToFileURL: Ze } = W, { isAbsolute: Ur, resolve: Tr } = W, { nanoid: Ra } = Ca, cr = W, gi = Rs, Ea = vn, pr = Symbol("fromOffsetCache"), Ia = !!(Oa && Aa), yi = !!(Tr && Ur), Nt = class {
  constructor(e, t = {}) {
    if (e === null || typeof e > "u" || typeof e == "object" && !e.toString)
      throw new Error(`PostCSS received ${e} instead of CSS string`);
    if (this.css = e.toString(), this.css[0] === "\uFEFF" || this.css[0] === "￾" ? (this.hasBOM = !0, this.css = this.css.slice(1)) : this.hasBOM = !1, t.from && (!yi || /^\w+:\/\//.test(t.from) || Ur(t.from) ? this.file = t.from : this.file = Tr(t.from)), yi && Ia) {
      let r = new Ea(this.css, t);
      if (r.text) {
        this.map = r;
        let s = r.consumer().file;
        !this.file && s && (this.file = this.mapResolve(s));
      }
    }
    this.file || (this.id = "<input css " + Ra(6) + ">"), this.map && (this.map.file = this.from);
  }
  error(e, t, r, s = {}) {
    let n, o, a;
    if (t && typeof t == "object") {
      let u = t, f = r;
      if (typeof u.offset == "number") {
        let c = this.fromOffset(u.offset);
        t = c.line, r = c.col;
      } else
        t = u.line, r = u.column;
      if (typeof f.offset == "number") {
        let c = this.fromOffset(f.offset);
        o = c.line, a = c.col;
      } else
        o = f.line, a = f.column;
    } else if (!r) {
      let u = this.fromOffset(t);
      t = u.line, r = u.col;
    }
    let l = this.origin(t, r, o, a);
    return l ? n = new gi(
      e,
      l.endLine === void 0 ? l.line : { column: l.column, line: l.line },
      l.endLine === void 0 ? l.column : { column: l.endColumn, line: l.endLine },
      l.source,
      l.file,
      s.plugin
    ) : n = new gi(
      e,
      o === void 0 ? t : { column: r, line: t },
      o === void 0 ? r : { column: a, line: o },
      this.css,
      this.file,
      s.plugin
    ), n.input = { column: r, endColumn: a, endLine: o, line: t, source: this.css }, this.file && (Ze && (n.input.url = Ze(this.file).toString()), n.input.file = this.file), n;
  }
  fromOffset(e) {
    let t, r;
    if (this[pr])
      r = this[pr];
    else {
      let n = this.css.split(`
`);
      r = new Array(n.length);
      let o = 0;
      for (let a = 0, l = n.length; a < l; a++)
        r[a] = o, o += n[a].length + 1;
      this[pr] = r;
    }
    t = r[r.length - 1];
    let s = 0;
    if (e >= t)
      s = r.length - 1;
    else {
      let n = r.length - 2, o;
      for (; s < n; )
        if (o = s + (n - s >> 1), e < r[o])
          n = o - 1;
        else if (e >= r[o + 1])
          s = o + 1;
        else {
          s = o;
          break;
        }
    }
    return {
      col: e - r[s] + 1,
      line: s + 1
    };
  }
  mapResolve(e) {
    return /^\w+:\/\//.test(e) ? e : Tr(this.map.consumer().sourceRoot || this.map.root || ".", e);
  }
  origin(e, t, r, s) {
    if (!this.map) return !1;
    let n = this.map.consumer(), o = n.originalPositionFor({ column: t, line: e });
    if (!o.source) return !1;
    let a;
    typeof r == "number" && (a = n.originalPositionFor({ column: s, line: r }));
    let l;
    Ur(o.source) ? l = Ze(o.source) : l = new URL(
      o.source,
      this.map.consumer().sourceRoot || Ze(this.map.mapFile)
    );
    let u = {
      column: o.column,
      endColumn: a && a.column,
      endLine: a && a.line,
      line: o.line,
      url: l.toString()
    };
    if (l.protocol === "file:")
      if (mi)
        u.file = mi(l);
      else
        throw new Error("file: protocol is not available in this PostCSS build");
    let f = n.sourceContentFor(o.source);
    return f && (u.source = f), u;
  }
  toJSON() {
    let e = {};
    for (let t of ["hasBOM", "css", "file", "id"])
      this[t] != null && (e[t] = this[t]);
    return this.map && (e.map = { ...this.map }, e.map.consumerCache && (e.map.consumerCache = void 0)), e;
  }
  get from() {
    return this.file || this.id;
  }
};
var Yt = Nt;
Nt.default = Nt;
cr && cr.registerInput && cr.registerInput(Nt);
let { SourceMapConsumer: xn, SourceMapGenerator: vt } = W, { dirname: xt, relative: On, resolve: An, sep: Rn } = W, { pathToFileURL: wi } = W, Na = Yt, Pa = !!(xn && vt), Ma = !!(xt && An && On && Rn), _a = class {
  constructor(e, t, r, s) {
    this.stringify = e, this.mapOpts = r.map || {}, this.root = t, this.opts = r, this.css = s, this.originalCSS = s, this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute, this.memoizedFileURLs = /* @__PURE__ */ new Map(), this.memoizedPaths = /* @__PURE__ */ new Map(), this.memoizedURLs = /* @__PURE__ */ new Map();
  }
  addAnnotation() {
    let e;
    this.isInline() ? e = "data:application/json;base64," + this.toBase64(this.map.toString()) : typeof this.mapOpts.annotation == "string" ? e = this.mapOpts.annotation : typeof this.mapOpts.annotation == "function" ? e = this.mapOpts.annotation(this.opts.to, this.root) : e = this.outputFile() + ".map";
    let t = `
`;
    this.css.includes(`\r
`) && (t = `\r
`), this.css += t + "/*# sourceMappingURL=" + e + " */";
  }
  applyPrevMaps() {
    for (let e of this.previous()) {
      let t = this.toUrl(this.path(e.file)), r = e.root || xt(e.file), s;
      this.mapOpts.sourcesContent === !1 ? (s = new xn(e.text), s.sourcesContent && (s.sourcesContent = null)) : s = e.consumer(), this.map.applySourceMap(s, t, this.toUrl(this.path(r)));
    }
  }
  clearAnnotation() {
    if (this.mapOpts.annotation !== !1)
      if (this.root) {
        let e;
        for (let t = this.root.nodes.length - 1; t >= 0; t--)
          e = this.root.nodes[t], e.type === "comment" && e.text.indexOf("# sourceMappingURL=") === 0 && this.root.removeChild(t);
      } else this.css && (this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, ""));
  }
  generate() {
    if (this.clearAnnotation(), Ma && Pa && this.isMap())
      return this.generateMap();
    {
      let e = "";
      return this.stringify(this.root, (t) => {
        e += t;
      }), [e];
    }
  }
  generateMap() {
    if (this.root)
      this.generateString();
    else if (this.previous().length === 1) {
      let e = this.previous()[0].consumer();
      e.file = this.outputFile(), this.map = vt.fromSourceMap(e, {
        ignoreInvalidMapping: !0
      });
    } else
      this.map = new vt({
        file: this.outputFile(),
        ignoreInvalidMapping: !0
      }), this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
      });
    return this.isSourcesContent() && this.setSourcesContent(), this.root && this.previous().length > 0 && this.applyPrevMaps(), this.isAnnotation() && this.addAnnotation(), this.isInline() ? [this.css] : [this.css, this.map];
  }
  generateString() {
    this.css = "", this.map = new vt({
      file: this.outputFile(),
      ignoreInvalidMapping: !0
    });
    let e = 1, t = 1, r = "<no source>", s = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ""
    }, n, o;
    this.stringify(this.root, (a, l, u) => {
      if (this.css += a, l && u !== "end" && (s.generated.line = e, s.generated.column = t - 1, l.source && l.source.start ? (s.source = this.sourcePath(l), s.original.line = l.source.start.line, s.original.column = l.source.start.column - 1, this.map.addMapping(s)) : (s.source = r, s.original.line = 1, s.original.column = 0, this.map.addMapping(s))), n = a.match(/\n/g), n ? (e += n.length, o = a.lastIndexOf(`
`), t = a.length - o) : t += a.length, l && u !== "start") {
        let f = l.parent || { raws: {} };
        (!(l.type === "decl" || l.type === "atrule" && !l.nodes) || l !== f.last || f.raws.semicolon) && (l.source && l.source.end ? (s.source = this.sourcePath(l), s.original.line = l.source.end.line, s.original.column = l.source.end.column - 1, s.generated.line = e, s.generated.column = t - 2, this.map.addMapping(s)) : (s.source = r, s.original.line = 1, s.original.column = 0, s.generated.line = e, s.generated.column = t - 1, this.map.addMapping(s)));
      }
    });
  }
  isAnnotation() {
    return this.isInline() ? !0 : typeof this.mapOpts.annotation < "u" ? this.mapOpts.annotation : this.previous().length ? this.previous().some((e) => e.annotation) : !0;
  }
  isInline() {
    if (typeof this.mapOpts.inline < "u")
      return this.mapOpts.inline;
    let e = this.mapOpts.annotation;
    return typeof e < "u" && e !== !0 ? !1 : this.previous().length ? this.previous().some((t) => t.inline) : !0;
  }
  isMap() {
    return typeof this.opts.map < "u" ? !!this.opts.map : this.previous().length > 0;
  }
  isSourcesContent() {
    return typeof this.mapOpts.sourcesContent < "u" ? this.mapOpts.sourcesContent : this.previous().length ? this.previous().some((e) => e.withContent()) : !0;
  }
  outputFile() {
    return this.opts.to ? this.path(this.opts.to) : this.opts.from ? this.path(this.opts.from) : "to.css";
  }
  path(e) {
    if (this.mapOpts.absolute || e.charCodeAt(0) === 60 || /^\w+:\/\//.test(e)) return e;
    let t = this.memoizedPaths.get(e);
    if (t) return t;
    let r = this.opts.to ? xt(this.opts.to) : ".";
    typeof this.mapOpts.annotation == "string" && (r = xt(An(r, this.mapOpts.annotation)));
    let s = On(r, e);
    return this.memoizedPaths.set(e, s), s;
  }
  previous() {
    if (!this.previousMaps)
      if (this.previousMaps = [], this.root)
        this.root.walk((e) => {
          if (e.source && e.source.input.map) {
            let t = e.source.input.map;
            this.previousMaps.includes(t) || this.previousMaps.push(t);
          }
        });
      else {
        let e = new Na(this.originalCSS, this.opts);
        e.map && this.previousMaps.push(e.map);
      }
    return this.previousMaps;
  }
  setSourcesContent() {
    let e = {};
    if (this.root)
      this.root.walk((t) => {
        if (t.source) {
          let r = t.source.input.from;
          if (r && !e[r]) {
            e[r] = !0;
            let s = this.usesFileUrls ? this.toFileUrl(r) : this.toUrl(this.path(r));
            this.map.setSourceContent(s, t.source.input.css);
          }
        }
      });
    else if (this.css) {
      let t = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(t, this.css);
    }
  }
  sourcePath(e) {
    return this.mapOpts.from ? this.toUrl(this.mapOpts.from) : this.usesFileUrls ? this.toFileUrl(e.source.input.from) : this.toUrl(this.path(e.source.input.from));
  }
  toBase64(e) {
    return Buffer ? Buffer.from(e).toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  }
  toFileUrl(e) {
    let t = this.memoizedFileURLs.get(e);
    if (t) return t;
    if (wi) {
      let r = wi(e).toString();
      return this.memoizedFileURLs.set(e, r), r;
    } else
      throw new Error(
        "`map.absolute` option is not available in this PostCSS build"
      );
  }
  toUrl(e) {
    let t = this.memoizedURLs.get(e);
    if (t) return t;
    Rn === "\\" && (e = e.replace(/\\/g, "/"));
    let r = encodeURI(e).replace(/[#?]/g, encodeURIComponent);
    return this.memoizedURLs.set(e, r), r;
  }
};
var En = _a;
let La = Gt, Br = class extends La {
  constructor(e) {
    super(e), this.type = "comment";
  }
};
var Zt = Br;
Br.default = Br;
let { isClean: In, my: Nn } = Be, Pn = Vt, Mn = Zt, ka = Gt, _n, Es, Is, Ln;
function kn(i) {
  return i.map((e) => (e.nodes && (e.nodes = kn(e.nodes)), delete e.source, e));
}
function Dn(i) {
  if (i[In] = !1, i.proxyOf.nodes)
    for (let e of i.proxyOf.nodes)
      Dn(e);
}
let H = class Un extends ka {
  append(...e) {
    for (let t of e) {
      let r = this.normalize(t, this.last);
      for (let s of r) this.proxyOf.nodes.push(s);
    }
    return this.markDirty(), this;
  }
  cleanRaws(e) {
    if (super.cleanRaws(e), this.nodes)
      for (let t of this.nodes) t.cleanRaws(e);
  }
  each(e) {
    if (!this.proxyOf.nodes) return;
    let t = this.getIterator(), r, s;
    for (; this.indexes[t] < this.proxyOf.nodes.length && (r = this.indexes[t], s = e(this.proxyOf.nodes[r], r), s !== !1); )
      this.indexes[t] += 1;
    return delete this.indexes[t], s;
  }
  every(e) {
    return this.nodes.every(e);
  }
  getIterator() {
    this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
    let e = this.lastEach;
    return this.indexes[e] = 0, e;
  }
  getProxyProcessor() {
    return {
      get(e, t) {
        return t === "proxyOf" ? e : e[t] ? t === "each" || typeof t == "string" && t.startsWith("walk") ? (...r) => e[t](
          ...r.map((s) => typeof s == "function" ? (n, o) => s(n.toProxy(), o) : s)
        ) : t === "every" || t === "some" ? (r) => e[t](
          (s, ...n) => r(s.toProxy(), ...n)
        ) : t === "root" ? () => e.root().toProxy() : t === "nodes" ? e.nodes.map((r) => r.toProxy()) : t === "first" || t === "last" ? e[t].toProxy() : e[t] : e[t];
      },
      set(e, t, r) {
        return e[t] === r || (e[t] = r, (t === "name" || t === "params" || t === "selector") && e.markDirty()), !0;
      }
    };
  }
  index(e) {
    return typeof e == "number" ? e : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
  }
  insertAfter(e, t) {
    let r = this.index(e), s = this.normalize(t, this.proxyOf.nodes[r]).reverse();
    r = this.index(e);
    for (let o of s) this.proxyOf.nodes.splice(r + 1, 0, o);
    let n;
    for (let o in this.indexes)
      n = this.indexes[o], r < n && (this.indexes[o] = n + s.length);
    return this.markDirty(), this;
  }
  insertBefore(e, t) {
    let r = this.index(e), s = r === 0 ? "prepend" : !1, n = this.normalize(t, this.proxyOf.nodes[r], s).reverse();
    r = this.index(e);
    for (let a of n) this.proxyOf.nodes.splice(r, 0, a);
    let o;
    for (let a in this.indexes)
      o = this.indexes[a], r <= o && (this.indexes[a] = o + n.length);
    return this.markDirty(), this;
  }
  normalize(e, t) {
    if (typeof e == "string")
      e = kn(_n(e).nodes);
    else if (typeof e > "u")
      e = [];
    else if (Array.isArray(e)) {
      e = e.slice(0);
      for (let s of e)
        s.parent && s.parent.removeChild(s, "ignore");
    } else if (e.type === "root" && this.type !== "document") {
      e = e.nodes.slice(0);
      for (let s of e)
        s.parent && s.parent.removeChild(s, "ignore");
    } else if (e.type)
      e = [e];
    else if (e.prop) {
      if (typeof e.value > "u")
        throw new Error("Value field is missed in node creation");
      typeof e.value != "string" && (e.value = String(e.value)), e = [new Pn(e)];
    } else if (e.selector)
      e = [new Es(e)];
    else if (e.name)
      e = [new Is(e)];
    else if (e.text)
      e = [new Mn(e)];
    else
      throw new Error("Unknown node type in node creation");
    return e.map((s) => (s[Nn] || Un.rebuild(s), s = s.proxyOf, s.parent && s.parent.removeChild(s), s[In] && Dn(s), typeof s.raws.before > "u" && t && typeof t.raws.before < "u" && (s.raws.before = t.raws.before.replace(/\S/g, "")), s.parent = this.proxyOf, s));
  }
  prepend(...e) {
    e = e.reverse();
    for (let t of e) {
      let r = this.normalize(t, this.first, "prepend").reverse();
      for (let s of r) this.proxyOf.nodes.unshift(s);
      for (let s in this.indexes)
        this.indexes[s] = this.indexes[s] + r.length;
    }
    return this.markDirty(), this;
  }
  push(e) {
    return e.parent = this, this.proxyOf.nodes.push(e), this;
  }
  removeAll() {
    for (let e of this.proxyOf.nodes) e.parent = void 0;
    return this.proxyOf.nodes = [], this.markDirty(), this;
  }
  removeChild(e) {
    e = this.index(e), this.proxyOf.nodes[e].parent = void 0, this.proxyOf.nodes.splice(e, 1);
    let t;
    for (let r in this.indexes)
      t = this.indexes[r], t >= e && (this.indexes[r] = t - 1);
    return this.markDirty(), this;
  }
  replaceValues(e, t, r) {
    return r || (r = t, t = {}), this.walkDecls((s) => {
      t.props && !t.props.includes(s.prop) || t.fast && !s.value.includes(t.fast) || (s.value = s.value.replace(e, r));
    }), this.markDirty(), this;
  }
  some(e) {
    return this.nodes.some(e);
  }
  walk(e) {
    return this.each((t, r) => {
      let s;
      try {
        s = e(t, r);
      } catch (n) {
        throw t.addToError(n);
      }
      return s !== !1 && t.walk && (s = t.walk(e)), s;
    });
  }
  walkAtRules(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "atrule" && e.test(r.name))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "atrule" && r.name === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "atrule")
        return t(r, s);
    }));
  }
  walkComments(e) {
    return this.walk((t, r) => {
      if (t.type === "comment")
        return e(t, r);
    });
  }
  walkDecls(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "decl" && e.test(r.prop))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "decl" && r.prop === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "decl")
        return t(r, s);
    }));
  }
  walkRules(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "rule" && e.test(r.selector))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "rule" && r.selector === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "rule")
        return t(r, s);
    }));
  }
  get first() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[0];
  }
  get last() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
};
H.registerParse = (i) => {
  _n = i;
};
H.registerRule = (i) => {
  Es = i;
};
H.registerAtRule = (i) => {
  Is = i;
};
H.registerRoot = (i) => {
  Ln = i;
};
var te = H;
H.default = H;
H.rebuild = (i) => {
  i.type === "atrule" ? Object.setPrototypeOf(i, Is.prototype) : i.type === "rule" ? Object.setPrototypeOf(i, Es.prototype) : i.type === "decl" ? Object.setPrototypeOf(i, Pn.prototype) : i.type === "comment" ? Object.setPrototypeOf(i, Mn.prototype) : i.type === "root" && Object.setPrototypeOf(i, Ln.prototype), i[Nn] = !0, i.nodes && i.nodes.forEach((e) => {
    H.rebuild(e);
  });
};
let Da = te, Tn, Bn, Re = class extends Da {
  constructor(e) {
    super({ type: "document", ...e }), this.nodes || (this.nodes = []);
  }
  toResult(e = {}) {
    return new Tn(new Bn(), this, e).stringify();
  }
};
Re.registerLazyResult = (i) => {
  Tn = i;
};
Re.registerProcessor = (i) => {
  Bn = i;
};
var Ns = Re;
Re.default = Re;
let bi = {};
var Fn = function(e) {
  bi[e] || (bi[e] = !0, typeof console < "u" && console.warn && console.warn(e));
};
let Fr = class {
  constructor(e, t = {}) {
    if (this.type = "warning", this.text = e, t.node && t.node.source) {
      let r = t.node.rangeBy(t);
      this.line = r.start.line, this.column = r.start.column, this.endLine = r.end.line, this.endColumn = r.end.column;
    }
    for (let r in t) this[r] = t[r];
  }
  toString() {
    return this.node ? this.node.error(this.text, {
      index: this.index,
      plugin: this.plugin,
      word: this.word
    }).message : this.plugin ? this.plugin + ": " + this.text : this.text;
  }
};
var zn = Fr;
Fr.default = Fr;
let Ua = zn, zr = class {
  constructor(e, t, r) {
    this.processor = e, this.messages = [], this.root = t, this.opts = r, this.css = void 0, this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(e, t = {}) {
    t.plugin || this.lastPlugin && this.lastPlugin.postcssPlugin && (t.plugin = this.lastPlugin.postcssPlugin);
    let r = new Ua(e, t);
    return this.messages.push(r), r;
  }
  warnings() {
    return this.messages.filter((e) => e.type === "warning");
  }
  get content() {
    return this.css;
  }
};
var Ps = zr;
zr.default = zr;
const dr = 39, Ci = 34, Je = 92, $i = 47, He = 10, Ce = 32, Ke = 12, Xe = 9, Qe = 13, Ta = 91, Ba = 93, Fa = 40, za = 41, Wa = 123, ja = 125, Ga = 59, Va = 42, Ya = 58, Za = 64, qe = /[\t\n\f\r "#'()/;[\\\]{}]/g, et = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g, Ja = /.[\r\n"'(/\\]/, Si = /[\da-f]/i;
var Ha = function(e, t = {}) {
  let r = e.css.valueOf(), s = t.ignoreErrors, n, o, a, l, u, f, c, p, d, g, w = r.length, h = 0, v = [], O = [];
  function m() {
    return h;
  }
  function y(M) {
    throw e.error("Unclosed " + M, h);
  }
  function _() {
    return O.length === 0 && h >= w;
  }
  function D(M) {
    if (O.length) return O.pop();
    if (h >= w) return;
    let L = M ? M.ignoreUnclosed : !1;
    switch (n = r.charCodeAt(h), n) {
      case He:
      case Ce:
      case Xe:
      case Qe:
      case Ke: {
        o = h;
        do
          o += 1, n = r.charCodeAt(o);
        while (n === Ce || n === He || n === Xe || n === Qe || n === Ke);
        g = ["space", r.slice(h, o)], h = o - 1;
        break;
      }
      case Ta:
      case Ba:
      case Wa:
      case ja:
      case Ya:
      case Ga:
      case za: {
        let T = String.fromCharCode(n);
        g = [T, T, h];
        break;
      }
      case Fa: {
        if (p = v.length ? v.pop()[1] : "", d = r.charCodeAt(h + 1), p === "url" && d !== dr && d !== Ci && d !== Ce && d !== He && d !== Xe && d !== Ke && d !== Qe) {
          o = h;
          do {
            if (f = !1, o = r.indexOf(")", o + 1), o === -1)
              if (s || L) {
                o = h;
                break;
              } else
                y("bracket");
            for (c = o; r.charCodeAt(c - 1) === Je; )
              c -= 1, f = !f;
          } while (f);
          g = ["brackets", r.slice(h, o + 1), h, o], h = o;
        } else
          o = r.indexOf(")", h + 1), l = r.slice(h, o + 1), o === -1 || Ja.test(l) ? g = ["(", "(", h] : (g = ["brackets", l, h, o], h = o);
        break;
      }
      case dr:
      case Ci: {
        a = n === dr ? "'" : '"', o = h;
        do {
          if (f = !1, o = r.indexOf(a, o + 1), o === -1)
            if (s || L) {
              o = h + 1;
              break;
            } else
              y("string");
          for (c = o; r.charCodeAt(c - 1) === Je; )
            c -= 1, f = !f;
        } while (f);
        g = ["string", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      case Za: {
        qe.lastIndex = h + 1, qe.test(r), qe.lastIndex === 0 ? o = r.length - 1 : o = qe.lastIndex - 2, g = ["at-word", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      case Je: {
        for (o = h, u = !0; r.charCodeAt(o + 1) === Je; )
          o += 1, u = !u;
        if (n = r.charCodeAt(o + 1), u && n !== $i && n !== Ce && n !== He && n !== Xe && n !== Qe && n !== Ke && (o += 1, Si.test(r.charAt(o)))) {
          for (; Si.test(r.charAt(o + 1)); )
            o += 1;
          r.charCodeAt(o + 1) === Ce && (o += 1);
        }
        g = ["word", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      default: {
        n === $i && r.charCodeAt(h + 1) === Va ? (o = r.indexOf("*/", h + 2) + 1, o === 0 && (s || L ? o = r.length : y("comment")), g = ["comment", r.slice(h, o + 1), h, o], h = o) : (et.lastIndex = h + 1, et.test(r), et.lastIndex === 0 ? o = r.length - 1 : o = et.lastIndex - 2, g = ["word", r.slice(h, o + 1), h, o], v.push(g), h = o);
        break;
      }
    }
    return h++, g;
  }
  function V(M) {
    O.push(M);
  }
  return {
    back: V,
    endOfFile: _,
    nextToken: D,
    position: m
  };
};
let Wn = te, Pt = class extends Wn {
  constructor(e) {
    super(e), this.type = "atrule";
  }
  append(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
  }
  prepend(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
  }
};
var Ms = Pt;
Pt.default = Pt;
Wn.registerAtRule(Pt);
let jn = te, Gn, Vn, ue = class extends jn {
  constructor(e) {
    super(e), this.type = "root", this.nodes || (this.nodes = []);
  }
  normalize(e, t, r) {
    let s = super.normalize(e);
    if (t) {
      if (r === "prepend")
        this.nodes.length > 1 ? t.raws.before = this.nodes[1].raws.before : delete t.raws.before;
      else if (this.first !== t)
        for (let n of s)
          n.raws.before = t.raws.before;
    }
    return s;
  }
  removeChild(e, t) {
    let r = this.index(e);
    return !t && r === 0 && this.nodes.length > 1 && (this.nodes[1].raws.before = this.nodes[r].raws.before), super.removeChild(e);
  }
  toResult(e = {}) {
    return new Gn(new Vn(), this, e).stringify();
  }
};
ue.registerLazyResult = (i) => {
  Gn = i;
};
ue.registerProcessor = (i) => {
  Vn = i;
};
var Fe = ue;
ue.default = ue;
jn.registerRoot(ue);
let Ee = {
  comma(i) {
    return Ee.split(i, [","], !0);
  },
  space(i) {
    let e = [" ", `
`, "	"];
    return Ee.split(i, e);
  },
  split(i, e, t) {
    let r = [], s = "", n = !1, o = 0, a = !1, l = "", u = !1;
    for (let f of i)
      u ? u = !1 : f === "\\" ? u = !0 : a ? f === l && (a = !1) : f === '"' || f === "'" ? (a = !0, l = f) : f === "(" ? o += 1 : f === ")" ? o > 0 && (o -= 1) : o === 0 && e.includes(f) && (n = !0), n ? (s !== "" && r.push(s.trim()), s = "", n = !1) : s += f;
    return (t || s !== "") && r.push(s.trim()), r;
  }
};
var Yn = Ee;
Ee.default = Ee;
let Zn = te, Ka = Yn, Mt = class extends Zn {
  constructor(e) {
    super(e), this.type = "rule", this.nodes || (this.nodes = []);
  }
  get selectors() {
    return Ka.comma(this.selector);
  }
  set selectors(e) {
    let t = this.selector ? this.selector.match(/,\s*/) : null, r = t ? t[0] : "," + this.raw("between", "beforeOpen");
    this.selector = e.join(r);
  }
};
var _s = Mt;
Mt.default = Mt;
Zn.registerRule(Mt);
let Xa = Vt, Qa = Ha, qa = Zt, eu = Ms, tu = Fe, vi = _s;
const xi = {
  empty: !0,
  space: !0
};
function ru(i) {
  for (let e = i.length - 1; e >= 0; e--) {
    let t = i[e], r = t[3] || t[2];
    if (r) return r;
  }
}
let su = class {
  constructor(e) {
    this.input = e, this.root = new tu(), this.current = this.root, this.spaces = "", this.semicolon = !1, this.createTokenizer(), this.root.source = { input: e, start: { column: 1, line: 1, offset: 0 } };
  }
  atrule(e) {
    let t = new eu();
    t.name = e[1].slice(1), t.name === "" && this.unnamedAtrule(t, e), this.init(t, e[2]);
    let r, s, n, o = !1, a = !1, l = [], u = [];
    for (; !this.tokenizer.endOfFile(); ) {
      if (e = this.tokenizer.nextToken(), r = e[0], r === "(" || r === "[" ? u.push(r === "(" ? ")" : "]") : r === "{" && u.length > 0 ? u.push("}") : r === u[u.length - 1] && u.pop(), u.length === 0)
        if (r === ";") {
          t.source.end = this.getPosition(e[2]), t.source.end.offset++, this.semicolon = !0;
          break;
        } else if (r === "{") {
          a = !0;
          break;
        } else if (r === "}") {
          if (l.length > 0) {
            for (n = l.length - 1, s = l[n]; s && s[0] === "space"; )
              s = l[--n];
            s && (t.source.end = this.getPosition(s[3] || s[2]), t.source.end.offset++);
          }
          this.end(e);
          break;
        } else
          l.push(e);
      else
        l.push(e);
      if (this.tokenizer.endOfFile()) {
        o = !0;
        break;
      }
    }
    t.raws.between = this.spacesAndCommentsFromEnd(l), l.length ? (t.raws.afterName = this.spacesAndCommentsFromStart(l), this.raw(t, "params", l), o && (e = l[l.length - 1], t.source.end = this.getPosition(e[3] || e[2]), t.source.end.offset++, this.spaces = t.raws.between, t.raws.between = "")) : (t.raws.afterName = "", t.params = ""), a && (t.nodes = [], this.current = t);
  }
  checkMissedSemicolon(e) {
    let t = this.colon(e);
    if (t === !1) return;
    let r = 0, s;
    for (let n = t - 1; n >= 0 && (s = e[n], !(s[0] !== "space" && (r += 1, r === 2))); n--)
      ;
    throw this.input.error(
      "Missed semicolon",
      s[0] === "word" ? s[3] + 1 : s[2]
    );
  }
  colon(e) {
    let t = 0, r, s, n;
    for (let [o, a] of e.entries()) {
      if (r = a, s = r[0], s === "(" && (t += 1), s === ")" && (t -= 1), t === 0 && s === ":")
        if (!n)
          this.doubleColon(r);
        else {
          if (n[0] === "word" && n[1] === "progid")
            continue;
          return o;
        }
      n = r;
    }
    return !1;
  }
  comment(e) {
    let t = new qa();
    this.init(t, e[2]), t.source.end = this.getPosition(e[3] || e[2]), t.source.end.offset++;
    let r = e[1].slice(2, -2);
    if (/^\s*$/.test(r))
      t.text = "", t.raws.left = r, t.raws.right = "";
    else {
      let s = r.match(/^(\s*)([^]*\S)(\s*)$/);
      t.text = s[2], t.raws.left = s[1], t.raws.right = s[3];
    }
  }
  createTokenizer() {
    this.tokenizer = Qa(this.input);
  }
  decl(e, t) {
    let r = new Xa();
    this.init(r, e[0][2]);
    let s = e[e.length - 1];
    for (s[0] === ";" && (this.semicolon = !0, e.pop()), r.source.end = this.getPosition(
      s[3] || s[2] || ru(e)
    ), r.source.end.offset++; e[0][0] !== "word"; )
      e.length === 1 && this.unknownWord(e), r.raws.before += e.shift()[1];
    for (r.source.start = this.getPosition(e[0][2]), r.prop = ""; e.length; ) {
      let u = e[0][0];
      if (u === ":" || u === "space" || u === "comment")
        break;
      r.prop += e.shift()[1];
    }
    r.raws.between = "";
    let n;
    for (; e.length; )
      if (n = e.shift(), n[0] === ":") {
        r.raws.between += n[1];
        break;
      } else
        n[0] === "word" && /\w/.test(n[1]) && this.unknownWord([n]), r.raws.between += n[1];
    (r.prop[0] === "_" || r.prop[0] === "*") && (r.raws.before += r.prop[0], r.prop = r.prop.slice(1));
    let o = [], a;
    for (; e.length && (a = e[0][0], !(a !== "space" && a !== "comment")); )
      o.push(e.shift());
    this.precheckMissedSemicolon(e);
    for (let u = e.length - 1; u >= 0; u--) {
      if (n = e[u], n[1].toLowerCase() === "!important") {
        r.important = !0;
        let f = this.stringFrom(e, u);
        f = this.spacesFromEnd(e) + f, f !== " !important" && (r.raws.important = f);
        break;
      } else if (n[1].toLowerCase() === "important") {
        let f = e.slice(0), c = "";
        for (let p = u; p > 0; p--) {
          let d = f[p][0];
          if (c.trim().indexOf("!") === 0 && d !== "space")
            break;
          c = f.pop()[1] + c;
        }
        c.trim().indexOf("!") === 0 && (r.important = !0, r.raws.important = c, e = f);
      }
      if (n[0] !== "space" && n[0] !== "comment")
        break;
    }
    e.some((u) => u[0] !== "space" && u[0] !== "comment") && (r.raws.between += o.map((u) => u[1]).join(""), o = []), this.raw(r, "value", o.concat(e), t), r.value.includes(":") && !t && this.checkMissedSemicolon(e);
  }
  doubleColon(e) {
    throw this.input.error(
      "Double colon",
      { offset: e[2] },
      { offset: e[2] + e[1].length }
    );
  }
  emptyRule(e) {
    let t = new vi();
    this.init(t, e[2]), t.selector = "", t.raws.between = "", this.current = t;
  }
  end(e) {
    this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.semicolon = !1, this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.spaces = "", this.current.parent ? (this.current.source.end = this.getPosition(e[2]), this.current.source.end.offset++, this.current = this.current.parent) : this.unexpectedClose(e);
  }
  endFile() {
    this.current.parent && this.unclosedBlock(), this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.root.source.end = this.getPosition(this.tokenizer.position());
  }
  freeSemicolon(e) {
    if (this.spaces += e[1], this.current.nodes) {
      let t = this.current.nodes[this.current.nodes.length - 1];
      t && t.type === "rule" && !t.raws.ownSemicolon && (t.raws.ownSemicolon = this.spaces, this.spaces = "");
    }
  }
  // Helpers
  getPosition(e) {
    let t = this.input.fromOffset(e);
    return {
      column: t.col,
      line: t.line,
      offset: e
    };
  }
  init(e, t) {
    this.current.push(e), e.source = {
      input: this.input,
      start: this.getPosition(t)
    }, e.raws.before = this.spaces, this.spaces = "", e.type !== "comment" && (this.semicolon = !1);
  }
  other(e) {
    let t = !1, r = null, s = !1, n = null, o = [], a = e[1].startsWith("--"), l = [], u = e;
    for (; u; ) {
      if (r = u[0], l.push(u), r === "(" || r === "[")
        n || (n = u), o.push(r === "(" ? ")" : "]");
      else if (a && s && r === "{")
        n || (n = u), o.push("}");
      else if (o.length === 0)
        if (r === ";")
          if (s) {
            this.decl(l, a);
            return;
          } else
            break;
        else if (r === "{") {
          this.rule(l);
          return;
        } else if (r === "}") {
          this.tokenizer.back(l.pop()), t = !0;
          break;
        } else r === ":" && (s = !0);
      else r === o[o.length - 1] && (o.pop(), o.length === 0 && (n = null));
      u = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile() && (t = !0), o.length > 0 && this.unclosedBracket(n), t && s) {
      if (!a)
        for (; l.length && (u = l[l.length - 1][0], !(u !== "space" && u !== "comment")); )
          this.tokenizer.back(l.pop());
      this.decl(l, a);
    } else
      this.unknownWord(l);
  }
  parse() {
    let e;
    for (; !this.tokenizer.endOfFile(); )
      switch (e = this.tokenizer.nextToken(), e[0]) {
        case "space":
          this.spaces += e[1];
          break;
        case ";":
          this.freeSemicolon(e);
          break;
        case "}":
          this.end(e);
          break;
        case "comment":
          this.comment(e);
          break;
        case "at-word":
          this.atrule(e);
          break;
        case "{":
          this.emptyRule(e);
          break;
        default:
          this.other(e);
          break;
      }
    this.endFile();
  }
  precheckMissedSemicolon() {
  }
  raw(e, t, r, s) {
    let n, o, a = r.length, l = "", u = !0, f, c;
    for (let p = 0; p < a; p += 1)
      n = r[p], o = n[0], o === "space" && p === a - 1 && !s ? u = !1 : o === "comment" ? (c = r[p - 1] ? r[p - 1][0] : "empty", f = r[p + 1] ? r[p + 1][0] : "empty", !xi[c] && !xi[f] ? l.slice(-1) === "," ? u = !1 : l += n[1] : u = !1) : l += n[1];
    if (!u) {
      let p = r.reduce((d, g) => d + g[1], "");
      e.raws[t] = { raw: p, value: l };
    }
    e[t] = l;
  }
  rule(e) {
    e.pop();
    let t = new vi();
    this.init(t, e[0][2]), t.raws.between = this.spacesAndCommentsFromEnd(e), this.raw(t, "selector", e), this.current = t;
  }
  spacesAndCommentsFromEnd(e) {
    let t, r = "";
    for (; e.length && (t = e[e.length - 1][0], !(t !== "space" && t !== "comment")); )
      r = e.pop()[1] + r;
    return r;
  }
  // Errors
  spacesAndCommentsFromStart(e) {
    let t, r = "";
    for (; e.length && (t = e[0][0], !(t !== "space" && t !== "comment")); )
      r += e.shift()[1];
    return r;
  }
  spacesFromEnd(e) {
    let t, r = "";
    for (; e.length && (t = e[e.length - 1][0], t === "space"); )
      r = e.pop()[1] + r;
    return r;
  }
  stringFrom(e, t) {
    let r = "";
    for (let s = t; s < e.length; s++)
      r += e[s][1];
    return e.splice(t, e.length - t), r;
  }
  unclosedBlock() {
    let e = this.current.source.start;
    throw this.input.error("Unclosed block", e.line, e.column);
  }
  unclosedBracket(e) {
    throw this.input.error(
      "Unclosed bracket",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unexpectedClose(e) {
    throw this.input.error(
      "Unexpected }",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unknownWord(e) {
    throw this.input.error(
      "Unknown word",
      { offset: e[0][2] },
      { offset: e[0][2] + e[0][1].length }
    );
  }
  unnamedAtrule(e, t) {
    throw this.input.error(
      "At-rule without name",
      { offset: t[2] },
      { offset: t[2] + t[1].length }
    );
  }
};
var iu = su;
let nu = te, ou = iu, lu = Yt;
function _t(i, e) {
  let t = new lu(i, e), r = new ou(t);
  try {
    r.parse();
  } catch (s) {
    throw process.env.NODE_ENV !== "production" && s.name === "CssSyntaxError" && e && e.from && (/\.scss$/i.test(e.from) ? s.message += `
You tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser` : /\.sass/i.test(e.from) ? s.message += `
You tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser` : /\.less$/i.test(e.from) && (s.message += `
You tried to parse Less with the standard CSS parser; try again with the postcss-less parser`)), s;
  }
  return r.root;
}
var Ls = _t;
_t.default = _t;
nu.registerParse(_t);
let { isClean: Y, my: au } = Be, uu = En, fu = jt, hu = te, cu = Ns, pu = Fn, Oi = Ps, du = Ls, mu = Fe;
const gu = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  document: "Document",
  root: "Root",
  rule: "Rule"
}, yu = {
  AtRule: !0,
  AtRuleExit: !0,
  Comment: !0,
  CommentExit: !0,
  Declaration: !0,
  DeclarationExit: !0,
  Document: !0,
  DocumentExit: !0,
  Once: !0,
  OnceExit: !0,
  postcssPlugin: !0,
  prepare: !0,
  Root: !0,
  RootExit: !0,
  Rule: !0,
  RuleExit: !0
}, wu = {
  Once: !0,
  postcssPlugin: !0,
  prepare: !0
}, fe = 0;
function $e(i) {
  return typeof i == "object" && typeof i.then == "function";
}
function Jn(i) {
  let e = !1, t = gu[i.type];
  return i.type === "decl" ? e = i.prop.toLowerCase() : i.type === "atrule" && (e = i.name.toLowerCase()), e && i.append ? [
    t,
    t + "-" + e,
    fe,
    t + "Exit",
    t + "Exit-" + e
  ] : e ? [t, t + "-" + e, t + "Exit", t + "Exit-" + e] : i.append ? [t, fe, t + "Exit"] : [t, t + "Exit"];
}
function Ai(i) {
  let e;
  return i.type === "document" ? e = ["Document", fe, "DocumentExit"] : i.type === "root" ? e = ["Root", fe, "RootExit"] : e = Jn(i), {
    eventIndex: 0,
    events: e,
    iterator: 0,
    node: i,
    visitorIndex: 0,
    visitors: []
  };
}
function Wr(i) {
  return i[Y] = !1, i.nodes && i.nodes.forEach((e) => Wr(e)), i;
}
let jr = {}, he = class Hn {
  constructor(e, t, r) {
    this.stringified = !1, this.processed = !1;
    let s;
    if (typeof t == "object" && t !== null && (t.type === "root" || t.type === "document"))
      s = Wr(t);
    else if (t instanceof Hn || t instanceof Oi)
      s = Wr(t.root), t.map && (typeof r.map > "u" && (r.map = {}), r.map.inline || (r.map.inline = !1), r.map.prev = t.map);
    else {
      let n = du;
      r.syntax && (n = r.syntax.parse), r.parser && (n = r.parser), n.parse && (n = n.parse);
      try {
        s = n(t, r);
      } catch (o) {
        this.processed = !0, this.error = o;
      }
      s && !s[au] && hu.rebuild(s);
    }
    this.result = new Oi(e, s, r), this.helpers = { ...jr, postcss: jr, result: this.result }, this.plugins = this.processor.plugins.map((n) => typeof n == "object" && n.prepare ? { ...n, ...n.prepare(this.result) } : n);
  }
  async() {
    return this.error ? Promise.reject(this.error) : this.processed ? Promise.resolve(this.result) : (this.processing || (this.processing = this.runAsync()), this.processing);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(e, t) {
    let r = this.result.lastPlugin;
    try {
      if (t && t.addToError(e), this.error = e, e.name === "CssSyntaxError" && !e.plugin)
        e.plugin = r.postcssPlugin, e.setMessage();
      else if (r.postcssVersion && process.env.NODE_ENV !== "production") {
        let s = r.postcssPlugin, n = r.postcssVersion, o = this.result.processor.version, a = n.split("."), l = o.split(".");
        (a[0] !== l[0] || parseInt(a[1]) > parseInt(l[1])) && console.error(
          "Unknown error from PostCSS plugin. Your current PostCSS version is " + o + ", but " + s + " uses " + n + ". Perhaps this is the source of the error below."
        );
      }
    } catch (s) {
      console && console.error && console.error(s);
    }
    return e;
  }
  prepareVisitors() {
    this.listeners = {};
    let e = (t, r, s) => {
      this.listeners[r] || (this.listeners[r] = []), this.listeners[r].push([t, s]);
    };
    for (let t of this.plugins)
      if (typeof t == "object")
        for (let r in t) {
          if (!yu[r] && /^[A-Z]/.test(r))
            throw new Error(
              `Unknown event ${r} in ${t.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          if (!wu[r])
            if (typeof t[r] == "object")
              for (let s in t[r])
                s === "*" ? e(t, r, t[r][s]) : e(
                  t,
                  r + "-" + s.toLowerCase(),
                  t[r][s]
                );
            else typeof t[r] == "function" && e(t, r, t[r]);
        }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  async runAsync() {
    this.plugin = 0;
    for (let e = 0; e < this.plugins.length; e++) {
      let t = this.plugins[e], r = this.runOnRoot(t);
      if ($e(r))
        try {
          await r;
        } catch (s) {
          throw this.handleError(s);
        }
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[Y]; ) {
        e[Y] = !0;
        let t = [Ai(e)];
        for (; t.length > 0; ) {
          let r = this.visitTick(t);
          if ($e(r))
            try {
              await r;
            } catch (s) {
              let n = t[t.length - 1].node;
              throw this.handleError(s, n);
            }
        }
      }
      if (this.listeners.OnceExit)
        for (let [t, r] of this.listeners.OnceExit) {
          this.result.lastPlugin = t;
          try {
            if (e.type === "document") {
              let s = e.nodes.map(
                (n) => r(n, this.helpers)
              );
              await Promise.all(s);
            } else
              await r(e, this.helpers);
          } catch (s) {
            throw this.handleError(s);
          }
        }
    }
    return this.processed = !0, this.stringify();
  }
  runOnRoot(e) {
    this.result.lastPlugin = e;
    try {
      if (typeof e == "object" && e.Once) {
        if (this.result.root.type === "document") {
          let t = this.result.root.nodes.map(
            (r) => e.Once(r, this.helpers)
          );
          return $e(t[0]) ? Promise.all(t) : t;
        }
        return e.Once(this.result.root, this.helpers);
      } else if (typeof e == "function")
        return e(this.result.root, this.result);
    } catch (t) {
      throw this.handleError(t);
    }
  }
  stringify() {
    if (this.error) throw this.error;
    if (this.stringified) return this.result;
    this.stringified = !0, this.sync();
    let e = this.result.opts, t = fu;
    e.syntax && (t = e.syntax.stringify), e.stringifier && (t = e.stringifier), t.stringify && (t = t.stringify);
    let s = new uu(t, this.result.root, this.result.opts).generate();
    return this.result.css = s[0], this.result.map = s[1], this.result;
  }
  sync() {
    if (this.error) throw this.error;
    if (this.processed) return this.result;
    if (this.processed = !0, this.processing)
      throw this.getAsyncError();
    for (let e of this.plugins) {
      let t = this.runOnRoot(e);
      if ($e(t))
        throw this.getAsyncError();
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[Y]; )
        e[Y] = !0, this.walkSync(e);
      if (this.listeners.OnceExit)
        if (e.type === "document")
          for (let t of e.nodes)
            this.visitSync(this.listeners.OnceExit, t);
        else
          this.visitSync(this.listeners.OnceExit, e);
    }
    return this.result;
  }
  then(e, t) {
    return process.env.NODE_ENV !== "production" && ("from" in this.opts || pu(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, t);
  }
  toString() {
    return this.css;
  }
  visitSync(e, t) {
    for (let [r, s] of e) {
      this.result.lastPlugin = r;
      let n;
      try {
        n = s(t, this.helpers);
      } catch (o) {
        throw this.handleError(o, t.proxyOf);
      }
      if (t.type !== "root" && t.type !== "document" && !t.parent)
        return !0;
      if ($e(n))
        throw this.getAsyncError();
    }
  }
  visitTick(e) {
    let t = e[e.length - 1], { node: r, visitors: s } = t;
    if (r.type !== "root" && r.type !== "document" && !r.parent) {
      e.pop();
      return;
    }
    if (s.length > 0 && t.visitorIndex < s.length) {
      let [o, a] = s[t.visitorIndex];
      t.visitorIndex += 1, t.visitorIndex === s.length && (t.visitors = [], t.visitorIndex = 0), this.result.lastPlugin = o;
      try {
        return a(r.toProxy(), this.helpers);
      } catch (l) {
        throw this.handleError(l, r);
      }
    }
    if (t.iterator !== 0) {
      let o = t.iterator, a;
      for (; a = r.nodes[r.indexes[o]]; )
        if (r.indexes[o] += 1, !a[Y]) {
          a[Y] = !0, e.push(Ai(a));
          return;
        }
      t.iterator = 0, delete r.indexes[o];
    }
    let n = t.events;
    for (; t.eventIndex < n.length; ) {
      let o = n[t.eventIndex];
      if (t.eventIndex += 1, o === fe) {
        r.nodes && r.nodes.length && (r[Y] = !0, t.iterator = r.getIterator());
        return;
      } else if (this.listeners[o]) {
        t.visitors = this.listeners[o];
        return;
      }
    }
    e.pop();
  }
  walkSync(e) {
    e[Y] = !0;
    let t = Jn(e);
    for (let r of t)
      if (r === fe)
        e.nodes && e.each((s) => {
          s[Y] || this.walkSync(s);
        });
      else {
        let s = this.listeners[r];
        if (s && this.visitSync(s, e.toProxy()))
          return;
      }
  }
  warnings() {
    return this.sync().warnings();
  }
  get content() {
    return this.stringify().content;
  }
  get css() {
    return this.stringify().css;
  }
  get map() {
    return this.stringify().map;
  }
  get messages() {
    return this.sync().messages;
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    return this.sync().root;
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
};
he.registerPostcss = (i) => {
  jr = i;
};
var Kn = he;
he.default = he;
mu.registerLazyResult(he);
cu.registerLazyResult(he);
let bu = En, Cu = jt, $u = Fn, Su = Ls;
const vu = Ps;
let Gr = class {
  constructor(e, t, r) {
    t = t.toString(), this.stringified = !1, this._processor = e, this._css = t, this._opts = r, this._map = void 0;
    let s, n = Cu;
    this.result = new vu(this._processor, s, this._opts), this.result.css = t;
    let o = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return o.root;
      }
    });
    let a = new bu(n, s, this._opts, t);
    if (a.isMap()) {
      let [l, u] = a.generate();
      l && (this.result.css = l), u && (this.result.map = u);
    } else
      a.clearAnnotation(), this.result.css = a.css;
  }
  async() {
    return this.error ? Promise.reject(this.error) : Promise.resolve(this.result);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  sync() {
    if (this.error) throw this.error;
    return this.result;
  }
  then(e, t) {
    return process.env.NODE_ENV !== "production" && ("from" in this._opts || $u(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, t);
  }
  toString() {
    return this._css;
  }
  warnings() {
    return [];
  }
  get content() {
    return this.result.css;
  }
  get css() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get messages() {
    return [];
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    if (this._root)
      return this._root;
    let e, t = Su;
    try {
      e = t(this._css, this._opts);
    } catch (r) {
      this.error = r;
    }
    if (this.error)
      throw this.error;
    return this._root = e, e;
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};
var xu = Gr;
Gr.default = Gr;
let Ou = xu, Au = Kn, Ru = Ns, Eu = Fe, Ie = class {
  constructor(e = []) {
    this.version = "8.4.38", this.plugins = this.normalize(e);
  }
  normalize(e) {
    let t = [];
    for (let r of e)
      if (r.postcss === !0 ? r = r() : r.postcss && (r = r.postcss), typeof r == "object" && Array.isArray(r.plugins))
        t = t.concat(r.plugins);
      else if (typeof r == "object" && r.postcssPlugin)
        t.push(r);
      else if (typeof r == "function")
        t.push(r);
      else if (typeof r == "object" && (r.parse || r.stringify)) {
        if (process.env.NODE_ENV !== "production")
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
      } else
        throw new Error(r + " is not a PostCSS plugin");
    return t;
  }
  process(e, t = {}) {
    return !this.plugins.length && !t.parser && !t.stringifier && !t.syntax ? new Ou(this, e, t) : new Au(this, e, t);
  }
  use(e) {
    return this.plugins = this.plugins.concat(this.normalize([e])), this;
  }
};
var Iu = Ie;
Ie.default = Ie;
Eu.registerProcessor(Ie);
Ru.registerProcessor(Ie);
let Nu = Vt, Pu = vn, Mu = Zt, _u = Ms, Lu = Yt, ku = Fe, Du = _s;
function Ne(i, e) {
  if (Array.isArray(i)) return i.map((s) => Ne(s));
  let { inputs: t, ...r } = i;
  if (t) {
    e = [];
    for (let s of t) {
      let n = { ...s, __proto__: Lu.prototype };
      n.map && (n.map = {
        ...n.map,
        __proto__: Pu.prototype
      }), e.push(n);
    }
  }
  if (r.nodes && (r.nodes = i.nodes.map((s) => Ne(s, e))), r.source) {
    let { inputId: s, ...n } = r.source;
    r.source = n, s != null && (r.source.input = e[s]);
  }
  if (r.type === "root")
    return new ku(r);
  if (r.type === "decl")
    return new Nu(r);
  if (r.type === "rule")
    return new Du(r);
  if (r.type === "comment")
    return new Mu(r);
  if (r.type === "atrule")
    return new _u(r);
  throw new Error("Unknown node type: " + i.type);
}
var Uu = Ne;
Ne.default = Ne;
let Tu = Rs, Xn = Vt, Bu = Kn, Fu = te, ks = Iu, zu = jt, Wu = Uu, Qn = Ns, ju = zn, qn = Zt, eo = Ms, Gu = Ps, Vu = Yt, Yu = Ls, Zu = Yn, to = _s, ro = Fe, Ju = Gt;
function b(...i) {
  return i.length === 1 && Array.isArray(i[0]) && (i = i[0]), new ks(i);
}
b.plugin = function(e, t) {
  let r = !1;
  function s(...o) {
    console && console.warn && !r && (r = !0, console.warn(
      e + `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`
    ), process.env.LANG && process.env.LANG.startsWith("cn") && console.warn(
      e + `: 里面 postcss.plugin 被弃用. 迁移指南:
https://www.w3ctech.com/topic/2226`
    ));
    let a = t(...o);
    return a.postcssPlugin = e, a.postcssVersion = new ks().version, a;
  }
  let n;
  return Object.defineProperty(s, "postcss", {
    get() {
      return n || (n = s()), n;
    }
  }), s.process = function(o, a, l) {
    return b([s(l)]).process(o, a);
  }, s;
};
b.stringify = zu;
b.parse = Yu;
b.fromJSON = Wu;
b.list = Zu;
b.comment = (i) => new qn(i);
b.atRule = (i) => new eo(i);
b.decl = (i) => new Xn(i);
b.rule = (i) => new to(i);
b.root = (i) => new ro(i);
b.document = (i) => new Qn(i);
b.CssSyntaxError = Tu;
b.Declaration = Xn;
b.Container = Fu;
b.Processor = ks;
b.Document = Qn;
b.Comment = qn;
b.Warning = ju;
b.AtRule = eo;
b.Result = Gu;
b.Input = Vu;
b.Rule = to;
b.Root = ro;
b.Node = Ju;
Bu.registerPostcss(b);
var Hu = b;
b.default = b;
const I = /* @__PURE__ */ na(Hu);
I.stringify;
I.fromJSON;
I.plugin;
I.parse;
I.list;
I.document;
I.comment;
I.atRule;
I.rule;
I.decl;
I.root;
I.CssSyntaxError;
I.Declaration;
I.Container;
I.Processor;
I.Document;
I.Comment;
I.Warning;
I.AtRule;
I.Result;
I.Input;
I.Rule;
I.Root;
I.Node;
var Ku = Object.defineProperty, Xu = (i, e, t) => e in i ? Ku(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, F = (i, e, t) => Xu(i, typeof e != "symbol" ? e + "" : e, t);
function Qu(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function qu(i) {
  if (i.__esModule) return i;
  var e = i.default;
  if (typeof e == "function") {
    var t = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(i).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(i, r);
    Object.defineProperty(t, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return i[r];
      }
    });
  }), t;
}
var Ds = { exports: {} }, R = String, so = function() {
  return { isColorSupported: !1, reset: R, bold: R, dim: R, italic: R, underline: R, inverse: R, hidden: R, strikethrough: R, black: R, red: R, green: R, yellow: R, blue: R, magenta: R, cyan: R, white: R, gray: R, bgBlack: R, bgRed: R, bgGreen: R, bgYellow: R, bgBlue: R, bgMagenta: R, bgCyan: R, bgWhite: R };
};
Ds.exports = so();
Ds.exports.createColors = so;
var ef = Ds.exports;
const tf = {}, rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: tf
}, Symbol.toStringTag, { value: "Module" })), j = /* @__PURE__ */ qu(rf);
let Ri = ef, Ei = j, Vr = class io extends Error {
  constructor(e, t, r, s, n, o) {
    super(e), this.name = "CssSyntaxError", this.reason = e, n && (this.file = n), s && (this.source = s), o && (this.plugin = o), typeof t < "u" && typeof r < "u" && (typeof t == "number" ? (this.line = t, this.column = r) : (this.line = t.line, this.column = t.column, this.endLine = r.line, this.endColumn = r.column)), this.setMessage(), Error.captureStackTrace && Error.captureStackTrace(this, io);
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "", this.message += this.file ? this.file : "<css input>", typeof this.line < "u" && (this.message += ":" + this.line + ":" + this.column), this.message += ": " + this.reason;
  }
  showSourceCode(e) {
    if (!this.source) return "";
    let t = this.source;
    e == null && (e = Ri.isColorSupported), Ei && e && (t = Ei(t));
    let r = t.split(/\r?\n/), s = Math.max(this.line - 3, 0), n = Math.min(this.line + 2, r.length), o = String(n).length, a, l;
    if (e) {
      let { bold: u, gray: f, red: c } = Ri.createColors(!0);
      a = (p) => u(c(p)), l = (p) => f(p);
    } else
      a = l = (u) => u;
    return r.slice(s, n).map((u, f) => {
      let c = s + 1 + f, p = " " + (" " + c).slice(-o) + " | ";
      if (c === this.line) {
        let d = l(p.replace(/\d/g, " ")) + u.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return a(">") + l(p) + u + `
 ` + d + a("^");
      }
      return " " + l(p) + u;
    }).join(`
`);
  }
  toString() {
    let e = this.showSourceCode();
    return e && (e = `

` + e + `
`), this.name + ": " + this.message + e;
  }
};
var Us = Vr;
Vr.default = Vr;
var ze = {};
ze.isClean = Symbol("isClean");
ze.my = Symbol("my");
const Ii = {
  after: `
`,
  beforeClose: `
`,
  beforeComment: `
`,
  beforeDecl: `
`,
  beforeOpen: " ",
  beforeRule: `
`,
  colon: ": ",
  commentLeft: " ",
  commentRight: " ",
  emptyBody: "",
  indent: "    ",
  semicolon: !1
};
function sf(i) {
  return i[0].toUpperCase() + i.slice(1);
}
let Yr = class {
  constructor(e) {
    this.builder = e;
  }
  atrule(e, t) {
    let r = "@" + e.name, s = e.params ? this.rawValue(e, "params") : "";
    if (typeof e.raws.afterName < "u" ? r += e.raws.afterName : s && (r += " "), e.nodes)
      this.block(e, r + s);
    else {
      let n = (e.raws.between || "") + (t ? ";" : "");
      this.builder(r + s + n, e);
    }
  }
  beforeAfter(e, t) {
    let r;
    e.type === "decl" ? r = this.raw(e, null, "beforeDecl") : e.type === "comment" ? r = this.raw(e, null, "beforeComment") : t === "before" ? r = this.raw(e, null, "beforeRule") : r = this.raw(e, null, "beforeClose");
    let s = e.parent, n = 0;
    for (; s && s.type !== "root"; )
      n += 1, s = s.parent;
    if (r.includes(`
`)) {
      let o = this.raw(e, null, "indent");
      if (o.length)
        for (let a = 0; a < n; a++) r += o;
    }
    return r;
  }
  block(e, t) {
    let r = this.raw(e, "between", "beforeOpen");
    this.builder(t + r + "{", e, "start");
    let s;
    e.nodes && e.nodes.length ? (this.body(e), s = this.raw(e, "after")) : s = this.raw(e, "after", "emptyBody"), s && this.builder(s), this.builder("}", e, "end");
  }
  body(e) {
    let t = e.nodes.length - 1;
    for (; t > 0 && e.nodes[t].type === "comment"; )
      t -= 1;
    let r = this.raw(e, "semicolon");
    for (let s = 0; s < e.nodes.length; s++) {
      let n = e.nodes[s], o = this.raw(n, "before");
      o && this.builder(o), this.stringify(n, t !== s || r);
    }
  }
  comment(e) {
    let t = this.raw(e, "left", "commentLeft"), r = this.raw(e, "right", "commentRight");
    this.builder("/*" + t + e.text + r + "*/", e);
  }
  decl(e, t) {
    let r = this.raw(e, "between", "colon"), s = e.prop + r + this.rawValue(e, "value");
    e.important && (s += e.raws.important || " !important"), t && (s += ";"), this.builder(s, e);
  }
  document(e) {
    this.body(e);
  }
  raw(e, t, r) {
    let s;
    if (r || (r = t), t && (s = e.raws[t], typeof s < "u"))
      return s;
    let n = e.parent;
    if (r === "before" && (!n || n.type === "root" && n.first === e || n && n.type === "document"))
      return "";
    if (!n) return Ii[r];
    let o = e.root();
    if (o.rawCache || (o.rawCache = {}), typeof o.rawCache[r] < "u")
      return o.rawCache[r];
    if (r === "before" || r === "after")
      return this.beforeAfter(e, r);
    {
      let a = "raw" + sf(r);
      this[a] ? s = this[a](o, e) : o.walk((l) => {
        if (s = l.raws[t], typeof s < "u") return !1;
      });
    }
    return typeof s > "u" && (s = Ii[r]), o.rawCache[r] = s, s;
  }
  rawBeforeClose(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length > 0 && typeof r.raws.after < "u")
        return t = r.raws.after, t.includes(`
`) && (t = t.replace(/[^\n]+$/, "")), !1;
    }), t && (t = t.replace(/\S/g, "")), t;
  }
  rawBeforeComment(e, t) {
    let r;
    return e.walkComments((s) => {
      if (typeof s.raws.before < "u")
        return r = s.raws.before, r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")), !1;
    }), typeof r > "u" ? r = this.raw(t, null, "beforeDecl") : r && (r = r.replace(/\S/g, "")), r;
  }
  rawBeforeDecl(e, t) {
    let r;
    return e.walkDecls((s) => {
      if (typeof s.raws.before < "u")
        return r = s.raws.before, r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")), !1;
    }), typeof r > "u" ? r = this.raw(t, null, "beforeRule") : r && (r = r.replace(/\S/g, "")), r;
  }
  rawBeforeOpen(e) {
    let t;
    return e.walk((r) => {
      if (r.type !== "decl" && (t = r.raws.between, typeof t < "u"))
        return !1;
    }), t;
  }
  rawBeforeRule(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && (r.parent !== e || e.first !== r) && typeof r.raws.before < "u")
        return t = r.raws.before, t.includes(`
`) && (t = t.replace(/[^\n]+$/, "")), !1;
    }), t && (t = t.replace(/\S/g, "")), t;
  }
  rawColon(e) {
    let t;
    return e.walkDecls((r) => {
      if (typeof r.raws.between < "u")
        return t = r.raws.between.replace(/[^\s:]/g, ""), !1;
    }), t;
  }
  rawEmptyBody(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length === 0 && (t = r.raws.after, typeof t < "u"))
        return !1;
    }), t;
  }
  rawIndent(e) {
    if (e.raws.indent) return e.raws.indent;
    let t;
    return e.walk((r) => {
      let s = r.parent;
      if (s && s !== e && s.parent && s.parent === e && typeof r.raws.before < "u") {
        let n = r.raws.before.split(`
`);
        return t = n[n.length - 1], t = t.replace(/\S/g, ""), !1;
      }
    }), t;
  }
  rawSemicolon(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length && r.last.type === "decl" && (t = r.raws.semicolon, typeof t < "u"))
        return !1;
    }), t;
  }
  rawValue(e, t) {
    let r = e[t], s = e.raws[t];
    return s && s.value === r ? s.raw : r;
  }
  root(e) {
    this.body(e), e.raws.after && this.builder(e.raws.after);
  }
  rule(e) {
    this.block(e, this.rawValue(e, "selector")), e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, "end");
  }
  stringify(e, t) {
    if (!this[e.type])
      throw new Error(
        "Unknown AST node type " + e.type + ". Maybe you need to change PostCSS stringifier."
      );
    this[e.type](e, t);
  }
};
var no = Yr;
Yr.default = Yr;
let nf = no;
function Zr(i, e) {
  new nf(e).stringify(i);
}
var Jt = Zr;
Zr.default = Zr;
let { isClean: tt, my: of } = ze, lf = Us, af = no, uf = Jt;
function Jr(i, e) {
  let t = new i.constructor();
  for (let r in i) {
    if (!Object.prototype.hasOwnProperty.call(i, r) || r === "proxyCache") continue;
    let s = i[r], n = typeof s;
    r === "parent" && n === "object" ? e && (t[r] = e) : r === "source" ? t[r] = s : Array.isArray(s) ? t[r] = s.map((o) => Jr(o, t)) : (n === "object" && s !== null && (s = Jr(s)), t[r] = s);
  }
  return t;
}
let Hr = class {
  constructor(e = {}) {
    this.raws = {}, this[tt] = !1, this[of] = !0;
    for (let t in e)
      if (t === "nodes") {
        this.nodes = [];
        for (let r of e[t])
          typeof r.clone == "function" ? this.append(r.clone()) : this.append(r);
      } else
        this[t] = e[t];
  }
  addToError(e) {
    if (e.postcssNode = this, e.stack && this.source && /\n\s{4}at /.test(e.stack)) {
      let t = this.source;
      e.stack = e.stack.replace(
        /\n\s{4}at /,
        `$&${t.input.from}:${t.start.line}:${t.start.column}$&`
      );
    }
    return e;
  }
  after(e) {
    return this.parent.insertAfter(this, e), this;
  }
  assign(e = {}) {
    for (let t in e)
      this[t] = e[t];
    return this;
  }
  before(e) {
    return this.parent.insertBefore(this, e), this;
  }
  cleanRaws(e) {
    delete this.raws.before, delete this.raws.after, e || delete this.raws.between;
  }
  clone(e = {}) {
    let t = Jr(this);
    for (let r in e)
      t[r] = e[r];
    return t;
  }
  cloneAfter(e = {}) {
    let t = this.clone(e);
    return this.parent.insertAfter(this, t), t;
  }
  cloneBefore(e = {}) {
    let t = this.clone(e);
    return this.parent.insertBefore(this, t), t;
  }
  error(e, t = {}) {
    if (this.source) {
      let { end: r, start: s } = this.rangeBy(t);
      return this.source.input.error(
        e,
        { column: s.column, line: s.line },
        { column: r.column, line: r.line },
        t
      );
    }
    return new lf(e);
  }
  getProxyProcessor() {
    return {
      get(e, t) {
        return t === "proxyOf" ? e : t === "root" ? () => e.root().toProxy() : e[t];
      },
      set(e, t, r) {
        return e[t] === r || (e[t] = r, (t === "prop" || t === "value" || t === "name" || t === "params" || t === "important" || /* c8 ignore next */
        t === "text") && e.markDirty()), !0;
      }
    };
  }
  markDirty() {
    if (this[tt]) {
      this[tt] = !1;
      let e = this;
      for (; e = e.parent; )
        e[tt] = !1;
    }
  }
  next() {
    if (!this.parent) return;
    let e = this.parent.index(this);
    return this.parent.nodes[e + 1];
  }
  positionBy(e, t) {
    let r = this.source.start;
    if (e.index)
      r = this.positionInside(e.index, t);
    else if (e.word) {
      t = this.toString();
      let s = t.indexOf(e.word);
      s !== -1 && (r = this.positionInside(s, t));
    }
    return r;
  }
  positionInside(e, t) {
    let r = t || this.toString(), s = this.source.start.column, n = this.source.start.line;
    for (let o = 0; o < e; o++)
      r[o] === `
` ? (s = 1, n += 1) : s += 1;
    return { column: s, line: n };
  }
  prev() {
    if (!this.parent) return;
    let e = this.parent.index(this);
    return this.parent.nodes[e - 1];
  }
  rangeBy(e) {
    let t = {
      column: this.source.start.column,
      line: this.source.start.line
    }, r = this.source.end ? {
      column: this.source.end.column + 1,
      line: this.source.end.line
    } : {
      column: t.column + 1,
      line: t.line
    };
    if (e.word) {
      let s = this.toString(), n = s.indexOf(e.word);
      n !== -1 && (t = this.positionInside(n, s), r = this.positionInside(n + e.word.length, s));
    } else
      e.start ? t = {
        column: e.start.column,
        line: e.start.line
      } : e.index && (t = this.positionInside(e.index)), e.end ? r = {
        column: e.end.column,
        line: e.end.line
      } : typeof e.endIndex == "number" ? r = this.positionInside(e.endIndex) : e.index && (r = this.positionInside(e.index + 1));
    return (r.line < t.line || r.line === t.line && r.column <= t.column) && (r = { column: t.column + 1, line: t.line }), { end: r, start: t };
  }
  raw(e, t) {
    return new af().raw(this, e, t);
  }
  remove() {
    return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
  }
  replaceWith(...e) {
    if (this.parent) {
      let t = this, r = !1;
      for (let s of e)
        s === this ? r = !0 : r ? (this.parent.insertAfter(t, s), t = s) : this.parent.insertBefore(t, s);
      r || this.remove();
    }
    return this;
  }
  root() {
    let e = this;
    for (; e.parent && e.parent.type !== "document"; )
      e = e.parent;
    return e;
  }
  toJSON(e, t) {
    let r = {}, s = t == null;
    t = t || /* @__PURE__ */ new Map();
    let n = 0;
    for (let o in this) {
      if (!Object.prototype.hasOwnProperty.call(this, o) || o === "parent" || o === "proxyCache") continue;
      let a = this[o];
      if (Array.isArray(a))
        r[o] = a.map((l) => typeof l == "object" && l.toJSON ? l.toJSON(null, t) : l);
      else if (typeof a == "object" && a.toJSON)
        r[o] = a.toJSON(null, t);
      else if (o === "source") {
        let l = t.get(a.input);
        l == null && (l = n, t.set(a.input, n), n++), r[o] = {
          end: a.end,
          inputId: l,
          start: a.start
        };
      } else
        r[o] = a;
    }
    return s && (r.inputs = [...t.keys()].map((o) => o.toJSON())), r;
  }
  toProxy() {
    return this.proxyCache || (this.proxyCache = new Proxy(this, this.getProxyProcessor())), this.proxyCache;
  }
  toString(e = uf) {
    e.stringify && (e = e.stringify);
    let t = "";
    return e(this, (r) => {
      t += r;
    }), t;
  }
  warn(e, t, r) {
    let s = { node: this };
    for (let n in r) s[n] = r[n];
    return e.warn(t, s);
  }
  get proxyOf() {
    return this;
  }
};
var Ht = Hr;
Hr.default = Hr;
let ff = Ht, Kr = class extends ff {
  constructor(e) {
    e && typeof e.value < "u" && typeof e.value != "string" && (e = { ...e, value: String(e.value) }), super(e), this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};
var Kt = Kr;
Kr.default = Kr;
let hf = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", cf = (i, e = 21) => (t = e) => {
  let r = "", s = t;
  for (; s--; )
    r += i[Math.random() * i.length | 0];
  return r;
}, pf = (i = 21) => {
  let e = "", t = i;
  for (; t--; )
    e += hf[Math.random() * 64 | 0];
  return e;
};
var df = { nanoid: pf, customAlphabet: cf };
let { SourceMapConsumer: Ni, SourceMapGenerator: Pi } = j, { existsSync: mf, readFileSync: gf } = j, { dirname: mr, join: yf } = j;
function wf(i) {
  return Buffer ? Buffer.from(i, "base64").toString() : window.atob(i);
}
let Xr = class {
  constructor(e, t) {
    if (t.map === !1) return;
    this.loadAnnotation(e), this.inline = this.startWith(this.annotation, "data:");
    let r = t.map ? t.map.prev : void 0, s = this.loadMap(t.from, r);
    !this.mapFile && t.from && (this.mapFile = t.from), this.mapFile && (this.root = mr(this.mapFile)), s && (this.text = s);
  }
  consumer() {
    return this.consumerCache || (this.consumerCache = new Ni(this.text)), this.consumerCache;
  }
  decodeInline(e) {
    let t = /^data:application\/json;charset=utf-?8;base64,/, r = /^data:application\/json;base64,/, s = /^data:application\/json;charset=utf-?8,/, n = /^data:application\/json,/;
    if (s.test(e) || n.test(e))
      return decodeURIComponent(e.substr(RegExp.lastMatch.length));
    if (t.test(e) || r.test(e))
      return wf(e.substr(RegExp.lastMatch.length));
    let o = e.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + o);
  }
  getAnnotationURL(e) {
    return e.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  isMap(e) {
    return typeof e != "object" ? !1 : typeof e.mappings == "string" || typeof e._mappings == "string" || Array.isArray(e.sections);
  }
  loadAnnotation(e) {
    let t = e.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!t) return;
    let r = e.lastIndexOf(t.pop()), s = e.indexOf("*/", r);
    r > -1 && s > -1 && (this.annotation = this.getAnnotationURL(e.substring(r, s)));
  }
  loadFile(e) {
    if (this.root = mr(e), mf(e))
      return this.mapFile = e, gf(e, "utf-8").toString().trim();
  }
  loadMap(e, t) {
    if (t === !1) return !1;
    if (t) {
      if (typeof t == "string")
        return t;
      if (typeof t == "function") {
        let r = t(e);
        if (r) {
          let s = this.loadFile(r);
          if (!s)
            throw new Error(
              "Unable to load previous source map: " + r.toString()
            );
          return s;
        }
      } else {
        if (t instanceof Ni)
          return Pi.fromSourceMap(t).toString();
        if (t instanceof Pi)
          return t.toString();
        if (this.isMap(t))
          return JSON.stringify(t);
        throw new Error(
          "Unsupported previous source map format: " + t.toString()
        );
      }
    } else {
      if (this.inline)
        return this.decodeInline(this.annotation);
      if (this.annotation) {
        let r = this.annotation;
        return e && (r = yf(mr(e), r)), this.loadFile(r);
      }
    }
  }
  startWith(e, t) {
    return e ? e.substr(0, t.length) === t : !1;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
};
var oo = Xr;
Xr.default = Xr;
let { SourceMapConsumer: bf, SourceMapGenerator: Cf } = j, { fileURLToPath: Mi, pathToFileURL: rt } = j, { isAbsolute: Qr, resolve: qr } = j, { nanoid: $f } = df, gr = j, _i = Us, Sf = oo, yr = Symbol("fromOffsetCache"), vf = !!(bf && Cf), Li = !!(qr && Qr), Lt = class {
  constructor(e, t = {}) {
    if (e === null || typeof e > "u" || typeof e == "object" && !e.toString)
      throw new Error(`PostCSS received ${e} instead of CSS string`);
    if (this.css = e.toString(), this.css[0] === "\uFEFF" || this.css[0] === "￾" ? (this.hasBOM = !0, this.css = this.css.slice(1)) : this.hasBOM = !1, t.from && (!Li || /^\w+:\/\//.test(t.from) || Qr(t.from) ? this.file = t.from : this.file = qr(t.from)), Li && vf) {
      let r = new Sf(this.css, t);
      if (r.text) {
        this.map = r;
        let s = r.consumer().file;
        !this.file && s && (this.file = this.mapResolve(s));
      }
    }
    this.file || (this.id = "<input css " + $f(6) + ">"), this.map && (this.map.file = this.from);
  }
  error(e, t, r, s = {}) {
    let n, o, a;
    if (t && typeof t == "object") {
      let u = t, f = r;
      if (typeof u.offset == "number") {
        let c = this.fromOffset(u.offset);
        t = c.line, r = c.col;
      } else
        t = u.line, r = u.column;
      if (typeof f.offset == "number") {
        let c = this.fromOffset(f.offset);
        o = c.line, a = c.col;
      } else
        o = f.line, a = f.column;
    } else if (!r) {
      let u = this.fromOffset(t);
      t = u.line, r = u.col;
    }
    let l = this.origin(t, r, o, a);
    return l ? n = new _i(
      e,
      l.endLine === void 0 ? l.line : { column: l.column, line: l.line },
      l.endLine === void 0 ? l.column : { column: l.endColumn, line: l.endLine },
      l.source,
      l.file,
      s.plugin
    ) : n = new _i(
      e,
      o === void 0 ? t : { column: r, line: t },
      o === void 0 ? r : { column: a, line: o },
      this.css,
      this.file,
      s.plugin
    ), n.input = { column: r, endColumn: a, endLine: o, line: t, source: this.css }, this.file && (rt && (n.input.url = rt(this.file).toString()), n.input.file = this.file), n;
  }
  fromOffset(e) {
    let t, r;
    if (this[yr])
      r = this[yr];
    else {
      let n = this.css.split(`
`);
      r = new Array(n.length);
      let o = 0;
      for (let a = 0, l = n.length; a < l; a++)
        r[a] = o, o += n[a].length + 1;
      this[yr] = r;
    }
    t = r[r.length - 1];
    let s = 0;
    if (e >= t)
      s = r.length - 1;
    else {
      let n = r.length - 2, o;
      for (; s < n; )
        if (o = s + (n - s >> 1), e < r[o])
          n = o - 1;
        else if (e >= r[o + 1])
          s = o + 1;
        else {
          s = o;
          break;
        }
    }
    return {
      col: e - r[s] + 1,
      line: s + 1
    };
  }
  mapResolve(e) {
    return /^\w+:\/\//.test(e) ? e : qr(this.map.consumer().sourceRoot || this.map.root || ".", e);
  }
  origin(e, t, r, s) {
    if (!this.map) return !1;
    let n = this.map.consumer(), o = n.originalPositionFor({ column: t, line: e });
    if (!o.source) return !1;
    let a;
    typeof r == "number" && (a = n.originalPositionFor({ column: s, line: r }));
    let l;
    Qr(o.source) ? l = rt(o.source) : l = new URL(
      o.source,
      this.map.consumer().sourceRoot || rt(this.map.mapFile)
    );
    let u = {
      column: o.column,
      endColumn: a && a.column,
      endLine: a && a.line,
      line: o.line,
      url: l.toString()
    };
    if (l.protocol === "file:")
      if (Mi)
        u.file = Mi(l);
      else
        throw new Error("file: protocol is not available in this PostCSS build");
    let f = n.sourceContentFor(o.source);
    return f && (u.source = f), u;
  }
  toJSON() {
    let e = {};
    for (let t of ["hasBOM", "css", "file", "id"])
      this[t] != null && (e[t] = this[t]);
    return this.map && (e.map = { ...this.map }, e.map.consumerCache && (e.map.consumerCache = void 0)), e;
  }
  get from() {
    return this.file || this.id;
  }
};
var Xt = Lt;
Lt.default = Lt;
gr && gr.registerInput && gr.registerInput(Lt);
let { SourceMapConsumer: lo, SourceMapGenerator: Ot } = j, { dirname: At, relative: ao, resolve: uo, sep: fo } = j, { pathToFileURL: ki } = j, xf = Xt, Of = !!(lo && Ot), Af = !!(At && uo && ao && fo), Rf = class {
  constructor(e, t, r, s) {
    this.stringify = e, this.mapOpts = r.map || {}, this.root = t, this.opts = r, this.css = s, this.originalCSS = s, this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute, this.memoizedFileURLs = /* @__PURE__ */ new Map(), this.memoizedPaths = /* @__PURE__ */ new Map(), this.memoizedURLs = /* @__PURE__ */ new Map();
  }
  addAnnotation() {
    let e;
    this.isInline() ? e = "data:application/json;base64," + this.toBase64(this.map.toString()) : typeof this.mapOpts.annotation == "string" ? e = this.mapOpts.annotation : typeof this.mapOpts.annotation == "function" ? e = this.mapOpts.annotation(this.opts.to, this.root) : e = this.outputFile() + ".map";
    let t = `
`;
    this.css.includes(`\r
`) && (t = `\r
`), this.css += t + "/*# sourceMappingURL=" + e + " */";
  }
  applyPrevMaps() {
    for (let e of this.previous()) {
      let t = this.toUrl(this.path(e.file)), r = e.root || At(e.file), s;
      this.mapOpts.sourcesContent === !1 ? (s = new lo(e.text), s.sourcesContent && (s.sourcesContent = null)) : s = e.consumer(), this.map.applySourceMap(s, t, this.toUrl(this.path(r)));
    }
  }
  clearAnnotation() {
    if (this.mapOpts.annotation !== !1)
      if (this.root) {
        let e;
        for (let t = this.root.nodes.length - 1; t >= 0; t--)
          e = this.root.nodes[t], e.type === "comment" && e.text.indexOf("# sourceMappingURL=") === 0 && this.root.removeChild(t);
      } else this.css && (this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, ""));
  }
  generate() {
    if (this.clearAnnotation(), Af && Of && this.isMap())
      return this.generateMap();
    {
      let e = "";
      return this.stringify(this.root, (t) => {
        e += t;
      }), [e];
    }
  }
  generateMap() {
    if (this.root)
      this.generateString();
    else if (this.previous().length === 1) {
      let e = this.previous()[0].consumer();
      e.file = this.outputFile(), this.map = Ot.fromSourceMap(e, {
        ignoreInvalidMapping: !0
      });
    } else
      this.map = new Ot({
        file: this.outputFile(),
        ignoreInvalidMapping: !0
      }), this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
      });
    return this.isSourcesContent() && this.setSourcesContent(), this.root && this.previous().length > 0 && this.applyPrevMaps(), this.isAnnotation() && this.addAnnotation(), this.isInline() ? [this.css] : [this.css, this.map];
  }
  generateString() {
    this.css = "", this.map = new Ot({
      file: this.outputFile(),
      ignoreInvalidMapping: !0
    });
    let e = 1, t = 1, r = "<no source>", s = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ""
    }, n, o;
    this.stringify(this.root, (a, l, u) => {
      if (this.css += a, l && u !== "end" && (s.generated.line = e, s.generated.column = t - 1, l.source && l.source.start ? (s.source = this.sourcePath(l), s.original.line = l.source.start.line, s.original.column = l.source.start.column - 1, this.map.addMapping(s)) : (s.source = r, s.original.line = 1, s.original.column = 0, this.map.addMapping(s))), n = a.match(/\n/g), n ? (e += n.length, o = a.lastIndexOf(`
`), t = a.length - o) : t += a.length, l && u !== "start") {
        let f = l.parent || { raws: {} };
        (!(l.type === "decl" || l.type === "atrule" && !l.nodes) || l !== f.last || f.raws.semicolon) && (l.source && l.source.end ? (s.source = this.sourcePath(l), s.original.line = l.source.end.line, s.original.column = l.source.end.column - 1, s.generated.line = e, s.generated.column = t - 2, this.map.addMapping(s)) : (s.source = r, s.original.line = 1, s.original.column = 0, s.generated.line = e, s.generated.column = t - 1, this.map.addMapping(s)));
      }
    });
  }
  isAnnotation() {
    return this.isInline() ? !0 : typeof this.mapOpts.annotation < "u" ? this.mapOpts.annotation : this.previous().length ? this.previous().some((e) => e.annotation) : !0;
  }
  isInline() {
    if (typeof this.mapOpts.inline < "u")
      return this.mapOpts.inline;
    let e = this.mapOpts.annotation;
    return typeof e < "u" && e !== !0 ? !1 : this.previous().length ? this.previous().some((t) => t.inline) : !0;
  }
  isMap() {
    return typeof this.opts.map < "u" ? !!this.opts.map : this.previous().length > 0;
  }
  isSourcesContent() {
    return typeof this.mapOpts.sourcesContent < "u" ? this.mapOpts.sourcesContent : this.previous().length ? this.previous().some((e) => e.withContent()) : !0;
  }
  outputFile() {
    return this.opts.to ? this.path(this.opts.to) : this.opts.from ? this.path(this.opts.from) : "to.css";
  }
  path(e) {
    if (this.mapOpts.absolute || e.charCodeAt(0) === 60 || /^\w+:\/\//.test(e)) return e;
    let t = this.memoizedPaths.get(e);
    if (t) return t;
    let r = this.opts.to ? At(this.opts.to) : ".";
    typeof this.mapOpts.annotation == "string" && (r = At(uo(r, this.mapOpts.annotation)));
    let s = ao(r, e);
    return this.memoizedPaths.set(e, s), s;
  }
  previous() {
    if (!this.previousMaps)
      if (this.previousMaps = [], this.root)
        this.root.walk((e) => {
          if (e.source && e.source.input.map) {
            let t = e.source.input.map;
            this.previousMaps.includes(t) || this.previousMaps.push(t);
          }
        });
      else {
        let e = new xf(this.originalCSS, this.opts);
        e.map && this.previousMaps.push(e.map);
      }
    return this.previousMaps;
  }
  setSourcesContent() {
    let e = {};
    if (this.root)
      this.root.walk((t) => {
        if (t.source) {
          let r = t.source.input.from;
          if (r && !e[r]) {
            e[r] = !0;
            let s = this.usesFileUrls ? this.toFileUrl(r) : this.toUrl(this.path(r));
            this.map.setSourceContent(s, t.source.input.css);
          }
        }
      });
    else if (this.css) {
      let t = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(t, this.css);
    }
  }
  sourcePath(e) {
    return this.mapOpts.from ? this.toUrl(this.mapOpts.from) : this.usesFileUrls ? this.toFileUrl(e.source.input.from) : this.toUrl(this.path(e.source.input.from));
  }
  toBase64(e) {
    return Buffer ? Buffer.from(e).toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  }
  toFileUrl(e) {
    let t = this.memoizedFileURLs.get(e);
    if (t) return t;
    if (ki) {
      let r = ki(e).toString();
      return this.memoizedFileURLs.set(e, r), r;
    } else
      throw new Error(
        "`map.absolute` option is not available in this PostCSS build"
      );
  }
  toUrl(e) {
    let t = this.memoizedURLs.get(e);
    if (t) return t;
    fo === "\\" && (e = e.replace(/\\/g, "/"));
    let r = encodeURI(e).replace(/[#?]/g, encodeURIComponent);
    return this.memoizedURLs.set(e, r), r;
  }
};
var ho = Rf;
let Ef = Ht, es = class extends Ef {
  constructor(e) {
    super(e), this.type = "comment";
  }
};
var Qt = es;
es.default = es;
let { isClean: co, my: po } = ze, mo = Kt, go = Qt, If = Ht, yo, Ts, Bs, wo;
function bo(i) {
  return i.map((e) => (e.nodes && (e.nodes = bo(e.nodes)), delete e.source, e));
}
function Co(i) {
  if (i[co] = !1, i.proxyOf.nodes)
    for (let e of i.proxyOf.nodes)
      Co(e);
}
let K = class $o extends If {
  append(...e) {
    for (let t of e) {
      let r = this.normalize(t, this.last);
      for (let s of r) this.proxyOf.nodes.push(s);
    }
    return this.markDirty(), this;
  }
  cleanRaws(e) {
    if (super.cleanRaws(e), this.nodes)
      for (let t of this.nodes) t.cleanRaws(e);
  }
  each(e) {
    if (!this.proxyOf.nodes) return;
    let t = this.getIterator(), r, s;
    for (; this.indexes[t] < this.proxyOf.nodes.length && (r = this.indexes[t], s = e(this.proxyOf.nodes[r], r), s !== !1); )
      this.indexes[t] += 1;
    return delete this.indexes[t], s;
  }
  every(e) {
    return this.nodes.every(e);
  }
  getIterator() {
    this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
    let e = this.lastEach;
    return this.indexes[e] = 0, e;
  }
  getProxyProcessor() {
    return {
      get(e, t) {
        return t === "proxyOf" ? e : e[t] ? t === "each" || typeof t == "string" && t.startsWith("walk") ? (...r) => e[t](
          ...r.map((s) => typeof s == "function" ? (n, o) => s(n.toProxy(), o) : s)
        ) : t === "every" || t === "some" ? (r) => e[t](
          (s, ...n) => r(s.toProxy(), ...n)
        ) : t === "root" ? () => e.root().toProxy() : t === "nodes" ? e.nodes.map((r) => r.toProxy()) : t === "first" || t === "last" ? e[t].toProxy() : e[t] : e[t];
      },
      set(e, t, r) {
        return e[t] === r || (e[t] = r, (t === "name" || t === "params" || t === "selector") && e.markDirty()), !0;
      }
    };
  }
  index(e) {
    return typeof e == "number" ? e : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
  }
  insertAfter(e, t) {
    let r = this.index(e), s = this.normalize(t, this.proxyOf.nodes[r]).reverse();
    r = this.index(e);
    for (let o of s) this.proxyOf.nodes.splice(r + 1, 0, o);
    let n;
    for (let o in this.indexes)
      n = this.indexes[o], r < n && (this.indexes[o] = n + s.length);
    return this.markDirty(), this;
  }
  insertBefore(e, t) {
    let r = this.index(e), s = r === 0 ? "prepend" : !1, n = this.normalize(t, this.proxyOf.nodes[r], s).reverse();
    r = this.index(e);
    for (let a of n) this.proxyOf.nodes.splice(r, 0, a);
    let o;
    for (let a in this.indexes)
      o = this.indexes[a], r <= o && (this.indexes[a] = o + n.length);
    return this.markDirty(), this;
  }
  normalize(e, t) {
    if (typeof e == "string")
      e = bo(yo(e).nodes);
    else if (typeof e > "u")
      e = [];
    else if (Array.isArray(e)) {
      e = e.slice(0);
      for (let s of e)
        s.parent && s.parent.removeChild(s, "ignore");
    } else if (e.type === "root" && this.type !== "document") {
      e = e.nodes.slice(0);
      for (let s of e)
        s.parent && s.parent.removeChild(s, "ignore");
    } else if (e.type)
      e = [e];
    else if (e.prop) {
      if (typeof e.value > "u")
        throw new Error("Value field is missed in node creation");
      typeof e.value != "string" && (e.value = String(e.value)), e = [new mo(e)];
    } else if (e.selector)
      e = [new Ts(e)];
    else if (e.name)
      e = [new Bs(e)];
    else if (e.text)
      e = [new go(e)];
    else
      throw new Error("Unknown node type in node creation");
    return e.map((s) => (s[po] || $o.rebuild(s), s = s.proxyOf, s.parent && s.parent.removeChild(s), s[co] && Co(s), typeof s.raws.before > "u" && t && typeof t.raws.before < "u" && (s.raws.before = t.raws.before.replace(/\S/g, "")), s.parent = this.proxyOf, s));
  }
  prepend(...e) {
    e = e.reverse();
    for (let t of e) {
      let r = this.normalize(t, this.first, "prepend").reverse();
      for (let s of r) this.proxyOf.nodes.unshift(s);
      for (let s in this.indexes)
        this.indexes[s] = this.indexes[s] + r.length;
    }
    return this.markDirty(), this;
  }
  push(e) {
    return e.parent = this, this.proxyOf.nodes.push(e), this;
  }
  removeAll() {
    for (let e of this.proxyOf.nodes) e.parent = void 0;
    return this.proxyOf.nodes = [], this.markDirty(), this;
  }
  removeChild(e) {
    e = this.index(e), this.proxyOf.nodes[e].parent = void 0, this.proxyOf.nodes.splice(e, 1);
    let t;
    for (let r in this.indexes)
      t = this.indexes[r], t >= e && (this.indexes[r] = t - 1);
    return this.markDirty(), this;
  }
  replaceValues(e, t, r) {
    return r || (r = t, t = {}), this.walkDecls((s) => {
      t.props && !t.props.includes(s.prop) || t.fast && !s.value.includes(t.fast) || (s.value = s.value.replace(e, r));
    }), this.markDirty(), this;
  }
  some(e) {
    return this.nodes.some(e);
  }
  walk(e) {
    return this.each((t, r) => {
      let s;
      try {
        s = e(t, r);
      } catch (n) {
        throw t.addToError(n);
      }
      return s !== !1 && t.walk && (s = t.walk(e)), s;
    });
  }
  walkAtRules(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "atrule" && e.test(r.name))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "atrule" && r.name === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "atrule")
        return t(r, s);
    }));
  }
  walkComments(e) {
    return this.walk((t, r) => {
      if (t.type === "comment")
        return e(t, r);
    });
  }
  walkDecls(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "decl" && e.test(r.prop))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "decl" && r.prop === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "decl")
        return t(r, s);
    }));
  }
  walkRules(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "rule" && e.test(r.selector))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "rule" && r.selector === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "rule")
        return t(r, s);
    }));
  }
  get first() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[0];
  }
  get last() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
};
K.registerParse = (i) => {
  yo = i;
};
K.registerRule = (i) => {
  Ts = i;
};
K.registerAtRule = (i) => {
  Bs = i;
};
K.registerRoot = (i) => {
  wo = i;
};
var re = K;
K.default = K;
K.rebuild = (i) => {
  i.type === "atrule" ? Object.setPrototypeOf(i, Bs.prototype) : i.type === "rule" ? Object.setPrototypeOf(i, Ts.prototype) : i.type === "decl" ? Object.setPrototypeOf(i, mo.prototype) : i.type === "comment" ? Object.setPrototypeOf(i, go.prototype) : i.type === "root" && Object.setPrototypeOf(i, wo.prototype), i[po] = !0, i.nodes && i.nodes.forEach((e) => {
    K.rebuild(e);
  });
};
let Nf = re, So, vo, Pe = class extends Nf {
  constructor(e) {
    super({ type: "document", ...e }), this.nodes || (this.nodes = []);
  }
  toResult(e = {}) {
    return new So(new vo(), this, e).stringify();
  }
};
Pe.registerLazyResult = (i) => {
  So = i;
};
Pe.registerProcessor = (i) => {
  vo = i;
};
var Fs = Pe;
Pe.default = Pe;
let Di = {};
var xo = function(e) {
  Di[e] || (Di[e] = !0, typeof console < "u" && console.warn && console.warn(e));
};
let ts = class {
  constructor(e, t = {}) {
    if (this.type = "warning", this.text = e, t.node && t.node.source) {
      let r = t.node.rangeBy(t);
      this.line = r.start.line, this.column = r.start.column, this.endLine = r.end.line, this.endColumn = r.end.column;
    }
    for (let r in t) this[r] = t[r];
  }
  toString() {
    return this.node ? this.node.error(this.text, {
      index: this.index,
      plugin: this.plugin,
      word: this.word
    }).message : this.plugin ? this.plugin + ": " + this.text : this.text;
  }
};
var Oo = ts;
ts.default = ts;
let Pf = Oo, rs = class {
  constructor(e, t, r) {
    this.processor = e, this.messages = [], this.root = t, this.opts = r, this.css = void 0, this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(e, t = {}) {
    t.plugin || this.lastPlugin && this.lastPlugin.postcssPlugin && (t.plugin = this.lastPlugin.postcssPlugin);
    let r = new Pf(e, t);
    return this.messages.push(r), r;
  }
  warnings() {
    return this.messages.filter((e) => e.type === "warning");
  }
  get content() {
    return this.css;
  }
};
var zs = rs;
rs.default = rs;
const wr = 39, Ui = 34, st = 92, Ti = 47, it = 10, Se = 32, nt = 12, ot = 9, lt = 13, Mf = 91, _f = 93, Lf = 40, kf = 41, Df = 123, Uf = 125, Tf = 59, Bf = 42, Ff = 58, zf = 64, at = /[\t\n\f\r "#'()/;[\\\]{}]/g, ut = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g, Wf = /.[\r\n"'(/\\]/, Bi = /[\da-f]/i;
var jf = function(e, t = {}) {
  let r = e.css.valueOf(), s = t.ignoreErrors, n, o, a, l, u, f, c, p, d, g, w = r.length, h = 0, v = [], O = [];
  function m() {
    return h;
  }
  function y(M) {
    throw e.error("Unclosed " + M, h);
  }
  function _() {
    return O.length === 0 && h >= w;
  }
  function D(M) {
    if (O.length) return O.pop();
    if (h >= w) return;
    let L = M ? M.ignoreUnclosed : !1;
    switch (n = r.charCodeAt(h), n) {
      case it:
      case Se:
      case ot:
      case lt:
      case nt: {
        o = h;
        do
          o += 1, n = r.charCodeAt(o);
        while (n === Se || n === it || n === ot || n === lt || n === nt);
        g = ["space", r.slice(h, o)], h = o - 1;
        break;
      }
      case Mf:
      case _f:
      case Df:
      case Uf:
      case Ff:
      case Tf:
      case kf: {
        let T = String.fromCharCode(n);
        g = [T, T, h];
        break;
      }
      case Lf: {
        if (p = v.length ? v.pop()[1] : "", d = r.charCodeAt(h + 1), p === "url" && d !== wr && d !== Ui && d !== Se && d !== it && d !== ot && d !== nt && d !== lt) {
          o = h;
          do {
            if (f = !1, o = r.indexOf(")", o + 1), o === -1)
              if (s || L) {
                o = h;
                break;
              } else
                y("bracket");
            for (c = o; r.charCodeAt(c - 1) === st; )
              c -= 1, f = !f;
          } while (f);
          g = ["brackets", r.slice(h, o + 1), h, o], h = o;
        } else
          o = r.indexOf(")", h + 1), l = r.slice(h, o + 1), o === -1 || Wf.test(l) ? g = ["(", "(", h] : (g = ["brackets", l, h, o], h = o);
        break;
      }
      case wr:
      case Ui: {
        a = n === wr ? "'" : '"', o = h;
        do {
          if (f = !1, o = r.indexOf(a, o + 1), o === -1)
            if (s || L) {
              o = h + 1;
              break;
            } else
              y("string");
          for (c = o; r.charCodeAt(c - 1) === st; )
            c -= 1, f = !f;
        } while (f);
        g = ["string", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      case zf: {
        at.lastIndex = h + 1, at.test(r), at.lastIndex === 0 ? o = r.length - 1 : o = at.lastIndex - 2, g = ["at-word", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      case st: {
        for (o = h, u = !0; r.charCodeAt(o + 1) === st; )
          o += 1, u = !u;
        if (n = r.charCodeAt(o + 1), u && n !== Ti && n !== Se && n !== it && n !== ot && n !== lt && n !== nt && (o += 1, Bi.test(r.charAt(o)))) {
          for (; Bi.test(r.charAt(o + 1)); )
            o += 1;
          r.charCodeAt(o + 1) === Se && (o += 1);
        }
        g = ["word", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      default: {
        n === Ti && r.charCodeAt(h + 1) === Bf ? (o = r.indexOf("*/", h + 2) + 1, o === 0 && (s || L ? o = r.length : y("comment")), g = ["comment", r.slice(h, o + 1), h, o], h = o) : (ut.lastIndex = h + 1, ut.test(r), ut.lastIndex === 0 ? o = r.length - 1 : o = ut.lastIndex - 2, g = ["word", r.slice(h, o + 1), h, o], v.push(g), h = o);
        break;
      }
    }
    return h++, g;
  }
  function V(M) {
    O.push(M);
  }
  return {
    back: V,
    endOfFile: _,
    nextToken: D,
    position: m
  };
};
let Ao = re, kt = class extends Ao {
  constructor(e) {
    super(e), this.type = "atrule";
  }
  append(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
  }
  prepend(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
  }
};
var Ws = kt;
kt.default = kt;
Ao.registerAtRule(kt);
let Ro = re, Eo, Io, ce = class extends Ro {
  constructor(e) {
    super(e), this.type = "root", this.nodes || (this.nodes = []);
  }
  normalize(e, t, r) {
    let s = super.normalize(e);
    if (t) {
      if (r === "prepend")
        this.nodes.length > 1 ? t.raws.before = this.nodes[1].raws.before : delete t.raws.before;
      else if (this.first !== t)
        for (let n of s)
          n.raws.before = t.raws.before;
    }
    return s;
  }
  removeChild(e, t) {
    let r = this.index(e);
    return !t && r === 0 && this.nodes.length > 1 && (this.nodes[1].raws.before = this.nodes[r].raws.before), super.removeChild(e);
  }
  toResult(e = {}) {
    return new Eo(new Io(), this, e).stringify();
  }
};
ce.registerLazyResult = (i) => {
  Eo = i;
};
ce.registerProcessor = (i) => {
  Io = i;
};
var We = ce;
ce.default = ce;
Ro.registerRoot(ce);
let Me = {
  comma(i) {
    return Me.split(i, [","], !0);
  },
  space(i) {
    let e = [" ", `
`, "	"];
    return Me.split(i, e);
  },
  split(i, e, t) {
    let r = [], s = "", n = !1, o = 0, a = !1, l = "", u = !1;
    for (let f of i)
      u ? u = !1 : f === "\\" ? u = !0 : a ? f === l && (a = !1) : f === '"' || f === "'" ? (a = !0, l = f) : f === "(" ? o += 1 : f === ")" ? o > 0 && (o -= 1) : o === 0 && e.includes(f) && (n = !0), n ? (s !== "" && r.push(s.trim()), s = "", n = !1) : s += f;
    return (t || s !== "") && r.push(s.trim()), r;
  }
};
var No = Me;
Me.default = Me;
let Po = re, Gf = No, Dt = class extends Po {
  constructor(e) {
    super(e), this.type = "rule", this.nodes || (this.nodes = []);
  }
  get selectors() {
    return Gf.comma(this.selector);
  }
  set selectors(e) {
    let t = this.selector ? this.selector.match(/,\s*/) : null, r = t ? t[0] : "," + this.raw("between", "beforeOpen");
    this.selector = e.join(r);
  }
};
var js = Dt;
Dt.default = Dt;
Po.registerRule(Dt);
let Vf = Kt, Yf = jf, Zf = Qt, Jf = Ws, Hf = We, Fi = js;
const zi = {
  empty: !0,
  space: !0
};
function Kf(i) {
  for (let e = i.length - 1; e >= 0; e--) {
    let t = i[e], r = t[3] || t[2];
    if (r) return r;
  }
}
let Xf = class {
  constructor(e) {
    this.input = e, this.root = new Hf(), this.current = this.root, this.spaces = "", this.semicolon = !1, this.createTokenizer(), this.root.source = { input: e, start: { column: 1, line: 1, offset: 0 } };
  }
  atrule(e) {
    let t = new Jf();
    t.name = e[1].slice(1), t.name === "" && this.unnamedAtrule(t, e), this.init(t, e[2]);
    let r, s, n, o = !1, a = !1, l = [], u = [];
    for (; !this.tokenizer.endOfFile(); ) {
      if (e = this.tokenizer.nextToken(), r = e[0], r === "(" || r === "[" ? u.push(r === "(" ? ")" : "]") : r === "{" && u.length > 0 ? u.push("}") : r === u[u.length - 1] && u.pop(), u.length === 0)
        if (r === ";") {
          t.source.end = this.getPosition(e[2]), t.source.end.offset++, this.semicolon = !0;
          break;
        } else if (r === "{") {
          a = !0;
          break;
        } else if (r === "}") {
          if (l.length > 0) {
            for (n = l.length - 1, s = l[n]; s && s[0] === "space"; )
              s = l[--n];
            s && (t.source.end = this.getPosition(s[3] || s[2]), t.source.end.offset++);
          }
          this.end(e);
          break;
        } else
          l.push(e);
      else
        l.push(e);
      if (this.tokenizer.endOfFile()) {
        o = !0;
        break;
      }
    }
    t.raws.between = this.spacesAndCommentsFromEnd(l), l.length ? (t.raws.afterName = this.spacesAndCommentsFromStart(l), this.raw(t, "params", l), o && (e = l[l.length - 1], t.source.end = this.getPosition(e[3] || e[2]), t.source.end.offset++, this.spaces = t.raws.between, t.raws.between = "")) : (t.raws.afterName = "", t.params = ""), a && (t.nodes = [], this.current = t);
  }
  checkMissedSemicolon(e) {
    let t = this.colon(e);
    if (t === !1) return;
    let r = 0, s;
    for (let n = t - 1; n >= 0 && (s = e[n], !(s[0] !== "space" && (r += 1, r === 2))); n--)
      ;
    throw this.input.error(
      "Missed semicolon",
      s[0] === "word" ? s[3] + 1 : s[2]
    );
  }
  colon(e) {
    let t = 0, r, s, n;
    for (let [o, a] of e.entries()) {
      if (r = a, s = r[0], s === "(" && (t += 1), s === ")" && (t -= 1), t === 0 && s === ":")
        if (!n)
          this.doubleColon(r);
        else {
          if (n[0] === "word" && n[1] === "progid")
            continue;
          return o;
        }
      n = r;
    }
    return !1;
  }
  comment(e) {
    let t = new Zf();
    this.init(t, e[2]), t.source.end = this.getPosition(e[3] || e[2]), t.source.end.offset++;
    let r = e[1].slice(2, -2);
    if (/^\s*$/.test(r))
      t.text = "", t.raws.left = r, t.raws.right = "";
    else {
      let s = r.match(/^(\s*)([^]*\S)(\s*)$/);
      t.text = s[2], t.raws.left = s[1], t.raws.right = s[3];
    }
  }
  createTokenizer() {
    this.tokenizer = Yf(this.input);
  }
  decl(e, t) {
    let r = new Vf();
    this.init(r, e[0][2]);
    let s = e[e.length - 1];
    for (s[0] === ";" && (this.semicolon = !0, e.pop()), r.source.end = this.getPosition(
      s[3] || s[2] || Kf(e)
    ), r.source.end.offset++; e[0][0] !== "word"; )
      e.length === 1 && this.unknownWord(e), r.raws.before += e.shift()[1];
    for (r.source.start = this.getPosition(e[0][2]), r.prop = ""; e.length; ) {
      let u = e[0][0];
      if (u === ":" || u === "space" || u === "comment")
        break;
      r.prop += e.shift()[1];
    }
    r.raws.between = "";
    let n;
    for (; e.length; )
      if (n = e.shift(), n[0] === ":") {
        r.raws.between += n[1];
        break;
      } else
        n[0] === "word" && /\w/.test(n[1]) && this.unknownWord([n]), r.raws.between += n[1];
    (r.prop[0] === "_" || r.prop[0] === "*") && (r.raws.before += r.prop[0], r.prop = r.prop.slice(1));
    let o = [], a;
    for (; e.length && (a = e[0][0], !(a !== "space" && a !== "comment")); )
      o.push(e.shift());
    this.precheckMissedSemicolon(e);
    for (let u = e.length - 1; u >= 0; u--) {
      if (n = e[u], n[1].toLowerCase() === "!important") {
        r.important = !0;
        let f = this.stringFrom(e, u);
        f = this.spacesFromEnd(e) + f, f !== " !important" && (r.raws.important = f);
        break;
      } else if (n[1].toLowerCase() === "important") {
        let f = e.slice(0), c = "";
        for (let p = u; p > 0; p--) {
          let d = f[p][0];
          if (c.trim().indexOf("!") === 0 && d !== "space")
            break;
          c = f.pop()[1] + c;
        }
        c.trim().indexOf("!") === 0 && (r.important = !0, r.raws.important = c, e = f);
      }
      if (n[0] !== "space" && n[0] !== "comment")
        break;
    }
    e.some((u) => u[0] !== "space" && u[0] !== "comment") && (r.raws.between += o.map((u) => u[1]).join(""), o = []), this.raw(r, "value", o.concat(e), t), r.value.includes(":") && !t && this.checkMissedSemicolon(e);
  }
  doubleColon(e) {
    throw this.input.error(
      "Double colon",
      { offset: e[2] },
      { offset: e[2] + e[1].length }
    );
  }
  emptyRule(e) {
    let t = new Fi();
    this.init(t, e[2]), t.selector = "", t.raws.between = "", this.current = t;
  }
  end(e) {
    this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.semicolon = !1, this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.spaces = "", this.current.parent ? (this.current.source.end = this.getPosition(e[2]), this.current.source.end.offset++, this.current = this.current.parent) : this.unexpectedClose(e);
  }
  endFile() {
    this.current.parent && this.unclosedBlock(), this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.root.source.end = this.getPosition(this.tokenizer.position());
  }
  freeSemicolon(e) {
    if (this.spaces += e[1], this.current.nodes) {
      let t = this.current.nodes[this.current.nodes.length - 1];
      t && t.type === "rule" && !t.raws.ownSemicolon && (t.raws.ownSemicolon = this.spaces, this.spaces = "");
    }
  }
  // Helpers
  getPosition(e) {
    let t = this.input.fromOffset(e);
    return {
      column: t.col,
      line: t.line,
      offset: e
    };
  }
  init(e, t) {
    this.current.push(e), e.source = {
      input: this.input,
      start: this.getPosition(t)
    }, e.raws.before = this.spaces, this.spaces = "", e.type !== "comment" && (this.semicolon = !1);
  }
  other(e) {
    let t = !1, r = null, s = !1, n = null, o = [], a = e[1].startsWith("--"), l = [], u = e;
    for (; u; ) {
      if (r = u[0], l.push(u), r === "(" || r === "[")
        n || (n = u), o.push(r === "(" ? ")" : "]");
      else if (a && s && r === "{")
        n || (n = u), o.push("}");
      else if (o.length === 0)
        if (r === ";")
          if (s) {
            this.decl(l, a);
            return;
          } else
            break;
        else if (r === "{") {
          this.rule(l);
          return;
        } else if (r === "}") {
          this.tokenizer.back(l.pop()), t = !0;
          break;
        } else r === ":" && (s = !0);
      else r === o[o.length - 1] && (o.pop(), o.length === 0 && (n = null));
      u = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile() && (t = !0), o.length > 0 && this.unclosedBracket(n), t && s) {
      if (!a)
        for (; l.length && (u = l[l.length - 1][0], !(u !== "space" && u !== "comment")); )
          this.tokenizer.back(l.pop());
      this.decl(l, a);
    } else
      this.unknownWord(l);
  }
  parse() {
    let e;
    for (; !this.tokenizer.endOfFile(); )
      switch (e = this.tokenizer.nextToken(), e[0]) {
        case "space":
          this.spaces += e[1];
          break;
        case ";":
          this.freeSemicolon(e);
          break;
        case "}":
          this.end(e);
          break;
        case "comment":
          this.comment(e);
          break;
        case "at-word":
          this.atrule(e);
          break;
        case "{":
          this.emptyRule(e);
          break;
        default:
          this.other(e);
          break;
      }
    this.endFile();
  }
  precheckMissedSemicolon() {
  }
  raw(e, t, r, s) {
    let n, o, a = r.length, l = "", u = !0, f, c;
    for (let p = 0; p < a; p += 1)
      n = r[p], o = n[0], o === "space" && p === a - 1 && !s ? u = !1 : o === "comment" ? (c = r[p - 1] ? r[p - 1][0] : "empty", f = r[p + 1] ? r[p + 1][0] : "empty", !zi[c] && !zi[f] ? l.slice(-1) === "," ? u = !1 : l += n[1] : u = !1) : l += n[1];
    if (!u) {
      let p = r.reduce((d, g) => d + g[1], "");
      e.raws[t] = { raw: p, value: l };
    }
    e[t] = l;
  }
  rule(e) {
    e.pop();
    let t = new Fi();
    this.init(t, e[0][2]), t.raws.between = this.spacesAndCommentsFromEnd(e), this.raw(t, "selector", e), this.current = t;
  }
  spacesAndCommentsFromEnd(e) {
    let t, r = "";
    for (; e.length && (t = e[e.length - 1][0], !(t !== "space" && t !== "comment")); )
      r = e.pop()[1] + r;
    return r;
  }
  // Errors
  spacesAndCommentsFromStart(e) {
    let t, r = "";
    for (; e.length && (t = e[0][0], !(t !== "space" && t !== "comment")); )
      r += e.shift()[1];
    return r;
  }
  spacesFromEnd(e) {
    let t, r = "";
    for (; e.length && (t = e[e.length - 1][0], t === "space"); )
      r = e.pop()[1] + r;
    return r;
  }
  stringFrom(e, t) {
    let r = "";
    for (let s = t; s < e.length; s++)
      r += e[s][1];
    return e.splice(t, e.length - t), r;
  }
  unclosedBlock() {
    let e = this.current.source.start;
    throw this.input.error("Unclosed block", e.line, e.column);
  }
  unclosedBracket(e) {
    throw this.input.error(
      "Unclosed bracket",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unexpectedClose(e) {
    throw this.input.error(
      "Unexpected }",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unknownWord(e) {
    throw this.input.error(
      "Unknown word",
      { offset: e[0][2] },
      { offset: e[0][2] + e[0][1].length }
    );
  }
  unnamedAtrule(e, t) {
    throw this.input.error(
      "At-rule without name",
      { offset: t[2] },
      { offset: t[2] + t[1].length }
    );
  }
};
var Qf = Xf;
let qf = re, eh = Qf, th = Xt;
function Ut(i, e) {
  let t = new th(i, e), r = new eh(t);
  try {
    r.parse();
  } catch (s) {
    throw process.env.NODE_ENV !== "production" && s.name === "CssSyntaxError" && e && e.from && (/\.scss$/i.test(e.from) ? s.message += `
You tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser` : /\.sass/i.test(e.from) ? s.message += `
You tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser` : /\.less$/i.test(e.from) && (s.message += `
You tried to parse Less with the standard CSS parser; try again with the postcss-less parser`)), s;
  }
  return r.root;
}
var Gs = Ut;
Ut.default = Ut;
qf.registerParse(Ut);
let { isClean: Z, my: rh } = ze, sh = ho, ih = Jt, nh = re, oh = Fs, lh = xo, Wi = zs, ah = Gs, uh = We;
const fh = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  document: "Document",
  root: "Root",
  rule: "Rule"
}, hh = {
  AtRule: !0,
  AtRuleExit: !0,
  Comment: !0,
  CommentExit: !0,
  Declaration: !0,
  DeclarationExit: !0,
  Document: !0,
  DocumentExit: !0,
  Once: !0,
  OnceExit: !0,
  postcssPlugin: !0,
  prepare: !0,
  Root: !0,
  RootExit: !0,
  Rule: !0,
  RuleExit: !0
}, ch = {
  Once: !0,
  postcssPlugin: !0,
  prepare: !0
}, pe = 0;
function ve(i) {
  return typeof i == "object" && typeof i.then == "function";
}
function Mo(i) {
  let e = !1, t = fh[i.type];
  return i.type === "decl" ? e = i.prop.toLowerCase() : i.type === "atrule" && (e = i.name.toLowerCase()), e && i.append ? [
    t,
    t + "-" + e,
    pe,
    t + "Exit",
    t + "Exit-" + e
  ] : e ? [t, t + "-" + e, t + "Exit", t + "Exit-" + e] : i.append ? [t, pe, t + "Exit"] : [t, t + "Exit"];
}
function ji(i) {
  let e;
  return i.type === "document" ? e = ["Document", pe, "DocumentExit"] : i.type === "root" ? e = ["Root", pe, "RootExit"] : e = Mo(i), {
    eventIndex: 0,
    events: e,
    iterator: 0,
    node: i,
    visitorIndex: 0,
    visitors: []
  };
}
function ss(i) {
  return i[Z] = !1, i.nodes && i.nodes.forEach((e) => ss(e)), i;
}
let is = {}, de = class _o {
  constructor(e, t, r) {
    this.stringified = !1, this.processed = !1;
    let s;
    if (typeof t == "object" && t !== null && (t.type === "root" || t.type === "document"))
      s = ss(t);
    else if (t instanceof _o || t instanceof Wi)
      s = ss(t.root), t.map && (typeof r.map > "u" && (r.map = {}), r.map.inline || (r.map.inline = !1), r.map.prev = t.map);
    else {
      let n = ah;
      r.syntax && (n = r.syntax.parse), r.parser && (n = r.parser), n.parse && (n = n.parse);
      try {
        s = n(t, r);
      } catch (o) {
        this.processed = !0, this.error = o;
      }
      s && !s[rh] && nh.rebuild(s);
    }
    this.result = new Wi(e, s, r), this.helpers = { ...is, postcss: is, result: this.result }, this.plugins = this.processor.plugins.map((n) => typeof n == "object" && n.prepare ? { ...n, ...n.prepare(this.result) } : n);
  }
  async() {
    return this.error ? Promise.reject(this.error) : this.processed ? Promise.resolve(this.result) : (this.processing || (this.processing = this.runAsync()), this.processing);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(e, t) {
    let r = this.result.lastPlugin;
    try {
      if (t && t.addToError(e), this.error = e, e.name === "CssSyntaxError" && !e.plugin)
        e.plugin = r.postcssPlugin, e.setMessage();
      else if (r.postcssVersion && process.env.NODE_ENV !== "production") {
        let s = r.postcssPlugin, n = r.postcssVersion, o = this.result.processor.version, a = n.split("."), l = o.split(".");
        (a[0] !== l[0] || parseInt(a[1]) > parseInt(l[1])) && console.error(
          "Unknown error from PostCSS plugin. Your current PostCSS version is " + o + ", but " + s + " uses " + n + ". Perhaps this is the source of the error below."
        );
      }
    } catch (s) {
      console && console.error && console.error(s);
    }
    return e;
  }
  prepareVisitors() {
    this.listeners = {};
    let e = (t, r, s) => {
      this.listeners[r] || (this.listeners[r] = []), this.listeners[r].push([t, s]);
    };
    for (let t of this.plugins)
      if (typeof t == "object")
        for (let r in t) {
          if (!hh[r] && /^[A-Z]/.test(r))
            throw new Error(
              `Unknown event ${r} in ${t.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          if (!ch[r])
            if (typeof t[r] == "object")
              for (let s in t[r])
                s === "*" ? e(t, r, t[r][s]) : e(
                  t,
                  r + "-" + s.toLowerCase(),
                  t[r][s]
                );
            else typeof t[r] == "function" && e(t, r, t[r]);
        }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  async runAsync() {
    this.plugin = 0;
    for (let e = 0; e < this.plugins.length; e++) {
      let t = this.plugins[e], r = this.runOnRoot(t);
      if (ve(r))
        try {
          await r;
        } catch (s) {
          throw this.handleError(s);
        }
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[Z]; ) {
        e[Z] = !0;
        let t = [ji(e)];
        for (; t.length > 0; ) {
          let r = this.visitTick(t);
          if (ve(r))
            try {
              await r;
            } catch (s) {
              let n = t[t.length - 1].node;
              throw this.handleError(s, n);
            }
        }
      }
      if (this.listeners.OnceExit)
        for (let [t, r] of this.listeners.OnceExit) {
          this.result.lastPlugin = t;
          try {
            if (e.type === "document") {
              let s = e.nodes.map(
                (n) => r(n, this.helpers)
              );
              await Promise.all(s);
            } else
              await r(e, this.helpers);
          } catch (s) {
            throw this.handleError(s);
          }
        }
    }
    return this.processed = !0, this.stringify();
  }
  runOnRoot(e) {
    this.result.lastPlugin = e;
    try {
      if (typeof e == "object" && e.Once) {
        if (this.result.root.type === "document") {
          let t = this.result.root.nodes.map(
            (r) => e.Once(r, this.helpers)
          );
          return ve(t[0]) ? Promise.all(t) : t;
        }
        return e.Once(this.result.root, this.helpers);
      } else if (typeof e == "function")
        return e(this.result.root, this.result);
    } catch (t) {
      throw this.handleError(t);
    }
  }
  stringify() {
    if (this.error) throw this.error;
    if (this.stringified) return this.result;
    this.stringified = !0, this.sync();
    let e = this.result.opts, t = ih;
    e.syntax && (t = e.syntax.stringify), e.stringifier && (t = e.stringifier), t.stringify && (t = t.stringify);
    let s = new sh(t, this.result.root, this.result.opts).generate();
    return this.result.css = s[0], this.result.map = s[1], this.result;
  }
  sync() {
    if (this.error) throw this.error;
    if (this.processed) return this.result;
    if (this.processed = !0, this.processing)
      throw this.getAsyncError();
    for (let e of this.plugins) {
      let t = this.runOnRoot(e);
      if (ve(t))
        throw this.getAsyncError();
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[Z]; )
        e[Z] = !0, this.walkSync(e);
      if (this.listeners.OnceExit)
        if (e.type === "document")
          for (let t of e.nodes)
            this.visitSync(this.listeners.OnceExit, t);
        else
          this.visitSync(this.listeners.OnceExit, e);
    }
    return this.result;
  }
  then(e, t) {
    return process.env.NODE_ENV !== "production" && ("from" in this.opts || lh(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, t);
  }
  toString() {
    return this.css;
  }
  visitSync(e, t) {
    for (let [r, s] of e) {
      this.result.lastPlugin = r;
      let n;
      try {
        n = s(t, this.helpers);
      } catch (o) {
        throw this.handleError(o, t.proxyOf);
      }
      if (t.type !== "root" && t.type !== "document" && !t.parent)
        return !0;
      if (ve(n))
        throw this.getAsyncError();
    }
  }
  visitTick(e) {
    let t = e[e.length - 1], { node: r, visitors: s } = t;
    if (r.type !== "root" && r.type !== "document" && !r.parent) {
      e.pop();
      return;
    }
    if (s.length > 0 && t.visitorIndex < s.length) {
      let [o, a] = s[t.visitorIndex];
      t.visitorIndex += 1, t.visitorIndex === s.length && (t.visitors = [], t.visitorIndex = 0), this.result.lastPlugin = o;
      try {
        return a(r.toProxy(), this.helpers);
      } catch (l) {
        throw this.handleError(l, r);
      }
    }
    if (t.iterator !== 0) {
      let o = t.iterator, a;
      for (; a = r.nodes[r.indexes[o]]; )
        if (r.indexes[o] += 1, !a[Z]) {
          a[Z] = !0, e.push(ji(a));
          return;
        }
      t.iterator = 0, delete r.indexes[o];
    }
    let n = t.events;
    for (; t.eventIndex < n.length; ) {
      let o = n[t.eventIndex];
      if (t.eventIndex += 1, o === pe) {
        r.nodes && r.nodes.length && (r[Z] = !0, t.iterator = r.getIterator());
        return;
      } else if (this.listeners[o]) {
        t.visitors = this.listeners[o];
        return;
      }
    }
    e.pop();
  }
  walkSync(e) {
    e[Z] = !0;
    let t = Mo(e);
    for (let r of t)
      if (r === pe)
        e.nodes && e.each((s) => {
          s[Z] || this.walkSync(s);
        });
      else {
        let s = this.listeners[r];
        if (s && this.visitSync(s, e.toProxy()))
          return;
      }
  }
  warnings() {
    return this.sync().warnings();
  }
  get content() {
    return this.stringify().content;
  }
  get css() {
    return this.stringify().css;
  }
  get map() {
    return this.stringify().map;
  }
  get messages() {
    return this.sync().messages;
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    return this.sync().root;
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
};
de.registerPostcss = (i) => {
  is = i;
};
var Lo = de;
de.default = de;
uh.registerLazyResult(de);
oh.registerLazyResult(de);
let ph = ho, dh = Jt, mh = xo, gh = Gs;
const yh = zs;
let ns = class {
  constructor(e, t, r) {
    t = t.toString(), this.stringified = !1, this._processor = e, this._css = t, this._opts = r, this._map = void 0;
    let s, n = dh;
    this.result = new yh(this._processor, s, this._opts), this.result.css = t;
    let o = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return o.root;
      }
    });
    let a = new ph(n, s, this._opts, t);
    if (a.isMap()) {
      let [l, u] = a.generate();
      l && (this.result.css = l), u && (this.result.map = u);
    } else
      a.clearAnnotation(), this.result.css = a.css;
  }
  async() {
    return this.error ? Promise.reject(this.error) : Promise.resolve(this.result);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  sync() {
    if (this.error) throw this.error;
    return this.result;
  }
  then(e, t) {
    return process.env.NODE_ENV !== "production" && ("from" in this._opts || mh(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, t);
  }
  toString() {
    return this._css;
  }
  warnings() {
    return [];
  }
  get content() {
    return this.result.css;
  }
  get css() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get messages() {
    return [];
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    if (this._root)
      return this._root;
    let e, t = gh;
    try {
      e = t(this._css, this._opts);
    } catch (r) {
      this.error = r;
    }
    if (this.error)
      throw this.error;
    return this._root = e, e;
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};
var wh = ns;
ns.default = ns;
let bh = wh, Ch = Lo, $h = Fs, Sh = We, _e = class {
  constructor(e = []) {
    this.version = "8.4.38", this.plugins = this.normalize(e);
  }
  normalize(e) {
    let t = [];
    for (let r of e)
      if (r.postcss === !0 ? r = r() : r.postcss && (r = r.postcss), typeof r == "object" && Array.isArray(r.plugins))
        t = t.concat(r.plugins);
      else if (typeof r == "object" && r.postcssPlugin)
        t.push(r);
      else if (typeof r == "function")
        t.push(r);
      else if (typeof r == "object" && (r.parse || r.stringify)) {
        if (process.env.NODE_ENV !== "production")
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
      } else
        throw new Error(r + " is not a PostCSS plugin");
    return t;
  }
  process(e, t = {}) {
    return !this.plugins.length && !t.parser && !t.stringifier && !t.syntax ? new bh(this, e, t) : new Ch(this, e, t);
  }
  use(e) {
    return this.plugins = this.plugins.concat(this.normalize([e])), this;
  }
};
var vh = _e;
_e.default = _e;
Sh.registerProcessor(_e);
$h.registerProcessor(_e);
let xh = Kt, Oh = oo, Ah = Qt, Rh = Ws, Eh = Xt, Ih = We, Nh = js;
function Le(i, e) {
  if (Array.isArray(i)) return i.map((s) => Le(s));
  let { inputs: t, ...r } = i;
  if (t) {
    e = [];
    for (let s of t) {
      let n = { ...s, __proto__: Eh.prototype };
      n.map && (n.map = {
        ...n.map,
        __proto__: Oh.prototype
      }), e.push(n);
    }
  }
  if (r.nodes && (r.nodes = i.nodes.map((s) => Le(s, e))), r.source) {
    let { inputId: s, ...n } = r.source;
    r.source = n, s != null && (r.source.input = e[s]);
  }
  if (r.type === "root")
    return new Ih(r);
  if (r.type === "decl")
    return new xh(r);
  if (r.type === "rule")
    return new Nh(r);
  if (r.type === "comment")
    return new Ah(r);
  if (r.type === "atrule")
    return new Rh(r);
  throw new Error("Unknown node type: " + i.type);
}
var Ph = Le;
Le.default = Le;
let Mh = Us, ko = Kt, _h = Lo, Lh = re, Vs = vh, kh = Jt, Dh = Ph, Do = Fs, Uh = Oo, Uo = Qt, To = Ws, Th = zs, Bh = Xt, Fh = Gs, zh = No, Bo = js, Fo = We, Wh = Ht;
function C(...i) {
  return i.length === 1 && Array.isArray(i[0]) && (i = i[0]), new Vs(i);
}
C.plugin = function(e, t) {
  let r = !1;
  function s(...o) {
    console && console.warn && !r && (r = !0, console.warn(
      e + `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`
    ), process.env.LANG && process.env.LANG.startsWith("cn") && console.warn(
      e + `: 里面 postcss.plugin 被弃用. 迁移指南:
https://www.w3ctech.com/topic/2226`
    ));
    let a = t(...o);
    return a.postcssPlugin = e, a.postcssVersion = new Vs().version, a;
  }
  let n;
  return Object.defineProperty(s, "postcss", {
    get() {
      return n || (n = s()), n;
    }
  }), s.process = function(o, a, l) {
    return C([s(l)]).process(o, a);
  }, s;
};
C.stringify = kh;
C.parse = Fh;
C.fromJSON = Dh;
C.list = zh;
C.comment = (i) => new Uo(i);
C.atRule = (i) => new To(i);
C.decl = (i) => new ko(i);
C.rule = (i) => new Bo(i);
C.root = (i) => new Fo(i);
C.document = (i) => new Do(i);
C.CssSyntaxError = Mh;
C.Declaration = ko;
C.Container = Lh;
C.Processor = Vs;
C.Document = Do;
C.Comment = Uo;
C.Warning = Uh;
C.AtRule = To;
C.Result = Th;
C.Input = Bh;
C.Rule = Bo;
C.Root = Fo;
C.Node = Wh;
_h.registerPostcss(C);
var jh = C;
C.default = C;
const N = /* @__PURE__ */ Qu(jh);
N.stringify;
N.fromJSON;
N.plugin;
N.parse;
N.list;
N.document;
N.comment;
N.atRule;
N.rule;
N.decl;
N.root;
N.CssSyntaxError;
N.Declaration;
N.Container;
N.Processor;
N.Document;
N.Comment;
N.Warning;
N.AtRule;
N.Result;
N.Input;
N.Rule;
N.Root;
N.Node;
class Ys {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  constructor(...e) {
    F(this, "parentElement", null), F(this, "parentNode", null), F(this, "ownerDocument"), F(this, "firstChild", null), F(this, "lastChild", null), F(this, "previousSibling", null), F(this, "nextSibling", null), F(this, "ELEMENT_NODE", 1), F(this, "TEXT_NODE", 3), F(this, "nodeType"), F(this, "nodeName"), F(this, "RRNodeType");
  }
  get childNodes() {
    const e = [];
    let t = this.firstChild;
    for (; t; )
      e.push(t), t = t.nextSibling;
    return e;
  }
  contains(e) {
    if (e instanceof Ys) {
      if (e.ownerDocument !== this.ownerDocument) return !1;
      if (e === this) return !0;
    } else return !1;
    for (; e.parentNode; ) {
      if (e.parentNode === this) return !0;
      e = e.parentNode;
    }
    return !1;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appendChild(e) {
    throw new Error(
      "RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method."
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insertBefore(e, t) {
    throw new Error(
      "RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method."
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeChild(e) {
    throw new Error(
      "RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method."
    );
  }
  toString() {
    return "RRNode";
  }
}
const Gi = {
  Node: ["childNodes", "parentNode", "parentElement", "textContent"],
  ShadowRoot: ["host", "styleSheets"],
  Element: ["shadowRoot", "querySelector", "querySelectorAll"],
  MutationObserver: []
}, Vi = {
  Node: ["contains", "getRootNode"],
  ShadowRoot: ["getSelection"],
  Element: [],
  MutationObserver: ["constructor"]
}, ft = {}, Gh = () => !!globalThis.Zone;
function Zs(i) {
  if (ft[i])
    return ft[i];
  const e = globalThis[i], t = e.prototype, r = i in Gi ? Gi[i] : void 0, s = !!(r && // @ts-expect-error 2345
  r.every(
    (a) => {
      var l, u;
      return !!((u = (l = Object.getOwnPropertyDescriptor(t, a)) == null ? void 0 : l.get) != null && u.toString().includes("[native code]"));
    }
  )), n = i in Vi ? Vi[i] : void 0, o = !!(n && n.every(
    // @ts-expect-error 2345
    (a) => {
      var l;
      return typeof t[a] == "function" && ((l = t[a]) == null ? void 0 : l.toString().includes("[native code]"));
    }
  ));
  if (s && o && !Gh())
    return ft[i] = e.prototype, e.prototype;
  try {
    const a = document.createElement("iframe");
    document.body.appendChild(a);
    const l = a.contentWindow;
    if (!l) return e.prototype;
    const u = l[i].prototype;
    return document.body.removeChild(a), u ? ft[i] = u : t;
  } catch {
    return t;
  }
}
const br = {};
function q(i, e, t) {
  var r;
  const s = `${i}.${String(t)}`;
  if (br[s])
    return br[s].call(
      e
    );
  const n = Zs(i), o = (r = Object.getOwnPropertyDescriptor(
    n,
    t
  )) == null ? void 0 : r.get;
  return o ? (br[s] = o, o.call(e)) : e[t];
}
const Cr = {};
function zo(i, e, t) {
  const r = `${i}.${String(t)}`;
  if (Cr[r])
    return Cr[r].bind(
      e
    );
  const n = Zs(i)[t];
  return typeof n != "function" ? e[t] : (Cr[r] = n, n.bind(e));
}
function Vh(i) {
  return q("Node", i, "childNodes");
}
function Yh(i) {
  return q("Node", i, "parentNode");
}
function Zh(i) {
  return q("Node", i, "parentElement");
}
function Jh(i) {
  return q("Node", i, "textContent");
}
function Hh(i, e) {
  return zo("Node", i, "contains")(e);
}
function Kh(i) {
  return zo("Node", i, "getRootNode")();
}
function Xh(i) {
  return !i || !("host" in i) ? null : q("ShadowRoot", i, "host");
}
function Qh(i) {
  return i.styleSheets;
}
function qh(i) {
  return !i || !("shadowRoot" in i) ? null : q("Element", i, "shadowRoot");
}
function ec(i, e) {
  return q("Element", i, "querySelector")(e);
}
function tc(i, e) {
  return q("Element", i, "querySelectorAll")(e);
}
function rc() {
  return Zs("MutationObserver").constructor;
}
const z = {
  childNodes: Vh,
  parentNode: Yh,
  parentElement: Zh,
  textContent: Jh,
  contains: Hh,
  getRootNode: Kh,
  host: Xh,
  styleSheets: Qh,
  shadowRoot: qh,
  querySelector: ec,
  querySelectorAll: tc,
  mutationObserver: rc
};
function sc(i, e, t = document) {
  const r = { capture: !0, passive: !0 };
  return t.addEventListener(i, e, r), () => t.removeEventListener(i, e, r);
}
const le = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`;
let os = {
  map: {},
  getId() {
    return console.error(le), -1;
  },
  getNode() {
    return console.error(le), null;
  },
  removeNodeFromMap() {
    console.error(le);
  },
  has() {
    return console.error(le), !1;
  },
  reset() {
    console.error(le);
  }
};
typeof window < "u" && window.Proxy && window.Reflect && (os = new Proxy(os, {
  get(i, e, t) {
    return e === "map" && console.error(le), Reflect.get(i, e, t);
  }
}));
function ic(i, e, t = {}) {
  let r = null, s = 0;
  return function(...n) {
    const o = Date.now();
    !s && t.leading === !1 && (s = o);
    const a = e - (o - s), l = this;
    a <= 0 || a > e ? (r && (clearTimeout(r), r = null), s = o, i.apply(l, n)) : !r && t.trailing !== !1 && (r = setTimeout(() => {
      s = t.leading === !1 ? 0 : Date.now(), r = null, i.apply(l, n);
    }, a));
  };
}
function Wo(i, e, t, r, s = window) {
  const n = s.Object.getOwnPropertyDescriptor(i, e);
  return s.Object.defineProperty(
    i,
    e,
    r ? t : {
      set(o) {
        setTimeout(() => {
          t.set.call(this, o);
        }, 0), n && n.set && n.set.call(this, o);
      }
    }
  ), () => Wo(i, e, n || {}, !0);
}
function nc(i, e, t) {
  try {
    if (!(e in i))
      return () => {
      };
    const r = i[e], s = t(r);
    return typeof s == "function" && (s.prototype = s.prototype || {}, Object.defineProperties(s, {
      __rrweb_original__: {
        enumerable: !1,
        value: r
      }
    })), i[e] = s, () => {
      i[e] = r;
    };
  } catch {
    return () => {
    };
  }
}
let jo = Date.now;
/* @__PURE__ */ /[1-9][0-9]{12}/.test(Date.now().toString()) || (jo = () => (/* @__PURE__ */ new Date()).getTime());
function oc(i) {
  var e, t, r, s;
  const n = i.document;
  return {
    left: n.scrollingElement ? n.scrollingElement.scrollLeft : i.pageXOffset !== void 0 ? i.pageXOffset : n.documentElement.scrollLeft || (n == null ? void 0 : n.body) && ((e = z.parentElement(n.body)) == null ? void 0 : e.scrollLeft) || ((t = n == null ? void 0 : n.body) == null ? void 0 : t.scrollLeft) || 0,
    top: n.scrollingElement ? n.scrollingElement.scrollTop : i.pageYOffset !== void 0 ? i.pageYOffset : (n == null ? void 0 : n.documentElement.scrollTop) || (n == null ? void 0 : n.body) && ((r = z.parentElement(n.body)) == null ? void 0 : r.scrollTop) || ((s = n == null ? void 0 : n.body) == null ? void 0 : s.scrollTop) || 0
  };
}
function lc() {
  return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
}
function ac() {
  return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
}
function Go(i) {
  return i ? i.nodeType === i.ELEMENT_NODE ? i : z.parentElement(i) : null;
}
function uc(i, e, t, r) {
  if (!i)
    return !1;
  const s = Go(i);
  if (!s)
    return !1;
  try {
    if (typeof e == "string") {
      if (s.classList.contains(e) || r && s.closest("." + e) !== null) return !0;
    } else if (Ir(s, e, r)) return !0;
  } catch {
  }
  return !!(t && (s.matches(t) || r && s.closest(t) !== null));
}
function fc(i, e) {
  return e.getId(i) !== -1;
}
function hc(i, e, t) {
  return i.tagName === "TITLE" && t.headTitleMutations ? !0 : e.getId(i) === ia;
}
function Vo(i, e) {
  if (ta(i))
    return !1;
  const t = e.getId(i);
  if (!e.has(t))
    return !0;
  const r = z.parentNode(i);
  return r && r.nodeType === i.DOCUMENT_NODE ? !1 : r ? Vo(r, e) : !0;
}
function cc(i) {
  return !!i.changedTouches;
}
function pc(i = window) {
  "NodeList" in i && !i.NodeList.prototype.forEach && (i.NodeList.prototype.forEach = Array.prototype.forEach), "DOMTokenList" in i && !i.DOMTokenList.prototype.forEach && (i.DOMTokenList.prototype.forEach = Array.prototype.forEach);
}
function dc(i) {
  const e = {}, t = (s, n) => {
    const o = {
      value: s,
      parent: n,
      children: []
    };
    return e[s.node.id] = o, o;
  }, r = [];
  for (const s of i) {
    const { nextId: n, parentId: o } = s;
    if (n && n in e) {
      const a = e[n];
      if (a.parent) {
        const l = a.parent.children.indexOf(a);
        a.parent.children.splice(
          l,
          0,
          t(s, a.parent)
        );
      } else {
        const l = r.indexOf(a);
        r.splice(l, 0, t(s, null));
      }
      continue;
    }
    if (o in e) {
      const a = e[o];
      a.children.push(t(s, a));
      continue;
    }
    r.push(t(s, null));
  }
  return r;
}
function Yo(i, e) {
  e(i.value);
  for (let t = i.children.length - 1; t >= 0; t--)
    Yo(i.children[t], e);
}
function mc(i, e) {
  return !!(i.nodeName === "IFRAME" && e.getMeta(i));
}
function gc(i, e) {
  return !!(i.nodeName === "LINK" && i.nodeType === i.ELEMENT_NODE && i.getAttribute && i.getAttribute("rel") === "stylesheet" && e.getMeta(i));
}
function Zo(i, e) {
  var t, r;
  const s = (r = (t = i.ownerDocument) == null ? void 0 : t.defaultView) == null ? void 0 : r.frameElement;
  if (!s || s === e)
    return {
      x: 0,
      y: 0,
      relativeScale: 1,
      absoluteScale: 1
    };
  const n = s.getBoundingClientRect(), o = Zo(s, e), a = n.height / s.clientHeight;
  return {
    x: n.x * o.relativeScale + o.x,
    y: n.y * o.relativeScale + o.y,
    relativeScale: a,
    absoluteScale: o.absoluteScale * a
  };
}
function yc(i) {
  return i ? i instanceof Ys && "shadowRoot" in i ? !!i.shadowRoot : !!z.shadowRoot(i) : !1;
}
function Jo(i, e) {
  const t = i[e[0]];
  return e.length === 1 ? t : Jo(
    t.cssRules[e[1]].cssRules,
    e.slice(2)
  );
}
function wc(i) {
  const e = [...i], t = e.pop();
  return { positions: e, index: t };
}
function bc(i) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (let r = i.length; r--; ) {
    const s = i[r];
    e.has(s.id) || (t.push(s), e.add(s.id));
  }
  return t;
}
class Cc {
  constructor() {
    ar(this, "id", 1), ar(this, "styleIDMap", /* @__PURE__ */ new WeakMap()), ar(this, "idStyleMap", /* @__PURE__ */ new Map());
  }
  getId(e) {
    return this.styleIDMap.get(e) ?? -1;
  }
  has(e) {
    return this.styleIDMap.has(e);
  }
  /**
   * @returns If the stylesheet is in the mirror, returns the id of the stylesheet. If not, return the new assigned id.
   */
  add(e, t) {
    if (this.has(e)) return this.getId(e);
    let r;
    return t === void 0 ? r = this.id++ : r = t, this.styleIDMap.set(e, r), this.idStyleMap.set(r, e), r;
  }
  getStyle(e) {
    return this.idStyleMap.get(e) || null;
  }
  reset() {
    this.styleIDMap = /* @__PURE__ */ new WeakMap(), this.idStyleMap = /* @__PURE__ */ new Map(), this.id = 1;
  }
  generateId() {
    return this.id++;
  }
}
function Ho(i) {
  var e;
  let t = null;
  return "getRootNode" in i && ((e = z.getRootNode(i)) == null ? void 0 : e.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && z.host(z.getRootNode(i)) && (t = z.host(z.getRootNode(i))), t;
}
function Ko(i) {
  let e = i, t;
  for (; t = Ho(e); )
    e = t;
  return e;
}
function Xo(i) {
  const e = i.ownerDocument;
  if (!e) return !1;
  const t = Ko(i);
  return z.contains(e, t);
}
function $c(i) {
  const e = i.ownerDocument;
  return e ? z.contains(e, i) || Xo(i) : !1;
}
const Sc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StyleSheetMirror: Cc,
  get _mirror() {
    return os;
  },
  closestElementOfNode: Go,
  getBaseDimension: Zo,
  getNestedRule: Jo,
  getPositionsAndIndex: wc,
  getRootShadowHost: Ko,
  getShadowHost: Ho,
  getWindowHeight: lc,
  getWindowScroll: oc,
  getWindowWidth: ac,
  hasShadowRoot: yc,
  hookSetter: Wo,
  inDom: $c,
  isAncestorRemoved: Vo,
  isBlocked: uc,
  isIgnored: hc,
  isSerialized: fc,
  isSerializedIframe: mc,
  isSerializedStylesheet: gc,
  iterateResolveTree: Yo,
  legacy_isTouchEvent: cc,
  get nowTimestamp() {
    return jo;
  },
  on: sc,
  patch: nc,
  polyfill: pc,
  queueToResolveTrees: dc,
  shadowHostInDom: Xo,
  throttle: ic,
  uniqueTextMutations: bc
}, Symbol.toStringTag, { value: "Module" }));
var Yi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", vc = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ht = 0; ht < Yi.length; ht++)
  vc[Yi.charCodeAt(ht)] = ht;
const xc = "KGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICB2YXIgY2hhcnMgPSAiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyI7CiAgdmFyIGxvb2t1cCA9IHR5cGVvZiBVaW50OEFycmF5ID09PSAidW5kZWZpbmVkIiA/IFtdIDogbmV3IFVpbnQ4QXJyYXkoMjU2KTsKICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7CiAgICBsb29rdXBbY2hhcnMuY2hhckNvZGVBdChpKV0gPSBpOwogIH0KICB2YXIgZW5jb2RlID0gZnVuY3Rpb24oYXJyYXlidWZmZXIpIHsKICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5YnVmZmVyKSwgaTIsIGxlbiA9IGJ5dGVzLmxlbmd0aCwgYmFzZTY0ID0gIiI7CiAgICBmb3IgKGkyID0gMDsgaTIgPCBsZW47IGkyICs9IDMpIHsKICAgICAgYmFzZTY0ICs9IGNoYXJzW2J5dGVzW2kyXSA+PiAyXTsKICAgICAgYmFzZTY0ICs9IGNoYXJzWyhieXRlc1tpMl0gJiAzKSA8PCA0IHwgYnl0ZXNbaTIgKyAxXSA+PiA0XTsKICAgICAgYmFzZTY0ICs9IGNoYXJzWyhieXRlc1tpMiArIDFdICYgMTUpIDw8IDIgfCBieXRlc1tpMiArIDJdID4+IDZdOwogICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaTIgKyAyXSAmIDYzXTsKICAgIH0KICAgIGlmIChsZW4gJSAzID09PSAyKSB7CiAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgIj0iOwogICAgfSBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7CiAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDIpICsgIj09IjsKICAgIH0KICAgIHJldHVybiBiYXNlNjQ7CiAgfTsKICBjb25zdCBsYXN0QmxvYk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7CiAgY29uc3QgdHJhbnNwYXJlbnRCbG9iTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTsKICBhc3luYyBmdW5jdGlvbiBnZXRUcmFuc3BhcmVudEJsb2JGb3Iod2lkdGgsIGhlaWdodCwgZGF0YVVSTE9wdGlvbnMpIHsKICAgIGNvbnN0IGlkID0gYCR7d2lkdGh9LSR7aGVpZ2h0fWA7CiAgICBpZiAoIk9mZnNjcmVlbkNhbnZhcyIgaW4gZ2xvYmFsVGhpcykgewogICAgICBpZiAodHJhbnNwYXJlbnRCbG9iTWFwLmhhcyhpZCkpIHJldHVybiB0cmFuc3BhcmVudEJsb2JNYXAuZ2V0KGlkKTsKICAgICAgY29uc3Qgb2Zmc2NyZWVuID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTsKICAgICAgb2Zmc2NyZWVuLmdldENvbnRleHQoIjJkIik7CiAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCBvZmZzY3JlZW4uY29udmVydFRvQmxvYihkYXRhVVJMT3B0aW9ucyk7CiAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpOwogICAgICBjb25zdCBiYXNlNjQgPSBlbmNvZGUoYXJyYXlCdWZmZXIpOwogICAgICB0cmFuc3BhcmVudEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICByZXR1cm4gYmFzZTY0OwogICAgfSBlbHNlIHsKICAgICAgcmV0dXJuICIiOwogICAgfQogIH0KICBjb25zdCB3b3JrZXIgPSBzZWxmOwogIHdvcmtlci5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihlKSB7CiAgICBpZiAoIk9mZnNjcmVlbkNhbnZhcyIgaW4gZ2xvYmFsVGhpcykgewogICAgICBjb25zdCB7IGlkLCBiaXRtYXAsIHdpZHRoLCBoZWlnaHQsIGRhdGFVUkxPcHRpb25zIH0gPSBlLmRhdGE7CiAgICAgIGNvbnN0IHRyYW5zcGFyZW50QmFzZTY0ID0gZ2V0VHJhbnNwYXJlbnRCbG9iRm9yKAogICAgICAgIHdpZHRoLAogICAgICAgIGhlaWdodCwKICAgICAgICBkYXRhVVJMT3B0aW9ucwogICAgICApOwogICAgICBjb25zdCBvZmZzY3JlZW4gPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoLCBoZWlnaHQpOwogICAgICBjb25zdCBjdHggPSBvZmZzY3JlZW4uZ2V0Q29udGV4dCgiMmQiKTsKICAgICAgY3R4LmRyYXdJbWFnZShiaXRtYXAsIDAsIDApOwogICAgICBiaXRtYXAuY2xvc2UoKTsKICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IG9mZnNjcmVlbi5jb252ZXJ0VG9CbG9iKGRhdGFVUkxPcHRpb25zKTsKICAgICAgY29uc3QgdHlwZSA9IGJsb2IudHlwZTsKICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBibG9iLmFycmF5QnVmZmVyKCk7CiAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7CiAgICAgIGlmICghbGFzdEJsb2JNYXAuaGFzKGlkKSAmJiBhd2FpdCB0cmFuc3BhcmVudEJhc2U2NCA9PT0gYmFzZTY0KSB7CiAgICAgICAgbGFzdEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICAgIHJldHVybiB3b3JrZXIucG9zdE1lc3NhZ2UoeyBpZCB9KTsKICAgICAgfQogICAgICBpZiAobGFzdEJsb2JNYXAuZ2V0KGlkKSA9PT0gYmFzZTY0KSByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQgfSk7CiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7CiAgICAgICAgaWQsCiAgICAgICAgdHlwZSwKICAgICAgICBiYXNlNjQsCiAgICAgICAgd2lkdGgsCiAgICAgICAgaGVpZ2h0CiAgICAgIH0pOwogICAgICBsYXN0QmxvYk1hcC5zZXQoaWQsIGJhc2U2NCk7CiAgICB9IGVsc2UgewogICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQ6IGUuZGF0YS5pZCB9KTsKICAgIH0KICB9Owp9KSgpOwovLyMgc291cmNlTWFwcGluZ1VSTD1pbWFnZS1iaXRtYXAtZGF0YS11cmwtd29ya2VyLUlKcEM3Z19iLmpzLm1hcAo=", Oc = (i) => Uint8Array.from(atob(i), (e) => e.charCodeAt(0));
typeof window < "u" && window.Blob && new Blob([Oc(xc)], { type: "text/javascript;charset=utf-8" });
try {
  if (Array.from([1], (i) => i * 2)[0] !== 2) {
    const i = document.createElement("iframe");
    document.body.appendChild(i), Array.from = ((oi = i.contentWindow) == null ? void 0 : oi.Array.from) || Array.from, document.body.removeChild(i);
  }
} catch (i) {
  console.debug("Unable to override Array.from", i);
}
sa();
var Zi;
(function(i) {
  i[i.NotStarted = 0] = "NotStarted", i[i.Running = 1] = "Running", i[i.Stopped = 2] = "Stopped";
})(Zi || (Zi = {}));
var Ac = Object.defineProperty, Rc = (i, e, t) => e in i ? Ac(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, Ji = (i, e, t) => Rc(i, typeof e != "symbol" ? e + "" : e, t), k = /* @__PURE__ */ ((i) => (i[i.Document = 0] = "Document", i[i.DocumentType = 1] = "DocumentType", i[i.Element = 2] = "Element", i[i.Text = 3] = "Text", i[i.CDATA = 4] = "CDATA", i[i.Comment = 5] = "Comment", i))(k || {});
const Hi = {
  Node: ["childNodes", "parentNode", "parentElement", "textContent"],
  ShadowRoot: ["host", "styleSheets"],
  Element: ["shadowRoot", "querySelector", "querySelectorAll"],
  MutationObserver: []
}, Ki = {
  Node: ["contains", "getRootNode"],
  ShadowRoot: ["getSelection"],
  Element: [],
  MutationObserver: ["constructor"]
}, ct = {}, Ec = () => !!globalThis.Zone;
function Js(i) {
  if (ct[i])
    return ct[i];
  const e = globalThis[i], t = e.prototype, r = i in Hi ? Hi[i] : void 0, s = !!(r && // @ts-expect-error 2345
  r.every(
    (a) => {
      var l, u;
      return !!((u = (l = Object.getOwnPropertyDescriptor(t, a)) == null ? void 0 : l.get) != null && u.toString().includes("[native code]"));
    }
  )), n = i in Ki ? Ki[i] : void 0, o = !!(n && n.every(
    // @ts-expect-error 2345
    (a) => {
      var l;
      return typeof t[a] == "function" && ((l = t[a]) == null ? void 0 : l.toString().includes("[native code]"));
    }
  ));
  if (s && o && !Ec())
    return ct[i] = e.prototype, e.prototype;
  try {
    const a = document.createElement("iframe");
    document.body.appendChild(a);
    const l = a.contentWindow;
    if (!l) return e.prototype;
    const u = l[i].prototype;
    return document.body.removeChild(a), u ? ct[i] = u : t;
  } catch {
    return t;
  }
}
const $r = {};
function ee(i, e, t) {
  var r;
  const s = `${i}.${String(t)}`;
  if ($r[s])
    return $r[s].call(
      e
    );
  const n = Js(i), o = (r = Object.getOwnPropertyDescriptor(
    n,
    t
  )) == null ? void 0 : r.get;
  return o ? ($r[s] = o, o.call(e)) : e[t];
}
const Sr = {};
function Qo(i, e, t) {
  const r = `${i}.${String(t)}`;
  if (Sr[r])
    return Sr[r].bind(
      e
    );
  const n = Js(i)[t];
  return typeof n != "function" ? e[t] : (Sr[r] = n, n.bind(e));
}
function Ic(i) {
  return ee("Node", i, "childNodes");
}
function Nc(i) {
  return ee("Node", i, "parentNode");
}
function Pc(i) {
  return ee("Node", i, "parentElement");
}
function Mc(i) {
  return ee("Node", i, "textContent");
}
function _c(i, e) {
  return Qo("Node", i, "contains")(e);
}
function Lc(i) {
  return Qo("Node", i, "getRootNode")();
}
function kc(i) {
  return !i || !("host" in i) ? null : ee("ShadowRoot", i, "host");
}
function Dc(i) {
  return i.styleSheets;
}
function Uc(i) {
  return !i || !("shadowRoot" in i) ? null : ee("Element", i, "shadowRoot");
}
function Tc(i, e) {
  return ee("Element", i, "querySelector")(e);
}
function Bc(i, e) {
  return ee("Element", i, "querySelectorAll")(e);
}
function Fc() {
  return Js("MutationObserver").constructor;
}
const U = {
  childNodes: Ic,
  parentNode: Nc,
  parentElement: Pc,
  textContent: Mc,
  contains: _c,
  getRootNode: Lc,
  host: kc,
  styleSheets: Dc,
  shadowRoot: Uc,
  querySelector: Tc,
  querySelectorAll: Bc,
  mutationObserver: Fc
};
function qo(i) {
  return i.nodeType === i.ELEMENT_NODE;
}
function zc(i) {
  const e = (
    // anchor and textarea elements also have a `host` property
    // but only shadow roots have a `mode` property
    i && "host" in i && "mode" in i && U.host(i) || null
  );
  return !!(e && "shadowRoot" in e && U.shadowRoot(e) === i);
}
function vr(i) {
  return Object.prototype.toString.call(i) === "[object ShadowRoot]";
}
function Wc(i) {
  return i.includes(" background-clip: text;") && !i.includes(" -webkit-background-clip: text;") && (i = i.replace(
    /\sbackground-clip:\s*text;/g,
    " -webkit-background-clip: text; background-clip: text;"
  )), i;
}
function jc(i) {
  const { cssText: e } = i;
  if (e.split('"').length < 3) return e;
  const t = ["@import", `url(${JSON.stringify(i.href)})`];
  return i.layerName === "" ? t.push("layer") : i.layerName && t.push(`layer(${i.layerName})`), i.supportsText && t.push(`supports(${i.supportsText})`), i.media.length && t.push(i.media.mediaText), t.join(" ") + ";";
}
function ls(i) {
  try {
    const e = i.rules || i.cssRules;
    if (!e)
      return null;
    let t = i.href;
    !t && i.ownerNode && i.ownerNode.ownerDocument && (t = i.ownerNode.ownerDocument.location.href);
    const r = Array.from(
      e,
      (s) => Gc(s, t)
    ).join("");
    return Wc(r);
  } catch {
    return null;
  }
}
function Gc(i, e) {
  if (Yc(i)) {
    let t;
    try {
      t = // for same-origin stylesheets,
      // we can access the imported stylesheet rules directly
      ls(i.styleSheet) || // work around browser issues with the raw string `@import url(...)` statement
      jc(i);
    } catch {
      t = i.cssText;
    }
    return i.styleSheet.href ? Tt(t, i.styleSheet.href) : t;
  } else {
    let t = i.cssText;
    return Zc(i) && i.selectorText.includes(":") && (t = Vc(t)), e ? Tt(t, e) : t;
  }
}
function Vc(i) {
  const e = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
  return i.replace(e, "$1\\$2");
}
function Yc(i) {
  return "styleSheet" in i;
}
function Zc(i) {
  return "selectorText" in i;
}
class Jc {
  constructor() {
    Ji(this, "idNodeMap", /* @__PURE__ */ new Map()), Ji(this, "nodeMetaMap", /* @__PURE__ */ new WeakMap());
  }
  getId(e) {
    var t;
    return e ? ((t = this.getMeta(e)) == null ? void 0 : t.id) ?? -1 : -1;
  }
  getNode(e) {
    return this.idNodeMap.get(e) || null;
  }
  getIds() {
    return Array.from(this.idNodeMap.keys());
  }
  getMeta(e) {
    return this.nodeMetaMap.get(e) || null;
  }
  // removes the node from idNodeMap
  // doesn't remove the node from nodeMetaMap
  removeNodeFromMap(e) {
    const t = this.getId(e);
    this.idNodeMap.delete(t), e.childNodes && e.childNodes.forEach(
      (r) => this.removeNodeFromMap(r)
    );
  }
  has(e) {
    return this.idNodeMap.has(e);
  }
  hasNode(e) {
    return this.nodeMetaMap.has(e);
  }
  add(e, t) {
    const r = t.id;
    this.idNodeMap.set(r, e), this.nodeMetaMap.set(e, t);
  }
  replace(e, t) {
    const r = this.getNode(e);
    if (r) {
      const s = this.nodeMetaMap.get(r);
      s && this.nodeMetaMap.set(t, s);
    }
    this.idNodeMap.set(e, t);
  }
  reset() {
    this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
  }
}
function Hc({
  element: i,
  maskInputOptions: e,
  tagName: t,
  type: r,
  value: s,
  maskInputFn: n
}) {
  let o = s || "";
  const a = r && qt(r);
  return (e[t.toLowerCase()] || a && e[a]) && (n ? o = n(o, i) : o = "*".repeat(o.length)), o;
}
function qt(i) {
  return i.toLowerCase();
}
const Xi = "__rrweb_original__";
function Kc(i) {
  const e = i.getContext("2d");
  if (!e) return !0;
  const t = 50;
  for (let r = 0; r < i.width; r += t)
    for (let s = 0; s < i.height; s += t) {
      const n = e.getImageData, o = Xi in n ? n[Xi] : n;
      if (new Uint32Array(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        o.call(
          e,
          r,
          s,
          Math.min(t, i.width - r),
          Math.min(t, i.height - s)
        ).data.buffer
      ).some((l) => l !== 0)) return !1;
    }
  return !0;
}
function Xc(i) {
  const e = i.type;
  return i.hasAttribute("data-rr-is-password") ? "password" : e ? (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    qt(e)
  ) : null;
}
function el(i, e) {
  let t;
  try {
    t = new URL(i, e ?? window.location.href);
  } catch {
    return null;
  }
  const r = /\.([0-9a-z]+)(?:$)/i, s = t.pathname.match(r);
  return (s == null ? void 0 : s[1]) ?? null;
}
function Qc(i) {
  let e = "";
  return i.indexOf("//") > -1 ? e = i.split("/").slice(0, 3).join("/") : e = i.split("/")[0], e = e.split("?")[0], e;
}
const qc = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm, ep = /^(?:[a-z+]+:)?\/\//i, tp = /^www\..*/i, rp = /^(data:)([^,]*),(.*)/i;
function Tt(i, e) {
  return (i || "").replace(
    qc,
    (t, r, s, n, o, a) => {
      const l = s || o || a, u = r || n || "";
      if (!l)
        return t;
      if (ep.test(l) || tp.test(l))
        return `url(${u}${l}${u})`;
      if (rp.test(l))
        return `url(${u}${l}${u})`;
      if (l[0] === "/")
        return `url(${u}${Qc(e) + l}${u})`;
      const f = e.split("/"), c = l.split("/");
      f.pop();
      for (const p of c)
        p !== "." && (p === ".." ? f.pop() : f.push(p));
      return `url(${u}${f.join("/")}${u})`;
    }
  );
}
function xr(i) {
  return i.replace(/(\/\*[^*]*\*\/)|[\s;]/g, "");
}
function sp(i, e) {
  const t = Array.from(e.childNodes), r = [];
  if (t.length > 1 && i && typeof i == "string") {
    const s = xr(i);
    for (let n = 1; n < t.length; n++)
      if (t[n].textContent && typeof t[n].textContent == "string") {
        const o = xr(t[n].textContent);
        for (let a = 3; a < o.length; a++) {
          const l = o.substring(0, a);
          if (s.split(l).length === 2) {
            const u = s.indexOf(l);
            for (let f = u; f < i.length; f++)
              if (xr(i.substring(0, f)).length === u) {
                r.push(i.substring(0, f)), i = i.substring(f);
                break;
              }
            break;
          }
        }
      }
  }
  return r.push(i), r;
}
function ip(i, e) {
  return sp(i, e).join("/* rr_split */");
}
let np = 1;
const op = new RegExp("[^a-z0-9-_:]"), Qi = -2;
function lp() {
  return np++;
}
function ap(i) {
  if (i instanceof HTMLFormElement)
    return "form";
  const e = qt(i.tagName);
  return op.test(e) ? "div" : e;
}
let oe, qi;
const up = /^[^ \t\n\r\u000c]+/, fp = /^[, \t\n\r\u000c]+/;
function hp(i, e) {
  if (e.trim() === "")
    return e;
  let t = 0;
  function r(n) {
    let o;
    const a = n.exec(e.substring(t));
    return a ? (o = a[0], t += o.length, o) : "";
  }
  const s = [];
  for (; r(fp), !(t >= e.length); ) {
    let n = r(up);
    if (n.slice(-1) === ",")
      n = ae(i, n.substring(0, n.length - 1)), s.push(n);
    else {
      let o = "";
      n = ae(i, n);
      let a = !1;
      for (; ; ) {
        const l = e.charAt(t);
        if (l === "") {
          s.push((n + o).trim());
          break;
        } else if (a)
          l === ")" && (a = !1);
        else if (l === ",") {
          t += 1, s.push((n + o).trim());
          break;
        } else l === "(" && (a = !0);
        o += l, t += 1;
      }
    }
  }
  return s.join(", ");
}
const en = /* @__PURE__ */ new WeakMap();
function ae(i, e) {
  return !e || e.trim() === "" ? e : Hs(i, e);
}
function cp(i) {
  return !!(i.tagName === "svg" || i.ownerSVGElement);
}
function Hs(i, e) {
  let t = en.get(i);
  if (t || (t = i.createElement("a"), en.set(i, t)), !e)
    e = "";
  else if (e.startsWith("blob:") || e.startsWith("data:"))
    return e;
  return t.setAttribute("href", e), t.href;
}
function pp(i, e, t, r) {
  return r && (t === "src" || t === "href" && !(e === "use" && r[0] === "#") || t === "xlink:href" && r[0] !== "#" || t === "background" && (e === "table" || e === "td" || e === "th") ? ae(i, r) : t === "srcset" ? hp(i, r) : t === "style" ? Tt(r, Hs(i)) : e === "object" && t === "data" ? ae(i, r) : r);
}
function dp(i, e, t) {
  return (i === "video" || i === "audio") && e === "autoplay";
}
function mp(i, e, t) {
  try {
    if (typeof e == "string") {
      if (i.classList.contains(e))
        return !0;
    } else
      for (let r = i.classList.length; r--; ) {
        const s = i.classList[r];
        if (e.test(s))
          return !0;
      }
    if (t)
      return i.matches(t);
  } catch {
  }
  return !1;
}
function as(i, e, t) {
  if (!i) return !1;
  if (i.nodeType !== i.ELEMENT_NODE)
    return t ? as(U.parentNode(i), e, t) : !1;
  for (let r = i.classList.length; r--; ) {
    const s = i.classList[r];
    if (e.test(s))
      return !0;
  }
  return t ? as(U.parentNode(i), e, t) : !1;
}
function gp(i, e, t, r) {
  let s;
  if (qo(i)) {
    if (s = i, !U.childNodes(s).length)
      return !1;
  } else {
    if (U.parentElement(i) === null)
      return !1;
    s = U.parentElement(i);
  }
  try {
    if (typeof e == "string") {
      if (r) {
        if (s.closest(`.${e}`)) return !0;
      } else if (s.classList.contains(e)) return !0;
    } else if (as(s, e, r)) return !0;
    if (t) {
      if (r) {
        if (s.closest(t)) return !0;
      } else if (s.matches(t)) return !0;
    }
  } catch {
  }
  return !1;
}
function yp(i, e, t) {
  const r = i.contentWindow;
  if (!r)
    return;
  let s = !1, n;
  try {
    n = r.document.readyState;
  } catch {
    return;
  }
  if (n !== "complete") {
    const a = setTimeout(() => {
      s || (e(), s = !0);
    }, t);
    i.addEventListener("load", () => {
      clearTimeout(a), s = !0, e();
    });
    return;
  }
  const o = "about:blank";
  if (r.location.href !== o || i.src === o || i.src === "")
    return setTimeout(e, 0), i.addEventListener("load", e);
  i.addEventListener("load", e);
}
function wp(i, e, t) {
  let r = !1, s;
  try {
    s = i.sheet;
  } catch {
    return;
  }
  if (s) return;
  const n = setTimeout(() => {
    r || (e(), r = !0);
  }, t);
  i.addEventListener("load", () => {
    clearTimeout(n), r = !0, e();
  });
}
function bp(i, e) {
  const {
    doc: t,
    mirror: r,
    blockClass: s,
    blockSelector: n,
    needsMask: o,
    inlineStylesheet: a,
    maskInputOptions: l = {},
    maskTextFn: u,
    maskInputFn: f,
    dataURLOptions: c = {},
    inlineImages: p,
    recordCanvas: d,
    keepIframeSrcFn: g,
    newlyAddedElement: w = !1,
    cssCaptured: h = !1
  } = e, v = Cp(t, r);
  switch (i.nodeType) {
    case i.DOCUMENT_NODE:
      return i.compatMode !== "CSS1Compat" ? {
        type: k.Document,
        childNodes: [],
        compatMode: i.compatMode
        // probably "BackCompat"
      } : {
        type: k.Document,
        childNodes: []
      };
    case i.DOCUMENT_TYPE_NODE:
      return {
        type: k.DocumentType,
        name: i.name,
        publicId: i.publicId,
        systemId: i.systemId,
        rootId: v
      };
    case i.ELEMENT_NODE:
      return Sp(i, {
        doc: t,
        blockClass: s,
        blockSelector: n,
        inlineStylesheet: a,
        maskInputOptions: l,
        maskInputFn: f,
        dataURLOptions: c,
        inlineImages: p,
        recordCanvas: d,
        keepIframeSrcFn: g,
        newlyAddedElement: w,
        rootId: v
      });
    case i.TEXT_NODE:
      return $p(i, {
        doc: t,
        needsMask: o,
        maskTextFn: u,
        rootId: v,
        cssCaptured: h
      });
    case i.CDATA_SECTION_NODE:
      return {
        type: k.CDATA,
        textContent: "",
        rootId: v
      };
    case i.COMMENT_NODE:
      return {
        type: k.Comment,
        textContent: U.textContent(i) || "",
        rootId: v
      };
    default:
      return !1;
  }
}
function Cp(i, e) {
  if (!e.hasNode(i)) return;
  const t = e.getId(i);
  return t === 1 ? void 0 : t;
}
function $p(i, e) {
  const { needsMask: t, maskTextFn: r, rootId: s, cssCaptured: n } = e, o = U.parentNode(i), a = o && o.tagName;
  let l = "";
  const u = a === "STYLE" ? !0 : void 0, f = a === "SCRIPT" ? !0 : void 0;
  return f ? l = "SCRIPT_PLACEHOLDER" : n || (l = U.textContent(i), u && l && (l = Tt(l, Hs(e.doc)))), !u && !f && l && t && (l = r ? r(l, U.parentElement(i)) : l.replace(/[\S]/g, "*")), {
    type: k.Text,
    textContent: l || "",
    rootId: s
  };
}
function Sp(i, e) {
  const {
    doc: t,
    blockClass: r,
    blockSelector: s,
    inlineStylesheet: n,
    maskInputOptions: o = {},
    maskInputFn: a,
    dataURLOptions: l = {},
    inlineImages: u,
    recordCanvas: f,
    keepIframeSrcFn: c,
    newlyAddedElement: p = !1,
    rootId: d
  } = e, g = mp(i, r, s), w = ap(i);
  let h = {};
  const v = i.attributes.length;
  for (let m = 0; m < v; m++) {
    const y = i.attributes[m];
    dp(w, y.name, y.value) || (h[y.name] = pp(
      t,
      w,
      qt(y.name),
      y.value
    ));
  }
  if (w === "link" && n) {
    const m = Array.from(t.styleSheets).find((_) => _.href === i.href);
    let y = null;
    m && (y = ls(m)), y && (delete h.rel, delete h.href, h._cssText = y);
  }
  if (w === "style" && i.sheet) {
    let m = ls(
      i.sheet
    );
    m && (i.childNodes.length > 1 && (m = ip(m, i)), h._cssText = m);
  }
  if (w === "input" || w === "textarea" || w === "select") {
    const m = i.value, y = i.checked;
    h.type !== "radio" && h.type !== "checkbox" && h.type !== "submit" && h.type !== "button" && m ? h.value = Hc({
      element: i,
      type: Xc(i),
      tagName: w,
      value: m,
      maskInputOptions: o,
      maskInputFn: a
    }) : y && (h.checked = y);
  }
  if (w === "option" && (i.selected && !o.select ? h.selected = !0 : delete h.selected), w === "dialog" && i.open && (h.rr_open_mode = i.matches("dialog:modal") ? "modal" : "non-modal"), w === "canvas" && f) {
    if (i.__context === "2d")
      Kc(i) || (h.rr_dataURL = i.toDataURL(
        l.type,
        l.quality
      ));
    else if (!("__context" in i)) {
      const m = i.toDataURL(
        l.type,
        l.quality
      ), y = t.createElement("canvas");
      y.width = i.width, y.height = i.height;
      const _ = y.toDataURL(
        l.type,
        l.quality
      );
      m !== _ && (h.rr_dataURL = m);
    }
  }
  if (w === "img" && u) {
    oe || (oe = t.createElement("canvas"), qi = oe.getContext("2d"));
    const m = i, y = m.currentSrc || m.getAttribute("src") || "<unknown-src>", _ = m.crossOrigin, D = () => {
      m.removeEventListener("load", D);
      try {
        oe.width = m.naturalWidth, oe.height = m.naturalHeight, qi.drawImage(m, 0, 0), h.rr_dataURL = oe.toDataURL(
          l.type,
          l.quality
        );
      } catch (V) {
        if (m.crossOrigin !== "anonymous") {
          m.crossOrigin = "anonymous", m.complete && m.naturalWidth !== 0 ? D() : m.addEventListener("load", D);
          return;
        } else
          console.warn(
            `Cannot inline img src=${y}! Error: ${V}`
          );
      }
      m.crossOrigin === "anonymous" && (_ ? h.crossOrigin = _ : m.removeAttribute("crossorigin"));
    };
    m.complete && m.naturalWidth !== 0 ? D() : m.addEventListener("load", D);
  }
  if (w === "audio" || w === "video") {
    const m = h;
    m.rr_mediaState = i.paused ? "paused" : "played", m.rr_mediaCurrentTime = i.currentTime, m.rr_mediaPlaybackRate = i.playbackRate, m.rr_mediaMuted = i.muted, m.rr_mediaLoop = i.loop, m.rr_mediaVolume = i.volume;
  }
  if (p || (i.scrollLeft && (h.rr_scrollLeft = i.scrollLeft), i.scrollTop && (h.rr_scrollTop = i.scrollTop)), g) {
    const { width: m, height: y } = i.getBoundingClientRect();
    h = {
      class: h.class,
      rr_width: `${m}px`,
      rr_height: `${y}px`
    };
  }
  w === "iframe" && !c(h.src) && (i.contentDocument || (h.rr_src = h.src), delete h.src);
  let O;
  try {
    customElements.get(w) && (O = !0);
  } catch {
  }
  return {
    type: k.Element,
    tagName: w,
    attributes: h,
    childNodes: [],
    isSVG: cp(i) || void 0,
    needBlock: g,
    rootId: d,
    isCustom: O
  };
}
function x(i) {
  return i == null ? "" : i.toLowerCase();
}
function vp(i, e) {
  if (e.comment && i.type === k.Comment)
    return !0;
  if (i.type === k.Element) {
    if (e.script && // script tag
    (i.tagName === "script" || // (module)preload link
    i.tagName === "link" && (i.attributes.rel === "preload" || i.attributes.rel === "modulepreload") && i.attributes.as === "script" || // prefetch link
    i.tagName === "link" && i.attributes.rel === "prefetch" && typeof i.attributes.href == "string" && el(i.attributes.href) === "js"))
      return !0;
    if (e.headFavicon && (i.tagName === "link" && i.attributes.rel === "shortcut icon" || i.tagName === "meta" && (x(i.attributes.name).match(
      /^msapplication-tile(image|color)$/
    ) || x(i.attributes.name) === "application-name" || x(i.attributes.rel) === "icon" || x(i.attributes.rel) === "apple-touch-icon" || x(i.attributes.rel) === "shortcut icon")))
      return !0;
    if (i.tagName === "meta") {
      if (e.headMetaDescKeywords && x(i.attributes.name).match(/^description|keywords$/))
        return !0;
      if (e.headMetaSocial && (x(i.attributes.property).match(/^(og|twitter|fb):/) || // og = opengraph (facebook)
      x(i.attributes.name).match(/^(og|twitter):/) || x(i.attributes.name) === "pinterest"))
        return !0;
      if (e.headMetaRobots && (x(i.attributes.name) === "robots" || x(i.attributes.name) === "googlebot" || x(i.attributes.name) === "bingbot"))
        return !0;
      if (e.headMetaHttpEquiv && i.attributes["http-equiv"] !== void 0)
        return !0;
      if (e.headMetaAuthorship && (x(i.attributes.name) === "author" || x(i.attributes.name) === "generator" || x(i.attributes.name) === "framework" || x(i.attributes.name) === "publisher" || x(i.attributes.name) === "progid" || x(i.attributes.property).match(/^article:/) || x(i.attributes.property).match(/^product:/)))
        return !0;
      if (e.headMetaVerification && (x(i.attributes.name) === "google-site-verification" || x(i.attributes.name) === "yandex-verification" || x(i.attributes.name) === "csrf-token" || x(i.attributes.name) === "p:domain_verify" || x(i.attributes.name) === "verify-v1" || x(i.attributes.name) === "verification" || x(i.attributes.name) === "shopify-checkout-api-token"))
        return !0;
    }
  }
  return !1;
}
function Ae(i, e) {
  const {
    doc: t,
    mirror: r,
    blockClass: s,
    blockSelector: n,
    maskTextClass: o,
    maskTextSelector: a,
    skipChild: l = !1,
    inlineStylesheet: u = !0,
    maskInputOptions: f = {},
    maskTextFn: c,
    maskInputFn: p,
    slimDOMOptions: d,
    dataURLOptions: g = {},
    inlineImages: w = !1,
    recordCanvas: h = !1,
    onSerialize: v,
    onIframeLoad: O,
    iframeLoadTimeout: m = 5e3,
    onStylesheetLoad: y,
    stylesheetLoadTimeout: _ = 5e3,
    keepIframeSrcFn: D = () => !1,
    newlyAddedElement: V = !1,
    cssCaptured: M = !1
  } = e;
  let { needsMask: L } = e, { preserveWhiteSpace: T = !0 } = e;
  L || (L = gp(
    i,
    o,
    a,
    L === void 0
  ));
  const we = bp(i, {
    doc: t,
    mirror: r,
    blockClass: s,
    blockSelector: n,
    needsMask: L,
    inlineStylesheet: u,
    maskInputOptions: f,
    maskTextFn: c,
    maskInputFn: p,
    dataURLOptions: g,
    inlineImages: w,
    recordCanvas: h,
    keepIframeSrcFn: D,
    newlyAddedElement: V,
    cssCaptured: M
  });
  if (!we)
    return console.warn(i, "not serialized"), null;
  let be;
  r.hasNode(i) ? be = r.getId(i) : vp(we, d) || !T && we.type === k.Text && !we.textContent.replace(/^\s+|\s+$/gm, "").length ? be = Qi : be = lp();
  const S = Object.assign(we, { id: be });
  if (r.add(i, S), be === Qi)
    return null;
  v && v(i);
  let nr = !l;
  if (S.type === k.Element) {
    nr = nr && !S.needBlock, delete S.needBlock;
    const B = U.shadowRoot(i);
    B && vr(B) && (S.isShadowHost = !0);
  }
  if ((S.type === k.Document || S.type === k.Element) && nr) {
    d.headWhitespace && S.type === k.Element && S.tagName === "head" && (T = !1);
    const B = {
      doc: t,
      mirror: r,
      blockClass: s,
      blockSelector: n,
      needsMask: L,
      maskTextClass: o,
      maskTextSelector: a,
      skipChild: l,
      inlineStylesheet: u,
      maskInputOptions: f,
      maskTextFn: c,
      maskInputFn: p,
      slimDOMOptions: d,
      dataURLOptions: g,
      inlineImages: w,
      recordCanvas: h,
      preserveWhiteSpace: T,
      onSerialize: v,
      onIframeLoad: O,
      iframeLoadTimeout: m,
      onStylesheetLoad: y,
      stylesheetLoadTimeout: _,
      keepIframeSrcFn: D,
      cssCaptured: !1
    };
    if (!(S.type === k.Element && S.tagName === "textarea" && S.attributes.value !== void 0)) {
      S.type === k.Element && S.attributes._cssText !== void 0 && typeof S.attributes._cssText == "string" && (B.cssCaptured = !0);
      for (const lr of Array.from(U.childNodes(i))) {
        const ne = Ae(lr, B);
        ne && S.childNodes.push(ne);
      }
    }
    let ie = null;
    if (qo(i) && (ie = U.shadowRoot(i)))
      for (const lr of Array.from(U.childNodes(ie))) {
        const ne = Ae(lr, B);
        ne && (vr(ie) && (ne.isShadow = !0), S.childNodes.push(ne));
      }
  }
  const or = U.parentNode(i);
  return or && zc(or) && vr(or) && (S.isShadow = !0), S.type === k.Element && S.tagName === "iframe" && yp(
    i,
    () => {
      const B = i.contentDocument;
      if (B && O) {
        const ie = Ae(B, {
          doc: B,
          mirror: r,
          blockClass: s,
          blockSelector: n,
          needsMask: L,
          maskTextClass: o,
          maskTextSelector: a,
          skipChild: !1,
          inlineStylesheet: u,
          maskInputOptions: f,
          maskTextFn: c,
          maskInputFn: p,
          slimDOMOptions: d,
          dataURLOptions: g,
          inlineImages: w,
          recordCanvas: h,
          preserveWhiteSpace: T,
          onSerialize: v,
          onIframeLoad: O,
          iframeLoadTimeout: m,
          onStylesheetLoad: y,
          stylesheetLoadTimeout: _,
          keepIframeSrcFn: D
        });
        ie && O(
          i,
          ie
        );
      }
    },
    m
  ), S.type === k.Element && S.tagName === "link" && typeof S.attributes.rel == "string" && (S.attributes.rel === "stylesheet" || S.attributes.rel === "preload" && typeof S.attributes.href == "string" && el(S.attributes.href) === "css") && wp(
    i,
    () => {
      if (y) {
        const B = Ae(i, {
          doc: t,
          mirror: r,
          blockClass: s,
          blockSelector: n,
          needsMask: L,
          maskTextClass: o,
          maskTextSelector: a,
          skipChild: !1,
          inlineStylesheet: u,
          maskInputOptions: f,
          maskTextFn: c,
          maskInputFn: p,
          slimDOMOptions: d,
          dataURLOptions: g,
          inlineImages: w,
          recordCanvas: h,
          preserveWhiteSpace: T,
          onSerialize: v,
          onIframeLoad: O,
          iframeLoadTimeout: m,
          onStylesheetLoad: y,
          stylesheetLoadTimeout: _,
          keepIframeSrcFn: D
        });
        B && y(
          i,
          B
        );
      }
    },
    _
  ), S;
}
function xp(i, e) {
  const {
    mirror: t = new Jc(),
    blockClass: r = "rr-block",
    blockSelector: s = null,
    maskTextClass: n = "rr-mask",
    maskTextSelector: o = null,
    inlineStylesheet: a = !0,
    inlineImages: l = !1,
    recordCanvas: u = !1,
    maskAllInputs: f = !1,
    maskTextFn: c,
    maskInputFn: p,
    slimDOM: d = !1,
    dataURLOptions: g,
    preserveWhiteSpace: w,
    onSerialize: h,
    onIframeLoad: v,
    iframeLoadTimeout: O,
    onStylesheetLoad: m,
    stylesheetLoadTimeout: y,
    keepIframeSrcFn: _ = () => !1
  } = e || {};
  return Ae(i, {
    doc: i,
    mirror: t,
    blockClass: r,
    blockSelector: s,
    maskTextClass: n,
    maskTextSelector: o,
    skipChild: !1,
    inlineStylesheet: a,
    maskInputOptions: f === !0 ? {
      color: !0,
      date: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
      textarea: !0,
      select: !0,
      password: !0
    } : f === !1 ? {
      password: !0
    } : f,
    maskTextFn: c,
    maskInputFn: p,
    slimDOMOptions: d === !0 || d === "all" ? (
      // if true: set of sensible options that should not throw away any information
      {
        script: !0,
        comment: !0,
        headFavicon: !0,
        headWhitespace: !0,
        headMetaDescKeywords: d === "all",
        // destructive
        headMetaSocial: !0,
        headMetaRobots: !0,
        headMetaHttpEquiv: !0,
        headMetaAuthorship: !0,
        headMetaVerification: !0
      }
    ) : d === !1 ? {} : d,
    dataURLOptions: g,
    inlineImages: l,
    recordCanvas: u,
    preserveWhiteSpace: w,
    onSerialize: h,
    onIframeLoad: v,
    iframeLoadTimeout: O,
    onStylesheetLoad: m,
    stylesheetLoadTimeout: y,
    keepIframeSrcFn: _,
    newlyAddedElement: !1
  });
}
function Op(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function Ap(i) {
  if (i.__esModule) return i;
  var e = i.default;
  if (typeof e == "function") {
    var t = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(i).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(i, r);
    Object.defineProperty(t, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return i[r];
      }
    });
  }), t;
}
var Ks = { exports: {} }, E = String, tl = function() {
  return { isColorSupported: !1, reset: E, bold: E, dim: E, italic: E, underline: E, inverse: E, hidden: E, strikethrough: E, black: E, red: E, green: E, yellow: E, blue: E, magenta: E, cyan: E, white: E, gray: E, bgBlack: E, bgRed: E, bgGreen: E, bgYellow: E, bgBlue: E, bgMagenta: E, bgCyan: E, bgWhite: E };
};
Ks.exports = tl();
Ks.exports.createColors = tl;
var Rp = Ks.exports;
const Ep = {}, Ip = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ep
}, Symbol.toStringTag, { value: "Module" })), G = /* @__PURE__ */ Ap(Ip);
let tn = Rp, rn = G, us = class rl extends Error {
  constructor(e, t, r, s, n, o) {
    super(e), this.name = "CssSyntaxError", this.reason = e, n && (this.file = n), s && (this.source = s), o && (this.plugin = o), typeof t < "u" && typeof r < "u" && (typeof t == "number" ? (this.line = t, this.column = r) : (this.line = t.line, this.column = t.column, this.endLine = r.line, this.endColumn = r.column)), this.setMessage(), Error.captureStackTrace && Error.captureStackTrace(this, rl);
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "", this.message += this.file ? this.file : "<css input>", typeof this.line < "u" && (this.message += ":" + this.line + ":" + this.column), this.message += ": " + this.reason;
  }
  showSourceCode(e) {
    if (!this.source) return "";
    let t = this.source;
    e == null && (e = tn.isColorSupported), rn && e && (t = rn(t));
    let r = t.split(/\r?\n/), s = Math.max(this.line - 3, 0), n = Math.min(this.line + 2, r.length), o = String(n).length, a, l;
    if (e) {
      let { bold: u, gray: f, red: c } = tn.createColors(!0);
      a = (p) => u(c(p)), l = (p) => f(p);
    } else
      a = l = (u) => u;
    return r.slice(s, n).map((u, f) => {
      let c = s + 1 + f, p = " " + (" " + c).slice(-o) + " | ";
      if (c === this.line) {
        let d = l(p.replace(/\d/g, " ")) + u.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return a(">") + l(p) + u + `
 ` + d + a("^");
      }
      return " " + l(p) + u;
    }).join(`
`);
  }
  toString() {
    let e = this.showSourceCode();
    return e && (e = `

` + e + `
`), this.name + ": " + this.message + e;
  }
};
var Xs = us;
us.default = us;
var je = {};
je.isClean = Symbol("isClean");
je.my = Symbol("my");
const sn = {
  after: `
`,
  beforeClose: `
`,
  beforeComment: `
`,
  beforeDecl: `
`,
  beforeOpen: " ",
  beforeRule: `
`,
  colon: ": ",
  commentLeft: " ",
  commentRight: " ",
  emptyBody: "",
  indent: "    ",
  semicolon: !1
};
function Np(i) {
  return i[0].toUpperCase() + i.slice(1);
}
let fs = class {
  constructor(e) {
    this.builder = e;
  }
  atrule(e, t) {
    let r = "@" + e.name, s = e.params ? this.rawValue(e, "params") : "";
    if (typeof e.raws.afterName < "u" ? r += e.raws.afterName : s && (r += " "), e.nodes)
      this.block(e, r + s);
    else {
      let n = (e.raws.between || "") + (t ? ";" : "");
      this.builder(r + s + n, e);
    }
  }
  beforeAfter(e, t) {
    let r;
    e.type === "decl" ? r = this.raw(e, null, "beforeDecl") : e.type === "comment" ? r = this.raw(e, null, "beforeComment") : t === "before" ? r = this.raw(e, null, "beforeRule") : r = this.raw(e, null, "beforeClose");
    let s = e.parent, n = 0;
    for (; s && s.type !== "root"; )
      n += 1, s = s.parent;
    if (r.includes(`
`)) {
      let o = this.raw(e, null, "indent");
      if (o.length)
        for (let a = 0; a < n; a++) r += o;
    }
    return r;
  }
  block(e, t) {
    let r = this.raw(e, "between", "beforeOpen");
    this.builder(t + r + "{", e, "start");
    let s;
    e.nodes && e.nodes.length ? (this.body(e), s = this.raw(e, "after")) : s = this.raw(e, "after", "emptyBody"), s && this.builder(s), this.builder("}", e, "end");
  }
  body(e) {
    let t = e.nodes.length - 1;
    for (; t > 0 && e.nodes[t].type === "comment"; )
      t -= 1;
    let r = this.raw(e, "semicolon");
    for (let s = 0; s < e.nodes.length; s++) {
      let n = e.nodes[s], o = this.raw(n, "before");
      o && this.builder(o), this.stringify(n, t !== s || r);
    }
  }
  comment(e) {
    let t = this.raw(e, "left", "commentLeft"), r = this.raw(e, "right", "commentRight");
    this.builder("/*" + t + e.text + r + "*/", e);
  }
  decl(e, t) {
    let r = this.raw(e, "between", "colon"), s = e.prop + r + this.rawValue(e, "value");
    e.important && (s += e.raws.important || " !important"), t && (s += ";"), this.builder(s, e);
  }
  document(e) {
    this.body(e);
  }
  raw(e, t, r) {
    let s;
    if (r || (r = t), t && (s = e.raws[t], typeof s < "u"))
      return s;
    let n = e.parent;
    if (r === "before" && (!n || n.type === "root" && n.first === e || n && n.type === "document"))
      return "";
    if (!n) return sn[r];
    let o = e.root();
    if (o.rawCache || (o.rawCache = {}), typeof o.rawCache[r] < "u")
      return o.rawCache[r];
    if (r === "before" || r === "after")
      return this.beforeAfter(e, r);
    {
      let a = "raw" + Np(r);
      this[a] ? s = this[a](o, e) : o.walk((l) => {
        if (s = l.raws[t], typeof s < "u") return !1;
      });
    }
    return typeof s > "u" && (s = sn[r]), o.rawCache[r] = s, s;
  }
  rawBeforeClose(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length > 0 && typeof r.raws.after < "u")
        return t = r.raws.after, t.includes(`
`) && (t = t.replace(/[^\n]+$/, "")), !1;
    }), t && (t = t.replace(/\S/g, "")), t;
  }
  rawBeforeComment(e, t) {
    let r;
    return e.walkComments((s) => {
      if (typeof s.raws.before < "u")
        return r = s.raws.before, r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")), !1;
    }), typeof r > "u" ? r = this.raw(t, null, "beforeDecl") : r && (r = r.replace(/\S/g, "")), r;
  }
  rawBeforeDecl(e, t) {
    let r;
    return e.walkDecls((s) => {
      if (typeof s.raws.before < "u")
        return r = s.raws.before, r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")), !1;
    }), typeof r > "u" ? r = this.raw(t, null, "beforeRule") : r && (r = r.replace(/\S/g, "")), r;
  }
  rawBeforeOpen(e) {
    let t;
    return e.walk((r) => {
      if (r.type !== "decl" && (t = r.raws.between, typeof t < "u"))
        return !1;
    }), t;
  }
  rawBeforeRule(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && (r.parent !== e || e.first !== r) && typeof r.raws.before < "u")
        return t = r.raws.before, t.includes(`
`) && (t = t.replace(/[^\n]+$/, "")), !1;
    }), t && (t = t.replace(/\S/g, "")), t;
  }
  rawColon(e) {
    let t;
    return e.walkDecls((r) => {
      if (typeof r.raws.between < "u")
        return t = r.raws.between.replace(/[^\s:]/g, ""), !1;
    }), t;
  }
  rawEmptyBody(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length === 0 && (t = r.raws.after, typeof t < "u"))
        return !1;
    }), t;
  }
  rawIndent(e) {
    if (e.raws.indent) return e.raws.indent;
    let t;
    return e.walk((r) => {
      let s = r.parent;
      if (s && s !== e && s.parent && s.parent === e && typeof r.raws.before < "u") {
        let n = r.raws.before.split(`
`);
        return t = n[n.length - 1], t = t.replace(/\S/g, ""), !1;
      }
    }), t;
  }
  rawSemicolon(e) {
    let t;
    return e.walk((r) => {
      if (r.nodes && r.nodes.length && r.last.type === "decl" && (t = r.raws.semicolon, typeof t < "u"))
        return !1;
    }), t;
  }
  rawValue(e, t) {
    let r = e[t], s = e.raws[t];
    return s && s.value === r ? s.raw : r;
  }
  root(e) {
    this.body(e), e.raws.after && this.builder(e.raws.after);
  }
  rule(e) {
    this.block(e, this.rawValue(e, "selector")), e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, "end");
  }
  stringify(e, t) {
    if (!this[e.type])
      throw new Error(
        "Unknown AST node type " + e.type + ". Maybe you need to change PostCSS stringifier."
      );
    this[e.type](e, t);
  }
};
var sl = fs;
fs.default = fs;
let Pp = sl;
function hs(i, e) {
  new Pp(e).stringify(i);
}
var er = hs;
hs.default = hs;
let { isClean: pt, my: Mp } = je, _p = Xs, Lp = sl, kp = er;
function cs(i, e) {
  let t = new i.constructor();
  for (let r in i) {
    if (!Object.prototype.hasOwnProperty.call(i, r) || r === "proxyCache") continue;
    let s = i[r], n = typeof s;
    r === "parent" && n === "object" ? e && (t[r] = e) : r === "source" ? t[r] = s : Array.isArray(s) ? t[r] = s.map((o) => cs(o, t)) : (n === "object" && s !== null && (s = cs(s)), t[r] = s);
  }
  return t;
}
let ps = class {
  constructor(e = {}) {
    this.raws = {}, this[pt] = !1, this[Mp] = !0;
    for (let t in e)
      if (t === "nodes") {
        this.nodes = [];
        for (let r of e[t])
          typeof r.clone == "function" ? this.append(r.clone()) : this.append(r);
      } else
        this[t] = e[t];
  }
  addToError(e) {
    if (e.postcssNode = this, e.stack && this.source && /\n\s{4}at /.test(e.stack)) {
      let t = this.source;
      e.stack = e.stack.replace(
        /\n\s{4}at /,
        `$&${t.input.from}:${t.start.line}:${t.start.column}$&`
      );
    }
    return e;
  }
  after(e) {
    return this.parent.insertAfter(this, e), this;
  }
  assign(e = {}) {
    for (let t in e)
      this[t] = e[t];
    return this;
  }
  before(e) {
    return this.parent.insertBefore(this, e), this;
  }
  cleanRaws(e) {
    delete this.raws.before, delete this.raws.after, e || delete this.raws.between;
  }
  clone(e = {}) {
    let t = cs(this);
    for (let r in e)
      t[r] = e[r];
    return t;
  }
  cloneAfter(e = {}) {
    let t = this.clone(e);
    return this.parent.insertAfter(this, t), t;
  }
  cloneBefore(e = {}) {
    let t = this.clone(e);
    return this.parent.insertBefore(this, t), t;
  }
  error(e, t = {}) {
    if (this.source) {
      let { end: r, start: s } = this.rangeBy(t);
      return this.source.input.error(
        e,
        { column: s.column, line: s.line },
        { column: r.column, line: r.line },
        t
      );
    }
    return new _p(e);
  }
  getProxyProcessor() {
    return {
      get(e, t) {
        return t === "proxyOf" ? e : t === "root" ? () => e.root().toProxy() : e[t];
      },
      set(e, t, r) {
        return e[t] === r || (e[t] = r, (t === "prop" || t === "value" || t === "name" || t === "params" || t === "important" || /* c8 ignore next */
        t === "text") && e.markDirty()), !0;
      }
    };
  }
  markDirty() {
    if (this[pt]) {
      this[pt] = !1;
      let e = this;
      for (; e = e.parent; )
        e[pt] = !1;
    }
  }
  next() {
    if (!this.parent) return;
    let e = this.parent.index(this);
    return this.parent.nodes[e + 1];
  }
  positionBy(e, t) {
    let r = this.source.start;
    if (e.index)
      r = this.positionInside(e.index, t);
    else if (e.word) {
      t = this.toString();
      let s = t.indexOf(e.word);
      s !== -1 && (r = this.positionInside(s, t));
    }
    return r;
  }
  positionInside(e, t) {
    let r = t || this.toString(), s = this.source.start.column, n = this.source.start.line;
    for (let o = 0; o < e; o++)
      r[o] === `
` ? (s = 1, n += 1) : s += 1;
    return { column: s, line: n };
  }
  prev() {
    if (!this.parent) return;
    let e = this.parent.index(this);
    return this.parent.nodes[e - 1];
  }
  rangeBy(e) {
    let t = {
      column: this.source.start.column,
      line: this.source.start.line
    }, r = this.source.end ? {
      column: this.source.end.column + 1,
      line: this.source.end.line
    } : {
      column: t.column + 1,
      line: t.line
    };
    if (e.word) {
      let s = this.toString(), n = s.indexOf(e.word);
      n !== -1 && (t = this.positionInside(n, s), r = this.positionInside(n + e.word.length, s));
    } else
      e.start ? t = {
        column: e.start.column,
        line: e.start.line
      } : e.index && (t = this.positionInside(e.index)), e.end ? r = {
        column: e.end.column,
        line: e.end.line
      } : typeof e.endIndex == "number" ? r = this.positionInside(e.endIndex) : e.index && (r = this.positionInside(e.index + 1));
    return (r.line < t.line || r.line === t.line && r.column <= t.column) && (r = { column: t.column + 1, line: t.line }), { end: r, start: t };
  }
  raw(e, t) {
    return new Lp().raw(this, e, t);
  }
  remove() {
    return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
  }
  replaceWith(...e) {
    if (this.parent) {
      let t = this, r = !1;
      for (let s of e)
        s === this ? r = !0 : r ? (this.parent.insertAfter(t, s), t = s) : this.parent.insertBefore(t, s);
      r || this.remove();
    }
    return this;
  }
  root() {
    let e = this;
    for (; e.parent && e.parent.type !== "document"; )
      e = e.parent;
    return e;
  }
  toJSON(e, t) {
    let r = {}, s = t == null;
    t = t || /* @__PURE__ */ new Map();
    let n = 0;
    for (let o in this) {
      if (!Object.prototype.hasOwnProperty.call(this, o) || o === "parent" || o === "proxyCache") continue;
      let a = this[o];
      if (Array.isArray(a))
        r[o] = a.map((l) => typeof l == "object" && l.toJSON ? l.toJSON(null, t) : l);
      else if (typeof a == "object" && a.toJSON)
        r[o] = a.toJSON(null, t);
      else if (o === "source") {
        let l = t.get(a.input);
        l == null && (l = n, t.set(a.input, n), n++), r[o] = {
          end: a.end,
          inputId: l,
          start: a.start
        };
      } else
        r[o] = a;
    }
    return s && (r.inputs = [...t.keys()].map((o) => o.toJSON())), r;
  }
  toProxy() {
    return this.proxyCache || (this.proxyCache = new Proxy(this, this.getProxyProcessor())), this.proxyCache;
  }
  toString(e = kp) {
    e.stringify && (e = e.stringify);
    let t = "";
    return e(this, (r) => {
      t += r;
    }), t;
  }
  warn(e, t, r) {
    let s = { node: this };
    for (let n in r) s[n] = r[n];
    return e.warn(t, s);
  }
  get proxyOf() {
    return this;
  }
};
var tr = ps;
ps.default = ps;
let Dp = tr, ds = class extends Dp {
  constructor(e) {
    e && typeof e.value < "u" && typeof e.value != "string" && (e = { ...e, value: String(e.value) }), super(e), this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};
var rr = ds;
ds.default = ds;
let Up = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Tp = (i, e = 21) => (t = e) => {
  let r = "", s = t;
  for (; s--; )
    r += i[Math.random() * i.length | 0];
  return r;
}, Bp = (i = 21) => {
  let e = "", t = i;
  for (; t--; )
    e += Up[Math.random() * 64 | 0];
  return e;
};
var Fp = { nanoid: Bp, customAlphabet: Tp };
let { SourceMapConsumer: nn, SourceMapGenerator: on } = G, { existsSync: zp, readFileSync: Wp } = G, { dirname: Or, join: jp } = G;
function Gp(i) {
  return Buffer ? Buffer.from(i, "base64").toString() : window.atob(i);
}
let ms = class {
  constructor(e, t) {
    if (t.map === !1) return;
    this.loadAnnotation(e), this.inline = this.startWith(this.annotation, "data:");
    let r = t.map ? t.map.prev : void 0, s = this.loadMap(t.from, r);
    !this.mapFile && t.from && (this.mapFile = t.from), this.mapFile && (this.root = Or(this.mapFile)), s && (this.text = s);
  }
  consumer() {
    return this.consumerCache || (this.consumerCache = new nn(this.text)), this.consumerCache;
  }
  decodeInline(e) {
    let t = /^data:application\/json;charset=utf-?8;base64,/, r = /^data:application\/json;base64,/, s = /^data:application\/json;charset=utf-?8,/, n = /^data:application\/json,/;
    if (s.test(e) || n.test(e))
      return decodeURIComponent(e.substr(RegExp.lastMatch.length));
    if (t.test(e) || r.test(e))
      return Gp(e.substr(RegExp.lastMatch.length));
    let o = e.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + o);
  }
  getAnnotationURL(e) {
    return e.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  isMap(e) {
    return typeof e != "object" ? !1 : typeof e.mappings == "string" || typeof e._mappings == "string" || Array.isArray(e.sections);
  }
  loadAnnotation(e) {
    let t = e.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!t) return;
    let r = e.lastIndexOf(t.pop()), s = e.indexOf("*/", r);
    r > -1 && s > -1 && (this.annotation = this.getAnnotationURL(e.substring(r, s)));
  }
  loadFile(e) {
    if (this.root = Or(e), zp(e))
      return this.mapFile = e, Wp(e, "utf-8").toString().trim();
  }
  loadMap(e, t) {
    if (t === !1) return !1;
    if (t) {
      if (typeof t == "string")
        return t;
      if (typeof t == "function") {
        let r = t(e);
        if (r) {
          let s = this.loadFile(r);
          if (!s)
            throw new Error(
              "Unable to load previous source map: " + r.toString()
            );
          return s;
        }
      } else {
        if (t instanceof nn)
          return on.fromSourceMap(t).toString();
        if (t instanceof on)
          return t.toString();
        if (this.isMap(t))
          return JSON.stringify(t);
        throw new Error(
          "Unsupported previous source map format: " + t.toString()
        );
      }
    } else {
      if (this.inline)
        return this.decodeInline(this.annotation);
      if (this.annotation) {
        let r = this.annotation;
        return e && (r = jp(Or(e), r)), this.loadFile(r);
      }
    }
  }
  startWith(e, t) {
    return e ? e.substr(0, t.length) === t : !1;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
};
var il = ms;
ms.default = ms;
let { SourceMapConsumer: Vp, SourceMapGenerator: Yp } = G, { fileURLToPath: ln, pathToFileURL: dt } = G, { isAbsolute: gs, resolve: ys } = G, { nanoid: Zp } = Fp, Ar = G, an = Xs, Jp = il, Rr = Symbol("fromOffsetCache"), Hp = !!(Vp && Yp), un = !!(ys && gs), Bt = class {
  constructor(e, t = {}) {
    if (e === null || typeof e > "u" || typeof e == "object" && !e.toString)
      throw new Error(`PostCSS received ${e} instead of CSS string`);
    if (this.css = e.toString(), this.css[0] === "\uFEFF" || this.css[0] === "￾" ? (this.hasBOM = !0, this.css = this.css.slice(1)) : this.hasBOM = !1, t.from && (!un || /^\w+:\/\//.test(t.from) || gs(t.from) ? this.file = t.from : this.file = ys(t.from)), un && Hp) {
      let r = new Jp(this.css, t);
      if (r.text) {
        this.map = r;
        let s = r.consumer().file;
        !this.file && s && (this.file = this.mapResolve(s));
      }
    }
    this.file || (this.id = "<input css " + Zp(6) + ">"), this.map && (this.map.file = this.from);
  }
  error(e, t, r, s = {}) {
    let n, o, a;
    if (t && typeof t == "object") {
      let u = t, f = r;
      if (typeof u.offset == "number") {
        let c = this.fromOffset(u.offset);
        t = c.line, r = c.col;
      } else
        t = u.line, r = u.column;
      if (typeof f.offset == "number") {
        let c = this.fromOffset(f.offset);
        o = c.line, a = c.col;
      } else
        o = f.line, a = f.column;
    } else if (!r) {
      let u = this.fromOffset(t);
      t = u.line, r = u.col;
    }
    let l = this.origin(t, r, o, a);
    return l ? n = new an(
      e,
      l.endLine === void 0 ? l.line : { column: l.column, line: l.line },
      l.endLine === void 0 ? l.column : { column: l.endColumn, line: l.endLine },
      l.source,
      l.file,
      s.plugin
    ) : n = new an(
      e,
      o === void 0 ? t : { column: r, line: t },
      o === void 0 ? r : { column: a, line: o },
      this.css,
      this.file,
      s.plugin
    ), n.input = { column: r, endColumn: a, endLine: o, line: t, source: this.css }, this.file && (dt && (n.input.url = dt(this.file).toString()), n.input.file = this.file), n;
  }
  fromOffset(e) {
    let t, r;
    if (this[Rr])
      r = this[Rr];
    else {
      let n = this.css.split(`
`);
      r = new Array(n.length);
      let o = 0;
      for (let a = 0, l = n.length; a < l; a++)
        r[a] = o, o += n[a].length + 1;
      this[Rr] = r;
    }
    t = r[r.length - 1];
    let s = 0;
    if (e >= t)
      s = r.length - 1;
    else {
      let n = r.length - 2, o;
      for (; s < n; )
        if (o = s + (n - s >> 1), e < r[o])
          n = o - 1;
        else if (e >= r[o + 1])
          s = o + 1;
        else {
          s = o;
          break;
        }
    }
    return {
      col: e - r[s] + 1,
      line: s + 1
    };
  }
  mapResolve(e) {
    return /^\w+:\/\//.test(e) ? e : ys(this.map.consumer().sourceRoot || this.map.root || ".", e);
  }
  origin(e, t, r, s) {
    if (!this.map) return !1;
    let n = this.map.consumer(), o = n.originalPositionFor({ column: t, line: e });
    if (!o.source) return !1;
    let a;
    typeof r == "number" && (a = n.originalPositionFor({ column: s, line: r }));
    let l;
    gs(o.source) ? l = dt(o.source) : l = new URL(
      o.source,
      this.map.consumer().sourceRoot || dt(this.map.mapFile)
    );
    let u = {
      column: o.column,
      endColumn: a && a.column,
      endLine: a && a.line,
      line: o.line,
      url: l.toString()
    };
    if (l.protocol === "file:")
      if (ln)
        u.file = ln(l);
      else
        throw new Error("file: protocol is not available in this PostCSS build");
    let f = n.sourceContentFor(o.source);
    return f && (u.source = f), u;
  }
  toJSON() {
    let e = {};
    for (let t of ["hasBOM", "css", "file", "id"])
      this[t] != null && (e[t] = this[t]);
    return this.map && (e.map = { ...this.map }, e.map.consumerCache && (e.map.consumerCache = void 0)), e;
  }
  get from() {
    return this.file || this.id;
  }
};
var sr = Bt;
Bt.default = Bt;
Ar && Ar.registerInput && Ar.registerInput(Bt);
let { SourceMapConsumer: nl, SourceMapGenerator: Rt } = G, { dirname: Et, relative: ol, resolve: ll, sep: al } = G, { pathToFileURL: fn } = G, Kp = sr, Xp = !!(nl && Rt), Qp = !!(Et && ll && ol && al), qp = class {
  constructor(e, t, r, s) {
    this.stringify = e, this.mapOpts = r.map || {}, this.root = t, this.opts = r, this.css = s, this.originalCSS = s, this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute, this.memoizedFileURLs = /* @__PURE__ */ new Map(), this.memoizedPaths = /* @__PURE__ */ new Map(), this.memoizedURLs = /* @__PURE__ */ new Map();
  }
  addAnnotation() {
    let e;
    this.isInline() ? e = "data:application/json;base64," + this.toBase64(this.map.toString()) : typeof this.mapOpts.annotation == "string" ? e = this.mapOpts.annotation : typeof this.mapOpts.annotation == "function" ? e = this.mapOpts.annotation(this.opts.to, this.root) : e = this.outputFile() + ".map";
    let t = `
`;
    this.css.includes(`\r
`) && (t = `\r
`), this.css += t + "/*# sourceMappingURL=" + e + " */";
  }
  applyPrevMaps() {
    for (let e of this.previous()) {
      let t = this.toUrl(this.path(e.file)), r = e.root || Et(e.file), s;
      this.mapOpts.sourcesContent === !1 ? (s = new nl(e.text), s.sourcesContent && (s.sourcesContent = null)) : s = e.consumer(), this.map.applySourceMap(s, t, this.toUrl(this.path(r)));
    }
  }
  clearAnnotation() {
    if (this.mapOpts.annotation !== !1)
      if (this.root) {
        let e;
        for (let t = this.root.nodes.length - 1; t >= 0; t--)
          e = this.root.nodes[t], e.type === "comment" && e.text.indexOf("# sourceMappingURL=") === 0 && this.root.removeChild(t);
      } else this.css && (this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, ""));
  }
  generate() {
    if (this.clearAnnotation(), Qp && Xp && this.isMap())
      return this.generateMap();
    {
      let e = "";
      return this.stringify(this.root, (t) => {
        e += t;
      }), [e];
    }
  }
  generateMap() {
    if (this.root)
      this.generateString();
    else if (this.previous().length === 1) {
      let e = this.previous()[0].consumer();
      e.file = this.outputFile(), this.map = Rt.fromSourceMap(e, {
        ignoreInvalidMapping: !0
      });
    } else
      this.map = new Rt({
        file: this.outputFile(),
        ignoreInvalidMapping: !0
      }), this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
      });
    return this.isSourcesContent() && this.setSourcesContent(), this.root && this.previous().length > 0 && this.applyPrevMaps(), this.isAnnotation() && this.addAnnotation(), this.isInline() ? [this.css] : [this.css, this.map];
  }
  generateString() {
    this.css = "", this.map = new Rt({
      file: this.outputFile(),
      ignoreInvalidMapping: !0
    });
    let e = 1, t = 1, r = "<no source>", s = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ""
    }, n, o;
    this.stringify(this.root, (a, l, u) => {
      if (this.css += a, l && u !== "end" && (s.generated.line = e, s.generated.column = t - 1, l.source && l.source.start ? (s.source = this.sourcePath(l), s.original.line = l.source.start.line, s.original.column = l.source.start.column - 1, this.map.addMapping(s)) : (s.source = r, s.original.line = 1, s.original.column = 0, this.map.addMapping(s))), n = a.match(/\n/g), n ? (e += n.length, o = a.lastIndexOf(`
`), t = a.length - o) : t += a.length, l && u !== "start") {
        let f = l.parent || { raws: {} };
        (!(l.type === "decl" || l.type === "atrule" && !l.nodes) || l !== f.last || f.raws.semicolon) && (l.source && l.source.end ? (s.source = this.sourcePath(l), s.original.line = l.source.end.line, s.original.column = l.source.end.column - 1, s.generated.line = e, s.generated.column = t - 2, this.map.addMapping(s)) : (s.source = r, s.original.line = 1, s.original.column = 0, s.generated.line = e, s.generated.column = t - 1, this.map.addMapping(s)));
      }
    });
  }
  isAnnotation() {
    return this.isInline() ? !0 : typeof this.mapOpts.annotation < "u" ? this.mapOpts.annotation : this.previous().length ? this.previous().some((e) => e.annotation) : !0;
  }
  isInline() {
    if (typeof this.mapOpts.inline < "u")
      return this.mapOpts.inline;
    let e = this.mapOpts.annotation;
    return typeof e < "u" && e !== !0 ? !1 : this.previous().length ? this.previous().some((t) => t.inline) : !0;
  }
  isMap() {
    return typeof this.opts.map < "u" ? !!this.opts.map : this.previous().length > 0;
  }
  isSourcesContent() {
    return typeof this.mapOpts.sourcesContent < "u" ? this.mapOpts.sourcesContent : this.previous().length ? this.previous().some((e) => e.withContent()) : !0;
  }
  outputFile() {
    return this.opts.to ? this.path(this.opts.to) : this.opts.from ? this.path(this.opts.from) : "to.css";
  }
  path(e) {
    if (this.mapOpts.absolute || e.charCodeAt(0) === 60 || /^\w+:\/\//.test(e)) return e;
    let t = this.memoizedPaths.get(e);
    if (t) return t;
    let r = this.opts.to ? Et(this.opts.to) : ".";
    typeof this.mapOpts.annotation == "string" && (r = Et(ll(r, this.mapOpts.annotation)));
    let s = ol(r, e);
    return this.memoizedPaths.set(e, s), s;
  }
  previous() {
    if (!this.previousMaps)
      if (this.previousMaps = [], this.root)
        this.root.walk((e) => {
          if (e.source && e.source.input.map) {
            let t = e.source.input.map;
            this.previousMaps.includes(t) || this.previousMaps.push(t);
          }
        });
      else {
        let e = new Kp(this.originalCSS, this.opts);
        e.map && this.previousMaps.push(e.map);
      }
    return this.previousMaps;
  }
  setSourcesContent() {
    let e = {};
    if (this.root)
      this.root.walk((t) => {
        if (t.source) {
          let r = t.source.input.from;
          if (r && !e[r]) {
            e[r] = !0;
            let s = this.usesFileUrls ? this.toFileUrl(r) : this.toUrl(this.path(r));
            this.map.setSourceContent(s, t.source.input.css);
          }
        }
      });
    else if (this.css) {
      let t = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(t, this.css);
    }
  }
  sourcePath(e) {
    return this.mapOpts.from ? this.toUrl(this.mapOpts.from) : this.usesFileUrls ? this.toFileUrl(e.source.input.from) : this.toUrl(this.path(e.source.input.from));
  }
  toBase64(e) {
    return Buffer ? Buffer.from(e).toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  }
  toFileUrl(e) {
    let t = this.memoizedFileURLs.get(e);
    if (t) return t;
    if (fn) {
      let r = fn(e).toString();
      return this.memoizedFileURLs.set(e, r), r;
    } else
      throw new Error(
        "`map.absolute` option is not available in this PostCSS build"
      );
  }
  toUrl(e) {
    let t = this.memoizedURLs.get(e);
    if (t) return t;
    al === "\\" && (e = e.replace(/\\/g, "/"));
    let r = encodeURI(e).replace(/[#?]/g, encodeURIComponent);
    return this.memoizedURLs.set(e, r), r;
  }
};
var ul = qp;
let ed = tr, ws = class extends ed {
  constructor(e) {
    super(e), this.type = "comment";
  }
};
var ir = ws;
ws.default = ws;
let { isClean: fl, my: hl } = je, cl = rr, pl = ir, td = tr, dl, Qs, qs, ml;
function gl(i) {
  return i.map((e) => (e.nodes && (e.nodes = gl(e.nodes)), delete e.source, e));
}
function yl(i) {
  if (i[fl] = !1, i.proxyOf.nodes)
    for (let e of i.proxyOf.nodes)
      yl(e);
}
let X = class wl extends td {
  append(...e) {
    for (let t of e) {
      let r = this.normalize(t, this.last);
      for (let s of r) this.proxyOf.nodes.push(s);
    }
    return this.markDirty(), this;
  }
  cleanRaws(e) {
    if (super.cleanRaws(e), this.nodes)
      for (let t of this.nodes) t.cleanRaws(e);
  }
  each(e) {
    if (!this.proxyOf.nodes) return;
    let t = this.getIterator(), r, s;
    for (; this.indexes[t] < this.proxyOf.nodes.length && (r = this.indexes[t], s = e(this.proxyOf.nodes[r], r), s !== !1); )
      this.indexes[t] += 1;
    return delete this.indexes[t], s;
  }
  every(e) {
    return this.nodes.every(e);
  }
  getIterator() {
    this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
    let e = this.lastEach;
    return this.indexes[e] = 0, e;
  }
  getProxyProcessor() {
    return {
      get(e, t) {
        return t === "proxyOf" ? e : e[t] ? t === "each" || typeof t == "string" && t.startsWith("walk") ? (...r) => e[t](
          ...r.map((s) => typeof s == "function" ? (n, o) => s(n.toProxy(), o) : s)
        ) : t === "every" || t === "some" ? (r) => e[t](
          (s, ...n) => r(s.toProxy(), ...n)
        ) : t === "root" ? () => e.root().toProxy() : t === "nodes" ? e.nodes.map((r) => r.toProxy()) : t === "first" || t === "last" ? e[t].toProxy() : e[t] : e[t];
      },
      set(e, t, r) {
        return e[t] === r || (e[t] = r, (t === "name" || t === "params" || t === "selector") && e.markDirty()), !0;
      }
    };
  }
  index(e) {
    return typeof e == "number" ? e : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
  }
  insertAfter(e, t) {
    let r = this.index(e), s = this.normalize(t, this.proxyOf.nodes[r]).reverse();
    r = this.index(e);
    for (let o of s) this.proxyOf.nodes.splice(r + 1, 0, o);
    let n;
    for (let o in this.indexes)
      n = this.indexes[o], r < n && (this.indexes[o] = n + s.length);
    return this.markDirty(), this;
  }
  insertBefore(e, t) {
    let r = this.index(e), s = r === 0 ? "prepend" : !1, n = this.normalize(t, this.proxyOf.nodes[r], s).reverse();
    r = this.index(e);
    for (let a of n) this.proxyOf.nodes.splice(r, 0, a);
    let o;
    for (let a in this.indexes)
      o = this.indexes[a], r <= o && (this.indexes[a] = o + n.length);
    return this.markDirty(), this;
  }
  normalize(e, t) {
    if (typeof e == "string")
      e = gl(dl(e).nodes);
    else if (typeof e > "u")
      e = [];
    else if (Array.isArray(e)) {
      e = e.slice(0);
      for (let s of e)
        s.parent && s.parent.removeChild(s, "ignore");
    } else if (e.type === "root" && this.type !== "document") {
      e = e.nodes.slice(0);
      for (let s of e)
        s.parent && s.parent.removeChild(s, "ignore");
    } else if (e.type)
      e = [e];
    else if (e.prop) {
      if (typeof e.value > "u")
        throw new Error("Value field is missed in node creation");
      typeof e.value != "string" && (e.value = String(e.value)), e = [new cl(e)];
    } else if (e.selector)
      e = [new Qs(e)];
    else if (e.name)
      e = [new qs(e)];
    else if (e.text)
      e = [new pl(e)];
    else
      throw new Error("Unknown node type in node creation");
    return e.map((s) => (s[hl] || wl.rebuild(s), s = s.proxyOf, s.parent && s.parent.removeChild(s), s[fl] && yl(s), typeof s.raws.before > "u" && t && typeof t.raws.before < "u" && (s.raws.before = t.raws.before.replace(/\S/g, "")), s.parent = this.proxyOf, s));
  }
  prepend(...e) {
    e = e.reverse();
    for (let t of e) {
      let r = this.normalize(t, this.first, "prepend").reverse();
      for (let s of r) this.proxyOf.nodes.unshift(s);
      for (let s in this.indexes)
        this.indexes[s] = this.indexes[s] + r.length;
    }
    return this.markDirty(), this;
  }
  push(e) {
    return e.parent = this, this.proxyOf.nodes.push(e), this;
  }
  removeAll() {
    for (let e of this.proxyOf.nodes) e.parent = void 0;
    return this.proxyOf.nodes = [], this.markDirty(), this;
  }
  removeChild(e) {
    e = this.index(e), this.proxyOf.nodes[e].parent = void 0, this.proxyOf.nodes.splice(e, 1);
    let t;
    for (let r in this.indexes)
      t = this.indexes[r], t >= e && (this.indexes[r] = t - 1);
    return this.markDirty(), this;
  }
  replaceValues(e, t, r) {
    return r || (r = t, t = {}), this.walkDecls((s) => {
      t.props && !t.props.includes(s.prop) || t.fast && !s.value.includes(t.fast) || (s.value = s.value.replace(e, r));
    }), this.markDirty(), this;
  }
  some(e) {
    return this.nodes.some(e);
  }
  walk(e) {
    return this.each((t, r) => {
      let s;
      try {
        s = e(t, r);
      } catch (n) {
        throw t.addToError(n);
      }
      return s !== !1 && t.walk && (s = t.walk(e)), s;
    });
  }
  walkAtRules(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "atrule" && e.test(r.name))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "atrule" && r.name === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "atrule")
        return t(r, s);
    }));
  }
  walkComments(e) {
    return this.walk((t, r) => {
      if (t.type === "comment")
        return e(t, r);
    });
  }
  walkDecls(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "decl" && e.test(r.prop))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "decl" && r.prop === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "decl")
        return t(r, s);
    }));
  }
  walkRules(e, t) {
    return t ? e instanceof RegExp ? this.walk((r, s) => {
      if (r.type === "rule" && e.test(r.selector))
        return t(r, s);
    }) : this.walk((r, s) => {
      if (r.type === "rule" && r.selector === e)
        return t(r, s);
    }) : (t = e, this.walk((r, s) => {
      if (r.type === "rule")
        return t(r, s);
    }));
  }
  get first() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[0];
  }
  get last() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
};
X.registerParse = (i) => {
  dl = i;
};
X.registerRule = (i) => {
  Qs = i;
};
X.registerAtRule = (i) => {
  qs = i;
};
X.registerRoot = (i) => {
  ml = i;
};
var se = X;
X.default = X;
X.rebuild = (i) => {
  i.type === "atrule" ? Object.setPrototypeOf(i, qs.prototype) : i.type === "rule" ? Object.setPrototypeOf(i, Qs.prototype) : i.type === "decl" ? Object.setPrototypeOf(i, cl.prototype) : i.type === "comment" ? Object.setPrototypeOf(i, pl.prototype) : i.type === "root" && Object.setPrototypeOf(i, ml.prototype), i[hl] = !0, i.nodes && i.nodes.forEach((e) => {
    X.rebuild(e);
  });
};
let rd = se, bl, Cl, ke = class extends rd {
  constructor(e) {
    super({ type: "document", ...e }), this.nodes || (this.nodes = []);
  }
  toResult(e = {}) {
    return new bl(new Cl(), this, e).stringify();
  }
};
ke.registerLazyResult = (i) => {
  bl = i;
};
ke.registerProcessor = (i) => {
  Cl = i;
};
var ei = ke;
ke.default = ke;
let hn = {};
var $l = function(e) {
  hn[e] || (hn[e] = !0, typeof console < "u" && console.warn && console.warn(e));
};
let bs = class {
  constructor(e, t = {}) {
    if (this.type = "warning", this.text = e, t.node && t.node.source) {
      let r = t.node.rangeBy(t);
      this.line = r.start.line, this.column = r.start.column, this.endLine = r.end.line, this.endColumn = r.end.column;
    }
    for (let r in t) this[r] = t[r];
  }
  toString() {
    return this.node ? this.node.error(this.text, {
      index: this.index,
      plugin: this.plugin,
      word: this.word
    }).message : this.plugin ? this.plugin + ": " + this.text : this.text;
  }
};
var Sl = bs;
bs.default = bs;
let sd = Sl, Cs = class {
  constructor(e, t, r) {
    this.processor = e, this.messages = [], this.root = t, this.opts = r, this.css = void 0, this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(e, t = {}) {
    t.plugin || this.lastPlugin && this.lastPlugin.postcssPlugin && (t.plugin = this.lastPlugin.postcssPlugin);
    let r = new sd(e, t);
    return this.messages.push(r), r;
  }
  warnings() {
    return this.messages.filter((e) => e.type === "warning");
  }
  get content() {
    return this.css;
  }
};
var ti = Cs;
Cs.default = Cs;
const Er = 39, cn = 34, mt = 92, pn = 47, gt = 10, xe = 32, yt = 12, wt = 9, bt = 13, id = 91, nd = 93, od = 40, ld = 41, ad = 123, ud = 125, fd = 59, hd = 42, cd = 58, pd = 64, Ct = /[\t\n\f\r "#'()/;[\\\]{}]/g, $t = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g, dd = /.[\r\n"'(/\\]/, dn = /[\da-f]/i;
var md = function(e, t = {}) {
  let r = e.css.valueOf(), s = t.ignoreErrors, n, o, a, l, u, f, c, p, d, g, w = r.length, h = 0, v = [], O = [];
  function m() {
    return h;
  }
  function y(M) {
    throw e.error("Unclosed " + M, h);
  }
  function _() {
    return O.length === 0 && h >= w;
  }
  function D(M) {
    if (O.length) return O.pop();
    if (h >= w) return;
    let L = M ? M.ignoreUnclosed : !1;
    switch (n = r.charCodeAt(h), n) {
      case gt:
      case xe:
      case wt:
      case bt:
      case yt: {
        o = h;
        do
          o += 1, n = r.charCodeAt(o);
        while (n === xe || n === gt || n === wt || n === bt || n === yt);
        g = ["space", r.slice(h, o)], h = o - 1;
        break;
      }
      case id:
      case nd:
      case ad:
      case ud:
      case cd:
      case fd:
      case ld: {
        let T = String.fromCharCode(n);
        g = [T, T, h];
        break;
      }
      case od: {
        if (p = v.length ? v.pop()[1] : "", d = r.charCodeAt(h + 1), p === "url" && d !== Er && d !== cn && d !== xe && d !== gt && d !== wt && d !== yt && d !== bt) {
          o = h;
          do {
            if (f = !1, o = r.indexOf(")", o + 1), o === -1)
              if (s || L) {
                o = h;
                break;
              } else
                y("bracket");
            for (c = o; r.charCodeAt(c - 1) === mt; )
              c -= 1, f = !f;
          } while (f);
          g = ["brackets", r.slice(h, o + 1), h, o], h = o;
        } else
          o = r.indexOf(")", h + 1), l = r.slice(h, o + 1), o === -1 || dd.test(l) ? g = ["(", "(", h] : (g = ["brackets", l, h, o], h = o);
        break;
      }
      case Er:
      case cn: {
        a = n === Er ? "'" : '"', o = h;
        do {
          if (f = !1, o = r.indexOf(a, o + 1), o === -1)
            if (s || L) {
              o = h + 1;
              break;
            } else
              y("string");
          for (c = o; r.charCodeAt(c - 1) === mt; )
            c -= 1, f = !f;
        } while (f);
        g = ["string", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      case pd: {
        Ct.lastIndex = h + 1, Ct.test(r), Ct.lastIndex === 0 ? o = r.length - 1 : o = Ct.lastIndex - 2, g = ["at-word", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      case mt: {
        for (o = h, u = !0; r.charCodeAt(o + 1) === mt; )
          o += 1, u = !u;
        if (n = r.charCodeAt(o + 1), u && n !== pn && n !== xe && n !== gt && n !== wt && n !== bt && n !== yt && (o += 1, dn.test(r.charAt(o)))) {
          for (; dn.test(r.charAt(o + 1)); )
            o += 1;
          r.charCodeAt(o + 1) === xe && (o += 1);
        }
        g = ["word", r.slice(h, o + 1), h, o], h = o;
        break;
      }
      default: {
        n === pn && r.charCodeAt(h + 1) === hd ? (o = r.indexOf("*/", h + 2) + 1, o === 0 && (s || L ? o = r.length : y("comment")), g = ["comment", r.slice(h, o + 1), h, o], h = o) : ($t.lastIndex = h + 1, $t.test(r), $t.lastIndex === 0 ? o = r.length - 1 : o = $t.lastIndex - 2, g = ["word", r.slice(h, o + 1), h, o], v.push(g), h = o);
        break;
      }
    }
    return h++, g;
  }
  function V(M) {
    O.push(M);
  }
  return {
    back: V,
    endOfFile: _,
    nextToken: D,
    position: m
  };
};
let vl = se, Ft = class extends vl {
  constructor(e) {
    super(e), this.type = "atrule";
  }
  append(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
  }
  prepend(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
  }
};
var ri = Ft;
Ft.default = Ft;
vl.registerAtRule(Ft);
let xl = se, Ol, Al, me = class extends xl {
  constructor(e) {
    super(e), this.type = "root", this.nodes || (this.nodes = []);
  }
  normalize(e, t, r) {
    let s = super.normalize(e);
    if (t) {
      if (r === "prepend")
        this.nodes.length > 1 ? t.raws.before = this.nodes[1].raws.before : delete t.raws.before;
      else if (this.first !== t)
        for (let n of s)
          n.raws.before = t.raws.before;
    }
    return s;
  }
  removeChild(e, t) {
    let r = this.index(e);
    return !t && r === 0 && this.nodes.length > 1 && (this.nodes[1].raws.before = this.nodes[r].raws.before), super.removeChild(e);
  }
  toResult(e = {}) {
    return new Ol(new Al(), this, e).stringify();
  }
};
me.registerLazyResult = (i) => {
  Ol = i;
};
me.registerProcessor = (i) => {
  Al = i;
};
var Ge = me;
me.default = me;
xl.registerRoot(me);
let De = {
  comma(i) {
    return De.split(i, [","], !0);
  },
  space(i) {
    let e = [" ", `
`, "	"];
    return De.split(i, e);
  },
  split(i, e, t) {
    let r = [], s = "", n = !1, o = 0, a = !1, l = "", u = !1;
    for (let f of i)
      u ? u = !1 : f === "\\" ? u = !0 : a ? f === l && (a = !1) : f === '"' || f === "'" ? (a = !0, l = f) : f === "(" ? o += 1 : f === ")" ? o > 0 && (o -= 1) : o === 0 && e.includes(f) && (n = !0), n ? (s !== "" && r.push(s.trim()), s = "", n = !1) : s += f;
    return (t || s !== "") && r.push(s.trim()), r;
  }
};
var Rl = De;
De.default = De;
let El = se, gd = Rl, zt = class extends El {
  constructor(e) {
    super(e), this.type = "rule", this.nodes || (this.nodes = []);
  }
  get selectors() {
    return gd.comma(this.selector);
  }
  set selectors(e) {
    let t = this.selector ? this.selector.match(/,\s*/) : null, r = t ? t[0] : "," + this.raw("between", "beforeOpen");
    this.selector = e.join(r);
  }
};
var si = zt;
zt.default = zt;
El.registerRule(zt);
let yd = rr, wd = md, bd = ir, Cd = ri, $d = Ge, mn = si;
const gn = {
  empty: !0,
  space: !0
};
function Sd(i) {
  for (let e = i.length - 1; e >= 0; e--) {
    let t = i[e], r = t[3] || t[2];
    if (r) return r;
  }
}
let vd = class {
  constructor(e) {
    this.input = e, this.root = new $d(), this.current = this.root, this.spaces = "", this.semicolon = !1, this.createTokenizer(), this.root.source = { input: e, start: { column: 1, line: 1, offset: 0 } };
  }
  atrule(e) {
    let t = new Cd();
    t.name = e[1].slice(1), t.name === "" && this.unnamedAtrule(t, e), this.init(t, e[2]);
    let r, s, n, o = !1, a = !1, l = [], u = [];
    for (; !this.tokenizer.endOfFile(); ) {
      if (e = this.tokenizer.nextToken(), r = e[0], r === "(" || r === "[" ? u.push(r === "(" ? ")" : "]") : r === "{" && u.length > 0 ? u.push("}") : r === u[u.length - 1] && u.pop(), u.length === 0)
        if (r === ";") {
          t.source.end = this.getPosition(e[2]), t.source.end.offset++, this.semicolon = !0;
          break;
        } else if (r === "{") {
          a = !0;
          break;
        } else if (r === "}") {
          if (l.length > 0) {
            for (n = l.length - 1, s = l[n]; s && s[0] === "space"; )
              s = l[--n];
            s && (t.source.end = this.getPosition(s[3] || s[2]), t.source.end.offset++);
          }
          this.end(e);
          break;
        } else
          l.push(e);
      else
        l.push(e);
      if (this.tokenizer.endOfFile()) {
        o = !0;
        break;
      }
    }
    t.raws.between = this.spacesAndCommentsFromEnd(l), l.length ? (t.raws.afterName = this.spacesAndCommentsFromStart(l), this.raw(t, "params", l), o && (e = l[l.length - 1], t.source.end = this.getPosition(e[3] || e[2]), t.source.end.offset++, this.spaces = t.raws.between, t.raws.between = "")) : (t.raws.afterName = "", t.params = ""), a && (t.nodes = [], this.current = t);
  }
  checkMissedSemicolon(e) {
    let t = this.colon(e);
    if (t === !1) return;
    let r = 0, s;
    for (let n = t - 1; n >= 0 && (s = e[n], !(s[0] !== "space" && (r += 1, r === 2))); n--)
      ;
    throw this.input.error(
      "Missed semicolon",
      s[0] === "word" ? s[3] + 1 : s[2]
    );
  }
  colon(e) {
    let t = 0, r, s, n;
    for (let [o, a] of e.entries()) {
      if (r = a, s = r[0], s === "(" && (t += 1), s === ")" && (t -= 1), t === 0 && s === ":")
        if (!n)
          this.doubleColon(r);
        else {
          if (n[0] === "word" && n[1] === "progid")
            continue;
          return o;
        }
      n = r;
    }
    return !1;
  }
  comment(e) {
    let t = new bd();
    this.init(t, e[2]), t.source.end = this.getPosition(e[3] || e[2]), t.source.end.offset++;
    let r = e[1].slice(2, -2);
    if (/^\s*$/.test(r))
      t.text = "", t.raws.left = r, t.raws.right = "";
    else {
      let s = r.match(/^(\s*)([^]*\S)(\s*)$/);
      t.text = s[2], t.raws.left = s[1], t.raws.right = s[3];
    }
  }
  createTokenizer() {
    this.tokenizer = wd(this.input);
  }
  decl(e, t) {
    let r = new yd();
    this.init(r, e[0][2]);
    let s = e[e.length - 1];
    for (s[0] === ";" && (this.semicolon = !0, e.pop()), r.source.end = this.getPosition(
      s[3] || s[2] || Sd(e)
    ), r.source.end.offset++; e[0][0] !== "word"; )
      e.length === 1 && this.unknownWord(e), r.raws.before += e.shift()[1];
    for (r.source.start = this.getPosition(e[0][2]), r.prop = ""; e.length; ) {
      let u = e[0][0];
      if (u === ":" || u === "space" || u === "comment")
        break;
      r.prop += e.shift()[1];
    }
    r.raws.between = "";
    let n;
    for (; e.length; )
      if (n = e.shift(), n[0] === ":") {
        r.raws.between += n[1];
        break;
      } else
        n[0] === "word" && /\w/.test(n[1]) && this.unknownWord([n]), r.raws.between += n[1];
    (r.prop[0] === "_" || r.prop[0] === "*") && (r.raws.before += r.prop[0], r.prop = r.prop.slice(1));
    let o = [], a;
    for (; e.length && (a = e[0][0], !(a !== "space" && a !== "comment")); )
      o.push(e.shift());
    this.precheckMissedSemicolon(e);
    for (let u = e.length - 1; u >= 0; u--) {
      if (n = e[u], n[1].toLowerCase() === "!important") {
        r.important = !0;
        let f = this.stringFrom(e, u);
        f = this.spacesFromEnd(e) + f, f !== " !important" && (r.raws.important = f);
        break;
      } else if (n[1].toLowerCase() === "important") {
        let f = e.slice(0), c = "";
        for (let p = u; p > 0; p--) {
          let d = f[p][0];
          if (c.trim().indexOf("!") === 0 && d !== "space")
            break;
          c = f.pop()[1] + c;
        }
        c.trim().indexOf("!") === 0 && (r.important = !0, r.raws.important = c, e = f);
      }
      if (n[0] !== "space" && n[0] !== "comment")
        break;
    }
    e.some((u) => u[0] !== "space" && u[0] !== "comment") && (r.raws.between += o.map((u) => u[1]).join(""), o = []), this.raw(r, "value", o.concat(e), t), r.value.includes(":") && !t && this.checkMissedSemicolon(e);
  }
  doubleColon(e) {
    throw this.input.error(
      "Double colon",
      { offset: e[2] },
      { offset: e[2] + e[1].length }
    );
  }
  emptyRule(e) {
    let t = new mn();
    this.init(t, e[2]), t.selector = "", t.raws.between = "", this.current = t;
  }
  end(e) {
    this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.semicolon = !1, this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.spaces = "", this.current.parent ? (this.current.source.end = this.getPosition(e[2]), this.current.source.end.offset++, this.current = this.current.parent) : this.unexpectedClose(e);
  }
  endFile() {
    this.current.parent && this.unclosedBlock(), this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.root.source.end = this.getPosition(this.tokenizer.position());
  }
  freeSemicolon(e) {
    if (this.spaces += e[1], this.current.nodes) {
      let t = this.current.nodes[this.current.nodes.length - 1];
      t && t.type === "rule" && !t.raws.ownSemicolon && (t.raws.ownSemicolon = this.spaces, this.spaces = "");
    }
  }
  // Helpers
  getPosition(e) {
    let t = this.input.fromOffset(e);
    return {
      column: t.col,
      line: t.line,
      offset: e
    };
  }
  init(e, t) {
    this.current.push(e), e.source = {
      input: this.input,
      start: this.getPosition(t)
    }, e.raws.before = this.spaces, this.spaces = "", e.type !== "comment" && (this.semicolon = !1);
  }
  other(e) {
    let t = !1, r = null, s = !1, n = null, o = [], a = e[1].startsWith("--"), l = [], u = e;
    for (; u; ) {
      if (r = u[0], l.push(u), r === "(" || r === "[")
        n || (n = u), o.push(r === "(" ? ")" : "]");
      else if (a && s && r === "{")
        n || (n = u), o.push("}");
      else if (o.length === 0)
        if (r === ";")
          if (s) {
            this.decl(l, a);
            return;
          } else
            break;
        else if (r === "{") {
          this.rule(l);
          return;
        } else if (r === "}") {
          this.tokenizer.back(l.pop()), t = !0;
          break;
        } else r === ":" && (s = !0);
      else r === o[o.length - 1] && (o.pop(), o.length === 0 && (n = null));
      u = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile() && (t = !0), o.length > 0 && this.unclosedBracket(n), t && s) {
      if (!a)
        for (; l.length && (u = l[l.length - 1][0], !(u !== "space" && u !== "comment")); )
          this.tokenizer.back(l.pop());
      this.decl(l, a);
    } else
      this.unknownWord(l);
  }
  parse() {
    let e;
    for (; !this.tokenizer.endOfFile(); )
      switch (e = this.tokenizer.nextToken(), e[0]) {
        case "space":
          this.spaces += e[1];
          break;
        case ";":
          this.freeSemicolon(e);
          break;
        case "}":
          this.end(e);
          break;
        case "comment":
          this.comment(e);
          break;
        case "at-word":
          this.atrule(e);
          break;
        case "{":
          this.emptyRule(e);
          break;
        default:
          this.other(e);
          break;
      }
    this.endFile();
  }
  precheckMissedSemicolon() {
  }
  raw(e, t, r, s) {
    let n, o, a = r.length, l = "", u = !0, f, c;
    for (let p = 0; p < a; p += 1)
      n = r[p], o = n[0], o === "space" && p === a - 1 && !s ? u = !1 : o === "comment" ? (c = r[p - 1] ? r[p - 1][0] : "empty", f = r[p + 1] ? r[p + 1][0] : "empty", !gn[c] && !gn[f] ? l.slice(-1) === "," ? u = !1 : l += n[1] : u = !1) : l += n[1];
    if (!u) {
      let p = r.reduce((d, g) => d + g[1], "");
      e.raws[t] = { raw: p, value: l };
    }
    e[t] = l;
  }
  rule(e) {
    e.pop();
    let t = new mn();
    this.init(t, e[0][2]), t.raws.between = this.spacesAndCommentsFromEnd(e), this.raw(t, "selector", e), this.current = t;
  }
  spacesAndCommentsFromEnd(e) {
    let t, r = "";
    for (; e.length && (t = e[e.length - 1][0], !(t !== "space" && t !== "comment")); )
      r = e.pop()[1] + r;
    return r;
  }
  // Errors
  spacesAndCommentsFromStart(e) {
    let t, r = "";
    for (; e.length && (t = e[0][0], !(t !== "space" && t !== "comment")); )
      r += e.shift()[1];
    return r;
  }
  spacesFromEnd(e) {
    let t, r = "";
    for (; e.length && (t = e[e.length - 1][0], t === "space"); )
      r = e.pop()[1] + r;
    return r;
  }
  stringFrom(e, t) {
    let r = "";
    for (let s = t; s < e.length; s++)
      r += e[s][1];
    return e.splice(t, e.length - t), r;
  }
  unclosedBlock() {
    let e = this.current.source.start;
    throw this.input.error("Unclosed block", e.line, e.column);
  }
  unclosedBracket(e) {
    throw this.input.error(
      "Unclosed bracket",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unexpectedClose(e) {
    throw this.input.error(
      "Unexpected }",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unknownWord(e) {
    throw this.input.error(
      "Unknown word",
      { offset: e[0][2] },
      { offset: e[0][2] + e[0][1].length }
    );
  }
  unnamedAtrule(e, t) {
    throw this.input.error(
      "At-rule without name",
      { offset: t[2] },
      { offset: t[2] + t[1].length }
    );
  }
};
var xd = vd;
let Od = se, Ad = xd, Rd = sr;
function Wt(i, e) {
  let t = new Rd(i, e), r = new Ad(t);
  try {
    r.parse();
  } catch (s) {
    throw process.env.NODE_ENV !== "production" && s.name === "CssSyntaxError" && e && e.from && (/\.scss$/i.test(e.from) ? s.message += `
You tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser` : /\.sass/i.test(e.from) ? s.message += `
You tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser` : /\.less$/i.test(e.from) && (s.message += `
You tried to parse Less with the standard CSS parser; try again with the postcss-less parser`)), s;
  }
  return r.root;
}
var ii = Wt;
Wt.default = Wt;
Od.registerParse(Wt);
let { isClean: J, my: Ed } = je, Id = ul, Nd = er, Pd = se, Md = ei, _d = $l, yn = ti, Ld = ii, kd = Ge;
const Dd = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  document: "Document",
  root: "Root",
  rule: "Rule"
}, Ud = {
  AtRule: !0,
  AtRuleExit: !0,
  Comment: !0,
  CommentExit: !0,
  Declaration: !0,
  DeclarationExit: !0,
  Document: !0,
  DocumentExit: !0,
  Once: !0,
  OnceExit: !0,
  postcssPlugin: !0,
  prepare: !0,
  Root: !0,
  RootExit: !0,
  Rule: !0,
  RuleExit: !0
}, Td = {
  Once: !0,
  postcssPlugin: !0,
  prepare: !0
}, ge = 0;
function Oe(i) {
  return typeof i == "object" && typeof i.then == "function";
}
function Il(i) {
  let e = !1, t = Dd[i.type];
  return i.type === "decl" ? e = i.prop.toLowerCase() : i.type === "atrule" && (e = i.name.toLowerCase()), e && i.append ? [
    t,
    t + "-" + e,
    ge,
    t + "Exit",
    t + "Exit-" + e
  ] : e ? [t, t + "-" + e, t + "Exit", t + "Exit-" + e] : i.append ? [t, ge, t + "Exit"] : [t, t + "Exit"];
}
function wn(i) {
  let e;
  return i.type === "document" ? e = ["Document", ge, "DocumentExit"] : i.type === "root" ? e = ["Root", ge, "RootExit"] : e = Il(i), {
    eventIndex: 0,
    events: e,
    iterator: 0,
    node: i,
    visitorIndex: 0,
    visitors: []
  };
}
function $s(i) {
  return i[J] = !1, i.nodes && i.nodes.forEach((e) => $s(e)), i;
}
let Ss = {}, ye = class Nl {
  constructor(e, t, r) {
    this.stringified = !1, this.processed = !1;
    let s;
    if (typeof t == "object" && t !== null && (t.type === "root" || t.type === "document"))
      s = $s(t);
    else if (t instanceof Nl || t instanceof yn)
      s = $s(t.root), t.map && (typeof r.map > "u" && (r.map = {}), r.map.inline || (r.map.inline = !1), r.map.prev = t.map);
    else {
      let n = Ld;
      r.syntax && (n = r.syntax.parse), r.parser && (n = r.parser), n.parse && (n = n.parse);
      try {
        s = n(t, r);
      } catch (o) {
        this.processed = !0, this.error = o;
      }
      s && !s[Ed] && Pd.rebuild(s);
    }
    this.result = new yn(e, s, r), this.helpers = { ...Ss, postcss: Ss, result: this.result }, this.plugins = this.processor.plugins.map((n) => typeof n == "object" && n.prepare ? { ...n, ...n.prepare(this.result) } : n);
  }
  async() {
    return this.error ? Promise.reject(this.error) : this.processed ? Promise.resolve(this.result) : (this.processing || (this.processing = this.runAsync()), this.processing);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(e, t) {
    let r = this.result.lastPlugin;
    try {
      if (t && t.addToError(e), this.error = e, e.name === "CssSyntaxError" && !e.plugin)
        e.plugin = r.postcssPlugin, e.setMessage();
      else if (r.postcssVersion && process.env.NODE_ENV !== "production") {
        let s = r.postcssPlugin, n = r.postcssVersion, o = this.result.processor.version, a = n.split("."), l = o.split(".");
        (a[0] !== l[0] || parseInt(a[1]) > parseInt(l[1])) && console.error(
          "Unknown error from PostCSS plugin. Your current PostCSS version is " + o + ", but " + s + " uses " + n + ". Perhaps this is the source of the error below."
        );
      }
    } catch (s) {
      console && console.error && console.error(s);
    }
    return e;
  }
  prepareVisitors() {
    this.listeners = {};
    let e = (t, r, s) => {
      this.listeners[r] || (this.listeners[r] = []), this.listeners[r].push([t, s]);
    };
    for (let t of this.plugins)
      if (typeof t == "object")
        for (let r in t) {
          if (!Ud[r] && /^[A-Z]/.test(r))
            throw new Error(
              `Unknown event ${r} in ${t.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          if (!Td[r])
            if (typeof t[r] == "object")
              for (let s in t[r])
                s === "*" ? e(t, r, t[r][s]) : e(
                  t,
                  r + "-" + s.toLowerCase(),
                  t[r][s]
                );
            else typeof t[r] == "function" && e(t, r, t[r]);
        }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  async runAsync() {
    this.plugin = 0;
    for (let e = 0; e < this.plugins.length; e++) {
      let t = this.plugins[e], r = this.runOnRoot(t);
      if (Oe(r))
        try {
          await r;
        } catch (s) {
          throw this.handleError(s);
        }
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[J]; ) {
        e[J] = !0;
        let t = [wn(e)];
        for (; t.length > 0; ) {
          let r = this.visitTick(t);
          if (Oe(r))
            try {
              await r;
            } catch (s) {
              let n = t[t.length - 1].node;
              throw this.handleError(s, n);
            }
        }
      }
      if (this.listeners.OnceExit)
        for (let [t, r] of this.listeners.OnceExit) {
          this.result.lastPlugin = t;
          try {
            if (e.type === "document") {
              let s = e.nodes.map(
                (n) => r(n, this.helpers)
              );
              await Promise.all(s);
            } else
              await r(e, this.helpers);
          } catch (s) {
            throw this.handleError(s);
          }
        }
    }
    return this.processed = !0, this.stringify();
  }
  runOnRoot(e) {
    this.result.lastPlugin = e;
    try {
      if (typeof e == "object" && e.Once) {
        if (this.result.root.type === "document") {
          let t = this.result.root.nodes.map(
            (r) => e.Once(r, this.helpers)
          );
          return Oe(t[0]) ? Promise.all(t) : t;
        }
        return e.Once(this.result.root, this.helpers);
      } else if (typeof e == "function")
        return e(this.result.root, this.result);
    } catch (t) {
      throw this.handleError(t);
    }
  }
  stringify() {
    if (this.error) throw this.error;
    if (this.stringified) return this.result;
    this.stringified = !0, this.sync();
    let e = this.result.opts, t = Nd;
    e.syntax && (t = e.syntax.stringify), e.stringifier && (t = e.stringifier), t.stringify && (t = t.stringify);
    let s = new Id(t, this.result.root, this.result.opts).generate();
    return this.result.css = s[0], this.result.map = s[1], this.result;
  }
  sync() {
    if (this.error) throw this.error;
    if (this.processed) return this.result;
    if (this.processed = !0, this.processing)
      throw this.getAsyncError();
    for (let e of this.plugins) {
      let t = this.runOnRoot(e);
      if (Oe(t))
        throw this.getAsyncError();
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[J]; )
        e[J] = !0, this.walkSync(e);
      if (this.listeners.OnceExit)
        if (e.type === "document")
          for (let t of e.nodes)
            this.visitSync(this.listeners.OnceExit, t);
        else
          this.visitSync(this.listeners.OnceExit, e);
    }
    return this.result;
  }
  then(e, t) {
    return process.env.NODE_ENV !== "production" && ("from" in this.opts || _d(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, t);
  }
  toString() {
    return this.css;
  }
  visitSync(e, t) {
    for (let [r, s] of e) {
      this.result.lastPlugin = r;
      let n;
      try {
        n = s(t, this.helpers);
      } catch (o) {
        throw this.handleError(o, t.proxyOf);
      }
      if (t.type !== "root" && t.type !== "document" && !t.parent)
        return !0;
      if (Oe(n))
        throw this.getAsyncError();
    }
  }
  visitTick(e) {
    let t = e[e.length - 1], { node: r, visitors: s } = t;
    if (r.type !== "root" && r.type !== "document" && !r.parent) {
      e.pop();
      return;
    }
    if (s.length > 0 && t.visitorIndex < s.length) {
      let [o, a] = s[t.visitorIndex];
      t.visitorIndex += 1, t.visitorIndex === s.length && (t.visitors = [], t.visitorIndex = 0), this.result.lastPlugin = o;
      try {
        return a(r.toProxy(), this.helpers);
      } catch (l) {
        throw this.handleError(l, r);
      }
    }
    if (t.iterator !== 0) {
      let o = t.iterator, a;
      for (; a = r.nodes[r.indexes[o]]; )
        if (r.indexes[o] += 1, !a[J]) {
          a[J] = !0, e.push(wn(a));
          return;
        }
      t.iterator = 0, delete r.indexes[o];
    }
    let n = t.events;
    for (; t.eventIndex < n.length; ) {
      let o = n[t.eventIndex];
      if (t.eventIndex += 1, o === ge) {
        r.nodes && r.nodes.length && (r[J] = !0, t.iterator = r.getIterator());
        return;
      } else if (this.listeners[o]) {
        t.visitors = this.listeners[o];
        return;
      }
    }
    e.pop();
  }
  walkSync(e) {
    e[J] = !0;
    let t = Il(e);
    for (let r of t)
      if (r === ge)
        e.nodes && e.each((s) => {
          s[J] || this.walkSync(s);
        });
      else {
        let s = this.listeners[r];
        if (s && this.visitSync(s, e.toProxy()))
          return;
      }
  }
  warnings() {
    return this.sync().warnings();
  }
  get content() {
    return this.stringify().content;
  }
  get css() {
    return this.stringify().css;
  }
  get map() {
    return this.stringify().map;
  }
  get messages() {
    return this.sync().messages;
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    return this.sync().root;
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
};
ye.registerPostcss = (i) => {
  Ss = i;
};
var Pl = ye;
ye.default = ye;
kd.registerLazyResult(ye);
Md.registerLazyResult(ye);
let Bd = ul, Fd = er, zd = $l, Wd = ii;
const jd = ti;
let vs = class {
  constructor(e, t, r) {
    t = t.toString(), this.stringified = !1, this._processor = e, this._css = t, this._opts = r, this._map = void 0;
    let s, n = Fd;
    this.result = new jd(this._processor, s, this._opts), this.result.css = t;
    let o = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return o.root;
      }
    });
    let a = new Bd(n, s, this._opts, t);
    if (a.isMap()) {
      let [l, u] = a.generate();
      l && (this.result.css = l), u && (this.result.map = u);
    } else
      a.clearAnnotation(), this.result.css = a.css;
  }
  async() {
    return this.error ? Promise.reject(this.error) : Promise.resolve(this.result);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  sync() {
    if (this.error) throw this.error;
    return this.result;
  }
  then(e, t) {
    return process.env.NODE_ENV !== "production" && ("from" in this._opts || zd(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, t);
  }
  toString() {
    return this._css;
  }
  warnings() {
    return [];
  }
  get content() {
    return this.result.css;
  }
  get css() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get messages() {
    return [];
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    if (this._root)
      return this._root;
    let e, t = Wd;
    try {
      e = t(this._css, this._opts);
    } catch (r) {
      this.error = r;
    }
    if (this.error)
      throw this.error;
    return this._root = e, e;
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};
var Gd = vs;
vs.default = vs;
let Vd = Gd, Yd = Pl, Zd = ei, Jd = Ge, Ue = class {
  constructor(e = []) {
    this.version = "8.4.38", this.plugins = this.normalize(e);
  }
  normalize(e) {
    let t = [];
    for (let r of e)
      if (r.postcss === !0 ? r = r() : r.postcss && (r = r.postcss), typeof r == "object" && Array.isArray(r.plugins))
        t = t.concat(r.plugins);
      else if (typeof r == "object" && r.postcssPlugin)
        t.push(r);
      else if (typeof r == "function")
        t.push(r);
      else if (typeof r == "object" && (r.parse || r.stringify)) {
        if (process.env.NODE_ENV !== "production")
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
      } else
        throw new Error(r + " is not a PostCSS plugin");
    return t;
  }
  process(e, t = {}) {
    return !this.plugins.length && !t.parser && !t.stringifier && !t.syntax ? new Vd(this, e, t) : new Yd(this, e, t);
  }
  use(e) {
    return this.plugins = this.plugins.concat(this.normalize([e])), this;
  }
};
var Hd = Ue;
Ue.default = Ue;
Jd.registerProcessor(Ue);
Zd.registerProcessor(Ue);
let Kd = rr, Xd = il, Qd = ir, qd = ri, em = sr, tm = Ge, rm = si;
function Te(i, e) {
  if (Array.isArray(i)) return i.map((s) => Te(s));
  let { inputs: t, ...r } = i;
  if (t) {
    e = [];
    for (let s of t) {
      let n = { ...s, __proto__: em.prototype };
      n.map && (n.map = {
        ...n.map,
        __proto__: Xd.prototype
      }), e.push(n);
    }
  }
  if (r.nodes && (r.nodes = i.nodes.map((s) => Te(s, e))), r.source) {
    let { inputId: s, ...n } = r.source;
    r.source = n, s != null && (r.source.input = e[s]);
  }
  if (r.type === "root")
    return new tm(r);
  if (r.type === "decl")
    return new Kd(r);
  if (r.type === "rule")
    return new rm(r);
  if (r.type === "comment")
    return new Qd(r);
  if (r.type === "atrule")
    return new qd(r);
  throw new Error("Unknown node type: " + i.type);
}
var sm = Te;
Te.default = Te;
let im = Xs, Ml = rr, nm = Pl, om = se, ni = Hd, lm = er, am = sm, _l = ei, um = Sl, Ll = ir, kl = ri, fm = ti, hm = sr, cm = ii, pm = Rl, Dl = si, Ul = Ge, dm = tr;
function $(...i) {
  return i.length === 1 && Array.isArray(i[0]) && (i = i[0]), new ni(i);
}
$.plugin = function(e, t) {
  let r = !1;
  function s(...o) {
    console && console.warn && !r && (r = !0, console.warn(
      e + `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`
    ), process.env.LANG && process.env.LANG.startsWith("cn") && console.warn(
      e + `: 里面 postcss.plugin 被弃用. 迁移指南:
https://www.w3ctech.com/topic/2226`
    ));
    let a = t(...o);
    return a.postcssPlugin = e, a.postcssVersion = new ni().version, a;
  }
  let n;
  return Object.defineProperty(s, "postcss", {
    get() {
      return n || (n = s()), n;
    }
  }), s.process = function(o, a, l) {
    return $([s(l)]).process(o, a);
  }, s;
};
$.stringify = lm;
$.parse = cm;
$.fromJSON = am;
$.list = pm;
$.comment = (i) => new Ll(i);
$.atRule = (i) => new kl(i);
$.decl = (i) => new Ml(i);
$.rule = (i) => new Dl(i);
$.root = (i) => new Ul(i);
$.document = (i) => new _l(i);
$.CssSyntaxError = im;
$.Declaration = Ml;
$.Container = om;
$.Processor = ni;
$.Document = _l;
$.Comment = Ll;
$.Warning = um;
$.AtRule = kl;
$.Result = fm;
$.Input = hm;
$.Rule = Dl;
$.Root = Ul;
$.Node = dm;
nm.registerPostcss($);
var mm = $;
$.default = $;
const P = /* @__PURE__ */ Op(mm);
P.stringify;
P.fromJSON;
P.plugin;
P.parse;
P.list;
P.document;
P.comment;
P.atRule;
P.rule;
P.decl;
P.root;
P.CssSyntaxError;
P.Declaration;
P.Container;
P.Processor;
P.Document;
P.Comment;
P.Warning;
P.AtRule;
P.Result;
P.Input;
P.Rule;
P.Root;
P.Node;
var xs = /* @__PURE__ */ ((i) => (i[i.DomContentLoaded = 0] = "DomContentLoaded", i[i.Load = 1] = "Load", i[i.FullSnapshot = 2] = "FullSnapshot", i[i.IncrementalSnapshot = 3] = "IncrementalSnapshot", i[i.Meta = 4] = "Meta", i[i.Custom = 5] = "Custom", i[i.Plugin = 6] = "Plugin", i))(xs || {});
const { getWindowScroll: gm } = Sc, St = (i, e) => {
  typeof e == "function" && e(i);
}, cg = (i) => {
  const { events: e, iframe: t, snapshotOptions: r = {}, startTimeStamp: s, endTimeStamp: n, onError: o } = i;
  if (!e || !Array.isArray(e) || !e.length || !r.mirror || !t)
    return St("events and mirror and iframe is required", o), [];
  const a = t.contentDocument, l = t.contentWindow;
  if (!a || !l)
    return St("contentDocument and contentWindow in iframe is required", o), [];
  let u;
  try {
    u = xp(a, r);
  } catch {
    return St("snapshot error", o), [];
  }
  const f = [];
  let c;
  for (let p = 0; p < e.length; p++) {
    const d = e[p];
    if (d.type === xs.Meta && (c = d), !(d.timestamp < s)) {
      if (d.timestamp > n)
        break;
      if (!f.length) {
        if (!c && typeof o == "function")
          return St("Meta event not found", o), [];
        f.push({
          ...c,
          timestamp: d.timestamp - 2
        }), f.push({
          type: xs.FullSnapshot,
          data: {
            node: u,
            initialOffset: gm(l)
          },
          timestamp: d.timestamp - 1
        });
      }
      f.push(d);
    }
  }
  return f;
};
export {
  cg as mergeEvents
};
