<template>
  <div class="index-wrap">

    <div class="settingTitle">
      <div>
        <i class="iconfont iconleft" @click.stop="$router.back(-1)" />
      </div>
      <div class="title">
        <template v-if="timeOpen">开放时段：{{ timeOpen.startTime }}~{{ timeOpen.endTime }}</template>
      </div>
      <div @click="timeStep = true">
        <!--        <img src="../../../assets/images/clock.png" width="15" height="15">-->
        <i class="iconfont iconhistory themeColor" style="font-size: 15px;" />
      </div>
    </div>

    <div v-if="list.length" class="videoList">
      <div v-for="(item, index) in list" :key="index" class="video-item">
        <div class="video-bg" @click="play(item.state === 'NORMAL', item.cameraId)">
          <van-image v-if="item.state === 'NORMAL'" fit="cover" :src="item.photoUrl" />
          <van-image v-else fit="cover" :src="require('@/assets/images/videoBg.png')" />
          <div class="video-icon">
            <!--            <van-image-->
            <!--              fit="contain"-->
            <!--              :src="status[item.state].icon"-->
            <!--              :width="status[item.state].width"-->
            <!--              :height="status[item.state].height"-->
            <!--            />-->
            <i :class="[status[item.state].icon, 'iconfont', item.state !== 'NORMAL' ? 'themeColor' : '']" />
            <p>{{ status[item.state].text }}</p>
          </div>
        </div>
        <div class="video-title">{{ item.cameraName }}</div>
      </div>
    </div>
    <div v-else style="height: 76vh; display: flex; align-items: center; justify-content: center">
      <no-content message="今天没有课程，暂无视频哦~" />
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

import { queryVideoList, queryCameraSetting, queryOpenList } from '@/service/daycare/video'
import noContent from '@/components/common/noContent'
export default {
  name: 'Index',
  components: { noContent },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      list: [],
      timeOpen: '',
      status: {
        NORMAL: {
          text: '',
          // icon: require('@/assets/images/play.png'),
          icon: 'iconbofang',
          width: '32',
          height: '36'
        },
        'OFFLINE': {
          text: '摄像机处于离线状态',
          // icon: require('@/assets/images/NOT_OPEN_TIME .png'),
          icon: 'iconwuxian',
          width: '44',
          height: '55'
        },
        'NOT_OPEN_TIME': {
          text: '未到开放时间',
          // icon: require('@/assets/images/OFFLINE.png'),
          icon: 'iconweidaoshijian',
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
        '7': '天'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    queryVideoList().then(res => {
      this.list = res.data.data
    })

    queryCameraSetting('EMPLOYEE').then(res => {
      this.timeOpen = res.data.data
    })

    queryOpenList({ type: 'EMPLOYEE', enableFlag: true }).then(res => {
      const _res = res.data.data
      const result = []

      Object.keys(_res || {}).forEach(cur => {
        if (!cur.length) {
          return
        }
        let string = `星期${this.weekly[cur]} `

        _res[cur].forEach(c => {
          string += `${c.startTime}-${c.endTime} `
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
    play(status, id) {
      this.$router.push({ path: '/daycare_monitorEquipment_read', query: { id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

  .themeColor{
    color: $theme !important;
  }
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

        i{
          color: #fff;
          font-size: 40px;
        }

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
