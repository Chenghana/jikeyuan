// 基于axios封装请求的模块
import theAxios from 'axios'
// 引入路由
import router from '@/router/index.js'
// 提示
import { MyNotify } from '@/ui/Notift.js'
// 获取token的方法
import { getToken, removeToken } from '@/utils/token.js'
// import { getNewTokenAPI } from '@/api'
const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net/',
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
    console.log(config)
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, async function (error) {
  if (error.response.status === 401) {
    MyNotify({ type: 'warning', message: '身份过期' })
    // 方式1：清除token，强制跳转登录
    removeToken()
    // router.replace('/login')
    // store.commit('setToken', '')
    console.log(router.currentRoute.fullPath)
    // router.currentRoute 相当于vue组件中的this.$route  当前的路由信息
    router.push({ path: `/login?path=${router.currentRoute.fullPath}` })
    // 方式2：使用refresh_token 换回新的token再继续使用js代码实现，用户无感知
    // const res = await getNewTokenAPI()
    // console.log(res)
    //  新的token回来之后，我们做什么
    // 1.更新token在本地
    // setToken(res.data.data.token)
    // 2.更新新的token在请求头里
    // error.config.headers.Authorization = `Bearer ${res.data.date.token}`
    // 3..未完成本次请求，再次发起
    // return axios(error.config)
  }
  return Promise.reject(error)
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
}
