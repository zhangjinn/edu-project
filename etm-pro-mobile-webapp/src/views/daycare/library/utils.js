import { updateReturnBook } from '@/service/daycare/library'
import { Toast } from 'vant'

export function judgeBrowser() {
  const UA = navigator.userAgent.toLowerCase()
  // const UA = 'Mozilla/5.0 (Linux; Android 6.0; 1503-M02 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.2 TBS/036558 Safari/537.36 MicroMessenger/6.3.25.861 NetType/WIFI Language/zh_CN'
  const t = /MicroMessenger/i
  return t.test(UA)
}

export function scanBorrow(that) {
  if (!judgeBrowser()) {
    Toast.loading({
      message: '请在微信使用该功能'
    })
  } else {
    that.$wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: res => {
        that.$router.push({
          name: 'libraryBorrowRegister',
          query: {
            bookBarcode: res.resultStr
          }
        })
      }
    })
  }
}

export function scanBack(that) {
  if (!judgeBrowser()) {
    Toast.loading({
      message: '请在微信使用该功能'
    })
  } else {
    that.$wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: res => {
        updateReturnBook({ bookBarcode: res.resultStr }).then(res => {
          if (res.data.message === '成功') {
            setTimeout(() => {
              Toast.loading({
                message: '归还成功',
                onClose: () => {
                  that.$router.push('/daycare_Library')
                }
              })
            }, 500)
          } else {
            Toast.loading({
              message: '归还失败'
            })
            setTimeout(() => {
              that.$router.push('/daycare_Library')
            }, 500)
          }
        })
      }
    })
  }
}
