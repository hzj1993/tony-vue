import Watcher from './watcher.js'
import Dep from './dep.js'

export default function TonyVue(options) {
    const vm = this;
    this.$options = options;
    initState(vm);
}
TonyVue.prototype.$mount = function (el) {
    let vm = this;
    let elm = document.querySelector(el);
    new Watcher(this, function () {
        let template = document.createDocumentFragment(vm.$options.template);
        elm.appendChild(template);
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

function observe(obj) {
    if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key);
        });
    }
}

function defineReactive(target, key, val) {
    val = target[key];
    let dep = new Dep();
    if (typeof val === 'object') {
        observe(val);
    }

    Object.defineProperty(target, key, {
        get() {
            dep.depend();
            return val;
        },
        set(v) {
            if (val !== v) {
                val = v;
                dep.notify();
            }
        }
    });
}