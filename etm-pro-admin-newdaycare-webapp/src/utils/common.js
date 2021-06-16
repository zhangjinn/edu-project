import printJS from 'print-js'

export function deepCopy (target) {
  const result = Array.isArray(target) ? [] : {}
  if (target && typeof target === 'object') {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (target[key] && typeof target[key] === 'object') {
          result[key] = deepCopy(target[key])
        } else {
          result[key] = target[key]
        }
      }
    }
  }
  return result
}

export function Print (node, config = {}) {
  let nactiveNode
  config = Object.assign({
    type: 'raw-html',
    style: ''
  }, config)

  config.style = 'table{border-collapse: collapse;border-spacing: 0;}' + config.style

  if (node) {
    nactiveNode = typeof node === 'string' ? document.querySelector(node) : node.$el
  } else if (config.type === 'html' || config.type === 'raw-html') {
    throw new Error('html,raw-html类型请传入节点')
  }

  if (config.type === 'html') {
    config.printable = nactiveNode
  } else if (config.type === 'raw-html') {
    config.printable = nactiveNode.outerHTML
  }

  printJS(config)
}
