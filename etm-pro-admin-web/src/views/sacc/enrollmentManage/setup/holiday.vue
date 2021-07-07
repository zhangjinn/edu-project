<template>
  <div class="holidaySetup">
    <etm-title :border="false" :show-line="false">假期设置</etm-title>
    <div class="tableArea">
      <div class="setupSelect">
        设置休息日:
        <el-select v-model="holidayData.holidaySetting" @change="changeHoliday">
          <el-option
            v-for="item in holidayOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="tips">可点击下方日期设置休息或者上课</div>
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
              <template v-if="item.date.split('-')[0] === month(data)">
                <div v-if="item.date.split('-')[1] === day(data)" :key="index" class="current-day">
                  <div v-if="item.remarks || item.holiday" class="remarks">{{ item.remarks || '园区休息' }}</div>
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
import { getHolidayOption, getCalendar, renewCalendar, getHoliday, renewHoliday } from '@/api/sacc/enrollmentManage'

export default {
  components: {
    EtmCalendar
  },
  data() {
    return {
      holidayOptions: [],
      currentDate: new Date(),
      calendarData: [],
      holidayData: {}
    }
  },
  watch: {
    currentDate(value) {
      const { startDate, endDate } = getStartDateAndEndDateByMonth(new Date(value).getMonth() + 1)
      const param = {
        startDate: startDate,
        endDate: endDate
      }
      getCalendar(param).then(res => {
        this.calendarData = res.data
      })
    }
  },
  created() {
    this.getSetup()
    this.init()
  },
  methods: {
    init() {
      const { startDate, endDate } = getStartDateAndEndDateByMonth(new Date(this.currentDate).getMonth() + 1)
      const param = {
        startDate: startDate,
        endDate: endDate
      }
      getCalendar(param).then(res => {
        this.calendarData = res.data
      })
    },
    getSetup() {
      const param = {
        name: 'Holiday'
      }
      getHolidayOption(param).then(res => {
        this.holidayOptions = res.data
      })
      getHoliday().then(res => {
        this.holidayData = res.data
      })
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
    changeHoliday(data) {
      const param = {
        holidaySetting: data
      }
      renewHoliday(this.holidayData.id, param).then(() => {
        this.$message.success('设置成功')
        this.init()
      })
    },
    changeDay(data) {
      const date = data.day.split('-')[1] + '-' + data.day.split('-')[2]
      const result = this.calendarData.find(item => {
        return item.date === date
      })
      renewCalendar({ holiday: !result.holiday, date: data.day, remarks: '' }).then(() => {
        this.$message.success('操作成功')
        this.init()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.holidaySetup{
  .tableArea{
    .el-select{
      margin-left: 10px;
    }
    .tips{
      margin-top: 16px;
      @include c_warn_color();
    }
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
