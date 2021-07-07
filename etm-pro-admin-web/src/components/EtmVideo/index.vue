<template>
  <div class="video-wrap">
    <div class="tag-wrap">
      <slot name="tag" :data="data" />
    </div>
    <video ref="videoPlayer" class="video-js vjs-big-play-centered" :class="videoClass" :height="height" :width="width" />
    <div class="middle-wrap">
      <slot name="middle" :data="data" />
    </div>
    <div>
      <slot name="default" :data="data" />
    </div>
  </div>
</template>

<script>
/**
 * video create by zhangbanxian
 * createTime 2020/10/20 21:11
 */
import VideoJS from 'video.js'
import 'video.js/dist/video-js.min.css'
import zhCN from '@/assets/videoLang/zh-CN.json'
export default {
  name: 'Index',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          source: {
            src: '',
            type: 'application/x-mpegURL' // hls直播流必写
          }
        }
      }
    },
    options: {
      type: Object,
      default: () => {
        return {
          autoplay: false,
          controls: true, // 是否显示底部控制栏
          poster: require('@/assets/images/noSteam.png'), // 视频海报
          preload: 'none',
          fluid: false,
          language: 'cn',
          // width: '270',
          // height: '150',
          notSupportedMessage: '',
          techOrder: ['html5'],
          flash: {
            hls: {
              withCredentials: true
            }
          },
          html5: {
            hls: {
              withCredentials: true
            }
          },
          controlBar: {
            // 自定义按钮的位置
            children: [
              {
                name: 'playToggle'
              },
              {
                name: 'fullscreenToggle'
              }
            ]
          },
          sources: []
        }
      }
    },
    height: {
      type: String,
      default: () => '150'
    },
    width: {
      type: String,
      default: () => '270'
    },
    // autoPlay: {
    //   type: Boolean,
    //   default: () => false
    // },
    removeEventListener: {
      type: Boolean,
      default: () => false
    },
    videoClass: {
      type: Object,
      default: () => {}
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
        if (data) {
          this.$nextTick(() => {
            // console.log('jijijijiji')
            this.pause()
            this.switch(data)
          })
        }
      }
    }
  },
  mounted() {
    VideoJS.addLanguage('cn', zhCN)
    this.player = VideoJS(
      this.$refs.videoPlayer,
      this.options
    )
    // console.log(this.player)
    // if (this.removeEventListener) this.player.off('.vjs-poster', 'click')
  },
  beforeDestroy() {
    this.player.pause()
    this.player.dispose()
  },
  methods: {
    // 暂停
    pause() {
      if (this.player) {
        this.player.pause()
      }
    },
    dispose() {
      this.player.dispose()
    },
    // 切换视频
    switch(data) {
      if (!this.player) return
      if (data.source && data.source.src) this.player.src(data.source)
      this.autoPlay && this.player.play()
    }
  }
}
</script>
<style lang="scss" scoped>
.video-wrap {
  position: relative;
  .tag-wrap{
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 1;
  }

  .video-js{
    //border-radius: 4px;
    overflow: hidden;

    & /deep/ .vjs-poster {
      background-color: #77839F;
      background-position: 0 bottom;
    }

    & /deep/ .vjs-fullscreen-control{
      float: right;
    }
    &.vjs-big-play-centered /deep/ .vjs-big-play-button{
      //font-size: 2.5em;
      line-height: 38px;
      height: 38px;
      width: 38px;
      -webkit-border-radius: 38px;
      -moz-border-radius: 38px;
      border-radius: 38px;
      background-color: #73859f;
      background-color: rgba(115,133,159,.5);
      border-width: 0px;
      box-sizing: border-box;
      margin-top: 0;
      margin-left: 0;
      transform: translate(-50%, -50%);
      .vjs-icon-placeholder {
        font-size: 80px;
        &:before{
          font-family: 'iconfont';
          content: '\e781';
          transform: translate(-50%, -50%);
        }
      }
    }

    &.hide-vjs-big-play-button{

    }

    /deep/ .vjs-error-display{
      &:before{
        font-size: 0;
      }
      .vjs-modal-dialog-content{
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

}
</style>
