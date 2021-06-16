import request from '@/utils/request'

/**
* 获取消息列表
* */
export function getMessageList (data) {
  return request({
    url: '/basic/message',
    method: 'get',
    params: data
  })
}

/**
 * 改变消息状态
 * */
export function putMessageState (data) {
  return request({
    url: '/basic/message',
    method: 'put',
    data
  })
}

/**
 * 获取消息未读数量
 * */
export function getMessageNum (data) {
  return request({
    url: '/basic/message/num',
    method: 'get',
    params: data
  })
}
