<template>
  <div class="holidaySetup">
    <div class="tipsBox">
      <el-alert
        type="warning"
        :closable="false"
      >
        周六日为休息日，可根据实际需求修改休息日
      </el-alert>
    </div>
    <div class="tableArea">
      <etm-calendar v-model="currentDate">
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <div
            :class="['calendar-box']"
            @click.stop="changeDay(data)"
          >
            <div class="calendar-day">
              {{ month(data) }}-{{ day(data) }}
            </div>
            <template>
              <div class="current-day">
                <div class="remarks">
                  {{ getArrange(data).offFlag ? '休息' : '' }}
                </div>
              </div>
            </template>
          </div>
        </template>
      </etm-calendar>
    </div>
  </div>
</template>

<script>
import EtmCalendar from '../component/EtmCalendar'
import {
  queryVacationLists,
  createTriggerVacation
} from '@/api/newDaycare/nurseSchedule'
import { parseTime } from '@/utils'
let trigger = ''

export default {
  components: {
    EtmCalendar
  },
  data () {
    return {
      currentDate: new Date(),
      calendarData: []
    }
  },
  watch: {
    currentDate (value) {
      this.init(new Date(value).getTime())
    }
  },
  created () {
    this.init(this.currentDate)
  },
  methods: {
    getArrange (date) {
      return this.calendarData[date.day] || {
        offFlag: 0,
        date: ''
      }
    },
    init (date) {
      const _date = parseTime(date, '{y}-{m}-{d}')

      queryVacationLists(_date).then(res => {
        const _result = {}
        const _allData = Object.keys(res.data).reduce((arr, cur) => {
          return arr.concat(res.data[cur])
        }, [])

        _allData.forEach(cur => {
          const _date = parseTime(cur.date, '{y}-{m}-{d}')
          _result[_date] = cur
        })

        this.calendarData = _result
      })
    },
    month (data) {
      try {
        return data.day.split('-')[1]
      } catch (e) {
        return '-'
      }
    },
    day (data) {
      try {
        return data.day.split('-')[2]
      } catch (e) {
        return '-'
      }
    },
    changeDay (data) {
      clearTimeout(trigger)

      trigger = setTimeout(() => {
        const _currDate = this.calendarData[data.day]
        createTriggerVacation({ date: data.day, offFlag: !_currDate.offFlag }).then(res => {
          this.$message.success('操作成功')
          this.calendarData[data.day].offFlag = !_currDate.offFlag
        })
      }, 300)
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

  ::v-deep .etm-calendar-wrap {
    flex: 1;
    overflow: auto;

    .el-calendar__header,
    .el-calendar__body {
      padding-left: 0;
      padding-right: 0;
    }

    .el-calendar-day {
      min-height: 150px;
    }

    .calendar-box {
      padding: 10px;

      .current-day {
        display: flex;
        flex-direction: column;
        min-height: 100px;

        .remarks {
          align-items: center;
          display: flex;
          flex: 1;
          justify-content: center;
        }
      }

      &:hover {
        @include etm-color();
      }
    }
  }
}
</style>
