import TonyVue from './src/vue2/index.js'

let app = new TonyVue({
  template: `
            <div @click="change" :key="ddd">rrr{{a}}</div>
        `,
  data() {
    return {
      a: 1,
      ddd: 'ee'
    }
  },
  methods: {
    change() {
      this.a++;
    }
  }
}).$mount('#app');