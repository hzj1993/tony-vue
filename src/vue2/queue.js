import nextTick from "./nexttick.js";

let queue = [];
export default function queueWatcher(watcher) {
    if (queue.indexOf(watcher) === -1) {
        queue.push(watcher);
    }
    nextTick(flushSchedulerQueue);
}

function flushSchedulerQueue () {
    queue.forEach(watcher => {
        watcher.get();
    });
}