import { Loading } from 'element-ui'

let loading = null

export function startLoading (type) {
  let str = ''
  if (type === 'image') {
    str = '图片上传中...'
  } else if (type === 'video') {
    str = '视频上传中...'
  }
  loading = Loading.service({
    fullscreen: true,
    lock: true,
    text: str,
    background: 'rgba(0,0,0,.1)'
  })
}

export function endLoading () {
  loading.close()
}
