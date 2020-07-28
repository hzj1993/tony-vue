import TonyVue from './src/vue2/index.js'

let app = new TonyVue({
  template: `
            <div @click="change">rrr{{a}}</div>
        `,
  data() {
    return {
      a: 1
    }
  },
  methods: {
    change() {
      this.a++;
    }
  }
}).$mount('#app');