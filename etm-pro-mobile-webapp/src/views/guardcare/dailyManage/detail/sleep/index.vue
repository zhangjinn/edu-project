<template>
  <div class="sleep">
    <setting-title no-setting>
      <span>填写记录</span>
    </setting-title>
    <div class="scrollWrap">
      <div class="topWrapper">
        <div v-if="isSingle" class="childWrap">
          <div class="childInfo">
            <span>{{ childList[0].childName.slice(-2) }}</span>{{ childList[0].childName }}
          </div>
          <div class="status">
            睡眠
          </div>
        </div>
        <div v-else class="childGroup">
          <div class="cg_title">
            睡眠
          </div>
          <div class="cg_num">
            已选{{ childList.length }}人
          </div>
        </div>
        <div v-show="sleepStatus !== 'ready' && isSingle">
          <div class="cross" />
          <div class="timeSelect">
            <div>开始时间</div>
            <div class="startTime" @click.stop="showTimeSelect('start')">
              {{ startTime }} >
            </div>
          </div>
        </div>
        <div v-show="sleepStatus === 'end'">
          <div class="cross" />
          <div class="timeSelect">
            <div>结束时间</div>
            <div class="endTime" @click.stop="showTimeSelect('end')">
              {{ endTime }} >
            </div>
          </div>
        </div>
      </div>

      <div v-show="sleepStatus !== 'end'" class="timerWrap">
        <div v-show="sleepStatus === 'ready'" class="start" @click.stop="changeSleepStatus">
          <i class="iconfont iconyousanjiao" />
        </div>
        <div v-show="sleepStatus === 'awake'" class="stop" @click.stop="changeSleepStatus">
          <i />
        </div>
        <div class="timer">
          {{ clockTime }}
        </div>
      </div>

      <div v-show="sleepStatus === 'end'" class="longWrap">
        <div class="title">睡眠时长</div>
        <div v-show="isSingle" class="time">
          {{ sleepLong }}
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

      <text-des v-show="sleepStatus === 'end'" ref="text" />
    </div>

    <div class="bottomBtn">
      <span
        @click.stop="changeSleepStatus"
      >{{ { ready: '开始睡眠', awake: '宝宝睡醒了', end: '结束睡眠' }[sleepStatus] }}</span>
    </div>

    <van-popup v-model="showPop" position="bottom" :style="{ height: '30%' }" @open="saveCacheTime">
      <van-datetime-picker
        v-show="popType === 'start'"
        v-model="startTime"
        type="time"
        title="请选择开始时间"
        @confirm="confirmTimeChange"
        @cancel="showPop = false; startTime = cacheStartTime;"
      />
      <van-datetime-picker
        v-show="popType === 'end'"
        v-model="endTime"
        type="time"
        title="请选择结束时间"
        @confirm="confirmTimeChange"
        @cancel="showPop = false; endTime = cacheEndTime;"
      />
    </van-popup>
  </div>
