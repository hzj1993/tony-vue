const effectStack = [];
let activeEffect;
const targetMap = new WeakMap();

// 副作用
export function effect(fn, options) {
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}

function createReactiveEffect(fn, options) {
    const effect = function () {
        if (effectStack.indexOf(effect) === -1) {
            try {
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            } finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.deps = [];
    effect.options = options;
    effect._isEffect = true;

    return effect;
}

// 收集依赖
export function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}

// 派发更新
export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let effects = new Set();

    const add = effectsToAdd => {
        effectsToAdd.forEach(effect => {
            effects.add(effect);
        });
    };

    if (key !== void 0) {
        add(depsMap.get(key));
    }

    const run = effect => {
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        } else {
            effect();
        }
    };
    effects.forEach(run);
}
