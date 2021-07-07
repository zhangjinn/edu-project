import { CODE_HASH } from './auth_code_table'

/**
 * 通过对象法获取code, 用于权限
 * @param path {string} -- basic.employee.add
 * @returns {string|null}
 */
export function getCodeByPath(path) {
  if (!path || typeof path !== 'string') {
    return null
  }
  const pathSplit = path.split('.')
  let code = ''
  let resultPath = CODE_HASH[pathSplit.shift()]
  code += resultPath.code
  while (pathSplit.length !== 0) {
    resultPath = resultPath[pathSplit.shift()]
    code += resultPath.code
  }
  return code || null
}

/**
 * 是否禁用微信登录 没有字段和字段为false都显示, 只有值为true才隐藏
 * @returns {boolean}
 */
export function isDisableWechat() {
  try {
    const config = JSON.parse(JSON.parse(localStorage.getItem('hostConfig')).config)
    return config.isDisableWeChat !== true
  } catch (e) {
    console.debug(`index.js:32 isDisableWeChat, error: ${e}`)
  }
}

/**
 * 是否禁用移动端入口
 * @returns {boolean}
 */
export function isDisableMobile() {
  try {
    const config = JSON.parse(JSON.parse(localStorage.getItem('hostConfig')).config)
    console.log('src/auth/index.js:43', config)
    return config.isDisableMobile !== true
  } catch (e) {
    console.debug(`index.js:44 isDisableMobile, error: ${e}`)
  }
}

/**
 * 是否禁用主题切换
 * @returns {boolean}
 */
export function isDisableTheme() {
  try {
    const config = JSON.parse(JSON.parse(localStorage.getItem('hostConfig')).config)
    return config.isDisableTheme !== true
  } catch (e) {
    console.debug(`index.js:57 isDisableTheme, error: ${e}`)
  }
}
