<template>
  <div class="video-wrap">
    <div class="tag-wrap">
      <slot name="tag" />
    </div>
    <!--    muted
    playsinline="true"
      webkit-playsinline="true"-->
    <video
      ref="videoPlayer"
      class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
      :class="videoClass"
      :style="{width : videoWidth, height : videoHeight}"
    >
      <slot name="videoSlot" :data="data" />
    </video>
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
// import 'videojs-landscape-fullscreen'
import 'video.js/dist/video-js.min.css'
import zhCN from '@/assets/videoLang/zh-CN.json'
import wx from 'weixin-js-sdk'
export default {
  name: 'Index',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          source: {
            src: '',
            type: 'application/x-mpegURL'
          }
        }
      }
    },
    options: {
      type: Object,
      default: () => {
        return {
          controls: true, // 是否显示底部控制栏
          poster: require('@/assets/images/noSteam.png'), // 视频海报
          preload: '',
          fluid: false,
          language: 'cn',
          // fullscreen: { navigationUI: 'hide' },
          hls: {
            withCredentials: true
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
    videoHeight: {
      type: String,
      default: 'auto'
    },
    videoWidth: {
      type: String,
      default: '100%'
    },
    autoPlay: {
      type: Boolean,
      default: () => false
    },
    videoClass: {
      type: Object,
      default: () => {
      }
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
      deep: true,
      handler(data) {
        if (data) {
          this.$nextTick(() => {
            this.pause()
            this.switch(data)
          })
        }
      }
    }
  },
  mounted() {
    // console.log('dddd')
    VideoJS.addLanguage('cn', zhCN)
    this.player = VideoJS(
      this.$refs.videoPlayer,
      this.options
    )

    // this.player.landscapeFullscreen()

    // this.player.landscapeFullscreen({
    //   fullscreen: {
    //     enterOnRotate: true,
    //     alwaysInLandscapeMode: true,
    //     iOS: true
    //   }
    // })
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
    // 切换视频
    switch(data) {
      if (!this.player) return
      this.$nextTick(() => {
        this.player.src(data.source)

        this.player.play()

        const u = navigator.userAgent
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

        if (isiOS && wx['ready']) {
          wx.config({
            // 配置信息, 即使不正确也能使用 wx.ready
            debug: false,
            appId: 'gh_1a8c118653f8',
            timestamp: 1,
            nonceStr: '',
            signature: '',
            jsApiList: []
          })

          wx.ready(() => {
            this.player.play()
          })
        }

        setTimeout(() => {
          this.player.requestFullscreen()
        }, 300)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.video-wrap {
  position: relative;
  width: 100vw;

  .tag-wrap {
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 1;
  }

  .video-js {
    border-radius: 4px;
    overflow: hidden;

    & /deep/ .vjs-fullscreen-control {
      float: right;
    }

    &.vjs-big-play-centered /deep/ .vjs-big-play-button {
      //font-size: 2.5em;
      line-height: 38px;
      height: 38px;
      width: 38px;
      -webkit-border-radius: 38px;
      -moz-border-radius: 38px;
      border-radius: 38px;
      background-color: #73859f;
      background-color: rgba(115, 133, 159, .5);
      border-width: 0px;
      box-sizing: border-box;
      margin-top: 0;
      margin-left: 0;
      transform: translate(-50%, -50%);

      .vjs-icon-placeholder {
        font-size: 40px;

        &:before {
          font-family: 'iconfont';
          content: '\e781';
        }
      }
    }

    /deep/ .vjs-error-display {
      &:before {
        font-size: 0;
      }

      .vjs-modal-dialog-content {
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
