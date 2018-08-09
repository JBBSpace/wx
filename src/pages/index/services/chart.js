import buildService from '@/pages/index/helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  initCompanyList: {
    url: '/report/viewreport/getcominfo/',
    method: 'get'
  },
  viewreportData: {
    url: '/report/viewreport/rep_xs/',
    method: 'get'
  },
  viewreportDataClass: {
    url: '/report/viewreport/rep_class/',
    method: 'get'
  },
  viewreportDataCompare: {
    url: '/report/viewreport/rep_compare/',
    method: 'get'
  }
}

export default buildService(settings)
