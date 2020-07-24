export default function nextTick(fn) {
    Promise.resolve().then(() => {
        fn();
    })
}