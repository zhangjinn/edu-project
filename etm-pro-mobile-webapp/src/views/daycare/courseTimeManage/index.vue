<template>
  <div class="index-wrap">
    <setting-title>
      <div class="canlendarChangeTools">
        <div class="prev" @click="changeWeekly(-1)">
          <van-icon name="arrow-left" />
          上一{{ weekMonth ? '周' : '月' }}
        </div>
        <div class="current" @click="changeWeekly(0)">本{{ weekMonth ? '周' : '月' }}</div>
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
          weekStart="monday"
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
          weekStart="monday"
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
    <no-content v-if="!dateList.length" message="当天没有排课记录~" type="none" />

    <div v-else class="course-list">
      <div
        v-for="(item, index) in dateList"
        :key="index"
        class="course-item"
        @click.stop="goTo(item.courseManagementId, item.courseManagementType)"
      >
        <div class="course-title">
          {{ item.courseName }} {{ item.startTime }}-{{ item.endTime }}
        </div>
        <div class="course-plan">
          <p>上课班级： <span>{{ item.clazzName }}</span></p>
          <p>学员/学位： <span>{{ item.childNum }}/{{ item.childPositionNum }}</span></p>
          <p>请假学员： <span>{{ item.askForLeaveNum }}</span></p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/10/19 18:18
 */
import settingTitle from '@/views/daycare/courseTimeManage/components/settingTitle'
import noContent from '@/components/common/noContent'
import { differ } from '@/views/daycare/courseTimeManage/utils'
import { queryDateList, queryDayDate } from '@/service/daycare/courseTime'
import { DateFormat } from '@/js/rules'

export default {
  name: 'Index',
  components: {
    settingTitle,
    noContent
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      // currMonthDate : [],
      dateList: [],
      // 一周选择
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      // 日历
      isShowCalendar: true,
      weekMonth: false,
      markDate: [
        {
          color: '#10C2C4',
          date: []
        }
      ],
      defaultDate: new Date()
      // 头部
      // semester: '123',
      // semesterList: [{
      //   text: 'dfdf',
      //   value: '123'
      // }],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDate(differ(0, new Date()).dateFormat)
    queryDateList(DateFormat(this.defaultDate, 'yyyy-MM-dd')).then(res => {
      // console.log(res.data)
      this.markDate[0]['date'] = res.data.data || []
    })
  },
  mounted() {
  },
  methods: {
    getDate(date) {
      queryDayDate(date).then(res => {
        this.dateList = res.data.data
      })
    },
    goTo(id, type) {
      this.$router.push({ path: '/daycare_courseTimeManage_detail', query: { id, type }})
    },
    changeDate() {
    },
    calendarClick(event) {
      const date = differ(0, event)
      // console.log(event.dateFormat)
      this.getDate(date.dateFormat)
    },

    // parseTime(date) {
    //   return `${date.getFullYear()}年${date.getMonth() + 1}月`
    // },
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

      // console.log(_date.getMonth(), this.defaultDate.getMonth())

      if (_date.getMonth() !== this.defaultDate.getMonth()) {
        queryDateList(DateFormat(_date, 'yyyy-MM-dd')).then(res => {
          // console.log(res.data)
          this.markDate[0]['date'] = res.data.data || []
        })
      }

      this.defaultDate = _date

      this.$nextTick(() => {
        this.getDate(DateFormat(this.defaultDate, 'yyyy-MM-dd'))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

  .course-list {
    padding: 0 12px 0 12px;

    .course-item {
      margin-bottom: 12px;
      background: #fff;
      border-radius: 6px;
      padding: 22px;

      .course-title {
        font-size: 14px;
        padding-left: 10px;
        position: relative;
        color: #222;
        margin-bottom: 15px;
        text-align: left;

        &:after {
          width: 4px;
          height: 4px;
          background: $theme;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(0, -50%);
          content: '';
          display: block;
          border-radius: 50%;
        }
      }

      .course-plan {
        margin-left: 10px;
        background: #FAFAFA;
        border-radius: 6px;
        padding: 12px 12px;
        text-align: left;
        color: #999999;
        font-size: 14px;
        line-height: 36px;

        span {
          color: #222;
        }
      }
    }
  }

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

  .calendar {
    margin: 12px;
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
}
</style>
