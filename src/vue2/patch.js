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
        debugger
        // 两个vnode相同，走patch
        patchVnode(oldVNode, vnode);
    } else {
        // 两个vnode不同，创建新的，删除旧的
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
    let startIdx = 0;
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
        createTextNode(vnode, parentEl);
    }
}

function createChildren(vnode, children) {
    if (Array.isArray(children)) {
        for (let i = 0, length = children.length; i < length; i++) {
            createElm(children[i], vnode.elm);
        }
    }
}

function createTextNode(vnode, parentEl) {
    parentEl.appendChild(document.createTextNode(vnode.text));
}

function initElmData(vnode) {
    const data = vnode.data;
    Object.keys(data).forEach(key => {
        if (key === 'on') {
            Object.keys(data[key]).forEach(eventName => {
                if (eventName === 'click') {
                    vnode.elm.addEventListener(eventName, data[key][eventName].bind(vnode.context))
                }
            });
        }
    });
}