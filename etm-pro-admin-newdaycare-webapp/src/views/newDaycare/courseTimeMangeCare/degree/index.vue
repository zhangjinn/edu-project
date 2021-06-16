<template>
  <div class="index-wrap">
    <div class="tableArea">
      <etm-calendar v-model="currentDate">
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <template v-if="hasArrange(data)">
            <div
              v-if="!getArrange(data).offFlag"
              :class="['calendar-box']"
              @click.stop="changeDay(data)"
            >
              <div class="calendar-day">
                {{ month(data) }}-{{ day(data) }}
              </div>
              <p>出勤/请假/在册/总学位</p>
              <p class="calendar-number">
                <!--                {{ getArrange(data).arrangementPositionNum }}/-->
                {{ getArrange(data).attendPositionNum }}/
                {{ getArrange(data).leavePositionNum }}/
                {{ getArrange(data).inBookPositionNum }}/
                {{ getArrange(data).totalPositionNum }}
              </p>
            </div>

            <div
              v-else
              :class="['calendar-box', 'xiuxi']"
              @click.stop=""
            >
              <div class="calendar-day">
                {{ month(data) }}-{{ day(data) }}
              </div>
              <div class="current-day">
                休息
              </div>
            </div>
          </template>
          <template v-else>
            <div
              :class="['calendar-box']"
              @click.stop=""
            >
              <div class="calendar-day">
                {{ month(data) }}-{{ day(data) }}
              </div>
            </div>
          </template>
        </template>
      </etm-calendar>
    </div>

    <degree-detail
      ref="popDetail"
      :props="childProp"
    />
  </div>
</template>

<script>
import degreeDetail from './components/detail'
import EtmCalendar from './components/EtmCalendar'
// import { getStartDateAndEndDateByMonth } from '@/utils/date'
import { parseTime } from '@/utils'
import {
  queryDegree
} from '@/api/newDaycare/nurseSchedule'

export default {
  name: 'Index',
  components: {
    degreeDetail,
    EtmCalendar
  },
  filters: {},
  mixins: [],
  props: {
    props: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      currentDate: new Date(),
      calendarData: [],
      childProp: {}
    }
  },
  computed: {},
  watch: {
    props: {
      immediate: true,
      deep: true,
      handler (n) {
        if (n.date) {
          this.currentDate = new Date(n.date)
        } else {
          this.currentDate = new Date()
        }
      }
    },
    currentDate: {
      immediate: true,
      handler (value) {
        this.init(parseTime(value.getTime(), '{y}-{m}-{d}'))
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    init (date) {
      queryDegree({ date }).then(res => {
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
    hasArrange (date) {
      return this.calendarData[date.day] || false
    },
    getArrange (date) {
      return this.calendarData[date.day] || {
        arrangementPositionNum: 0,
        attendPositionNum: 0,
        inBookPositionNum: 0,
        leavePositionNum: 0,
        totalPositionNum: 0
      }
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
      this.childProp = { day: data.day }

      this.$nextTick(() => {
        this.$refs.popDetail.show()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  margin-top: 0;

  .calendar-day {
    margin-bottom: 16px;
  }

  .xiuxi {
    background: #f6f6f6;
  }

  .calendar-number {
    @include etm-color();
  }

  .tipsBox {
    @include c_secondary_color();
    padding-bottom: 16px;

    .main {
      @include c_error_color();
    }
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
      height: 100%;
      padding: 10px;

      .current-day {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 60px;
      }

      &:hover {
        @include etm-color();
      }
    }
  }
}
</style>
