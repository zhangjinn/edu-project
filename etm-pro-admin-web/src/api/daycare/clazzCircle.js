// import request from '@/api/daycare/mockRequest'

import request from '@/utils/request'

/**
 * 查询动态列表
 * @param content 发布内容
 * @param createName 发布人
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
export function queryDynamicList({ content, createName, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/daycare/dynamic`,
    method: 'get',
    params: { content, createName, pageNum, pageSize, paged, sort }
  })
}

/**
 * 删除动态
 * @param dynamicId 动态 ID
 * @returns {AxiosPromise}
 */
export function removeDynamic({ dynamicId }) {
  return request({
    url: `/daycare/dynamic/${dynamicId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 获取发布范围数据
 * @returns {AxiosPromise}
 */
export function queryAllLesson() {
  return request({
    url: `/daycare/dynamic/authorization`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增动态 BPC BM
 * @param content 发布内容
 * @param dynamicType 上传类型
 * @param urlList 图片 / 视频地址
 * @param dynamicReleaseScopeDTOList 发布范围
 * @param canComment 是否可评论
 * @returns {AxiosPromise}
 */
export function createDynamic({ content, dynamicType, urlList, dynamicReleaseScopeDTOList, canComment }) {
  return request({
    url: `/daycare/dynamic`,
    method: 'post',
    data: { content, dynamicType, urlList, dynamicReleaseScopeDTOList, canComment }
  })
}

/**
 * 预览动态 BPC
 * @param dynamicId 动态 ID
 * @returns {AxiosPromise}
 */
export function queryPreviewDynamic({ dynamicId }) {
  return request({
    url: `/daycare/dynamic/preview_dynamic/${dynamicId}`,
    method: 'get',
    params: {}
  })
}
