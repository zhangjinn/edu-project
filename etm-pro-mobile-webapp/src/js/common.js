/**
* 公共方法
*/
/**
 * 存储json格式localStorage
 */

import { Notify } from 'vant'
import axios from 'axios'
import { getToken } from '../js/localStore'

export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string' && typeof content !== 'number') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}
/**
 * 获取json格式的localStorage
 */
export const getStore = name => {
  if (!name) return
  return JSON.parse(window.localStorage.getItem(name))
}

/**
 * 获取其他格式的localStorage
 */
export const getStringStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 清除localStorage
 */
export const clearStore = () => {
  window.localStorage.clear()
}

/**
 * 存储sessionStorage
 */
export const setSession = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 */
export const getSession = (name) => {
  if (!name) return
  return JSON.parse(window.sessionStorage.getItem(name))
}
/**
 * 清除sessionStorage
 */
export const removeSession = (name) => {
  return window.sessionStorage.removeItem(name)
}

/**
 * 清除所有sessionStorage
 */
export const clearSession = () => {
  return window.sessionStorage.clear()
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop
  } else if (element.currentStyle) {
    target = element.currentStyle[attr]
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr]
  }
  // 在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode === 'float' ? parseFloat(target) : parseInt(target)
}

/**
 * 下载文件
 * @param res
 */
export function downloadFileForUrl(res) {
  const link = document.createElement('a')
  link.href = res.url
  const fileName = res.fileName || 'unknown'
  link.setAttribute('download', fileName)
  link.click()
}


/**
 * 导出下载文件
 * @param method
 * @param url
 * @param params
 * @returns {AxiosPromise<any>}
 */
export function downloadFile({ method = 'post', url, params }) {
  return axios({
    method: method,
    url: url,
    params,
    responseType: 'blob',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': getToken(),
      'etm-terminal-platform': 'PC'
    }
  }).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    let fileName = 'unknown'
    const contentDisposition = res.headers['content-disposition']
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename=(.+)/)
      if (fileNameMatch.length === 2) {
        fileName = decodeURIComponent(fileNameMatch[1])
      }
    }
    return {
      url, fileName
    }
  }).catch(error => {
    if (!error.response) {
      return Promise.reject(error)
    }
    if (error.response.status === 401) {

      // Message({
      //   message: '登陆超时, 请重新登陆',
      //   type: 'error',
      //   duration: 2 * 1000
      // })
      // removeAllInfo()
      // router.push('/login')
      // location.reload()
      Notify({
        type : 'danger',
        message : '登陆超时, 请重新登陆'
      })
      return Promise.reject(error)
    }
    // 服务正在启动
    if (error.response.status === 503) {
      // Message({
      //   message: '该功能升级中, 请稍后再试',
      //   type: 'info',
      //   duration: 2 * 1000
      // })

      Notify({
        type : 'danger',
        message : '该功能升级中, 请稍后再试'
      })
      return Promise.reject(error)
    }
    // Message({
    //   message: '服务器繁忙, 请稍后再试',
    //   type: 'error',
    //   duration: 2 * 1000
    // })

    Notify({
      type : 'danger',
      message : '服务器繁忙, 请稍后再试'
    })
    return Promise.reject(error)
  })
}