import TonyVue from './vue2/index.js'

let app = new TonyVue({
  template: `
        <div>
            <div @click="change">Click</div>
            <div v-show="a[0]">hhhhhhj</div>
            <input type="text" v-model="b">
            <div>{{b}}</div>
        </div>    
        `,
  data() {
    return {
      a: [true],
      b: ''
    }
  },
  methods: {
    change () {
      console.log('change');
      this.a[0] = !this.a[0];
    }
  }
}).$mount('#app');