import lrz from 'lrz'

/**
 * 压缩图片
 * @param image 图片
 */
export async function zipImage (image) {
  let result = null
  const data = lrz(image, { quality: 0.8 })
    .then((rst) => {
      result = rst
      return Promise.resolve(result)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
    .always(function () {
      return Promise.resolve(result)
    })
  return data.file
}

/**
 *
 * @param inputOptions {InputOptions}
 * @returns {Promise<FormData>}
 */
export function importFile (inputOptions = null) {
  return new Promise(resolve => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    for (const inputOptionsKey in inputOptions) {
      inputElement[inputOptionsKey] = inputOptions[inputOptionsKey]
    }
    inputElement.click()
    inputElement.addEventListener('change', () => {
      const formData = new FormData()
      formData.append('file', inputElement.files[0])
      resolve({ result: formData, raw: inputElement.files[0] })
    })
  })
}
