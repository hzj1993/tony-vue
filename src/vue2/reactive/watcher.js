import Dep from "./dep.js";
import queueWatcher from "../runtime/queue.js";

let uid = 0;
export default class Watcher {
    constructor(vm, cb) {
        this.vm = vm;
        this.id = uid++;
        this.newDeps = [];
        this.deps = [];
        this.cb = cb;
        this.value = this.get();
    }
    get() {
        Dep.target = this;
        this.cb.call(this.vm, this.vm);
        Dep.target = null;
    }
    addDeps(dep) {
        if (this.newDeps.indexOf(dep) === -1) {
            this.newDeps.push(dep);
            dep.addSub();    
        }
    }
    update() {
        queueWatcher(this)
    }
}