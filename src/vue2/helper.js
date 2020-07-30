import { createTextVNode, createVNode } from "./create-element.js";
import {observe} from "./reactive";

export function installRenderHelpers (target) {
  target._v = (data) => createTextVNode(data);
  target._s = (data) => String(data);
}

export function initEvent(vm) {
  const {methods} = vm.$options;
  if (methods && typeof methods === 'object') {
    Object.keys(methods).forEach(key => {
      vm[key] = methods[key].bind(vm);
    });
  }
}

export function initRender(vm) {
  vm._c = (tag, data, children) => createVNode(tag, data, children, vm);
}

export function initState(vm) {
  const option = vm.$options;
  let data = vm._data = option.data ? option.data.apply(vm, vm) : {};
  observe(data);
  Object.keys(data).forEach(key => {
    proxy(vm, '_data', key);
  });
}

export function proxy(obj, sourceKey, key) {
  Object.defineProperty(obj, key, {
    get() {
      return this[sourceKey][key];
    },
    set(v) {
      this[sourceKey][key] = v;
    }
  });
}