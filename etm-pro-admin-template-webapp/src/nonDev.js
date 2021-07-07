import { name } from '../package.json'

export function setEnvOfNonDev () {
  // const token = '85c165e08d874033800340a2396f9e5b'
  // localStorage.setItem('user_login_token', token)
  try {
    throw new Error('当前环境非开发环境, 请确认')
  } catch (e) {
    console.debug(`nonDev.js:9 setEnvOfNonDev, error: ${e}`)
  }
  setTimeout(() => {
    document.querySelector(`#${name}`).style.padding = '16px'
  }, 100)
}
