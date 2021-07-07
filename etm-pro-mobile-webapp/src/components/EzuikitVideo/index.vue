<template>
  <div class="video-wrap">
    <video
      id="myPlayer"
      :controls="controls"
      :playsInline="playsInline"
      :poster="poster"
      :webkit-playsinline="webkitPlaysinline"
      class="video"
    >
      <source :src="data.src" :type="data.type">
    </video>
  </div>
</template>

<script>
/**
 * video create by shanglu
 * createTime 2020/10/20 21:11
 */
import EZuikit from './ezuikit'

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
      default: '270'
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
  data() {
    return {
      player: null
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        if (data && data.src && data.type) {
          this.$nextTick(() => {
            // console.log(123123123123)
            // console.log(data)
            this.player = new EZuikit.EZUIPlayer('myPlayer')
            // this.play()
          })
        }
      }
    }
  },
  created() {
    // this.player = new EZuikit.EZUIPlayer('videoPlayer')
  },
  mounted() {
    // console.log(this.player)
    // this.play()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    // 播放
    play() {
      if (this.player) {
        // console.log('play', this.player.play)
        this.player.play()
      }
    },
    // 暂停
    pause() {
      if (this.player) {
        this.player.pause && this.player.pause()
      }
    },
    // 停止
    stop() {
      if (this.player) {
        this.player.stop && this.player.stop()
      }
    },
    // 全屏
    fullScreen() {
      if (this.player) {
        this.player.fullScreen && this.player.fullScreen()
      }
    },
    // 开启声音
    // @params iWind 声音大小 {Number}
    openSound(iWind) {
      if (this.player) {
        this.player.openSound && this.player.openSound(iWind)
      }
    },
    // 关闭声音
    closeSound(iWind) {
      if (this.player) {
        this.player.closeSound && this.player.closeSound(iWind)
      }
    },
    // 视频截图
    capturePicture(iWind, pictureName) {
      if (this.player) {
        this.player.capturePicture && this.player.capturePicture(iWind, pictureName)
      }
    },
    // 开始录像
    startSave(iWind, fileName) {
      if (this.player) {
        this.player.startSave && this.player.startSave(iWind, fileName)
      }
    },
    // 结束录像
    stopSave(iWind) {
      if (this.player) {
        this.player.stopSave && this.player.stopSave(iWind)
      }
    },
    // 改变视频大小
    reSize(width, height) {
      if (this.player) {
        this.player.reSize && this.player.reSize(width, height)
      }
    },
    // 开启电子放大
    enableZoom(iWind) {
      if (this.player) {
        this.player.enableZoom && this.player.enableZoom(iWind)
      }
    },
    // 关闭电子放大
    closeZoom(iWind) {
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
    position: absolute;
    left: 5px;
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
