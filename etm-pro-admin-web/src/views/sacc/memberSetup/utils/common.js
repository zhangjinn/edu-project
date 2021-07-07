export function getAttributeType(setting) {
  switch (setting) {
    case 'custom':
      return 0
    case 'follow':
      return 0
    case 'source':
      return 1
    case 'sale':
      return 3
    case 'importance':
      return 4
    case 'state':
      return 5
    case 'contact':
      return 2
    default:
      return 0
  }
}

export function deepCopy(target) {
  const result = Array.isArray(target) ? [] : {}
  if (target && typeof target === 'object') {
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
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
