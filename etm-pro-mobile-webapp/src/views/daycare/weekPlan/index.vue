<template>
  <div class="index-wrap">
    <setting-title>
      <van-dropdown-menu>
        <van-dropdown-item v-model="semester" :options="semesterList" />
      </van-dropdown-menu>
    </setting-title>

    <div class="canlendarTool">
      <div @click="showPicker = true">
        {{ parseTime(currentMonthDay) }}
        <van-icon name="arrow-down" />
      </div>
      <div class="canlendarChangeTools">
        <div class="prev" @click="changeWeekly(-1)">
          <van-icon name="arrow-left" />
          上一周
        </div>
        <div class="current" @click="changeWeekly(0)">本周</div>
        <div class="next" @click="changeWeekly(1)">下一周
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class="calendar">
      <vue-hash-calendar
        ref="calendar"
        :visible.sync="isShowCalendar"
        :is-show-week-view="true"
        :disabled-week-view="false"
        :default-datetime="defaultDate"
        :mark-date="markDate"
        :disabled-scroll="true"
        @click="calendarClick"
      >
        <template v-slot:day="row">
          <div v-if="row.extendAttr.isToday">今</div>
          <div v-else>{{ row.date.day }}</div>
        </template>
      </vue-hash-calendar>
    </div>
    <no-content v-if="!list.length" message="当天没有课程记录~" type="none" />
    <schedule-list v-else type="image" :icon="require('@/assets/images/schedule.png')">
      <div v-for="(item, index) in list" :key="index" class="schedule-item">
        <p>{{ item.startTime }} ~ {{ item.endTime }}</p>
        <div><span>{{ item.scheduleContent }} {{ item.remark ? ':' : '' }} {{ item.remark }}</span></div>
      </div>
    </schedule-list>

    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title=""
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="datetimeConfirm"
        @cancel="datetimeCancel"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/10/19 18:18
 */
import settingTitle from '@/views/daycare/weekPlan/components/settingTitle'
import noContent from '@/components/common/noContent'
import scheduleList from '@/views/daycare/weekPlan/components/scheduleList'
import { queryCaeClazz, queryWeekDate, queryWeekPlan } from '@/service/daycare/courseTime'
import { DateFormat } from '@/js/rules'

export default {
  name: 'Index',
  components: {
    settingTitle,
    noContent,
    scheduleList
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      currentMonthDay: new Date(),
      list: [],
      // 一周选择
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      // 日历
      isShowCalendar: true,
      markDate: [
        {
          color: '#10C2C4',
          date: []
        }
      ],
      defaultDate: new Date(),
      // 头部
      semester: '',
      semesterList: []
    }
  },
  computed: {},
  watch: {
    currentMonthDay: {
      handler(n) {
        this.getMonthDate()
        this.getWeekPlan()
      }
    },
    semester: {
      immediate: false,
      handler(n) {
        this.getWeekPlan()
        this.getMonthDate()
      }
    }
  },
  created() {
    queryCaeClazz('').then(res => {
      this.semesterList = res.data.data.map((cur, index) => {
        if (index === 0) {
          this.semester = cur.caeClazzId
        }
        return {
          text: cur.caeClazzName,
          value: cur.caeClazzId
        }
      })

      this.$nextTick(() => {
        this.getMonthDate()
      })
    })
  },
  mounted() {
  },
  methods: {

    // changeDate(event) {
    //   console.log(event, this.defaultDate)
    //   if (event.getMonth() !== this.defaultDate.getMonth()) {
    //     this.defaultDate = event
    //     this.$nextTick(() => {
    //       this.getMonthDate()
    //     })
    //   }
    // },
    calendarClick(event) {
      this.defaultDate = event

      this.$nextTick(() => {
        // this.getMonthDate()
        this.getWeekPlan()
      })
    },
    getWeekPlan() {
      queryWeekPlan({
        date: DateFormat(this.defaultDate, 'yyyy-MM-dd'),
        clazzId: this.semester
      }).then(res => {
        this.list = res.data.data
      })
    },
    getMonthDate() {
      queryWeekDate({
        date: DateFormat(this.defaultDate, 'yyyy-MM-dd'),
        clazzId: this.semester
      }).then(res => {
        this.markDate[0]['date'] = res.data.data
      })
    },
    datetimeConfirm(event) {
      // console.log(event)
      this.showPicker = false
      this.currentMonthDay = event

      this.defaultDate = event
    },
    datetimeCancel() {
      this.showPicker = false
    },
    parseTime(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`
    },
    changeWeekly(step) {
      const currentDay = this.defaultDate.getTime()
      const aWeeklay = 24 * 3600 * 1000 * 7
      let newDate = 0
      if (step) {
        newDate = new Date(currentDay + step * aWeeklay)
      } else {
        newDate = new Date()
      }

      if (newDate.getMonth() !== this.defaultDate.getMonth()) {
        this.defaultDate = newDate
        this.$nextTick(() => {
          this.getMonthDate()
        })
      } else {
        this.defaultDate = newDate
      }

      this.$nextTick(() => {
        this.getWeekPlan()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .schedule-item {
    p {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 12px;
    }

    span {
      color: #999;
    }
  }
  .canlendarTool {
    height: 61px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 0 13px;
    border-bottom: 1px solid #eee;

    .canlendarChangeTools {
      font-size: 12px;
      color: #999;
      align-items: center;
      display: flex;

      i {
        display: inline-block;
        vertical-align: middle;
      }

      .current {
        font-size: 16px;
        margin: 0 16px;
        color: #222;
      }

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
    padding-bottom: 8px;

    /deep/ .calendar_inline {
      height: 80px !important;

      .calendar_content {
        padding-bottom: 15px;
        height: 80px !important;

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
