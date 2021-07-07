import {setStore, getStore, getStringStore, removeStore} from './common'

const phoneKey = 'phone'
const tokenkey = 'token'
const userKey = 'user'
const organizationKey = 'organizations'
const organizationIdKey = 'organizationId'
const historyKey = 'searchHistory'
const tokenTimeKey = 'tokenTime'
const expiresInKey = 'expiresIn'
const solutionKey = 'solution'
const routerKey = 'solutionRouter'
const buttonKey = 'BUTTON'

// 存用户手机号码
export const setPhone = function (phone) {
    setStore(phoneKey, phone)
}

// 取用户手机号码
export const getPhone = function () {
    return getStringStore(phoneKey)
}

// 删用户手机号码
export const removePhone = function () {
    return removeStore(phoneKey)
}

// 存token有效时间
export const setExpiresIn = function (expiresIn) {
    setStore(expiresInKey, expiresIn)
}

// 取token有效时间
export const getExpiresIn = function () {
    return getStringStore(expiresInKey)
}

// 删token有效时间
export const removeExpiresIn = function () {
    return removeStore(expiresInKey)
}

// 存token生成时间
export const setTokenTime = function (tokenTime) {
    return localStorage.setItem(tokenTimeKey, tokenTime)
}

// 取token生成时间
export const getTokenTime = function () {
    return getStringStore(tokenTimeKey)
}

// 删token生成时间
export const removeTokenTime = function () {
    return removeStore(tokenTimeKey)
}

// 存用户登录的token
export const setToken = function (token) {
    setStore(tokenkey, token)
}

// 取用户登录的token
export const getToken = function () {
    return getStringStore(tokenkey)
}

// 删用户登录的token
export const removeToken = function () {
    return removeStore(tokenkey)
}

// 存用户信息
export const setLoginInfo = function (user) {
    setStore(userKey, user)
}

// 取用户信息
export const getLoginInfo = function () {
    return getStore(userKey)
}

// 删用户信息
export const removeLoginInfo = function () {
    return removeStore(userKey)
}

// 存用户的组织信息
export const setOrganization = function (data) {
    setStore(organizationKey, data)
}

// 取用户的组织信息
export const getOrganization = function () {
    return getStore(organizationKey)
}

// 删用户的组织信息
export const removeOrganization = function () {
    return removeStore(organizationKey)
}

// 存用户的组织id
export const setOrganizationId = function (index) {
    setStore(organizationIdKey, index)
}

// 取用户的组织id
export const getOrganizationId = function () {
    return parseInt(getStringStore(organizationIdKey))
}

// 删用户的组织id
export const removeOrganizationIndex = function () {
    return removeStore(organizationIdKey)
}

// 存用户的解决方案
export const setSolution = function (solution) {
    setStore(solutionKey, solution)
}

// 取用户的解决方案
export const getSolution = function () {
    return getStore(solutionKey)
}

// 删除用户的解决方案
export const removeSolution = function () {
    return removeStore(solutionKey)
}

// 存解决方案动态路由
export const setSolutionRouter = function (router) {
    setStore(routerKey, router)
}

// 取解决方案动态路由
export const getSolutionRouter = function () {
    return getStore(routerKey)
}

// 删除解决方案动态路由
export const removeSolutionRouter = function () {
    return removeStore(routerKey)
}

// 存解决方案的权限按钮
export const setSolutionButton = function (button) {
    setStore(buttonKey, button)
}

// 取解决方案的权限按钮
export const getSolutionButton = function () {
    return getStore(buttonKey)
}

// 删除解决方案动的权限按钮
export const removeSolutionButton = function () {
    return removeStore(buttonKey)
}

// 存全局搜索的历史记录
export const setSearhHistory = function (history) {
    setStore(historyKey, history)
}

// 取全局搜索的历史记录
export const getSearhHistory = function () {
    return getStore(historyKey)
}

// 删除全局搜索的历史记录
export const removeSearhHistory = function () {
    return removeStore(historyKey)
}

// 注销用户
export const userLogout = function () {
    removeOrganizationIndex()
    removeOrganization()
    removeLoginInfo()
    removeToken()
    removePhone()
    removeExpiresIn()
    removeTokenTime()
    removeSolution()
    removeSolutionRouter()
    removeSolutionButton()
}
