import {effect} from './effect'
import {NOOP, isFunction} from './util'

export function computed(getterOrOptions) {
    let dirty = true;
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

        }
    })

    const computed = {
        __v_isRef: true,
        get value() {
            if (dirty) {

                dirty = false;
            }
        },
        set value(newValue) {

        }
    }
    return computed;
}