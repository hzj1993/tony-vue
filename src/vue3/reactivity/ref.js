import {hasChanged, isObject} from './util.js'
import {reactive} from './reactive.js'
import {track, trigger} from './effect.js'

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
            track(r, 'value');
            return _value;
        },
        set value(newVal) {
            if (hasChanged(newVal, _value)) {
                _value = covert(newVal);
                trigger(r, 'value');
            }
        }
    };
    return r;
}