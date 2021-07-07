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

