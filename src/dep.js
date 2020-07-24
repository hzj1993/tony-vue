let uid = 0;
export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDeps(this);
        }
    }
    addSub() {
        this.subs.push(Dep.target);
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}