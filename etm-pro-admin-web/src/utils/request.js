import axios from 'axios'
import { Loading, Message } from 'element-ui-etm'
import store from '@/store'
import { getToken, removeAllInfo } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  // baseURL: baseUrl, // url = base url + request url
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

service.defaults.baseURL = process.env.VUE_APP_BASE_API

console.log('当前环境: ', process.env.NODE_ENV)
console.log('当前环境地址: ', process.env.VUE_APP_BASE_API)
// TODO 用于开发时快速切换环境, 不要提交
// service.defaults.baseURL = 'http://192.168.3.129:9999'

// request interceptor

let loading
// 内存中正在请求的数量
let loadingNum = 0

function startLoading() {
  if (loadingNum === 0) {
    loading = Loading.service({
      fullscreen: true,
      lock: true,
      customClass: 'etm-loading',
      // text: '数据加载中...',
      // spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,.1)'
    })
  }
  // 请求数量加1
  loadingNum++
}

function endLoading() {
  // 请求数量减1
  loadingNum--
  if (loadingNum <= 0) {
    /**
     * 修复连续调用接口时定时器不生效的问题
     * 1.纽诺/订单/排课/自动排课时
     */
    // setTimeout(() => {
    //
    // }, 30)
    loading.close()
  }
}

service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['etm-terminal-platform'] = 'PC'
    if (store.getters.token) {
      // let each request carry token
      config.headers['Authorization'] = getToken()
    }
    // console.log(JSON.stringify(config.data || config.params, null, 2))

    if (!config['params'] || (config['params'] && !config.params['noLoadding'])) {
      startLoading()
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
let time = null
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (!response.config['params'] || (response.config['params'] && !response.config.params['noLoadding'])) {
      endLoading()
    }
    const res = response.data

    if (res.code !== 0) {
      Message({
        message: res.detail || res.message || '服务器开小差了',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(res.detail)
    }

    return res
  },
  error => {
    // endLoading()
    if (!error.config['params'] || (error.config['params'] && !error.config.params['noLoadding'])) {
      endLoading()
    }

    time && clearTimeout(time)
    time = setTimeout(() => {
      // 超时没权限
      if (error.response.status === 401) {
        Message({
          message: '登陆超时, 请重新登陆',
          type: 'error',
          duration: 2 * 1000
        })
        removeAllInfo()
        router.push('/login')
        location.reload()
        return Promise.reject(error)
      }
      // 服务正在启动
      if (error.response.status === 503) {
        Message({
          message: '该功能升级中, 请稍后再试',
          type: 'info',
          duration: 2 * 1000
        })
        return Promise.reject(error)
      }
      // console.log(error.response) // for debug
      Message({
        message: '服务器繁忙, 请稍后再试',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }, 3000)
  }
)

export default service
