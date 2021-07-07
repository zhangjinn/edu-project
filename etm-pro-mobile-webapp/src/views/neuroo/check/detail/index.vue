<template>
  <div class="checkDetail">
    <div class="header">
      <div class="avatar">
        <img v-if="customer.avatar && hasImg" :src="customer.avatar" @error="hasImg = false">
        <div v-else class="noImg">{{ subName(customer.name) }}</div>
      </div>
      <div class="name">{{ customer.name }}</div>
    </div>
    <div class="calendarBox">
      <div class="date textLeft van-hairline--bottom">
        <div class="changeWeek">
          <popup :title="currentMonth" type="month" size="big" @select="selectMonth" />
        </div>
        <div v-if="showToday" class="back" @click="backToday">回到今天</div>
      </div>
      <div class="calendar">
        <vue-hash-calendar
          ref="calendar"
          :visible.sync="isShowCalendar"
          :is-show-week-view="true"
          :disabled-week-view="true"
          :default-datetime="defaultDate"
          :mark-date="markDate"
          @change="changeDate"
        />
      </div>
    </div>
    <div class="container textLeft">
      <div class="title">检查详情</div>
      <div class="content">
        <div v-if="noData" class="noData">
          <no-content message="当天没有检查记录~" type="none" />
        </div>
        <div v-if="morningData.checkRecordId" class="morning">
          <div class="top">
            <div class="iconBox">
              <span class="icon">
                <img src="../../../../assets/images/morningIcon.png">
              </span>
              <span class="text">晨检</span>
            </div>
            <div class="time">{{ getTime(morningData.createTime) }}</div>
          </div>
          <div class="main" :class="noonData.checkRecordId ? 'beforeLine' : ''">
            <div class="innerBox">
              <p class="state" :class="morningData.abnormal ? 'errorColor' : 'greenColor'">
                {{ morningData.abnormal ? '异常' : '正常' }}
                <span
                  v-if="morningData.abnormal"
                  class="degress"
                  :class="abnormalDegress(morningData.temperature) ? 'abnormal' : 'normal'"
                >{{ morningData.temperature }}°C</span>
              </p>
              <p v-if="morningData.abnormal" class="innerText errorColor">
                <i>症状：{{ morningData.symptom.replace(/,/g,'，') }}</i>
              </p>
              <p v-else class="innerText">您的宝宝非常健康哦~</p>
              <p v-if="morningData.mark" class="innerText">{{ morningData.mark }}</p>
              <div v-if="morningData.imageList" class="picBox">
                <span v-for="(item,index) in morningData.imageList" :key="index" class="img">
                  <img :src="item.url" @click="showImg(item.url)">
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="noonData.checkRecordId" class="noon">
          <div class="top">
            <div class="iconBox">
              <span class="icon">
                <img src="../../../../assets/images/noonIcon.png">
              </span>
              <span class="text">午检</span>
            </div>
            <div class="time">{{ getTime(noonData.createTime) }}</div>
          </div>
          <div class="main" :class="nightData.checkRecordId ? 'beforeLine' : ''">
            <div class="innerBox">
              <p class="state" :class="noonData.abnormal ? 'errorColor' : 'greenColor'">
                {{ noonData.abnormal ? '异常' : '正常' }}
                <span
                  v-if="noonData.abnormal"
                  class="degress"
                  :class="abnormalDegress(noonData.temperature) ? 'abnormal' : 'normal'"
                >{{ noonData.temperature }}°C</span>
              </p>
              <p v-if="noonData.abnormal" class="innerText errorColor">
                <i>症状：{{ noonData.symptom.replace(/,/g,'，') }}</i>
              </p>
              <p v-else class="innerText">您的宝宝非常健康哦~</p>
              <p v-if="noonData.mark" class="innerText">{{ noonData.mark }}</p>
              <div v-if="noonData.imageList" class="picBox">
                <span v-for="(item,index) in noonData.imageList" :key="index" class="img">
                  <img :src="item.url" @click="showImg(item.url)">
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="nightData.checkRecordId" class="night">
          <div class="top">
            <div class="iconBox">
              <span class="icon">
                <img src="../../../../assets/images/nightIcon.png">
              </span>
              <span class="text">晚检</span>
            </div>
            <div class="time">{{ getTime(nightData.createTime) }}</div>
          </div>
          <div class="main">
            <div class="innerBox">
              <p class="state" :class="nightData.abnormal ? 'errorColor' : 'greenColor'">
                {{ nightData.abnormal ? '异常' : '正常' }}
                <span
                  v-if="nightData.abnormal"
                  class="degress"
                  :class="abnormalDegress(nightData.temperature) ? 'abnormal' : 'normal'"
                >{{ nightData.temperature }}°C</span>
              </p>
              <p v-if="nightData.abnormal" class="innerText errorColor">
                <i>症状：{{ nightData.symptom.replace(/,/g,'，') }}</i>
              </p>
              <p v-else class="innerText">您的宝宝非常健康哦~</p>
              <p v-if="nightData.mark" class="innerText">{{ nightData.mark }}</p>
              <div v-if="nightData.imageList" class="picBox">
                <span v-for="(item,index) in nightData.imageList" :key="index" class="img">
                  <img :src="item.url" @click="showImg(item.url)">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '../../../../js/rules'
