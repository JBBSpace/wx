/**
 * axios实例的包装方法,返回axios实例,调用和原始axios实例方法相同
 * then通过拦截器,返回接口原始数据(axios返回{config,data,header,request},其中data为原始数据),
 * 拦截会在retCode等于0000才会正常返回,否则会进入catch(reject),把错误信息反馈给用户,使用时一般不用自己处理catch,但要写catch(()=>{})捕获
 * 如需跳过拦截器,可通过设置intercept值
 * @returns axios interceptor instance
 */
import Axios from 'axios'
import util from './util'
import store from '../store/index'
// 创建自定义实例默认值
const instance = Axios.create({
  baseURL: util.apiServer,
  url: '',
  timeout: 10000,
  responseType: 'json',
  withCredentials: true,
  intercept: 'all' // 拦截器选项,all:then和catch均通过拦截器,resolve:只有then通过拦截器,reject:只有catch通过拦截器,none:then和catch均不通过拦截器
})
instance.interceptors.request.use((config) => {
  store.commit('toggleLoading');
  return config
})
instance.interceptors.response.use(
  (res) => {
    if (
      res.config.intercept !== 'none' &&
        res.config.intercept !== 'reject'
    ) {
      if (res.data.retCode === '0000') {
        // return res
      }
    }
    store.commit('toggleLoading');
    return res
  },
  (err) => {
    store.commit('toggleLoading');
    return Promise.reject(err)
  }
)

export default instance
