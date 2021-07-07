<template>
  <div class="attendanceDetail">
    <div class="header">
      <div class="avatar">
        <img v-if="child.avatar && hasImg" :src="child.avatar" @error="hasImg = false">
        <div v-else class="noImg">{{ subName(child.childName) }}</div>
      </div>
      <div class="name">{{ child.childName }}</div>
    </div>
    <div class="line" />
    <div class="selectBox textLeft van-hairline--bottom">
      <div class="changeWeek">
        <popup :title="currentMonth" type="month" size="big" @select="selectMonth" />
      </div>
      <div v-if="showToday" class="back" @click="backToday">回到今天</div>
    </div>
    <div class="rowBox van-hairline--bottom">
      <van-row>
        <van-col :span="8">
          <div class="column greenColor">
            <p class="count">
              <span class="number">{{ countData.arrivedNumber || 0 }}</span>
              <span>天</span>
            </p>
            <p class="label">出勤天数</p>
          </div>
        </van-col>
        <van-col :span="8">
          <div class="column mainColor">
            <p class="count">
              <span class="number">{{ countData.requestForLeaveNumber || 0 }}</span>
              <span>天</span>
            </p>
            <p class="label">请假天数</p>
          </div>
        </van-col>
        <van-col :span="8">
          <div class="column errorColor">
            <p class="count">
              <span class="number">{{ countData.notArrivedNumber || 0 }}</span>
              <span>天</span>
            </p>
            <p class="label">缺勤天数</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="calendarBox" :class="bigCalendar ? 'bigBox' : ''">
      <div class="calendar">
        <vue-hash-calendar
          ref="calendar"
          :visible.sync="isShowCalendar"
          :default-datetime="defaultDate"
          :disabled-week-view="true"
          :mark-date="markDate"
          not-current-month-day-class-name="notCurrentMonth"
          :disabled-date="getDisabledDate"
          @change="changeDate"
          @slidechange="slide"
        />
      </div>
      <div class="markBox textRight van-hairline--top">
        <span class="mark green">正常</span>
        <span class="mark main">请假</span>
        <span class="mark blue">未离园</span>
        <span class="mark red">缺勤</span>
      </div>
    </div>
    <div class="line" />
    <div class="attendanceMsg textLeft">
      <div class="date">
        <span>{{ dateWeek }}</span>
        <span class="tag" :class="setClass(detail.status)">
          {{ setState(detail.status) }}
        </span>
      </div>
      <div v-if="!detail.enterTime && !detail.leaveTime" class="noRecord textCenter">
        <span v-if="attendanceDateState === 'rest'">当天休息</span>
        <span v-if="attendanceDateState === 'none'">当天无打卡记录</span>
      </div>
      <div class="scrollBox">
        <div v-if="detail.enterTime" class="operateMsg">
          <span class="dot" />
          <p class="time">{{ getTime(detail.enterTime) }}</p>
          <p>
            <span class="iconfont iconcaozuolaoshi" />
            <span>{{ detail.enterRecord }}</span>
          </p>
        </div>
        <div v-if="detail.leaveTime" class="operateMsg outTime">
          <span class="dot" />
          <p class="time">{{ getTime(detail.leaveTime) }}</p>
          <p>
            <span class="iconfont iconcaozuolaoshi" />
            <span>{{ detail.leaveRecord }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import popup from '../../components/popup'
import {
  getMonthAttendanceNum,
  getAttendanceCalendar,
  getAttendanceDetail
} from '../../../../service/guardcare/attendance'
import { DateFormat, getNowDate } from '../../../../js/rules'
import { getChildDetail } from '../../../../service/guardcare/index'

export default {
  name: 'Index',
  components: {
    popup
  },
  data() {
    return {
      childId: '',
      hasImg: true,
      child: {},
      currentMonth: '',
      currentDate: '',
      defaultDate: new Date(),
      isShowCalendar: true,
      markDate: [
        {
          color: '#46B642', // 正常
          date: []
        },
        {
          color: '#10C2C4', // 请假
          date: []
        },
        {
          color: '#428FFA', // 未离园
          date: []
        },
        {
          color: '#F53939', // 缺勤
          date: []
        },
        {
          color: '#EEEEEE', // 非考勤日期，改变样式实现置灰可点
          type: 'circle',
          date: []
        }
      ],
      showToday: false,
      month: '',
      date: '',
      countData: {},
      detail: {},
      dateWeek: '',
      attendanceDateState: '',
      bigCalendar: false
    }
  },
  created() {
    this.childId = this.$route.query.childId
    this.currentDate = DateFormat(new Date(), 'yyyy-MM-dd')
    this.currentMonth = this.getMonth(new Date())
    this.month = DateFormat(new Date(), 'yyyy-MM')
    this.date = DateFormat(new Date(), 'yyyy-MM-dd')
    this.getChild()
    this.getData()
  },
  methods: {
    getChild() {
      getChildDetail(this.childId).then(res => {
        this.child = res.data.data
      })
    },
    subName(name) {
      if (name && name.length > 2) {
        return name.substring(name.length - 2)
      } else {
        return name
      }
    },
    // 日期切换
    changeDate(date) {
      this.currentDate = DateFormat(date, 'yyyy-MM-dd')
      this.currentMonth = this.getMonth(date)
      if (new Date(date).toDateString() !== new Date().toDateString()) {
        this.showToday = true
      } else {
        this.showToday = false
      }
      this.setDateWeek()
      const selectYear = date.getFullYear()
      const selectMonth = date.getMonth()
      const nowYear = new Date().getFullYear()
      const nowMonth = new Date().getMonth()
      const days = this.getMonthDays(selectYear, selectMonth) + new Date(selectYear, selectMonth, 1).getDay()
      if (Math.ceil(days / 7) > 5) {
        this.bigCalendar = true
      } else {
        this.bigCalendar = false
      }
      if (selectYear > nowYear || (selectYear === nowYear && selectMonth > nowMonth)) {
        this.attendanceDateState = 'none'
        this.countData = {}
        this.detail = {}
        return
      }
      if (this.currentDate !== this.date) {
        this.getDetail()
        this.date = this.currentDate
      }
      const month = DateFormat(date, 'yyyy-MM')
      if (this.month !== month) {
        this.month = month
        this.getData()
      }
    },
    // *判断年份是否为润年
    isLeapYear(year) {
      return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)
    },
    // *获取某年某月的天数
    getMonthDays(year, month) {
      return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    },
    getDisabledDate(date) {
      const month = DateFormat(date, 'yyyy-MM')
      const selectMonth = DateFormat(new Date(this.currentDate.replace(/-/g, '/')), 'yyyy-MM')
      if (month === selectMonth) {
        return false
      }
      return true
    },
    // 月份切换
    selectMonth(month) {
      this.currentMonth = this.getMonth(month)
      this.currentDate = DateFormat(month, 'yyyy-MM-dd')
      this.defaultDate = month
      this.getDetail()
    },
    slide(direction) {
      const time = new Date(this.currentDate.replace(/-/g, '/'))
      const year = time.getFullYear()
      let month = time.getMonth()
      const date = time.getDate()
      if (direction === 'left') {
        month++
      } else {
        month--
      }
      this.currentDate = DateFormat(new Date(year, month, date), 'yyyy-MM-dd')
    },
    // 处理选中日期
    setDateWeek() {
      const month = new Date(this.currentDate.replace(/-/g, '/')).getMonth() + 1
      const date = new Date(this.currentDate.replace(/-/g, '/')).getDate()
      this.dateWeek = month + '月' + date + '日 ' + getNowDate(this.currentDate)
    },
    // 返回今日
    backToday() {
      this.currentDate = DateFormat(new Date(), 'yyyy-MM-dd')
      this.defaultDate = new Date()
    },
    getMonth(date) {
      date = new Date(date)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      return year + '年' + month + '月'
    },
    getData() {
      this.getNum()
      this.getMark()
    },
    // 获取月统计数据
    getNum() {
      const param = {
        childId: this.childId,
        date: this.currentDate
      }
      getMonthAttendanceNum(param).then(res => {
        this.countData = res.data.data
      })
    },
    // 获取需要标记的日期数据
    getMark() {
      const param = {
        childId: this.childId,
        date: this.currentDate
      }
      getAttendanceCalendar(param).then(res => {
        const markData = res.data.data
        for (let i = 0; i < this.markDate.length; i++) {
          this.markDate[i].date = []
        }
        markData.forEach(item => {
          const date = DateFormat(new Date(item.date), 'yyyy/MM/dd')
          if (item.status === 'NORMAL') {
            if (this.markDate[0].date.indexOf(date) === -1) {
              this.markDate[0].date.push(date)
            }
          } else if (item.status === 'NOT_LEFT') {
            if (this.markDate[2].date.indexOf(date) === -1) {
              this.markDate[2].date.push(date)
            }
          } else if (item.status === 'REQUEST_FOR_LEAVE') {
            if (this.markDate[1].date.indexOf(date) === -1) {
              this.markDate[1].date.push(date)
            }
          } else if (item.status === 'ABSENCE') {
            if (this.markDate[3].date.indexOf(date) === -1) {
              this.markDate[3].date.push(date)
            }
          } else if (item.status === 'HOLIDAY') {
            if (this.markDate[4].date.indexOf(date) === -1) {
              this.markDate[4].date.push(date)
            }
          }
        })
        this.getDetail()
      })
    },
    // 根据日期获取当天考勤详情
    getDetail() {
      if (this.markDate[4].date.includes(this.currentDate.replace(/-/g, '/'))) {
        this.detail = {}
        this.attendanceDateState = 'rest'
        return
      }
      this.attendanceDateState = 'none'
      const param = {
        childId: this.childId,
        date: this.currentDate
      }
      getAttendanceDetail(param).then(res => {
        this.detail = res.data.data
      })
    },
    setState(status) {
      // NORMAL :正常 NOT_LEFT :未离园 REQUEST_FOR_LEAVE :请假 ABSENCE :缺勤 NON_ATTENDANCE_DAY :非考勤日
      switch (status) {
        case 'NORMAL':
          return '正常'
        case 'NOT_LEFT':
          return '未离园'
        case 'REQUEST_FOR_LEAVE':
          return '请假'
        case 'ABSENCE':
          return '缺勤'
      }
    },
    setClass(status) {
      switch (status) {
        case 'NORMAL':
          return 'normal'
        case 'NOT_LEFT':
          return 'notLeft'
        case 'REQUEST_FOR_LEAVE':
          return 'leave'
        case 'ABSENCE':
          return 'absence'
      }
    },
    getTime(time) {
      if (!time) return null
      time = parseInt(time)
      return DateFormat(time, 'hh:mm')
    }
  }
}
</script>

