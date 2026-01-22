import App from './App'
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from '@/store'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

let jweixin = require('jweixin-module')  
Vue.prototype.$wx = jweixin;

import CustomHeader from '@/components/CustomHeader'
import CustomFooter from '@/components/CustomFooter'
import CustomEmpty from '@/components/CustomEmpty'
Vue.component("CustomHeader",CustomHeader)
Vue.component("CustomFooter",CustomFooter)
Vue.component("CustomEmpty",CustomEmpty)


// mixins
import common from '@/mixin'
Vue.mixin(common)

// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// Vue.use(vConsole)


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	store,
  ...App
})
app.$mount()
