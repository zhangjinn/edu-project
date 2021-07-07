import lrz from 'lrz'

/**
 * 压缩图片
 * @param image 图片
 */
export async function zipImage(image) {
  let result = null
  const data = await lrz(image, { quality: 0.5 })
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
