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
  }
}

export default buildService(settings)
