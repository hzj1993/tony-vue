import TonyVue from './src/vue2/index.js'

let app = new TonyVue({
  template: `
        <div>
            <input type="text" v-model="a" :key="b">
            <div>{{a}}</div>
        </div>    
        `,
  data() {
    return {
      a: 1,
      b: 'jj'
    }
  }
}).$mount('#app');