import request from '@/utils/request'

/**
 * 查询设备表列表
 * @param name 设备名称
 * @param position 设备位置
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
export function queryDeviceList ({ name, position, sort, state }) {
  return request({
    url: '/basic/device',
    method: 'get',
    params: { name, position, sort, state }
  })
}

/**
 * 新增设备表
 * @param brand 品牌
 * @param model 型号
 * @param temperatureDetection 体温检测功能 0 有 1 没有
 * @param deviceName 名称
 * @param deviceKey 序列号（SN）
 * @param position 设备位置
 * @returns {AxiosPromise}
 */
export function createDevice ({ brand, model, temperatureDetection, deviceName, deviceKey, position }) {
  return request({
    url: '/basic/device',
    method: 'post',
    data: { brand, model, temperatureDetection, deviceName, deviceKey, position }
  })
}

/**
 * 更新设备表
 * @param deviceKey
 * @param brand 品牌
 * @param model 型号
 * @param temperatureDetection 体温检测功能 0 有 1 没有
 * @param deviceName 名称
 * @param deviceKey 序列号（SN）
 * @param position 设备位置
 * @returns {AxiosPromise}
 */
export function updateDevice ({ deviceKey, brand, model, temperatureDetection, deviceName, position }) {
  return request({
    url: `/basic/device/${deviceKey}`,
    method: 'put',
    data: { brand, model, temperatureDetection, deviceName, deviceKey, position }
  })
}

/**
 * 获取设备表
 * @param deviceKey 设备表序列号
 * @returns {AxiosPromise}
 */
export function queryDeviceDetail ({ deviceKey }) {
  return request({
    url: `/basic/device/${deviceKey}`,
    method: 'get'
  })
}

/**
 * 删除设备表
 * @param deviceKey 设备表序列号
 * @returns {AxiosPromise}
 */
export function removeDevice ({ deviceKey }) {
  return request({
    url: `/basic/device/${deviceKey}`,
    method: 'delete'
  })
}
