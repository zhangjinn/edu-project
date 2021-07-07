<template>
  <div class="camera">
    <el-row>
      <el-col :span="17">
        <div class="cameraList">
          <div class="menu">
            <i ref="prev" class="iconfont iconxiala prev" @click.stop="prevMove" />
            <div class="outWrap">
              <div ref="wrap" class="innerWrap">
                <el-button
                  v-for="(c, i) in cams"
                  :key="i"
                  :disabled="!c.open || !c.online"
                  :type="activeCamIndex === i ? 'primary' : 'button'"
                  class="cams"
                  @click.stop="selectCam(i)"
                >{{ c.cameraName }}</el-button>
              </div>
            </div>
            <i ref="next" class="iconfont iconxiala next" @click.stop="nextMove" />
          </div>
          <div class="camArea">
            <EzuikitVideo
              v-if="activeItem.onlineStatus"
              ref="video"
              :data="video"
              class="video"
              width="660"
              height="365"
              :poster="poster"
            />
            <!-- <EtmVideo
              v-if="activeItem.onlineStatus"
              ref="video"
              :data="video"
              class="video"
              width="660"
              height="365"
              :options="option"
            /> -->
            <div v-else class="noStream">
              <div class="tip">
                <div v-if="activeItem.openStatus === 'OPEN'">
                  <i class="iconfont iconplay-circle" />
                </div>
                <div v-else-if="activeItem.openStatus === 'NOT_OPEN'">
                  <i class="iconfont iconweidaoshijian" />
                  <p>未到开放时间</p>
                </div>
                <div v-else-if="!activeItem.onlineStatus">
                  <i class="iconfont iconwuxian" />
                  <p>摄像头处于离线状态<br>请检查电源或网络是否已连接</p>
                </div>
              </div>
              <img src="@/assets/images/noSteam.png" alt="noSteam">
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="timeList">
          <p>{{ { 'EMPLOYEE': '员工', 'PARENT': '家长' }[type] }}移动端开放时段</p>
          <ul ref="timeList">
            <li v-for="(t, i) in timeList" :key="i">
              {{ i | interval }}：{{ t[0].start }} ~ {{ t[0].end }} &nbsp;{{ t[1].start }} ~ {{ t[1].end }}
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  queryDeviceOpenTimeList,
  cameraPlay
} from '@/api/guardcare/cloudDeviceManage/monitor'
// import EtmVideo from '@/components/EtmVideo'
import EzuikitVideo from '@/components/EzuikitVideo'
export default {
  components: {
    // EtmVideo
    EzuikitVideo
  },
  filters: {
    interval(index) {
      return '周' + ['一', '二', '三', '四', '五', '六', '日'][index]
    }
  },
  props: {
    type: {
      type: String,
      required: true
    },
    cams: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      timeList: [[
        { start: '07:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ], [
        { start: '07:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ], [
        { start: '07:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ], [
        { start: '07:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ], [
        { start: '07:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ], [
        { start: '07:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ], [
        { start: '07:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ]],
      activeCamIndex: 0,
      activeItem: {},
      moveGap: 50,
      // option: {
      //   autoplay: false,
      //   controls: true, // 是否显示底部控制栏
      //   poster: require('@/assets/images/noSteam.png'), // 视频海报
      //   preload: 'none',
      //   fluid: false,
      //   language: 'cn',
      //   notSupportedMessage: '',
      //   hls: {
      //     withCredentials: true
      //   },
      //   controlBar: {
      //     // 自定义按钮的位置
      //     children: [
      //       {
      //         name: 'playToggle'
      //       },
      //       {
      //         name: 'fullscreenToggle'
      //       }
      //     ]
      //   },
      //   sources: []
      // },
      video: {},
      poster: require('@/assets/images/noSteam.png') // 视频海报
    }
  },
  mounted() {
    // document.querySelectorAll('.cams')[this.activeCamIndex].type = 'primary'
    this.$refs.wrap.style.top = '0px'
    this.$refs.wrap.style.left = '0px'
    if (this.$refs.wrap.clientWidth <= 600) {
      this.$refs.prev.style.visibility = 'hidden'
      this.$refs.next.style.visibility = 'hidden'
    }
  },
  methods: {
    refreshData(index) { // 更新弹窗中的内容
      this.getTimeList()
      this.activeCamIndex = index || 0
      this.activeItem = this.cams[this.activeCamIndex]
      this.poster = this.activeItem.photoUrl
      this.queryVideoSource(this.activeItem.cameraId)
    },
    queryVideoSource(cameraId) {
      cameraPlay({ cameraId, deviceOpenTimeType: this.type }).then(res => {
        if (res.data.url) {
          this.video = {
            src: res.data.url.replace('http', 'https'),
            type: 'application/x-mpegURL'
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getTimeList() {
      queryDeviceOpenTimeList({ type: this.type }).then(res => {
        const { data } = res
        const result = []
        if (data.length === 7) {
          data.forEach(v => {
            const daytime = []
            v.deviceOpenTimeVOList.forEach(d => {
              daytime.push({
                deviceOpenTimeId: d.deviceOpenTimeId,
                weekDay: d.weekDay,
                start: d.start,
                end: d.end,
                enable: d.enable,
                sort: d.sort
              })
            })
            result.push(daytime)
          })
        }
        this.timeList = result

        // 标出当前的开放时段
        this.$nextTick(() => {
          Array.prototype.forEach.call(this.$refs.timeList.querySelectorAll('li'), v => {
            v.className = ''
          })
          const activeIndex = new Date().getDay() ? new Date().getDay() - 1 : 6
          this.$refs.timeList.querySelectorAll('li')[activeIndex].className = 'active'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    selectCam(index) {
      this.activeCamIndex = index
      this.activeItem = this.cams[index]
      this.poster = this.activeItem.photoUrl
      this.queryVideoSource(this.activeItem.cameraId)
    },
    nextMove() {
      const wrap = this.$refs.wrap
      wrap.style.left = +wrap.style.left.slice(0, -2) - this.moveGap + 'px'
      this.judgeMoveEdge()
    },
    prevMove() {
      const wrap = this.$refs.wrap
      wrap.style.left = +wrap.style.left.slice(0, -2) + this.moveGap + 'px'
      this.judgeMoveEdge()
    },
    judgeMoveEdge() {
      const wrap = this.$refs.wrap
      const widthGap = -this.$refs.wrap.clientWidth + 600
      if (+wrap.style.left.slice(0, -2) >= 0) {
        wrap.style.left = '0px'
      }
      if (+wrap.style.left.slice(0, -2) <= widthGap) {
        wrap.style.left = widthGap + 'px'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.camera {
  .cameraList {
    height: 450px;
    border-width: 0 0 1px 0;
    border-style: solid;
    @include bc_divide_color();
    .menu {
      display: flex;
      align-items: center;
      height: 50px;
      border-width: 0 0 1px 0;
      border-style: solid;
      @include bc_divide_color();
      .outWrap {
        position: relative;
        margin: 0 16px;
        width: 600px;
        height: 30px;
        overflow: hidden;
        .innerWrap {
          display: flex;
          position: absolute;
          transition: .5s;
          height: 30px;
          .el-button {
            // padding: 8px 14px;
            &.el-button--primary {
              border: 1px solid transparent;
            }
            & + .el-button {
              margin-left: 16px;
            }
          }
        }
      }
      i {
        width: auto;
        font-size: 14px;
        @include c_secondary_color();
        cursor: pointer;
        &.prev {
          transform: rotate(90deg);
        }
        &.next {
          transform: rotate(-90deg);
        }
      }
    }
    .camArea {
      width: 660px;
      height: 365px;
      margin: 16px auto 0;
      .noStream {
        position: relative;
        height: 100%;
        border-radius: 4px;
        background-color: #76829F;
        .tip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -55%);
          text-align: center;
          @include c_white();
          i {
            width: auto;
            font-size: 80px;
          }
        }
        img {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
        }
      }
    }
  }
  .timeList {
    height: 450px;
    border-width: 0 0 1px 1px;
    border-style: solid;
    @include bc_divide_color();
    padding: 16px 0 0 16px;
    p {
      @include c_title_color();
      margin-bottom: 6px;
    }
    ul {
      li {
        margin-bottom: 16px;
        &.active {
          @include c_main_color();
        }
      }
    }
  }
}
</style>
