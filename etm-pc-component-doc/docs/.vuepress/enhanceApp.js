// 使用异步函数也是可以的
import elementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
import 'etm-pc-component-lib/lib/styles/etm-yellow/index.css'
import 'etm-pc-component-lib/lib/styles/etm-purple/index.css'

export default ({
                  Vue, // VuePress 正在使用的 Vue 构造函数
                  options, // 附加到根实例的一些选项
                  router, // 当前应用的路由实例
                  siteData, // 站点元数据
                  isServer // 当前应用配置是处于 服务端渲染 或 客户端
                }) => {
  // ...做一些其他的应用级别的优化

  Vue.mixin({
    mounted() {
      Vue.use(elementUI, {size: 'small'})
      import('etm-pc-component-lib').then(res => {
        Vue.use(res.default, {size: 'small'})
        document.querySelector('html').className = 'etm-yellow'
      })
    }
  })

}
