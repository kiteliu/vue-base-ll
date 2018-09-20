import Vue from 'vue'
import Vuex from 'vuex'
import {
  ml,
  rc,
  Home,
  Detail
} from './modules'
Vue.use(Vuex)

let store = new Vuex.Store({
  modules: {
    ml,
    rc,
    Home,
    Detail
  }
})

Vue.use(store)

export default store
