<template>
  <div class="sleepDetailWrap">
    <div class="sticky">
      <item-card :disabled="true" :list-data="listData" />
      <div class="timer">
        <template v-if="listData[0].state === 'SLEEPING'">
          <p>
            <i class="iconfont icontime-circle" />开始时间：
            {{ startTime }}
          </p>
          <p>
            <i class="iconfont iconshuimian1" />睡眠计时：
            {{ sleepCount }}
          </p>
        </template>
        <template v-else>
          <p
            style="text-align: center; text-indent: 0;"
          >
            距离上次睡觉：{{ gapTime }}
          </p>
        </template>
      </div>
      <div class="shadow" />
    </div>
    <time-line :time-data="timeData" />
  </div>
</template>

<script>
import itemCard from '../components/itemCard'
import timeLine from '../components/timeLine'
import { getSleepRecordDetail } from '../../../../service/sacc/sleepRecord'
import transferDate from '../../../../js/date'

export default {
  components: {
    itemCard,
    timeLine
  },
  data() {
    return {
      listData: [],
      timeData: [],
      startTime: '2020.03.12 14:30',
      sleepCount: '00:00:00',
      sleepTimer: null,
      gapTime: '00:00:00',
      gapTimer: null,
      customerId: undefined,
      lastSleepTimeStamp: null,
      startSleepTime: null
    }
  },
  watch: {
    $route: {
      handler() {
        // 获取个人信息
        const { age, customerId, name, state, avatar, isLeave } = this.$route.query
        this.customerId = customerId
        this.listData = []
        this.listData.push({ name, age, state, avatar, customerId, isLeave })

        // 获取睡眠记录列表数据
        this.refreshTimeLine()

        // 开启计时器
        this.setTimer()
      },
      immediate: true
    }
  },
  beforeDestroy() {
    clearInterval(this.gapTimer)
    this.gapTimer = null
  },
  methods: {
    refreshTimeLine() {
      getSleepRecordDetail(this.customerId).then(res => {
        const { data: { sleepingDetails }} = res.data
        const qualityObj = {
          'CALM': '安稳',
          'UNCALM': '不安稳',
          'NORMAL': '普通'
        }
        const timeLineData = []
        sleepingDetails.forEach((v, i) => {
          if (!i) {
            this.lastSleepTimeStamp = v.endTime
            this.startSleepTime = v.startTime
            const time = transferDate(v.startTime)
            this.startTime = `${time.year}.${time.month}.${time.date} ${time.hours}:${time.miniutes}`
          }
          if (v.quality) {
            const start = transferDate(v.startTime)
            const end = transferDate(v.endTime)
            const gap = transferDate().gap(v.endTime - v.startTime)
            timeLineData.push({
              start: `${start.year}.${start.month}.${start.date} ${start.hours}:${start.miniutes}`,
              end: `${end.year}.${end.month}.${end.date} ${end.hours}:${end.miniutes}`,
              quality: qualityObj[v.quality],
              time: `${gap.hours}:${gap.miniutes}:${gap.seconds}`
            })
          }
        })
        this.timeData = timeLineData
      })
    },
    setTimer() {
      if (this.gapTimer) return
      this.gapTimer = setInterval(() => {
        const now = Date.now()
        if (this.lastSleepTimeStamp) {
          const time = transferDate().gap(now - this.lastSleepTimeStamp)
          this.gapTime = `${time.hours}:${time.miniutes}:${time.seconds}`
        }
        if (this.startSleepTime) {
          const time = transferDate().gap(now - this.startSleepTime)
          this.sleepCount = `${time.hours}:${time.miniutes}:${time.seconds}`
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .sleepDetailWrap {
        height: calc(100vh - 50px);
        background-color: $white;

        .sticky {
            background-color: $white;
        }

        .timer {
            width: 351px;
            padding: 5.5px 0;
            border-radius: 3px;
            background-color: rgba(251, 160, 71, .12);
            margin: 0 auto;

            p {
                line-height: 26px;
                text-align: left;
                text-indent: 50px;
                font-size: 14px;
                color: $theme;

                i {
                    font-size: 14px;
                    margin-right: 11.5px;

                    &.iconshuimian1 {
                        font-size: 13px;
                    }
                }
            }
        }

        .shadow {
            height: 15px;
            box-shadow: 0px 3px 5px 0px rgba(34, 34, 34, 0.06);
        }
    }
</style>
