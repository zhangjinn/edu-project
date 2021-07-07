<template>
  <div class="sleep-wrap">
    <div class="scrollWrap">
      <div class="topWrapper">
        <div v-if="way==='all'" class="lockTime">
          <span>睡眠</span>
          <div class="right">已选{{ childList.length }}人</div>
        </div>
        <div v-else class="childWrap">
          <div class="childInfo">
            <span>{{ name }}</span>{{ name }}
          </div>
          <div class="status">
            睡眠
          </div>
        </div>
        <div v-show="sleepStartTime && way!=='all'&&!sleepEndTime">
          <!--          <div class="cross" />-->
          <div class="timeSelect">
            <div>开始时间</div>
            <div class="startTime">
              {{ startTime }}
            </div>
          </div>
        </div>
        <div v-show="sleepEndTime && way!=='all'">
          <!--          <div class="cross" />-->
          <div class="timeSelect">
            <div>开始时间</div>
            <div class="startTime" @click.stop="showTimeSelect('start')">
              {{ startTime }}<i class="iconfont iconright1" />
            </div>
          </div>
        </div>
        <div v-show="sleepEndTime">
          <div class="cross" />
          <div class="timeSelect">
            <div>结束时间</div>
            <div class="endTime" @click.stop="showTimeSelect('end')">
              {{ endTime }}<i class="iconfont iconright1" />
            </div>
          </div>
        </div>
      </div>

      <div v-show="!sleepStartTime" class="timerWrap">
        <div class="start" @click="star">
          <i class="iconfont iconyousanjiao" />
        </div>
        <div class="timer">
          00:00
        </div>
      </div>
      <div v-show="sleepStartTime&&!sleepEndTime" class="timerWrap">
        <div class="stop" @click="wakeUp">
          <i />
        </div>
        <div v-if="way!=='all'" class="timer">
          {{ sleepCount }}
        </div>
        <div v-else class="wakeUp"> 宝宝睡醒了</div>
      </div>

      <div v-show="sleepStartTime&&sleepEndTime" class="longWrap">
        <div v-show="way!=='all'" class="title">睡眠时长</div>
        <div v-show="way==='all'" class="title">睡眠状态</div>
        <div v-show="way!=='all'" class="time">
          {{ longTime }}
        </div>
        <ul class="feelings">
          <li
            v-for="item in feelingList"
            :key="item.prop"
            :class="{active: feeling === item.prop}"
            @click.stop="selectFeeling(item.prop)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div v-show="sleepStartTime&&sleepEndTime" class="descriptionWrap">
        <div class="title">
          <span>文字描述</span>
          <!--          <div>{{ commentText.length }}/300</div>-->
        </div>
        <van-field
          v-model="commentText"
          rows="4"
          maxlength="300"
          type="textarea"
          placeholder="描述宝宝当前的情况"
          show-word-limit
        />
        <van-uploader
          v-model="imgUrl"
          multiple
          :max-count="9"
          upload-icon="plus"
        />
      </div>
    </div>

    <!--    <div class="bottomBtn">-->
    <!--      <span-->
    <!--        @click.stop="changeSleepStatus"-->
    <!--      >{{ {NOT_SLEEP: '开始睡眠', START_SLEEP: '宝宝睡醒了', END_SLEEP: '结束睡眠'}[sleepType] }}</span>-->
    <!--    </div>-->
    <div v-if="!sleepStartTime&&!sleepEndTime" class="bottomBtn">
      <span
        @click.stop="toSleep"
      >开始睡眠</span>
    </div>
    <div v-if="sleepStartTime&&!sleepEndTime" class="bottomBtn">
      <span
        @click.stop="endSleep"
      >宝宝睡醒了</span>
    </div>
    <div v-if="sleepStartTime&&sleepEndTime" class="bottomBtn">
      <span
        @click.stop="closeSleep"
      >结束睡眠</span>
    </div>

    <van-popup v-model="showPop" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-show="popType === 'start'"
        v-model="startTime"
        type="time"
        title="请选择开始时间"
        :filter="filter1"
        @confirm="showPop = false"
        @cancel="showPop = false"
      />
      <van-datetime-picker
        v-show="popType === 'end'"
        v-model="endTime"
        type="time"
        title="请选择结束时间"
        :filter="filter0"
        @confirm="showPop = false"
        @cancel="showPop = false"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * sleep create by Administrator
 * createTime 2020/11/09 16:40
 */
