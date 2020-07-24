import Dep from "./dep.js";

export function observe(obj) {
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key);
    });
  }
}

export function defineReactive(target, key, val) {
  val = target[key];
  let dep = new Dep();
  if (typeof val === 'object') {
    observe(val);
  }

  Object.defineProperty(target, key, {
    get() {
      dep.depend();
      return val;
    },
    set(v) {
      if (val !== v) {
        val = v;
        dep.notify();
      }
    }
  });
}