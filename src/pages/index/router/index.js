import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: resolve => require(['@/pages/index/views/Home'], resolve)
    },
    {
      path: '/discountList',
      name: 'discountList',
      component: resolve => require(['@/pages/index/views/discountList'], resolve)
    },
    {
      path: '/createDiscount',
      name: 'createDiscount',
      component: resolve => require(['@/pages/index/views/createDiscount'], resolve)
    },
    {
      path: '/chartPeriodComparison',
      name: 'chartPeriodComparison',
      component: resolve => require(['@/pages/index/views/chartPeriodComparison'], resolve)
    },
    {
      path: '/chartCompanyMarket',
      name: 'chartCompanyMarket',
      component: resolve => require(['@/pages/index/views/chartCompanyMarket'], resolve)
    },
    {
      path: '/chartCommodityMarket',
      name: 'chartCommodityMarket',
      component: resolve => require(['@/pages/index/views/chartCommodityMarket'], resolve)
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: resolve => require(['@/pages/index/views/alarm'], resolve)
    },
    {
      path: '/alarmList',
      name: 'alarmList',
      component: resolve => require(['@/pages/index/views/alarmList'], resolve)
    },
    {
      path: '/scan',
      name: 'scan',
      component: resolve => require(['@/pages/index/views/scan'], resolve)
    },
    {
      path: '/scanResult/:code',
      name: 'scanResult',
      component: resolve => require(['@/pages/index/views/scanResult'], resolve)
    },
    {
      path: '/customerTagSet',
      name: 'customerTagSet',
      component: resolve => require(['@/pages/index/views/customerTagSet'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/index/views/login'], resolve)
    },
    {
      path: '/menuSet',
      name: 'menuSet',
      component: resolve => require(['@/pages/index/views/menuSet'], resolve)
    },
  ]
})
