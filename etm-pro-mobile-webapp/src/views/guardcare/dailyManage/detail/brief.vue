<template>
  <div v-wechat-title="wechatTitle" class="brief">
    <setting-title>
      <div class="canlendarChangeTools">
        <div class="prev" @click="changeWeekly(-1)">
          <van-icon name="arrow-left" />
          上一{{ weekMonth ? '周' : '月' }}
        </div>
        <div class="current" @click="() => { weekMonth ? changeWeekly(0) : '' }">
          {{ weekMonth ? '本周' : `${transferDate(defaultDate).year}年${transferDate(defaultDate).month}月` }}
        </div>
        <div class="next" @click="changeWeekly(1)">下一{{ weekMonth ? '周' : '月' }}
          <van-icon name="arrow" />
        </div>
      </div>
    </setting-title>

    <div :class="['calendar', weekMonth ? 'minHeight' : '']">
      <template v-if="weekMonth">
        <vue-hash-calendar
          ref="calendar"
          :visible.sync="isShowCalendar"
          week-start="monday"
          :is-show-week-view="true"
          :disabled-week-view="false"
          :default-datetime="defaultDate"
          :mark-date="markDate"
          :disabled-scroll="true"
          @change="changeDate"
          @click="calendarClick"
        >
          <template v-slot:day="row">
            <div v-if="row.extendAttr.isToday">今</div>
            <div v-else>{{ row.date.day }}</div>
          </template>
        </vue-hash-calendar>
      </template>

      <template v-else>
        <vue-hash-calendar
          ref="calendar"
          :visible.sync="isShowCalendar"
          :is-show-week-view="false"
          week-start="monday"
          :default-datetime="defaultDate"
          :mark-date="markDate"
          :disabled-scroll="true"
          @change="changeDate"
          @click="calendarClick"
        >
          <template v-slot:day="row">
            <div v-if="row.extendAttr.isToday">今</div>
            <div v-else>{{ row.date.day }}</div>
          </template>
        </vue-hash-calendar>
      </template>

      <div class="calendar-btn" @click="weekMonth = !weekMonth">
        <van-icon name="arrow-down" />
      </div>
    </div>
    <no-content v-if="!dateList.length" message="当天没有成长记录~" type="none" />

    <div v-else class="dilList">
      <div v-for="(item, index) in dateList" :key="index" class="contList">
        <div class="cont">
          <div class="heard">
            <div class="left">
              <img :src="typeEnumObj[item.type].icon" :alt="item.type">
              <span>{{ item.name }}</span>
            </div>
            <div class="right" @click.stop="toDetail(item)">
              <span>{{ transferDate(item.recordTime).clock }}</span>
              <i
                v-show="['IN_SCHOOL', 'OUT_SCHOOL', 'SCHOOL', 'CHECK'].indexOf(item.type) === -1"
                class="iconfont iconright1"
              />
            </div>
          </div>
          <div class="unDo">
            <div v-if="item.type==='EMOTION' && item.emotion && item.emotion.status" class="EMOTIONS">
              <img :src="emotionObj[item.emotion.status - 1].url"><span>{{
                emotionObj[item.emotion.status - 1].text
              }}</span>
            </div>

            <div v-if="item.type==='DIAPER_CHANGE' && item.diaperChange" class="CHANGE_DIAPER">
              <div>
                <span>
                  {{ diaperObj.type[item.diaperChange.type] }}
                </span>
                <span v-if="item.diaperChange.dbShape">
                  {{ diaperObj.dbShape[item.diaperChange.dbShape] }}
                </span>
                <span v-if="item.diaperChange.xbColor">
                  {{ diaperObj.xbColor[item.diaperChange.xbColor] }}
                </span>
                <div
                  v-if="item.diaperChange.xbColor"
                  class="divRa"
                  :class="item.diaperChange.xbColor === 1 ? 'divBorder' : ''"
                  :style="{backgroundColor:diaperObj.xb[item.diaperChange.xbColor]}"
                />
                <span v-if="item.diaperChange.dbColor">
                  {{ diaperObj.dbColor[item.diaperChange.dbColor] }}
                </span>
                <div
                  v-if="item.diaperChange.dbColor"
                  class="divRa"
                  :style="{backgroundColor:diaperObj.db[item.diaperChange.dbColor]}"
                />
              </div>
            </div>

            <div v-if="item.type==='DRINK' || item.type==='NURSE'">
              <span>{{ item.ml }}ml</span>
            </div>

            <div v-if="item.type==='DINING' && item.dining" class="eat">
              <span v-if="item.dining.recipeContent">{{
                item.dining.recipeContent
              }}</span>
              <div>
                <img v-if="item.dining.babyFeelingType" :src="eatObj[item.dining.babyFeelingType].url"><span>{{
                  eatObj[item.dining.babyFeelingType].text
                }}</span></div>
            </div>

            <div v-if="item.type==='SLEEP' && item.sleeping" class="SLEEP">
              <div><span>开始睡眠 {{ transferDate(item.sleeping.startTime).clock }}</span></div>
              <div><span>结束睡眠 {{ transferDate(item.sleeping.endTime).clock }}</span></div>
              <div>
                总计用时
                <span> {{ transferDate().gap(item.sleeping.endTime - item.sleeping.startTime).hour }}小时{{ transferDate().gap(item.sleeping.endTime - item.sleeping.startTime).miniute }}分</span>
                <span v-if="item.sleeping.sleepingStatus"> {{ sleepObj[item.sleeping.sleepingStatus] }}</span>
              </div>
            </div>

            <div v-if="item.textDesc" class="description">
              {{ item.type === 'CHECK' ? item.textDesc + '℃' : item.textDesc }}
            </div>
            <div v-if="item.imageList && item.imageList.length" class="imageList">
              <van-uploader
                v-model="item.imageList"
                :show-upload="false"
                :deletable="false"
                multiple
                upload-icon="plus"
              />
            </div>
          </div>
        </div>
        <div class="line" />
      </div>
    </div>
    <div v-if="canAdd && notFuture" class="footBtn" @click.stop="show = true">
      <div>新增记录</div>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-picker
        title="请选择要新增的记录"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="show = false"
      />
    </van-popup>
  </div>
