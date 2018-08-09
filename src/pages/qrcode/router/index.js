import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'qurt',
      component: resolve => require(['@/pages/qrcode/views/qurt'], resolve)
    }
  ]
})
