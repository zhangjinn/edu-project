<template>
  <div class="etm-calendar-wrap">
    <div v-if="$slots.header" class="etm-calendar-header">
      <slot name="header" />
    </div>
    <el-calendar :value="value" @input="$emit('input', $event)">
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
    height: auto;
    max-height: 100%;
    background-color: #fff;
    position: relative;

    .etm-calendar-header {
      width: 50%;
      position: absolute;
      left: 130px;
      top: 4px;
      background-color: inherit;
      font-size: 14px;
      @include c_title_color();
    }

    & /deep/ .el-calendar {
      height: 100%;
      display: flex;
      flex-direction: column;

      .el-calendar__header, .el-calendar__body {
        padding-left: 24px;
        padding-right: 24px;
      }

      .el-calendar__header {
        border-bottom: none;
        /*padding-top: 16px;*/
        /*padding-bottom: 16px;*/
        padding: 0 0 16px;

        .el-calendar__title {
          margin-right: 16px;
          @include c_title_color();
        }
      }

      .el-calendar__body {
        flex: 1;
        //noinspection CssInvalidPropertyValue
        @supports (overflow: overlay) {
          overflow: overlay
        };
        /*padding: 0 24px;*/
        padding: 0;
        margin-bottom: 16px;

        .el-calendar-table {
          thead {
            background-color: #f7f7f7;

            th {
              padding: 8px 0;
            }
          }
        }

        .el-calendar-day {
          padding: 0;
          user-select: none;
          &:hover{
            cursor: default;
          }
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
