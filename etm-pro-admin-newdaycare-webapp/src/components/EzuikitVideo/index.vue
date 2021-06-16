<template>
  <div class="video-wrap">
    <video
      id="myPlayer"
      class="video"
      :controls="controls"
      :height="height"
      :playsInline="playsInline"
      :poster="poster"
      :webkit-playsinline="webkitPlaysinline"
      :width="width"
      :autoplay="autoPlay"
      :src="data.src"
      :type="data.type"
    />
  </div>
</template>

<script>
/**
 * video create by shanglu
 * createTime 2020/10/20 21:11
 */
import EZuikit from '@/utils/libs/ezuikit'

export default {
  name: 'EzuikitVideo',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          src: '',
          type: 'application/x-mpegURL' // hls直播流必写
        }
      }
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 海报
    poster: {
      type: String,
      default: () => ''
    },
    height: {
      type: String,
      default: () => '150'
    },
    width: {
      type: String,
      default: () => '270'
    },
    // 自动播放
    autoPlay: {
      type: Boolean,
      default: () => true
    },
    // 显示控制条
    controls: {
      type: Boolean,
      default: () => true
    },
    playsInline: {
      type: Boolean,
      default: () => true
    },
    webkitPlaysinline: {
      type: Boolean,
      default: () => true
    },
    // 静音
    muted: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      player: null,
      oldSrc: ''
    }
  },
  watch: {
    data: {
      immediate: true,
      handler (data) {
        if (data && data.src) {
          if (data.src === this.oldSrc) return
          if (this.player && this.player.video && this.player.hls) {
            // console.log('hls', this.player.hls)
            this.player.hls.destroy()
          }
          this.player = null
          this.$nextTick(() => {
            // console.log('data.src', data.src)
            this.player = new EZuikit.EZUIPlayer('myPlayer')
            this.oldSrc = data.src
            //   this.player = new EZuikit.EZUIPlayer('myPlayer')
            //   // this.player.on('log', (str) => {
            //   //   console.info(str)
            //   // })
          })
        }
      }
    }
  },
  beforeDestroy () {
    this.player = null
    this.stop()
  },
  methods: {
    play () {
      if (this.player) {
        // console.log('play', this.player.play)
        this.player.play()
      }
    },
    // 暂停
    pause () {
      if (this.player) {
        this.player.pause && this.player.pause()
      }
    },
    // 停止
    stop () {
      if (this.player) {
        this.player.stop()
        if (this.player.video && this.player.hls) {
          this.player.hls.destroy()
        }
      }
    },
    // 全屏
    fullScreen () {
      if (this.player) {
        this.player.fullScreen && this.player.fullScreen()
      }
    },
    // 开启声音
    // @params iWind 声音大小 {Number}
    openSound (iWind) {
      if (this.player) {
        this.player.openSound && this.player.openSound(iWind)
      }
    },
    // 关闭声音
    closeSound (iWind) {
      if (this.player) {
        this.player.closeSound && this.player.closeSound(iWind)
      }
    },
    // 视频截图
    capturePicture (iWind, pictureName) {
      if (this.player) {
        this.player.capturePicture && this.player.capturePicture(iWind, pictureName)
      }
    },
    // 开始录像
    startSave (iWind, fileName) {
      if (this.player) {
        this.player.startSave && this.player.startSave(iWind, fileName)
      }
    },
    // 结束录像
    stopSave (iWind) {
      if (this.player) {
        this.player.stopSave && this.player.stopSave(iWind)
      }
    },
    // 改变视频大小
    reSize (width, height) {
      if (this.player) {
        this.player.reSize && this.player.reSize(width, height)
      }
    },
    // 开启电子放大
    enableZoom (iWind) {
      if (this.player) {
        this.player.enableZoom && this.player.enableZoom(iWind)
      }
    },
    // 关闭电子放大
    closeZoom (iWind) {
      if (this.player) {
        this.player.closeZoom && this.player.closeZoom(iWind)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/* eslint-disable */
.video-wrap {
  position: relative;

  .tag-wrap {
    left: 5px;
    position: absolute;
    top: 5px;
    z-index: 1;
  }

  .video {
    background-color: #73859f;
    //&::-webkit-media-controls-panel {
    //  background: transparent;
    //}
  }
}
</style>