</template>
<script>
import settingTitle from '@/views/daycare/courseTimeManage/components/settingTitle'
import noContent from '@/components/common/noContent'
import { differ } from '@/views/daycare/courseTimeManage/utils'
import { DateFormat } from '@/js/rules'
import {
  querySettingList,
  queryBabyRecordBriefList,
  queryMonthDaily
} from '../../../../service/guardcare/dailyManage'
import transferDate from '@/js/date'

export default {
  components: {
    settingTitle,
    noContent
  },
  data() {
    return {
      weekMonth: false, // 周日历还是月日历
      show: false, // 是否展示底部弹窗
      dateList: [],
      columns: [],
      isShowCalendar: true,
      defaultDate: new Date(),
      currentDate: new Date(),
      childId: this.$route.query.childId,
      childList: this.$store.state.guardcare.dm_child,
      markDate: [
        {
          color: '#10C2C4',
          date: []
        },
        {
          color: '#999999',
          date: []
        }
      ],
      typeEnumObj: {
        'CUSTOM': {
          name: '自定义',
          icon: require('../../../../assets/images/guardcare/dailyManage/custom-new.png')
        },
        'NURSE': {
          name: '喂奶',
          icon: require('../../../../assets/images/guardcare/dailyManage/milk-new.png')
        },
        'DRINK': {
          name: '喝水',
          icon: require('../../../../assets/images/guardcare/dailyManage/drink-new.png')
        },
        'DINING': {
          name: '进餐',
          icon: require('../../../../assets/images/guardcare/dailyManage/eat-new.png')
        },
        'DIAPER_CHANGE': {
          name: '换尿布',
          icon: require('../../../../assets/images/guardcare/dailyManage/diaper-new.png')
        },
        'SLEEP': {
          name: '睡眠',
          icon: require('../../../../assets/images/guardcare/dailyManage/sleep-new.png')
        },
        'EMOTION': {
          name: '情绪',
          icon: require('../../../../assets/images/guardcare/dailyManage/emotion-new.png')
        },
        'SCHOOL': {
          name: '到/离园',
          icon: require('../../../../assets/images/guardcare/dailyManage/school-new.png')
        },
        'IN_SCHOOL': {
          name: '到/离园',
          icon: require('../../../../assets/images/guardcare/dailyManage/school-new.png')
        },
        'OUT_SCHOOL': {
          name: '到/离园',
          icon: require('../../../../assets/images/guardcare/dailyManage/school-new.png')
        },
        'CHECK': {
          name: '健康检查',
          icon: require('../../../../assets/images/guardcare/dailyManage/check-new.png')
        }
      },
      emotionObj: [
        { text: '兴奋', url: require('../../../../assets/images/daycare/dailyExcited.png') },
        { text: '开心', url: require('../../../../assets/images/daycare/dailyHappy.png') },
        { text: '一般', url: require('../../../../assets/images/daycare/dailyE_Normal.png') },
        { text: '生气', url: require('../../../../assets/images/daycare/dailyAngry.png') },
        { text: '难过', url: require('../../../../assets/images/daycare/dailySad.png') }
      ],
      eatObj: {
        'hate': {
          text: '讨厌',
          url: require('../../../../assets/images/daycare/dailyHate.png')
        },
        'not_really_like': {
          text: '不太喜欢',
          url: require('../../../../assets/images/daycare/dailyDont_like.png')
        },
        'general': {
          text: '一般',
          url: require('../../../../assets/images/daycare/dailyGeneral.png')
        },
        'like': {
          text: '喜欢',
          url: require('../../../../assets/images/daycare/dailyLike.png')
        },
        'very_like': {
          text: '很喜欢',
          url: require('../../../../assets/images/daycare/dailylikemuch.png')
        }
      },
      sleepObj: ['', '普通', '安稳', '不安稳', '没睡'],
      diaperObj: {
        type: ['', '嘘嘘', '便便', '嘘嘘+便便', '干爽'],
        dbShape: ['', '颗粒状', '干硬', '正常', '糊状', '水状'],
        xbColor: ['', '乳白色', '红色', '正常', '黄色', '浓茶色'],
        xb: ['', '#FFFFFF', '#EE8285', '#FCEEBE', '#F4BA49', '#906845'],
        dbColor: ['', '灰白色', '绿色', '黄色', '棕色', '黑色', '红色'],
        db: ['', '#D5D5D5', '#4E7323', '#F4BA49', '#906845', '#474747', '#EE8285']
      },
      notFuture: true
    }
  },
  computed: {
    canAdd() {
      if (['NORMAL', 'NOT_LEFT'].indexOf(this.childList[0].status) !== -1) {
        return true
      } else {
        return false
      }
    },
    wechatTitle() {
      return this.childList[0].childName ? `${this.childList[0].childName}成长记` : '萌宝成长记'
    }
  },
  created() {
    this.getDate(differ(0, new Date()).dateFormat)
    this.getMarkDate()
    this.getSetting()
  },
  methods: {
    getMarkDate() {
      queryMonthDaily({ childId: this.childId, date: transferDate(this.defaultDate.getTime()).time }).then(res => {
        const { data } = res.data
        const normal = []
        const absent = []
        data.forEach(v => {
          if (['NORMAL', 'NOT_LEFT'].indexOf(v.attendanceStatus) !== -1) {
            normal.push(transferDate(v.date).time)
          } else {
            absent.push(transferDate(v.date).time)
          }
        })
        this.markDate[0]['date'] = normal
        this.markDate[1]['date'] = absent
      })
    },
    transferDate(time) {
      return transferDate(time)
    },
    getSetting() {
      querySettingList({ enable: true }).then(res => {
        const { data } = res.data
        data.forEach(v => {
          v.text = v.name
        })
        this.columns = data
      }).catch(err => {
        console.log(err)
      })
    },
    getDate(date) {
      queryBabyRecordBriefList({ date: date, childId: this.childId }).then(res => {
        this.dateList = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    changeDate(date) {
      this.currentDate = date
      if (date.getTime() > Date.now()) {
        this.notFuture = false
      } else {
        this.notFuture = true
      }
    },
    toDetail(item) {
      switch (item.type) {
        case 'CUSTOM':
          this.$router.push(`/guardcare_dailyManageCustom?name=${item.name}&id=${item.id}&date=${transferDate(this.currentDate).time}`)
          break
        case 'NURSE':
          this.$router.push(`/guardcare_dailyManageMilk?id=${item.id}&date=${transferDate(this.currentDate).time}`)
          break
        case 'DRINK':
          this.$router.push(`/guardcare_dailyManageDrink?id=${item.id}&date=${transferDate(this.currentDate).time}`)
          break
        case 'DINING':
          this.$router.push(`/guardcare_dailyManageEat?id=${item.id}&date=${transferDate(this.currentDate).time}`)
          break
        case 'DIAPER_CHANGE':
          this.$router.push(`/guardcare_dailyManageDiaper?id=${item.id}&date=${transferDate(this.currentDate).time}`)
          break
        case 'SLEEP':
          this.$router.push(`/guardcare_dailyManageSleep?id=${item.id}&status=end&date=${transferDate(this.currentDate).time}`)
          break
        case 'EMOTION':
          this.$router.push(`/guardcare_dailyManageEmotion?id=${item.id}&date=${transferDate(this.currentDate).time}`)
          break
        case 'SCHOOL':
          break
        case 'IN_SCHOOL':
          break
        case 'OUT_SCHOOL':
          break
        case 'CHECK':
      }
    },
    calendarClick(event) {
      const date = differ(0, event)
      this.getDate(date.dateFormat)
    },
    changeWeekly(step) {
      let _date = null
      if (this.weekMonth) {
        // 周
        const currentDay = this.defaultDate.getTime()
        const aWeeklay = 24 * 3600 * 1000 * 7
        if (step) {
          _date = new Date(currentDay + step * aWeeklay)
        } else {
          _date = new Date()
        }
      } else {
        // 月
        const defaultDate = new Date(this.defaultDate.getTime())
        defaultDate.setDate(1)

        if (step) {
          const _resuslt = differ(step < 0 ? -1 : 32 * step, defaultDate)
          const _r = new Date(_resuslt.dateFormat)
          _r.setDate(1)
          _date = _r
        } else {
          _date = new Date()
        }
      }
      if (_date.getMonth() !== this.defaultDate.getMonth()) {
        this.getMarkDate()
        this.markDate[0]['date'] = []
        this.markDate[1]['date'] = []
      }
      this.defaultDate = _date
      this.$nextTick(() => {
        this.getDate(DateFormat(this.defaultDate, 'yyyy-MM-dd'))
      })
    },
    onConfirm(value, index) { // 新增记录
      this.show = false
      switch (value.type) {
        case 'NURSE': // 喂奶
          this.$router.push(`/guardcare_dailyManageMilk?date=${transferDate(this.currentDate).time}`)
          break
        case 'DINING': // 吃饭
          this.$router.push(`/guardcare_dailyManageEat?date=${transferDate(this.currentDate).time}`)
          break
        case 'DIAPER_CHANGE': // 换尿布
          this.$router.push(`/guardcare_dailyManageDiaper?date=${transferDate(this.currentDate).time}`)
          break
        case 'DRINK': // 饮水
          this.$router.push(`/guardcare_dailyManageDrink?date=${transferDate(this.currentDate).time}`)
          break
        case 'EMOTION': // 情绪
          this.$router.push(`/guardcare_dailyManageEmotion?date=${transferDate(this.currentDate).time}`)
          break
        case 'SLEEP': // 睡眠
          if (this.childList[0].sleepStatus === 'WAKEUP') {
            this.$router.push(`/guardcare_dailyManageSleep?status=ready&date=${transferDate(this.currentDate).time}`)
          }
          if (this.childList[0].sleepStatus === 'SLEEPING') {
            this.$toast('宝宝正在睡眠状态，请先结束睡眠后再新增睡眠记录')
          }
          break
        case 'CUSTOM': // 自定义
          this.$router.push(`/guardcare_dailyManageCustom?name=${value.text}&date=${transferDate(this.currentDate).time}`)
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.brief {

  .canlendarChangeTools {
    font-size: 12px;
    color: #999;
    align-items: center;
    display: flex;

    i {
      display: inline-block;
      vertical-align: middle;
      color: #999999;
    }

    .current {
      font-size: 16px;
      margin: 0 16px;
      color: #222;
    }

  }

  ::v-deep {

    .settingTitle {
      .van-dropdown-menu.van-hairline--top-bottom {
        height: 100%;
        background: transparent;

        .van-ellipsis {
          color: #fff;
        }

        .van-dropdown-menu__title {
          &:after {
            border-color: transparent transparent #fff #fff
          }
        }
      }
    }
  }

  .top {
    height: 14px;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #EEEEEE;
  }

  .calendar {
    margin-bottom: 12px;
    border-radius: 6px;
    padding-bottom: 10px;
    overflow: hidden;
    position: relative;

    .calendar-btn {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 14px;
      background: #F5F5F5;
      left: 50%;
      bottom: 10px;
      transform: translate(-50%, 22px) rotate(45deg);
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        font-size: 12px;
        transform: rotate(-45deg) translate(0, -2px);
        vertical-align: middle;

      }
    }

    &.minHeight {
      /deep/ .calendar_inline {
        height: 80px !important;

        .calendar_content {
          height: 80px !important;
        }
      }
    }

    ///deep/ .calendar_week{
    //  margin-top: 4px;
    //}
    /deep/ .calendar_inline {
      //height: 100px !important;

      .calendar_content {
        padding-bottom: 15px;
        //height: 100px !important;

        .calendar_title {
          display: none;
        }

        .calendar_body {
          margin-top: 0;

          .calendar_item {
            width: 14.28%;
          }
        }
      }
    }

    /deep/ .calendar_first_today {
      color: $theme;
    }

    /deep/ .calendar_day_checked {
      background-color: $theme;

      &.calendar_first_today {
        color: $white;
      }
    }

    /deep/ .calendar_day {
      margin-bottom: 2px;
    }

    /deep/ .calendar_dot {
      margin-bottom: 2px;
      @include wh(4px, 4px);
    }

    /deep/ .calendar_mark_circle {
      color: $text-9;
      border: none;

      &.calendar_day_checked {
        color: $white;
      }
    }
  }

  .dilList {
    width: 100%;
    background-color: #fff;
    margin-bottom: 55px;

    .line {
      width: 292px;
      height: 1px;
      background-color: #EEEEEE;
      margin-left: 68px;
    }

    .contList {

      .cont {
        padding: 15px;

        .heard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;

          .left {
            display: flex;
            align-items: center;

            img {
              width: 38px;
              height: 38px;
              display: inline-block;
              margin-right: 14px;
            }

            span {
              font-size: 15px;
              font-weight: 500;
              color: #222222;
            }
          }

          .right {
            span {
              font-size: 13px;
              font-weight: 400;
              color: #999999;
              display: inline-block;
              margin-left: 5px;
            }

            i {
              font-size: 13px;
              color: #999999;
            }
          }
        }

        .unDo {
          padding-left: 53px;
          text-align: left;

          div {
            margin-bottom: 15px;

            span {
              font-size: 14px;
              color: #222222;
            }
          }

          .description {
            font-size: 14px;
            color: #999999;
            margin-bottom: 15px;
          }

          .EMOTIONS {
            display: flex;
            align-items: center;
            margin-bottom: 15px;

            img {
              width: 20px;
              height: 18px;
              display: inline-block;
              margin-right: 6px;
            }

            span {
              font-size: 14px;
              color: #222222;
            }
          }

          .CHANGE_DIAPER {
            div {
              display: flex;
              align-items: center;
            }

            span {
              font-size: 14px;
              color: #222222;
              display: inline-block;
              margin-right: 5px;
            }

            .divRa {
              width: 15px;
              height: 15px;
              border-radius: 50%;
              margin: 0;
            }
          }

          .eat {
            img {
              width: 20px;
              height: 18px;
              display: inline-block;
              margin-right: 6px;
            }

            div {
              display: flex;
              align-items: center;
              margin-top: 12px;
            }
          }

          .imageList {
            ::v-deep .van-uploader {
              margin: 0;
            }
          }
        }
      }

    }
  }

  .footBtn {
    position: fixed;
    bottom: 0;
    left: 12px;
    width: 100%;
    padding-bottom: 5px;
    background-color: #fff;

    div {
      width: calc(100vw - 24px);
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-radius: 4px;
      color: $white;
      font-size: 16px;
      background-color: $theme;
    }
  }

  .divBorder {
    border: 1px #999999 solid;
  }
}
</style>
