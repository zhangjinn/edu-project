// 引入 axios
import axios from 'axios'
import { Toast } from 'vant'
import { getToken, userLogout } from '../js/localStore'
import router from '../router'

// 控制页面内出现多次加载动画；
let reqNum = 0
const whiteList = ['/basic/auth/captcha']

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 默认设置post请求头
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加请求拦截器,在请求前做相关操作
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  // 请求头里带入token
  config.headers['etm-terminal-platform'] = 'MOBILE'
  if (getToken()) {
    config.headers['Authorization'] = getToken()
  }
  if (localStorage.getItem('orgId')) {
    config.headers['etm-organization-id'] = localStorage.getItem('orgId')
  }
  // 此处对数据或接口进行处理判定
  reqNum++
  // 加载动画
  Toast.loading({
    duration: 0,
    mask: false,
    forbidClick: true,
    message: '加载中...'
  })
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器，对获取到的响应统一处理
service.interceptors.response.use(res => {
  // 对响应数据做点什么
  // 关闭加载动画
  setTimeout(function() {
    reqNum--
    if (reqNum <= 0) {
      Toast.clear()
    }
  }, 50)

  let url = res.config.url
  if (res.config.url.indexOf('?') !== -1) {
    url = res.config.url.split('?')[0]
  }
  if (url.indexOf(res.config.baseURL) !== -1) {
    url = url.replace(res.config.baseURL, '')
  }
  if (whiteList.indexOf(url) === -1 && res.data.code !== 0) {
    setTimeout(function() {
      Toast({
        message: res.data.detail || res.data.message,
        duration: 1000,
        icon: 'icon iconfont iconwrong'
      })
    }, 50)
    return Promise.reject(res.data.detail || res.data.message)
  }
  return res
}, error => {
  // 对响应错误做点什么
  setTimeout(function() {
    reqNum--
    if (reqNum <= 0) {
      Toast.clear()
      if (error.response) {
        if (error.response.status === 401) {
          setTimeout(() => {
            Toast({
              message: 'token已失效，请重新登录',
              duration: 1000,
              icon: 'icon iconfont iconwarning'
            })
          }, 50)
          setTimeout(() => {
            userLogout()
            if (localStorage.getItem('platform') === 'wechat') {
              const orgId = localStorage.getItem('orgId')
              router.replace({
                path: '/wechatLogin',
                query: {
                  organizationId: orgId
                }
              })
            } else {
              router.replace({
                path: '/passwordLogin'
              })
            }
          }, 1000)
        } else if (error.response.status === 503) {
          setTimeout(() => {
            Toast({
              message: '该功能升级中，请稍后再试',
              duration: 1000,
              icon: 'icon iconfont iconwrong'
            })
          }, 50)
        } else {
          setTimeout(() => {
            Toast({
              message: '服务器繁忙',
              duration: 1000,
              icon: 'icon iconfont iconwrong'
            })
          }, 50)
        }
      } else {
        setTimeout(() => {
          Toast({
            message: '请求超时',
            duration: 1000,
            icon: 'icon iconfont iconwrong'
          })
        }, 50)
        setTimeout(() => {
          router.push({
            path: '/error'
          })
        }, 1000)
      }
    }
  }, 50)
  return Promise.reject(error)
})

export default service
