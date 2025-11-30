// Lightweight compatibility helper to try multiple translation keys with a default namespace
export function createTT(t, defaultNs = "header") {
  return function tt(...args) {
    let opts = {};
    let keys = args;
    if (args.length && typeof args[args.length - 1] === "object") {
      opts = args[args.length - 1];
      keys = args.slice(0, -1);
    }
    const firstKey = keys[0];
    for (const k of keys) {
      if (!k) continue;
      // If caller supplies a fully-qualified key like 'nav.home' we'll use it directly
      const val = t(k, { ns: defaultNs, defaultValue: opts.defaultValue || "" });
      if (val && val !== k) return val;
    }
    if (opts.defaultValue) return opts.defaultValue;
    return t(firstKey);
  };
}

export default createTT;
