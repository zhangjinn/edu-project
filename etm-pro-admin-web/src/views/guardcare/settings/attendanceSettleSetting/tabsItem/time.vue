<template>
  <div class="holidaySetup">
    <div class="tipsBox">
      <el-alert type="warning" :closable="false">周六日为休息日，可根据实际需求修改休息日</el-alert>
    </div>
    <div class="tableArea">
      <etm-calendar v-model="currentDate">
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <div
            :class="[
              'calendar-box',
            ]"
            @click="changeDay(data)"
          >
            <div class="calendar-day">{{ month(data) }}-{{ day(data) }}</div>
            <template v-for="(item, index) of calendarData">
              <template v-if="getMonthDate(item.date, 'month') === month(data)">
                <div v-if="getMonthDate(item.date, 'date') === day(data)" :key="index" class="current-day">
                  <div v-if="item.remarks || item.isHoliday" class="remarks">{{ item.remarks || '休息' }}</div>
                </div>
              </template>
            </template>
          </div>
        </template>
      </etm-calendar>
    </div>
  </div>
</template>

<script>
import EtmCalendar from '@/views/neuroo/edu/courseManage/components/EtmCalendar'
import { getStartDateAndEndDateByMonth } from '@/utils/date'
import { getAttendanceCalendar, renewAttendanceCalendar } from '@/api/guardcare/financeManage/attendanceSettleSetting'
import { parseTime } from '@/utils'

export default {
  components: {
    EtmCalendar
  },
  data() {
    return {
      currentDate: new Date(),
      calendarData: []
    }
  },
  watch: {
    currentDate(value) {
      const { startDate, endDate } = getStartDateAndEndDateByMonth(new Date(value).getMonth() + 1)
      const param = {
        startDate: startDate,
        endDate: endDate
      }
      getAttendanceCalendar(param).then(res => {
        this.calendarData = res.data
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { startDate, endDate } = getStartDateAndEndDateByMonth(new Date(this.currentDate).getMonth() + 1)
      const param = {
        startDate: startDate,
        endDate: endDate
      }
      getAttendanceCalendar(param).then(res => {
        this.calendarData = res.data
      })
    },
    getMonthDate(date, type) {
      if (type === 'month') {
        return parseTime(date, '{m}')
      } else if (type === 'date') {
        return parseTime(date, '{d}')
      }
    },
    month(data) {
      try {
        return data.day.split('-')[1]
      } catch (e) {
        return '-'
      }
    },
    day(data) {
      try {
        return data.day.split('-')[2]
      } catch (e) {
        return '-'
      }
    },
    changeDay(data) {
      const result = this.calendarData.find(item => {
        return parseTime(item.date, '{y}-{m}-{d}') === data.day
      })
      let text = ''
      if (result.date < new Date().getTime()) {
        text = '当前日期已有考勤记录，修改会造成考勤数据变动，请慎重修改！'
      } else {
        text = '修改后，当月幼儿的应出勤天数会变动，是否继续操作？'
      }
      this.$etmTip.init({
        type: 'warn',
        title: `确定修改休息日？`,
        content: text,
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          renewAttendanceCalendar({ isHoliday: !result.isHoliday, date: data.day, remarks: '' }).then(() => {
            this.$message.success('操作成功')
            this.init()
          })
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style lang="scss" scoped>
.holidaySetup {
  .tipsBox {
    display: inline-block;
    padding-bottom: 16px;
  }

  & /deep/ .etm-calendar-wrap {
    flex: 1;
    overflow: auto;

    .el-calendar__header, .el-calendar__body {
      padding-left: 0;
      padding-right: 0;
    }

    .el-calendar-day {
      min-height: 150px;
    }

    .calendar-box {
      padding: 10px;

      .current-day {
        min-height: 100px;
        display: flex;
        flex-direction: column;

        .remarks {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &:hover {
        @include c_main_color();
      }
    }
  }
}
</style>
