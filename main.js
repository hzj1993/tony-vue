import TonyVue from './src/vue2/index.js'

let app = new TonyVue({
  template: `
        <div>
            <div @click="change">Click to change</div>
            <div v-if="a === 1">hhhhhh</div>
        </div>    
        `,
  data() {
    return {
      a: 0
    }
  },
  methods: {
    change () {
      console.log('change');
      this.a = this.a === 0 ? 1 : 0;
    }
  }
}).$mount('#app');