const wx = require('weixin-js-sdk')
import request from '@/service/http'
import { Toast } from 'vant'

const jsApiList = [
  'checkJsApi',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'onVoicePlayEnd',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
]

/**
 * 获取JS SDK签名
 * @param url 当前网页的URL，不包含#及其后面部分
 * @param forceRefresh 是否强制刷新 忽略全部缓存
 * @returns {AxiosPromise}
 */
export default async function getSDKSignature(url = location.href.split('#')[0], forceRefresh = false) {
  const res = await request({
    url: `/basic/wechat/third_party_token/signature`,
    method: 'post',
    params: { url, forceRefresh }
  })
  if (res.data.message === '成功') {
    wx.config({
      debug: false,
      ...res.data.data,
      jsApiList
    })
  }
  wx.error(e => {
    Toast.loading({
      message: `获取微信sdk授权失败：${e.errMsg}`
    })
  })
}

// export default function getWXInstance(url = location.href.split('#')[0], forceRefresh = false) {
//   return new Promise(resolve => {
//     getSDKSignature(url, forceRefresh).then(res => {
//       if (res.data.message === '成功') {
//         wx.config({
//           debug: false,
//           ...res.data.data,
//           jsApiList
//         })
//         resolve(wx)
//       }
//     })
//   })
// }
