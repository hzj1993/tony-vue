import TonyVue from './src/vue2/index.js'

let app = new TonyVue({
  template: `
        <div>
            <div @click="change">Click to change</div>
            <div v-show="a">hhhhhh</div>
        </div>    
        `,
  data() {
    return {
      a: false
    }
  },
  methods: {
    change () {
      console.log('change');
      this.a = !this.a;
    }
  }
}).$mount('#app');