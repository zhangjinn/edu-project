// import request from '@/api/daycare/mockRequest'

import request from '@/utils/request'

/**
 * 查询摄像头列表
 * @param cameraName
 * @param pageNum
 * @param pageSize
 * @param paged
 * @param sort
 * @param distinct
 * @returns {AxiosPromise}
 */
export function queryCameraList({ cameraName = null, pageNum = null, pageSize = null, paged = null, sort = null, distinct = null }) {
  return request({
    url: `/daycare/camera`,
    method: 'get',
    params: { cameraName, pageNum, pageSize, paged, sort, distinct }
  })
}

/**
 * 获取摄像头详情
 * @param cameraId
 * @returns {AxiosPromise}
 */
export function queryCamera(cameraId) {
  return request({
    url: `/daycare/camera/${cameraId}`,
    method: 'get'
  })
}

/**
 * 新增摄像头
 * @param brand
 * @param cameraName
 * @param deviceSerial
 * @param validateCode
 * @param address
 * @param type
 * @returns {AxiosPromise}
 */
export function createCamera({ brand = 'EZVIZ', cameraName, deviceSerial, validateCode, address, type }) {
  return request({
    url: `/daycare/camera`,
    method: 'post',
    data: { brand, cameraName, deviceSerial, validateCode, address, type }
  })
}

/**
 * 更新摄像头
 * @param cameraId
 * @param brand
 * @param cameraName
 * @param deviceSerial
 * @param validateCode
 * @param address
 * @returns {AxiosPromise}
 */
export function updateCamera({ cameraId, brand = 'EZVIZ', cameraName, deviceSerial, validateCode, address }) {
  return request({
    url: `/daycare/camera/${cameraId}`,
    method: 'put',
    data: { brand, cameraName, deviceSerial, validateCode, address }
  })
}

/**
 * 删除摄像头
 * @param cameraId
 * @returns {AxiosPromise}
 */
export function removeCamera(cameraId) {
  return request({
    url: `/daycare/camera/${cameraId}`,
    method: 'delete'
  })
}

// 授权
/**
 * 查询摄像头列表
 * @param type
 * @param grantId
 * @returns {AxiosPromise}
 */
export function queryCameraAuthorizationList({ type = null, grantId = null }) {
  return request({
    url: `/daycare/camera_authorization`,
    method: 'get',
    params: { type, grantId }
  })
}

/**
 * 摄像头url
 * @param cameraId
 * @param deviceOpenTimeType
 * @returns {AxiosPromise}
 */
export function queryCameraSrc({ cameraId = null, deviceOpenTimeType = null }) {
  return request({
    url: `/daycare/camera_authorization/play`,
    method: 'get',
    params: { cameraId, deviceOpenTimeType }
  })
}

/**
 * 摄像头授权
 * @param type
 * @param grantId
 * @param cameraId
 * @returns {AxiosPromise}
 */
export function updateCameraAuthorization({ type = null, grantId = null, cameraIdList = null }) {
  return request({
    url: `/daycare/camera_authorization`,
    method: 'post',
    data: { type, grantId, cameraIdList }
  })
}

/**
 * 取消授权
 * @param cameraAuthorizationId
 * @returns {AxiosPromise}
 */
export function removeCameraAuthorization(cameraAuthorizationId) {
  return request({
    url: `/daycare/camera_authorization/${cameraAuthorizationId}`,
    method: 'delete'
  })
}

// 应用设置
/**
 * 查询摄像头设置列表
 * @param type
 * @param enableFlag
 * @returns {AxiosPromise}
 */
export function queryCameraSettingList({ type, enableFlag }) {
  return request({
    url: `/daycare/camera_setting/group_by_weekday`,
    method: 'get',
    params: { type, enableFlag }
  })
}

/**
 * 更新摄像头设置
 * @param cameraSettingId
 * @param enable
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function updateCameraSetting({ cameraSettingId = null, enable = null, startTime = null, endTime = null }) {
  return request({
    url: `/daycare/camera_setting/${cameraSettingId}`,
    method: 'put',
    data: { enable, startTime, endTime }
  })
}

// 云视频服务
/**
 * 查询云视频服务
 * @param childName 学员名称
 * @param personName 联系人名称
 * @param parentPhone 联系人电话
 * @param cameraBuyStatusEnum 开通状态
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @param sort 排序信息
 格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
 direction不指定时，默认为asc
 排序字段会按如下优先级去匹配：
 1. 查询的Sifter/ResultType类中定义的字段。
 {@link JpaSifterExecutor#findList(Sifter, Class)}
 {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
 2. entity中的字段。
 3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
 * @returns {AxiosPromise}
 */
