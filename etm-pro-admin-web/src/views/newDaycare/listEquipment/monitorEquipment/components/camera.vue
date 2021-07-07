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
                  v-for="(c, i) in camsList"
                  :key="i"
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
              v-if="activeItem.onlineStatus ==='UP' && activeItem.openStatus === 'OPEN'"
              ref="video"
              :data="video"
              class="video"
              width="660"
              height="365"
              :poster="poster"
            />
            <!--            <EtmVideo-->
            <!--              v-if="activeItem.onlineStatus"-->
            <!--              ref="video"-->
            <!--              :data="video"-->
            <!--              class="video"-->
            <!--              width="660"-->
            <!--              height="365"-->
            <!--              :options="option"-->
            <!--            />-->
            <div v-else class="noStream">
              <div class="tip">
                <div v-if="activeItem.onlineStatus ==='UP' && activeItem.openStatus === 'NOT_OPEN'">
                  <i class="iconfont iconweidaoshijian" />
                  <p>未到开放时间</p>
                </div>
                <div v-else-if="activeItem.onlineStatus === 'DOWN'">
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
          <p>开放时段</p>
          <ul>
            <li v-for="(t, i) in setting" :key="i">
              {{ i | interval }}：{{ t[0].startTime }} ~ {{ t[0].endTime }}、{{ t[1].startTime }} ~ {{ t[1].endTime }}
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import EtmVideo from '@/components/EtmVideo'
import EzuikitVideo from '@/components/EzuikitVideo'
import { queryCameraSettingList, queryCameraSrc } from '@/api/newDaycare/monitorEquipment'
import { debounce } from 'throttle-debounce'
export default {
  components: {
    // EtmVideo,
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
      default: () => ''
    },
    id: {
      type: String,
      default: () => ''
    },
    cameraList: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      // cameraList: [],
      video: {},
      setting: [],
      camsList: this.cameraList,
      activeCamIndex: this.activeIndex,
      activeItem: {},
      moveGap: 50,
      // option: {
      //   autoplay: false,
      //   controls: true, // 是否显示底部控制栏
      //   poster: require('@/assets/images/noSteam.png') // 视频海报
      // },
      poster: require('@/assets/images/noSteam.png') // 视频海报
    }
  },
  watch: {
    id(v) {
      if (v) {
        this.init()
      }
    },
    activeIndex: {
      handler(v) {
        this.activeCamIndex = v
        this.selectCam(v)
      },
      immediate: true
    }
    // cameraList(v) {
    //   if (v) this.camsList = v
    // }
  },
  created() {
    this.init()
  },
  mounted() {
    document.querySelectorAll('.cams')[this.activeCamIndex].type = 'primary'
    this.$refs.wrap.style.top = '0px'
    this.$refs.wrap.style.left = '0px'
    if (this.$refs.wrap.clientWidth <= 600) {
      this.$refs.prev.style.visibility = 'hidden'
      this.$refs.next.style.visibility = 'hidden'
    }
  },
  methods: {
    selectCam(index) {
      this.activeCamIndex = index
      this.activeItem = this.camsList[index]
      this.poster = this.activeItem.photoUrl
      this.queryVideoSource(this.activeItem.cameraId)
      // console.log('视频', item)
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
    },
    init() {
      queryCameraSettingList({ type: this.type === 'CLAZZ' ? 'PARENT' : this.type }).then(res => {
        const { data } = res
        this.setting = []
        for (const k in data) {
          this.setting.push(data[k])
        }
        // console.log('设置', this.dragData)
      })
    },
    // queryVideoSource(v) {
    //   queryCameraSrc({ cameraId: v, deviceOpenTimeType: this.type }).then(res => {
    //     // console.log('video视频', res)
    //     // todo 高清 超清切换
    //     if (res.data.url) {
    //       this.video = {
    //         src: res.data.url.replace('http', 'https'),
    //         type: 'application/x-mpegURL'
    //       }
    //     }
    //   })
    // }
    queryVideoSource: debounce(1000, false, function(v) {
      // console.log('video视频切换')
      queryCameraSrc({ cameraId: v, deviceOpenTimeType: this.type }).then(res => {
        // console.log('video视频', res)
        if (res.data.url) {
          this.video = {
            src: res.data.url.replace('http', 'https'),
            type: 'application/x-mpegURL'
          }
        }
      })
    })
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
      }
    }
  }
}
</style>
