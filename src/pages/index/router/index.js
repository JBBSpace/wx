import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      meta:{keepAlive:true},
      component: resolve => require(['@/pages/index/views/Home'], resolve)
    },
    {
      path: '/discountList',
      name: 'discountList',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/discountList'], resolve)
    },
    {
      path: '/createDiscount',
      name: 'createDiscount',
      meta:{keepAlive:true},
      component: resolve => require(['@/pages/index/views/createDiscountnew'], resolve)
    },
    {
      path: '/alarm',
      name: 'alarm',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/alarm'], resolve)
    },
    {
      path: '/alarmList',
      name: 'alarmList',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/alarmList'], resolve)
    },
    {
      path: '/scanResult/:code',
      name: 'scanResult',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/scanResult'], resolve)
    },
    {
      path: '/customerTagSet',
      name: 'customerTagSet',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/customerTagSet'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/login'], resolve)
    },
    {
      path: '/menuSet',
      name: 'menuSet',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/menuSet'], resolve)
    },{
      path: '/customerSet',
      name: 'customerSet',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/customerSet'], resolve)
    },
    {
      path: '/ele',
      name: 'ele',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/ele'], resolve)
    },{
      path: '/chartPeriodComparison',
      name: 'chartPeriodComparison',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartPeriodComparison'], resolve)
    },
    {
      path: '/chartCompanyMarket',
      name: 'chartCompanyMarket',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartCompanyMarket'], resolve)
    },
    {
      path: '/chartCommodityMarket',
      name: 'chartCommodityMarket',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartCommodityMarket'], resolve)
    },{
      path: '/chartrepCjzs',
      name: 'chartrepCjzs',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartrepCjzs'], resolve)
    },{
      path: '/one',
      name: 'one',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartCommodityMarketOne'], resolve)
    },{
      path: '/two',
      name: 'two',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartCommodityMarketTwo'], resolve)
    },{
      path: '/supplier',
      name: 'supplier',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/supplier'], resolve)
    },{
      path: '/myclients',
      name: 'myclients',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/myclients'], resolve)
    },{
      path: '/chartStoreSales',
      name: 'chartStoreSales',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartStoreSales'], resolve)
    },{
      path: '/chartWeekSales',
      name: 'chartWeekSales',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/chartWeekSales'], resolve)
    },{
      path: '/evaluation',
      name: 'evaluation',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/evaluation'], resolve)
    },{
      path: '/msgListold',
      name: 'msgListold',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/msgList'], resolve)
    },{
      path: '/msgList',
      name: 'msgList',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/msgList2'], resolve)
    },{
      path: '/scan',
      name: 'scan',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/scan'], resolve)
    },
    {
      path: '/fullcode',
      name: 'fullcode',
      meta:{keepAlive:false},
      component: resolve => require(['@/pages/index/views/fullcode'], resolve)
    },
  ]
})
