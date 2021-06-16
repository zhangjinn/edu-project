import axios from 'axios'
import { Loading, Message } from 'element-ui'

const service = axios.create({
  timeout: 30000
})
service.defaults.baseURL = process.env.VUE_APP_BASE_API
console.log('当前环境: ', process.env.NODE_ENV)
console.log('当前环境地址: ', process.env.VUE_APP_BASE_API)
let loading = null
// 内存中正在请求的数量
let loadingNum = 0

function startLoading () {
  if (loadingNum === 0) {
    loading = Loading.service({
      fullscreen: true,
      lock: true,
      customClass: 'etm-loading',
      background: 'rgba(0,0,0,.1)'
    })
  }
  // 请求数量加1
  loadingNum++
}

function endLoading () {
  // 请求数量减1
  loadingNum--
  if (loadingNum <= 0) {
    loading.close()
  }
}

service.interceptors.request.use(
  config => {
    config.headers['etm-terminal-platform'] = 'PC'
    config.headers.Authorization = localStorage.getItem('user_login_token')
    if (!config.params || (config.params && !config.params.noLoadding)) {
      startLoading()
    }

    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
let time = null
// response interceptor
service.interceptors.response.use(
  response => {
    if (!response.config.params || (response.config.params && !response.config.params.noLoadding)) {
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
    if (!error.config.params || (error.config.params && !error.config.params.noLoadding)) {
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
