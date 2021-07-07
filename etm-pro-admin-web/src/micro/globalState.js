import { addGlobalUncaughtErrorHandler } from 'qiankun'
import router from '@/router'

// 直接跳转到子应用静态路由时报错的解决方案
addGlobalUncaughtErrorHandler(event => {
  const err = '#appContainer not existed while daycare loading'
  if (event.message && event.message.includes(err)) {
    router.push('/')
  }
})
