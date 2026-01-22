 import Vue from 'vue'
 import Vuex from 'vuex'

// //挂载Vuex
 Vue.use(Vuex)

import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

//创建VueX对象
const store = new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})

export default store