import request from '@/utils/request'
// import request from '@/api/base/mock'
import {
  uploadFile
} from '@/api/base'

import { downloadFile } from '@/api/base/base'

/**
 * 查询文件列表
 * @param documentId 目录id
 * @param documentName 名字
 * @returns {AxiosPromise}
 */
export function queryFileLists ({ documentId, documentName }) {
  return request({
    url: '/basic/document',
    method: 'get',
    params: { documentId, documentName }
  })
}

/**
 * 新增文件夹
 * @param documentName 名称
 * @param parentId 父级id
 * @returns {AxiosPromise}
 */
export function createFolder ({ documentName, parentId }) {
  return request({
    url: '/basic/document',
    method: 'post',
    data: { documentName, parentId }
  })
}

/**
 * 删除文件
 * @param documentId 文件 ID
 * @returns {AxiosPromise}
 */
export function removeFolder (documentId) {
  return request({
    url: `/basic/document/${documentId}`,
    method: 'delete'
  })
}

/**
 * 重命名(文件夹/文件)
 * @param documentId
 * @param documentId
 * @param documentName 名称
 * @returns {AxiosPromise}
 */
export function updateFileName ({ documentId, documentName }) {
  return request({
    url: `/basic/document/${documentId}`,
    method: 'put',
    data: { documentName }
  })
}

/**
 * 较验文件
 * @param documentName 名称
 * @param parentId 父级id
 * @returns {AxiosPromise}
 */
export function createVaildFileName ({ documentName, parentId }) {
  return request({
    url: '/basic/document/compare_file',
    method: 'post',
    data: { documentName, parentId }
  })
}

/**
 * 新增文件共享
 * @param fileIds 文件id/目录id
 * @param sharePersonId 分享人
 * @param sharedStartItem 共享开始时间, DATETIME
 * @param sharedEndItem 共享结束时间, DATETIME
 * @param download 是否可下载
 * @param share 是否共享
 * @param longTime 是否长期
 * @returns {AxiosPromise}
 */
export function createShare ({ fileIds, sharePersonId, sharedStartItem, sharedEndItem, download, share, longTime }) {
  return request({
    url: '/basic/document_shared',
    method: 'post',
    data: { fileIds, sharePersonId, sharedStartItem, sharedEndItem, download, share, longTime }
  })
}

/**
 * 查询我的共享
 * @param documentId 目录id
 * @param sharedId 共享id
 * @returns {AxiosPromise}
 */
export function queryShare ({ documentId, sharedId, documentName }) {
  return request({
    url: '/basic/document_shared/self/shared',
    method: 'get',
    params: { documentId, sharedId, documentName }
  })
}

/**
 * 查询共享给我
 * @param documentId 目录id
 * @param sharedId 共享id
 * @returns {AxiosPromise}
 */
export function queryShareMe ({ documentId, sharedId, documentName }) {
  return request({
    url: '/basic/document_shared/others/shared',
    method: 'get',
    params: { documentId, sharedId, documentName }
  })
}

export function uploadFiles ({ file, tenantId, employeeId, directoryId }) {
  return uploadFile(
    file,
    'base/cloudDisk',
    'file',
    'QINIU_CALLBACK',
    {
      'x:tenantId': tenantId,
      'x:employeeId': employeeId,
      'x:directoryId': directoryId
    },
    {
      noLoadding: true
    }
  )
}

/**
 * 编辑文件共享
 * @param fileId 文件id/目录id
 * @param sharePersonId 分享人
 * @param sharedStartItem 共享开始时间, DATETIME
 * @param sharedEndItem 共享结束时间, DATETIME
 * @param download 是否可下载
 * @param share 是否共享
 * @param longTime 是否长期
 * @returns {AxiosPromise}
 */
export function updateShareFile ({ fileId, sharePersonId, sharedStartItem, sharedEndItem, download, share, longTime }) {
  return request({
    url: '/basic/document_shared',
    method: 'put',
    data: { fileId, sharePersonId, sharedStartItem, sharedEndItem, download, share, longTime }
  })
}

/**
 * 下载文件
 * @param documentId 目录id
 * @param sharedId 共享id
 * @returns {AxiosPromise}
 */
export function queryDownload (documentIds) {
  return downloadFile({
    method: 'get',
    url: '/basic/document/downloadFile',
    params: {
      documentIds,
      noLoadding: true
    }
  })
}

/**
 * 获取下载文件(url fileName path)
 * @param documentIds
 * @param documentIds
 * @returns {AxiosPromise}
 */
export function queryDownloadMap (documentIds) {
  return request({
    url: '/basic/document/listFile',
    method: 'get',
    params: { documentIds, noLoadding: true }
  })
}

/**
 * 查询员工列表
 * @param organizationId 组织的ID
 * @param positionId 岗位的ID，岗位ID不为空时会根据岗位ID进行查询
 * @param recursiveSearch 是否递归查询
 true：查询指定组织（和子孙组织）或岗位（和子孙岗位）下的员工
 false：则查询指定组织或岗位下的员工
 默认为true
 * @param keyword 筛选的关键词
 支持员工姓名和员工手机号码模糊查询
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryeMployee ({ organizationId, positionId, recursiveSearch, keyword, pageNum, pageSize, paged }) {
  return request({
    url: '/basic/v2/employee',
    method: 'get',
    params: { organizationId, positionId, recursiveSearch, keyword, pageNum, pageSize, paged }
  })
}

/**
 * 云盘空间
 * @returns {AxiosPromise}
 */
export function queryDiskCapacity () {
  return request({
    url: '/basic/document/cloudDisk',
    method: 'get'

  })
}
