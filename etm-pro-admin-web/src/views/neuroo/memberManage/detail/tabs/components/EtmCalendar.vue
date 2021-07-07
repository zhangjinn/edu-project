<template>
  <div class="etm-calendar-wrap">
    <el-calendar @input="$emit('input', $event)">
      <slot
        slot="dateCell"
        slot-scope="{date, data}"
        name="dateCell"
        :date="date"
        :data="data"
      />
    </el-calendar>
  </div>
</template>
<script>
export default {
  name: 'EtmCalendar',
  props: {
    value: {}
  },
  methods: {
    isWeekEnd(date) {
      const weekDay = new Date(date).getDay()
      return [0, 6].includes(weekDay)
    },
    isPreMonth(date, data) {
      return data.type === 'prev-month'
    },
    isCurrentMonth(date, data) {
      return data.type === 'current-month'
    },
    isNextMonth(date, data) {
      return data.type === 'next-month'
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .etm-calendar-wrap {
    height: 100%;
    background-color: #fff;

    & /deep/ .el-calendar {
      height: 100%;
      display: flex;
      flex-direction: column;

      .el-calendar__header, .el-calendar__body {
        /*padding-left: 24px;*/
        /*padding-right: 24px;*/
      }

      .el-calendar__header {
        justify-content: flex-end;
        border-bottom: none;
        /*padding-top: 16px;*/
        padding:0 0 16px;

        .el-calendar__title {
          margin-right: 16px;
        }
      }

      .el-calendar__body {
        flex: 1;
        overflow: auto;
        padding: 0;

        thead {
          background-color: #f7f7f7;
        }

        .el-calendar-day {
          padding: 0;
          user-select: none;
        }
      }

      .prev, .next {
        pointer-events: none;
        background-color: #fbfbfb;

        > * {
          display: none;
        }
      }
    }
  }
</style>
