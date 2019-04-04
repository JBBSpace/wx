/*
 * @Author: 姬兵兵 
 * @Date: 2018-06-06 10:41:56 
 * @Last Modified by: 姬兵兵
 * @Last Modified time: 2019-03-29 09:34:39
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import {
  Tab,
  Tabs,
  Field,
  List,
  Collapse,
  CollapseItem,
  PullRefresh,
  Dialog,
  Panel,
  Tabbar,
  Loading,
  Popup,
  Picker,
  Button,
  Switch,
  SwitchCell,
  NavBar,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Icon,
  DatetimePicker,
  Toast,
  Step,
  Steps,
  Search
} from 'vant';
Vue.use(Tab).use(Tabs).use(Field).use(List).use(Collapse).use(CellGroup).use(CollapseItem).use(PullRefresh).use(Dialog).use(Panel).use(Tabbar).use(Loading).use(Popup);
Vue.use(Button).use(Picker).use(Switch).use(SwitchCell).use(NavBar).use(Cell).use(CellGroup).use(Icon).use(DatetimePicker).use(Toast).use(Step).use(Steps);
Vue.use(Checkbox).use(CheckboxGroup).use(Search);
import VCharts from 'v-charts';
Vue.use(VCharts);
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
import store from './store'

// import './assets/style/_variables.less'

router.beforeEach((to, from, next) => {
  switch (to.name) {
    case 'home':
      next();
      document.title = "汉高ERP";
      break;
    case 'login':
      document.title = "绑定账号";
      next();
      break;
    case 'discountList':
      document.title = "我的折扣券";
      next();
      break;
    case 'createDiscount':
      document.title = "生成 折扣券";
      next();
      break;
      // case 'createDiscountnew':
      //   document.title = "生成 折扣券";
      //   next();
      //   break;
    case 'chartPeriodComparison':
      document.title = "周期销售表";
      next();
      break;
    case 'chartCompanyMarket':
      document.title = "公司销售表";
      next();
      break;
    case 'chartCommodityMarket':
      document.title = "类别销售对比表";
      next();
      break;
    case 'chartrepCjzs':
      document.title = "成交走势图";
      next();
      break;
    case 'chartWeekSales':
      document.title = "周销售报表";
      next();
      break;
    case 'alarm':
      document.title = "报表闹钟提醒设置";
      next();
      break;
    case 'alarmList':
      document.title = "报表闹钟提醒设置";
      next();
      break;
    case 'customerTagSet':
      document.title = "顾客标签设置";
      next();
      break;
    case 'scan':
      next();
      document.title = "接单成功";
      break;
    case 'fullcode':
      next();
      document.title = "快递列表";
      break;
    case 'scanResult':
      next();
      break;
    case 'menuSet':
      document.title = "用户菜单配置";
      next();
      break;
    case 'chartStoreSales':
      document.title = "门店销售表";
      next();
      break;
    case 'one':
      document.title = "商品类别销售";
      next();
      break;
    case 'two':
      document.title = "公司销售分析 ";
      next();
      break;
    case 'supplier':
      document.title = "供应商排名(前十名)";
      next();
      break;
    case 'msgList':
      document.title = "消息列表";
      next();
      break;
    case 'customerSet':
      document.title = "顾客评价提醒";
      next();
      break;
    case 'evaluation':
      document.title = "顾客评价";
      next();
      break;
    case 'myclients':
      document.title = "我的顾客";
      next();
      break;
    default:
      return null;
  }

})
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
