// import request from '@/api/newdaycare/mockRequest'
import { downloadFile } from '@/api/base/base'
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
    url: `/newdaycare/camera`,
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
    url: `/newdaycare/camera/${cameraId}`,
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
 * @returns {AxiosPromise}
 */
export function createCamera({ brand = 'EZVIZ', cameraName, deviceSerial, validateCode, address }) {
  return request({
    url: `/newdaycare/camera`,
    method: 'post',
    data: { brand, cameraName, deviceSerial, validateCode, address }
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
    url: `/newdaycare/camera/${cameraId}`,
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
    url: `/newdaycare/camera/${cameraId}`,
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
    url: `/newdaycare/camera_authorization`,
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
    url: `/newdaycare/camera_authorization/play`,
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
    url: `/newdaycare/camera_authorization`,
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
    url: `/newdaycare/camera_authorization/${cameraAuthorizationId}`,
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
    url: `/newdaycare/camera_setting/group_by_weekday`,
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
    url: `/newdaycare/camera_setting/${cameraSettingId}`,
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
    url: `/newdaycare/camera_order/cloud_video`,
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
    url: `/newdaycare/camera_order/order`,
    method: 'put',
    data: { parentPhone, expireDate }
  })
}

// /**
//  * 关闭服务
//  * @param phone
//  * @returns {AxiosPromise}
//  */
// export function removeService(phone) {
//   return request({
//     url: `/newdaycare/camera_order/${phone}`,
//     method: 'delete'
//   })
// }

/**
 * 新关闭服务
 * @param childId 学员id
 * @param parentId 联系人id
 * @returns {AxiosPromise}
 */
export function removeService({ childId, parentId }) {
  return request({
    url: `/newdaycare/camera_order/close_service`,
    method: 'post',
    data: { childId, parentId }
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
    url: `/newdaycare/camera_order/off_line_buy`,
    method: 'post',
    data: { childId, phone, expireDate }
  })
}

/**
 * 线下开通服务及续费
 * @param childId 学员id
 * @param phone 联系人手机号码
 * @param expireDate 到期日期  yyyy-MM-dd
 * @param packId 套餐id
 * @param originalPayAmount 应付支付金额 （元）, DECIMAL
 * @param payAmount 支付金额 （元）, DECIMAL
 * @param payTypeId 支付方式id,INTEGER
 * @returns {AxiosPromise}
 */
export function createServiceNContinue({ childId, phone, expireDate, packId, originalPayAmount, payAmount, payTypeId }) {
  return request({
    url: `/newdaycare/camera_order/off_line_buy`,
    method: 'post',
    data: { childId, phone, expireDate, packId, originalPayAmount, payAmount, payTypeId }
  })
}

/**
 * 查询支付方式列表
 * @returns {AxiosPromise}
 */
export function queryPayTypeList() {
  return request({
    url: `/newdaycare/finance_pay_type`,
    method: 'get'
  })
}

/**
 * 查询详情
 * @param parentPhone 联系人电话
 * @param childId 学员id
 * @returns {AxiosPromise}
 */
export function queryCamertOrder({ parentId, childId }) {
  return request({
    url: `/newdaycare/camera_order/details`,
    method: 'get',
    params: { parentId, childId }
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
    url: `/newdaycare/camera_service_package`,
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
    url: `/newdaycare/camera_service_package`,
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
    url: `/newdaycare/camera_service_package/${cameraServicePackageId}`,
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
    url: `/newdaycare/camera_service_package/${cameraServicePackageId}`,
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
    url: `/newdaycare/camera_service_package/${cameraServicePackageId}`,
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
    url: `/newdaycare/camera_service_package/sort`,
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
    url: `/newdaycare/camera_service_type`,
    method: 'get'
  })
}

/* 幼儿云视频服务tab */

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param clazzName 班级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function getClazz({ gradeId, clazzId, clazzName, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/guard/educational/clazz`,
    method: 'get',
    params: { gradeId, clazzId, clazzName, pageNum, pageSize, paged }
  })
}

/**
 * 查询年级列表
 * @param name 年级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function getGrade({ name, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/guard/educational/grade`,
    method: 'get',
    params: { name, pageNum, pageSize, paged }
  })
}

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
export function queryServiceRecordList({ childName, parentName, phone, status, clazzId, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/guard/device_service_record/list`,
    method: 'post',
    data: { childName, parentName, phone, status, clazzId, pageNum, pageSize }
  })
}

/**
 * 关闭云视频服务
 * @param deviceServiceRecordId 云服务开通id
 * @returns {AxiosPromise}
 */
export function closeService({ deviceServiceRecordId }) {
  return request({
    url: `/newdaycare/guard/device_service_record/close`,
    method: 'put',
    data: { deviceServiceRecordId }
  })
}

/**
 * 新增云视频套餐开通记录
 * @param parentId 家长id
 * @param paymentType 支付方式
 * @param childId 幼儿id
 * @param serviceId 套餐id
 * @param expireDate 到期日期
 * @param payType 支付方式
 * @param totalAmount 应收总金额
 * @param actualAmount 实收总金额
 * @returns {AxiosPromise}
 */
export function addService({ parentId, paymentType, childId, serviceId, expireDate, totalAmount, actualAmount }) {
  return request({
    url: `/newdaycare/guard/device_service_record`,
    method: 'post',
    data: { parentId, paymentType, childId, serviceId, expireDate, payType: 'OFFLINE', totalAmount, actualAmount }
  })
}

/**
 * 导出云视频套餐开通记录列表
 * @param childName 幼儿姓名
 * @param parentName 家长姓名
 * @param phone 联系电话
 * @param status 状态
ENABLE :开通
OVERDUE :过期
UN_BUY :未开通
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function exportServiceList(data) {
  const url = '/newdaycare/guard/device_service_record/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询班级已授权摄像头列表
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryClazzAuthCamsList(clazzId) {
  return request({
    url: `/newdaycare/guard/camera/clazz`,
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
export function createClazzAuthCams({ clazzId, deviceIdList }) {
  return request({
    url: `/newdaycare/guard/camera/grant/clazz`,
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
export function cancelClazzAuthCam({ clazzId, deviceId }) {
  return request({
    url: `/newdaycare/guard/camera/cancel_grant/clazz`,
    method: 'put',
    data: { clazzId, deviceId }
  })
}

/**
 * 查询摄像头列表
 * @param cameraName 名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryCamListNoPage(cameraName) {
  return request({
    url: `/newdaycare/camera`,
    method: 'get',
    params: { cameraName, paged: false }
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
export function cameraPlay({ cameraId, deviceOpenTimeType }) {
  return request({
    url: `/newdaycare/guard/camera/play`,
    method: 'get',
    params: { cameraId, deviceOpenTimeType }
  })
}
