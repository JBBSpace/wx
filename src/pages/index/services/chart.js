import buildService from '@/pages/index/helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  initCompanyList: {
    url: '/baseinfo/syncdata/',
    method: 'get'
  },
  viewreportData: {
    method: 'get'
  },
  viewreportDataClass: {
    url: '/report/rep_class/',
    method: 'get'
  },
  viewreportDataCompare: {
    url: '/report/rep_compare/',
    method: 'get'
  },
  one: {
    url: '/report/rep_xs_class/',
    method: 'get'
  },
  two: {
    url: '/report/rep_xs_com/',
    method: 'get'
  },
  viewreportDataStoreSales: {
    url: '/report/rep_shop/',
    method: 'get'
  },
  rep_week_com:{
    url: '/report/rep_week_com/',
    method: 'get'
  },
  rep_cjzs:{
    url: '/report/rep_cjzs/',
    method: 'get'
  },
  rep_supplier:{
    url: '/report/rep_supplier/',
    method: 'get'
  },
  rep_evaluation:{
    url: '/report/rep_evaluation/',
    method: 'get'
  },
  myclients:{
    url: '/report/myclients/',
    method: 'get'
  }
}

export default buildService(settings)
