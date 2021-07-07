<template>
  <div class="preview-video">
    <div id="wrapper" />
  </div>
</template>

<script>

import ChimeeMobilePlayer from 'chimee-mobile-player'
import 'chimee-mobile-player/lib/chimee-mobile-player.browser.css'

export default {
  name: 'PreviewVideo',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler(n) {
        if (Object.keys(n).length) {
          this.$nextTick(() => {
            new ChimeeMobilePlayer({
              wrapper: '#wrapper', // video dom容器
              src: n.url,
              autoplay: true,
              controls: true,
              playsInline: true,
              preload: 'auto',
              x5VideoPlayerFullscreen: true,
              x5VideoOrientation: 'landscape|portrait',
              xWebkitAirplay: true,
              muted: false
              // removeInnerPlugins: ['chimeeMobiControlbar', 'chimeeState'] // 需要移除的插件
            })
          })
        }
      }
    }
  },
  mounted() {

  },
  created() {

  }

}
</script>

<style scoped lang="scss">
.preview-video{
  width: 100%;
  height: 100%;

  #wrapper{
    width: 100%;
    height: 100%;
    background: #000;
  }
}
</style>
