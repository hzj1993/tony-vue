import { isObject, hasChanged, hasOwn } from './util.js'
import { track, trigger } from './effect.js'

const baseHandler = {
  get(target, key) {
    let val = Reflect.get(target, key);
    track(target, key);
    return reactive(val);
  },
  set(target, key, newValue) {
    let oldValue = target[key];
    let res = Reflect.set(target, key, newValue);

    if (hasChanged(oldValue, newValue)) {
      trigger(target, key);
    }
    return res;
  }
};

export function reactive(target) {
  return createReactiveObject(target, baseHandler);
}

function createReactiveObject(target, baseHandler) {
  if (!isObject(target)) {
    return target;
  }
  if (hasOwn(target, '__v_reactive')) {
    return target.__v_reactive;
  }
  const observed = new Proxy(target, baseHandler);
  target.__v_reactive = observed;
  return observed;
}