</template>
<script>
import settingTitle from '../../../components/settingTitle'
import textDes from '../../components/textDes'
import {
  createRecordItem,
  updateRecordItem,
  queryRecordItemDetail
} from '../../../../../service/guardcare/dailyManage'
import { uploadFile } from '../../../../../service/upload'
import { transferDate } from '../../../../../js/rules'
export default {
  components: {
    settingTitle,
    textDes
  },
  data() {
    return {
      sleepStatus: this.$route.query.status, // ready 开始睡眠 awake 睡醒 end 结束睡眠
      startTime: '00:00',
      cacheStartTime: '00:00',
      startTimeStamp: null,
      endTime: '00:00',
      cacheEndTime: '00:00',
      endTimeStamp: null,
      clockTime: '00:00:00',
      showPop: false,
      popType: 'start',
      imgUrl: [],
      recordIdList: [],
      feeling: undefined,
      feelingList: [
        { name: '普通', prop: 1 },
        { name: '安稳', prop: 2 },
        { name: '不安稳', prop: 3 },
        { name: '没睡', prop: 4 }
      ],
      commentText: '',
      childList: this.$store.state.guardcare.dm_child,
      timer: null
    }
  },
  computed: {
    isSingle() { // 标识是否是单个宝宝操作
      return this.childList.length === 1
    },
    sleepLong() { // 睡眠总时长
      if (this.startTimeStamp && this.endTimeStamp) {
        const gap = transferDate().gap(this.endTimeStamp - this.startTimeStamp)
        return `${gap.hours}:${gap.miniutes}:${gap.seconds}`
      } else {
        return '00:00'
      }
    }
  },
  watch: {
    $route: {
      handler() {
        this.setTimer()
      },
      immediate: true
    },
    endTime(v) {
      if (!v) return
      this.endTimeStamp = new Date(`${transferDate(this.endTimeStamp).time} ${v}:00`).getTime()
    },
    startTime(v) {
      if (!v) return
      this.startTimeStamp = new Date(`${transferDate(this.startTimeStamp).time} ${v}:00`).getTime()
    },
    sleepStatus: {
      handler(v) {
        if (v === 'awake' || v === 'end') {
          if (!this.recordIdList.length) {
            this.childList.forEach(v => {
              this.recordIdList.push(v.recordId)
            })
          }
          !this.$route.query.id && this.querySleepTime(this.childList[0].recordId)
        }
      },
      immediate: true
    }
  },
  created() {
    this.getInfo()
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getInfo() {
      const id = this.$route.query.id
      if (!id) return
      queryRecordItemDetail({ growthRecordId: id }).then(res => {
        const { textDesc, imageList, sleeping: { sleepingStatus, endTime, startTime }} = res.data.data
        this.$refs.text.imgUrl = imageList || []
        this.$refs.text.commentText = textDesc || ''
        this.feeling = sleepingStatus
        this.startTimeStamp = startTime
        this.endTimeStamp = endTime
        this.startTime = transferDate(startTime).clock
        this.endTime = transferDate(endTime).clock
      }).catch(err => {
        console.log(err)
      })
    },
    async changeSleepStatus() {
      // 处理childIds
      if (this.sleepStatus === 'ready') { // 新增睡眠记录
        const childIds = []
        this.childList.forEach(v => {
          childIds.push(v.childId)
        })
        createRecordItem({
          childIds,
          name: '睡眠',
          recordTime: transferDate().fullTime,
          type: 'SLEEP',
          sleeping: {
            startTime: transferDate().fullTime
          }
        }).then(async res => {
          this.$toast('操作成功')
          this.recordIdList = res.data.data.idList
          await this.querySleepTime(this.recordIdList[0])
          this.setTimer(Date.now())
          this.sleepStatus = 'awake'
        }).catch(err => {
          this.recordIdList = []
          console.log(err)
        })
        this.sleepStatus = 'awake'
      } else if (this.sleepStatus === 'awake') {
        const options = {
          recordIds: this.recordIdList,
          name: '睡眠',
          recordTime: transferDate().fullTime,
          type: 'SLEEP',
          sleeping: {
            endTime: transferDate().fullTime
          }
        }
        if (this.isSingle) {
          options.sleeping.startTime = (this.$route.query.date || transferDate().time) + ` ${this.startTime}:00`
        }
        updateRecordItem(options).then(async res => {
          this.$toast('操作成功')
          this.endTime = transferDate().clock
          await this.querySleepTime(this.recordIdList[0])
          this.sleepStatus = 'end'
        }).catch(err => {
          console.log(err)
        })
      } else if (this.sleepStatus === 'end') {
        // if (!this.feeling) return this.$toast('请选择睡眠质量')
        const options = {
          recordIds: this.recordIdList,
          name: '睡眠',
          recordTime: transferDate().fullTime,
          type: 'SLEEP',
          textDesc: this.$refs.text.commentText,
          sleeping: {
            endTime: (this.$route.query.date || transferDate().time) + ` ${this.endTime}:00`,
            sleepingStatus: +this.feeling
          }
        }
        if (this.isSingle) {
          options.sleeping.startTime = (this.$route.query.date || transferDate().time) + ` ${this.startTime}:00`
        }

        let imageList = []
        if (this.$refs.text.imgUrl.length) { // 需要上传图片
          if (this.$route.query.id) {
            imageList = this.$refs.text.imgUrl
          } else {
            const pArr = []
            this.$refs.text.imgUrl.forEach(v => {
              pArr.push(uploadFile(v.file, 'guardcare/dailyManage/sleep', 'image'))
            })
            await Promise.all(pArr).then(res => {
              res.forEach(v => {
                imageList.push({
                  name: 'guardcare/dailyManage/sleep' + Date.now(),
                  url: v.data.key
                })
              })
            }).catch(err => {
              console.log(err)
            })
          }
        }
        options.imageList = imageList

        if (this.$route.query.id) {
          options.recordIds = [this.$route.query.id]
        }
        updateRecordItem(options).then(async res => {
          this.$toast('操作成功')
          if (!this.isSingle) { // 批量操作
            this.$router.replace('/guardcare_dailyManage')
          } else { // 单一操作
            this.$router.replace(`/guardcare_dailyManageBrief?childId=${this.childList[0].childId}&childName=${this.childList[0].childName}`)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    querySleepTime(growthRecordId) {
      if (!growthRecordId) return
      queryRecordItemDetail({ growthRecordId }).then(res => {
        let { sleeping: { startTime, endTime }} = res.data.data
        startTime = startTime || Date.now()
        endTime = endTime || Date.now()
        this.startTime = transferDate(startTime).clock
        this.startTimeStamp = startTime
        this.endTime = transferDate(endTime).clock
        this.endTimeStamp = endTime
      }).catch(err => {
        console.log(err)
      })
    },
    showTimeSelect(type) {
      if (this.sleepStatus === 'awake') return // 还没点睡醒之前不能修改睡眠的开始时间
      this.popType = type
      this.showPop = true
    },
    selectFeeling(prop) {
      this.feeling = prop
    },
    setTimer(date) {
      if (this.timer || this.sleepStatus !== 'awake') return
      this.timer = setInterval(() => {
        const base = date || this.startTimeStamp
        const time = transferDate().gap(Date.now() - base)
        this.clockTime = `${time.hours}:${time.miniutes}:${time.seconds}`
      }, 1000)
    },
    confirmTimeChange() {
      if (this.startTime.replace(':', '') <= this.endTime.replace(':', '')) {
        this.showPop = false
      } else {
        this.$toast('开始时间必须小于结束时间!')
      }
    },
    saveCacheTime() {
      this.cacheStartTime = this.startTime
      this.cacheEndTime = this.endTime
    }
  }
}
</script>

<style scoped lang="scss">
.sleep {
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
  }
  .childWrap {
    display: flex;
    justify-content: space-between;
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
  .childGroup {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    width: 351px;
    padding: 0 12px;
    height: 55px;
    background-color: $white;
    margin: 12px auto 0;
    border-radius: 3px;
    .cg_num {
      color: $text-9;
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
    // height: 360px;
    padding-bottom: 60px;
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
  }
  .longWrap {
    width: 351px;
    padding-bottom: 12px;
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
          background-color: #FFF0E2;
          color: $theme;
        }
      }
    }
  }

  .bottomBtn {
    position: fixed;
    bottom: 6px;
    width: 100vw;
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
