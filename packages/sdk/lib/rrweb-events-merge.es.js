import { utils as S } from "rrweb";
import { snapshot as g } from "rrweb-snapshot";
var u = /* @__PURE__ */ ((t) => (t[t.DomContentLoaded = 0] = "DomContentLoaded", t[t.Load = 1] = "Load", t[t.FullSnapshot = 2] = "FullSnapshot", t[t.IncrementalSnapshot = 3] = "IncrementalSnapshot", t[t.Meta = 4] = "Meta", t[t.Custom = 5] = "Custom", t[t.Plugin = 6] = "Plugin", t))(u || {});
const { getWindowScroll: M } = S, a = (t, n) => {
  typeof n == "function" && n(t);
}, D = (t) => {
  const { events: n, iframe: s, snapshotOptions: l = {}, startTimeStamp: h, endTimeStamp: p, onError: r } = t;
  if (!n || !Array.isArray(n) || !n.length || !l.mirror || !s)
    return a("events and mirror and iframe is required", r), [];
  const c = s.contentDocument, f = s.contentWindow;
  if (!c || !f)
    return a("contentDocument and contentWindow in iframe is required", r), [];
  let d;
  try {
    d = g(c, l);
  } catch {
    return a("snapshot error", r), [];
  }
  const e = [];
  let m;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    if (o.type === u.Meta && (m = o), !(o.timestamp < h)) {
      if (o.timestamp > p)
        break;
      if (!e.length) {
        if (!m && typeof r == "function")
          return a("Meta event not found", r), [];
        e.push({
          ...m,
          timestamp: o.timestamp - 2
        }), e.push({
          type: u.FullSnapshot,
          data: {
            node: d,
            initialOffset: M(f)
          },
          timestamp: o.timestamp - 1
        });
      }
      e.push(o);
    }
  }
  return e;
};
export {
  D as mergeEvents
};
