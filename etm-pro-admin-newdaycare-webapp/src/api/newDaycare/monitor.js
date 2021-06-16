import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// ----------------监控设置----------------

/**
 * 查询设备开放时间列表
 * @param type 开放时间类型
  EMPLOYEE :员工
  PARENT :家长
 * @returns {AxiosPromise}
 */
export function queryDeviceOpenTimeList ({ type }) {
  return request({
    url: '/guardcare/device_open_time',
    method: 'get',
    params: { type }
  })
}

/**
 * 更新设备开放时间
 * @param deviceOpenTimeId
 * @param weekDay 日期
 * @param sort 排序
 * @param start 开放时间开始
 * @param end 开放时间结束
 * @param type 开放时间类型
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function updateDeviceOpenTime ({ deviceOpenTimeId, weekDay, sort, start, end, type, enable }) {
  return request({
    url: `/guardcare/device_open_time/${deviceOpenTimeId}`,
    method: 'put',
    data: { weekDay, sort, start, end, type, enable }
  })
}

/**
 * 查询云视频套餐列表
 * @param enable 启用状态
 * @returns {AxiosPromise}
 */
export function queryServiceList ({ enable }) {
  return request({
    url: '/guardcare/device_service',
    method: 'get',
    params: { enable }
  })
}

/**
 * 新增云视频套餐
 * @param countMonth 持续月份
 * @param price 价格
 * @param discountPrice 优惠价
 * @param sort 排序
 * @param isEnable 是否启用
 * @returns {AxiosPromise}
 */
export function createService ({ countMonth, price, discountPrice, sort, isEnable }) {
  return request({
    url: '/guardcare/device_service',
    method: 'post',
    data: { countMonth, price, discountPrice, sort, isEnable }
  })
}

/**
 * 删除云视频套餐
 * @param deviceServiceId 云视频套餐 ID
 * @returns {AxiosPromise}
 */
export function removeService ({ deviceServiceId }) {
  return request({
    url: `/guardcare/device_service/${deviceServiceId}`,
    method: 'delete'
  })
}

/**
 * 更新云视频套餐
 * @param deviceServiceId
 * @param countMonth 持续月份
 * @param price 价格
 * @param discountPrice 优惠价
 * @param sort 排序
 * @param isEnable 是否启用
 * @returns {AxiosPromise}
 */
export function updateService ({ deviceServiceId, countMonth, price, discountPrice, sort, isEnable }) {
  return request({
    url: `/guardcare/device_service/${deviceServiceId}`,
    method: 'put',
    data: { countMonth, price, discountPrice, sort, isEnable }
  })
}

/**
 * 修改云视频套餐排序
 * @param ids id列表, 后端按list顺序进行排序
 * @returns {AxiosPromise}
 */
export function updateServiceSort ({ ids }) {
  return request({
    url: '/guardcare/device_service/sort',
    method: 'put',
    data: { ids }
  })
}

// ----------------摄像头列表页----------------

/**
 * 查询摄像头列表
 * @param cameraName 名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryCamsList ({ cameraName, pageNum, pageSize }) {
  return request({
    url: '/guardcare/camera',
    method: 'get',
    params: { cameraName, pageNum, pageSize }
  })
}

/**
 * 新增摄像头
 * @param brand 品牌
 * @param serialNumber 序列号
 * @param verifyCode 验证码
 * @param cameraName 名称
 * @param position 位置
 * @returns {AxiosPromise}
 */
export function createCam ({ brand, serialNumber, verifyCode, cameraName, position }) {
  return request({
    url: '/guardcare/camera',
    method: 'post',
    data: { brand, serialNumber, verifyCode, cameraName, position }
  })
}

/**
 * 删除摄像头
 * @param cameraId 摄像头 ID
 * @returns {AxiosPromise}
 */
export function removeCam ({ cameraId }) {
  return request({
    url: `/guardcare/camera/${cameraId}`,
    method: 'delete'
  })
}

/**
 * 获取摄像头
 * @param cameraId 摄像头 ID
 * @returns {AxiosPromise}
 */
export function queryCamDetail ({ cameraId }) {
  return request({
    url: `/guardcare/camera/${cameraId}`,
    method: 'get'
  })
}

/**
 * 更新摄像头
 * @param cameraId
 * @param brand 品牌
 * @param serialNumber 序列号
 * @param verifyCode 验证码
 * @param cameraName 名称
 * @param position 位置
 * @returns {AxiosPromise}
 */
export function updateCamDetail ({ cameraId, brand, serialNumber, verifyCode, cameraName, position }) {
  return request({
    url: `/guardcare/camera/${cameraId}`,
    method: 'put',
    data: { brand, serialNumber, verifyCode, cameraName, position }
  })
}

// ----------------云视频服务列表页----------------

/**
 * 查询云视频套餐开通记录列表
 * @param childName 幼儿姓名
 * @param parentName 家长姓名
 * @param phone 联系电话
 * @param status 状态
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryServiceRecordList ({ childName, parentName, phone, status, clazzId, pageNum, pageSize }) {
  return request({
    url: '/guardcare/device_service_record/list',
    method: 'post',
    params: { pageNum, pageSize },
    data: { childName, parentName, phone, status, clazzId }
  })
}

/**
 * 关闭云视频服务
 * @param deviceServiceRecordId 云服务开通id
 * @returns {AxiosPromise}
 */
