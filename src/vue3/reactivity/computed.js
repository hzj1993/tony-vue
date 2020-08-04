import { effect, track, trigger } from './effect.js'
import { NOOP, isFunction } from './util.js'

export function computed(getterOrOptions) {
  debugger
  let dirty = true;
  let value;
  let getter, setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  const runner = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(computed, 'value');
      }
    }
  })

  const computed = {
    __v_isRef: true,
    get value() {
      if (dirty) {
        value = runner();
        dirty = false;
      }
      track(computed, 'value');
      return value
    },
    set value(newValue) {
      setter(newValue)
    }
  }
  return computed;
}