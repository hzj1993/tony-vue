import TonyVue from './vue2/index.js'

let app = new TonyVue({
  template: `
        <div>
            <div @click="change">Click</div>
            <div v-show="a">hhhhhhj</div>
        </div>    
        `,
  data() {
    return {
      a: false
    }
  },
  methods: {
    change ($event) {
      debugger
      console.log('change');
      this.a = !this.a;
    }
  }
}).$mount('#app');