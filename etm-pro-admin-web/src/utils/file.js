import lrz from 'lrz'

/**
 * 压缩图片
 * @param image 图片
 */
export async function zipImage(image) {
  let result = null
  const data = await lrz(image, { quality: 0.8 })
    .then((rst) => {
      result = rst
      return Promise.resolve(result)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
    .always(function() {
      return Promise.resolve(result)
    })
  return data.file
}

/**
 * 下载文件
 * @param res
 */
export function downloadFileForUrl(res) {
  const link = document.createElement('a')
  link.href = res.url
  const fileName = res.fileName || 'unknown'
  link.setAttribute('download', fileName)
  link.click()
}
