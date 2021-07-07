<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import { getTheme } from './utils/auth'

import { getHostSetting } from '@/api/base/base'
import pubsub from '@/utils/PubSub'

export default {
  name: 'App',
  data() {
    return {
      hostConfig: localStorage.getItem('hostConfig') || ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const host = location.hostname
      await getHostSetting({ host }).then(res => {
        this.hostConfig = res.data
        this.hostConfig && localStorage.setItem('hostConfig', JSON.stringify(this.hostConfig))
        pubsub.publish('configReady')

        // 主题
        const themeMap = {
          'etm-yellow': 'etm-yellow',
          'etm-purple': 'etm-purple',
          'etm-green': 'etm-green',
          'etm-blue': 'etm-blue',
          'etm-brown': 'etm-brown',
          'etm-pink': 'etm-pink',
          'etm-girlPink': 'etm-girlPink',
          'etm-lavenderPurple': 'etm-lavenderPurple',
          'etm-rainBlue': 'etm-rainBlue',
          'etm-warmOrange': 'etm-warmOrange',
          'etm-blackGold': 'etm-blackGold'
        }

        // const langMap = {
        //   en: 'en',
        //   zh: 'zh'
        // }

        // 设置主题颜色
        document.documentElement.className = themeMap[this.hostConfig && this.hostConfig.themeName || 'etm-blackGold']
        this.$store.dispatch('base/setThemeName', this.hostConfig.themeName || 'etm-blackGold')

        // 设置iconfont
        try {
          this.hostConfig.config = JSON.parse(this.hostConfig.config)
        } catch (e) {
          console.debug(`App.vue:58 , hostConfig.config error: ${e}`)
        }
        console.log('hostConfig.config: ', this.hostConfig.config)
        this.insertIconfont('css', this.hostConfig.config.iconfontBPCCss || '//at.alicdn.com/t/font_1689282_20cma05ox1b.css')
        this.insertIconfont('js', this.hostConfig.config.iconfontBPCJs || '//at.alicdn.com/t/font_1689282_20cma05ox1b.js')
      })
    },
    insertIconfont(type, href) {
      if (type === 'css') {
        const linkElement = document.createElement('link')
        linkElement.rel = 'stylesheet'
        linkElement.href = href
        document.querySelector('head').appendChild(linkElement)
      } else if (type === 'js') {
        const scriptElement = document.createElement('script')
        scriptElement.src = href
        scriptElement.async = true
        document.querySelector('body').appendChild(scriptElement)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  #app {
    min-width: 1024px;
  }
</style>
