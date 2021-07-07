// import Cookies from 'js-cookie'
const Cookies = {
  get(item) {
    try {
      return localStorage.getItem(item)
    } catch (e) {
      console.log(e)
      return null
    }
  },
  set(item, value) {
    const data = typeof value === 'object' ? JSON.stringify(value) : value
    localStorage.setItem(item, data)
  },
  remove(item) {
    localStorage.removeItem(item)
  }
}
const TokenKey = 'user_login_token'
const OrganizationKey = 'organizations'
const CurrentOrganizationKey = 'currentOrganizationId'
const AccountKey = 'account'
const RoleKey = 'roleList'
const phoneKey = 'phone'
const firstLogin = 'firstLogin'
const theme = 'theme'
const selectedValuationRow = 'selectedValuationRow' // 报告管理里的观测列表选中的观测
const customerType = 'customerType' // 客户线索中判断是当前客户类型，例如是添加客户还是修改客户
const selectedCustomerRow = 'selectedCustomerRow' // 客户线索中选中的当前客户列表里的一条数据
const recipesType = 'recipesType' // 食谱列表中选中的当前客户列表里的一条数据
const selectedRecipesRow = 'selectedRecipesRow' // 食谱列表中选中的当前客户列表里的一条数据
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removePhone() {
  return Cookies.remove(phoneKey)
}

export function removefirstLogin() {
  return Cookies.remove(firstLogin)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getOrganization() {
  if (localStorage.getItem(OrganizationKey)) {
    return JSON.parse(localStorage.getItem(OrganizationKey))
  }
}

export function getCurrentOrganizationId() {
  if (localStorage.getItem(CurrentOrganizationKey)) {
    return JSON.parse(localStorage.getItem(CurrentOrganizationKey))
  }
}

export function getCurrentOrganizationObject() {
  const organizationId = getCurrentOrganizationId()
  const organizations = JSON.parse(localStorage.getItem('organizations')) || []
  return organizations.find(item => item.organizationId === organizationId)
}

export function getAccount() {
  if (Cookies.get(AccountKey)) {
    return JSON.parse(Cookies.get(AccountKey))
  }
}

export function getPhone() {
  if (Cookies.get(phoneKey)) {
    return Cookies.get(phoneKey)
  }
}

export function getFirstLogin() {
  if (Cookies.get(firstLogin)) {
    return Cookies.get(firstLogin)
  }
}

export function getRole() {
  if (Cookies.get(RoleKey)) {
    return JSON.parse(Cookies.get(RoleKey))
  }
}

export function getTheme() {
  return Cookies.get(theme) || 'theme-default'
}

export function setTheme(t) {
  return Cookies.set(theme, t)
}

export function setOrganization(token) {
  return localStorage.setItem(OrganizationKey, JSON.stringify(token))
}

export function setCurrentOrganizationId(id) {
  return localStorage.setItem(CurrentOrganizationKey, JSON.stringify(id))
}

export function setSelectedValuationRow(row) {
  return sessionStorage.setItem(selectedValuationRow, JSON.stringify(row))
}

export function getSelectedValuationRow(row) {
  return JSON.parse(sessionStorage.getItem(selectedValuationRow))
}

export function setAccount(token) {
  return Cookies.set(AccountKey, token)
}

export function setRole(token) {
  return Cookies.set(RoleKey, token)
}

export function setPhone(token) {
  return Cookies.set(phoneKey, token)
}

export function setFirstLogin(token) {
  return Cookies.set(firstLogin, token)
}

export function removeAllInfo() {
  console.warn('正在清除缓存')
  const whiteList = ['hostConfig']
  const data = {}
  whiteList.forEach(item => {
    for (let i = 0; i < localStorage.length; i++) {
      const name = localStorage.key(i)
      const value = localStorage.getItem(name)
      if (name === item) {
        data[name] = value
      }
    }
  })
  localStorage.clear()
  sessionStorage.clear()
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(key, value)
  }
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export function getOrganizationId() {
  let orgArr = []
  orgArr = getOrganization()
  if (orgArr !== undefined && orgArr.length > 0) {
    return orgArr[0].belongCompanyId
  } else {
    return null
  }
}

export function setCustomerType(row) {
  return sessionStorage.setItem(customerType, JSON.stringify(row))
}

export function getCustomerType() {
  return JSON.parse(sessionStorage.getItem(customerType))
}

export function setSelectedCustomerRow(row) {
  return sessionStorage.setItem(selectedCustomerRow, JSON.stringify(row))
}

export function getSelectedCustomerRow(row) {
  return JSON.parse(sessionStorage.getItem(selectedCustomerRow))
}

export function setRecipesType(type) {
  return sessionStorage.setItem(recipesType, JSON.stringify(type))
}

export function getRecipesType() {
  return JSON.parse(sessionStorage.getItem(recipesType))
}

export function setSelectedRecipesRow(row) {
  return sessionStorage.setItem(selectedRecipesRow, JSON.stringify(row))
}

export function getSelectedRecipesRow() {
  return JSON.parse(sessionStorage.getItem(selectedRecipesRow))
}

// 判断是否是超级管理员
export function isProperty() {
  let orgArr = []
  orgArr = getOrganization()
  if (orgArr !== undefined && orgArr.length > 0) {
    if (orgArr[0].property === 1) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export function getPersonId() {
  return getAccount().person
}

export function compare(property) {
  return function(a, b) {
    const value1 = a[property]
    const value2 = b[property]
    return value1 - value2
  }
}

export function createAuth() {
  const data = JSON.parse(localStorage.getItem('CACHESOLUTION'))

  function findAuthOfButton(data, type) {
    for (const datum of data) {
      if (datum.type === type) {
        result.push(datum)
      }
      if (datum.childList && datum.childList.length) {
        findAuthOfButton(datum.childList, type)
      }
    }
    return result
  }

  const result = []
  for (const datum of data) {
    for (const resourceListElement of datum.resourceList) {
      findAuthOfButton(resourceListElement.childList, 'BUTTON')
    }
  }

  const finalResult = result.map(item => {
    delete item.childList
    return {
      ...item
    }
  })
  localStorage.setItem('BUTTON', JSON.stringify(finalResult))
}

export function transferLoginData(data) {
  const result = {
    token: data.token,
    phone: data.telephone,
    firstLogin: !data.hasPassword,
    currentOrganizationId: data.currentOrganizationId,
    account: data.account ? {
      icon: data.account.avatar,
      id: data.account.id,
      name: data.account.name
    } : null,
    organizations: []
  }
  Array.isArray(data.organizationList) && data.organizationList.forEach(v => {
    result.organizations.push({
      organizationId: v.id,
      organizationLogo: v.logo,
      organizationName: v.name,
      ...v
    })
  })
  return result
}

export function getConfig() {
  const hostConfig = JSON.parse(window.localStorage.getItem('hostConfig')) || {}
  if (hostConfig.config) {
    return JSON.parse(hostConfig.config)
  } else {
    return {}
  }
}

