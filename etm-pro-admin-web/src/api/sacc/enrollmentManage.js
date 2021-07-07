import request from '@/utils/request'

// 查询员工列表
export function getAllEmployee(data) {
  return request({
    url: `/basic/v2/employee`,
    method: 'get',
    params: data
  })
}

// 查询报名订单列表
export function getCareOrderList(data) {
  return request({
    url: `/sacc/order`,
    method: 'get',
    params: data
  })
}

// 检测联系人和宝贝姓名是否存在
export function checkCustomer(data) {
  return request({
    url: `/sacc/order/check`,
    method: 'get',
    params: data
  })
}

// 新增签约
export function postNewOrder(data) {
  return request({
    url: `/sacc/order`,
    method: 'post',
    data
  })
}

// 更新签约信息
export function modifyOrder(orderId, data) {
  return request({
    url: `/sacc/order/${orderId}`,
    method: 'put',
    data
  })
}

// 获取签约详情
export function getOrderDetail(orderId) {
  return request({
    url: `/sacc/order/${orderId}`,
    method: 'get'
  })
}

// 签约审核接口
export function auditOrder(data) {
  return request({
    url: `/sacc/order/audit`,
    method: 'put',
    data
  })
}

// 更新已审核签约
export function renewPassOrder(orderId, data) {
  return request({
    url: `/sacc/order/renew/${orderId}`,
    method: 'put',
    data
  })
}

// 删除订单
export function deleteOrder(orderId) {
  return request({
    url: `/sacc/order/${orderId}`,
    method: 'delete'
  })
}

// 查询托管类型列表
export function getCareType() {
  return request({
    url: `/sacc/care_type`,
    method: 'get'
  })
}

// 查询启用托管类型列表
export function getCareTypeEnable() {
  return request({
    url: `/sacc/care_type/enable`,
    method: 'get'
  })
}

// 新增托管类型
export function addCareType(data) {
  return request({
    url: `/sacc/care_type`,
    method: 'post',
    data
  })
}

// 更新托管类型
export function updateCareType(careTypeId, data) {
  return request({
    url: `/sacc/care_type/${careTypeId}`,
    method: 'put',
    data
  })
}

// 删除托管类型
export function deleteCareType(careTypeId) {
  return request({
    url: `/sacc/care_type/${careTypeId}`,
    method: 'delete'
  })
}

// 查询托管套餐列表
export function getCarePackage() {
  return request({
    url: `/sacc/care_package`,
    method: 'get'
  })
}

// 查询启用托管套餐列表
export function getCarePackageEnable() {
  return request({
    url: `/sacc/care_package/enable`,
    method: 'get'
  })
}

// 新增托管套餐
export function addCarePackage(data) {
  return request({
    url: `/sacc/care_package`,
    method: 'post',
    data
  })
}

// 更新托管套餐
export function updateCarePackage(carePackageId, data) {
  return request({
    url: `/sacc/care_package/${carePackageId}`,
    method: 'put',
    data
  })
}

// 删除托管套餐
export function deleteCarePackage(carePackageId) {
  return request({
    url: `/sacc/care_package/${carePackageId}`,
    method: 'delete'
  })
}

// 查询餐费标准列表
export function getMealsPrice() {
  return request({
    url: `/sacc/meals_price`,
    method: 'get'
  })
}

// 查询启用的餐费标准列表
export function getMealsPriceEnable() {
  return request({
    url: `/sacc/meals_price/enable`,
    method: 'get'
  })
}

// 新增餐费标准
export function addMealsPrice(data) {
  return request({
    url: `/sacc/meals_price`,
    method: 'post',
    data
  })
}

// 更新餐费标准
export function updateMealsPrice(mealsPriceId, data) {
  return request({
    url: `/sacc/meals_price/${mealsPriceId}`,
    method: 'put',
    data
  })
}

// 删除餐费标准
export function deleteMealsPrice(mealsPriceId) {
  return request({
    url: `/sacc/meals_price/${mealsPriceId}`,
    method: 'delete'
  })
}

// 查询材料物品列表
export function getMaterial() {
  return request({
    url: `/sacc/material`,
    method: 'get'
  })
}

// 查询启用的材料物品列表
export function getMaterialEnable() {
  return request({
    url: `/sacc/material/enable`,
    method: 'get'
  })
}

// 新增材料物品
export function addMaterial(data) {
  return request({
    url: `/sacc/material`,
    method: 'post',
    data
  })
}

// 更新材料物品
export function updateMaterial(materialId, data) {
  return request({
    url: `/sacc/material/${materialId}`,
    method: 'put',
    data
  })
}

// 删除材料物品
export function deleteMaterial(materialId) {
  return request({
    url: `/sacc/material/${materialId}`,
    method: 'delete'
  })
}

// 查询日历列表
export function getCalendar(data) {
  return request({
    url: `/sacc/calendar`,
    method: 'get',
    params: data
  })
}

// 更新日历
export function renewCalendar(data) {
  return request({
    url: `/sacc/calendar`,
    method: 'put',
    data
  })
}

// 获取假期设置
export function getHolidayOption(data) {
  return request({
    url: `/sacc/enum`,
    method: 'get',
    params: data
  })
}

// 获取教务设置
export function getHoliday() {
  return request({
    url: `/sacc/holiday_setting`,
    method: 'get'
  })
}

// 更新教务设置
export function renewHoliday(educationalSettingId, data) {
  return request({
    url: `/sacc/holiday_setting/${educationalSettingId}`,
    method: 'put',
    data
  })
}
