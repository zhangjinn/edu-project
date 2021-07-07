<template>
  <div v-if="isShow" class="preview-video" :class="{lights : lightsStatus}">
    <div class="videoTools">
      <div @click="lights">{{ lightsStatus ? '开灯' : '关灯' }}</div>
      <div @click="hide">
        关闭
      </div>
    </div>
    <div class="video-box" :style="{width, height}">
      <video-player
        ref="videoPlayer"
        class="video-player-box"
        :options="playerOptions"
        :playsinline="true"
        custom-event-name="customstatechangedeventname"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
        @ended="onPlayerEnded($event)"
        @waiting="onPlayerWaiting($event)"
        @playing="onPlayerPlaying($event)"
        @loadeddata="onPlayerLoadeddata($event)"
        @timeupdate="onPlayerTimeupdate($event)"
        @canplay="onPlayerCanplay($event)"
        @canplaythrough="onPlayerCanplaythrough($event)"
        @statechanged="playerStateChanged($event)"
        @ready="playerReadied"
      />
    </div>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import Mime from 'mime'
export default {
  name: 'PreviewVideo',
  components: {
    videoPlayer
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      lightsStatus: false,
      width: 0,
      height: 0,
      playerOptions: {
        // videojs options
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        width: '0px',
        height: '0px',
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: ''
      }
    }
  },
  watch: {
    isShow: {
      handler(n) {
        if (n) {
          this.playerOptions.sources[0].src = this.src

          this.playerOptions.sources[0].type = Mime.getType(this.src)
          console.log(Mime.getType(this.src))
        }
      }
    }
  },
  created() {
    const videoHeight = window.innerHeight * 0.7 > 500 ? 500 : window.innerHeight * 0.7
    const videoWidth = 16 / 9 * videoHeight

    this.playerOptions.width = videoWidth + 'px'
    this.playerOptions.height = videoHeight + 'px'
    this.width = videoWidth
    this.height = videoHeight
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    lights() {
      this.lightsStatus = !this.lightsStatus
    },
    closeVideo() {
      this.isShow = false
      this.$emit('close', {})
    },
    onPlayerPause(e) {

    },
    onPlayerEnded(e) {

    },
    onPlayerWaiting(e) {
    },
    onPlayerPlaying(e) {

    },
    onPlayerLoadeddata(e) {
      // console.log(e.el().querySelector('video').videoHeight)
      // console.log(e.el().querySelector('video').videoWidth)

      // console.log(window.innerHeight * 0.7)
    },
    onPlayerTimeupdate(e) {

    },
    onPlayerCanplay(e) {

    },
    onPlayerCanplaythrough(e) {

    }, playerStateChanged(e) {

    },
    playerReadied(e) {

    },
    onPlayerPlay(e) {

    }

  }
}
</script>

<style scoped lang="scss">
.preview-video{

  &:hover{
    .videoTools{
      transform: translate(0, -50%);
    }
  }

  &.lights{
    background: rgba(0,0,0,1);
  }

  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.8);
  z-index: 2000;
  transition: background-color .2s ease;

  .videoTools {
    position: absolute;
    right: 0;
    top: 50%;
    color: #fff;
    transform: translate(70px, -50%);
    transition: transform .4s ease;
    cursor: pointer;
    width: 70px;
    background: #111;
    z-index: 20;

    //&:after{
    //  content: '';
    //  display: block;
    //  width: 2px;
    //  height: 50%;
    //  position: absolute;
    //  background: #999;
    //  border-radius: 2px;
    //  left: 6px;
    //  top: 25%;
    //}

    div {
      width: 70px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      &:first-child{
        border-bottom: #111;
      }
    }
    //right: 0;
    //top: 50%;
    //transform: translate(0, -50%);
    //font-size: 16px;
    //color: #ffffff;
    //
    //& > div{
    //  width: 50px;
    //  height: 40px;
    //  text-align: center;
    //  line-height: 40px;
    //  background: #333;
    //}
  }

  .video-box{
    background: #000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    ::v-deep{
      .vjs-big-play-button{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        span{
          display:block;
          width:100%;
          height:100%;
          overflow: hidden;

          &:before {
            font-size: 30px;
            margin-top: 2px;
          }
        }
      }
    }
  }
}
</style>
