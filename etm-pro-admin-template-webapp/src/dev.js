import { name } from '../package.json'

export function setEnvOfDev () {
  try {
    throw new Error('当前是开发环境,可以来这里设置token')
  } catch (e) {
    console.debug(`dev.js:5 setEnvOfDev : <= ${e.message}`)
  }
  const token = '85c165e08d874033800340a2396f9e5b'
  localStorage.setItem('user_login_token', token)
  setTimeout(() => {
    require('etm-pc-component-lib/lib/styles/etm-yellow/index.css')
    document.querySelector('html').className = 'etm-yellow'
    if (document.querySelector(`#${name}`)) {
      document.querySelector(`#${name}`).style.padding = 0
    }
    document.querySelector('#etm-menu').style.height = '100vh'
  }, 100)
}
