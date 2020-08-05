// import TonyVue from './vue2/index.js'
//
// let app = new TonyVue({
//   template: `
//         <div>
//             <div @click="change">Click</div>
//             <div v-show="a[0]">hhhhhhj</div>
//             <input type="text" v-model="b">
//             <div>{{b}}</div>
//         </div>
//         `,
//   data() {
//     return {
//       a: [true],
//       b: ''
//     }
//   },
//   methods: {
//     change () {
//       console.log('change');
//       this.a[0] = !this.a[0];
//     }
//   }
// }).$mount('#app');
import { reactive, effect } from './vue3/reactivity/index.js'

var state = reactive({
  a: {
    b: 1
  }
});
effect(() => {
  console.log(state.a.b)
})
state.a.b++

// setInterval(() => {
//   state.a.b++
// }, 1000);