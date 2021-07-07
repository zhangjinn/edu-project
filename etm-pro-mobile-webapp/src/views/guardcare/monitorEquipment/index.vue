<template>
  <div class="index-wrap">
    <div class="settingTitle">
      <div>
        <i class="iconfont iconleft" @click.stop="$router.back(-1)" />
      </div>
      <div class="title">
        <template v-if="list.length">开放时段：{{ openTime }}</template>
      </div>
      <div v-if="list.length" @click="timeStep = true">
        <i class="iconfont iconhistory" style="font-size: 15px; color: rgb(251, 160, 71)" />
      </div>
    </div>

    <div v-if="list.length" class="videoList">
      <div v-for="(item, index) in list" :key="index" class="video-item">
        <div class="video-bg" @click="play(item.open, item.online, item.cameraId)">
          <van-image v-if="item.online && item.open" fit="cover" :src="item.photoUrl" />
          <van-image v-else fit="cover" :src="require('@/assets/images/videoBg.png')" />
          <div class="video-icon">
            <van-image
              fit="contain"
              :src="status[item.online && item.open ? 'NORMAL' : (item.online ? 'NOT_OPEN_TIME' : 'OFFLINE')].icon"
              :width="status[item.online && item.open ? 'NORMAL' : (item.online ? 'NOT_OPEN_TIME' : 'OFFLINE')].width"
              :height="status[item.online && item.open ? 'NORMAL' : (item.online ? 'NOT_OPEN_TIME' : 'OFFLINE')].height"
            />
            <p>{{ status[item.online && item.open ? 'NORMAL' : (item.online ? 'NOT_OPEN_TIME' : 'OFFLINE')].text }}</p>
          </div>
        </div>
        <div class="video-title">{{ item.cameraName }}</div>
      </div>
    </div>
    <div v-else style="height: 76vh; display: flex; align-items: center; justify-content: center">
      <no-content message="没有可观看的摄像头" type="leave" />
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

  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/10/22 15:20
 */
import noContent from '@/components/common/noContent'
import { queryVideoList, queryOpenList } from '@/service/guardcare/video'

export default {
  name: 'Index',
  components: {
    noContent
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      useInfo: JSON.parse(localStorage.getItem('user')),
      list: [],
      openTime: '',
      timeOpen: '',
      status: {
        'NORMAL': {
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
          text: '抱歉，该视频未到开放时间',
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
    // console.log(this.userInfo)
    queryVideoList({
      // employeeId: this.useInfo.id
    }).then(res => {
      this.list = res.data.data.content
    })

    queryOpenList({ type: 'EMPLOYEE', enableFlag: true }).then(res => {
      // const _res = res.data.data
      // const _currentDay = new Date().getDay()
      // this.columns = _res.map((cur, index) => {
      //   // console.log(cur)
      //   if (Object.keys(this.weekly).indexOf(cur.dayOfWeek) === _currentDay) {
      //     this.openTime = `${cur.deviceOpenTimeVOList[0].start}-${cur.deviceOpenTimeVOList[0].end}
      //     ${cur.deviceOpenTimeVOList[1].start}-${cur.deviceOpenTimeVOList[1].end}`
      //   }
      //
      //   return `星期${this.weekly[cur.dayOfWeek]}
      //     ${cur.deviceOpenTimeVOList[0].start}-${cur.deviceOpenTimeVOList[0].end}
      //     ${cur.deviceOpenTimeVOList[1].start}-${cur.deviceOpenTimeVOList[1].start}`
      // })

      const _res = res.data.data
      let _currentDay = new Date().getDay()
      const result = []

      Object.keys(_res || {}).forEach(cur => {
        if (!cur.length) {
          return
        }

        if (_currentDay === 0) {
          _currentDay = 7
        }
        //  console.log((Object.keys(this.weekly).indexOf(_res[cur].dayOfWeek) + 1) % 6, _currentDay)
        if ((Object.keys(this.weekly).indexOf(_res[cur].dayOfWeek) + 1) === _currentDay) {
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
    onConfirm() {
      this.timeStep = false
    },
    play(open, online, id) {
      this.$router.push({ path: '/guardcare_monitorEquipment_read', query: { open, online, id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

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

  .video-item {
    margin: 12px auto 0;
    width: 350px;
    overflow: hidden;
    border-radius: 4px;

    .video-bg {
      height: 180px;
      position: relative;
      overflow: hidden;

      .video-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #222222;
        font-size: 12px;

        p {
          margin-top: 16px;
        }
      }
    }

    .video-title {
      height: 40px;
      padding: 0 12px;
      line-height: 40px;
      background: #fff;
      font-size: 13px;
      color: #222;
      text-align: left;
    }
  }

  .settingTitle {
    height: 34px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;

    span {
      font-size: 15px;
      color: $text-5;
      vertical-align: middle;
    }

    i {
      color: #555;
    }

    .title {
      color: #222;
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
