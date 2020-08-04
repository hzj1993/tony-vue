import {hasChanged, isObject} from './util'
import {reactive} from './reactive'
import {track, trigger} from './effect'

function isRef(value) {
    return value && value.__v_isRef;
}

function covert(val) {
    return isObject(val) ? reactive(val) : val;
}

export function ref(value) {
    if (isRef(value)) {
        return value;
    }
    let _value = covert(value);
    const r = {
        __v_isRef: true,
        get value() {
            track();
            return _value;
        },
        set value(newVal) {
            if (hasChanged(newVal, _value)) {
                _value = covert(newVal);
                trigger();
            }
        }
    };
    return r;
}