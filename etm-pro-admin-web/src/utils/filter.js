import Vue from 'vue'

/**
 * 名字转2位字, 用于默认头像
 */
Vue.filter('name2img', (value, length = 2) => {
  if (value.length <= length) {
    return value
  }
  return value.slice(value.length - length, value.length)
})

