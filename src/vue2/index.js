import Watcher from './reactive/watcher.js'
import Dep from './reactive/dep.js'
import {observe} from './reactive'

export default function TonyVue(options) {
    const vm = this;
    this.$options = options;
    initState(vm);
}
TonyVue.prototype.$mount = function (el) {
    let vm = this;
    let elm = document.querySelector(el);
    new Watcher(this, function () {
        elm.innerHTML = vm.$options.template
        // let template = document.createDocumentFragment(vm.$options.template);
        // elm.appendChild(template);
    })
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
