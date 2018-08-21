import Vue from 'vue'
import Vuex from 'vuex'
import {
  increment
} from './mutation-types'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    toggleLoading(state) {
      // 变更状态
      state.loading = !state.loading
    },
  }
})
