import { createTextVNode, createVNode } from "./create-element.js";

export function installRenderHelpers (target) {
  target._c = (tag, data, children) => createVNode(tag, data, children);
  target._v = (data) => createTextVNode(data);
  target._s = (data) => String(data);
}
