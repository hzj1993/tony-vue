export const TEXT_VNODE = 'text';
export const ELEMENT_VNODE = 'element';
export const COMPONENT_VNODE = 'component';
const HTML5_ELEMENT = [
    'div', 'a', 'ul', 'li', 'span', 'p', 'input',
    'textarea', 'header', 'section', 'footer', 'h1',
    'h2', 'h3', 'h4', 'h5'
];
let uid = 1;
class VNode {
    constructor(options) {
        this.type = options.type;
        this.tag = options.tag;
        this.children = options.children;
        this.isComponent = !!options.isComponent;
        this.data = options.data;
        this.text = options.text;
        this.elm = options.elm;
        this.key = options.key/* || `@@__vnode_id_${uid++}`*/;
        this.context = options.context;
    }
}

export function createVNode(tag, data, children, context) {
    const isComponent = HTML5_ELEMENT.indexOf(tag) === -1;
    return new VNode({
        type: isComponent ? COMPONENT_VNODE : ELEMENT_VNODE,
        tag,
        data,
        children,
        isComponent,
        context,
        key: data.key
    });
}

export function createTextVNode(text) {
    return new VNode({
        type: TEXT_VNODE,
        text
    })
}