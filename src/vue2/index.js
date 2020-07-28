import patch from './patch.js'
import compileToFunction from './compiler/index.js'
import Watcher from './reactive/watcher.js'
import {observe} from './reactive'
import {createVNode} from './create-element.js'

export default function TonyVue(options) {
    const vm = this;
    this.$options = options;
    initEvent(vm);
    initState(vm);
    debugger
}
TonyVue.prototype.$mount = function (el) {
    let vm = this;
    vm.$el = document.querySelector(el);
    const {render} = compileToFunction(vm.$options.template);
    this.$options.render = render;

    new Watcher(this, function () {
        debugger
        this.update(this._render())
        // let template = document.createDocumentFragment(vm.$options.template);
        // elm.appendChild(template);
    })
}

TonyVue.prototype._c = (tag, data, children) => createVNode(tag, data, children);

TonyVue.prototype._c = (tag, data, children) => createVNode(tag, data, children);

TonyVue.prototype.update = function (vnode) {
    debugger
    patch(oldVNode, vnode);
}

TonyVue.prototype._render = function () {
    const render = this.$options.render;
    render.call(this, this);
}

function initEvent(vm) {
    const {methods} = vm.$options;
    Object.keys(methods).forEach(key => {
        vm[key] = methods[key].bind(vm);
    });
}

function initState(vm) {
    const option = vm.$options;
    let data = vm._data = option.data.apply(vm, vm);
    observe(data);
    Object.keys(data).forEach(key => {
        proxy(vm, '_data', key);
    });
}

function proxy(obj, sourceKey, key) {
    Object.defineProperty(obj, key, {
        get() {
            return this[sourceKey][key];
        },
        set(v) {
            this[sourceKey][key] = v;
        }
    });
}
