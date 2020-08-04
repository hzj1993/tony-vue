export function hasChanged(val, oldVal) {
    return val !== oldVal && (val === val || oldVal === oldVal);
}

export function isObject(val) {
    return val !== null && typeof val === 'object';
}

export const NOOP = () => {}

export const isFunction = val => typeof val === 'function'