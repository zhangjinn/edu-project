<template>
  <div class="video-box">
    <title-plan :sty="titleStyle">
      <div>{{ currentCamera['cameraName'] }}</div>
      <template slot="tools">
        <div @click="timeStep = true">
          <!--          <img src="../../../assets/images/clock-video.png" width="15" height="15">-->
          <i class="iconfont iconhistory" style="font-size: 15px" />
        </div>
        <div @click="camera = true">
          <!--          <img src="../../../assets/images/camera.png" width="18" height="15">-->
          <i class="iconfont iconqiehuanshipin" style="font-size: 16px" />
        </div>
      </template>
    </title-plan>

    <div class="video-div">
      <div v-if="currentCamera.online && currentCamera.open">
        <etm-video v-if="videoType.source.src" :auto-play="true" :data="videoType" :width="`${width}`">
          <template v-slot:videoSlot="data">
            <source :src="data.data.source.src" :type="data.data.source.type">
          </template>
        </etm-video>
      </div>
      <div v-else class="placeholdCmarea">
        <van-image
          v-if="!isOnline"
          :src="require('@/assets/images/OFFLINE.png')"
        />
        <van-image
          v-if="!isOpen"
          :src="require('@/assets/images/NOT_OPEN_TIME .png')"
        />
      </div>
    </div>

    <van-popup
      v-model="timeStep"
      position="bottom"
    >
      <div class="timeList">
        <p>开放时段</p>
        <span class="close" @click="onConfirm"><i class="iconfont iconout" /></span>
        <div v-for="(item, index) in columns" :key="index" class="timeListsItem">
          {{ item }}
        </div>
      </div>
      <!--      <van-picker-->
      <!--        title="开放时段"-->
      <!--        show-toolbar-->
      <!--        confirm-button-text="x"-->
      <!--        cancel-button-text=" "-->
      <!--        :columns="columns"-->
      <!--        @confirm="onConfirm"-->
      <!--      />-->
    </van-popup>

    <van-popup
      v-model="camera"
      position="bottom"
    >
      <van-picker
        title="摄像头"
        show-toolbar
        :default-index="defaultIndex"
        confirm-button-text="确定"
        cancel-button-text="取消"
        :columns="list"
        @cancel="camera = false"
        @confirm="onConfirm2"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * video create by Administrator
 * createTime 2020/10/22 17:42
 */
import titlePlan from '@/views/guardcare/monitorEquipment/components/titlePlan'
import etmVideo from '@/components/EtmVideo'
import { queryOpenList, queryVideo, queryVideoList } from '@/service/guardcare/video'

export default {
  name: 'Video',
  components: { etmVideo, titlePlan },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      defaultIndex: 0,
      useInfo: JSON.parse(localStorage.getItem('user')),
      titleStyle: {
        color: '#fff',
        background: 'rgba(255,255,255,.2)'
      },
      currentCamera: {},
      camera: false,
      cameraId: null,
      isOpen: true,
      isOnline: false,
      width: 0,
      height: 0,
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
        'MONDAY': '一',
        'TUESDAY': '二',
        'WEDNESDAY': '三',
        'THURSDAY': '四',
        'FRIDAY': '五',
        'SATURDAY': '六',
        'SUNDAY': '日'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.cameraId = this.$route.query.id
    this.isOnline = this.$route.query.online
    this.isOpen = this.$route.query.open
    this.$nextTick(() => {
      this.getCamera()
    })

    queryVideoList({
      employeeId: this.useInfo.id
    }).then(res => {
      this.cameraLists = res.data.data.content
      this.list = res.data.data.content.map((cur, index) => {
        if (this.$route.query.id === cur.cameraId) {
          this.defaultIndex = index
        }
        return cur.cameraName
      })
    })

    queryOpenList({ type: 'EMPLOYEE', enableFlag: true }).then(res => {
      const _res = res.data.data
      const _currentDay = new Date().getDay()
      const result = []

      Object.keys(_res || {}).forEach(cur => {
        if (!cur.length) {
          return
        }

        if (Object.keys(this.weekly).indexOf(_res[cur].dayOfWeek) === _currentDay) {
          let s = ''

          _res[cur].deviceOpenTimeVOList.forEach(c => {
            s += `${c.start}~${c.end} `
          })
          this.openTime = s
        }

        let string = `星期${this.weekly[_res[cur].dayOfWeek]} `

        _res[cur].deviceOpenTimeVOList.forEach(c => {
          string += `${c.start}-${c.end} `
        })
        result.push(string)
      })
      this.columns = result
    })
  },
  mounted() {
  },
  methods: {
    getCamera() {
      queryVideo({
        cameraId: this.cameraId,
        deviceOpenTimeType: 'EMPLOYEE'
      }).then(res => {
        this.currentCamera = res.data.data
        this.videoType.source.src = res.data.data.url
      })
    },
    onConfirm2(item, index) {
      this.camera = false
      const _currentCamera = this.cameraLists[index]

      // console.log(this.cameraId, _currentCamera['cameraId'])
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
  .timeList{
    padding: 12px 12px 12px;
    position: relative;
    font-size: 14px;

    p{
      margin-bottom: 18px;
      text-align: center;
      font-size: 16px;
    }

    .close {
      position: absolute;
      right: 12px;
      font-size: 16px;
      top: 10px;
      color: #999;
    }
    .timeListsItem{
      line-height: 34px;
    }
  }

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
