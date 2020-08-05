import {isObject, hasChanged, hasOwn} from './util.js'
import {track, trigger} from './effect.js'

const baseHandler = {
    get(target, key) {
        let val = Reflect.get(target, key);
        track(target, key);
        return val;
    },
    set(target, key, newValue) {
        let oldValue = target[key];
        debugger
        if (hasChanged(oldValue, newValue)) {
            Reflect.set(target, key, newValue);
            trigger(target, key);
        }
    }
};

export function reactive(target) {
    return createReactiveObject(target);
}

function createReactiveObject(target) {
    if (!isObject(target)) {
        return target;
    }
    if (isReactive(target)) {
        return target;
    }

    const observed = new Proxy(target, baseHandler);

    return observed;
}

function isReactive(target) {
    return false;
}