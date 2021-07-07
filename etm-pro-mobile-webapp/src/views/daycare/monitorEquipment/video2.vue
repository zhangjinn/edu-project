<template>
  <div class="video-box">
    <etm-video v-if="videoType.source.src" :auto-play="true" :data="videoType" :width="`${width}`">
      <template v-slot:videoSlot="data">
        <source :src="data.data.source.src" :type="data.data.source.type">
      </template>
    </etm-video>
  </div>

</template>

<script>
/**
 * video create by Administrator
 * createTime 2020/10/22 17:42
 */
import etmVideo from '@/components/EtmVideo'

export default {
  name: 'Video',
  components: { etmVideo },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      videoType: {
        source: {
          src: '',
          type: 'application/x-mpegURL'
        }
      },
      list: [],
      cameraLists: [],
      // timeOpen: '',
      status: {
        NORMAL: {
          text: '',
          icon: require('@/assets/images/play.png'),
          width: '32',
          height: '36'
        },
        'OFFLINE': {
          text: '摄像机处于离线状态',
          icon: require('@/assets/images/OFFLINE.png'),
          width: '44',
          height: '55'
        },
        'NOT_OPEN_TIME': {
          text: '未到开放时间',
          icon: require('@/assets/images/NOT_OPEN_TIME .png'),
          width: '56',
          height: '45'
        }
      },
      timeStep: false,
      columns: [],
      weekly: {
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六',
        '7': '七'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.width = window.innerWidth
    this.height = window.innerHeight
  },
  mounted() {
    setTimeout(() => {
      this.videoType.source.src = 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'
    }, 2000)
  },
  methods: {
    getCamera() {

    },
    onConfirm2(item, index) {
      this.camera = false
      const _currentCamera = this.cameraLists[index]

      if (parseInt(this.cameraId) !== _currentCamera['cameraId']) {
        this.cameraId = _currentCamera['cameraId']

        this.$nextTick(() => {
          this.getCamera()
        })
      }
    },
    onConfirm() {
      this.timeStep = false
    }
  }
}
</script>
<style lang="scss" scoped>
.video-box {

  background: #000;
  min-height: 100vh;

  .placeholdCmarea {
    width: 100vw;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(0, -50%);
    background: url("../../../assets/images/videoBg.png") no-repeat center;
    background-size: cover;
  }

  .video-div {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    z-index: 1;
  }

  .settingTitle {
    height: 34px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, .2);

    span {
      font-size: 15px;
      color: $text-5;
      vertical-align: middle;
    }

    i {
      color: #fff;
    }

    .title {
      color: #fff;
      flex: 1;
      text-align: left;
      font-size: 13px;
      padding: 0 20px;
    }

    i.noView {
      visibility: hidden;
    }

    ::v-deep .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
      display: none;
    }
  }
}
</style>