export function queryCameratOrderList({ childName = null, personName = null, parentPhone = null, cameraBuyStatusEnum = null, pageNum = null, pageSize = null, paged }) {
  return request({
    url: `/daycare/camera_order/cloud_video`,
    method: 'post',
    data: { childName, personName, parentPhone, cameraBuyStatusEnum, pageNum, pageSize, paged }
  })
}

/**
 * 修改订单的到期时间
 * @param parentPhone 联系人电话
 * @param expireDate 到期日期
 * @returns {AxiosPromise}
 */
export function updateCameratOrder({ parentPhone, expireDate }) {
  return request({
    url: `/daycare/camera_order/order`,
    method: 'put',
    data: { parentPhone, expireDate }
  })
}

/**
 * 关闭服务
 * @param phone
 * @returns {AxiosPromise}
 */
export function removeService(phone) {
  return request({
    url: `/daycare/camera_order/${phone}`,
    method: 'delete'

  })
}

/**
 * 开通服务
 * @param parentPhone 联系人电话
 * @param expireDate 到期日期
 * @returns {AxiosPromise}
 */
export function createService({ childId, phone, expireDate }) {
  return request({
    url: `/daycare/camera_order/off_line_buy`,
    method: 'post',
    data: { childId, phone, expireDate }
  })
}

/**
 * 查询详情
 * @param parentPhone 联系人电话
 * @param childId 学员id
 * @returns {AxiosPromise}
 */
export function queryCamertOrder({ parentPhone, childId }) {
  return request({
    url: `/daycare/camera_order/details`,
    method: 'get',
    params: { parentPhone, childId }
  })
}

// 服务套餐应用配置
/**
 * 查询服务套餐列表
 * @param sort 排序信息
 格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
 direction不指定时，默认为asc
 排序字段会按如下优先级去匹配：
 1. 查询的Sifter/ResultType类中定义的字段。
 {@link JpaSifterExecutor#findList(Sifter, Class)}
 {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
 2. entity中的字段。
 3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
 * @returns {AxiosPromise}
 */
export function queryPackageList({ sort = null }) {
  return request({
    url: `/daycare/camera_service_package`,
    method: 'get',
    params: { sort }
  })
}

/**
 * 新增服务套餐
 * @param sellMoney 套餐金额
 * @param discountMoney 优惠金额
 * @param enable 是否开启
 * @param sort 排序号
 * @param typeId 服务套餐类别_Id
 * @param tenantId 所属企业的ID
 * @returns {AxiosPromise}
 */
export function createPackage({ sellMoney, discountMoney, enable, sort, typeId }) {
  return request({
    url: `/daycare/camera_service_package`,
    method: 'post',
    data: { sellMoney, discountMoney, enable, sort, typeId }
  })
}

/**
 * 更新服务套餐
 * @param cameraServicePackageId
 * @param sellMoney 套餐金额
 * @param discountMoney 优惠金额
 * @param enable 是否开启
 * @param sort 排序号
 * @param typeId 服务套餐类别_Id
 * @returns {AxiosPromise}
 */
export function updatePackage({ cameraServicePackageId, sellMoney, discountMoney, enable, sort, typeId }) {
  return request({
    url: `/daycare/camera_service_package/${cameraServicePackageId}`,
    method: 'put',
    data: { sellMoney, discountMoney, enable, sort, typeId }
  })
}

/**
 * 获取服务套餐
 * @param cameraServicePackageId 服务套餐 ID
 * @returns {AxiosPromise}
 */
export function queryPackage({ cameraServicePackageId }) {
  return request({
    url: `/daycare/camera_service_package/${cameraServicePackageId}`,
    method: 'get'

  })
}

/**
 * 删除服务套餐
 * @param cameraServicePackageId 服务套餐 ID
 * @returns {AxiosPromise}
 */
export function removePackage(cameraServicePackageId) {
  return request({
    url: `/daycare/camera_service_package/${cameraServicePackageId}`,
    method: 'delete'

  })
}

/**
 * 排序
 * @param ids 排序数据id集合
 * @returns {AxiosPromise}
 */
export function sortPackage(ids) {
  return request({
    url: `/daycare/camera_service_package/sort`,
    method: 'post',
    data: { ids }
  })
}

/**
 * 查询服务套餐类别列表
 * @returns {AxiosPromise}
 */
export function queryServiceType() {
  return request({
    url: `/daycare/camera_service_type`,
    method: 'get'
  })
}