export function closeService ({ deviceServiceRecordId }) {
  return request({
    url: '/guardcare/device_service_record/close',
    method: 'put',
    data: { deviceServiceRecordId }
  })
}

/**
 * 新增云视频套餐开通记录
 * @param parentId 家长id
 * @param paymentType 支付方式
 * @param serviceId 套餐id
 * @param expireDate 到期日期
 * @param payType 支付方式
 * @param totalAmount 应收总金额
 * @param actualAmount 实收总金额
 * @returns {AxiosPromise}
 */
export function addService ({ parentId, paymentType, serviceId, expireDate, totalAmount, actualAmount, childId }) {
  return request({
    url: '/guardcare/device_service_record',
    method: 'post',
    data: { parentId, paymentType, serviceId, expireDate, payType: 'OFFLINE', totalAmount, actualAmount, childId }
  })
}

/**
 * 导出云视频套餐开通记录列表
 * @param childName 幼儿姓名
 * @param parentName 家长姓名
 * @param phone 联系电话
 * @param status 状态
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function exportServiceList (data) {
  const url = '/guardcare/device_service_record/export'
  return downloadFile({ method: 'get', url, params: data })
}

// ----------------授权弹窗----------------

/**
 * 查询摄像头列表
 * @param cameraName 名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryCamListNoPage (cameraName) {
  return request({
    url: '/guardcare/camera',
    method: 'get',
    params: { cameraName, paged: false }
  })
}

// ----------------班级授权页----------------

/**
 * 查询年级列表
 * @param name 年级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryGradeList () {
  return request({
    url: '/guardcare/educational/grade',
    method: 'get',
    params: { paged: false }
  })
}

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryClazzList (gradeId) {
  return request({
    url: '/guardcare/educational/clazz',
    method: 'get',
    params: { gradeId, paged: false }
  })
}

/**
 * 查询班级摄像头列表信息, 用于PC
 * @param clazzId 班级id
 * @returns {AxiosPromise}
 */
export function queryClazzAuthCamsList (clazzId) {
  return request({
    url: '/guardcare/camera/clazz',
    method: 'get',
    params: { clazzId, paged: false }
  })
}

/**
 * 对班级授权
 * @param clazzId 班级id
 * @param deviceIdList 摄像头id
 * @returns {AxiosPromise}
 */
export function createClazzAuthCams ({ clazzId, deviceIdList }) {
  return request({
    url: '/guardcare/camera/grant/clazz',
    method: 'post',
    data: { clazzId, deviceIdList }
  })
}

/**
 * 取消班级授权
 * @param clazzId 班级id
 * @param deviceId 摄像头id
 * @returns {AxiosPromise}
 */
export function cancelClazzAuthCam ({ clazzId, deviceId }) {
  return request({
    url: '/guardcare/camera/cancel_grant/clazz',
    method: 'put',
    data: { clazzId, deviceId }
  })
}

// ----------------员工授权页----------------

/**
 * 查询当前企业的员工列表
 * @param tagCode 员工标签
  TEACHER :老师，员工标签
  HEAD_TEACHER :班主任，员工标签
  DEAN :教务主任，员工标签
  REGIONAL_MANAGER :区域经理，员工标签
  SCHOOL :园所，部门标签
  PRINCIPAL :园长
 * @returns {AxiosPromise}
 */
export function queryEmployeeList () {
  return request({
    url: '/basic/v2/enterprise/employee',
    method: 'get'
  })
}

/**
 * 查询员工已授权摄像头列表, 用于BM
 * @param employeeId 员工Id
 * @returns {AxiosPromise}
 */
export function queryEmployeeAuthCamsList (employeeId) {
  return request({
    url: '/guardcare/camera/grant/employee',
    method: 'get',
    params: { employeeId, paged: false }
  })
}

/**
 * 对员工授权
 * @param employeeId 员工Id
 * @param deviceIdList 摄像头id
 * @returns {AxiosPromise}
 */
export function createEmployeeAuthCams ({ employeeId, deviceIdList }) {
  return request({
    url: '/guardcare/camera/grant/employee',
    method: 'post',
    data: { employeeId, deviceIdList }
  })
}

/**
 * 取消员工授权
 * @param employeeId 员工Id
 * @param deviceId 摄像头id
 * @returns {AxiosPromise}
 */
export function cancelEmployeeAuthCam ({ employeeId, deviceId }) {
  return request({
    url: '/guardcare/camera/cancel_grant/employee',
    method: 'put',
    data: { employeeId, deviceId }
  })
}

/**
 * 摄像头播放
 * @param cameraId 摄像头id
 * @param deviceOpenTimeType 播放类型
  EMPLOYEE :员工
  PARENT :家长
 * @returns {AxiosPromise}
 */
export function cameraPlay ({ cameraId, deviceOpenTimeType }) {
  return request({
    url: '/guardcare/camera/play',
    method: 'get',
    params: { cameraId, deviceOpenTimeType }
  })
}
