<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      hostConfig: localStorage.getItem('hostConfig') || ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      if (this.hostConfig) {
        this.hostConfig = JSON.parse(this.hostConfig)
      }

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
        'etm-warmOrange': 'etm-warmOrange'
      }

      // 设置主题颜色
      document.documentElement.className = themeMap[this.hostConfig && this.hostConfig.themeName || 'etm-yellow']
    }
  }
}
</script>