import { queryList_sleep, createSleep, queryByDiaryId, updateSleepALL } from '@/service/daycare/dailyManage'
import { DateFormat } from '@/js/rules'
import transferDate from '@/js/date'
import { uploadFile } from '@/service/upload'

export default {
  name: 'Sleep',
  components: {},
  filters: {},
  mixins: [],
  props: {
    name: {
      type: String,
      default() {
        return null
      }
    },
    way: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      sleepStatus: 'ready', // ready 开始睡眠 awake 睡醒 end 结束睡眠
      startTime: '00:00',
      endTime: '00:00',
      showPop: false,
      popType: 'start',
      imgUrl: [],
      feeling: '',
      feelingList: [
        { name: '普通', prop: 'NORMAL' },
        { name: '安稳', prop: 'SMOOTH' },
        { name: '不安稳', prop: 'NOT_SMOOTH' },
        { name: '没睡', prop: 'NOT_SLEEP' }
      ],
      commentText: '',
      childId: this.$route.query.childId,
      sleepType: 'NOT_SLEEP',
      diarySettingId: this.$route.query.diarySettingId,
      sleepStartTime: '',
      sleepEndTime: '',
      gapTimer: null,
      sleepCount: '00:00:00',
      longTime: '00:00',
      diaryId: [],
      childList: []
    }
  },
  computed: {},
  watch: {
    // $route: {
    //   handler() {
    //     this.setTimer()
    //   },
    //   immediate: true
    // }
    startTime() {
      const time = this.startTime.split(':')
      const getTime = []
      time.forEach(v => {
        v = parseInt(v)
        // console.log(v)
        getTime.push(v)
      })
      const date = new Date(this.sleepStartTime)
      date.setHours(getTime[0], getTime[1])
      this.sleepStartTime = date.getTime()
      if (this.sleepEndTime) {
        const time = transferDate().gap(this.sleepEndTime - this.sleepStartTime)
        this.longTime = `${time.hours}:${time.miniutes}`
      } else {
        this.setTimer()
      }
    },
    endTime() {
      const time = this.endTime.split(':')
      const getTime = []
      time.forEach(v => {
        v = parseInt(v)
        // console.log(v)
        getTime.push(v)
      })
      const date = new Date(this.sleepStartTime)
      date.setHours(getTime[0], getTime[1])
      this.sleepEndTime = date.getTime()
      if (this.sleepEndTime) {
        const time = transferDate().gap(this.sleepEndTime - this.sleepStartTime)
        this.longTime = `${time.hours}:${time.miniutes}`
      }
    }
  },
  created() {
    this.childList = this.childId = this.$route.query.childId.split(',')
  },
  mounted() {
    this.getSleep()
  },
  beforeDestroy() {
    clearInterval(this.gapTimer)
    this.gapTimer = null
  },
  methods: {
    changeSleepStatus() {
    },
    filter0(type, options) {
      const xTime = this.startTime.split(':')
      if (type === 'hour') {
        return options.filter((option) => option >= parseInt(xTime[0]))
      } else if (type === 'minute') {
        return options.filter((option) => option > parseInt(xTime[1]))
      }
    },
    filter1(type, options) {
      const xTime = this.endTime.split(':')
      if (type === 'hour') {
        return options.filter((option) => option <= parseInt(xTime[0]))
      } else if (type === 'minute') {
        return options.filter((option) => option < parseInt(xTime[1]))
      }
    },
    showTimeSelect(type) {
      this.popType = type
      this.showPop = true
    },
    selectFeeling(prop) {
      this.feeling = prop
    },
    star() {
      // console.log('star')
      this.toSleep()
    },
    wakeUp() {
      // console.log('wakeUP')
      this.endSleep()
    },
    getSleep() {
      if (this.way !== 'update') {
        const childId = this.$route.query.childId
        queryList_sleep({ childIdList: childId, date: null }).then(res => {
          const data = res.data.data
          // console.log(data)
          // console.log(data.length)
          if (data.length) {
            this.sleepStartTime = data[0].startTime
            this.sleepEndTime = data[0].endTime
            this.startTime = DateFormat(data[0].startTime, 'hh:mm')
            if (this.sleepStartTime && !this.sleepEndTime && this.way !== 'all') {
              this.setTimer()
            }
          }
        })
      } else {
        const diaryId = this.$route.query.diaryId
        queryByDiaryId({ diaryId: diaryId }).then(res => {
          // console.log(res.data.data)
          const data = res.data.data
          if (data.endTime) {
            this.sleepStartTime = data.startTime
            this.sleepEndTime = data.endTime
            this.feeling = data.contentObject.sleepType
            this.startTime = DateFormat(data.startTime, 'hh:mm')
            this.commentText = data.description || ''
            this.endTime = DateFormat(data.endTime, 'hh:mm')
            const time = transferDate().gap(this.sleepEndTime - this.sleepStartTime)
            this.longTime = `${time.hours}:${time.miniutes}`
            const imgArr = []
            data.imageList.forEach(v => {
              imgArr.push({
                url: v.url
              })
            })
            this.imgUrl = imgArr
          } else {
            this.sleepStartTime = data.startTime
            this.sleepEndTime = data.endTime
            this.startTime = DateFormat(data.startTime, 'hh:mm')
            if (this.sleepStartTime && !this.sleepEndTime && this.way !== 'all') {
              this.setTimer()
            }
          }
        })
      }
    },
    toSleep() {
      // console.log('123')
      const date = DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      const childList = this.childId = this.$route.query.childId.split(',')
      createSleep({
        jsonBO: { sleepType: null, sleepState: 'START_SLEEP' },
        startTime: date,
        caDiarySettingId: this.diarySettingId,
        childIdList: childList
      }).then(res => {
        console.log(res.data.data)
        const data = res.data.data
        this.sleepStartTime = data[0].startTime
        this.sleepEndTime = data[0].endTime
        this.startTime = DateFormat(data[0].startTime, 'hh:mm')
      })
    },
    endSleep() {
      const date = DateFormat(this.sleepStartTime, 'yyyy-MM-dd hh:mm:ss')
      const endTime = DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      const childList = this.childId = this.$route.query.childId.split(',')
      createSleep({
        jsonBO: { sleepType: null, sleepState: 'START_SLEEP' },
        startTime: date,
        endTime: endTime,
        caDiarySettingId: this.diarySettingId,
        childIdList: childList
      }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        this.sleepStartTime = data[0].startTime
        this.sleepEndTime = data[0].endTime
        this.startTime = DateFormat(data[0].startTime, 'hh:mm')
        this.endTime = DateFormat(data[0].endTime, 'hh:mm')
        const time = transferDate().gap(this.sleepEndTime - this.sleepStartTime)
        this.longTime = `${time.hours}:${time.miniutes}`
        this.diaryId = []
        data.forEach(v => {
          this.diaryId.push(v.diaryId)
        })
      })
    },
    setTimer() {
      // console.log(this.sleepStartTime)
      if (this.gapTimer) return
      this.gapTimer = setInterval(() => {
        const now = Date.now()
        // if (this.lastSleepTimeStamp) {
        //   const time = transferDate().gap(now - this.lastSleepTimeStamp)
        //   this.gapTime = `${time.hours}:${time.miniutes}:${time.seconds}`
        // }
        if (this.sleepStartTime) {
          const time = transferDate().gap(now - this.sleepStartTime)
          this.sleepCount = `${time.hours}:${time.miniutes}:${time.seconds}`
        }
      }, 1000)
    },
    async closeSleep() {
      const childList = this.childId = this.$route.query.childId.split(',')
      const imageList = []
      if (this.imgUrl.length) { // 需要上传图片
        const pArr = []
        this.imgUrl.forEach(v => {
          if (v.file) {
            pArr.push(uploadFile(v.file, 'guardcare/comment/detail', 'image'))
          } else {
            imageList.push(v)
          }
        })
        await Promise.all(pArr).then(res => {
          res.forEach(v => {
            imageList.push({
              name: 'guardcare/comment/detail' + Date.now(),
              url: v.data.key
            })
          })
        }).catch(err => {
          console.log(err)
        })
      }
      let diaryId = null
      if (this.way === 'all') {
        diaryId = this.diaryId
      } else {
        // diaryId = [this.$route.query.diaryId] || this.diaryId
        if (this.$route.query.diaryId) {
          diaryId = [this.$route.query.diaryId]
        } else {
          diaryId = this.diaryId
        }
      }
      const endTime = DateFormat(this.sleepEndTime, 'yyyy-MM-dd hh:mm:ss')
      const startTime = DateFormat(this.sleepStartTime, 'yyyy-MM-dd hh:mm:ss')
      updateSleepALL({
        diaryIdList: diaryId,
        jsonBO: { sleepType: this.feeling || null, sleepState: null },
        endTime: endTime,
        description: this.commentText,
        startTime: startTime,
        imageList: imageList,
        caDiarySettingId: this.diarySettingId,
        childIdList: childList
      }).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '修改成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        this.$router.back()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sleep-wrap {
  .scrollWrap {
    max-height: calc(100vh - 90px);
    overflow-y: auto;
  }

  .cross {
    height: 1px;
    background-color: #eee;
    width: 351px;
    margin: 0 auto;
  }

  .topWrapper {
    border-radius: 3px;

    .lockTime {
      margin: 13px 12px 0;
      background-color: #fff;
      display: flex;
      align-items: center;
      border-bottom: #EEEEEE solid 1px;
      padding: 20px 12px;
      font-size: 15px;
      justify-content: space-between;

      span {
        font-size: 15px;
        color: #222222;
      }

      .right {
        color: #999999;

        span {
          color: #999999;
        }

        i {
          color: #999999;
        }
      }
    }
  }

  .childWrap {
    display: flex;
    justify-content: space-between;
    border-bottom: #EEEEEE solid 1px;
    align-items: center;
    padding: 0 13px;
    width: 351px;
    height: 66px;
    margin: 13px auto 0;
    background-color: $white;

    .childInfo {
      display: flex;
      align-items: center;
      line-height: 35px;
      font-size: 15px;

      span {
        display: inline-block;
        width: 35px;
        height: 35px;
        margin-right: 15px;
        border-radius: 50%;
        background-color: $theme;
        line-height: 35px;
        color: $white;
        font-size: 13px;
      }
    }

    .status {
      font-size: 15px;
    }
  }

  .timeSelect {
    width: 351px;
    height: 55px;
    padding: 0 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $white;
    margin: 0 auto;
    font-size: 15px;

    .startTime, .endTime {
      color: #bbb;
    }
  }

  .timerWrap {
    width: 351px;
    height: 360px;
    margin: 13px auto 0;
    padding-top: 70px;
    border-radius: 3px;
    background-color: $white;

    .start {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      margin: 0 auto;
      border-radius: 50%;
      border: 1px dashed #ccc;
      background-color: #f5f5f5;

      i {
        font-size: 22px;
        color: $red;
        transform: translate(1px, -1px);
      }
    }

    .stop {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      height: 120px;
      margin: 0 auto;
      border-radius: 50%;
      border: 1px solid #f13333;

      i {
        display: block;
        width: 20px;
        height: 20px;
        background-color: #f13333;
        border-radius: 3px;
      }
    }

    .timer {
      margin-top: 65px;
      font-size: 36px;
    }

    .wakeUp {
      margin-top: 65px;
      font-size: 16px;
    }
  }

  .longWrap {
    width: 351px;
    //height: 155px;
    margin: 13px auto 0;
    padding-top: 20px;
    background-color: $white;

    .title {
      font-size: 15px;
      text-align: left;
      text-indent: 12px;
      line-height: 1;
    }

    .time {
      font-size: 30px;
      color: $black;
      line-height: 1;
      margin-top: 22px;
    }

    .feelings {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 30px;
      margin-top: 26px;
      padding-bottom: 20px;

      li {
        width: 73px;
        height: 30px;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        color: $text-9;

        &.active {
          background-color: $themeLight;
          color: $theme;
        }
      }
    }
  }

  .descriptionWrap {
    width: 351px;
    margin: 13px auto 60px;
    background-color: $white;
    text-align: left;

    .title {
      height: 50px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $text-e;

      span {
        font-size: 15px;
      }

      div {
        font-size: 13px;
        color: #999;
      }
    }

    ::v-deep .van-field__control {
      font-size: 12px !important;
    }

    .van-field {
      padding: 10px 24px;
    }

    .van-uploader {
      margin-left: 24px;
    }

    ::v-deep .van-cell::after {
      display: none;
    }

    ::v-deep .van-uploader__upload {
      margin: 0 0 12px 0;
    }
  }

  .bottomBtn {
    position: fixed;
    bottom: 6px;
    left: 12px;
    width: 351px;

    span {
      display: block;
      width: 350px;
      height: 44px;
      line-height: 44px;
      margin: 0 auto;
      font-size: 16px;
      font-weight: bold;
      color: $white;
      text-align: center;
      border-radius: 4px;
      background-color: $theme;
    }
  }
}
</style>