<style scoped lang="scss">
.attendanceDetail {
  min-height: calc(100vh - 50px);
  background-color: $white;

  .header {
    display: flex;
    padding: 12px;
    background-color: $white;

    .avatar {
      @include round(35px);
      overflow: hidden;

      .noImg {
        height: 35px;
        font-size: 13px;
        color: $white;
        line-height: 35px;
        background-color: $theme;
      }
    }

    .name {
      margin-left: 12px;
      height: 35px;
      line-height: 35px;
      font-size: 15px;
    }
  }

  .selectBox {
    position: relative;
    padding: 0 12px;
    font-size: 16px;

    .back {
      position: absolute;
      top: 12px;
      right: 12px;
      height: 24px;
      line-height: 24px;
      font-size: 13px;
      color: $theme;
    }
  }

  .rowBox {
    padding: 15px 0;

    .column {
      font-size: 12px;

      .number {
        font-size: 21px;
      }

      .label {
        margin-top: 8px;
        opacity: 0.8;
      }
    }
  }

  .calendarBox {
    position: relative;
    padding-bottom: 8px;
    margin-top: 12px;
    background-color: $white;

    &.bigBox {
      padding-bottom: 46px;

      .scrollBox {
        max-height: 92px;
        overflow-y: auto;
      }
    }

    .calendar {
      /deep/ .calendar_title {
        display: none;
      }

      /deep/ .calendar_body {
        margin-top: 0;
        overflow: hidden;

        .calendar_item {
          width: 14.28%;
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

      /deep/ .calendar_item_disable {
        color: $text-9;
        background-color: $white;
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

      /deep/ .notCurrentMonth {
        visibility: hidden;
      }
    }

    .markBox {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 111;
      padding: 12px;
      width: 100%;
      font-size: 13px;
      color: $text-5;
      border-top: .5px solid $text-e;

      .mark {
        position: relative;
        margin-left: 28px;

        &::before {
          display: inline-block;
          position: absolute;
          top: 6px;
          left: -10px;
          content: '';
          @include round(6px);
        }

        &.green {
          &::before {
            background-color: $green;
          }
        }

        &.main {
          &::before {
            background-color: $theme;
          }
        }

        &.blue {
          &::before {
            background-color: $blue;
          }
        }

        &.red {
          &::before {
            background-color: $red;
          }
        }
      }
    }
  }

  .line {
    height: 7px;
    background-color: $bg-5;
  }

  .attendanceMsg {
    padding: 12px;

    .date {
      height: 36px;
      line-height: 36px;
      font-size: 14px;

      .tag {
        display: inline-block;
        padding: 0 9px;
        margin-left: 8px;
        height: 21px;
        line-height: 21px;
        font-size: 12px;
        @include border-radius(3px);

        &.normal {
          color: $green;
          background-color: $greenLight;
        }

        &.notLeft {
          color: $blue;
          background-color: $blueLight;
        }

        &.leave {
          color: $theme;
          background-color: $themeLight;
        }

        &.absence {
          color: $red;
          background-color: $redLight;
        }
      }
    }

    .noRecord {
      padding: 24px;
      font-size: 15px;
      color: $text-9;
    }

    .operateMsg {
      position: relative;
      padding-left: 18px;

      .dot {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 8px;
        @include round(8px);
        border: 1.5px solid $text-c;
      }

      .time {
        font-size: 17px;
      }

      span {
        font-size: 12px;
        color: $text-9;

        &.iconfont {
          margin-right: 4px;
        }
      }
    }

    .outTime {
      margin-top: 24px;

      &::before {
        display: inline-block;
        position: absolute;
        left: 3px;
        top: -51px;
        content: '';
        width: 2px;
        height: 59px;
        border-left: 1px dashed $text-c;
      }
    }
  }
}
</style>
