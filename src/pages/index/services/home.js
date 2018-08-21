import buildService from '@/pages/index/helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  check: {
    url: '/getbindinguri/',
    method: 'get'
  },
  menus: {
    url: '/company/usermenulist/',
    method: 'get'
  }
}

export default buildService(settings)