import popup from '../../components/popup'
import noContent from '../../../../components/common/noContent'
import { getCheckRecord, getDayState } from '../../../../service/neuroo/check'
import { getCustomerDetail } from '../../../../service/neuroo/index'
import { ImagePreview } from 'vant'

export default {
  name: 'Schedule',
  components: {
    popup,
    noContent,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      customerId: '',
      customer: {},
      hasImg: true,
      currentDate: '',
      currentMonth: '',
      month: '',
      noData: false,
      morningData: {},
      noonData: {},
      nightData: {},
      showToday: false,
      isShowCalendar: true,
      defaultDate: new Date(),
      markDate: [
        {
          color: '#F53939',
          date: []
        },
        {
          color: '#EEEEEE', // 非考勤日期，改变样式实现置灰可点
          type: 'circle',
          date: []
        }
      ]
    }
  },
  created() {
    this.customerId = this.$route.query.customerId
    this.currentDate = DateFormat(new Date(), 'yyyy-MM-dd')
    this.currentMonth = this.getMonth(new Date())
    this.month = DateFormat(new Date(), 'yyyy-MM')
    this.getState()
    this.getCustomer()
  },
  methods: {
    abnormalDegress(degress) {
      if (degress < 36 || degress > 37.2) return true
      return false
    },
    getCustomer() {
      getCustomerDetail(this.customerId).then(res => {
        this.customer = res.data.data.customerInfo
      })
    },
    subName(name) {
      if (name && name.length > 2) {
        return name.substring(name.length - 2)
      } else {
        return name
      }
    },
    changeDate(date) {
      this.currentDate = DateFormat(date, 'yyyy-MM-dd')
      this.currentMonth = this.getMonth(date)
      if (new Date(date).toDateString() !== new Date().toDateString()) {
        this.showToday = true
      } else {
        this.showToday = false
      }
      const month = DateFormat(date, 'yyyy-MM')
      if (this.month !== month) {
        this.month = month
        this.getState()
      }
      this.getDetail()
    },
    selectMonth(month) {
      this.currentMonth = this.getMonth(month)
      this.currentDate = DateFormat(month, 'yyyy-MM-dd')
      this.defaultDate = month
    },
    getTime(time) {
      if (!time) return null
      time = parseInt(time)
      return DateFormat(time, 'hh:mm')
    },
    getMonth(date) {
      date = new Date(date)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      return year + '年' + month + '月'
    },
    backToday() {
      this.currentDate = DateFormat(new Date(), 'yyyy-MM-dd')
      this.defaultDate = new Date()
    },
    getDetail() {
      const param = {
        customerId: this.customerId,
        date: this.currentDate
      }
      getCheckRecord(param).then(res => {
        const attendanceData = res.data.data
        if (!attendanceData.length) {
          this.noData = true
        } else {
          this.noData = false
        }
        this.morningData = {}
        this.noonData = {}
        this.nightData = {}
        attendanceData.forEach(item => {
          if (item.checkType === 'MORNING_CHECK') {
            this.morningData = item
          } else if (item.checkType === 'NOON_CHECK') {
            this.noonData = item
          } else if (item.checkType === 'NIGHT_CHECK') {
            this.nightData = item
          }
        })
      })
    },
    lastMonth(date) {
      date = new Date(date)
      const weekTime = 7 * 24 * 3600 * 1000
      const nowTime = date.getTime()
      return DateFormat(new Date(nowTime - weekTime), 'yyyy-MM-dd')
    },
    nextMonth(date) {
      date = new Date(date)
      let currentMonth = date.getMonth()
      const nextMonth = ++currentMonth
      const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 7)
      return DateFormat(new Date(nextMonthFirstDay), 'yyyy-MM-dd')
    },
    getState() {
      const start = this.currentDate.split('-')[0] + '/' + this.currentDate.split('-')[1] + '/01'
      const startDate = this.lastMonth(start)
      const endDate = this.nextMonth(this.currentDate.replace(/-/g, '/'))
      const param = {
        customerId: this.customerId,
        startDate: startDate,
        endDate: endDate
      }
      getDayState(param).then(res => {
        const data = res.data.data
        data.forEach(item => {
          const date = DateFormat(new Date(item.date), 'yyyy-MM-dd')
          if (item.holiday) {
            if (this.markDate[1].date.indexOf(date) === -1) {
              this.markDate[1].date.push(date)
            }
          } else if (item.abnormal) {
            if (this.markDate[0].date.indexOf(date) === -1) {
              this.markDate[0].date.push(date)
            }
          }
        })
      })
    },
    showImg(img) {
      ImagePreview({
        images: [
          img
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .checkDetail {
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

        .calendarBox {
            position: relative;
            z-index: 11;
            margin-top: 12px;
            background-color: $white;
            box-shadow: 0px 4px 8px 0px rgba(34, 34, 34, 0.04);

            .date {
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

            .calendar {
                /deep/ .calendar_inline {
                    height: 72px !important;

                    .calendar_content {
                        padding-bottom: 15px;
                        height: 72px !important;

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
        }

        .container {
            padding: 25px 12px;
            height: calc(100vh - 238px);
            overflow-y: auto;
            background-color: $white;

            .title {
                color: $black;
            }

            .content {
                padding: 24px 0 0 12px;

                .noData {
                    padding-top: 60px;
                }

                .noon, .night {
                    margin-top: 24px;
                }

                .beforeLine {
                    position: relative;

                    &::before {
                        display: inline-block;
                        position: absolute;
                        left: 6px;
                        top: 12px;
                        content: '';
                        width: 1px;
                        height: 100%;
                        background-color: $text-c;
                    }
                }

                .top {
                    display: flex;
                    justify-content: space-between;
                    height: 24px;
                    line-height: 24px;

                    .iconBox {
                        .icon {
                            display: inline-block;
                            margin-right: 16px;
                            width: 16px;
                        }

                        .text {
                            font-size: 15px;
                        }
                    }

                    .time {
                        font-size: 13px;
                        color: $text-9;
                    }
                }

                .main {
                    padding: 15px 0 0 32px;

                    .innerBox {
                        padding: 20px 15px;
                        background-color: $bg-9;
                        @include border-radius(2px);

                        .state {
                            position: relative;
                            height: 16px;
                            line-height: 16px;
                            font-size: 16px;

                            .degress {
                                position: absolute;
                                left: 42px;
                                padding: 1px 5px;
                                height: 16px;
                                line-height: 14px;
                                font-size: 12px;
                                @include border-radius(2px);

                                &.abnormal {
                                    color: $red;
                                    border: 1px solid $red;
                                }

                                &.normal {
                                    color: $green;
                                    border: 1px solid $green;
                                }
                            }
                        }

                        .innerText {
                            margin-top: 12px;
                            font-size: 14px;
                            color: $text-5;

                            i {
                                font-style: italic;
                            }
                        }

                        .picBox {
                            margin-top: 6px;

                            .img {
                                display: inline-block;
                                margin-top: 9px;
                                width: 85px;
                                height: 85px;
                                @include border-radius(2px);
                                overflow: hidden;

                                &:not(:nth-child(3n+3)) {
                                    margin-right: 9px;
                                }

                                img {
                                    display: block;
                                }
                            }
                        }

                        .noMsg {
                            height: 32px;
                            line-height: 32px;
                            font-size: 14px;
                            color: $text-9;
                        }
                    }
                }
            }
        }
    }
</style>
