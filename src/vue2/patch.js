import {
  TEXT_VNODE,
  ELEMENT_VNODE,
  COMPONENT_VNODE
} from './create-element.js'

export default function patch(oldVNode, vnode, mountEl) {
  if (!oldVNode) {
    // 初始化挂载
    createElm(vnode, mountEl);
  } else if (sameVNode(oldVNode, vnode)) {
    // 两个vnode相同，走patch
    patchVnode(oldVNode, vnode);
  } else {
    // 两个vnode不同，创建新的，删除旧的
    let parentElm = mountEl.parentNode;
    createElm(vnode, parentElm);
    removeVnode(oldVNode);
  }
  return vnode.elm;
}

function patchVnode(oldVNode, vnode) {
  let elm = vnode.elm = oldVNode.elm;
  let oldCh = oldVNode.children;
  let ch = vnode.children;

  if (oldVNode.type === TEXT_VNODE && vnode.type === TEXT_VNODE) {
    if (oldVNode.text !== vnode.text) {
      elm.textContent = vnode.text;
    }
  } else if (oldVNode.type === TEXT_VNODE || vnode.type === TEXT_VNODE) {
    let parentElm = elm.parentNode;
    createElm(vnode, parentElm);
    removeVnode(oldVNode);
  } else if (oldVNode.type !== TEXT_VNODE && vnode.type !== TEXT_VNODE) {
    if (oldCh && ch) {
      if (oldCh !== ch) {
        updateChildren(elm, oldCh, ch);
      }
    }
  }
}

function updateChildren(parentElm, oldCh, newCh) {
  // 双端比较法
  let newStartIdx = 0;
  let newEndIdx = newCh.length - 1;
  let oldStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let newStartVnode = newCh[newStartIdx];
  let newEndVnode = newCh[newEndIdx];
  let oldStartVnode = oldCh[oldStartIdx];
  let oldEndVnode = oldCh[oldEndIdx];
  let oldKeyToIdx, newIdxInOld;

  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (sameVNode(oldStartVnode, newStartVnode)) {
      // 头头
      patchVnode(oldStartVnode, newStartVnode);
      newStartVnode = newCh[++newStartIdx];
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (sameVNode(oldEndVnode, newEndVnode)) {
      // 尾尾
      patchVnode(oldEndVnode, newEndVnode);
      newEndVnode = newCh[--newEndIdx];
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVNode(oldEndVnode, newStartVnode)) {
      // 头尾
      patchVnode(oldEndVnode, newStartVnode);
      parentElm.insertBefore(oldEndVnode.elm, oldCh[oldStartIdx]);
      newStartVnode = newCh[++newStartIdx];
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVNode(oldStartVnode, newEndVnode)) {
      // 尾头
      patchVnode(oldStartVnode, newEndVnode);
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else {
      // 以上均不满足
      // 找到新节点在旧节点中的下标：
      // 若存在，且符合sameVnode，进行patchVnode，旧节点置为undefined
      //        不符合sameVnode，创建新节点
      // 若不存在，创建新节点
      // newStartIdx++
      if (!oldKeyToIdx) oldKeyToIdx = createOldKeyToIdx(oldCh, oldStartIdx, oldEndIdx);
      newIdxInOld = newStartVnode.key
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      if (isUndef(newIdxInOld)) {
        createElm(newStartVnode, parentElm);
      } else {
        let vnodeToOld = oldCh[newIdxInOld];
        if (sameVNode(vnodeToOld, newStartVnode)) {
          patchVnode(vnodeToOld, newStartVnode);
          parentElm.insertBefore(vnodeToOld.elm, oldStartVnode);
          oldCh[newIdxInOld] = undefined;
        } else {
          createElm(newStartVnode, parentElm);
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
  }
  if (oldEndIdx >= oldStartIdx) {
    // 还有剩下的旧节点，全部删除
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  } else if (newEndIdx >= newStartIdx) {
    // 还有剩下的新节点，全部新增
    let refElm = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null;
    addVnodes(newCh, newStartIdx, newEndIdx, parentElm, refElm);
  }
}

function addVnodes(children, startIdx, endIdx, parentElm, refElm) {
  for (let i = startIdx; startIdx <= endIdx; i++) {
    createElm(children[i], parentElm);
  }
}

function removeVnodes(children, startIdx, endIdx) {
  for (let i = startIdx; i <= endIdx; i++) {
    let vnode = children[i];
    if (vnode.tagName) {
      removeVnodeListener(vnode);
      removeVnode(vnode);
    } else {
      removeVnode(vnode);
    }
  }
}

function removeVnodeListener(vnode) {
  const data = vnode.data;
  if (typeof data !== 'object' || data === null) {
    return;
  }
  Object.keys(data).forEach(key => {
    if (key === 'on') {
      Object.keys(data[key]).forEach(eventName => {
        vnode.elm.removeEventListener(eventName, data[key][eventName].bind(vnode.context))
      });
    }
  });
}

function removeVnode(vnode) {
  let parentNode = vnode.elm.parentNode;
  parentNode.removeChild(vnode.elm);
}

function isUndef(a) {
  return a === void 0 || a === null;
}

function findIdxInOld(vnode, children, startIdx, endIdx) {
  for (let i = startIdx; i <= endIdx; i++) {
    if (!isUndef(children[i]) && sameVNode(vnode, children[i])) return i;
  }
}

function createOldKeyToIdx(children, startIdx, endIdx) {
  let map = {};
  for (let i = startIdx; i <= endIdx; i++) {
    if (typeof children[i].key !== "undefined" && children[i].key !== null) {
      map[children[i].key] = i;
    }
  }
  return map;
}

function sameVNode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.type === vnode2.type
}

function createElm(vnode, parentEl) {
  if (vnode.tag) {
    vnode.elm = document.createElement(vnode.tag);
    if (vnode.data) {
      initElmData(vnode);
    }
    if (vnode.children) {
      createChildren(vnode, vnode.children);
    }
    parentEl.appendChild(vnode.elm);
  } else if (vnode.type === TEXT_VNODE) {
    vnode.elm = document.createTextNode(vnode.text);
    parentEl.appendChild(vnode.elm);
  }
}

function createChildren(vnode, children) {
  if (Array.isArray(children)) {
    for (let i = 0, length = children.length; i < length; i++) {
      createElm(children[i], vnode.elm);
    }
  }
}

function initElmData(vnode) {
  const data = vnode.data;
  if (typeof data !== 'object' || data === null) {
    return;
  }
  addElmAttribute(data.attrs, vnode);
  addElmListeners(data.on, vnode);
}

function addElmAttribute(data, vnode) {
  if (isUndef(data) || typeof data !== 'object') return;
  Object.keys(data).forEach(key => {
    vnode.elm.setAttribute(key, data[key]);
  });
}

function addElmListeners(data, vnode) {
  if (isUndef(data) || typeof data !== 'object') return;
  Object.keys(data).forEach(eventName => {
    vnode.elm.addEventListener(eventName, data[eventName].bind(vnode.context));
  });
}