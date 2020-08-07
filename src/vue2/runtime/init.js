import { initEvent, initRender, initState } from "./helper.js";
import patch from "./patch.js";
import compileToFunction from "../compiler/index.js";
import Watcher from "../reactive/watcher.js";


export function initMixin(TonyVue) {
  TonyVue.prototype._init = function (options) {
    const vm = this;
    this.$options = options;
    initEvent(vm);
    initRender(vm);
    initState(vm);
  }
}

export function updateMixin(TonyVue) {
  TonyVue.prototype.update = function (vnode) {
    const vm = this;
    const prevnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevnode) {
      // 初始化
      vm.$el = patch(null, vnode, vm.$el);
    } else {
      // 更新过程
      vm.$el = patch(prevnode, vnode, vm.$el);
    }
  }

  TonyVue.prototype._render = function () {
    const vm = this;
    const render = vm.$options.render;
    return render.call(vm, vm);
  }
}

export function mountMixin(TonyVue) {
  TonyVue.prototype.$mount = function (el) {
    let vm = this;
    vm.$el = document.querySelector(el);
    const {render} = compileToFunction(vm.$options.template);
    this.$options.render = render;

    new Watcher(this, function () {
      this.update(this._render())
    })
  }
}